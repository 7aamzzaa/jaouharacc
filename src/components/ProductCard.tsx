import React, { memo, useCallback, useMemo, useState } from 'react';
import { Eye, Handbag, Heart, Share2, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import LazyImage from './LazyImage';
import ProductRating from './ProductRating';
import { useTranslation } from '../i18n';
import { useCurrency } from '../CurrencyContext';
import { getOriginalPrice } from '../data/originalPrices';
import { getLocalizedCategoryLabel, getProductLocalizedFields } from '../i18n/productTranslations';
import ShareModal from './ShareModal';

interface ProductCardProps {
  key?: any;
  product: Product;
  onViewDetails: (id: string) => void;
  onAddToCartDirect: (product: Product, size: string) => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  compact?: boolean;
  priority?: boolean;
}

const ProductCard = memo(function ProductCard({ product, onViewDetails, onAddToCartDirect, wishlist, onToggleWishlist, compact = false, priority = false }: ProductCardProps) {
  const { t, lang } = useTranslation();
  const { formatPrice } = useCurrency();
  const localized = useMemo(() => getProductLocalizedFields(product, lang), [product, lang]);
  const categoryLabel = getLocalizedCategoryLabel(t, product.category);
  const [showShareModal, setShowShareModal] = useState(false);
  const isOutOfStock = product.stock === 0;
  const originalPrice = getOriginalPrice(product.id, product.price);

  const handleViewClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails(product.id);
  }, [onViewDetails, product.id]);

  const handleAddClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCartDirect(product, 'Medium (7.0")');
  }, [onAddToCartDirect, product]);

  return (
    <div className={`group min-w-0 overflow-hidden bg-transparent border-0 shadow-none rounded-none transition-all duration-300 sm:bg-white sm:rounded-sm sm:border sm:border-champagne-150 sm:shadow-xs sm:hover:shadow-sm sm:hover:border-champagne-300 ${compact ? 'flex flex-col sm:block' : ''}`}>

      {/* Zoom Image Area */}
      <div
        onClick={() => onViewDetails(product.id)}
        className="cursor-pointer zoom-frame relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[22px] bg-[#FFF9F8] sm:rounded-none"
      >
        <LazyImage
          src={product.images[0]}
          alt={localized.name}
          className="zoom-image h-full w-full object-cover"
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
        />

        {/* Wishlist button: compact translucent circle on mobile, bare icon on desktop */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.35)] transition-all duration-200 cursor-pointer hover:scale-110 active:scale-75 sm:right-2 sm:top-2 sm:h-auto sm:w-auto sm:bg-transparent sm:p-1.5 sm:shadow-none"
          aria-label={wishlist.includes(product.id) ? t('productCard.removeFromWishlist') : t('productCard.addToWishlist')}
        >
          <Heart
            size={compact ? 15 : 16}
            className={'transition-all duration-200 ' + (wishlist.includes(product.id) ? 'text-champagne-500 fill-champagne-500' : 'text-stone-400 hover:text-champagne-500')}
          />
        </button>

        {/* Dynamic stock badges */}
        {isOutOfStock ? (
          <span className={`absolute left-2 top-2 z-10 rounded-[6px] bg-stone-900/90 px-2 py-1 text-[8px] font-semibold uppercase tracking-widest text-white sm:left-3 sm:top-3 sm:rounded-none sm:border sm:border-champagne-400 sm:bg-stone-900 sm:text-[9px] sm:px-3 ${compact ? 'sm:px-3' : ''}`}>
            {t('productCard.outOfStock')}
          </span>
        ) : product.stock <= 4 ? (
          <span className={`absolute left-2 top-2 z-10 rounded-[6px] bg-stone-900/90 px-2 py-1 text-[8px] font-bold uppercase tracking-widest text-champagne-300 sm:left-3 sm:top-3 sm:rounded-none sm:border sm:border-champagne-400 sm:bg-stone-900 sm:text-[9px] sm:text-champagne-400 sm:px-3 ${compact ? 'sm:px-3' : ''}`}>
            {t('productCard.onlyLeft', { stock: product.stock })}
          </span>
        ) : null}

        {/* Mobile quick add: small, light, and tucked into the image corner */}
        {!isOutOfStock && (
          <button
            onClick={handleAddClick}
            className="absolute bottom-2 right-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-burgundy shadow-[0_2px_8px_-3px_rgba(0,0,0,0.4)] transition-all duration-200 cursor-pointer active:scale-90 hover:bg-white sm:bottom-3 sm:right-3 sm:h-11 sm:w-11 sm:bg-champagne-500 sm:text-white sm:shadow-md sm:hover:bg-champagne-600"
            aria-label={t('productCard.quickAdd')}
            title={t('productCard.quickAdd')}
          >
            <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        )}

        {/* Desktop-only hover quick actions */}
        <div className="absolute inset-0 z-10 hidden items-center justify-center space-x-3 bg-stone-900/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:flex">
          <button
            onClick={handleViewClick}
            className="cursor-pointer bg-white hover:bg-[#FFF9F8] hover:text-champagne-500 text-stone-900 p-3 rounded-full shadow-md hover:scale-105 transition-all text-sm font-medium"
            title={t('productCard.viewDetails')}
          >
            <Eye size={16} />
          </button>
          {!isOutOfStock && (
            <button
              onClick={handleAddClick}
              className="cursor-pointer bg-stone-900 hover:bg-champagne-500 text-white p-3 rounded-full shadow-md hover:scale-105 transition-all text-sm font-semibold"
              title={t('productCard.quickAdd')}
            >
              <Handbag size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Product information: name -> optional original price -> current price */}
      <div className="flex flex-1 flex-col items-start px-0.5 pb-0 pt-2 sm:p-5">
        <div className="w-full space-y-1">
          <span className="hidden text-[10px] tracking-widest uppercase font-medium text-champagne-500 sm:inline">
            {categoryLabel}
          </span>

          <button
            onClick={() => onViewDetails(product.id)}
            className={`cursor-pointer line-clamp-2 min-h-[32px] w-full break-words text-start font-serif font-semibold leading-[16px] text-stone-800 transition-colors group-hover:text-champagne-500 focus:outline-hidden sm:min-h-0 sm:line-clamp-1 sm:leading-normal ${compact ? 'text-[12px] sm:text-sm' : 'text-[13px] sm:text-base'}`}
          >
            {localized.name}
          </button>

          <div className="mt-1.5 hidden sm:block">
            <ProductRating rating={product.rating} reviewsCount={product.reviews} compact={compact} />
          </div>
        </div>

        <div className="mt-1 flex min-h-[38px] w-full flex-col items-start gap-0.5 sm:mt-4 sm:min-h-0 sm:flex-row sm:items-center sm:justify-between sm:border-t sm:border-champagne-105 sm:pt-4">
          {originalPrice !== null && (
            <span className="text-[11px] leading-[14px] text-stone-400 line-through decoration-stone-300 sm:hidden">
              {formatPrice(originalPrice)}
            </span>
          )}
          <span className="font-serif text-[15px] font-bold leading-[20px] text-burgundy sm:text-base sm:font-extrabold sm:text-stone-950">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowShareModal(true);
            }}
            className="hidden cursor-pointer text-stone-400 hover:text-champagne-500 transition-colors duration-200 shrink-0 sm:block"
            aria-label={t('common.share')}
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        productName={localized.name}
        productUrl={typeof window !== 'undefined' ? `${window.location.origin}/product/${product.slug || product.id}` : ''}
      />

    </div>
  );
});

export default ProductCard;
