import type { ProductVariant } from '../types';

export const FINISH_LABEL_KEYS: Record<string, string> = {
  GOLD: 'productDetail.finishLabel.GOLD',
  SILVER: 'productDetail.finishLabel.SILVER',
};

export const ACCENT_LABEL_KEYS: Record<string, string> = {
  PINK: 'productDetail.accentLabel.PINK',
  WHITE: 'productDetail.accentLabel.WHITE',
  BLACK: 'productDetail.accentLabel.BLACK',
  PURPLE: 'productDetail.accentLabel.PURPLE',
};

// Search-only synonyms. These never appear in customer-facing product copy and
// are not material claims; they only let shoppers find a variant by code/name.
export const VARIANT_SEARCH_TERMS: Record<string, string[]> = {
  GOLD: ['gold', 'gold finish', 'doré', 'doree', 'ذهبي'],
  SILVER: ['silver', 'silver finish', 'argent', 'فضي'],
  PINK: ['pink', 'rose', 'وردي'],
  WHITE: ['white', 'blanc', 'أبيض'],
  BLACK: ['black', 'noir', 'أسود'],
  PURPLE: ['purple', 'violet', 'بنفسجي'],
};

export function getVariantLabel(variant: ProductVariant | null | undefined, t: (key: string) => any): string {
  if (!variant) return '';
  const finishKey = FINISH_LABEL_KEYS[variant.finish];
  const accentKey = ACCENT_LABEL_KEYS[variant.color];
  const finish = String(finishKey ? t(finishKey) : variant.finish);
  const accent = String(accentKey ? t(accentKey) : variant.color);
  return `${finish} \u00b7 ${accent}`;
}

/**
 * Cart and saved-order records store the authoritative finish/colour codes.
 * Deriving the label from those codes keeps a variant localized if the customer
 * changes language after adding it to the bag; older records can still fall
 * back to the label captured when the item was added.
 */
export function getVariantLabelFromFields(
  fields: {
    variant_id?: string;
    variant_finish?: string;
    variant_color?: string;
    variant_label?: string;
  } | null | undefined,
  t: (key: string) => any,
): string {
  if (!fields) return '';
  if (!fields.variant_finish && !fields.variant_color) return fields.variant_label || '';
  const label = getVariantLabel(
    {
      id: fields.variant_id || '',
      finish: fields.variant_finish || '',
      color: fields.variant_color || '',
      images: [],
    },
    t,
  );
  return label || fields.variant_label || '';
}
