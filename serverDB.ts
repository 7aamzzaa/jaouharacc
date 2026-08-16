import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { Product, Order, ContactMessage, Subscriber, Review } from './src/types';
import { defaultProducts } from './src/data/defaultProducts';

// ------------------------------------------------------------------------
// In-process async lock (serializes order/stock read-modify-write commits)
// ------------------------------------------------------------------------
let lockChain: Promise<unknown> = Promise.resolve();

export function withOrderLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = lockChain.then(fn, fn);
  lockChain = run.catch(() => {});
  return run;
}

// Setup local fallback directory and file paths
const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'subscribers.json');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');

// Ensure fallback database files are initialized
function initializeLocalDB() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(PRODUCTS_FILE)) {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(defaultProducts, null, 2), 'utf-8');
    console.log('[DB] Local products database initialized with default luxury catalog');
  }
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), 'utf-8');
    console.log('[DB] Local orders database initialized empty');
  }
  if (!fs.existsSync(MESSAGES_FILE)) {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify([], null, 2), 'utf-8');
    console.log('[DB] Local messages database initialized empty');
  }
  if (!fs.existsSync(SUBSCRIBERS_FILE)) {
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify([], null, 2), 'utf-8');
    console.log('[DB] Local subscribers database initialized empty');
  }
  if (!fs.existsSync(REVIEWS_FILE)) {
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify([], null, 2), 'utf-8');
    console.log('[DB] Local reviews database initialized empty');
  }
}

initializeLocalDB();

// Initialize Supabase Client if env variables are set
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const isSupabaseConnected = !!(supabaseUrl && supabaseServiceKey);

let supabase: any = null;
if (isSupabaseConnected) {
  try {
    supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false
      }
    });
    console.log('[DB] Robust Supabase service client initialized successfully.');
  } catch (err) {
    console.error('[DB] Failed to initialize Supabase client:', err);
  }
} else {
  console.log('[DB] Warning: SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY missing. Operating in fallback local-disk state.');
}

// Single source of truth: when Supabase is configured it is authoritative and
// the local JSON files act as a write-through mirror/backup only. When it is
// not configured, the app runs entirely on the local disk store.
export const supabaseMode = isSupabaseConnected && !!supabase;

// Best-effort mirror: snapshot the authoritative Supabase tables to the local
// JSON files so a read can safely fall back during a Supabase outage without
// ever serving data that diverges from what Supabase acknowledged as written.
async function mirrorProductsToDisk(): Promise<void> {
  if (!supabaseMode || !supabase) return;
  try {
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true });
    if (error) throw error;
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data ?? [], null, 2), 'utf-8');
  } catch (err: any) {
    console.warn('[DB] Failed to refresh products disk mirror:', err?.message || err);
  }
}

async function mirrorOrdersToDisk(): Promise<void> {
  if (!supabaseMode || !supabase) return;
  try {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(data ?? [], null, 2), 'utf-8');
  } catch (err: any) {
    console.warn('[DB] Failed to refresh orders disk mirror:', err?.message || err);
  }
}

// Auto-seed Supabase database table 'products' if connected and empty
export async function seedProductsIfEmpty() {
  if (!supabaseMode) return;
  if (process.env.NODE_ENV === 'production') return;
  try {
    console.log('[DB] Querying products table to check if seeding is needed...');
    const { data, error } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    if (error) {
      console.error('[DB Seeding Error] Could not query "products" table. Does it exist in Supabase? Details:', error.message);
      return;
    }

    if (!data || data.length === 0) {
      console.log('[DB Seeding] Supabase "products" table is empty. Inserting default products...');
      const { error: insertError } = await supabase
        .from('products')
        .insert(defaultProducts);

      if (insertError) {
        console.error('[DB Seeding Error] Failed to insert default luxury products:', insertError.message);
      } else {
        console.log('[DB Seeding Success] Default products database successfully seeded in Supabase!');
      }
    } else {
      console.log('[DB Seeding] Products already exist in Supabase.');
    }
  } catch (err: any) {
    console.error('[DB Seeding Warning] Error during auto-setup check:', err.message);
  }
}

// Call seed verification on startup, then refresh the local JSON mirror so it
// stays an accurate backup of the authoritative store while Supabase is up.
seedProductsIfEmpty()
  .then(() => {
    if (supabaseMode) {
      return Promise.all([mirrorProductsToDisk(), mirrorOrdersToDisk()]);
    }
  })
  .catch(err => {
    console.warn('[DB] Startup mirror refresh failed:', err?.message || err);
  });

// ------------------------------------------------------------------------
// Get Supabase Client Instance (for external storage upload)
// ------------------------------------------------------------------------
export function getSupabaseClient() {
  return supabase;
}

// ------------------------------------------------------------------------
// Products DB Access Handlers
// ------------------------------------------------------------------------

export async function getProducts(): Promise<Product[]> {
  if (isSupabaseConnected && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });
      if (!error && data) {
        return data as Product[];
      }
      console.warn('[DB] Supabase product query protocol failed. Retrying with local disk backup.', error);
    } catch (err) {
      console.warn('[DB] Supabase products fetch error:', err);
    }
  }

  // Fallback DB Load
  try {
    const fileContent = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(fileContent) as Product[];
  } catch (err) {
    console.error('[DB] Failed to read fallback products json', err);
    return defaultProducts;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  if (isSupabaseConnected && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (!error && data) {
        return data as Product;
      }
    } catch (err) {
      console.warn('[DB] Supabase find product by ID error:', err);
    }
  }
  const products = await getProducts();
  return products.find(p => p.id === id) || null;
}

export async function upsertProduct(product: Product): Promise<Product> {
  if (supabaseMode) {
    try {
      const { data, error } = await supabase
        .from('products')
        .upsert({ ...product })
        .select()
        .single();
      if (error) throw new Error(error?.message || 'Supabase write failure');
      await mirrorProductsToDisk();
      return data as Product;
    } catch (err: any) {
      // Fail loudly instead of silently writing only to disk: reads still
      // query Supabase first, so a disk-only write would create split-brain.
      console.error('[DB] Supabase product write failed. Not silently falling back to disk:', err?.message || err);
      throw new Error('Product save failed: ' + (err?.message || err));
    }
  }

  // Local-only mode (Supabase not configured): disk persistence
  const products = await getProducts();
  const index = products.findIndex(p => p.id === product.id);
  if (index !== -1) {
    products[index] = product;
  } else {
    if (!product.id) {
      product.id = 'prod-' + Date.now();
    }
    products.push(product);
  }

  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
  return product;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (supabaseMode) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (error) throw new Error(error.message);
      await mirrorProductsToDisk();
      return true;
    } catch (err: any) {
      console.error('[DB] Supabase product delete failed. Not silently falling back to disk:', err?.message || err);
      throw new Error('Product delete failed: ' + (err?.message || err));
    }
  }

  // Local-only mode (Supabase not configured): disk persistence
  const products = await getProducts();
  const filtered = products.filter(p => p.id !== id);
  if (products.length === filtered.length) {
    return false;
  }
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  return true;
}

// ------------------------------------------------------------------------
// Orders DB Access Handlers
// ------------------------------------------------------------------------

export async function getOrders(): Promise<Order[]> {
  if (isSupabaseConnected && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        return data as Order[];
      }
      console.warn('[DB] Supabase orders fetch query failed:', error);
    } catch (err) {
      console.warn('[DB] Supabase order query error:', err);
    }
  }

  // Fallback DB Load
  try {
    const fileContent = fs.readFileSync(ORDERS_FILE, 'utf-8');
    return JSON.parse(fileContent) as Order[];
  } catch (err) {
    console.error('[DB] Failed to read fallback orders json', err);
    return [];
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (isSupabaseConnected && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (!error && data) {
        return data as Order;
      }
    } catch (err) {
      console.warn('[DB] Supabase get order ID query failure:', err);
    }
  }
  const orders = await getOrders();
  return orders.find(o => o.id === id) || null;
}

export async function getOrderByIdempotencyKey(key: string): Promise<Order | null> {
  if (isSupabaseConnected && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('idempotency_key', key)
        .maybeSingle();
      if (!error && data) {
        return data as Order;
      }
    } catch (err) {
      console.warn('[DB] Supabase get order by idempotency key query failure:', err);
    }
  }
  const orders = await getOrders();
  return orders.find(o => o.idempotency_key === key) || null;
}

export async function createOrder(orderData: Omit<Order, 'created_at' | 'status'> & { status?: Order['status'] }): Promise<Order> {
  const newOrder: Order = {
    ...orderData,
    status: orderData.status || 'pending',
    created_at: new Date().toISOString()
  };

  if (supabaseMode) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert(newOrder)
        .select()
        .single();
      if (error) throw new Error(error?.message || 'Supabase order write failed');
      await mirrorOrdersToDisk();
      return data as Order;
    } catch (err: any) {
      // Fail loudly instead of silently persisting only to disk: the order
      // would be invisible to Supabase-first reads (split-brain). The caller
      // (server.ts) already restores reserved stock when this throws.
      console.error('[DB] Supabase order write failed. Not silently persisting to disk:', err?.message || err);
      throw new Error('Order registration failed: ' + (err?.message || err));
    }
  }

  // Local-only mode (Supabase not configured): disk persistence
  const orders = await getOrders();
  // Check if order already saved locally to avoid duplicates
  if (!orders.some(o => o.id === newOrder.id)) {
    orders.unshift(newOrder);
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  }

  return newOrder;
}

// ------------------------------------------------------------------------
// Atomic order + stock RPC (Supabase mode only)
// ------------------------------------------------------------------------

// Replace the read-stock -> decrement -> create -> restore sequence with one
// atomic server-side transaction. The RPC checks idempotency first, validates
// and decrements stock under row locks (never clamping to zero), and inserts
// the order only after every stock check passes. Any failure aborts the whole
// transaction, so no partial stock decrement can be observed.
//
// Error contract for the API layer:
//   * SQLSTATE 'CC409' (insufficient stock) is re-thrown as an Error carrying
//     `isInsufficientStock = true` so server.ts can map it to HTTP 409.
//   * every other failure rejects with a generic, customer-safe message (raw
//     details are logged server-side only). There is NO silent fallback to the
//     local JSON store while Supabase is active.
export async function createOrderWithStock(orderData: Omit<Order, 'created_at' | 'status'> & { status?: Order['status'] }): Promise<Order> {
  if (!supabaseMode || !supabase) {
    throw new Error('createOrderWithStock requires Supabase mode');
  }

  try {
    const { data, error } = await supabase.rpc('create_order_with_stock', {
      p_id: orderData.id,
      p_customer_name: orderData.customer_name,
      p_customer_phone: orderData.customer_phone,
      p_customer_email: orderData.customer_email,
      p_customer_country: orderData.customer_country,
      p_customer_city: orderData.customer_city,
      p_customer_street: orderData.customer_street,
      p_customer_apartment: orderData.customer_apartment ?? null,
      p_payment_method: orderData.payment_method,
      p_order_notes: orderData.order_notes ?? null,
      p_items: orderData.items,
      p_subtotal: orderData.subtotal,
      p_shipping_cost: orderData.shipping_cost,
      p_discount_amount: orderData.discount_amount,
      p_discount_code: orderData.discount_code ?? null,
      p_total: orderData.total,
      p_idempotency_key: orderData.idempotency_key ?? null,
      p_status: orderData.status || 'pending'
    });

    if (error) {
      if (error.code === 'CC409') {
        const insufficient: any = new Error('Insufficient stock for one or more items');
        insufficient.isInsufficientStock = true;
        throw insufficient;
      }
      throw new Error(error?.message || 'Supabase order RPC failed');
    }

    await mirrorOrdersToDisk();
    return data as Order;
  } catch (err: any) {
    if (err && err.isInsufficientStock) throw err;
    console.error('[DB] Supabase order RPC failed. Not silently falling back to disk:', err?.message || err);
    throw new Error('Order registration failed');
  }
}

// ------------------------------------------------------------------------
// Authoritative stock commit helpers
// ------------------------------------------------------------------------

// Get the current stock level for a product (authoritative read).
export async function getProductStock(id: string): Promise<number> {
  const product = await getProductById(id);
  return product && typeof product.stock === 'number' ? product.stock : 0;
}

// Atomically (within the process) decrement a product's stock by qty.
// The caller MUST hold the order lock and MUST have verified stock >= qty.
// Returns true on success, false if the product is missing.
export async function decrementProductStock(id: string, qty: number): Promise<boolean> {
  const product = await getProductById(id);
  if (!product) return false;
  const newStock = Math.max(0, (typeof product.stock === 'number' ? product.stock : 0) - qty);
  const updated = { ...product, stock: newStock };
  await upsertProduct(updated);
  return true;
}

// Compensating rollback: restore qty units to a product's stock.
// Only used when an order persisted AFTER a stock decrement fails to write.
export async function restoreProductStock(id: string, qty: number): Promise<void> {
  const product = await getProductById(id);
  if (!product) return;
  const currentStock = typeof product.stock === 'number' ? product.stock : 0;
  const updated = { ...product, stock: currentStock + qty };
  await upsertProduct(updated);
}

export async function deleteOrder(id: string): Promise<boolean> {
  if (supabaseMode) {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);
      if (error) throw new Error(error.message);
      await mirrorOrdersToDisk();
      return true;
    } catch (err: any) {
      console.error('[DB] Supabase order delete failed. Not silently falling back to disk:', err?.message || err);
      throw new Error('Order delete failed: ' + (err?.message || err));
    }
  }

  const orders = await getOrders();
  const filtered = orders.filter(o => o.id !== id);
  if (orders.length === filtered.length) return false;
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  return true;
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
  if (supabaseMode) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      if (error) {
        if (error.code === 'PGRST116') return null; // row not found -> 404
        throw new Error(error?.message || 'Supabase order update failed');
      }
      await mirrorOrdersToDisk();
      return data as Order;
    } catch (err: any) {
      console.error('[DB] Supabase order status update failed. Not silently falling back to disk:', err?.message || err);
      throw new Error('Order status update failed: ' + (err?.message || err));
    }
  }

  const orders = await getOrders();
  const orderIndex = orders.findIndex(o => o.id === id);
  if (orderIndex === -1) {
    return null;
  }
  orders[orderIndex].status = status;
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  return orders[orderIndex];
}

// ------------------------------------------------------------------------
// snake_case <-> camelCase mapping helpers
// Reviews, messages and subscribers are stored with snake_case columns (see
// supabase/migrations) while the application works with camelCase shapes.
// These small helpers translate at the serverDB <-> Supabase boundary.
// ------------------------------------------------------------------------

interface ReviewDbRow {
  id: string;
  product_id: string;
  customer_name: string;
  customer_email?: string | null;
  rating: number;
  comment: string;
  created_at: string;
  status: Review['status'];
}

interface MessageDbRow {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
  status: ContactMessage['status'];
}

interface SubscriberDbRow {
  id: string;
  email: string;
  created_at: string;
  status: Subscriber['status'];
}

function reviewFromDb(row: ReviewDbRow): Review {
  return {
    id: row.id,
    product_id: row.product_id,
    customerName: row.customer_name,
    customerEmail: row.customer_email ?? undefined,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at,
    status: row.status
  };
}

function reviewToDb(review: Review): ReviewDbRow {
  return {
    id: review.id,
    product_id: review.product_id,
    customer_name: review.customerName,
    customer_email: review.customerEmail ?? null,
    rating: review.rating,
    comment: review.comment,
    created_at: review.createdAt,
    status: review.status
  };
}

function messageFromDb(row: MessageDbRow): ContactMessage {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    subject: row.subject,
    message: row.message,
    createdAt: row.created_at,
    status: row.status
  };
}

function messageToDb(message: ContactMessage): MessageDbRow {
  return {
    id: message.id,
    full_name: message.fullName,
    email: message.email,
    phone: message.phone,
    subject: message.subject,
    message: message.message,
    created_at: message.createdAt,
    status: message.status
  };
}

function subscriberFromDb(row: SubscriberDbRow): Subscriber {
  return {
    id: row.id,
    email: row.email,
    createdAt: row.created_at,
    status: row.status
  };
}

function subscriberToDb(subscriber: Subscriber): SubscriberDbRow {
  return {
    id: subscriber.id,
    email: subscriber.email,
    created_at: subscriber.createdAt,
    status: subscriber.status
  };
}

// ------------------------------------------------------------------------
// Messages DB Access Handlers
// ------------------------------------------------------------------------

export async function getMessages(): Promise<ContactMessage[]> {
  if (supabaseMode) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw new Error(error?.message || 'Supabase messages fetch failed');
      return (data as any[]).map(messageFromDb);
    } catch (err: any) {
      console.error('[DB] Supabase messages fetch failed. Not silently falling back to disk:', err?.message || err);
      throw new Error('Failed to load messages: ' + (err?.message || err));
    }
  }

  try {
    const fileContent = fs.readFileSync(MESSAGES_FILE, 'utf-8');
    return JSON.parse(fileContent) as ContactMessage[];
  } catch (err) {
    console.error('[DB] Failed to read fallback messages json', err);
    return [];
  }
}

export async function createMessage(msgData: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): Promise<ContactMessage> {
  const newMsg: ContactMessage = {
    ...msgData,
    id: 'MSG-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
    createdAt: new Date().toISOString(),
    status: 'new'
  };

  if (supabaseMode) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert(messageToDb(newMsg))
        .select()
        .single();
      if (error) throw new Error(error?.message || 'Supabase message write failed');
      return messageFromDb(data);
    } catch (err: any) {
      console.error('[DB] Supabase message write failed. Not silently falling back to disk:', err?.message || err);
      throw new Error('Message save failed: ' + (err?.message || err));
    }
  }

  const messages = await getMessages();
  messages.unshift(newMsg);
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
  return newMsg;
}

export async function updateMessageStatus(id: string, status: 'new' | 'read'): Promise<ContactMessage | null> {
  if (supabaseMode) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      if (error) {
        if (error.code === 'PGRST116') return null;
        throw new Error(error?.message || 'Supabase message update failed');
      }
      return messageFromDb(data);
    } catch (err: any) {
      console.error('[DB] Supabase message status update failed. Not silently falling back to disk:', err?.message || err);
      throw new Error('Message status update failed: ' + (err?.message || err));
    }
  }

  const messages = await getMessages();
  const idx = messages.findIndex(m => m.id === id);
  if (idx === -1) return null;
  messages[idx].status = status;
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
  return messages[idx];
}

export async function deleteMessage(id: string): Promise<boolean> {
  if (supabaseMode) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id)
        .select('id');
      if (error) throw new Error(error.message);
      if (!data || data.length === 0) return false;
      return true;
    } catch (err: any) {
      console.error('[DB] Supabase message delete failed. Not silently falling back to disk:', err?.message || err);
      throw new Error('Message delete failed: ' + (err?.message || err));
    }
  }

  const messages = await getMessages();
  const filtered = messages.filter(m => m.id !== id);
  if (messages.length === filtered.length) return false;
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  return true;
}

// ------------------------------------------------------------------------
// Newsletter Subscribers DB Access Handlers
// ------------------------------------------------------------------------

export async function getSubscribers(): Promise<Subscriber[]> {
  if (supabaseMode) {
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw new Error(error?.message || 'Supabase subscribers fetch failed');
      return (data as any[]).map(subscriberFromDb);
    } catch (err: any) {
      console.error('[DB] Supabase subscribers fetch failed. Not silently falling back to disk:', err?.message || err);
      throw new Error('Failed to load subscribers: ' + (err?.message || err));
    }
  }

  try {
    const fileContent = fs.readFileSync(SUBSCRIBERS_FILE, 'utf-8');
    return JSON.parse(fileContent) as Subscriber[];
  } catch (err) {
    console.error('[DB] Failed to read fallback subscribers json', err);
    return [];
  }
}

export async function createSubscriber(email: string): Promise<Subscriber | null> {
  const newSub: Subscriber = {
    id: 'SUB-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
    email,
    createdAt: new Date().toISOString(),
    status: 'active'
  };

  if (supabaseMode) {
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .insert(subscriberToDb(newSub))
        .select()
        .single();
      if (error) {
        if (error.code === '23505') return null;
        throw new Error(error?.message || 'Supabase subscriber write failed');
      }
      return subscriberFromDb(data);
    } catch (err: any) {
      if (err?.code === '23505' || err?.message?.includes('duplicate key')) return null;
      console.error('[DB] Supabase subscriber write failed. Not silently falling back to disk:', err?.message || err);
      throw new Error('Subscriber save failed: ' + (err?.message || err));
    }
  }

  const subscribers = await getSubscribers();
  const existing = subscribers.find(s => s.email.toLowerCase() === email.toLowerCase());
  if (existing) return null;

  subscribers.unshift(newSub);
  fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2), 'utf-8');
  return newSub;
}

export async function deleteSubscriber(id: string): Promise<boolean> {
  if (supabaseMode) {
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .delete()
        .eq('id', id)
        .select('id');
      if (error) throw new Error(error.message);
      if (!data || data.length === 0) return false;
      return true;
    } catch (err: any) {
      console.error('[DB] Supabase subscriber delete failed. Not silently falling back to disk:', err?.message || err);
      throw new Error('Subscriber delete failed: ' + (err?.message || err));
    }
  }

  const subscribers = await getSubscribers();
  const filtered = subscribers.filter(s => s.id !== id);
  if (subscribers.length === filtered.length) return false;
  fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  return true;
}

// ------------------------------------------------------------------------
// Reviews DB Access Handlers
// ------------------------------------------------------------------------

export async function getReviews(): Promise<Review[]> {
  if (supabaseMode) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw new Error(error?.message || 'Supabase reviews fetch failed');
      return (data as any[]).map(reviewFromDb);
    } catch (err: any) {
      console.error('[DB] Supabase reviews fetch failed. Not silently falling back to disk:', err?.message || err);
      throw new Error('Failed to load reviews: ' + (err?.message || err));
    }
  }

  try {
    const fileContent = fs.readFileSync(REVIEWS_FILE, 'utf-8');
    return JSON.parse(fileContent) as Review[];
  } catch (err) {
    console.error('[DB] Failed to read reviews json', err);
    return [];
  }
}

export async function createReview(data: Omit<Review, 'id' | 'createdAt' | 'status'>): Promise<Review> {
  const newReview: Review = {
    ...data,
    id: 'REV-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
    createdAt: new Date().toISOString(),
    status: 'pending'
  };

  if (supabaseMode) {
    try {
      const { data: created, error } = await supabase
        .from('reviews')
        .insert(reviewToDb(newReview))
        .select()
        .single();
      if (error) throw new Error(error?.message || 'Supabase review write failed');
      return reviewFromDb(created);
    } catch (err: any) {
      console.error('[DB] Supabase review write failed. Not silently falling back to disk:', err?.message || err);
      throw new Error('Review save failed: ' + (err?.message || err));
    }
  }

  const reviews = await getReviews();
  reviews.unshift(newReview);
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2), 'utf-8');
  return newReview;
}

export async function updateReviewStatus(id: string, status: 'approved' | 'rejected'): Promise<Review | null> {
  if (supabaseMode) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      if (error) {
        if (error.code === 'PGRST116') return null;
        throw new Error(error?.message || 'Supabase review update failed');
      }
      return reviewFromDb(data);
    } catch (err: any) {
      console.error('[DB] Supabase review status update failed. Not silently falling back to disk:', err?.message || err);
      throw new Error('Review status update failed: ' + (err?.message || err));
    }
  }

  const reviews = await getReviews();
  const idx = reviews.findIndex(r => r.id === id);
  if (idx === -1) return null;
  reviews[idx].status = status;
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2), 'utf-8');
  return reviews[idx];
}

export async function deleteReview(id: string): Promise<boolean> {
  if (supabaseMode) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id)
        .select('id');
      if (error) throw new Error(error.message);
      if (!data || data.length === 0) return false;
      return true;
    } catch (err: any) {
      console.error('[DB] Supabase review delete failed. Not silently falling back to disk:', err?.message || err);
      throw new Error('Review delete failed: ' + (err?.message || err));
    }
  }

  const reviews = await getReviews();
  const filtered = reviews.filter(r => r.id !== id);
  if (reviews.length === filtered.length) return false;
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  return true;
}
