import assert from 'node:assert/strict';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';

// Keep dotenv from reading the repository .env: all config below is test-only.
process.env.DOTENV_CONFIG_PATH = path.join(os.tmpdir(), 'ccjaouhara-admin-test.env');
process.env.NODE_ENV = 'test';
process.env.VERCEL = '1';
process.env.ADMIN_PASSWORD = 'test-admin-password';
process.env.ADMIN_SESSION_SECRET = 'test-session-secret-not-from-env-file';

type TestOrder = Record<string, unknown> & {
  id: string;
  status: string;
  created_at: string;
};

function makeOrder(id: string, status = 'pending'): TestOrder {
  return {
    id,
    customer_name: 'Mock Customer',
    customer_phone: '+212600000000',
    customer_email: '',
    customer_country: 'Morocco',
    customer_city: 'Rabat',
    customer_street: 'Test Street',
    customer_apartment: '',
    payment_method: 'cod',
    order_notes: '',
    items: [{ product_id: 'test-product', name: 'Mock Item', price: 79, quantity: 1, selected_size: '', image: '' }],
    subtotal: 79,
    shipping_cost: 0,
    discount_amount: 0,
    discount_code: '',
    total: 79,
    idempotency_key: `test-key-${id}`,
    status,
    created_at: `2026-01-01T00:00:0${id.endsWith('1') ? '1' : '2'}.000Z`
  };
}

const orders = new Map<string, TestOrder>();
orders.set('ORD-TEST-1', makeOrder('ORD-TEST-1'));
orders.set('ORD-TEST-2', makeOrder('ORD-TEST-2', 'confirmed'));

const requests: { method: string; pathname: string; query: string }[] = [];
let failOrdersGet = false;
let failOrdersDelete = false;

function sendJson(res: http.ServerResponse, status: number, body: unknown) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(body));
}

async function readBody(req: http.IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  if (chunks.length === 0) return null;
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf-8'));
  } catch {
    return null;
  }
}

const mockDb = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', 'http://localhost');
  requests.push({ method: req.method || '', pathname: url.pathname, query: url.searchParams.toString() });

  const rawId = url.searchParams.get('id');
  const targetId = rawId?.startsWith('eq.') ? rawId.slice(3) : undefined;

  if (url.pathname === '/rest/v1/orders') {
    if (req.method === 'GET') {
      if (failOrdersGet) return sendJson(res, 500, { message: 'simulated orders outage' });
      let rows = [...orders.values()];
      if (targetId) rows = rows.filter((o) => o.id === targetId);
      const wantsSingle = String(req.headers.accept || '').includes('vnd.pgrst.object+json');
      if (wantsSingle) return sendJson(res, 200, rows[0] ?? null);
      return sendJson(res, 200, rows);
    }

    if (req.method === 'DELETE') {
      if (failOrdersDelete) return sendJson(res, 500, { message: 'simulated delete outage' });
      if (!targetId) return sendJson(res, 200, []);
      const existed = orders.has(targetId);
      if (existed) orders.delete(targetId);
      return sendJson(res, 200, existed ? [{ id: targetId }] : []);
    }

    if (req.method === 'PATCH') {
      if (!targetId) return sendJson(res, 200, []);
      const body = (await readBody(req)) as { status?: string } | null;
      const current = orders.get(targetId);
      if (!current) return sendJson(res, 200, []);
      const updated = { ...current, ...(body?.status ? { status: body.status } : {}) };
      orders.set(targetId, updated);
      const wantsSingle = String(req.headers.accept || '').includes('vnd.pgrst.object+json');
      return sendJson(res, 200, wantsSingle ? updated : [updated]);
    }
  }

  // Product mirror reads are allowed; no product writes should ever happen.
  if (url.pathname === '/rest/v1/products' && req.method === 'GET') {
    return sendJson(res, 200, []);
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

type ApiResult = { status: number; body: any; cookie: string };

async function api(pathname: string, init: RequestInit = {}, cookie = ''): Promise<ApiResult> {
  const response = await fetch(`${baseUrl}${pathname}`, {
    ...init,
    headers: {
      ...(cookie ? { cookie } : {}),
      ...(init.headers || {})
    }
  });
  const text = await response.text();
  let body: any = null;
  if (text) {
    try { body = JSON.parse(text); } catch { body = text; }
  }
  const setCookie = response.headers.get('set-cookie') || '';
  return { status: response.status, body, cookie: setCookie.split(';')[0] };
}

function countRequests(method: string, pathname: string): number {
  return requests.filter((r) => r.method === method && r.pathname === pathname).length;
}

try {
  // 1. Unauthorized deletion must be rejected before any database call.
  const deleteCallsBeforeAuth = countRequests('DELETE', '/rest/v1/orders');
  const unauthorized = await api('/api/orders/ORD-TEST-1', { method: 'DELETE' });
  assert.equal(unauthorized.status, 401);
  assert.equal(unauthorized.body?.error, 'Unauthorized');
  assert.equal(countRequests('DELETE', '/rest/v1/orders'), deleteCallsBeforeAuth);

  // 2. Wrong password must not issue a session.
  const badLogin = await api('/api/admin/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ password: 'wrong-password' })
  });
  assert.equal(badLogin.status, 401);

  // 3. Valid login issues a cookie accepted by requireAdmin.
  const login = await api('/api/admin/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ password: 'test-admin-password' })
  });
  assert.equal(login.status, 200);
  assert.ok(login.cookie.startsWith('ccjaouhara_admin_session='));
  const cookie = login.cookie;

  // 4. Supabase is the authoritative list source.
  const initialList = await api('/api/orders', {}, cookie);
  assert.equal(initialList.status, 200);
  assert.equal(initialList.body.length, 2);

  // 5. Successful deletion, followed by the same refresh sequence the UI uses.
  const productWritesBeforeDelete = requests.filter(
    (r) => r.pathname === '/rest/v1/products' && r.method !== 'GET'
  ).length;
  const deleted = await api('/api/orders/ORD-TEST-1', { method: 'DELETE' }, cookie);
  assert.equal(deleted.status, 200);
  assert.equal(deleted.body?.id, 'ORD-TEST-1');
  const afterDelete = await api('/api/orders', {}, cookie);
  assert.equal(afterDelete.status, 200);
  assert.equal(afterDelete.body.length, 1);
  assert.equal(afterDelete.body.some((o: any) => o.id === 'ORD-TEST-1'), false);
  assert.equal(
    requests.filter((r) => r.pathname === '/rest/v1/products' && r.method !== 'GET').length,
    productWritesBeforeDelete,
    'deleting an order must not touch product stock'
  );

  // 6. Nonexistent order is a real 404, not a false success.
  const missing = await api('/api/orders/ORD-DOES-NOT-EXIST', { method: 'DELETE' }, cookie);
  assert.equal(missing.status, 404);
  assert.equal(missing.body?.error, 'Order not found');
  const stillOne = await api('/api/orders', {}, cookie);
  assert.equal(stillOne.body.length, 1);

  // 7. Status updates still work after the delete changes.
  const patched = await api('/api/orders/ORD-TEST-2', {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ status: 'shipped' })
  }, cookie);
  assert.equal(patched.status, 200);
  assert.equal(patched.body?.status, 'shipped');
  const afterPatch = await api('/api/orders', {}, cookie);
  assert.equal(afterPatch.body[0]?.status, 'shipped');

  // 8. Supabase read failure surfaces as 500; never a stale local JSON list.
  failOrdersGet = true;
  const dbListError = await api('/api/orders', {}, cookie);
  assert.equal(dbListError.status, 500);
  assert.equal(dbListError.body?.error, 'Failed to retrieve orders');
  assert.match(dbListError.body?.details || '', /simulated orders outage/);
  failOrdersGet = false;

  // 9. Delete database error surfaces as 500 and leaves the order intact.
  failOrdersDelete = true;
  const deleteError = await api('/api/orders/ORD-TEST-2', { method: 'DELETE' }, cookie);
  assert.equal(deleteError.status, 500);
  assert.equal(deleteError.body?.error, 'Failed to delete order');
  assert.match(deleteError.body?.details || '', /simulated delete outage/);
  failOrdersDelete = false;
  const afterFailedDelete = await api('/api/orders', {}, cookie);
  assert.equal(afterFailedDelete.body.length, 1);

  // 10. Missing production auth config fails closed on every runtime path.
  const savedSecret = process.env.ADMIN_SESSION_SECRET;
  delete process.env.ADMIN_SESSION_SECRET;
  const unconfiguredList = await api('/api/orders', {}, cookie);
  assert.equal(unconfiguredList.status, 503);
  assert.match(unconfiguredList.body?.details || '', /ADMIN_SESSION_SECRET/);
  const unconfiguredLogin = await api('/api/admin/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ password: 'test-admin-password' })
  });
  assert.equal(unconfiguredLogin.status, 503);
  process.env.ADMIN_SESSION_SECRET = savedSecret;

  console.log('[admin-orders] mocked tests passed: auth, delete, 404, DB errors, refresh, no stock writes');
} finally {
  await new Promise<void>((resolve) => appServer.close(() => resolve()));
  await new Promise<void>((resolve) => mockDb.close(() => resolve()));
}
