import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { en } from './en';
import { fr } from './fr';
import { ar } from './ar';

export type Lang = 'en' | 'fr' | 'ar';

export type TranslationDict = Record<string, any>;

const dictionaries: Record<Lang, TranslationDict> = { en, fr, ar };

interface TranslationContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, params?: Record<string, string | number>) => any;
  dir: 'ltr' | 'rtl';
}

const TranslationContext = createContext<TranslationContextValue | null>(null);

function getNestedValue(obj: TranslationDict, path: string): string | undefined {
  return path.split('.').reduce<any>((acc, part) => {
    if (acc && typeof acc === 'object' && part in acc) return acc[part];
    return undefined;
  }, obj);
}

function detectBrowserLang(): Lang {
  try {
    const lang = navigator.language || (navigator as any).languages?.[0] || '';
    if (lang.startsWith('ar')) return 'ar';
    if (lang.startsWith('fr')) return 'fr';
  } catch {}
  return 'ar';
}

const STORAGE_KEY = 'ccjaouhara_lang_v2';

try { localStorage.removeItem('ccjaouhara_lang'); } catch {}

function loadInitialLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored && stored in dictionaries) return stored;
  } catch {}
  return detectBrowserLang();
}

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(loadInitialLang);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    try { localStorage.setItem(STORAGE_KEY, newLang); } catch {}
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = document.title.replace(/^(.+?)(\s*[—-]\s*.+)?$/, (_, m) =>
      lang === 'ar' ? 'مجوهرات ccjaouhara | مجوهرات راقية' :
      lang === 'fr' ? 'ccjaouhara | Bijouterie Fine de Luxe' :
      'ccjaouhara | Fine Jewelry'
    );
    const existing = document.querySelector('link[hreflang]');
    const baseUrl = window.location.origin + window.location.pathname;
    const languages: Lang[] = ['en', 'fr', 'ar'];
    languages.forEach((l) => {
      let el = document.querySelector(`link[hreflang="${l}"]`) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement('link');
        el.rel = 'alternate';
        el.hreflang = l;
        document.head.appendChild(el);
      }
      el.href = `${baseUrl}?lang=${l}`;
    });
    let xDefault = document.querySelector('link[hreflang="x-default"]') as HTMLLinkElement | null;
    if (!xDefault) {
      xDefault = document.createElement('link');
      xDefault.rel = 'alternate';
      xDefault.hreflang = 'x-default';
      document.head.appendChild(xDefault);
    }
    xDefault.href = `${baseUrl}?lang=ar`;
  }, [lang]);

  const t = (key: string, params?: Record<string, string | number>): any => {
    const dict = dictionaries[lang];
    let val = getNestedValue(dict, key);
    if (val === undefined) {
      const fallback = getNestedValue(dictionaries.en, key);
      val = fallback ?? key;
    }
    if (params && typeof val === 'string') {
      return Object.entries(params).reduce(
        (str, [k, v]) => str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v)),
        val
      );
    }
    return val;
  };

  return (
    <TranslationContext.Provider value={{ lang, setLang, t, dir: lang === 'ar' ? 'rtl' : 'ltr' }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error('useTranslation must be used within TranslationProvider');
  return ctx;
}
