import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Keep dotenv from reading the repository .env: all config below is test-only.
process.env.DOTENV_CONFIG_PATH = path.join(os.tmpdir(), 'ccjaouhara-checkout-safety-test.env');
process.env.NODE_ENV = 'test';
process.env.VERCEL = '1';
process.env.ADMIN_PASSWORD = 'test-admin-password';
process.env.ADMIN_SESSION_SECRET = 'test-checkout-session-secret-not-from-env-file';
delete process.env.STRIPE_SECRET_KEY;

type DbRow = Record<string, unknown> & { id: string; status: string };
type RpcParams = Record<string, unknown>;

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const appSource = fs.readFileSync(path.join(packageRoot, 'src/App.tsx'), 'utf8');
const serverSource = fs.readFileSync(path.join(packageRoot, 'server.ts'), 'utf8');

// --- Static route/source guards --------------------------------------------
assert.ok(
  appSource.includes('<Route path="/checkout" element={<Navigate to="/cart" replace />} />'),
  '/checkout must redirect to /cart with replace and no cart/order props'
);
assert.ok(!appSource.includes('CheckoutSimulation'), 'App must not render the legacy simulation');
assert.match(appSource, /case 'checkout':\s*navigate\('\/cart'\);/, 'onPageChange(checkout) must go to /cart');
assert.match(
  appSource,
  /useEffect\(\(\) => \{\s*\/\/ Legacy \/checkout links[\s\S]*?if \(window\.location\.pathname === '\/checkout'\) return;[\s\S]*?setCart\(\[\]\)/,
  'the URL-success effect must ignore /checkout before clearing the cart'
);
assert.ok(
  fs.existsSync(path.join(packageRoot, 'src/pages/CheckoutSimulation.tsx')),
  'CheckoutSimulation.tsx is preserved in this phase'
);
assert.match(
  serverSource,
  /app\.post\('\/api\/checkout\/create-session',\s*\(_req, res\)\s*=>\s*\{\s*res\.status\(404\)/,
  'Stripe session endpoint must be disabled before any SDK call'
);
assert.ok(!serverSource.includes('stripe.checkout.sessions.create'), 'no Stripe Checkout Session may be created');

// --- Mock Supabase ----------------------------------------------------------
const productRow = {
  id: 'CCJ-TEST-NECKLACE',
  name: 'Test Necklace',
  description: 'Mock product for checkout safety tests',
  price: 79,
  images: [],
  stock: 10,
  category: 'necklaces',
  material: 'gold',
  color: 'gold',
  inventory_policy: 'tracked',
  variants: []
};

const orders = new Map<string, DbRow>();
const rpcCalls: RpcParams[] = [];
const requests: { method: string; pathname: string; query: string }[] = [];

function sendJson(res: http.ServerResponse, status: number, body: unknown) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(body));
}

async function readBody(req: http.IncomingMessage): Promise<DbRow | null> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  if (chunks.length === 0) return null;
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf-8')) as DbRow;
  } catch {
    return null;
  }
}

function wantsSingle(req: http.IncomingMessage): boolean {
  return String(req.headers.accept || '').includes('vnd.pgrst.object+json');
}

function eqValue(url: URL, key: string): string | undefined {
  const raw = url.searchParams.get(key);
  return raw?.startsWith('eq.') ? raw.slice(3) : undefined;
}

const mockDb = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', 'http://localhost');
  requests.push({ method: req.method || '', pathname: url.pathname, query: url.searchParams.toString() });

  if (url.pathname === '/rest/v1/products' && req.method === 'GET') {
    const targetId = eqValue(url, 'id');
    const rows = targetId && targetId !== productRow.id ? [] : [productRow];
    return sendJson(res, 200, wantsSingle(req) ? (rows[0] ?? null) : rows);
  }

  if (url.pathname === '/rest/v1/rpc/create_order_with_stock' && req.method === 'POST') {
    const params = ((await readBody(req)) || {}) as RpcParams;
    rpcCalls.push(params);
    const order: DbRow = {
      id: String(params.p_id),
      customer_name: params.p_customer_name,
      customer_phone: params.p_customer_phone,
      customer_email: params.p_customer_email,
      customer_country: params.p_customer_country,
      customer_city: params.p_customer_city,
      customer_street: params.p_customer_street,
      customer_apartment: params.p_customer_apartment ?? '',
      payment_method: params.p_payment_method,
      order_notes: params.p_order_notes ?? '',
      items: params.p_items,
      subtotal: params.p_subtotal,
      shipping_cost: params.p_shipping_cost,
      discount_amount: params.p_discount_amount,
      discount_code: params.p_discount_code ?? '',
      total: params.p_total,
      idempotency_key: params.p_idempotency_key,
      status: String(params.p_status),
      created_at: new Date().toISOString()
    };
    orders.set(order.id, order);
    return sendJson(res, 200, order);
  }

  if (url.pathname === '/rest/v1/orders' && req.method === 'GET') {
    const targetId = eqValue(url, 'id');
    const targetKey = eqValue(url, 'idempotency_key');
    let rows = [...orders.values()];
    if (targetId) rows = rows.filter((o) => o.id === targetId);
    if (targetKey) rows = rows.filter((o) => o.idempotency_key === targetKey);
    return sendJson(res, 200, wantsSingle(req) ? (rows[0] ?? null) : rows);
  }

  return sendJson(res, 200, []);
});

await new Promise<void>((resolve, reject) => {
  mockDb.once('error', reject);
  mockDb.listen(0, '127.0.0.1', resolve);
});
const mockAddress = mockDb.address();
if (!mockAddress || typeof mockAddress === 'string') throw new Error('Mock Supabase server failed to start');

process.env.SUPABASE_URL = `http://127.0.0.1:${mockAddress.port}`;
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-only-service-key';

const { app } = await import('../server.ts');
const appServer = http.createServer(app);
await new Promise<void>((resolve, reject) => {
  appServer.once('error', reject);
  appServer.listen(0, '127.0.0.1', resolve);
});
const appAddress = appServer.address();
if (!appAddress || typeof appAddress === 'string') throw new Error('Test API server failed to start');
const baseUrl = `http://127.0.0.1:${appAddress.port}`;

type ApiResult = { status: number; body: any };

async function api(pathname: string, init: RequestInit = {}): Promise<ApiResult> {
  const response = await fetch(`${baseUrl}${pathname}`, init);
  const text = await response.text();
  let body: any = null;
  if (text) {
    try { body = JSON.parse(text); } catch { body = text; }
  }
  return { status: response.status, body };
}

try {
  // 1. Stripe endpoint is disabled without initializing Stripe or touching DB.
  const requestsBeforeStripe = requests.length;
  const stripe = await api('/api/checkout/create-session', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ items: [{ product_id: productRow.id, quantity: 1 }], customer_email: 'buyer@example.com' })
  });
  assert.equal(stripe.status, 404);
  assert.equal(stripe.body?.error, 'Stripe checkout is not available');
  assert.equal(requests.length, requestsBeforeStripe, 'disabled Stripe endpoint must not read products or write orders');
  assert.equal(rpcCalls.length, 0, 'disabled Stripe endpoint must not create an order');

  // 2. Normal COD order creation still uses the server as the price/ID authority.
  const productWritesBefore = requests.filter(
    (r) => r.pathname === '/rest/v1/products' && r.method !== 'GET'
  ).length;
  const idempotencyKey = 'checkout-safety-cod-key-1';
  const codPayload = {
    // Client-supplied ID and pricing must be ignored.
    id: 'CLIENT-FAKE-ID',
    customer_name: 'COD Customer',
    customer_phone: '+212600000001',
    customer_email: 'cod.customer@example.com',
    customer_country: 'Morocco 🇲🇦',
    customer_city: 'Marrakech',
    customer_street: '1 Test Street',
    customer_apartment: '',
    payment_method: 'cod',
    order_notes: '',
    items: [{
      product_id: productRow.id,
      quantity: 2,
      selected_size: '',
      name: 'Tampered Client Name',
      price: 1,
      image: 'https://example.invalid/tampered.png',
      availability_to_confirm: true
    }],
    subtotal: 1,
    shipping_cost: 999,
    discount_amount: 999,
    total: 1
  };
  const created = await api('/api/orders', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-Idempotency-Key': idempotencyKey
    },
    body: JSON.stringify(codPayload)
  });
  assert.equal(created.status, 200, JSON.stringify(created.body));
  assert.notEqual(created.body?.id, 'CLIENT-FAKE-ID');
  assert.match(String(created.body?.id), /^ORD-/);
  assert.equal(created.body?.payment_method, 'cod');
  assert.equal(created.body?.status, 'pending');
  assert.equal(created.body?.total, 158);
  assert.equal(created.body?.subtotal, 158);
  assert.equal(created.body?.shipping_cost, 0);
  assert.equal(created.body?.discount_amount, 0);
  assert.equal(created.body?.discount_code, '');
  assert.equal(created.body?.items?.[0]?.name, productRow.name);
  assert.equal(created.body?.items?.[0]?.price, productRow.price);
  assert.equal(created.body?.items?.[0]?.availability_to_confirm, undefined);

  const rpc = rpcCalls[0];
  assert.ok(rpc, 'order must be committed through the authoritative RPC');
  assert.equal(rpc.p_id, created.body.id);
  assert.equal(rpc.p_payment_method, 'cod');
  assert.equal(rpc.p_total, 158);
  assert.equal(rpc.p_status, 'pending');
  assert.equal(rpc.p_customer_email, codPayload.customer_email);
  assert.equal(rpc.p_customer_phone, codPayload.customer_phone);
  assert.equal(rpc.p_customer_city, codPayload.customer_city);
  assert.equal(rpc.p_customer_street, codPayload.customer_street);
  assert.ok(orders.has(String(rpc.p_id)));
  assert.equal(
    requests.filter((r) => r.pathname === '/rest/v1/products' && r.method !== 'GET').length,
    productWritesBefore,
    'COD order creation must not write product stock outside the atomic RPC'
  );

  // 3. Idempotency replay returns the same server-generated ID and no new commit.
  const replay = await api('/api/orders', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-Idempotency-Key': idempotencyKey
    },
    body: JSON.stringify(codPayload)
  });
  assert.equal(replay.status, 200);
  assert.equal(replay.body?.id, created.body.id);
  assert.equal(rpcCalls.length, 1, 'replay must not create a second order');
  assert.equal(orders.size, 1);

  console.log('[checkout-safety] tests passed: no fake success route, cart preserved, Stripe disabled, COD order works');
} finally {
  await new Promise<void>((resolve) => appServer.close(() => resolve()));
  await new Promise<void>((resolve) => mockDb.close(() => resolve()));
}
