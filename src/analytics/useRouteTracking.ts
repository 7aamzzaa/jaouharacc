import { useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { CONSENT_CHANGED_EVENT } from '../config/analytics';
import { SITE_URL } from '../config/site';
import { trackPageView } from './ga4';

const EXCLUDED_PATH_PREFIXES = ['/admin'];
const ALLOWED_QUERY_KEYS: Record<string, string[]> = {
  '/shop': ['category'],
};

function sanitizePath(pathname: string, search: string): string {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (EXCLUDED_PATH_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) {
    return '';
  }

  const allowedKeys = ALLOWED_QUERY_KEYS[path] ?? [];
  const source = new URLSearchParams(search);
  const cleaned = new URLSearchParams();

  for (const key of allowedKeys) {
    const value = source.get(key);
    if (value && /^[a-z0-9_-]{1,40}$/i.test(value)) cleaned.set(key, value);
  }

  const query = cleaned.toString();
  return query ? `${path}?${query}` : path;
}

function sanitizeReferrer(referrer: string): string {
  if (!referrer) return '';
  try {
    const siteOrigin = new URL(SITE_URL).origin;
    const url = new URL(referrer, SITE_URL);
    if (url.origin !== siteOrigin) return '';
    return sanitizePath(url.pathname, url.search);
  } catch {
    return '';
  }
}

export function useRouteTracking(): void {
  const location = useLocation();
  const lastSentRef = useRef<string | null>(null);
  const currentRef = useRef({ path: '', referrer: '' });

  const sendCurrent = useCallback((force: boolean) => {
    const { path, referrer } = currentRef.current;
    if (!path) return;
    if (!force && lastSentRef.current === path) return;

    lastSentRef.current = path;
    trackPageView({ path, referrer });
  }, []);

  useEffect(() => {
    const path = sanitizePath(location.pathname, location.search);
    if (!path) {
      currentRef.current = { path: '', referrer: '' };
      return;
    }

    currentRef.current = {
      path,
      referrer: sanitizeReferrer(document.referrer),
    };
    sendCurrent(false);
  }, [location.pathname, location.search, sendCurrent]);

  useEffect(() => {
    const handleConsentChange = (event: Event) => {
      const detail = (event as CustomEvent<{ analytics?: boolean }>).detail;
      if (detail?.analytics === true) sendCurrent(true);
      else lastSentRef.current = null;
    };

    window.addEventListener(CONSENT_CHANGED_EVENT, handleConsentChange);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, handleConsentChange);
  }, [sendCurrent]);
}