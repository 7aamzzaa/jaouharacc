import type { Product, ProductVariant } from '../types';

// Anti-abuse cap for a single order line. Availability-confirmation requests do
// not reserve stock, but the API still caps each line so a single request cannot
// create an arbitrarily large order. This is a request limit, not an inventory
// quantity: no stock number is invented for these products.
export const AVAILABILITY_REQUEST_MAX_QUANTITY = 99;

export function hasVariants(product: Product | null | undefined): boolean {
  return Array.isArray(product?.variants) && product.variants.length > 0;
}

export function isAvailabilityToConfirm(product: Product | null | undefined): boolean {
  return product?.inventory_policy === 'availability_to_confirm';
}

export function getDefaultVariant(product: Product | null | undefined): ProductVariant | undefined {
  return hasVariants(product) ? product?.variants?.[0] : undefined;
}

export function getVariantById(product: Product | null | undefined, variantId: string | undefined): ProductVariant | undefined {
  if (!variantId || !hasVariants(product)) return undefined;
  return product?.variants?.find((variant) => variant.id === variantId);
}

export function resolveVariantOrDefault(product: Product | null | undefined, variantId?: string): ProductVariant | undefined {
  return getVariantById(product, variantId) || getDefaultVariant(product);
}

export function getMaxQuantity(product: Product | null | undefined): number {
  if (isAvailabilityToConfirm(product)) return AVAILABILITY_REQUEST_MAX_QUANTITY;
  return Math.max(0, product?.stock ?? 0);
}
