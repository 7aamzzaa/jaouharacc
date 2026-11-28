export const GA4_MEASUREMENT_ID = 'G-CDFRLYK1W3';

export const GA4_EVENTS = {
  pageView: 'page_view',
  viewItem: 'view_item',
  addToCart: 'add_to_cart',
} as const;

export const CONSENT_STORAGE_KEY = 'ccjaouhara_cookie_consent_v1';
export const CONSENT_CHANGED_EVENT = 'ccjaouhara:consent-changed';
export const OPEN_COOKIE_SETTINGS_EVENT = 'ccjaouhara:open-cookie-settings';
export const GA4_SCRIPT_ID = 'ccjaouhara-ga4-script';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export function ensureGtagStub(): void {
  if (typeof window === 'undefined') return;
  if (!Array.isArray(window.dataLayer)) window.dataLayer = [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };
  }
}