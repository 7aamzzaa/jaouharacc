import { Product } from '../../types';
import { useCurrency } from '../../CurrencyContext';
import { useTranslation } from '../../i18n';
import { getLocalizedCategoryLabel, getProductLocalizedFields } from '../../i18n/productTranslations';

interface SearchResultCardProps {
  product: Product;
  onClick: () => void;
}

export default function SearchResultCard({ product, onClick }: SearchResultCardProps) {
  const { formatPrice } = useCurrency();
  const { t, lang } = useTranslation();
  const localized = getProductLocalizedFields(product, lang);
  const categoryLabel = getLocalizedCategoryLabel(t, product.category);

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-champagne-50/60 transition-colors text-start cursor-pointer border-b border-champagne-100/50 last:border-b-0"
    >
      <div className="w-12 h-12 rounded-lg bg-[#FFF9F8] flex-shrink-0 overflow-hidden border border-champagne-100">
        <img
          src={product.images[0]}
          alt={localized.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-serif text-sm text-stone-800 truncate font-semibold">{localized.name}</p>
        <p className="text-[10px] tracking-widest uppercase text-champagne-500 font-medium truncate">{categoryLabel}</p>
      </div>
      <span className="font-serif text-sm text-stone-950 font-bold flex-shrink-0">
        {formatPrice(product.price)}
      </span>
    </button>
  );
}
