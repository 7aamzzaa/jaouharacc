import express from 'express';
import path from 'path';
import Stripe from 'stripe';
import { createServer as createViteServer } from 'vite';
import { 
  getProducts, 
  getProductById, 
  upsertProduct, 
  deleteProduct, 
  getOrders, 
  getOrderById,
  createOrder, 
  updateOrderStatus,
  deleteOrder,
  getSupabaseClient
} from './serverDB';
import { Product } from './src/types';

const app = express();
const PORT = 3000;

// Increase JSON size limits to support base64 uploading sequence
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));

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
app.post('/api/products', async (req, res) => {
  try {
    const productData = req.body as Product;
    if (!productData.name || !productData.price) {
      return res.status(400).json({ error: 'Product name and price are required' });
    }
    const saved = await upsertProduct(productData);
    res.json(saved);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to save product', details: err.message });
  }
});

// Delete product - Admin Area
app.delete('/api/products/:id', async (req, res) => {
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
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await getOrders();
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve orders', details: err.message });
  }
});

// Create a new order from checkout
app.post('/api/orders', async (req, res) => {
  try {
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
      subtotal,
      shipping_cost,
      discount_amount,
      discount_code,
      total
    } = req.body;
    if (!customer_name || !customer_phone || !customer_city || !customer_street || !items || !total) {
      return res.status(400).json({ error: 'Missing mandatory order fields' });
    }
    const orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const created = await createOrder({
      id: orderId,
      customer_name,
      customer_phone: customer_phone || '',
      customer_email: customer_email || '',
      customer_country: customer_country || 'Morocco 🇲🇦',
      customer_city,
      customer_street,
      customer_apartment: customer_apartment || '',
      payment_method: payment_method || 'cod',
      order_notes: order_notes || '',
      items,
      subtotal: subtotal || 0,
      shipping_cost: shipping_cost || 0,
      discount_amount: discount_amount || 0,
      discount_code: discount_code || '',
      total
    });
    res.json(created);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to register order', details: err.message });
  }
});

// Get single order by ID
app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve order', details: err.message });
  }
});

// Patch order status - Admin Area
app.patch('/api/orders/:id', async (req, res) => {
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
app.delete('/api/orders/:id', async (req, res) => {
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
// BASE64 IMAGE UPLOAD TO SUPABASE STORAGE
// ------------------------------------------------------------------------
app.post('/api/upload', async (req, res) => {
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
app.post('/api/checkout/create-session', async (req, res) => {
  try {
    const { items, customer_name, customer_email, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Your cart is completely empty.' });
    }

    const appUrl = process.env.APP_URL || 'http://localhost:3000';

    // ALWAYS use/initialize Stripe as requested: "Replace CheckoutSimulation page with real Stripe Checkout Session"
    const stripe = getStripe();

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
          description: `Size: ${item.selected_size}`,
        },
        unit_amount: Math.round(item.price * 100), // in cents
      },
      quantity: item.quantity,
    }));

    const orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${appUrl}/order-confirmation?status=success&orderId=${orderId}&email=${encodeURIComponent(customer_email)}&name=${encodeURIComponent(customer_name)}&total=${total}&items=${encodeURIComponent(JSON.stringify(items))}`,
      cancel_url: `${appUrl}/cart`,
      customer_email: customer_email,
      metadata: {
        orderId,
        customer_name,
        customer_email,
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ccjaouhara Server] Live on network interface http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error('[ccjaouhara Server] Initialization sequence failure:', err);
});
