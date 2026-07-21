import { Heart } from 'lucide-react';
import { Product } from '../types';
import { useTranslation } from '../i18n';
import ProductCard from '../components/ProductCard';

interface WishlistProps {
  wishlist: string[];
  allProducts: Product[];
  onToggleWishlist: (id: string) => void;
  onPageChange: (page: string, params?: any) => void;
  onAddToCartDirect: (product: Product, size: string) => void;
  currency: 'USD' | 'MAD';
}

export default function Wishlist({ wishlist, allProducts, onToggleWishlist, onPageChange, onAddToCartDirect, currency }: WishlistProps) {
  const { t } = useTranslation();
  const items = allProducts.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center space-y-4 max-w-xl mx-auto py-6">
        <span className="text-xs tracking-[0.3em] font-medium uppercase text-champagne-500 font-sans block">
          {t('wishlist.title')}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white border border-champagne-100 rounded-lg space-y-4">
          <Heart size={48} className="mx-auto text-stone-300" />
          <p className="font-serif text-xl text-stone-800 font-medium">{t('wishlist.empty')}</p>
          <button
            onClick={() => onPageChange('shop')}
            className="cursor-pointer bg-champagne-500 hover:bg-champagne-600 text-white uppercase text-xs tracking-widest px-6 py-3 font-semibold transition-colors"
          >
            {t('wishlist.shopNow')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {items.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={(id) => onPageChange('product', { id })}
              onAddToCartDirect={onAddToCartDirect}
              wishlist={wishlist}
              onToggleWishlist={onToggleWishlist}
              currency={currency}
            />
          ))}
        </div>
      )}
    </div>
  );
}
