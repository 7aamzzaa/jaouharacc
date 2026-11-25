type Env = Record<string, string | undefined>;

export interface StripeMoneyConfig {
  currency: 'mad' | 'usd';
  rateFromMad: number;
}

/**
 * Stripe must never inherit a silent currency assumption from product.price.
 * Product prices are MAD; presentment currency and any FX conversion require
 * an explicit operator decision before a live charge is allowed.
 */
export function readStripeMoneyConfig(env: Env = process.env): StripeMoneyConfig {
  const raw = (env.STRIPE_PRESENTMENT_CURRENCY || '').trim().toLowerCase();

  if (raw !== 'mad' && raw !== 'usd') {
    throw new Error(
      'Stripe payments are blocked until STRIPE_PRESENTMENT_CURRENCY is explicitly set to "mad" or "usd". '
      + 'No default is applied because product prices are stored in MAD.'
    );
  }

  if (raw === 'mad') {
    return { currency: 'mad', rateFromMad: 1 };
  }

  const rate = Number(env.STRIPE_MAD_TO_USD_RATE);
  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error(
      'STRIPE_MAD_TO_USD_RATE must be a positive number when STRIPE_PRESENTMENT_CURRENCY=usd.'
    );
  }

  return { currency: 'usd', rateFromMad: rate };
}

/** Stripe expects the smallest currency unit: 79 MAD -> 7900 centimes. */
export function toStripeMinorUnits(amountInMad: number, config: StripeMoneyConfig): number {
  if (!Number.isFinite(amountInMad) || amountInMad < 0) {
    throw new Error('Amount to charge must be a non-negative finite number');
  }
  return Math.round(amountInMad * config.rateFromMad * 100);
}
