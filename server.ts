import 'dotenv/config';
import express from 'express';
import path from 'path';
import Stripe from 'stripe';
import { createServer as createViteServer } from 'vite';
import {
  createAdminToken,
  verifyPassword,
  isAdminRequest,
  isLoginAllowed,
  recordLoginFailure,
  resetLoginFailures,
  requireAdmin,
  ADMIN_COOKIE_NAME,
  SESSION_TTL_MS_VALUE,
  assertAuthConfigured
} from './serverAuth';
import { 
  getProducts, 
  getProductById, 
  upsertProduct, 
  deleteProduct, 
  getOrders, 
  getOrderById,
  getOrderByIdempotencyKey,
  createOrder, 
  createOrderWithStock,
  supabaseMode,
  updateOrderStatus,
  deleteOrder,
  getMessages,
  createMessage,
  updateMessageStatus,
  deleteMessage,
  getSubscribers,
  createSubscriber,
  deleteSubscriber,
  getReviews,
  createReview,
  updateReviewStatus,
  deleteReview,
  getSupabaseClient,
  withOrderLock,
  initializeSupabaseStartup,
  getProductStock,
  decrementProductStock,
  restoreProductStock
} from './serverDB';
import { Product, Review, Order } from './src/types';

const app = express();
const PORT = 3000;

// ------------------------------------------------------------------------
// ORDER & PROMO CONFIGURATION (server-authoritative)
// ------------------------------------------------------------------------
// Promo codes are validated purely server-side. Clients only submit the code.
const PROMO_CODES: Record<string, number> = {
  CCJAOUHARA10: 10,
  HERITAGE15: 15
};

const idempotencyTtlMs = 24 * 60 * 60 * 1000;
// Best-effort in-memory dedupe registry keyed by X-Idempotency-Key.
// The stored order's idempotency_key is the durable source of truth.
const idempotencyRegistry = new Map<string, { orderId: string; expiresAt: number }>();

function rememberIdempotency(key: string, orderId: string): void {
  idempotencyRegistry.set(key, { orderId, expiresAt: Date.now() + idempotencyTtlMs });
}

function lookupIdempotency(key: string): string | null {
  const entry = idempotencyRegistry.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    idempotencyRegistry.delete(key);
    return null;
  }
  return entry.orderId;
}

// HTTP error carrying an explicit status code so handlers can map it.
class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// Increase JSON size limits to support base64 uploading sequence
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));

// ------------------------------------------------------------------------
// ADMIN AUTHENTICATION
// ------------------------------------------------------------------------

// Login: verify the artisan password and issue an HMAC-signed session cookie
app.post('/api/admin/login', (req, res) => {
  const ip = req.ip || 'unknown';
  if (!isLoginAllowed(ip)) {
    res.set('Cache-Control', 'no-store');
    return res.status(429).json({ error: 'Too many login attempts. Please wait and retry.' });
  }

  const { password } = req.body || {};
  const diagMatches = typeof password === 'string' && verifyPassword(password);
  console.log('[LOGIN-DIAG]', JSON.stringify({
    t: new Date().toISOString(),
    ip,
    ua: (req.headers['user-agent'] || '').slice(0, 60),
    origin: req.headers['origin'] || '',
    referer: req.headers['referer'] || '',
    contentType: req.headers['content-type'] || '',
    pwType: typeof password,
    pwLen: typeof password === 'string' ? password.length : -1,
    matches: diagMatches
  }));
  if (typeof password !== 'string' || !verifyPassword(password)) {
    recordLoginFailure(ip);
    res.set('Cache-Control', 'no-store');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  resetLoginFailures(ip);
  const { token, expiresAt } = createAdminToken();
  res.cookie(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_MS_VALUE,
    secure: process.env.NODE_ENV === 'production'
  });
  res.set('Cache-Control', 'no-store');
  res.json({ ok: true, expiresAt });
});

// Session check: reports whether the current cookie is a valid admin session
app.get('/api/admin/session', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ authenticated: isAdminRequest(req) });
});

// Logout: clears the session cookie
app.post('/api/admin/logout', (req, res) => {
  res.clearCookie(ADMIN_COOKIE_NAME, { path: '/' });
  res.set('Cache-Control', 'no-store');
  res.json({ ok: true });
});

// Lazy Stripe client initialization
let stripeClient: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required to create a real Stripe Checkout Session.');
    }
    stripeClient = new Stripe(key, {
      apiVersion: '2023-10-16' as any
    });
    console.log('[Stripe] Stripe API client successfully initialized.');
  }
  return stripeClient;
}

// ------------------------------------------------------------------------
// API ENDPOINTS
// ------------------------------------------------------------------------

// Fetch all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve products', details: err.message });
  }
});

// Fetch single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Bracelet not found' });
    }
    res.json(product);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve product', details: err.message });
  }
});

// Upsert product (Add / Edit) - Admin Area
const VALID_PRODUCT_CATEGORIES = ['bracelets', 'rings', 'earrings', 'anklets', 'necklaces', 'jewelry_sets'];

function validateOneProduct(raw: any, index?: number): { status: 'ok'; product: Product } | { status: 'error'; error: string } {
  const prefix = index !== undefined ? `[Product ${index}] ` : '';

  const name = typeof raw.name === 'string' ? raw.name.trim() : '';
  if (!name) return { status: 'error', error: `${prefix}Product name is required` };

  const description = typeof raw.description === 'string' ? raw.description.trim() : '';
  if (!description) return { status: 'error', error: `${prefix}Product description is required` };

  const price = Number(raw.price);
  if (!Number.isFinite(price) || price <= 0) return { status: 'error', error: `${prefix}Product price must be a positive number` };

  const stock = Number(raw.stock);
  if (!Number.isFinite(stock) || stock < 0 || !Number.isInteger(stock)) return { status: 'error', error: `${prefix}Stock must be a non-negative integer` };

  const category = typeof raw.category === 'string' ? raw.category.trim() : '';
  if (!VALID_PRODUCT_CATEGORIES.includes(category)) return { status: 'error', error: `${prefix}Invalid category. Allowed: ${VALID_PRODUCT_CATEGORIES.join(', ')}` };

  let images: string[] = [];
  if (Array.isArray(raw.images)) {
    images = raw.images
      .filter((u: any) => typeof u === 'string' && u.trim().length > 0)
      .map((u: string) => u.trim());
  } else if (typeof raw.images === 'string') {
    images = raw.images.split(',').map((u: string) => u.trim()).filter((u: string) => u.length > 0);
  }
  if (images.length === 0) return { status: 'error', error: `${prefix}At least one product image is required` };
  if (images.length > 10) return { status: 'error', error: `${prefix}Maximum 10 images allowed` };

  const materialNorm = typeof raw.material === 'string' ? raw.material.trim() : '';
  const colorNorm = typeof raw.color === 'string' ? raw.color.trim() : '';

  const slug = typeof raw.slug === 'string' && raw.slug.trim()
    ? raw.slug.trim()
    : name.toLowerCase().trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

  const product: Product = {
    id: typeof raw.id === 'string' && raw.id.trim() ? raw.id.trim() : 'prod-' + Date.now() + (index !== undefined ? `-${index}` : ''),
    name,
    description,
    price,
    images,
    stock,
    category,
    material: materialNorm,
    color: colorNorm,
    rating: 0,
    reviews: 0,
    seoTitle: typeof raw.seoTitle === 'string' && raw.seoTitle.trim() ? raw.seoTitle.trim() : undefined,
    metaDescription: typeof raw.metaDescription === 'string' && raw.metaDescription.trim() ? raw.metaDescription.trim() : undefined,
    slug: slug || undefined,
    imageAltText: typeof raw.imageAltText === 'string' && raw.imageAltText.trim() ? raw.imageAltText.trim() : undefined,
    tags: Array.isArray(raw.tags) ? raw.tags.filter((t: any) => typeof t === 'string' && t.trim()) : undefined,
    primaryKeyword: typeof raw.primaryKeyword === 'string' && raw.primaryKeyword.trim() ? raw.primaryKeyword.trim() : undefined,
    secondaryKeywords: Array.isArray(raw.secondaryKeywords) ? raw.secondaryKeywords.filter((k: any) => typeof k === 'string' && k.trim()) : undefined
  };

  return { status: 'ok', product };
}

app.post('/api/products', requireAdmin, async (req, res) => {
  try {
    const raw = req.body || {};
    const isEdit = typeof raw.id === 'string' && raw.id.trim().length > 0;

    const result = validateOneProduct(raw);
    if (result.status === 'error') {
      return res.status(400).json({ error: result.error });
    }

    const productData = result.product;

    // For edits, overwrite the id with the original and preserve existing rating/reviews
    if (isEdit) {
      productData.id = raw.id.trim();
      const existing = await getProductById(productData.id);
      if (existing) {
        productData.rating = typeof existing.rating === 'number' ? existing.rating : 0;
        productData.reviews = typeof existing.reviews === 'number' ? existing.reviews : 0;
      }
    }

    const saved = await upsertProduct(productData);
    res.json(saved);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to save product', details: err.message });
  }
});

// Bulk import products - Admin Area
app.post('/api/products/bulk', requireAdmin, async (req, res) => {
  try {
    const body = req.body || {};
    const incoming = Array.isArray(body.products) ? body.products : null;

    if (!incoming) {
      return res.status(400).json({ error: 'Request body must contain a "products" array' });
    }
    if (incoming.length === 0) {
      return res.status(400).json({ error: 'Products array must not be empty' });
    }
    if (incoming.length > 100) {
      return res.status(400).json({ error: 'Maximum 100 products per request' });
    }

    // Validate every product and collect results
    const validated: Product[] = [];
    for (let i = 0; i < incoming.length; i++) {
      const result = validateOneProduct(incoming[i], i);
      if (result.status === 'error') {
        return res.status(400).json({ error: result.error });
      }
      validated.push(result.product);
    }

    // Duplicate ID check within the batch
    const seenIds = new Set<string>();
    for (let i = 0; i < validated.length; i++) {
      if (seenIds.has(validated[i].id)) {
        return res.status(400).json({ error: `Duplicate product ID "${validated[i].id}" at index ${i}` });
      }
      seenIds.add(validated[i].id);
    }

    // Duplicate slug check within the batch
    const seenSlugs = new Set<string>();
    for (let i = 0; i < validated.length; i++) {
      const slug = validated[i].slug;
      if (slug && seenSlugs.has(slug)) {
        return res.status(400).json({ error: `Duplicate slug "${slug}" at index ${i}` });
      }
      if (slug) seenSlugs.add(slug);
    }

    // Check existing products so new batch cannot collide with existing IDs or slugs
    const existingProducts = await getProducts();
    const existingIds = new Set(existingProducts.map(p => p.id));
    const existingSlugs = new Set(existingProducts.filter(p => p.slug).map(p => p.slug!));

    for (let i = 0; i < validated.length; i++) {
      if (existingIds.has(validated[i].id)) {
        return res.status(409).json({ error: `Product ID "${validated[i].id}" already exists (index ${i})` });
      }
      if (validated[i].slug && existingSlugs.has(validated[i].slug!)) {
        return res.status(409).json({ error: `Slug "${validated[i].slug}" already exists (index ${i})` });
      }
    }

    // All validation passed — persist each product
    const saved: Product[] = [];
    for (const p of validated) {
      const result = await upsertProduct(p);
      saved.push(result);
    }

    res.status(201).json({ success: true, count: saved.length, products: saved });
  } catch (err: any) {
    res.status(500).json({ error: 'Bulk product import failed', details: err.message });
  }
});

// Delete product - Admin Area
app.delete('/api/products/:id', requireAdmin, async (req, res) => {
  try {
    const success = await deleteProduct(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully', id: req.params.id });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete product', details: err.message });
  }
});

// Fetch all orders - Admin Area
app.get('/api/orders', requireAdmin, async (req, res) => {
  try {
    const orders = await getOrders();
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve orders', details: err.message });
  }
});

// Create a new order from checkout
// The server is the sole authority for prices, discounts, shipping and totals.
// Trusted client input is limited to customer/order info, product ids, quantities
// and the selected size. Idempotency is enforced with X-Idempotency-Key.
app.post('/api/orders', async (req, res) => {
  try {
    const idempotencyKey = (req.headers['x-idempotency-key'] as string | undefined || '').trim();
    if (!idempotencyKey) {
      return res.status(400).json({ error: 'X-Idempotency-Key header is required' });
    }

    const {
      customer_name,
      customer_phone,
      customer_email,
      customer_country,
      customer_city,
      customer_street,
      customer_apartment,
      payment_method,
      order_notes,
      items,
      discount_code
    } = req.body || {};

    // --- Customer field validation -----------------------------------------
    const str = (v: any, maxLen: number) => (typeof v === 'string' ? v.trim().slice(0, maxLen) : '');
    const nameField = str(customer_name, 200);
    const phoneField = str(customer_phone, 50);
    const cityField = str(customer_city, 120);
    const streetField = str(customer_street, 300);
    const countryField = str(customer_country, 120) || 'Morocco 🇲🇦';
    const apartmentField = str(customer_apartment, 120);
    const notesField = str(order_notes, 2000);
    const emailField = str(customer_email, 200);

    if (!nameField || !phoneField || !cityField || !streetField) {
      return res.status(400).json({ error: 'Missing mandatory order fields' });
    }
    if (emailField && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField)) {
      return res.status(400).json({ error: 'Invalid customer email format' });
    }

    const method = str(payment_method, 20) || 'cod';
    if (!['cod'].includes(method)) {
      return res.status(400).json({ error: 'Invalid payment method' });
    }

    // --- Idempotency check ---------------------------------------------------
    const existingOrderId = lookupIdempotency(idempotencyKey);
    if (existingOrderId) {
      const existing = await getOrderById(existingOrderId);
      if (existing) {
        return res.json(existing);
      }
    }
    const persistedDup = await getOrderByIdempotencyKey(idempotencyKey);
    if (persistedDup) {
      rememberIdempotency(idempotencyKey, persistedDup.id);
      return res.json(persistedDup);
    }

    // --- Item validation ------------------------------------------------------
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items array is required and cannot be empty' });
    }

    interface TrustedItem { product_id: string; quantity: number; selected_size: string; }
    const trustItems: TrustedItem[] = [];
    for (const raw of items) {
      const productId = str(raw?.product_id, 200);
      const selectedSize = str(raw?.selected_size, 120);
      if (!productId) {
        return res.status(400).json({ error: 'Each item requires a product_id' });
      }
      if (typeof raw?.quantity !== 'number' || !Number.isInteger(raw.quantity) || raw.quantity < 1) {
        return res.status(400).json({ error: `Invalid quantity for product ${productId}` });
      }
      if (raw.quantity > 99) {
        return res.status(400).json({ error: `Quantity exceeds the maximum of 99 for product ${productId}` });
      }
      trustItems.push({ product_id: productId, quantity: raw.quantity, selected_size: selectedSize });
    }

    // --- Authoritative product resolution --------------------------------------
    const resolved: { product: Product; quantity: number; selected_size: string }[] = [];
    const quantityByProduct = new Map<string, number>();
    for (const item of trustItems) {
      const product = await getProductById(item.product_id);
      if (!product || typeof product.price !== 'number' || product.price <= 0) {
        return res.status(404).json({ error: `Product not found: ${item.product_id}` });
      }
      resolved.push({ product, quantity: item.quantity, selected_size: item.selected_size });
      quantityByProduct.set(item.product_id, (quantityByProduct.get(item.product_id) || 0) + item.quantity);
    }

    // --- Server-side pricing (promo, shipping, total) --------------------------
    const subtotal = resolved.reduce((sum, r) => sum + r.product.price * r.quantity, 0);

    let discountAmount = 0;
    let normalizedDiscountCode = '';
    const promoCode = str(discount_code, 40).toUpperCase();
    if (promoCode) {
      const percent = PROMO_CODES[promoCode];
      if (typeof percent === 'number' && percent > 0) {
        normalizedDiscountCode = promoCode;
        discountAmount = (subtotal * percent) / 100;
      }
    }

    const shippingCost = 0; // shipping is free by business rule
    const total = Math.max(0, subtotal - discountAmount + shippingCost);

    const orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    const orderItems: Order['items'] = resolved.map(r => ({
      product_id: r.product.id,
      name: r.product.name,
      price: r.product.price,
      quantity: r.quantity,
      selected_size: r.selected_size,
      image: (r.product.images && r.product.images[0]) || ''
    }));

    // --- Serialized commit: lock -> stock check -> decrement -> create ----------
    const created = await withOrderLock(async () => {
      // Re-check idempotency under the lock (guards simultaneous duplicate posts).
      const lockExistingOrderId = lookupIdempotency(idempotencyKey);
      if (lockExistingOrderId) {
        const prior = await getOrderById(lockExistingOrderId);
        if (prior) return prior;
      }
      const lockDup = await getOrderByIdempotencyKey(idempotencyKey);
      if (lockDup) {
        rememberIdempotency(idempotencyKey, lockDup.id);
        return lockDup;
      }

      // Supabase mode: one atomic RPC validates stock, decrements it and inserts
      // the order inside a single PostgreSQL transaction. Idempotency is still
      // re-checked inside the RPC, so correctness no longer depends on this lock
      // or on the local read-stock -> decrement -> create -> restore sequence.
      if (supabaseMode) {
        try {
          const saved = await createOrderWithStock({
            id: orderId,
            customer_name: nameField,
            customer_phone: phoneField,
            customer_email: emailField,
            customer_country: countryField,
            customer_city: cityField,
            customer_street: streetField,
            customer_apartment: apartmentField,
            payment_method: method,
            order_notes: notesField,
            items: orderItems,
            subtotal,
            shipping_cost: shippingCost,
            discount_amount: discountAmount,
            discount_code: normalizedDiscountCode,
            total,
            idempotency_key: idempotencyKey,
            status: 'pending'
          });
          rememberIdempotency(idempotencyKey, saved.id);
          return saved;
        } catch (err: any) {
          if (err && err.isInsufficientStock) {
            throw new HttpError(409, 'Insufficient stock for one or more items');
          }
          throw err;
        }
      }

      // Fresh authoritative stock read under the lock.
      for (const { product_id, quantity } of trustItems) {
        const available = await getProductStock(product_id);
        if (available < quantity) {
          const prod = await getProductById(product_id);
          throw new HttpError(409, `Insufficient stock for ${prod?.name || product_id}`);
        }
      }

      // Decrement all stock, tracking what we changed for rollback on failure.
      const decremented: { product_id: string; quantity: number }[] = [];
      try {
        for (const { product_id, quantity } of trustItems) {
          await decrementProductStock(product_id, quantity);
          decremented.push({ product_id, quantity });
        }
      } catch (err) {
        console.error('[Order Rollback] Stock decrement failed, restoring:', err);
        for (const d of decremented) {
          await restoreProductStock(d.product_id, d.quantity);
        }
        throw new HttpError(500, 'Failed to reserve stock for the order');
      }

      let saved: Order;
      try {
        saved = await createOrder({
          id: orderId,
          customer_name: nameField,
          customer_phone: phoneField,
          customer_email: emailField,
          customer_country: countryField,
          customer_city: cityField,
          customer_street: streetField,
          customer_apartment: apartmentField,
          payment_method: method,
          order_notes: notesField,
          items: orderItems,
          subtotal,
          shipping_cost: shippingCost,
          discount_amount: discountAmount,
          discount_code: normalizedDiscountCode,
          total,
          idempotency_key: idempotencyKey
        });
      } catch (err) {
        console.error('[Order Rollback] Order creation failed, restoring stock:', err);
        for (const d of decremented) {
          await restoreProductStock(d.product_id, d.quantity);
        }
        throw new HttpError(500, 'Failed to register order');
      }

      rememberIdempotency(idempotencyKey, saved.id);
      return saved;
    });

    return res.json(created);
  } catch (err: any) {
    if (err instanceof HttpError) {
      return res.status(err.status).json({ error: err.message });
    }
    res.status(500).json({ error: 'Failed to register order', details: err.message });
  }
});

// Get single order by ID - Public, email-gated
// If the order has a stored customer email, an ?email= query param must match it.
// Orders stored with an empty email resolve by id alone (preserves legacy order confirmation UX).
app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const storedEmail = (order.customer_email || '').trim().toLowerCase();
    if (storedEmail) {
      const queryEmail = (req.query.email as string | undefined || '').trim().toLowerCase();
      if (!queryEmail || queryEmail !== storedEmail) {
        return res.status(404).json({ error: 'Order not found' });
      }
    }
    res.json(order);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve order', details: err.message });
  }
});

// Patch order status - Admin Area
app.patch('/api/orders/:id', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is key required' });
    }
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    const updated = await updateOrderStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update order status', details: err.message });
  }
});

// Delete order - Admin Area
app.delete('/api/orders/:id', requireAdmin, async (req, res) => {
  try {
    const success = await deleteOrder(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully', id: req.params.id });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete order', details: err.message });
  }
});

// ------------------------------------------------------------------------
// Messages API Endpoints
// ------------------------------------------------------------------------

// Fetch all messages - Admin Area
app.get('/api/messages', requireAdmin, async (req, res) => {
  try {
    const messages = await getMessages();
    res.json(messages);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve messages', details: err.message });
  }
});

// Submit a contact message from the public form
app.post('/api/messages', async (req, res) => {
  try {
    const { fullName, email, phone, subject, message } = req.body;
    if (!fullName || !email || !message) {
      return res.status(400).json({ error: 'fullName, email, and message are required' });
    }
    const created = await createMessage({
      fullName,
      email,
      phone: phone || '',
      subject: subject || '',
      message
    });
    res.json(created);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to save message', details: err.message });
  }
});

// Mark message as read - Admin Area
app.patch('/api/messages/:id', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !['new', 'read'].includes(status)) {
      return res.status(400).json({ error: 'Status must be "new" or "read"' });
    }
    const updated = await updateMessageStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update message status', details: err.message });
  }
});

// Delete a message - Admin Area
app.delete('/api/messages/:id', requireAdmin, async (req, res) => {
  try {
    const success = await deleteMessage(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json({ message: 'Message deleted successfully', id: req.params.id });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete message', details: err.message });
  }
});

// ------------------------------------------------------------------------
// Newsletter Subscribers API Endpoints
// ------------------------------------------------------------------------

// Fetch all subscribers - Admin Area
app.get('/api/newsletter', requireAdmin, async (req, res) => {
  try {
    const subscribers = await getSubscribers();
    res.json(subscribers);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve subscribers', details: err.message });
  }
});

// Subscribe a new email (public form)
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'A valid email address is required' });
    }
    const created = await createSubscriber(email);
    if (!created) {
      return res.status(409).json({ error: 'This email is already subscribed' });
    }
    res.json(created);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to subscribe', details: err.message });
  }
});

// Delete a subscriber - Admin Area
app.delete('/api/newsletter/:id', requireAdmin, async (req, res) => {
  try {
    const success = await deleteSubscriber(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Subscriber not found' });
    }
    res.json({ message: 'Subscriber deleted successfully', id: req.params.id });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete subscriber', details: err.message });
  }
});

// ------------------------------------------------------------------------
// Reviews API Endpoints
// ------------------------------------------------------------------------

// Get reviews — public: ?product_id=xxx returns approved only; admin: no param returns all
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await getReviews();
    const { product_id } = req.query;
    if (product_id && typeof product_id === 'string') {
      return res.json(reviews.filter(r => r.product_id === product_id && r.status === 'approved'));
    }
    // No product_id filter: full review list (including pending + customer emails) is admin-only
    if (!isAdminRequest(req)) {
      res.set('Cache-Control', 'no-store');
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.json(reviews);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve reviews', details: err.message });
  }
});

// Submit a new review (public) — stored as pending
app.post('/api/reviews', async (req, res) => {
  try {
    const { product_id, customerName, customerEmail, rating, comment } = req.body;
    if (!product_id || !customerName || rating == null || !comment) {
      return res.status(400).json({ error: 'product_id, customerName, rating, and comment are required' });
    }
    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: 'rating must be an integer between 1 and 5' });
    }
    if (customerEmail && typeof customerEmail === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    const created = await createReview({
      product_id, customerName, customerEmail: customerEmail || undefined, rating: ratingNum, comment
    });
    res.json(created);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to save review', details: err.message });
  }
});

// Approve or reject a review (admin)
app.patch('/api/reviews/:id', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be "approved" or "rejected"' });
    }
    const updated = await updateReviewStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update review status', details: err.message });
  }
});

// Delete a review (admin)
app.delete('/api/reviews/:id', requireAdmin, async (req, res) => {
  try {
    const success = await deleteReview(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json({ message: 'Review deleted successfully', id: req.params.id });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete review', details: err.message });
  }
});

// ------------------------------------------------------------------------
// BASE64 IMAGE UPLOAD TO SUPABASE STORAGE
// ------------------------------------------------------------------------
app.post('/api/upload', requireAdmin, async (req, res) => {
  try {
    const { name, type, base64 } = req.body;
    if (!base64) {
      return res.status(400).json({ error: 'No raw file data received' });
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(500).json({ error: 'Database client is not initialized or connected to Supabase.' });
    }

    // Strip base64 header if present
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Create random or clean filename
    const fileExt = name ? name.split('.').pop() || 'jpg' : 'jpg';
    const fileName = `ccjaouhara-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const bucketName = 'ccjaouhara-images';
    
    // Attempt upload with upsert option
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType: type || 'image/jpeg',
        upsert: true
      });

    if (uploadError) {
      // Bucket check and auto create
      if (uploadError.message.includes('not found') || uploadError.message.includes('bucket')) {
        console.log(`[Storage] Bucket "${bucketName}" not found. Creating bucket...`);
        const { error: createBucketError } = await supabase.storage.createBucket(bucketName, {
          public: true,
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
        });
        if (createBucketError) {
          throw new Error('Could not create storage bucket inside Supabase: ' + createBucketError.message);
        }
        
        // Retry upload
        const { data: retryData, error: retryError } = await supabase.storage
          .from(bucketName)
          .upload(fileName, buffer, { contentType: type || 'image/jpeg' });
        
        if (retryError) throw retryError;
      } else {
        throw uploadError;
      }
    }

    // Retrieve public link URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    res.json({ url: publicUrl });
  } catch (err: any) {
    console.error('[Storage Upload Error]', err);
    res.status(500).json({ error: 'Failed to upload custom asset to storage:', details: err.message });
  }
});

// Stripe checkout sessions router
// NEVER trust client-provided prices — resolve every product from the DB.
app.post('/api/checkout/create-session', async (req, res) => {
  try {
    const { items, customer_name, customer_email } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Your cart is completely empty.' });
    }

    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    const stripe = getStripe();

    // --- Validate items and resolve prices from the database -----------------
    const resolved: { product: Product; quantity: number; selected_size: string }[] = [];
    for (const raw of items) {
      const productId = typeof raw?.product_id === 'string' ? raw.product_id.trim().slice(0, 200) : '';
      if (!productId) {
        return res.status(400).json({ error: 'Each item requires a product_id' });
      }
      if (typeof raw?.quantity !== 'number' || !Number.isInteger(raw.quantity) || raw.quantity < 1 || raw.quantity > 99) {
        return res.status(400).json({ error: `Invalid quantity for product ${productId}` });
      }
      const product = await getProductById(productId);
      if (!product || typeof product.price !== 'number' || product.price <= 0) {
        return res.status(404).json({ error: `Product not found: ${productId}` });
      }
      resolved.push({ product, quantity: raw.quantity, selected_size: typeof raw?.selected_size === 'string' ? raw.selected_size.trim().slice(0, 120) : '' });
    }

    const subtotal = resolved.reduce((sum, r) => sum + r.product.price * r.quantity, 0);
    const total = Math.max(0, subtotal);

    const lineItems = resolved.map(r => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: r.product.name,
          images: r.product.images?.[0] ? [r.product.images[0]] : [],
          description: r.selected_size ? `Size: ${r.selected_size}` : undefined,
        },
        unit_amount: Math.round(r.product.price * 100),
      },
      quantity: r.quantity,
    }));

    const orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${appUrl}/order-confirmation?status=success&orderId=${orderId}&email=${encodeURIComponent(customer_email || '')}`,
      cancel_url: `${appUrl}/cart`,
      customer_email: customer_email,
      metadata: {
        orderId,
        customer_name: customer_name || '',
        customer_email: customer_email || '',
        totalString: String(total)
      }
    });

    return res.json({ id: session.id, url: session.url, simulated: false });
  } catch (err: any) {
    console.error('[Stripe Session] Failed to initiate payment stream:', err);
    res.status(500).json({ 
      error: 'Stripe gateway checkout failed', 
      details: err.message || 'Check your Stripe secret API keys inside the Secrets environment variable configuration.' 
    });
  }
});

// ------------------------------------------------------------------------
// VITE CLIENT SYSTEM INTEGRATION
// ------------------------------------------------------------------------

async function start() {
  if (process.env.NODE_ENV === 'production') {
    assertAuthConfigured();
  }
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[Vite] Middleware injected. Direct browser compilation running.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('[Production] Static dist content serving active.');
  }

  initializeSupabaseStartup().catch(err => {
    console.warn('[DB] Startup seed/mirror failed:', err?.message || err);
  });

  app.listen(PORT, () => {
    console.log(`[ccjaouhara Server] Live on network interface http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error('[ccjaouhara Server] Initialization sequence failure:', err);
});
