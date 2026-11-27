import type { Product } from '../types';
import type { Lang } from './index';
import { VARIANT_SEARCH_TERMS } from './variantLabels';

export interface ProductTranslation {
  name: string;
  description: string;
  material: string;
  color: string;
  seoTitle?: string;
  metaDescription?: string;
  imageAltText?: string;
}

/**
 * Customer-facing copy must never claim unsupported precious metals.
 * Source records can be French even when AR/EN is active, so every pattern is
 * applied to every value regardless of the selected UI language.
 */
const PROHIBITED_CLAIM_PATTERNS: Array<[RegExp, string]> = [
  // English plating / karat claims.
  [/\bgold[\s-]*(?:plated|tone|filled|vermeil)\b/gi, ' '],
  [/\bgold\b/gi, ' '],
  [/\bgolden\b/gi, ' '],
  [/\b(?:14|18)[\s-]*(?:k|kt|carats?)\b/gi, ' '],
  // French plating, gold-color and karat claims, including feminine forms.
  [/\bplaqu(?:é|ée|és|ées)\s+or\b/gi, ' '],
  [/\bplaque\s+or\b/gi, ' '],
  [/\bor[\s-]*(?:14|18)[\s-]*(?:carats?|k|kt)\b/gi, ' '],
  [/\bor\s+(?:massif|fin|rose|jaune|blanc)\b/gi, ' '],
  [/\b(Collier|Bracelet|Bague|Chaîne|Chaine|Pendentif|Parure|Boucles?|Chevil(?:le|lière))\s+Or\b/g, '$1'],
  [/\b(collier|bracelet|bague|chaîne|chaine|pendentif|parure|boucles?|chevil(?:le|lière))\s+or\b(?=\s*[.,;:]?\s*$)/gi, '$1'],
  [/\bdoré(?:e|s|es)?(?!\w)/gi, ' '],
  [/\bdore(?:e|s|es)?(?!\w)/gi, ' '],
  // Arabic gold, gilding and karat claims.
  [/مطلية بالذهب/g, ' '],
  [/مطلي بالذهب/g, ' '],
  [/بالذهب/g, ' '],
  [/الذهبية/g, ' '],
  [/الذهبي/g, ' '],
  [/ذهبية/g, ' '],
  [/ذهبي/g, ' '],
  [/الذهب/g, ' '],
  [/ذهب/g, ' '],
  [/مذهّ?بة?/g, ' '],
  [/عيار\s*(?:14|18)/g, ' '],
];

// Approved appearance-only wording that must survive the claim sanitizer.
// These strings describe finish/appearance only and never assert material.
const APPROVED_APPEARANCE_ONLY_STRINGS = new Set([
  'Bracelet-Bague Femme Doré à Double Fleur et Chaîne de Main',
  'Bracelet-Bague Femme Doré à Fleurs | CCJAOUHARA',
  'Découvrez ce bracelet-bague femme doré à double fleur, relié par une délicate chaîne de main. Un bijou floral élégant chez CCJAOUHARA.',
  'Bracelet-bague femme doré avec deux motifs floraux et une chaîne de main',
  'Bracelet-bague femme à la finition d\'inspiration dorée avec deux motifs floraux et une chaîne de main',
]);

// Appearance-only finish phrases are explicitly allowed, unlike gold/metal claims.
const APPEARANCE_ONLY_PATTERNS: RegExp[] = [
  /\bgold[\s-]tone\b/gi,
  /\bsilver[\s-]tone\b/gi,
  /\b(?:finition\s+)?d['’]inspiration\s+(?:dorée?|argentée?)\b/gi,
  /مظهر\s+(?:ذهبية|فضية|ذهبي|فضي)/g,
  /(?:ذهبية|فضية|ذهبي|فضي)\s+المظهر/g,
];

const NEUTRAL_FALLBACK: Record<Lang, ProductTranslation> = {
  en: {
    name: 'Elegant women’s fashion accessory',
    description: 'Fashion jewelry with a refined design.',
    material: '',
    color: 'Polished metallic finish',
  },
  fr: {
    name: 'Accessoire fantaisie élégant pour femme',
    description: 'Bijou fantaisie au design raffiné.',
    material: '',
    color: 'Finition métallique brillante',
  },
  ar: {
    name: 'إكسسوار نسائي أنيق',
    description: 'إكسسوار بتصميم رفيع وأنيق.',
    material: '',
    color: 'لمسة معدنية لامعة',
  },
};

function stripProhibitedClaims(value: string | undefined, _lang: Lang): string {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (APPROVED_APPEARANCE_ONLY_STRINGS.has(trimmed)) return trimmed;

  const placeholders: string[] = [];
  let cleaned = value;
  for (const pattern of APPEARANCE_ONLY_PATTERNS) {
    pattern.lastIndex = 0;
    cleaned = cleaned.replace(pattern, (match) => {
      const token = `__APPEARANCE_${placeholders.length}__`;
      placeholders.push(match);
      return token;
    });
  }

  for (const [pattern, replacement] of PROHIBITED_CLAIM_PATTERNS) {
    pattern.lastIndex = 0;
    cleaned = cleaned.replace(pattern, replacement);
  }
  // Standalone French "or" means gold; keep English "or" inside phrases.
  if (/^\s*or\s*$/i.test(cleaned)) return '';
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  for (let i = placeholders.length - 1; i >= 0; i -= 1) {
    cleaned = cleaned.split(`__APPEARANCE_${i}__`).join(placeholders[i]);
  }
  return cleaned;
}

type LocalizedField = keyof ProductTranslation;

function resolveLocalizedValue(
  translated: string | undefined,
  fallback: string | undefined,
  lang: Lang,
  field: LocalizedField,
): string {
  const safeTranslated = stripProhibitedClaims(translated, lang);
  if (safeTranslated) return safeTranslated;

  const safeFallback = stripProhibitedClaims(fallback, lang);
  if (safeFallback) return safeFallback;

  return NEUTRAL_FALLBACK[lang][field];
}

/** Resolve localized product fields with a safe, claim-free fallback to source data. */
export function getProductLocalizedFields(product: Product, lang: Lang): ProductTranslation {
  const entry = productTranslations[product.id]?.[lang];

  const translatedSeoTitle = entry?.seoTitle ? stripProhibitedClaims(entry.seoTitle, lang) : '';
  const translatedMetaDescription = entry?.metaDescription ? stripProhibitedClaims(entry.metaDescription, lang) : '';
  const translatedImageAltText = entry?.imageAltText ? stripProhibitedClaims(entry.imageAltText, lang) : '';

  return {
    name: resolveLocalizedValue(entry?.name, product.name, lang, 'name'),
    description: resolveLocalizedValue(entry?.description, product.description, lang, 'description'),
    material: resolveLocalizedValue(entry?.material, product.material, lang, 'material'),
    color: resolveLocalizedValue(entry?.color, product.color, lang, 'color'),
    seoTitle: translatedSeoTitle,
    metaDescription: translatedMetaDescription,
    imageAltText: translatedImageAltText,
  };
}

/** Explicitly list catalog products without complete localized name/description/material/color copy. */
export function getMissingProductTranslationIds(products: Product[]): string[] {
  const missing: string[] = [];
  const fields: LocalizedField[] = ['name', 'description', 'material', 'color'];
  for (const product of products) {
    for (const lang of ['ar', 'fr', 'en'] as Lang[]) {
      const entry = productTranslations[product.id]?.[lang];
      if (fields.some((field) => !entry?.[field]?.trim())) {
        missing.push(`${product.id}:${lang}`);
      }
    }
  }
  return missing;
}

function normalizeSearchValue(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f\u064b-\u065f\u0670]/g, '')
    .toLocaleLowerCase()
    .trim();
}

/** Case/accent-insensitive search across localized and source product fields. */
export function productMatchesQuery(product: Product, query: string, lang: Lang): boolean {
  const q = normalizeSearchValue(query);
  if (!q) return false;

  const localized = getProductLocalizedFields(product, lang);
  const haystack = [
    localized.name,
    localized.description,
    localized.material,
    localized.color,
    stripProhibitedClaims(product.name, lang),
    stripProhibitedClaims(product.description, lang),
    stripProhibitedClaims(product.material, lang),
    stripProhibitedClaims(product.color, lang),
    product.category,
    product.id,
    product.slug || '',
    ...(product.tags || []),
    ...(product.variants || []).flatMap((variant) => [
      variant.id,
      variant.sku || '',
      variant.finish,
      variant.color,
      ...(VARIANT_SEARCH_TERMS[variant.finish] || []),
      ...(VARIANT_SEARCH_TERMS[variant.color] || []),
    ]),
  ].map(normalizeSearchValue);

  return haystack.some((value) => value.includes(q));
}

/** Use the existing category dictionary, falling back to the raw category slug. */
export function getLocalizedCategoryLabel(t: (key: string) => any, category: string): string {
  const translated = t(`nav.categories.${category.toLowerCase()}.name`);
  return typeof translated === 'string' && translated.trim() ? translated : category;
}

export const productTranslations: Record<string, { en: ProductTranslation; fr: ProductTranslation; ar: ProductTranslation }> = {
  "prod-49": {
    en: {  name: "sansla", description: "good sansla for girls", material: "", color: "Polished metallic finish"  },
    fr: {  name: "Sansla", description: "Belle sansla pour filles", material: "", color: "Finition métallique brillante"  },
    ar: {  name: "سنصلة", description: "سنصلة جميلة للبنات", material: "", color: "لمسة معدنية لامعة"  },
  },
  "prod-50": {
    en: {  name: "Luna Crystal Necklace", description: "Discover the Luna Crystal Necklace, a waterproof stainless steel necklace designed for women who love timeless elegance. Perfect for everyday wear and special occasions", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Luna Crystal Necklace", description: "Discover the Luna Crystal Necklace, a waterproof stainless steel necklace designed for women who love timeless elegance. Perfect for everyday wear and special occasions", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "Luna Crystal Necklace", description: "Discover the Luna Crystal Necklace, a waterproof stainless steel necklace designed for women who love timeless elegance. Perfect for everyday wear and special occasions", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "prod-71": {
    en: {  name: "Classic with a Polished finish Ring", description: "Discover the Classic with a Polished finish Ring, a premium stainless steel ring with a brilliant Polished finish. Designed for women who appreciate timeless elegance and everyday sophistication.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Bague Classique brillante", description: "Découvrez la Bague Classique brillante, une bague premium en acier inoxydable avec une finition métallique brillante. Conçue pour les femmes qui apprécient l'élégance intemporelle et la sophistication quotidienne.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "خاتم كلاسيك بلمسة معدنية لامعة", description: "اكتشفي الخاتم الكلاسيكي بلمسة معدنية لامعة، خاتم ممتاز من الفولاذ المقاوم للصدأ بلمسة نهائية معدنية لامعة لامعة. مصمم للنساء اللواتي يقدرن الأناقة الخالدة والرقي اليومي.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "prod-111": {
    en: {  name: "Radiance with a Polished finish Anklet", description: "Discover the Radiance with a Polished finish Anklet, a premium stainless steel anklet with a brilliant Polished finish. Designed for women who appreciate timeless elegance and everyday sophistication.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Chevillère Éclat brillante", description: "Découvrez la Chevillère Éclat brillante, une chevillère premium en acier inoxydable avec une finition métallique brillante. Conçue pour les femmes qui apprécient l'élégance intemporelle et la sophistication quotidienne.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "خلخال متألق بلمسة معدنية لامعة", description: "اكتشفي الخلخال المتألق بلمسة معدنية لامعة، خلخال ممتاز من الفولاذ المقاوم للصدأ بلمسة نهائية معدنية لامعة لامعة. مصمم للنساء اللواتي يقدرن الأناقة الخالدة والرقي اليومي.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "prod-112": {
    en: {  name: "Glow with a Polished finish Anklet", description: "Discover the Glow with a Polished finish Anklet, a premium stainless steel anklet with a radiant Polished finish. Designed for women who appreciate timeless elegance and everyday sophistication.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Chevillère Lueur brillante", description: "Découvrez la Chevillère Lueur brillante, une chevillère premium en acier inoxydable avec une finition métallique brillante rayonnante. Conçue pour les femmes qui apprécient l'élégance intemporelle et la sophistication quotidienne.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "خلخال متوهج بلمسة معدنية لامعة", description: "اكتشفي الخلخال المتوهج بلمسة معدنية لامعة، خلخال ممتاز من الفولاذ المقاوم للصدأ بلمسة نهائية معدنية لامعة مشعة. مصمم للنساء اللواتي يقدرن الأناقة الخالدة والرقي اليومي.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "prod-114": {
    en: {  name: "Dazzle with a Polished finish Anklet", description: "Discover the Dazzle with a Polished finish Anklet, a premium stainless steel anklet with a brilliant Polished finish. Designed for women who appreciate timeless elegance and everyday sophistication.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Chevillère Éclat brillante", description: "Découvrez la Chevillère Éclat brillante, une chevillère premium en acier inoxydable avec une finition métallique brillante. Conçue pour les femmes qui apprécient l'élégance intemporelle et la sophistication quotidienne.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "خلخال براق بلمسة معدنية لامعة", description: "اكتشفي الخلخال البراق بلمسة معدنية لامعة، خلخال ممتاز من الفولاذ المقاوم للصدأ بلمسة نهائية معدنية لامعة لامعة. مصمم للنساء اللواتي يقدرن الأناقة الخالدة والرقي اليومي.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "prod-115": {
    en: {  name: "Gleam with a Polished finish Anklet", description: "Discover the Gleam with a Polished finish Anklet, a premium stainless steel anklet with a luminous Polished finish. Designed for women who appreciate timeless elegance and everyday sophistication.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Chevillère Lueur brillante", description: "Découvrez la Chevillère Lueur brillante, une chevillère premium en acier inoxydable avec une finition métallique brillante lumineuse. Conçue pour les femmes qui apprécient l'élégance intemporelle et la sophistication quotidienne.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "خلخال لامع بلمسة معدنية لامعة", description: "اكتشفي الخلخال اللامع بلمسة معدنية لامعة، خلخال ممتاز من الفولاذ المقاوم للصدأ بلمسة نهائية معدنية لامعة متألقة. مصمم للنساء اللواتي يقدرن الأناقة الخالدة والرقي اليومي.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "prod-124": {
    en: {  name: "Noble with a Polished finish Bracelet", description: "Discover the Noble with a Polished finish Bracelet, a premium stainless steel bracelet with a distinguished Polished metallic finish. Designed for women who appreciate timeless elegance and everyday sophistication.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Bracelet Noble brillante", description: "Découvrez le Bracelet Noble brillante, un bracelet premium en acier inoxydable avec une finition métallique brillante distinguée. Conçu pour les femmes qui apprécient l'élégance intemporelle et la sophistication quotidienne.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "سوار نبيل بلمسة معدنية لامعة", description: "اكتشفي السوار النبيل بلمسة معدنية لامعة، سوار ممتاز من الفولاذ المقاوم للصدأ بلمسة نهائية معدنية لامعة راقية. مصمم للنساء اللواتي يقدرن الأناقة الخالدة والرقي اليومي.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "prod-125": {
    en: {  name: "Opus with a Polished finish Bracelet", description: "Discover the Opus with a Polished finish Bracelet, a premium stainless steel bracelet with a masterful Polished metallic finish. Designed for women who appreciate timeless elegance and everyday sophistication.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Bracelet Opus brillante", description: "Découvrez le Bracelet Opus brillante, un bracelet premium en acier inoxydable avec une finition métallique brillante magistrale. Conçu pour les femmes qui apprécient l'élégance intemporelle et la sophistication quotidienne.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "سوار أوبوس بلمسة معدنية لامعة", description: "اكتشفي سوار أوبوس بلمسة معدنية لامعة، سوار ممتاز من الفولاذ المقاوم للصدأ بلمسة نهائية معدنية لامعة متقنة. مصمم للنساء اللواتي يقدرن الأناقة الخالدة والرقي اليومي.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "prod-126": {
    en: {  name: "Oasis with a Polished finish Bracelet", description: "Discover the Oasis with a Polished finish Bracelet, a premium stainless steel bracelet with a refreshing Polished metallic finish. Designed for women who appreciate timeless elegance and everyday sophistication.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Bracelet Oasis brillante", description: "Découvrez le Bracelet Oasis brillante, un bracelet premium en acier inoxydable avec une finition métallique brillante rafraîchissante. Conçu pour les femmes qui apprécient l'élégance intemporelle et la sophistication quotidienne.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "سوار الواحة بلمسة معدنية لامعة", description: "اكتشفي سوار الواحة بلمسة معدنية لامعة، سوار ممتاز من الفولاذ المقاوم للصدأ بلمسة نهائية معدنية لامعة منعشة. مصمم للنساء اللواتي يقدرن الأناقة الخالدة والرقي اليومي.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "prod-128": {
    en: {  name: "Onyx with a Polished finish Bracelet", description: "Discover the Onyx with a Polished finish Bracelet, a premium stainless steel bracelet with a brilliant Polished finish. Designed for women who appreciate timeless elegance and everyday sophistication.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Bracelet Onyx brillante", description: "Découvrez le Bracelet Onyx brillante, un bracelet premium en acier inoxydable avec une finition métallique brillante. Conçu pour les femmes qui apprécient l'élégance intemporelle et la sophistication quotidienne.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "سوار أونيكس بلمسة معدنية لامعة", description: "اكتشفي سوار أونيكس بلمسة معدنية لامعة، سوار ممتاز من الفولاذ المقاوم للصدأ بلمسة نهائية معدنية لامعة لامعة. مصمم للنساء اللواتي يقدرن الأناقة الخالدة والرقي اليومي.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "prod-131": {
    en: {  name: "Omega with a Polished finish Bracelet", description: "Discover the Omega with a Polished finish Bracelet, a premium stainless steel bracelet with a timeless Polished metallic finish. Designed for women who appreciate timeless elegance and everyday sophistication.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Bracelet Omega brillante", description: "Découvrez le Bracelet Omega brillante, un bracelet premium en acier inoxydable avec une finition métallique brillante intemporelle. Conçu pour les femmes qui apprécient l'élégance intemporelle et la sophistication quotidienne.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "سوار أوميغا بلمسة معدنية لامعة", description: "اكتشفي سوار أوميغا بلمسة معدنية لامعة، سوار ممتاز من الفولاذ المقاوم للصدأ بلمسة نهائية معدنية لامعة خالدة. مصمم للنساء اللواتي يقدرن الأناقة الخالدة والرقي اليومي.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "prod-132": {
    en: {  name: "Origin with a Polished finish Bracelet", description: "Discover the Origin with a Polished finish Bracelet, a premium stainless steel bracelet with a pure Polished metallic finish. Designed for women who appreciate timeless elegance and everyday sophistication.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Bracelet Origine brillante", description: "Découvrez le Bracelet Origine brillante, un bracelet premium en acier inoxydable avec une finition métallique brillante pure. Conçu pour les femmes qui apprécient l'élégance intemporelle et la sophistication quotidienne.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "سوار الأصل بلمسة معدنية لامعة", description: "اكتشفي سوار الأصل بلمسة معدنية لامعة، سوار ممتاز من الفولاذ المقاوم للصدأ بلمسة نهائية معدنية لامعة نقية. مصمم للنساء اللواتي يقدرن الأناقة الخالدة والرقي اليومي.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "prod-133": {
    en: {  name: "Opal with a Polished finish Bracelet", description: "Discover the Opal with a Polished finish Bracelet, a premium stainless steel bracelet with a luminous Polished finish. Designed for women who appreciate timeless elegance and everyday sophistication.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Bracelet Opale brillante", description: "Découvrez le Bracelet Opale brillante, un bracelet premium en acier inoxydable avec une finition métallique brillante lumineuse. Conçu pour les femmes qui apprécient l'élégance intemporelle et la sophistication quotidienne.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "سوار أوبال بلمسة معدنية لامعة", description: "اكتشفي سوار أوبال بلمسة معدنية لامعة، سوار ممتاز من الفولاذ المقاوم للصدأ بلمسة نهائية معدنية لامعة متألقة. مصمم للنساء اللواتي يقدرن الأناقة الخالدة والرقي اليومي.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "prod-137": {
    en: {  name: "Oracle with a Polished finish Bracelet", description: "Discover the Oracle with a Polished finish Bracelet, a premium stainless steel bracelet with a captivating Polished metallic finish. Designed for women who appreciate timeless elegance and everyday sophistication.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Bracelet Oracle brillante", description: "Découvrez le Bracelet Oracle brillante, un bracelet premium en acier inoxydable avec une finition métallique brillante captivante. Conçu pour les femmes qui apprécient l'élégance intemporelle et la sophistication quotidienne.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "سوار الأوراكل بلمسة معدنية لامعة", description: "اكتشفي سوار الأوراكل بلمسة معدنية لامعة، سوار ممتاز من الفولاذ المقاوم للصدأ بلمسة نهائية معدنية لامعة آسرة. مصمم للنساء اللواتي يقدرن الأناقة الخالدة والرقي اليومي.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "prod-160": {
    en: {  name: "Aria with a Polished finish Earrings", description: "Discover the Aria with a Polished finish Earrings, premium stainless steel earrings with a luminous Polished finish. Designed for women who appreciate timeless elegance and everyday sophistication.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Boucles d'Oreilles Aria brillante", description: "Découvrez les Boucles d'Oreilles Aria brillante, des boucles d'oreilles premium en acier inoxydable avec une finition métallique brillante lumineuse. Conçues pour les femmes qui apprécient l'élégance intemporelle et la sophistication quotidienne.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "أقراط أريا المعدنية اللامعة", description: "اكتشفي أقراط أريا المعدنية اللامعة، أقراط ممتازة من الفولاذ المقاوم للصدأ بلمسة نهائية معدنية لامعة متألقة. مصممة للنساء اللواتي يقدرن الأناقة الخالدة والرقي اليومي.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "prod-169": {
    en: {  name: "Aura with a Polished finish Jewelry Set", description: "Discover the Aura with a Polished finish Jewelry Set, a premium stainless steel jewelry set with a radiant Polished finish. This exquisite matching set includes coordinated pieces designed for women who appreciate timeless elegance and everyday sophistication.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Ensemble de Bijoux Aura brillante", description: "Découvrez l'Ensemble de Bijoux Aura brillante, un ensemble de bijoux premium en acier inoxydable avec une finition métallique brillante radieuse. Cet ensemble coordonné exquis comprend des pièces conçues pour les femmes qui apprécient l'élégance intemporelle et la sophistication quotidienne.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "طقم مجوهرات أورا بلمسة معدنية لامعة", description: "اكتشفي طقم مجوهرات أورا بلمسة معدنية لامعة، طقم مجوهرات ممتاز من الفولاذ المقاوم للصدأ بلمسة نهائية معدنية لامعة مشرقة. يشمل هذا الطقم المنسق الرائع قطعاً متناسقة مصممة للنساء اللواتي يقدرن الأناقة الخالدة والرقي اليومي.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "prod-170": {
    en: {  name: "Blossom with a Polished finish Jewelry Set", description: "Discover the Blossom with a Polished finish Jewelry Set, a premium stainless steel jewelry set with a radiant Polished finish. This exquisite matching set includes coordinated pieces designed for women who appreciate timeless elegance and everyday sophistication.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Ensemble de Bijoux Blossom brillante", description: "Découvrez l'Ensemble de Bijoux Blossom brillante, un ensemble de bijoux premium en acier inoxydable avec une finition métallique brillante radieuse. Cet ensemble coordonné exquis comprend des pièces conçues pour les femmes qui apprécient l'élégance intemporelle et la sophistication quotidienne.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "طقم مجوهرات بلوسوم بلمسة معدنية لامعة", description: "اكتشفي طقم مجوهرات بلوسوم بلمسة معدنية لامعة، طقم مجوهرات ممتاز من الفولاذ المقاوم للصدأ بلمسة نهائية معدنية لامعة مشرقة. يشمل هذا الطقم المنسق الرائع قطعاً متناسقة مصممة للنساء اللواتي يقدرن الأناقة الخالدة والرقي اليومي.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "CCJ-BRA-001": {
    en: {  name: "Set of 3 Polished Bangle Bracelets for Women with Clover Motif", description: "Add a touch of elegance to your style with this set of 3 stainless steel bangle bracelets with a polished finish and delicate openwork clover motifs. A chic, refined and luminous set, ideal for elevating everyday looks as well as special occasions.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Lot de 3 bracelets joncs femme à motif trèfle — finition brillante", description: "Apportez une touche d'élégance à votre style avec ce lot de 3 bracelets joncs en acier inoxydable à finition brillante, aux délicats motifs trèfle ajourés. Un ensemble chic, raffiné et lumineux, idéal pour sublimer vos tenues au quotidien comme lors des occasions spéciales.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "طقم من 3 أساور نسائية بلمسة معدنية لامعة بزخارف البرسيم", description: "أضيفي لمسة من الأناقة إلى إطلالتك مع طقم مميز من 3 أساور نسائية من الفولاذ المقاوم للصدأ بلمسة معدنية لامعة، مزينة بزخارف البرسيم المفرغة بتصميم راقٍ يجمع بين البساطة والفخامة.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "CCJ-BRA-002": {
    en: {  name: "Women's Polished Bangle Bracelet with Sparkling Double Curve", description: "Elevate your wrist with this stainless steel bangle bracelet with a polished finish and a refined geometric design. Its interwoven double curves, combining a smooth brilliant finish with sparkling textured details, bring a touch of modernity and elegance to any outfit.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Bracelet jonc femme à double courbe scintillante — finition brillante", description: "Sublimez votre poignet avec ce bracelet jonc en acier inoxydable à finition brillante au design géométrique raffiné. Ses doubles courbes entrelacées, associant une finition lisse brillante à des détails texturés scintillants, apportent une touche de modernité et d'élégance à toutes vos tenues.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "سوار نسائي بلمسة معدنية لامعة بتصميم منحنيات مزدوجة ولمسات متلألئة", description: "أضيفي لمسة من الأناقة العصرية إلى إطلالتك مع هذا السوار النسائي المصنوع من الفولاذ المقاوم للصدأ بلمسة معدنية لامعة، الذي يتميز بتصميم هندسي مبتكر ومنحنيات مزدوجة تجمع بين اللمعان الناعم والتفاصيل المتلألئة بأسلوب راقٍ وجذاب.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "CCJ-BRA-003": {
    en: {  name: "Women's Polished Bangle Bracelet with Textured Curved Ends", description: "Bring a touch of contemporary elegance to your wrist with this stainless steel bangle bracelet for women with a polished finish. Its open design with two curved ends and finely textured finish create a refined contrast between brilliance and delicacy.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Bracelet jonc femme à double extrémité texturée — finition brillante", description: "Apportez une touche d'élégance contemporaine à votre poignet avec ce bracelet jonc en acier inoxydable à finition brillante pour femme. Son design ouvert aux deux extrémités courbées et sa finition finement texturée créent un contraste raffiné entre brillance et délicatesse.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "سوار نسائي بلمسة معدنية لامعة بتصميم هندسي وأطراف مزخرفة", description: "أضيفي لمسة من الأناقة العصرية إلى إطلالتك مع هذا السوار النسائي المصنوع من الفولاذ المقاوم للصدأ بلمسة معدنية لامعة، الذي يتميز بتصميم هندسي مفتوح وأطراف منحنية مزينة بتفاصيل دقيقة ومتألقة تجمع بين الرقي والجمال.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "CCJ-BRA-004": {
    en: {  name: "Women's Polished Bangle Bracelet with Pearl-Look Motifs and Sparkling Details", description: "Bring a touch of brilliance to your style with this refined stainless steel bangle bracelet with a polished finish. Its two delicate white pearl-look motifs and row of sparkling details create an elegant harmony of softness, light and modernity.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Bracelet jonc femme à motifs nacrés et détails scintillants — finition brillante", description: "Apportez une touche d'éclat à votre style avec ce bracelet jonc en acier inoxydable à finition brillante au design raffiné. Ses deux délicats motifs blancs à effet nacré et sa rangée de détails scintillants créent une harmonie élégante entre douceur, lumière et modernité.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "سوار نسائي بلمسة معدنية لامعة بزخارف لؤلؤية ولمسات براقة", description: "أضيفي لمسة من الفخامة إلى إطلالتك مع هذا السوار النسائي المصنوع من الفولاذ المقاوم للصدأ بلمسة معدنية لامعة، الذي يتميز بزخرفتين بيضاوين بتأثير لؤلؤي وصف من التفاصيل البراقة، في تصميم أنيق يجمع بين الرقة والجمال العصري.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "CCJ-BRA-005": {
    en: {  name: "Women's Polished Bangle Bracelet with Intertwined Double Ring and Sparkling Details", description: "Elevate your wrist with this stainless steel bangle bracelet with a polished finish and an elegant, contemporary design. Its two harmonious polished lines are enhanced by intertwined rings with sparkling details, creating a refined piece that brings a touch of light and sophistication to any outfit.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Bracelet jonc femme à double anneau entrelacé — finition brillante", description: "Sublimez votre poignet avec ce bracelet jonc en acier inoxydable à finition brillante au design élégant et contemporain. Ses deux lignes brillantes harmonieuses sont sublimées par des anneaux entrelacés aux détails scintillants, créant un bijou raffiné qui apporte une touche de lumière et de sophistication à toutes vos tenues.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "سوار نسائي بلمسة معدنية لامعة بحلقتين متشابكتين ولمسات براقة", description: "أضيفي لمسة من الأناقة والفخامة إلى إطلالتك مع هذا السوار النسائي المصنوع من الفولاذ المقاوم للصدأ بلمسة معدنية لامعة، الذي يتميز بتصميم مزدوج أنيق وحلقتين متشابكتين مزينتين بتفاصيل براقة تمنح معصمك إشراقة راقية وجذابة.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "CCJ-NEC-001": {
    en: {  name: "Butterfly Necklace with Pearl-Look Details and a Sparkling Teardrop", description: "A refined women’s stainless steel necklace with a polished finish, a pearlescent butterfly pendant, a sparkling teardrop charm and an elegant pearl-look accent. A graceful piece for everyday outfits and special occasions.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Collier papillon avec détails nacrés et goutte scintillante", description: "Collier femme raffiné en acier inoxydable à finition brillante, orné d’un pendentif papillon à effet nacré, d’une goutte scintillante et d’un détail de perle nacrée. Un accessoire élégant pour les tenues quotidiennes et les occasions spéciales.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "قلادة نسائية بتصميم فراشة وتفاصيل لؤلؤية", description: "قلادة نسائية راقية من الفولاذ المقاوم للصدأ بلمسة معدنية لامعة، بتعليقة على شكل فراشة بتأثير لؤلؤي، مع قطرة لامعة ولمسة لؤلؤية أنيقة. إكسسوار أنثوي يناسب الإطلالات اليومية والمناسبات الخاصة.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "CCJ-NEC-002": {
    en: {  name: "Women's Polished Beaded Necklace with Sparkling Round Pendant", description: "An elegant stainless steel necklace with a polished finish, featuring a delicate chain, polished spherical beads and a sparkling round faceted pendant. A graceful accessory for everyday outfits and special occasions.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Collier femme à billes lisses et pendentif rond scintillant — finition brillante", description: "Sublimez votre style avec ce collier féminin en acier inoxydable à finition brillante, composé d’une chaîne fine ornée de billes lisses et d’un pendentif rond scintillant. Un bijou délicat et élégant, idéal pour accompagner vos tenues quotidiennes comme vos occasions spéciales.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "عقد نسائي بلمسة معدنية لامعة بحبات لامعة وتعليقة دائرية متلألئة", description: "أضيفي لمسة من الأناقة إلى إطلالتك مع هذا العقد النسائي المصنوع من الفولاذ المقاوم للصدأ بلمسة معدنية لامعة، المصمم بسلسلة رفيعة مزينة بحبات كروية لامعة وتعليقة دائرية متلألئة. قطعة ناعمة وأنيقة تناسب إطلالاتك اليومية والمناسبات الخاصة.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "CCJ-NEC-003": {
    en: {  name: "Women's Polished Necklace with Three Cascading Sparkling Accents", description: "An elegant stainless steel necklace with a polished finish, featuring a delicate chain and a cascading pendant with three sparkling round accents in graduated sizes. A refined accessory that brings a graceful touch of sparkle to everyday outfits and special occasions.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Collier femme à trois éclats scintillants en cascade — finition brillante", description: "Un collier en acier inoxydable à finition brillante au charme délicat, composé d'une chaîne fine et d'un pendentif en cascade orné de trois éléments ronds scintillants de tailles progressives. Un bijou élégant et lumineux pour sublimer vos tenues du quotidien comme vos occasions spéciales.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "عقد نسائي بلمسة معدنية لامعة بثلاث قطع دائرية متلألئة متدرجة", description: "عقد نسائي أنيق من الفولاذ المقاوم للصدأ بلمسة معدنية لامعة، يتميز بسلسلة رفيعة وتعليقة متدلية مزينة بثلاث قطع دائرية متلألئة بأحجام متدرجة. تصميم ناعم وراقٍ يضيف لمسة من التألق إلى إطلالاتك اليومية والمناسبات الخاصة.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "CCJ-NEC-004": {
    en: {  name: "Women's Polished Necklace with Pearlescent Heart and Sparkling Accent", description: "An elegant stainless steel necklace with a polished finish, featuring a delicate, pearlescent-look heart pendant and a small round sparkling accent along its fine chain. A romantic and refined accessory for everyday outfits and special occasions.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Collier femme cœur effet nacré et détail scintillant — finition brillante", description: "Apportez une touche romantique à votre style avec ce collier pour femme en acier inoxydable à finition brillante, orné d'un délicat pendentif en forme de cœur à l'effet nacré. Sa chaîne fine, agrémentée d'un petit détail rond scintillant, offre une élégance discrète pour vos tenues quotidiennes et vos occasions spéciales.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "عقد نسائي بلمسة معدنية لامعة بقلب لؤلؤي المظهر وتفصيل لامع", description: "أضيفي لمسة رومانسية إلى إطلالتك مع هذا العقد النسائي المصنوع من الفولاذ المقاوم للصدأ بلمسة معدنية لامعة، المزين بتعليقة أنيقة على شكل قلب بتأثير لؤلؤي ناعم. تتألق سلسلته الرفيعة بتفصيل دائري صغير ولامع، ليمنحك مظهراً أنثوياً راقياً يناسب إطلالاتك اليومية والمناسبات الخاصة.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "CCJ-NEC-005": {
    en: {  name: "Women's Polished Necklace with Sparkling Bow Pendant", description: "Add a graceful finishing touch to your style with this elegant stainless steel necklace with a polished finish, featuring a sparkling bow-shaped pendant and a delicate chain. A feminine accessory designed to complement both everyday outfits and special occasions.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Collier femme à pendentif nœud ruban scintillant — finition brillante", description: "Craquez pour l'élégance délicate de ce collier pour femme en acier inoxydable à finition brillante, sublimé par un pendentif en forme de nœud ruban aux détails scintillants. Sa chaîne fine et son design féminin apportent une touche de charme et de raffinement à vos tenues quotidiennes comme à vos occasions spéciales.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "عقد نسائي بلمسة معدنية لامعة بتعليقة فيونكة براقة", description: "تألقي بإطلالة أنثوية ناعمة مع هذا العقد المصنوع من الفولاذ المقاوم للصدأ بلمسة معدنية لامعة، المزين بتعليقة أنيقة على شكل فيونكة مرصعة بتفاصيل براقة. يتميز بسلسلته الرفيعة وتصميمه الراقي الذي يضفي لمسة من الجمال والرقة على إطلالاتك اليومية والمناسبات الخاصة.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "CCJ-RNG-001": {
    en: {  name: "Women’s Polished Textured Infinity Ribbon Ring", description: "Elegant women’s stainless steel ring with a polished finish and a textured infinity ribbon design, perfect for adding a modern and radiant touch to everyday looks.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Bague femme ruban infini texturé — finition brillante", description: "Bague femme en acier inoxydable à finition brillante au design ruban infini texturé, élégante et moderne, idéale pour illuminer vos looks au quotidien.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "خاتم بلمسة معدنية لامعة نسائي بتصميم شريط لانهائي محبب", description: "خاتم نسائي من الفولاذ المقاوم للصدأ بلمسة معدنية لامعة بتصميم أنيق على شكل شريط لانهائي بملمس محبب، يضيف لمسة عصرية ومشرقة لإطلالتك.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "CCJ-RNG-002": {
    en: {  name: "Women's Polished Geometric Ring with Polished and Textured Rectangles", description: "Make a refined statement with this modern stainless steel ring with a polished finish, featuring an architectural arrangement of rectangular accents. Alternating polished and shimmering textured surfaces create a striking contrast, making it an elegant finishing touch for everyday and special-occasion looks.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Bague femme géométrique à rectangles lisses et texturés — finition brillante", description: "Affirmez votre style avec cette bague en acier inoxydable à finition brillante pour femme au design géométrique contemporain. Ses éléments rectangulaires alternent surfaces lisses et finitions texturées scintillantes, pour un contraste élégant et lumineux. Une pièce originale qui apporte du caractère à vos tenues quotidiennes et à vos occasions spéciales.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "خاتم نسائي بلمسة معدنية لامعة بتصميم هندسي ومستطيلات ناعمة ومحَبّبة", description: "أضيفي لمسة عصرية ومميزة إلى إطلالتك مع هذا الخاتم النسائي المصنوع من الفولاذ المقاوم للصدأ بلمسة معدنية لامعة، بتصميم هندسي أنيق يجمع بين أشكال مستطيلة ناعمة وأخرى ذات ملمس محبب ولامع. قطعة أنثوية تجمع بين البساطة والتألق، وتمنح إطلالتك لمسة من الفخامة والتميز.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "CCJ-RNG-003": {
    en: {  name: "Women's Polished Ring with Radiant Marquise Motif and Sparkling Accents", description: "Elevate your look with this elegant stainless steel ring with a polished finish, featuring a marquise-shaped centerpiece with a radiant sunburst-inspired texture. A luminous white-look border and two sparkling round accents create a sophisticated contrast for a modern feminine style.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Bague femme navette rayonnante et détails scintillants — finition brillante", description: "Apportez une touche d'éclat à votre style avec cette bague pour femme en acier inoxydable à finition brillante, au motif central en forme de navette, sublimé par une texture rayonnante inspirée des rayons du soleil. Son contour blanc lumineux et ses deux détails ronds scintillants créent un contraste raffiné pour une allure féminine et moderne.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "خاتم نسائي بلمسة معدنية لامعة بزخرفة مشعة وتفاصيل براقة", description: "تألقي بإطلالة أنيقة مع هذا الخاتم النسائي المصنوع من الفولاذ المقاوم للصدأ بلمسة معدنية لامعة، الذي يتميز بزخرفة مركزية بيضاوية مدببة بتفاصيل مشعة مستوحاة من أشعة الشمس. يحيط بها إطار أبيض ناعم، وتتزين الجوانب بلمستين دائريتين براقتين، ليمنحك تصميماً أنثوياً راقياً ومميزاً.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "CCJ-RNG-004": {
    en: {  name: "Women's Polished Crossed-Band Ring with Circular Motifs", description: "Elevate your style with this contemporary stainless steel ring with a polished finish, featuring an elegant crossed-band design. A polished diagonal accent adorned with three engraved circular motifs adds a refined geometric touch, making it a sophisticated accessory for everyday wear and special occasions.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Bague femme à anneaux croisés et motifs circulaires — finition brillante", description: "Affirmez votre élégance avec cette bague pour femme en acier inoxydable à finition brillante au design croisé contemporain. Ses anneaux entrelacés sont sublimés par une bande diagonale polie, ornée de trois motifs circulaires gravés. Un bijou raffiné au style géométrique qui apporte une touche moderne et sophistiquée à toutes vos tenues.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "خاتم نسائي بلمسة معدنية لامعة بحلقات متقاطعة وزخارف دائرية", description: "أضيفي لمسة من الأناقة العصرية إلى إطلالتك مع هذا الخاتم النسائي المصنوع من الفولاذ المقاوم للصدأ بلمسة معدنية لامعة، المصمم بحلقات متقاطعة وشريط مائل لامع مزين بثلاث زخارف دائرية دقيقة. تصميم هندسي راقٍ يجمع بين البساطة والفخامة ليكمل إطلالاتك اليومية والمناسبات الخاصة.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "CCJ-ANK-001": {     en: {  name: "Women’s Polished Stainless Steel Triple-Row Anklet", description: "Add a refined finishing touch to your look with this polished stainless steel women’s anklet. Its delicate triple-row design combines fine links and small elongated accents for an elegant, luminous effect. A minimalist accessory for everyday outfits and dressier occasions.", material: "Stainless steel", color: "Polished metallic finish"  },     fr: {  name: "Chaîne de cheville femme triple rang à finition brillante", description: "Apportez une touche de finesse à votre style avec cette chaîne de cheville femme en acier inoxydable à finition brillante. Son délicat design à triple rang, composé de maillons fins et de petits éléments allongés, crée une allure élégante et lumineuse. Un bijou minimaliste qui accompagne aussi bien vos looks quotidiens que vos tenues habillées.", material: "Acier inoxydable", color: "Finition métallique brillante"  },     ar: {  name: "خلخال نسائي من الفولاذ المقاوم للصدأ بلمسة معدنية لامعة بتصميم ثلاثي الصفوف", description: "أضيفي لمسة أنيقة إلى إطلالتك مع هذا الخلخال النسائي المصنوع من الفولاذ المقاوم للصدأ بلمسة معدنية لامعة. يتميز بتصميم رقيق من ثلاثة صفوف من السلاسل الرفيعة المتناسقة مع تفاصيل صغيرة مستطيلة، ليمنحك مظهراً أنثوياً راقياً يناسب إطلالاتك اليومية والمناسبات الخاصة.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },   },
  "CCJ-ANK-002": {
    en: {  name: "Women's Polished Stainless Steel Double-Layer Anklet with Five Pink Daisies", description: "Add a playful floral touch to your look with this Polished stainless steel women's anklet. Featuring an elegant double-layer design adorned with five delicate pink daisy charms with yellow centers, this feminine accessory brings a fresh, colorful finish to everyday and summer outfits.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Chaîne de cheville femme double rang à cinq fleurs roses — finition brillante", description: "Apportez une touche florale et féminine à votre style avec cette chaîne de cheville brillante pour femme en acier inoxydable. Son élégant design à double rang est agrémenté de cinq petites fleurs roses aux centres jaunes, pour un look délicat, coloré et lumineux. Un bijou plein de charme qui accompagne vos tenues estivales et vos looks du quotidien.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "خلخال نسائي بلمسة معدنية لامعة بسلسلتين وخمس زهور وردية", description: "أضيفي لمسة من الأنوثة والبهجة إلى إطلالتك مع هذا الخلخال النسائي المصنوع من الفولاذ المقاوم للصدأ بلمسة معدنية لامعة. يتميز بتصميم أنيق من سلسلتين رقيقتين تتدلى منهما خمس زهور وردية صغيرة بقلوب صفراء، ليمنحك مظهراً ناعماً ومشرقاً يناسب إطلالاتك اليومية والصيفية.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "CCJ-EAR-001": {
    en: {  name: "Women's Polished Baroque Filigree Drop Earrings with Clear Teardrops", description: "Elevate your look with this pair of Polished stainless steel drop earrings inspired by timeless baroque elegance. Intricate openwork scroll motifs, sparkling accents and clear oval details create an ornate, refined design. Faceted transparent teardrop pendants complete the look, making these statement earrings a beautiful choice for special occasions and elegant outfits.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Boucles d'oreilles pendantes baroques à filigranes et gouttes transparentes — finition brillante", description: "Sublimez vos tenues avec cette paire de boucles d'oreilles pendantes brillantes en acier inoxydable, inspirée de l'élégance baroque. Leurs motifs ajourés en filigrane, leurs détails scintillants et leurs ornements ovales transparents composent un design raffiné. De délicates gouttes transparentes facettées viennent parfaire ces bijoux au charme majestueux, idéals pour les occasions spéciales et les looks habillés.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "أقراط نسائية معدنية لامعة متدلية بزخارف باروكية وقطرات شفافة", description: "أضيفي لمسة من الفخامة إلى إطلالتك مع هذا الزوج من الأقراط النسائية المتدلية المصنوعة من الفولاذ المقاوم للصدأ بلمسة معدنية لامعة، والمستوحاة من الطراز الباروكي الأنيق. تتميز بزخارف معدنية لامعة مفرغة ومتداخلة وتفاصيل براقة مع عناصر شفافة بيضاوية، وتتزين في الأسفل بقطرات شفافة متعددة الأوجه تمنحها لمسة راقية تناسب المناسبات والإطلالات الأنيقة.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "CCJ-EAR-002": {
    en: {  name: "Women's Polished Stainless Steel Filigree Drop Earrings with Crystal-Style Pendants", description: "Women's stainless steel earrings in a Polished finish, featuring an elegant filigree drop design with delicate openwork details and crystal-style pendants. A refined and feminine pair, perfect for adding a sophisticated touch to dressy outfits and special occasions.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Boucles d'oreilles femme filigrane goutte et pampilles effet cristal — finition brillante", description: "Boucles d’oreilles femme en acier inoxydable à la finition brillante, au design filigrane raffiné avec silhouette en goutte, détails ajourés et pampille effet cristal. Une paire élégante et féminine, idéale pour apporter une touche sophistiquée à vos tenues habillées et occasions spéciales.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "أقراط نسائية من الفولاذ المقاوم للصدأ بلمسة معدنية لامعة بتصميم متدلٍ مزخرف وقطرات كريستالية", description: "أقراط نسائية من الفولاذ المقاوم للصدأ بلمسة معدنية لامعة، بتصميم متدلٍ أنيق مزخرف بتفاصيل مفرغة ولمسات على شكل قطرات كريستالية. زوج أنثوي وراقي يضيف لمسة فخمة ومميزة للإطلالات الأنيقة والمناسبات الخاصة.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "CCJ-EAR-003": {
    en: {  name: "Women's Polished Floral Medallion Drop Earrings with Clear Teardrops", description: "Add a refined touch to your look with these Polished stainless steel drop earrings. Their ornate circular medallions feature delicate floral openwork, sparkling clear accents and an elegant oval centerpiece. Each earring is finished with a faceted transparent teardrop pendant, creating a sophisticated statement for evening outfits and special occasions.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Boucles d'oreilles pendantes à rosaces fleuries et gouttes transparentes — finition brillante", description: "Apportez une touche de raffinement à vos tenues avec cette paire de boucles d'oreilles pendantes brillantes en acier inoxydable. Leurs élégantes rosaces ajourées, ornées de motifs floraux et de détails transparents scintillants, créent un effet lumineux et sophistiqué. Chaque boucle se termine par une délicate goutte transparente facettée, idéale pour sublimer vos tenues de soirée et vos occasions spéciales.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "أقراط نسائية معدنية لامعة متدلية بزخارف دائرية وقطرات شفافة", description: "تألقي بإطلالة راقية مع هذا الزوج من الأقراط النسائية المتدلية المصنوعة من الفولاذ المقاوم للصدأ بلمسة معدنية لامعة. تتميز بتصميم دائري مزخرف بنقوش زهرية مفرغة وتفاصيل شفافة براقة، مع زينة بيضاوية في الوسط. وتتدلى من كل قرط قطرة شفافة متعددة الأوجه، لتضيف لمسة أنيقة وفاخرة إلى إطلالاتك في المناسبات والسهرات.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "CCJ-EAR-004": {
    en: {  name: "Women's Polished Baroque Medallion Drop Earrings with Green Accents", description: "Make an elegant statement with these Polished stainless steel drop earrings. Two ornate circular medallions feature intricate baroque-inspired openwork and faceted green accents. Each earring finishes with a dangling oval green ornament, creating a sophisticated contrast of Polished and emerald-green tones, perfect for evening looks and special occasions.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Boucles d'oreilles pendantes à médaillons baroques et gouttes vertes — finition brillante", description: "Apportez une touche d'élégance majestueuse à votre style avec cette paire de boucles d'oreilles pendantes brillantes en acier inoxydable. Leurs deux médaillons circulaires aux motifs baroques ajourés mettent en valeur de magnifiques ornements verts facettés. Chaque boucle se termine par une délicate pampille ovale verte qui sublime l'ensemble. Un bijou raffiné, idéal pour illuminer vos tenues de soirée et vos occasions spéciales.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "أقراط نسائية معدنية لامعة متدلية بزخارف دائرية وقطع خضراء", description: "تألقي بإطلالة ملكية مع هذا الزوج من الأقراط النسائية المتدلية المصنوعة من الفولاذ المقاوم للصدأ بلمسة معدنية لامعة. يتميز كل قرط بزخارف دائرية مفرغة مستوحاة من الطراز الباروكي، تتوسطها تفاصيل خضراء براقة متعددة الأوجه، مع قطعة بيضاوية خضراء متدلية في الأسفل. تصميم أنيق يجمع بين فخامة اللمسة المعدنية اللامعة وجمال الأخضر ليضفي لمسة مميزة على إطلالاتك في المناسبات والسهرات.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "CCJ-EAR-005": {
    en: {  name: "Women's Polished Filigree Drop Earrings with Ornate Cone Pendants", description: "Enhance your look with these Polished stainless steel drop earrings featuring ornate floral openwork, curved geometric medallions and clear oval accents. Delicate cone-shaped filigree pendants complete their elegant, Eastern-inspired silhouette, making this matching pair a sophisticated accessory for special occasions and dressy outfits.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Boucles d'oreilles pendantes à médaillons ajourés et pampilles coniques — finition brillante", description: "Sublimez votre style avec cette paire de boucles d'oreilles pendantes brillantes en acier inoxydable. Leur design raffiné associe des motifs floraux ajourés, des médaillons géométriques aux lignes délicatement incurvées et des ornements ovales transparents. De fines pampilles coniques aux arabesques brillantes viennent compléter ces bijoux au charme oriental, parfaits pour les occasions spéciales et les tenues élégantes.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "أقراط نسائية معدنية لامعة متدلية بزخارف مفرغة وتعليقات مخروطية", description: "أضيفي لمسة من الأناقة الشرقية إلى إطلالتك مع هذا الزوج من الأقراط النسائية المتدلية المصنوعة من الفولاذ المقاوم للصدأ بلمسة معدنية لامعة. تتميز بزخارف زهرية مفرغة وقطع هندسية أنيقة ذات حواف منحنية، تتوسطها تفاصيل بيضاوية شفافة براقة. وتكتمل بتعليقات مخروطية مزخرفة بنقوش معدنية لامعة دقيقة، لتمنحك إطلالة راقية تناسب المناسبات والسهرات.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "CCJ-NEC-CYGNE": {
    en: {  name: "Swan Necklace with Accent Colours", description: "A swan-inspired stainless steel necklace offered in eight visual finish and accent colour options.", material: "Stainless steel", color: "Visual metallic finish with coloured accents"  },
    fr: {  name: "Collier Cygne aux Couleurs d’Accent", description: "Un collier en acier inoxydable inspiré du cygne, proposé en huit options visuelles de finition et de couleur d’accent.", material: "Acier inoxydable", color: "Finition métallique visuelle avec accents colorés"  },
    ar: {  name: "قلادة البجعة بألوان اللمسات", description: "قلادة من الفولاذ المقاوم للصدأ مستوحاة من البجعة، تتوفر بثمانية خيارات بصرية للتشطيب ولون اللمسة.", material: "الفولاذ المقاوم للصدأ", color: "تشطيب معدني بصري مع لمسات ملونة"  },
  },
  "CCJ-NEC-006": {
    en: {  name: "Women's Silver-Tone V Necklace with Square Pendant and Purple Accents", description: "A refined V-shaped necklace with a rounded-square pendant and purple and clear decorative accents. The silver-tone finish and delicate details bring polish to everyday outfits and special looks.", material: "Material not specified", color: "Silver-tone finish with purple and clear accents"  },
    fr: {  name: "Collier femme en V à pendentif carré et accents violets — finition argentée", description: "Collier femme au design en V et pendentif carré, orné d'accents décoratifs violets et transparents. La finition d'inspiration argentée et les détails délicats apportent une touche raffinée aux tenues du quotidien comme aux occasions spéciales.", material: "Matière non spécifiée", color: "Finition d'inspiration argentée avec accents violets et transparents"  },
    ar: {  name: "قلادة نسائية بتصميم حرف V بتعليقة مربعة ولمسات بنفسجية — لمسة بلون فضي", description: "قلادة نسائية بتصميم على شكل حرف V وتعليقة مربعة الشكل، مع لمسات زخرفية بنفسجية وشفافة. تمنح اللمسة بلون الفضي والتفاصيل الدقيقة إطلالة أنيقة تناسب الإطلالات اليومية والمناسبات الخاصة.", material: "المادة غير محددة", color: "لمسة بلون فضي مع لمسات بنفسجية وشفافة"  },
  },
  "CCJ-NEC-007": {
    en: {  name: "Women's Silver-Tone Pink Bow Necklace with Sparkling Detail", description: "A delicate silver-tone necklace centered on a sparkling pink bow motif. The light, feminine design pairs easily with everyday outfits and dressier occasions.", material: "Material not specified", color: "Silver-tone finish with pink bow detail"  },
    fr: {  name: "Collier femme à nœud papillon rose scintillant — finition argentée", description: "Collier femme à la finition d'inspiration argentée, centré sur un nœud papillon rose aux détails scintillants. Son design léger et féminin s'accorde aux tenues quotidiennes comme aux occasions spéciales.", material: "Matière non spécifiée", color: "Finition d'inspiration argentée avec nœud papillon rose"  },
    ar: {  name: "قلادة نسائية بروبطة وردية بتفاصيل براقة — لمسة بلون فضي", description: "قلادة نسائية بلمسة بلون فضي تتوسطها روبطة وردية بتفاصيل براقة. يتميز تصميمها الخفيف والأنثوي بأنه يناسب الإطلالات اليومية والمناسبات الخاصة.", material: "المادة غير محددة", color: "لمسة بلون فضي مع روبطة وردية"  },
  },
  "CCJ-NEC-008": {
    en: {  name: "Women's Silver-Tone Botanical Leaf Necklace with Pink Accents", description: "A silver-tone botanical necklace with leaf and branch detailing, pink and clear decorative accents, and a fresh, refined finish.", material: "Material not specified", color: "Silver-tone finish with pink and clear leaf accents"  },
    fr: {  name: "Collier femme à motifs feuilles et accents roses — finition argentée", description: "Collier femme à la finition d'inspiration argentée, au motif feuilles et branches agrémenté d'accents décoratifs roses et transparents. Son design botanique délicat offre une allure fraîche et raffinée pour les tenues du quotidien.", material: "Matière non spécifiée", color: "Finition d'inspiration argentée avec accents roses et transparents"  },
    ar: {  name: "قلادة نسائية بنقوش أوراق ولمسات وردية — لمسة بلون فضي", description: "قلادة نسائية بلمسة بلون فضي بنقوش أوراق وأغصان مع لمسات زخرفية وردية وشفافة. يمنحها تصميمها النباتي الرقيق مظهراً منعشاً وأنيقاً يناسب الإطلالات اليومية.", material: "المادة غير محددة", color: "لمسة بلون فضي مع لمسات وردية وشفافة على شكل أوراق"  },
  },
  "CCJ-NEC-009": {
    en: {  name: "Women's Silver-Tone Floral Necklace with Pink Teardrop Pendant", description: "A silver-tone floral necklace with a hanging pink teardrop pendant. Delicate motifs and soft colour create a feminine look for everyday styling and special occasions.", material: "Material not specified", color: "Silver-tone finish with floral motifs and a pink teardrop"  },
    fr: {  name: "Collier femme à motifs floraux et pendentif goutte rose — finition argentée", description: "Collier femme à la finition d'inspiration argentée réunissant des motifs floraux délicats et un pendentif goutte rose suspendu. Sa ligne féminine et ses accents colorés créent un contraste harmonieux pour vos looks quotidiens et vos occasions spéciales.", material: "Matière non spécifiée", color: "Finition d'inspiration argentée avec motifs floraux et goutte rose"  },
    ar: {  name: "قلادة نسائية بنقوش زهرية وتعليقة قطرة وردية — لمسة بلون فضي", description: "قلادة نسائية بلمسة بلون فضي تجمع نقوشاً زهرية رقيقة وتعليقة على شكل قطرة وردية متدلية. يمنحها تصميمها الأنثوي وألوانها الناعمة إطلالة متناسقة للاستخدام اليومي والمناسبات الخاصة.", material: "المادة غير محددة", color: "لمسة بلون فضي مع نقوش زهرية وقطرة وردية"  },
  },
  "CCJ-NEC-010": {
    en: {  name: "Women's Turquoise Blue Butterfly Necklace with Blue Glow in the Dark", description: "By daylight, this silver-tone necklace shows a turquoise blue butterfly with a light, playful silhouette. In darkness, the butterfly glows blue thanks to a genuine glow in the dark effect, a feature distinct from its usual daylight colour.", material: "Material not specified", color: "Silver-tone finish; turquoise blue butterfly by day, blue glow in the dark"  },
    fr: {  name: "Collier femme à papillon bleu turquoise — lumineux dans l'obscurité", description: "En plein jour, ce collier femme à la finition d'inspiration argentée révèle un papillon bleu turquoise au design léger et ludique. Dans l'obscurité, le papillon offre un éclat bleu grâce à un effet phosphorescent authentique, distinct de sa couleur habituelle.", material: "Matière non spécifiée", color: "Finition d'inspiration argentée ; papillon bleu turquoise en plein jour, bleu lumineux dans l'obscurité"  },
    ar: {  name: "قلادة نسائية بفراشة زرقاء تركوازية بتأثير مضيء في الظلام", description: "في ضوء النهار، تظهر في هذه القلادة النسائية بلمسة بلون فضي فراشة زرقاء تركوازية بتصميم خفيف ومرح. وفي الظلام، تتوهج الفراشة باللون الأزرق بفضل تأثير حقيقي مضيء في الظلام، وهو مختلف عن لونها المعتاد في النهار.", material: "المادة غير محددة", color: "لمسة بلون فضي؛ فراشة زرقاء تركوازية في ضوء النهار، مضيء في الظلام بالأزرق"  },
  },
  "CCJ-NEC-011": {
    en: {  name: "Women's Yellow Flower Necklace with Green Glow in the Dark and Message Pendant", description: "By daylight, this warm metallic-tone necklace pairs a yellow flower with a pendant engraved \"I will always choose you\". In darkness, the flower turns green and glows thanks to a genuine glow in the dark effect, distinct from its usual colour. A thoughtful fashion-jewellery gift with a delicate sentimental design.", material: "Material not specified", color: "Warm metallic-tone finish; yellow flower by day, green glow in the dark"  },
    fr: {  name: "Collier femme à fleur jaune phosphorescente et pendentif gravé « I will always choose you »", description: "En plein jour, ce collier femme à la finition métallique chaude associe une fleur jaune à un pendentif gravé « I will always choose you ». Dans l'obscurité, la fleur devient verte et lumineuse grâce à un effet phosphorescent authentique, distinct de sa couleur habituelle. Son inscription en fait un bijou fantaisie idéal à offrir.", material: "Matière non spécifiée", color: "Finition métallique chaude ; fleur jaune en plein jour, verte lumineuse dans l'obscurité"  },
    ar: {  name: "قلادة نسائية بزهرة صفراء بتأثير مضيء في الظلام وتعليقة برسالة \"I will always choose you\"", description: "في ضوء النهار، تجمع هذه القلادة النسائية بلمسة معدنية دافئة بين زهرة صفراء وتعليقة منقوش عليها \"I will always choose you\". وفي الظلام، تتحول الزهرة إلى الأخضر وتضيء بفضل تأثير حقيقي مضيء في الظلام، مختلف عن لونها المعتاد في النهار.", material: "المادة غير محددة", color: "لمسة معدنية دافئة؛ زهرة صفراء في ضوء النهار، مضيء في الظلام بالأخضر"  },
  },
  "CCJ-BRA-006": {
    en: {  name: "Women's Silver-Tone Bracelet with Sparkling Pink Heart Bow", description: "A delicate silver-tone women's bracelet with two sparkling pink heart-shaped decorative elements arranged like a bow, a fine row of clear shimmering accents, a lobster clasp and an extension chain.", material: "Material not specified", color: "Silver-tone finish; sparkling pink hearts and clear accents", seoTitle: "Women's Silver-Tone Sparkling Pink Heart Bow Bracelet | CCJAOUHARA", metaDescription: "A delicate silver-tone bracelet with two sparkling pink heart accents shaped like a bow, clear shimmering details, a lobster clasp and an extension chain.", imageAltText: "Silver-tone women's bracelet with two sparkling pink hearts arranged like a bow"  },
    fr: {  name: "Bracelet Femme Argenté à Nœud de Cœurs Roses Scintillants", description: "Un délicat bracelet femme à la finition d'inspiration argentée, orné de deux éléments décoratifs en forme de cœur rose scintillant disposés comme un nœud. Une fine rangée d'accents transparents étincelants, un fermoir homard et une chaîne d'extension complètent ce bijou fantaisie romantique.", material: "Matière non spécifiée", color: "Finition d'inspiration argentée ; cœurs roses scintillants et accents transparents", seoTitle: "Bracelet Femme Cœurs Roses Scintillants | CCJAOUHARA", metaDescription: "Découvrez ce bracelet femme argenté aux deux cœurs roses scintillants, entourés de détails lumineux. Un bijou romantique chez CCJAOUHARA.", imageAltText: "Bracelet femme argenté avec deux cœurs roses scintillants en forme de nœud"  },
    ar: {  name: "سوار نسائي فضي المظهر بفيونكة من قلبين ورديين لامعين", description: "سوار نسائي رقيق بمظهر فضي، مزين بعنصرين زخرفيين على شكل قلبين ورديين لامعين مرتبين كفيونكة. تكمله صفوف رفيعة من لمعات شفافة واضحة وإبزيم سرطاني وسلسلة تمديد، ليبدو كقطعة مجوهرات خيالية ذات طابع رومانسي.", material: "المادة غير محددة", color: "مظهر فضي؛ قلبان ورديان لامعان ولمعات شفافة", seoTitle: "سوار نسائي فضي المظهر بفيونكة قلبين ورديين لامعين | CCJAOUHARA", metaDescription: "سوار نسائي رقيق بمظهر فضي بفيونكة من قلبين ورديين لامعين ولمعات شفافة وإبزيم سرطاني وسلسلة تمديد.", imageAltText: "سوار نسائي بمظهر فضي وقلبان ورديان لامعان كفيونكة"  },
  },
  "CCJ-BRA-007": {
    en: {  name: "Women's Gold-Tone Double Flower Hand Chain Bracelet Ring", description: "An elegant gold-tone hand-chain bracelet connecting the wrist to a finger ring, decorated with two sculpted floral motifs and small spherical accents.", material: "Material not specified", color: "Gold-tone finish; sculpted floral motifs and spherical accents", seoTitle: "Women's Gold-Tone Double Flower Hand Chain Bracelet Ring | CCJAOUHARA", metaDescription: "An elegant gold-tone hand-chain bracelet connecting the wrist to a finger ring, with two sculpted floral motifs and small spherical accents.", imageAltText: "Gold-tone hand-chain bracelet with two sculpted flowers and a finger ring"  },
    fr: {  name: "Bracelet-Bague Femme Doré à Double Fleur et Chaîne de Main", description: "Un élégant bracelet-bague femme à la finition d'inspiration dorée, reliant le poignet à une bague de doigt par une délicate chaîne de main. Il est orné de deux motifs floraux sculptés et de petits accents sphériques, pour un bijou fantaisie au charme floral.", material: "Matière non spécifiée", color: "Finition d'inspiration dorée ; motifs floraux sculptés et accents sphériques", seoTitle: "Bracelet-Bague Femme Doré à Fleurs | CCJAOUHARA", metaDescription: "Découvrez ce bracelet-bague femme doré à double fleur, relié par une délicate chaîne de main. Un bijou floral élégant chez CCJAOUHARA.", imageAltText: "Bracelet-bague femme doré avec deux motifs floraux et une chaîne de main"  },
    ar: {  name: "سوار نسائي ذهبي المظهر متصل بخاتم بتصميم زهرتين", description: "سوار نسائي أنيق بمظهر ذهبي يربط المعصم بخاتم للإصبع عبر سلسلة يد رقيقة، ومزين بزهرتين منحوتتين ونقاط كروية صغيرة، ليبدو كقطعة مجوهرات خيالية بلمسة زهرية.", material: "المادة غير محددة", color: "مظهر ذهبي؛ زهرتان منحوتتان ونقاط كروية صغيرة", seoTitle: "سوار نسائي ذهبي المظهر بزهرتين وسلسلة يد | CCJAOUHARA", metaDescription: "سوار نسائي أنيق بمظهر ذهبي يربط المعصم بخاتم عبر سلسلة يد رقيقة، مع زهرتين منحوتتين ونقاط كروية صغيرة.", imageAltText: "سوار نسائي بمظهر ذهبي بزهرتين وسلسلة يد متصلة بخاتم"  },
  },
  "CCJ-SET-001": {
    en: {  name: "Women's Polished Double-Layer Necklace with Pearl-Look Beads and Rooster Medallions", description: "Add a distinctive touch to your look with this stainless steel double-layer necklace with a polished finish. Delicate chains are accented with oval pearl-look beads and two round rooster-motif medallions inspired by vintage coin designs. The combination of luminous beads and polished details creates a refined, vintage-inspired accessory for everyday styling and dressier occasions.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Parure femme double rang à perles nacrées et médaillons coq — finition brillante", description: "Apportez une touche d'originalité à votre style avec cette parure pour femme en acier inoxydable à finition brillante au design double rang. Ses chaînes délicates sont agrémentées de perles ovales à l'effet nacré et de deux médaillons circulaires ornés d'un motif de coq, dans un esprit pièce ancienne. L'association des détails brillants et des perles lumineuses crée un bijou élégant au charme vintage, parfait pour personnaliser vos tenues quotidiennes comme vos looks habillés.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "قلادة نسائية معدنية لامعة مزدوجة بحبات لؤلؤية وميداليات بنقش ديك", description: "أضيفي لمسة مميزة إلى إطلالتك مع هذه القلادة النسائية المصنوعة من الفولاذ المقاوم للصدأ بلمسة معدنية لامعة ذات التصميم المزدوج. تتزين بسلاسل رقيقة وحبات بيضاوية بمظهر لؤلؤي ناعم، مع ميداليتين دائريتين تحملان نقش ديك مستوحى من شكل القطع النقدية القديمة. يجمع هذا التصميم بين أناقة اللمسة المعدنية اللامعة وجمال التفاصيل الكلاسيكية ليمنحك إطلالة أنثوية راقية.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "CCJ-SET-002": {
    en: {  name: "Women's Polished Floral Jewelry Set with Necklace, Earrings, Ring and Bangle", description: "Complete your look with this elegant Polished stainless steel jewelry set featuring a twisted-chain necklace with a round floral pendant, a matching pair of earrings, a wide decorative ring and a statement bangle bracelet. Coordinated floral relief motifs and graceful ornamental scrollwork give the set a timeless, sophisticated appearance for special occasions and elegant styling.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Parure femme à motifs floraux — collier, boucles, bague et bracelet — finition brillante", description: "Apportez une touche d'élégance à votre style avec cette parure brillante pour femme en acier inoxydable. Composée d'un collier à pendentif rond, d'une paire de boucles d'oreilles assorties, d'une bague large et d'un bracelet jonc, elle séduit par ses motifs floraux en relief et ses arabesques raffinées. Un ensemble harmonieux au charme intemporel, idéal pour sublimer vos tenues et vos occasions spéciales.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "طقم مجوهرات نسائي بلمسة معدنية لامعة بنقوش زهرية مع عقد وأقراط وخاتم وسوار", description: "أضيفي لمسة من الأناقة والفخامة إلى إطلالتك مع هذا الطقم النسائي بلمسة معدنية لامعة المصنوع من الفولاذ المقاوم للصدأ. يتكون من عقد بسلسلة ملتوية وقلادة دائرية، وزوج من الأقراط المتناسقة، وخاتم عريض، وسوار دائري عريض. تتميز جميع القطع بزخارف زهرية بارزة ونقوش متداخلة أنيقة، لتمنحك إطلالة متكاملة تناسب المناسبات والإطلالات الراقية.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "CCJ-SET-003": {
    en: {  name: "Women's Polished Engraved Jewelry Set with Rectangular Pendant and Bangles", description: "Elevate your style with this elegant Polished stainless steel jewelry set featuring intricate engraved scrollwork. The coordinated ensemble includes a twisted-chain necklace with a rectangular pendant, a matching pair of decorative hoop earrings, a wide engraved ring and three complementary bangle bracelets combining ornate details with Polished surfaces. A timeless design for sophisticated outfits and special occasions.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Parure femme à pendentif rectangulaire et joncs gravés — finition brillante", description: "Affirmez votre élégance avec cette parure brillante pour femme en acier inoxydable, sublimée par de délicates arabesques gravées. Cet ensemble coordonné réunit un collier à chaîne torsadée et pendentif rectangulaire, une paire de créoles décorées, une bague large et trois bracelets joncs aux finitions alternant détails raffinés et surfaces polies. Un design raffiné au charme intemporel, idéal pour compléter vos tenues élégantes et vos occasions spéciales.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "طقم مجوهرات نسائي بلمسة معدنية لامعة بقلادة مستطيلة وأساور منقوشة", description: "تألقي بإطلالة أنيقة مع هذا الطقم النسائي بلمسة معدنية لامعة المصنوع من الفولاذ المقاوم للصدأ، والمزين بنقوش زخرفية دقيقة. يضم الطقم عقداً بسلسلة ملتوية وقلادة مستطيلة ذات وسط لامع وجوانب منقوشة، وزوجاً من الأقراط الدائرية، وخاتماً عريضاً، وثلاثة أساور دائرية متناسقة تجمع بين الزخارف البارزة والأسطح المصقولة. تصميم راقٍ يمنح إطلالتك لمسة فخمة في المناسبات والأوقات المميزة.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
  "CCJ-SET-004": {
    en: {  name: "Women's Polished Openwork Teardrop Jewelry Set with Necklace, Earrings, Ring and Cuff", description: "Make an elegant statement with this Polished stainless steel jewelry set featuring intricate openwork filigree and graceful teardrop-inspired motifs. The coordinated collection includes a necklace with ornamental teardrop elements and a central drop pendant, a matching pair of dangling earrings, a decorative openwork ring and a wide filigree cuff bracelet. Its refined scrolling patterns bring timeless charm to special occasions and sophisticated outfits.", material: "Stainless steel", color: "Polished metallic finish"  },
    fr: {  name: "Parure femme à motifs goutte ajourés — collier, boucles, bague et manchette — finition brillante", description: "Succombez au charme de cette parure brillante pour femme en acier inoxydable, sublimée par de délicates arabesques ajourées. Cet ensemble coordonné comprend un collier à motifs en forme de goutte et pendentif central, une paire de boucles d'oreilles pendantes assorties, une bague au décor ajouré et un large bracelet manchette orné de volutes raffinées. Une composition élégante au charme classique, idéale pour apporter une touche distinguée à vos tenues et occasions spéciales.", material: "Acier inoxydable", color: "Finition métallique brillante"  },
    ar: {  name: "طقم مجوهرات نسائي بلمسة معدنية لامعة بزخارف مفرغة على شكل قطرة", description: "تألقي بإطلالة راقية مع هذا الطقم النسائي بلمسة معدنية لامعة المصنوع من الفولاذ المقاوم للصدأ، والمزين بزخارف مفرغة مستوحاة من الأشكال الهندسية والنقوش التقليدية. يضم الطقم عقداً بزخارف على شكل قطرات وقلادة متدلية، وزوجاً من الأقراط الطويلة المتناسقة، وخاتماً مزخرفاً بتفاصيل مفرغة، وسواراً عريضاً بنقوش متشابكة أنيقة. تصميم متكامل يجمع بين الفخامة الكلاسيكية وجمال التفاصيل الدقيقة.", material: "الفولاذ المقاوم للصدأ", color: "لمسة معدنية لامعة"  },
  },
};