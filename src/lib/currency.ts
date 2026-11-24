export type CurrencyCode = 'MAD' | 'USD' | 'EUR';

/**
 * Source of truth: Product.price and all stored order amounts are in MAD.
 * Product data and Supabase are intentionally left unchanged.
 */
export const BASE_CURRENCY: CurrencyCode = 'MAD';

export const CURRENCIES: Record<CurrencyCode, { code: CurrencyCode; symbol: string; locale: string }> = {
  MAD: { code: 'MAD', symbol: 'MAD', locale: 'fr-MA' },
  EUR: { code: 'EUR', symbol: '€', locale: 'fr-FR' },
  USD: { code: 'USD', symbol: '$', locale: 'en-US' },
};

/**
 * Display rates are FROM the MAD base unit.
 * 1 MAD = 1 MAD, ~0.10 USD, ~0.093 EUR.
 * Replace with a live FX source before relying on USD/EUR for settlement.
 */
export const DISPLAY_RATES_FROM_MAD: Record<CurrencyCode, number> = {
  MAD: 1,
  USD: 0.1,
  EUR: 0.093,
};

export function convertFromBase(amountInMad: number, currency: CurrencyCode): number {
  const rate = DISPLAY_RATES_FROM_MAD[currency];
  return Math.round(amountInMad * rate * 100) / 100;
}
