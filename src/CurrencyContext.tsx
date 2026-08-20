import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export type CurrencyCode = 'MAD' | 'USD' | 'EUR';

interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  locale: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  MAD: { code: 'MAD', symbol: 'MAD', locale: 'fr-MA' },
  EUR: { code: 'EUR', symbol: '\u20AC', locale: 'fr-FR' },
  USD: { code: 'USD', symbol: '$', locale: 'en-US' },
};

// Display/conversion rates with USD as the DB base unit (product.price is in USD).
// 1 USD ≈ 10 MAD, 1 USD ≈ 0.93 EUR. Update when integrating a live FX API.
const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  MAD: 10,
  USD: 1,
  EUR: 0.93,
};

const STORAGE_KEY = 'ccjaouhara_currency';

function readStoredCurrency(): CurrencyCode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'MAD' || stored === 'USD' || stored === 'EUR') return stored;
  } catch { /* ignore */ }
  return 'MAD';
}

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatPrice: (priceInBaseUnit: number) => string;
  convertPrice: (priceInBaseUnit: number) => number;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(readStoredCurrency);

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c);
    try { localStorage.setItem(STORAGE_KEY, c); } catch { /* ignore */ }
  }, []);

  const formatPrice = useCallback((priceInBaseUnit: number): string => {
    const rate = EXCHANGE_RATES[currency];
    const converted = Math.round(priceInBaseUnit * rate * 100) / 100;
    const info = CURRENCIES[currency];

    if (currency === 'MAD') {
      // Preserve the existing CCJAOUHARA MAD format: "249 MAD" / "درهم 249"
      return `${converted.toLocaleString()} ${info.symbol}`;
    }

    // EUR / USD: use Intl.NumberFormat for locale-aware formatting
    return new Intl.NumberFormat(info.locale, {
      style: 'currency',
      currency: info.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(converted);
  }, [currency]);

  const convertPrice = useCallback((priceInBaseUnit: number): number => {
    const rate = EXCHANGE_RATES[currency];
    return Math.round(priceInBaseUnit * rate * 100) / 100;
  }, [currency]);

  const value = useMemo(() => ({ currency, setCurrency, formatPrice, convertPrice }), [currency, setCurrency, formatPrice, convertPrice]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within a CurrencyProvider');
  return ctx;
}
