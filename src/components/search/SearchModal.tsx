import { useState, useEffect, useRef, useMemo } from 'react';
import { Product } from '../../types';
import { useTranslation } from '../../i18n';
import SearchInput from './SearchInput';
import SearchResults from './SearchResults';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (productId: string) => void;
  currency?: 'USD' | 'MAD';
}

function matchesQuery(product: Product, query: string): boolean {
  const q = query.toLowerCase();
  return (
    product.name.toLowerCase().includes(q) ||
    product.category.toLowerCase().includes(q) ||
    product.description.toLowerCase().includes(q)
  );
}

export default function SearchModal({ isOpen, onClose, products, onSelectProduct, currency }: SearchModalProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const results = useMemo(
    () => products.filter((p) => matchesQuery(p, query)),
    [products, query]
  );

  const handleSelect = (productId: string) => {
    onSelectProduct(productId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 right-0 z-50 flex justify-center">
      <div
        ref={panelRef}
        className="w-full max-w-xl mx-4 mt-2 bg-white border border-champagne-150 rounded-xl shadow-2xl overflow-hidden"
        style={{
          animation: 'searchFadeSlide 0.2s ease-out forwards',
        }}
      >
        <div className="p-4 pb-3">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder={t('search.placeholder')}
          />
        </div>
        <SearchResults
          results={results}
          query={query}
          onSelect={handleSelect}
          currency={currency}
        />
      </div>
      <style>{`
        @keyframes searchFadeSlide {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
