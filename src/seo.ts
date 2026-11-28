import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { SITE_URL } from './config/site';

const INDEXABLE_EXACT_PATHS = new Set([
  '/',
  '/shop',
  '/blog',
  '/faq',
  '/size-guide',
  '/shipping',
  '/about',
  '/press',
  '/contact',
]);

const NOINDEX_FOLLOW_PATHS = new Set(['/track-order']);

const NOINDEX_NOFOLLOW_PATHS = new Set([
  '/cart',
  '/checkout',
  '/order-confirmation',
  '/wishlist',
  '/admin',
]);

function normalizePath(pathname: string): string {
  const path = new URL(pathname, SITE_URL).pathname.replace(/\/+$/, '');
  return path || '/';
}

function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

function ensureSingleMeta(attribute: 'name' | 'property', key: string, content: string): void {
  const selector = `meta[${attribute}="${key}"]`;
  const elements = Array.from(document.querySelectorAll<HTMLMetaElement>(selector));

  if (elements.length === 0) {
    const element = document.createElement('meta');
    element.setAttribute(attribute, key);
    element.setAttribute('content', content);
    document.head.appendChild(element);
    return;
  }

  elements[0].setAttribute('content', content);
  for (const extra of elements.slice(1)) extra.remove();
}

function ensureSingleCanonical(href: string): void {
  const elements = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]'));

  if (elements.length === 0) {
    const element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    element.setAttribute('href', href);
    document.head.appendChild(element);
    return;
  }

  elements[0].setAttribute('href', href);
  for (const extra of elements.slice(1)) extra.remove();
}

function robotsDirective(path: string): string {
  if (NOINDEX_NOFOLLOW_PATHS.has(path)) return 'noindex, nofollow';
  if (NOINDEX_FOLLOW_PATHS.has(path)) return 'noindex, follow';
  if (INDEXABLE_EXACT_PATHS.has(path) || path.startsWith('/blog/') || path.startsWith('/product/')) {
    return 'index, follow';
  }
  return 'noindex, follow';
}

/**
 * Client-side SPA route SEO. This manages canonical/og:url/robots after hydration;
 * it does not add server-rendered SEO to the initial HTML response.
 */
export function useRouteSeo(): void {
  const { pathname } = useLocation();

  useEffect(() => {
    const path = normalizePath(pathname);
    const url = absoluteUrl(path);

    ensureSingleCanonical(url);
    ensureSingleMeta('property', 'og:url', url);
    ensureSingleMeta('name', 'robots', robotsDirective(path));
  }, [pathname]);
}
