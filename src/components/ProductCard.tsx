import React, { memo, useCallback, useState } from 'react';
import { Eye, Handbag, Heart, Share2, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import LazyImage from './LazyImage';
import ProductRating from './ProductRating';
import { useTranslation } from '../i18n';
import ShareModal from './ShareModal';

interface ProductCardProps {
  key?: any;
  product: Product;
  onViewDetails: (id: string) => void;
  onAddToCartDirect: (product: Product, size: string) => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  currency?: 'USD' | 'MAD';
  compact?: boolean;
  priority?: boolean;
}

const ProductCard = memo(function ProductCard({ product, onViewDetails, onAddToCartDirect, wishlist, onToggleWishlist, currency = 'USD', compact = false, priority = false }: ProductCardProps) {
  const { t } = useTranslation();
  const [showShareModal, setShowShareModal] = useState(false);
  const isOutOfStock = product.stock === 0;

  const handleViewClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails(product.id);
  }, [onViewDetails, product.id]);

  const handleAddClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCartDirect(product, 'Medium (7.0")');
  }, [onAddToCartDirect, product]);

  return (
    <div className={`group bg-white rounded-sm overflow-hidden border border-champagne-150 shadow-xs hover:shadow-sm hover:border-champagne-300 transition-all duration-300 ${compact ? 'flex flex-col sm:block' : ''}`}>
      
      {/* Zoom Image Area */}
      <div 
        onClick={() => onViewDetails(product.id)}
        className="cursor-pointer zoom-frame aspect-square bg-[#FFF9F8] flex items-center justify-center relative"
      >
        <LazyImage
          src={product.images[0]}
          alt={product.imageAltText || product.name}
          className="zoom-image object-cover w-full h-full"
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
        />

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className='absolute top-2 right-2 z-20 p-1.5 rounded-full transition-all duration-200 cursor-pointer hover:scale-110 active:scale-75'
          aria-label={wishlist.includes(product.id) ? t('productCard.removeFromWishlist') : t('productCard.addToWishlist')}
        >
          <Heart
            size={compact ? 15 : 16}
            className={'transition-all duration-200 ' + (wishlist.includes(product.id) ? 'text-champagne-500 fill-champagne-500' : 'text-stone-400 hover:text-champagne-500')}
          />
        </button>

        {/* Dynamic Badges */}
        {isOutOfStock ? (
          <span className={`absolute top-3 left-3 bg-stone-900 border border-champagne-400 text-white tracking-widest uppercase font-semibold rounded-none z-10 ${compact ? 'text-[8px] px-2 py-1 sm:text-[9px] sm:px-3' : 'text-[9px] py-1 px-3'}`}>
            {t('productCard.outOfStock')}
          </span>
        ) : product.stock <= 4 ? (
          <span className={`absolute top-3 left-3 bg-stone-900 border border-champagne-400 text-champagne-400 tracking-widest uppercase font-bold rounded-none z-10 ${compact ? 'text-[8px] px-2 py-1 sm:text-[9px] sm:px-3' : 'text-[9px] py-1 px-3'}`}>
            {t('productCard.onlyLeft', { stock: product.stock })}
          </span>
        ) : null}

        {/* Persistent Mobile Quick Add Button (below 640px only) */}
        {!isOutOfStock && (
          <button
            onClick={handleAddClick}
            className="sm:hidden absolute bottom-3 right-3 z-20 w-11 h-11 rounded-full bg-champagne-500 text-white flex items-center justify-center shadow-md active:scale-90 hover:bg-champagne-600 transition-all duration-200 cursor-pointer"
            aria-label={t('productCard.quickAdd')}
            title={t('productCard.quickAdd')}
          >
            <ShoppingBag size={20} />
          </button>
        )}

        {/* Floating Quick Action Overlay */}
        <div className="absolute inset-0 bg-stone-900/30 opacity-0 group-hover:opacity-100 flex items-center justify-center space-x-3 transition-opacity duration-300 z-10">
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

      {/* Product Information Detail Card */}
      <div className={`${compact ? 'p-3 sm:p-5' : 'p-5'} flex flex-col justify-between flex-1`}>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[10px] tracking-widest uppercase font-medium text-champagne-500">
              {product.category}
            </span>

          </div>
          
          <button 
            onClick={() => onViewDetails(product.id)}
            className={`cursor-pointer font-serif text-stone-800 group-hover:text-champagne-500 transition-colors text-start line-clamp-1 font-semibold focus:outline-hidden ${compact ? 'text-sm sm:text-base' : 'text-base'}`}
          >
            {product.name}
          </button>

          <div className="mt-1.5">
            <ProductRating rating={product.rating} reviewsCount={product.reviews} compact={compact} />
          </div>
        </div>

        <div className={`flex items-center justify-between border-t border-champagne-105 ${compact ? 'mt-3 pt-3 sm:mt-4 sm:pt-4' : 'mt-4 pt-4'}`}>
          <span className={`font-serif text-stone-950 font-extrabold ${compact ? 'text-sm sm:text-base' : 'text-base'}`}>
            {currency === 'MAD' ? `${(product.price * 10).toLocaleString()} ${t('common.currency')}` : `$${product.price.toLocaleString()}`}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowShareModal(true);
            }}
            className="cursor-pointer text-stone-400 hover:text-champagne-500 transition-colors duration-200 shrink-0"
            aria-label={t('common.share')}
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        productName={product.name}
        productUrl={typeof window !== 'undefined' ? `${window.location.origin}/product/${product.id}` : ''}
      />

    </div>
  );
});

export default ProductCard;
