import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { Product, Order, ContactMessage } from './src/types';
import { defaultProducts } from './src/data/defaultProducts';

// Setup local fallback directory and file paths
const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

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

// Auto-seed Supabase database table 'products' if connected and empty
export async function seedProductsIfEmpty() {
  if (!isSupabaseConnected || !supabase) return;
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

// Call seed verification on startup
seedProductsIfEmpty();

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
  if (isSupabaseConnected && supabase) {
    try {
      // Clean up metadata before persisting to Supabase if any exist
      const productPayload = { ...product };
      const { data, error } = await supabase
        .from('products')
        .upsert(productPayload)
        .select()
        .single();
      if (!error && data) {
        return data as Product;
      }
      console.warn('[DB] Supabase upsert failed. Writing to disk fallback:', error);
      throw new Error(error?.message || 'Supabase write failure');
    } catch (err: any) {
      console.warn('[DB] Supabase upsert connection error:', err);
    }
  }

  // Local fallbacks handler
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
  if (isSupabaseConnected && supabase) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (!error) {
        return true;
      }
      throw new Error(error.message);
    } catch (err) {
      console.warn('[DB] Supabase delete connection error on product retirement:', err);
    }
  }

  // Local fallbacks handler
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

export async function createOrder(orderData: Omit<Order, 'created_at' | 'status'> & { status?: Order['status'] }): Promise<Order> {
  const newOrder: Order = {
    ...orderData,
    status: orderData.status || 'pending',
    created_at: new Date().toISOString()
  };

  if (isSupabaseConnected && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert(newOrder)
        .select()
        .single();
      if (!error && data) {
        return data as Order;
      }
      console.warn('[DB] Supabase order insertion failed. Storing locally. Error Details:', error);
      throw new Error(error?.message || 'Supabase order write failed');
    } catch (err: any) {
      console.warn('[DB] Supabase order write protocol connection error:', err);
    }
  }

  // Save to local fallback storage
  const orders = await getOrders();
  // Check if order already saved locally to avoid duplicates
  if (!orders.some(o => o.id === newOrder.id)) {
    orders.unshift(newOrder);
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');

    // Decrement stock levels locally
    try {
      const products = await getProducts();
      for (const item of newOrder.items) {
        const product = products.find(p => p.id === item.product_id);
        if (product) {
          product.stock = Math.max(0, product.stock - item.quantity);
          await upsertProduct(product);
        }
      }
    } catch (err) {
      console.error('[DB Stock Sync Error] Failed to align stock levels:', err);
    }
  }

  return newOrder;
}

export async function deleteOrder(id: string): Promise<boolean> {
  if (isSupabaseConnected && supabase) {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);
      if (!error) return true;
      console.warn('[DB] Supabase order delete failed:', error);
    } catch (err) {
      console.warn('[DB] Supabase order delete error:', err);
    }
  }

  const orders = await getOrders();
  const filtered = orders.filter(o => o.id !== id);
  if (orders.length === filtered.length) return false;
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  return true;
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
  if (isSupabaseConnected && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        return data as Order;
      }
      console.warn('[DB] Supabase order patch failed. Performing local update. Error:', error);
    } catch (err) {
      console.warn('[DB] Supabase order modification connection exception:', err);
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
// Messages DB Access Handlers
// ------------------------------------------------------------------------

export async function getMessages(): Promise<ContactMessage[]> {
  try {
    const fileContent = fs.readFileSync(MESSAGES_FILE, 'utf-8');
    return JSON.parse(fileContent) as ContactMessage[];
  } catch (err) {
    console.error('[DB] Failed to read fallback messages json', err);
    return [];
  }
}

export async function createMessage(msgData: Omit<ContactMessage, 'id' | 'created_at'>): Promise<ContactMessage> {
  const newMsg: ContactMessage = {
    ...msgData,
    id: 'MSG-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
    created_at: new Date().toISOString()
  };
  const messages = await getMessages();
  messages.unshift(newMsg);
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
  return newMsg;
}

export async function deleteMessage(id: string): Promise<boolean> {
  const messages = await getMessages();
  const filtered = messages.filter(m => m.id !== id);
  if (messages.length === filtered.length) return false;
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  return true;
}
