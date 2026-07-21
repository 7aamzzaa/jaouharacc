import { useTranslation } from '../../i18n';
import { Product } from '../../types';
import SearchResultCard from './SearchResultCard';

interface SearchResultsProps {
  results: Product[];
  query: string;
  onSelect: (productId: string) => void;
  currency?: 'USD' | 'MAD';
}

export default function SearchResults({ results, query, onSelect, currency }: SearchResultsProps) {
  const { t } = useTranslation();

  if (!query) return null;

  if (results.length === 0) {
    return (
      <div className="px-4 py-10 text-center">
        <p className="font-serif text-sm text-stone-500 mb-1">{t('search.noResults')}</p>
        <p className="text-xs text-stone-400">{t('search.tryKeyword')}</p>
      </div>
    );
  }

  return (
    <div className="max-h-80 overflow-y-auto">
      {results.map((product) => (
        <SearchResultCard
          key={product.id}
          product={product}
          onClick={() => onSelect(product.id)}
          currency={currency}
        />
      ))}
    </div>
  );
}
