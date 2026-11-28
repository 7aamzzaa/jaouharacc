import assert from 'node:assert/strict';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';

// Keep dotenv from reading the repository .env: all config below is test-only.
process.env.DOTENV_CONFIG_PATH = path.join(os.tmpdir(), 'ccjaouhara-review-privacy-test.env');
process.env.NODE_ENV = 'test';
process.env.VERCEL = '1';
process.env.ADMIN_PASSWORD = 'test-admin-password';
process.env.ADMIN_SESSION_SECRET = 'test-review-session-secret-not-from-env-file';

type DbRow = Record<string, unknown>;

const SAFE_PUBLIC_KEYS = [
  'createdAt',
  'customerName',
  'comment',
  'id',
  'product_id',
  'rating'
].sort();
const PRIVATE_KEY_NAMES = ['customerEmail', 'customer_email', 'status'];

const reviewRows: DbRow[] = [
  {
    id: 'REV-APPROVED',
    product_id: 'prod-1',
    customer_name: 'Approved Customer',
    customer_email: 'approved.customer@example.com',
    rating: 5,
    comment: 'Beautiful necklace',
    created_at: '2026-01-01T00:00:00.000Z',
    status: 'approved'
  },
  {
    id: 'REV-PENDING',
    product_id: 'prod-1',
    customer_name: 'Pending Customer',
    customer_email: 'pending.customer@example.com',
    rating: 4,
    comment: 'Awaiting moderation',
    created_at: '2026-01-02T00:00:00.000Z',
    status: 'pending'
  },
  {
    id: 'REV-REJECTED',
    product_id: 'prod-1',
    customer_name: 'Rejected Customer',
    customer_email: 'rejected.customer@example.com',
    rating: 2,
    comment: 'Not published',
    created_at: '2026-01-03T00:00:00.000Z',
    status: 'rejected'
  }
];

const requests: { method: string; pathname: string }[] = [];
let lastInsertBody: DbRow | null = null;

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

function targetId(url: URL): string | undefined {
  const raw = url.searchParams.get('id');
  return raw?.startsWith('eq.') ? raw.slice(3) : undefined;
}

const mockDb = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', 'http://localhost');
  requests.push({ method: req.method || '', pathname: url.pathname });

  if (url.pathname === '/rest/v1/reviews') {
    if (req.method === 'GET') return sendJson(res, 200, reviewRows);

    if (req.method === 'POST') {
      const body = await readBody(req);
      lastInsertBody = body;
      const created: DbRow = {
        id: 'REV-CREATED-TEST',
        product_id: body?.product_id,
        customer_name: body?.customer_name,
        customer_email: body?.customer_email,
        rating: body?.rating,
        comment: body?.comment,
        created_at: '2026-01-04T00:00:00.000Z',
        status: body?.status ?? 'pending'
      };
      return sendJson(res, 200, wantsSingle(req) ? created : [created]);
    }

    if (req.method === 'PATCH') {
      const id = targetId(url);
      const body = await readBody(req);
      const row = reviewRows.find((r) => r.id === id);
      if (!row) return sendJson(res, 200, wantsSingle(req) ? null : []);
      const updated: DbRow = { ...row, ...(body?.status ? { status: body.status } : {}) };
      return sendJson(res, 200, wantsSingle(req) ? updated : [updated]);
    }
  }

  // No other table should be read or written by these review endpoints.
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

function assertSafePublicReview(review: any, label: string) {
  assert.ok(review && typeof review === 'object', `${label} must be an object`);
  assert.deepEqual(
    Object.keys(review).sort(),
    SAFE_PUBLIC_KEYS,
    `${label} must contain only the public allowlist fields`
  );
  for (const key of PRIVATE_KEY_NAMES) {
    assert.equal(key in review, false, `${label} must not expose ${key}`);
  }
}

try {
  // 1. Public GET returns approved reviews only, with an exact safe-field allowlist.
  const publicList = await api('/api/reviews?product_id=prod-1');
  assert.equal(publicList.status, 200);
  assert.equal(Array.isArray(publicList.body), true);
  assert.equal(publicList.body.length, 1);
  assertSafePublicReview(publicList.body[0], 'public GET review');
  assert.equal(publicList.body[0].id, 'REV-APPROVED');
  assert.equal(publicList.body[0].product_id, 'prod-1');
  assert.equal(publicList.body[0].customerName, 'Approved Customer');
  assert.equal(publicList.body[0].rating, 5);
  assert.equal(publicList.body[0].comment, 'Beautiful necklace');
  assert.equal(publicList.body[0].createdAt, '2026-01-01T00:00:00.000Z');

  // No private key name or stored email can survive serialization.
  const publicText = JSON.stringify(publicList.body);
  for (const needle of [
    'customerEmail',
    'customer_email',
    '"status"',
    'approved.customer@example.com',
    'pending.customer@example.com',
    'rejected.customer@example.com'
  ]) {
    assert.equal(publicText.includes(needle), false, `public GET must not include ${needle}`);
  }

  // 2. Unfiltered public GET stays admin-only and still leaks nothing.
  const unauthenticated = await api('/api/reviews');
  assert.equal(unauthenticated.status, 401);
  assert.equal(unauthenticated.body?.error, 'Unauthorized');
  assert.equal(JSON.stringify(unauthenticated.body).includes('@example.com'), false);

  // 3. Admin reads and moderation endpoints keep their full internal shape.
  const login = await api('/api/admin/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ password: 'test-admin-password' })
  });
  assert.equal(login.status, 200);
  const cookie = login.cookie;
  assert.ok(cookie.startsWith('ccjaouhara_admin_session='));

  const adminList = await api('/api/reviews', {}, cookie);
  assert.equal(adminList.status, 200);
  assert.equal(adminList.body.length, 3);
  assert.equal(adminList.body[0].customerEmail, 'approved.customer@example.com');
  assert.equal(adminList.body[0].status, 'approved');

  const patched = await api('/api/reviews/REV-PENDING', {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ status: 'approved' })
  }, cookie);
  assert.equal(patched.status, 200);
  assert.equal(patched.body.customerEmail, 'pending.customer@example.com');
  assert.equal(patched.body.status, 'approved');

  // 4. Public POST stores the email server-side but returns only safe fields.
  const submitted = await api('/api/reviews', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      product_id: 'prod-2',
      customerName: 'Post Customer',
      customerEmail: 'post.customer@example.com',
      rating: 4,
      comment: 'Fast delivery'
    })
  });
  assert.equal(submitted.status, 200);
  assertSafePublicReview(submitted.body, 'public POST response');
  const submittedText = JSON.stringify(submitted.body);
  for (const needle of ['customerEmail', 'customer_email', '"status"', 'post.customer@example.com']) {
    assert.equal(submittedText.includes(needle), false, `public POST must not include ${needle}`);
  }

  // Stored review data is unchanged: email + pending moderation status still reach Supabase.
  assert.ok(lastInsertBody, 'mock Supabase must receive an insert');
  assert.equal(lastInsertBody.customer_email, 'post.customer@example.com');
  assert.equal(lastInsertBody.status, 'pending');
  assert.equal(lastInsertBody.customer_name, 'Post Customer');

  // 5. No order or product writes were triggered by the review endpoints.
  const unexpectedWrites = requests.filter((r) => r.method !== 'GET' && r.pathname !== '/rest/v1/reviews');
  assert.deepEqual(unexpectedWrites, [], 'review endpoints must not write to other tables');

  console.log('[review-privacy] mocked tests passed: public allowlist, no email/status leak, admin shape unchanged');
} finally {
  await new Promise<void>((resolve) => appServer.close(() => resolve()));
  await new Promise<void>((resolve) => mockDb.close(() => resolve()));
}
