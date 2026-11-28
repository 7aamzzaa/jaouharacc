import { GA4_EVENTS, ensureGtagStub } from '../config/analytics';
import { SITE_URL } from '../config/site';
import { hasAnalyticsConsent } from './consent';

export interface AnalyticsProductInput {
  id: string;
  name: string;
  category?: string;
  price?: number;
  variantId?: string;
  variantLabel?: string;
  quantity?: number;
}

function canSend(): boolean {
  return typeof window !== 'undefined' && hasAnalyticsConsent();
}

function buildItem(input: AnalyticsProductInput) {
  return {
    item_id: input.id,
    item_name: input.name,
    item_category: input.category,
    item_variant: input.variantLabel || input.variantId,
    price: input.price,
    quantity: Math.max(1, Math.floor(input.quantity ?? 1)),
  };
}

function send(event: string, params: Record<string, unknown>): void {
  if (!canSend()) return;
  ensureGtagStub();
  window.gtag('event', event, params);
}

export function trackPageView(input: { path: string; referrer?: string }): void {
  const path = input.path.startsWith('/') ? input.path : `/${input.path}`;
  send(GA4_EVENTS.pageView, {
    page_location: `${SITE_URL}${path}`,
    page_path: path,
    page_referrer: input.referrer || '',
  });
}

export function trackViewItem(input: AnalyticsProductInput): void {
  send(GA4_EVENTS.viewItem, {
    currency: 'MAD',
    value: input.price ?? 0,
    items: [buildItem({ ...input, quantity: 1 })],
  });
}

export function trackAddToCart(input: AnalyticsProductInput): void {
  const quantity = Math.max(1, Math.floor(input.quantity ?? 1));
  send(GA4_EVENTS.addToCart, {
    currency: 'MAD',
    value: typeof input.price === 'number' ? input.price * quantity : undefined,
    items: [buildItem({ ...input, quantity })],
  });
}