export const ORIGINAL_PRICES_BY_PRODUCT_ID: Readonly<Record<string, number>> = Object.freeze({});

export function getOriginalPrice(productId: string, currentPrice: number): number | null {
  const original = ORIGINAL_PRICES_BY_PRODUCT_ID[productId];
  if (typeof original !== 'number' || !Number.isFinite(original)) return null;
  if (original <= currentPrice) return null;
  return original;
}
