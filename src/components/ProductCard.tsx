import React, { memo, useCallback } from 'react';
import { Eye, Handbag } from 'lucide-react';
import { Product } from '../types';
import LazyImage from './LazyImage';
import { useTranslation } from '../i18n';

interface ProductCardProps {
  key?: any;
  product: Product;
  onViewDetails: (id: string) => void;
  onAddToCartDirect: (product: Product, size: string) => void;
  currency?: 'USD' | 'MAD';
}

const ProductCard = memo(function ProductCard({ product, onViewDetails, onAddToCartDirect, currency = 'USD' }: ProductCardProps) {
  const { t } = useTranslation();
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
    <div className="group bg-white rounded-sm overflow-hidden border border-champagne-150 shadow-xs hover:shadow-sm hover:border-champagne-300 transition-all duration-300">
      
      {/* Zoom Image Area */}
      <div 
        onClick={() => onViewDetails(product.id)}
        className="cursor-pointer zoom-frame aspect-square bg-[#FFF9F8] flex items-center justify-center relative"
      >
        <LazyImage
          src={product.images[0]}
          alt={product.name}
          className="zoom-image object-cover w-full h-full"
        />

        {/* Dynamic Badges */}
        {isOutOfStock ? (
          <span className="absolute top-3 left-3 bg-stone-900 border border-champagne-400 text-white text-[9px] tracking-widest uppercase font-semibold py-1 px-3 rounded-none z-10">
            {t('productCard.outOfStock')}
          </span>
        ) : product.stock <= 4 ? (
          <span className="absolute top-3 left-3 bg-stone-900 border border-champagne-400 text-champagne-400 text-[9px] tracking-widest uppercase font-bold py-1 px-3 rounded-none z-10">
            {t('productCard.onlyLeft', { stock: product.stock })}
          </span>
        ) : null}

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
      <div className="p-5 flex flex-col justify-between flex-1">
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[10px] tracking-widest uppercase font-medium text-champagne-500">
              {product.category}
            </span>

          </div>
          
          <button 
            onClick={() => onViewDetails(product.id)}
            className="cursor-pointer font-serif text-base text-stone-800 group-hover:text-champagne-500 transition-colors text-start line-clamp-1 font-semibold focus:outline-hidden"
          >
            {product.name}
          </button>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-champagne-105">
          <span className="font-serif text-base text-stone-950 font-extrabold">
            {currency === 'MAD' ? `${(product.price * 10).toLocaleString()} ${t('common.currency')}` : `$${product.price.toLocaleString()}`}
          </span>

        </div>
      </div>

    </div>
  );
});

export default ProductCard;
