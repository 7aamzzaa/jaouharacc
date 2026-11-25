// ============================================================================
// CCJAOUHARA — standalone missing-product recovery
//
// SAFETY MODEL
//   * Default mode is READ-ONLY dry-run. Nothing is written unless --apply is
//     passed together with --backup-confirmed.
//   * Source of truth for the recovery payload is data/products.json only.
//   * Plain INSERT only. No upsert, no on_conflict, no update, no delete.
//   * Existing product rows are never modified. Orders/reviews/messages are
//     never read or written by this script.
//   * Offline validation is supported with --existing-ids so no Production
//     connection is required while testing the script.
// ============================================================================

import fs from 'fs';
import path from 'path';
import type { Product } from '../src/types';

const SOURCE_FILE = path.join(process.cwd(), 'data', 'products.json');
const EXPECTED_PRODUCT_COUNT = 25;

const VALUE_FLAGS = ['--existing-ids', '--existing-ids-file', '--target', '--backup-ref'];
const BOOL_FLAGS = ['--apply', '--backup-confirmed', '--allow-production-target', '--help'];

interface CliOptions {
  apply: boolean;
  backupConfirmed: boolean;
  allowProductionTarget: boolean;
  help: boolean;
  existingIds?: string;
  existingIdsFile?: string;
  target?: string;
  backupRef?: string;
}

interface SupabaseConfig {
  url: string;
  serviceKey: string;
}

function usage(): string {
  return `
CCJAOUHARA missing-product recovery

Usage:
  npm run db:recover-products
      READ-ONLY dry-run. Fetches existing product IDs from Supabase.

  npm run db:recover-products -- --existing-ids CCJ-ANK-001,CCJ-ANK-002
      READ-ONLY offline validation. No network access at all.

  npm run db:recover-products -- --apply --backup-confirmed --target staging \\
      --backup-ref "backup file or snapshot id"
      Writes ONLY missing products. Requires a freshly confirmed backup.

Optional safety gate:
  --allow-production-target   Required in addition to --target if the target
                              label contains "prod".

Rules:
  - Defaults to dry-run; --apply is mandatory for any write.
  - Plain INSERT only; never upsert/overwrite existing product rows.
  - Source must contain exactly ${EXPECTED_PRODUCT_COUNT} unique CCJ-* products.
  - Orders, reviews, messages and existing stock are untouched.
`;
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    apply: false,
    backupConfirmed: false,
    allowProductionTarget: false,
    help: false
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (BOOL_FLAGS.includes(arg)) {
      if (arg === '--apply') options.apply = true;
      if (arg === '--backup-confirmed') options.backupConfirmed = true;
      if (arg === '--allow-production-target') options.allowProductionTarget = true;
      if (arg === '--help') options.help = true;
      continue;
    }
    if (VALUE_FLAGS.includes(arg)) {
      const value = argv[++i];
      if (!value) throw new Error(`${arg} requires a value.`);
      if (arg === '--existing-ids') options.existingIds = value;
      if (arg === '--existing-ids-file') options.existingIdsFile = value;
      if (arg === '--target') options.target = value;
      if (arg === '--backup-ref') options.backupRef = value;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (options.existingIds && options.existingIdsFile) {
    throw new Error('Use either --existing-ids or --existing-ids-file, not both.');
  }
  return options;
}

function loadSourceProducts(): Product[] {
  if (!fs.existsSync(SOURCE_FILE)) {
    throw new Error(`Source file not found: ${SOURCE_FILE}`);
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(fs.readFileSync(SOURCE_FILE, 'utf-8'));
  } catch (err: any) {
    throw new Error(`Failed to parse ${SOURCE_FILE}: ${err?.message || err}`);
  }
  if (!Array.isArray(parsed)) {
    throw new Error(`Source must be a JSON array, got ${typeof parsed}.`);
  }
  return parsed as Product[];
}

function validateSource(products: Product[]): void {
  if (products.length !== EXPECTED_PRODUCT_COUNT) {
    throw new Error(`Source must contain exactly ${EXPECTED_PRODUCT_COUNT} products; found ${products.length}.`);
  }

  const seen = new Set<string>();
  for (const product of products) {
    const id = typeof product.id === 'string' ? product.id.trim() : '';
    if (!id.startsWith('CCJ-')) {
      throw new Error(`Invalid product id "${id || '(empty)'}" — only CCJ-* products are allowed.`);
    }
    if (seen.has(id)) {
      throw new Error(`Duplicate product id in source: ${id}`);
    }
    seen.add(id);

    if (!product.name || !product.description) {
      throw new Error(`${id}: name and description are required.`);
    }
    if (typeof product.price !== 'number' || !Number.isFinite(product.price) || product.price <= 0) {
      throw new Error(`${id}: price must be a positive number.`);
    }
    if (typeof product.stock !== 'number' || !Number.isInteger(product.stock) || product.stock < 0) {
      throw new Error(`${id}: stock must be a non-negative integer.`);
    }
    if (!Array.isArray(product.images) || product.images.length === 0) {
      throw new Error(`${id}: at least one image is required.`);
    }
    if (!product.category || !product.material || !product.color) {
      throw new Error(`${id}: category, material and color are required.`);
    }
  }

  if (seen.size !== EXPECTED_PRODUCT_COUNT) {
    throw new Error(`Source must contain ${EXPECTED_PRODUCT_COUNT} unique ids; found ${seen.size}.`);
  }
}

function parseExistingIdsCsv(raw: string): string[] {
  return raw
    .split(/[\s,]+/)
    .map((id) => id.trim())
    .filter(Boolean);
}

function readSupabaseConfig(): SupabaseConfig {
  const url = (process.env.SUPABASE_URL || '').trim().replace(/\/+$/, '');
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  if (!url || !serviceKey) {
    throw new Error(
      'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be exported in the environment for a live Supabase read/write. ' +
      'Use --existing-ids for offline dry-run validation.'
    );
  }
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error('SUPABASE_URL is not a valid URL.');
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('SUPABASE_URL must use http or https.');
  }
  return { url, serviceKey };
}

function supabaseHeaders(config: SupabaseConfig, extra: Record<string, string> = {}): Record<string, string> {
  return {
    apikey: config.serviceKey,
    Authorization: `Bearer ${config.serviceKey}`,
    Accept: 'application/json',
    ...extra
  };
}

async function fetchExistingIds(config: SupabaseConfig): Promise<string[]> {
  const endpoint = `${config.url}/rest/v1/products?select=id`;
  const response = await fetch(endpoint, { headers: supabaseHeaders(config) });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase product ID read failed (HTTP ${response.status}): ${body.slice(0, 500)}`);
  }
  const rows = await response.json();
  if (!Array.isArray(rows)) {
    throw new Error('Supabase product ID read did not return a JSON array.');
  }
  const ids = rows
    .map((row: any) => (typeof row?.id === 'string' ? row.id.trim() : ''))
    .filter(Boolean);
  const unique = [...new Set(ids)];
  if (unique.length !== ids.length) {
    throw new Error('Supabase returned duplicate product ids; refusing to continue.');
  }
  return unique.sort();
}

async function fetchRowsByIds(config: SupabaseConfig, ids: string[]): Promise<any[]> {
  if (ids.length === 0) return [];
  const params = new URLSearchParams({ select: '*', id: `in.(${ids.join(',')})` });
  const response = await fetch(`${config.url}/rest/v1/products?${params.toString()}`, {
    headers: supabaseHeaders(config)
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase product verification read failed (HTTP ${response.status}): ${body.slice(0, 500)}`);
  }
  const rows = await response.json();
  if (!Array.isArray(rows)) {
    throw new Error('Supabase product verification read did not return a JSON array.');
  }
  return rows;
}

async function insertMissingProducts(config: SupabaseConfig, products: Product[]): Promise<any[]> {
  const response = await fetch(`${config.url}/rest/v1/products`, {
    method: 'POST',
    headers: supabaseHeaders(config, {
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    }),
    body: JSON.stringify(products)
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Supabase product INSERT failed (HTTP ${response.status}): ${body.slice(0, 500)}. ` +
      'No upsert/on_conflict was used; nothing was overwritten.'
    );
  }
  const rows = await response.json();
  if (!Array.isArray(rows)) {
    throw new Error('Supabase INSERT response was not a JSON array.');
  }
  return rows;
}

function optionalEqual(source: unknown, stored: unknown): boolean {
  const normalize = (value: unknown) => (value === undefined || value === null ? undefined : value);
  const a = normalize(source);
  const b = normalize(stored);
  if (Array.isArray(a) || Array.isArray(b)) {
    return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
  }
  return a === b;
}

function verifyRestoredRows(source: Product[], storedRows: any[]): void {
  const byId = new Map<string, any>();
  for (const row of storedRows) {
    if (typeof row?.id === 'string') byId.set(row.id, row);
  }

  for (const expected of source) {
    const actual = byId.get(expected.id);
    if (!actual) {
      throw new Error(`Verification failed: restored row ${expected.id} is missing.`);
    }
    const comparedFields: (keyof Product)[] = [
      'id', 'name', 'description', 'price', 'images', 'stock', 'category',
      'material', 'color', 'seoTitle', 'metaDescription', 'slug',
      'imageAltText', 'tags', 'primaryKeyword', 'secondaryKeywords'
    ];
    for (const field of comparedFields) {
      if (!optionalEqual(expected[field], actual[field])) {
        throw new Error(
          `Verification failed for ${expected.id}: field "${field}" differs from data/products.json.`
        );
      }
    }
  }
}

function printVerificationProcedure(): void {
  console.log(`
BEFORE / AFTER VERIFICATION PROCEDURE
  BEFORE (now):
    1. Record product count and IDs from Supabase.
    2. Record counts for orders, reviews, messages and subscribers.
    3. Confirm a fresh backup exists (products table at minimum).

  AFTER a future approved --apply run:
    1. Re-run this script in dry-run mode; it must report 0 missing products.
    2. Supabase products table must contain exactly ${EXPECTED_PRODUCT_COUNT} CCJ IDs.
    3. CCJ-ANK-001 and CCJ-ANK-002 must be unchanged, including stock 10.
    4. Orders, reviews, messages and subscriber counts must be unchanged.
    5. Confirm the shop shows the restored products; do not re-run the general migration.
`);
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }

  const source = loadSourceProducts();
  validateSource(source);
  const sourceById = new Map(source.map((p) => [p.id, p]));

  let offlineIds: string[] | null = null;
  if (options.existingIds !== undefined) {
    offlineIds = parseExistingIdsCsv(options.existingIds);
  } else if (options.existingIdsFile !== undefined) {
    const raw = fs.readFileSync(options.existingIdsFile, 'utf-8');
    offlineIds = parseExistingIdsCsv(raw.replace(/,/g, '\n'));
  }

  if (options.apply && offlineIds) {
    throw new Error('--apply requires fresh Supabase state; offline --existing-ids overrides are dry-run only.');
  }
  if (options.apply) {
    if (!options.backupConfirmed) {
      throw new Error('Refusing to write: confirm a fresh backup with --backup-confirmed.');
    }
    if (!options.target) {
      throw new Error('Refusing to write: supply --target <environment-label>.');
    }
    if (/prod/i.test(options.target) && !options.allowProductionTarget) {
      throw new Error(
        'Refusing to write to a production-looking target without --allow-production-target.'
      );
    }
  }

  const config = offlineIds ? null : readSupabaseConfig();
  const mode = options.apply ? 'APPLY' : 'DRY-RUN (read-only)';

  console.log(`MODE: ${mode}`);
  console.log(`SOURCE: ${SOURCE_FILE}`);
  console.log(`SOURCE CHECK: ${source.length} products, ${sourceById.size} unique CCJ ids — OK`);

  let existingIds: string[];
  if (offlineIds) {
    existingIds = [...new Set(offlineIds)].sort();
    console.log('EXISTING-ID SOURCE: OFFLINE override (no Supabase connection)');
  } else {
    existingIds = await fetchExistingIds(config!);
    console.log('EXISTING-ID SOURCE: Supabase products table (read-only)');
  }

  const existingSet = new Set(existingIds);
  const missing = source.filter((p) => !existingSet.has(p.id));
  const unexpectedExisting = existingIds.filter((id) => !sourceById.has(id));

  console.log(`\nBEFORE: existing product ids (${existingIds.length}):`);
  console.log(existingIds.length ? `  ${existingIds.join(', ')}` : '  (none)');
  if (unexpectedExisting.length) {
    console.log(`BEFORE: existing ids not present in source (${unexpectedExisting.length}):`);
    console.log(`  ${unexpectedExisting.join(', ')}`);
  }

  console.log(`\nRECOVERY PLAN: ${missing.length} missing product(s) would be INSERTED:`);
  for (const product of missing) {
    console.log(`  ${product.id} | ${product.name} | stock ${product.stock}`);
  }

  if (!options.apply) {
    console.log('\nNO DATABASE WRITES PERFORMED. Dry-run complete.');
    printVerificationProcedure();
    return;
  }

  // Re-read immediately before writing so a concurrent change cannot make the
  // plan stale. If it changed, abort rather than guess.
  const freshExistingIds = await fetchExistingIds(config!);
  if (JSON.stringify(freshExistingIds) !== JSON.stringify(existingIds)) {
    throw new Error('Supabase product ids changed since the plan was read. Re-run the script before applying.');
  }

  console.log(`\nBACKUP: --backup-confirmed supplied; reference: ${options.backupRef || '(not provided)'}`);
  console.log(`TARGET: ${options.target}`);
  console.log('INSERT MODE: plain INSERT only (no upsert / no on_conflict / no update / no delete).');

  const inserted = await insertMissingProducts(config!, missing);
  if (inserted.length !== missing.length) {
    throw new Error(
      `Insert response count mismatch: expected ${missing.length}, received ${inserted.length}. Verify manually.`
    );
  }

  const afterIds = await fetchExistingIds(config!);
  const afterSet = new Set(afterIds);
  for (const id of existingIds) {
    if (!afterSet.has(id)) throw new Error(`Verification failed: pre-existing product ${id} disappeared.`);
  }
  for (const product of missing) {
    if (!afterSet.has(product.id)) throw new Error(`Verification failed: ${product.id} was not present after insert.`);
  }
  if (afterIds.length !== EXPECTED_PRODUCT_COUNT) {
    throw new Error(`Verification failed: expected ${EXPECTED_PRODUCT_COUNT} products after recovery, found ${afterIds.length}.`);
  }

  const restoredRows = await fetchRowsByIds(config!, missing.map((p) => p.id));
  verifyRestoredRows(missing, restoredRows);

  console.log(`\nAFTER: product count ${afterIds.length}; all ${missing.length} restored rows verified field-by-field.`);
  console.log('AFTER: no pre-existing product id was removed or modified by this script.');
  printVerificationProcedure();
}

main().catch((err: any) => {
  console.error(`\nRECOVERY ABORTED: ${err?.message || err}`);
  process.exitCode = 1;
});
