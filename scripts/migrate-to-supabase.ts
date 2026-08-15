// ============================================================================
// ccjaouhara — Local JSON -> Supabase data migration (SAFE, IDEMPOTENT)
//
//   * READ-ONLY over data/*.json: no local file is ever written or modified.
//   * Refuses to run unless SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.
//   * Runs a full preflight (files exist, JSON parses, unique PKs, required
//     fields, referential + uniqueness constraints) BEFORE any database write.
//   * Migrates via primary-key upserts (ON CONFLICT (id) DO UPDATE). Running
//     twice produces no duplicates.
//   * Never deletes/truncates a table and never touches rows that are not
//     represented in the local JSON files.
//   * Fails loudly: any table that cannot be upserted aborts the run with a
//     non-zero exit code; it never silently continues.
//   * Verifies the destination after migration and reports real counts.
//
//   Usage: npm run db:migrate:data   (tsx scripts/migrate-to-supabase.ts)
// ============================================================================

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import type { Product, Order, Review, ContactMessage, Subscriber } from '../src/types';

// ----------------------------------------------------------------------------
// Configuration
// ----------------------------------------------------------------------------

const DATA_DIR = path.join(process.cwd(), 'data');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ORDER_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
const REVIEW_STATUSES = ['pending', 'approved', 'rejected'];
const MESSAGE_STATUSES = ['new', 'read'];
const SUBSCRIBER_STATUSES = ['active'];

// ----------------------------------------------------------------------------
// Target (Step 2 schema) row shapes
// ----------------------------------------------------------------------------

interface ProductDbRow {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  category: string;
  material: string;
  color: string;
  rating: number;
  reviews: number;
  seoTitle?: string | null;
  metaDescription?: string | null;
  slug?: string | null;
  imageAltText?: string | null;
  tags?: string[] | null;
  primaryKeyword?: string | null;
  secondaryKeywords?: string[] | null;
}

interface OrderDbRow {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_country: string;
  customer_city: string;
  customer_street: string;
  customer_apartment: string | null;
  payment_method: string;
  order_notes: string | null;
  items: Order['items'];
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  discount_code: string | null;
  total: number;
  idempotency_key: string | null;
  status: Order['status'];
  created_at: string;
}

interface ReviewDbRow {
  id: string;
  product_id: string;
  customer_name: string;
  customer_email: string | null;
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

// ----------------------------------------------------------------------------
// Field mapping helpers (local shape -> Step 2 database columns)
// ----------------------------------------------------------------------------

function productToDb(p: Product): ProductDbRow {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    images: Array.isArray(p.images) ? p.images : [],
    stock: p.stock,
    category: p.category,
    material: p.material,
    color: p.color,
    rating: typeof p.rating === 'number' ? p.rating : 0,
    reviews: typeof p.reviews === 'number' ? p.reviews : 0,
    ...(p.seoTitle !== undefined ? { seoTitle: p.seoTitle } : {}),
    ...(p.metaDescription !== undefined ? { metaDescription: p.metaDescription } : {}),
    ...(p.slug !== undefined ? { slug: p.slug } : {}),
    ...(p.imageAltText !== undefined ? { imageAltText: p.imageAltText } : {}),
    ...(p.tags !== undefined ? { tags: p.tags } : {}),
    ...(p.primaryKeyword !== undefined ? { primaryKeyword: p.primaryKeyword } : {}),
    ...(p.secondaryKeywords !== undefined ? { secondaryKeywords: p.secondaryKeywords } : {})
  };
}

function orderToDb(o: Order): OrderDbRow {
  return {
    id: o.id,
    customer_name: o.customer_name,
    customer_phone: o.customer_phone,
    customer_email: o.customer_email,
    customer_country: o.customer_country,
    customer_city: o.customer_city,
    customer_street: o.customer_street,
    customer_apartment: o.customer_apartment ?? null,
    payment_method: o.payment_method,
    order_notes: o.order_notes ?? null,
    // items is stored as JSONB exactly as supplied. Legacy orders may contain
    // CartItem-shaped entries (extra fields such as id / max_stock): those are
    // preserved verbatim and never rewritten or discarded.
    items: o.items,
    subtotal: o.subtotal,
    shipping_cost: o.shipping_cost,
    discount_amount: o.discount_amount,
    discount_code: o.discount_code ?? null,
    total: o.total,
    // Preserve the stored idempotency_key when present; legacy orders without
    // one stay NULL. No key is ever invented here.
    idempotency_key: o.idempotency_key ?? null,
    status: o.status,
    created_at: o.created_at
  };
}

function reviewToDb(r: Review): ReviewDbRow {
  return {
    id: r.id,
    product_id: r.product_id,
    customer_name: r.customerName,
    customer_email: r.customerEmail ?? null,
    rating: r.rating,
    comment: r.comment,
    created_at: r.createdAt,
    status: r.status
  };
}

function messageToDb(m: ContactMessage): MessageDbRow {
  return {
    id: m.id,
    full_name: m.fullName,
    email: m.email,
    phone: m.phone,
    subject: m.subject,
    message: m.message,
    created_at: m.createdAt,
    status: m.status
  };
}

function subscriberToDb(s: Subscriber): SubscriberDbRow {
  return {
    id: s.id,
    email: s.email,
    created_at: s.createdAt,
    status: s.status
  };
}

// ----------------------------------------------------------------------------
// Preflight checks (run before ANY write)
// ----------------------------------------------------------------------------

function loadJson<T>(table: string, fileName: string): T[] {
  const filePath = path.join(DATA_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Preflight: file not found -> ${filePath}`);
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    if (!Array.isArray(parsed)) {
      throw new Error(`expected a JSON array, got ${typeof parsed}`);
    }
    return parsed as T[];
  } catch (err: any) {
    throw new Error(`Preflight: failed to parse ${filePath}: ${err?.message || err}`);
  }
}

function assertRequiredFields<T extends Record<string, unknown>>(
  table: string,
  rows: T[],
  required: (keyof T & string)[]
): string[] {
  const problems: string[] = [];
  for (const row of rows) {
    for (const field of required) {
      const value = row[field];
      if (value === undefined || value === null || value === '') {
        problems.push(`"${table}" row id=${String(row['id'] ?? '(missing id)')} is missing required field "${field}"`);
      }
    }
  }
  return problems;
}

function preflight(datasets: {
  products: Product[];
  orders: Order[];
  reviews: Review[];
  messages: ContactMessage[];
  subscribers: Subscriber[];
}): string[] {
  const problems: string[] = [];

  // Unique primary keys within each dataset.
  const uniqueBy = (table: string, rows: { id?: string }[]): void => {
    const seen = new Set<string>();
    for (const row of rows) {
      const id = row.id;
      if (id === undefined || id === null || id === '') {
        problems.push(`"${table}" contains a row without a valid "id"`);
        continue;
      }
      if (seen.has(id)) {
        problems.push(`"${table}" contains duplicate id "${id}"`);
      }
      seen.add(id);
    }
  };
  uniqueBy('products', datasets.products);
  uniqueBy('orders', datasets.orders);
  uniqueBy('reviews', datasets.reviews);
  uniqueBy('messages', datasets.messages);
  uniqueBy('subscribers', datasets.subscribers);

  // Required fields per dataset.
  problems.push(
    ...assertRequiredFields('products', datasets.products as unknown as Record<string, unknown>[], [
      'id', 'name', 'description', 'price', 'images', 'stock', 'category', 'material', 'color'
    ])
  );
  problems.push(
    ...assertRequiredFields('orders', datasets.orders as unknown as Record<string, unknown>[], [
      'id', 'customer_name', 'customer_phone', 'customer_email', 'customer_country',
      'customer_city', 'customer_street', 'payment_method', 'items', 'subtotal',
      'shipping_cost', 'discount_amount', 'total', 'status', 'created_at'
    ])
  );
  problems.push(
    ...assertRequiredFields('reviews', datasets.reviews as unknown as Record<string, unknown>[], [
      'id', 'product_id', 'customerName', 'rating', 'comment', 'createdAt', 'status'
    ])
  );
  problems.push(
    ...assertRequiredFields('messages', datasets.messages as unknown as Record<string, unknown>[], [
      'id', 'fullName', 'email', 'message', 'createdAt', 'status'
    ])
  );
  problems.push(
    ...assertRequiredFields('subscribers', datasets.subscribers as unknown as Record<string, unknown>[], [
      'id', 'email', 'createdAt', 'status'
    ])
  );

  // Status values must satisfy the database CHECK constraints.
  for (const o of datasets.orders) {
    if (o.status && !ORDER_STATUSES.includes(o.status)) {
      problems.push(`"orders" row ${o.id} has invalid status "${o.status}"`);
    }
  }
  for (const r of datasets.reviews) {
    if (r.status && !REVIEW_STATUSES.includes(r.status)) {
      problems.push(`"reviews" row ${r.id} has invalid status "${r.status}"`);
    }
  }
  for (const m of datasets.messages) {
    if (m.status && !MESSAGE_STATUSES.includes(m.status)) {
      problems.push(`"messages" row ${m.id} has invalid status "${m.status}"`);
    }
  }
  for (const s of datasets.subscribers) {
    if (s.status && !SUBSCRIBER_STATUSES.includes(s.status)) {
      problems.push(`"subscribers" row ${s.id} has invalid status "${s.status}"`);
    }
  }

  // Order idempotency keys: must be unique (partial unique index) and legacy
  // NULLs must stay NULL — never invent keys.
  const seenKeys = new Set<string>();
  for (const o of datasets.orders) {
    const key = o.idempotency_key ?? null;
    if (key !== null) {
      if (seenKeys.has(key)) {
        problems.push(`"orders" contains duplicate idempotency_key "${key}"`);
      }
      seenKeys.add(key);
    }
  }

  // Every review must reference an existing product (FK constraint).
  const productIds = new Set(datasets.products.map(p => p.id));
  for (const r of datasets.reviews) {
    if (!productIds.has(r.product_id)) {
      problems.push(`"reviews" row ${r.id} references unknown product_id "${r.product_id}"`);
    }
  }

  // Subscriber emails must satisfy the lower(email) unique index and be valid
  // enough to never violate the NOT NULL / format expectations.
  const lowerEmails = new Set<string>();
  for (const s of datasets.subscribers) {
    const email = String(s.email || '').trim();
    if (!email) {
      problems.push(`"subscribers" row ${s.id} has an empty email`);
      continue;
    }
    if (!EMAIL_RE.test(email)) {
      problems.push(`"subscribers" row ${s.id} has an invalid email "${email}"`);
    }
    const lower = email.toLowerCase();
    if (lowerEmails.has(lower)) {
      problems.push(`"subscribers" contains duplicate email "${email}" (case-insensitive unique index)`);
    }
    lowerEmails.add(lower);
  }

  return problems;
}

// ----------------------------------------------------------------------------
// Migration (primary-key upserts, per table)
// ----------------------------------------------------------------------------

async function upsertTable(supabase: any, table: string, rows: object[]): Promise<void> {
  if (rows.length === 0) {
    console.log(`[migrate] "${table}": no rows to migrate (skipped)`);
    return;
  }
  const { error } = await supabase.from(table).upsert(rows, { onConflict: 'id' });
  if (error) {
    throw new Error(`Table "${table}": upsert of ${rows.length} rows FAILED: ${error.message}`);
  }
  console.log(`[migrate] upserted ${rows.length} rows -> "${table}" (idempotent, ON CONFLICT (id))`);
}

// ----------------------------------------------------------------------------
// Post-migration verification
// ----------------------------------------------------------------------------

async function fetchAll(supabase: any, table: string, select: string): Promise<any[]> {
  const { data, error } = await supabase.from(table).select(select);
  if (error) {
    throw new Error(`Verification: cannot read "${table}" after migration: ${error.message}`);
  }
  return (data ?? []) as any[];
}

async function verifyCounts(
  supabase: any,
  datasets: {
    products: Product[];
    orders: Order[];
    reviews: Review[];
    messages: ContactMessage[];
    subscribers: Subscriber[];
  },
  localCounts: Record<string, number>
): Promise<void> {
  const problems: string[] = [];
  const productRows = await fetchAll(supabase, 'products', 'id');
  const orderRows = await fetchAll(supabase, 'orders', 'id,idempotency_key');
  const reviewRows = await fetchAll(supabase, 'reviews', 'id');
  const messageRows = await fetchAll(supabase, 'messages', 'id');
  const subscriberRows = await fetchAll(supabase, 'subscribers', 'id');

  const counts: Record<string, number> = {
    products: productRows.length,
    orders: orderRows.length,
    reviews: reviewRows.length,
    messages: messageRows.length,
    subscribers: subscriberRows.length
  };

  for (const table of ['products', 'orders', 'reviews', 'messages', 'subscribers']) {
    const local = localCounts[table];
    const remote = counts[table];
    if (local !== remote) {
      problems.push(`"${table}": local count=${local} but database count=${remote}`);
    }
  }

  const dbProductIds = new Set(productRows.map((r: any) => r.id));
  const dbReviewIds = new Set(reviewRows.map((r: any) => r.id));
  const dbMessageIds = new Set(messageRows.map((r: any) => r.id));
  const dbSubscriberIds = new Set(subscriberRows.map((r: any) => r.id));

  for (const p of datasets.products) {
    if (!dbProductIds.has(p.id)) problems.push(`"products": id "${p.id}" missing in database`);
  }
  for (const r of datasets.reviews) {
    if (!dbReviewIds.has(r.id)) problems.push(`"reviews": id "${r.id}" missing in database`);
  }
  for (const m of datasets.messages) {
    if (!dbMessageIds.has(m.id)) problems.push(`"messages": id "${m.id}" missing in database`);
  }
  for (const s of datasets.subscribers) {
    if (!dbSubscriberIds.has(s.id)) problems.push(`"subscribers": id "${s.id}" missing in database`);
  }

  // Orders: every local id present, idempotency keys preserved (NULL stays
  // NULL, no duplicates among non-NULL keys).
  const dbOrders = new Map(orderRows.map((r: any) => [r.id, r.idempotency_key ?? null]));
  const dbSeenKeys = new Set<string>();
  for (const r of orderRows) {
    const key = r.idempotency_key ?? null;
    if (key !== null) {
      if (dbSeenKeys.has(key)) {
        problems.push(`"orders": duplicate idempotency_key "${key}" in database`);
      }
      dbSeenKeys.add(key);
    }
  }
  for (const o of datasets.orders) {
    if (!dbOrders.has(o.id)) {
      problems.push(`"orders": id "${o.id}" missing in database`);
      continue;
    }
    const localKey = o.idempotency_key ?? null;
    const dbKey = dbOrders.get(o.id);
    if (dbKey !== localKey) {
      problems.push(
        `"orders": id "${o.id}" idempotency_key mismatch (local=${JSON.stringify(localKey)}, db=${JSON.stringify(dbKey)})`
      );
    }
  }

  if (problems.length > 0) {
    throw new Error('Post-migration verification FAILED:\n- ' + problems.join('\n- '));
  }

  console.log('[migrate] VERIFIED against database:');
  for (const table of ['products', 'orders', 'reviews', 'messages', 'subscribers']) {
    console.log(`[migrate]   ${table} = ${counts[table]}`);
  }
  console.log('[migrate]   all local order ids present, idempotency keys preserved, legacy NULL keys remain NULL, no duplicate keys');
}

// ----------------------------------------------------------------------------
// Entry point
// ----------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log('[migrate] ccjaouhara data migration (local JSON -> Supabase)');

  const supabaseUrl = process.env.SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error(
      '[migrate] ABORT: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required. Refusing to run.'
    );
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  // 1) Read all five JSON files (READ-ONLY — nothing is ever written to disk).
  const products = loadJson<Product>('products', 'products.json');
  const orders = loadJson<Order>('orders', 'orders.json');
  const reviews = loadJson<Review>('reviews', 'reviews.json');
  const messages = loadJson<ContactMessage>('messages', 'messages.json');
  const subscribers = loadJson<Subscriber>('subscribers', 'subscribers.json');

  const localCounts: Record<string, number> = {
    products: products.length,
    orders: orders.length,
    reviews: reviews.length,
    messages: messages.length,
    subscribers: subscribers.length
  };

  console.log('[migrate] Local JSON counts:', JSON.stringify(localCounts));

  // 2) Preflight: abort before writing anything if any check fails.
  const problems = preflight({ products, orders, reviews, messages, subscribers });
  if (problems.length > 0) {
    throw new Error('Preflight FAILED — no writes were performed:\n- ' + problems.join('\n- '));
  }
  console.log('[migrate] Preflight passed: files exist, JSON parses, ids unique, required fields present, constraints satisfied');

  // 3) Connect with the service role (bypasses RLS).
  const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });

  // 4) Migrate each table in dependency order (products before reviews, which
  //    holds a product FK). Any failure aborts the run with a non-zero exit.
  await upsertTable(supabase, 'products', products.map(productToDb));
  await upsertTable(supabase, 'orders', orders.map(orderToDb));
  await upsertTable(supabase, 'reviews', reviews.map(reviewToDb));
  await upsertTable(supabase, 'messages', messages.map(messageToDb));
  await upsertTable(supabase, 'subscribers', subscribers.map(subscriberToDb));

  // 5) Verify against the live database.
  await verifyCounts(supabase, { products, orders, reviews, messages, subscribers }, localCounts);

  console.log('[migrate] DONE. Local JSON was NOT modified; destination is verified.');
}

main().then(
  () => {
    process.exitCode = 0;
  },
  (err: any) => {
    console.error('[migrate] FATAL:', err?.message || err);
    process.exitCode = 1;
  }
);
