import { useState, useEffect } from 'react';
import { Minus, Plus, ShoppingBag, ShieldCheck, Heart, Sparkles, Scale, RefreshCw, ArrowLeft } from 'lucide-react';
import { Product } from '../types';
import { useTranslation } from '../i18n';

interface ProductDetailProps {
  productId: string;
  allProducts: Product[];
  onAddToCart: (product: Product, quantity: number, size: string) => void;
  onPageChange: (pageName: string, params?: any) => void;
  currency: 'USD' | 'MAD';
}

export default function ProductDetail({ productId, allProducts, onAddToCart, onPageChange, currency }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>('Medium (7.0")');
  const [quantity, setQuantity] = useState<number>(1);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [addedMessage, setAddedMessage] = useState<boolean>(false);
  const { t } = useTranslation();

  // Load product criteria
  useEffect(() => {
    const found = allProducts.find(p => p.id === productId);
    if (found) {
      setProduct(found);
      setActiveImageIndex(0);
      setQuantity(1);
    }
    // Scroll to top on load
    window.scrollTo(0, 0);
  }, [productId, allProducts]);

  if (!product) {
    return (
      <div className="text-center py-24 space-y-4">
        <RefreshCw size={36} className="animate-spin text-champagne-500 mx-auto" />
        <p className="font-serif text-lg text-stone-700">{t('productDetail.loading')}</p>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;

  // Sizes array details
  const sizeOptions = [
    { label: t('productDetail.sizes.small'), desc: t('productDetail.sizes.smallDesc') },
    { label: t('productDetail.sizes.medium'), desc: t('productDetail.sizes.mediumDesc') },
    { label: t('productDetail.sizes.large'), desc: t('productDetail.sizes.largeDesc') },
  ];

  // Recommendations: Other bracelets in same category, up to 3
  const recommendations = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  // Handle add to bag action
  const handleAddToBag = () => {
    if (isOutOfStock) return;
    onAddToCart(product, quantity, selectedSize);
    setAddedMessage(true);
    setTimeout(() => {
      setAddedMessage(false);
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      
      {/* Editorial Backlink */}
      <button
        onClick={() => onPageChange('shop')}
        className="cursor-pointer group flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 hover:text-champagne-600 font-semibold transition-colors focus:outline-hidden"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        {t('productDetail.back')}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Aspect: Image Gallery Frame */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main Visual Display */}
          <div className="zoom-frame aspect-square bg-stone-50 border border-champagne-100 rounded-lg overflow-hidden relative">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="zoom-image object-cover w-full h-full"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center">
                <span className="bg-stone-950 text-white text-xs tracking-widest uppercase font-semibold py-2 px-6 shadow-xl">
                  {t('productDetail.soldOutOverlay')}
                </span>
              </div>
            )}
          </div>

          {/* Galleries Thumbnails Row */}
          {product.images.length > 1 && (
            <div className="flex gap-4">
              {product.images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`cursor-pointer w-24 aspect-square bg-stone-50 border rounded-xs overflow-hidden transition-all ${
                    activeImageIndex === idx
                      ? 'border-champagne-500 ring-1 ring-champagne-500'
                      : 'border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <img src={imgUrl} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

        </div>

        {/* Right Aspect: Purchasing Controls Portal */}
        <div className="lg:col-span-5 space-y-8">
          
          <div className="space-y-3 pb-6 border-b border-champagne-100">
            <div className="flex justify-between items-center">
              <span className="text-xs tracking-[0.25em] uppercase text-champagne-600 font-semibold font-sans">
                {product.category}
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-stone-400 bg-stone-100 px-2 py-1 rounded-sm">
                {t('productDetail.inStock', { count: product.stock })}
              </span>
            </div>
            
            <h1 className="font-serif text-3xl sm:text-4xl text-stone-950 font-medium leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center justify-between pt-2">
              <p className="font-serif text-2xl text-stone-900 font-medium font-bold">
                {currency === 'MAD' ? `${(product.price * 10).toLocaleString()} درهم` : `$${product.price.toLocaleString()}`}
              </p>
              <span className="text-xs text-stone-500 font-semibold">
                {t('productDetail.shipping')}
              </span>
            </div>
          </div>

          {/* Curated Description */}
          <div className="space-y-2">
            <h3 className="text-xs tracking-widest uppercase text-stone-800 font-semibold">{t('productDetail.artisanStory')}</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-sans font-normal">
              {product.description}
            </p>
          </div>

          {/* Size Form Selector */}
          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <h3 className="text-xs tracking-widest uppercase text-stone-800 font-semibold">{t('productDetail.sizeHeading')}</h3>
              <a href="#" className="text-[10px] text-champagne-600 hover:underline hover:text-champagne-700 font-semibold">
                {t('productDetail.sizingGuide')}
              </a>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {sizeOptions.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setSelectedSize(opt.label)}
                  className={`cursor-pointer p-3 border rounded-md text-center transition-all focus:outline-hidden ${
                    selectedSize === opt.label
                      ? 'border-champagne-500 bg-luxe-pink-50 text-champagne-600 font-semibold'
                      : 'border-stone-200 hover:border-stone-400 text-stone-700 bg-white'
                  }`}
                >
                  <span className="block text-xs font-semibold">{opt.label.split(' ')[0]}</span>
                  <span className="text-[9px] text-stone-400 mt-0.5 block">{opt.label.split(' ')[1]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Controls and Add to Cart Button Block */}
          <div className="space-y-4 pt-4">
            
            <div className="flex gap-4 items-center">
              
              {/* Quantity Increments */}
              <div className="flex items-center border border-stone-200 bg-white px-2 py-1 rounded-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={isOutOfStock}
                  className="p-2 text-stone-500 hover:text-stone-950 disabled:opacity-30 focus:outline-hidden"
                  aria-label={t('productDetail.decreaseQty')}
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-xs font-semibold font-mono">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={isOutOfStock || quantity >= product.stock}
                  className="p-2 text-stone-500 hover:text-stone-950 disabled:opacity-30 focus:outline-hidden"
                  aria-label={t('productDetail.increaseQty')}
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Add to Bag Trigger */}
              <button
                onClick={handleAddToBag}
                disabled={isOutOfStock}
                className={`cursor-pointer flex-1 py-4 px-6 tracking-widest text-xs uppercase font-medium shadow-md transition-all duration-300 flex items-center justify-center gap-2 focus:outline-hidden ${
                  isOutOfStock
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : 'bg-stone-900 hover:bg-champagne-600 text-white'
                }`}
              >
                <ShoppingBag size={14} />
                {isOutOfStock ? t('productDetail.soldOut') : t('productDetail.addToCart')}
              </button>

              {/* Add to Wishlist Toggle */}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`cursor-pointer p-4 border rounded-sm transition-all focus:outline-hidden ${
                  isFavorite ? 'border-rose-300 text-rose-500 bg-rose-50' : 'border-stone-200 hover:border-stone-400 text-stone-500'
                }`}
                title={t('productDetail.addToWishlist')}
              >
                <Heart size={16} className={isFavorite ? 'fill-rose-500' : ''} />
              </button>

            </div>

            {/* Micro Add Alert */}
            {addedMessage && (
              <div className="text-center bg-emerald-50 text-emerald-800 text-xs py-2 rounded-sm border border-emerald-100 font-sans tracking-wide">
                {t('productDetail.added')}
              </div>
            )}

          </div>

          {/* Technical Spec List */}
          <div className="border-t border-champagne-100 pt-6 space-y-4">
            <h3 className="text-xs tracking-widest uppercase text-stone-800 font-semibold">{t('productDetail.specs')}</h3>
            <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-xs font-sans">
              <div className="flex justify-between border-b border-stone-50 pb-1.5">
                <span className="text-stone-400">{t('productDetail.metal')}</span>
                <span className="text-stone-700 font-medium">{product.material}</span>
              </div>
              <div className="flex justify-between border-b border-stone-50 pb-1.5">
                <span className="text-stone-400">{t('productDetail.hue')}</span>
                <span className="text-stone-700 font-medium">{product.color}</span>
              </div>
              <div className="flex justify-between border-b border-stone-50 pb-1.5">
                <span className="text-stone-400">{t('productDetail.model')}</span>
                <span className="text-stone-700 font-medium">{product.id.toUpperCase()}</span>
              </div>
              <div className="flex justify-between border-b border-stone-50 pb-1.5">
                <span className="text-stone-400">{t('productDetail.artisanClass')}</span>
                <span className="text-stone-700 font-medium">{t('productDetail.guildLevel')}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Recommendations Gallery Section */}
      {recommendations.length > 0 && (
        <section className="space-y-8 border-t border-champagne-100 pt-16">
          <div className="text-center">
            <span className="text-[10px] tracking-[0.2em] uppercase text-champagne-500 font-medium font-sans">
              {t('productDetail.recommendations')}
            </span>
            <h2 className="font-serif text-2xl text-stone-950 mt-1 font-medium">{t('productDetail.youMayAlsoLike')}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {recommendations.map((p) => (
              <div
                key={p.id}
                onClick={() => onPageChange('product', { id: p.id })}
                className="cursor-pointer group space-y-3 bg-white border border-champagne-100/50 p-4 rounded-md hover:shadow-lg transition-all"
              >
                <div className="zoom-frame aspect-square bg-stone-50 rounded-xs overflow-hidden">
                  <img src={p.images[0]} alt={p.name} className="zoom-image object-cover w-full h-full" />
                </div>
                <div>
                  <h3 className="font-serif text-sm text-stone-800 line-clamp-1 group-hover:text-champagne-600 transition-colors">
                    {p.name}
                  </h3>
                  <p className="font-serif text-sm text-stone-900 font-semibold mt-1 font-bold">
                    {currency === 'MAD' ? `${(p.price * 10).toLocaleString()} درهم` : `$${p.price.toLocaleString()}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
