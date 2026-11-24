import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { convertFromBase, CURRENCIES, type CurrencyCode } from './lib/currency';

export type { CurrencyCode } from './lib/currency';

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
  formatPrice: (amountInMad: number) => string;
  convertPrice: (amountInMad: number) => number;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(readStoredCurrency);

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c);
    try { localStorage.setItem(STORAGE_KEY, c); } catch { /* ignore */ }
  }, []);

  const formatPrice = useCallback((amountInMad: number): string => {
    const converted = convertFromBase(amountInMad, currency);
    const info = CURRENCIES[currency];

    if (currency === 'MAD') {
      // Preserve the existing CCJAOUHARA MAD format: "79 MAD" / "درهم 79"
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

  const convertPrice = useCallback((amountInMad: number): number => {
    return convertFromBase(amountInMad, currency);
  }, [currency]);

  const value = useMemo(() => ({ currency, setCurrency, formatPrice, convertPrice }), [currency, setCurrency, formatPrice, convertPrice]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within a CurrencyProvider');
  return ctx;
}
