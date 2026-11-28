import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { SITE_URL } from '../src/config/site.ts';
import { defaultBlogPosts } from '../src/data/defaultBlogPosts.ts';
import { defaultProducts } from '../src/data/defaultProducts.ts';

type CatalogProduct = { id?: string; slug?: string };

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(projectRoot, 'public', 'sitemap.xml');

const STATIC_INDEXABLE_PATHS = [
  '/',
  '/shop',
  '/blog',
  '/faq',
  '/size-guide',
  '/shipping',
  '/about',
  '/press',
  '/contact',
  '/privacy',
];

function normalizeSlug(slug: unknown, label: string): string {
  if (typeof slug !== 'string' || slug.trim() === '') {
    throw new Error(`Missing slug for ${label}`);
  }

  const normalized = slug.trim();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized)) {
    throw new Error(`Malformed slug for ${label}: ${normalized}`);
  }

  return normalized;
}

function assertUnique(values: string[], label: string): void {
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
  if (duplicates.length > 0) {
    throw new Error(`Duplicate ${label}: ${Array.from(new Set(duplicates)).join(', ')}`);
  }
}

function escapeXml(value: string): string {
  return value.replace(/[<>&"']/g, (character) => {
    switch (character) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '"': return '&quot;';
      default: return '&apos;';
    }
  });
}

function readCatalogSlugs(): string[] {
  const catalogPath = path.join(projectRoot, 'data', 'products.json');
  const products = JSON.parse(fs.readFileSync(catalogPath, 'utf8')) as CatalogProduct[];

  if (!Array.isArray(products) || products.length === 0) {
    throw new Error('Product catalog is empty or invalid');
  }

  const catalogById = new Map<string, string>();
  for (const product of products) {
    if (!product.id) throw new Error('Product catalog contains a record without an id');
    if (catalogById.has(product.id)) throw new Error(`Duplicate product id: ${product.id}`);
    catalogById.set(product.id, normalizeSlug(product.slug, `product ${product.id}`));
  }

  const mirrorIds = defaultProducts.map((product) => product.id);
  assertUnique(mirrorIds, 'mirrored product id');
  if (mirrorIds.length !== catalogById.size) {
    throw new Error('Product catalog and trusted mirror have different product counts');
  }

  for (const product of defaultProducts) {
    const catalogSlug = catalogById.get(product.id);
    if (catalogSlug !== product.slug) {
      throw new Error(`Product slug mismatch for ${product.id}: catalog=${catalogSlug ?? 'missing'} mirror=${product.slug ?? 'missing'}`);
    }
  }

  const slugs = Array.from(catalogById.values());
  assertUnique(slugs, 'product slug');
  return slugs;
}

function buildPaths(): string[] {
  const productPaths = readCatalogSlugs().map((slug) => `/product/${slug}`);
  const blogPaths = defaultBlogPosts.map((post) => {
    const slug = normalizeSlug(post.slug, `blog post ${post.id ?? 'unknown'}`);
    return `/blog/${slug}`;
  });

  assertUnique(blogPaths, 'blog path');

  const paths = [...STATIC_INDEXABLE_PATHS, ...blogPaths, ...productPaths];
  assertUnique(paths, 'sitemap path');

  return paths;
}

function generate(): void {
  if (/vercel\.app/i.test(SITE_URL)) {
    throw new Error(`Refusing to generate a sitemap for a Vercel preview domain: ${SITE_URL}`);
  }
  if (!SITE_URL.startsWith('https://')) {
    throw new Error(`SITE_URL must use HTTPS: ${SITE_URL}`);
  }

  const paths = buildPaths();
  const urls = paths.map((route) => `${SITE_URL}${route}`);

  for (const url of urls) {
    if (/vercel\.app/i.test(url)) throw new Error(`Refusing Vercel URL in sitemap: ${url}`);
    if (!url.startsWith(`${SITE_URL}/`)) throw new Error(`Invalid sitemap URL: ${url}`);
  }

  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];

  for (const url of urls) {
    lines.push('  <url>');
    lines.push(`    <loc>${escapeXml(url)}</loc>`);
    lines.push('  </url>');
  }

  lines.push('</urlset>', '');
  fs.writeFileSync(outputPath, lines.join('\n'), 'utf8');

  const productCount = paths.filter((route) => route.startsWith('/product/')).length;
  const blogCount = paths.filter((route) => route.startsWith('/blog/')).length;
  console.log(`Generated ${outputPath}: ${urls.length} URLs (${productCount} products, ${blogCount} blog articles).`);
}

generate();
