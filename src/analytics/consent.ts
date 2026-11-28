import {
  CONSENT_CHANGED_EVENT,
  CONSENT_STORAGE_KEY,
  GA4_MEASUREMENT_ID,
  GA4_SCRIPT_ID,
  OPEN_COOKIE_SETTINGS_EVENT,
  ensureGtagStub,
} from '../config/analytics';

let analyticsRequested = false;

export interface ConsentChoice {
  analytics: boolean;
  updatedAt: string;
}

export function readConsentChoice(): ConsentChoice | null {
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentChoice>;
    if (typeof parsed.analytics !== 'boolean') return null;
    return {
      analytics: parsed.analytics,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : '',
    };
  } catch {
    return null;
  }
}

export function hasAnalyticsConsent(): boolean {
  return readConsentChoice()?.analytics === true;
}

function deleteGaCookie(name: string): void {
  const host = window.location.hostname;
  const expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
  const domains = host === 'localhost' || host === '127.0.0.1'
    ? ['']
    : [host, `.${host}`];

  document.cookie = `${name}=; path=/; expires=${expires}`;
  for (const domain of domains) {
    if (domain) document.cookie = `${name}=; path=/; expires=${expires}; domain=${domain}`;
  }
}

export function clearAnalyticsCookies(): void {
  deleteGaCookie('_ga');
  deleteGaCookie(`_ga_${GA4_MEASUREMENT_ID.replace('G-', '')}`);
}

function removeGaScript(): void {
  document.getElementById(GA4_SCRIPT_ID)?.remove();
}

function clearQueuedGaCommands(): void {
  if (Array.isArray(window.dataLayer)) window.dataLayer.length = 0;
}

export function activateAnalytics(): void {
  ensureGtagStub();
  if (analyticsRequested && document.getElementById(GA4_SCRIPT_ID)) return;

  removeGaScript();
  analyticsRequested = true;

  window.gtag('consent', 'update', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  window.gtag('config', GA4_MEASUREMENT_ID, { send_page_view: false });

  const script = document.createElement('script');
  script.id = GA4_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_MEASUREMENT_ID)}`;
  document.head.appendChild(script);
}

export function deactivateAnalytics(): void {
  clearQueuedGaCommands();
  removeGaScript();
  clearAnalyticsCookies();
  analyticsRequested = false;
}

export function saveConsentChoice(analytics: boolean): void {
  const previous = readConsentChoice();
  const choice: ConsentChoice = {
    analytics,
    updatedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(choice));
  } catch {
    // Consent cannot be persisted; the in-page decision still applies for this visit.
  }

  if (analytics) activateAnalytics();
  else deactivateAnalytics();

  if (!previous || previous.analytics !== analytics) {
    window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: { analytics } }));
  }
}

export function openCookiePreferences(): void {
  window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT));
}