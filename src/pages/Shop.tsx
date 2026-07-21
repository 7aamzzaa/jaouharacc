import { useTranslation } from '../i18n';
import { useState, useMemo, useEffect } from 'react';
import { Filter, Eye, SlidersHorizontal, Grid3X3, ArrowUpDown, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';

interface ShopProps {
  products: Product[];
  isLoading: boolean;
  initialCategory: string | null;
  onPageChange: (pageName: string, params?: any) => void;
  onAddToCartDirect: (product: Product, size: string) => void;
  onClearInitialCategory: () => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  currency: 'USD' | 'MAD';
}

const categoryDisplayNames: Record<string, string> = {
  all: 'All Collections',
  bracelets: 'Bracelets',
  rings: 'Rings',
  earrings: 'Earrings',
  anklets: 'Anklets',
  necklaces: 'Necklaces',
  jewelry_sets: 'Jewelry Sets'
};

const categoryDescriptions: Record<string, string> = {
  all: 'Unlock standard sizes and stack delicate jewelry crafted under our rigorous heritage covenants. Filter below by custom materials, color tones, or price ranges.',
  bracelets: 'Fine cuffs, luxurious bangles, and dainty link chain wrist assemblies, triple-plated in solid gold and sterling silver.',
  rings: 'Exquisite diamond solitaires, timeless wedding bands, and custom-crafted stackable rings made for modern elegance.',
  earrings: 'Dazzling hoops, luxurious studs, and cascading Ethiopian chandelier droplets designed to capture the light of your movements.',
  anklets: 'Delicate double chains and crystalline figaro link anklets built for understated grace and all-day comfort.',
  necklaces: 'Masterfully crafted royal crown pendants, chokers, and delicate necklaces styled for luxury layered looks.',
  jewelry_sets: 'Breathtaking high-jewelry parures, themed suites, and complete sets curated for weddings and grand soirees.'
};

export default function Shop({
  products,
  isLoading,
  initialCategory,
  onPageChange,
  onAddToCartDirect,
  onClearInitialCategory,
  wishlist,
  onToggleWishlist,
  currency
}: ShopProps) {
  const { t } = useTranslation();

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('default');
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // Sync category filtered on home click
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
      // Consume initialCategory so changes from this page can be done
      onClearInitialCategory();
    }
  }, [initialCategory]);

  // Dynamic SEO metadata injection for Moroccan / French luxury target
  useEffect(() => {
    const currentKey = selectedCategory.toLowerCase();
    document.title = t('shop.seo.' + currentKey + '.title');
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', t('shop.seo.' + currentKey + '.desc'));
  }, [selectedCategory]);

  // Derive unique materials and colors from existing database list
  const filterOptions = useMemo(() => {
    const categories = ['All', ...new Set(products.map(p => p.category))];
    return { categories };
  }, [products]);

  // Apply Filter Logic
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category Filter
    if (selectedCategory !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Sort Logic
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [products, selectedCategory, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSortBy('default');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Editorial Header */}
      <div className="text-center space-y-4 max-w-xl mx-auto py-6">
        <span className="text-xs tracking-[0.3em] font-medium uppercase text-champagne-500 font-sans block">
          {t('shop.header.label')}
        </span>
        <h1 className="font-serif text-4xl text-stone-900 font-semibold tracking-wide capitalize">
          {t('shop.header.categories.' + selectedCategory.toLowerCase())}
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
          {t('shop.header.descriptions.' + selectedCategory.toLowerCase())}
        </p>
      </div>

      {/* Filtering + Sorting Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-5 border border-champagne-100/50 rounded-lg">
        
        {/* Toggle Filters & Result Statistics */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="cursor-pointer flex items-center gap-2 hover:text-champagne-600 border border-stone-200 hover:border-champagne-300 px-4 py-2 text-xs uppercase tracking-widest text-stone-700 font-medium transition-colors"
          >
            <SlidersHorizontal size={14} />
            {showMobileFilters ? t('shop.filters.hide') : t('shop.filters.show')}
          </button>
          
          <span className="text-xs text-stone-400 font-sans font-medium">
            {t('shop.filters.showing', { count: filteredProducts.length, total: products.length })}
          </span>
        </div>

        {/* Dynamic Sorting Selection */}
        <div className="flex items-center w-full md:w-auto justify-end gap-3 border-t md:border-t-0 border-stone-100 pt-3 md:pt-0">
          <label htmlFor="shop-sorting" className="text-stone-500 text-xs font-medium whitespace-nowrap flex items-center gap-1.5">
            <ArrowUpDown size={12} /> {t('shop.filters.sortLabel')}
          </label>
          <select
            id="shop-sorting"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent border border-stone-200 text-xs text-stone-700 py-2 px-3 focus:outline-hidden focus:border-champagne-400 rounded-xs"
          >
            <option value="default">{t('shop.filters.sortDefault')}</option>
            <option value="price-asc">{t('shop.filters.sortPriceAsc')}</option>
            <option value="price-desc">{t('shop.filters.sortPriceDesc')}</option>
            <option value="name-asc">{t('shop.filters.sortNameAsc')}</option>
          </select>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* FILTERS PANEL (Sidebar on desktop, Collapsible on mobile) */}
        {(showMobileFilters || window.innerWidth >= 1024) && (
          <aside className={`lg:col-span-3 space-y-8 bg-white p-6 border border-champagne-100 rounded-lg ${
            showMobileFilters ? 'block' : 'hidden lg:block'
          }`}>
            <div className="flex justify-between items-center pb-4 border-b border-stone-100">
              <h3 className="font-serif md:text-lg text-stone-900 font-semibold flex items-center gap-2">
                <Filter size={16} className="text-champagne-500" /> {t('shop.filters.heading')}
              </h3>
              <button
                onClick={handleResetFilters}
                className="cursor-pointer text-[10px] tracking-widest uppercase font-semibold text-stone-400 hover:text-champagne-500"
              >
                {t('shop.filters.reset')}
              </button>
            </div>

            {/* Categories Sector */}
            <div className="space-y-3">
              <h4 className="text-xs tracking-wider uppercase text-stone-800 font-semibold">{t('shop.filters.collections')}</h4>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {filterOptions.categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`cursor-pointer text-xs text-start px-3 py-2 rounded-md transition-all duration-300 w-full ${
                      selectedCategory.toLowerCase() === cat.toLowerCase()
                        ? 'bg-amber-100/30 text-champagne-600 font-semibold border-s-2 border-champagne-500 pl-4 shadow-2xs'
                        : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900 border-s-2 border-transparent'
                    }`}
                  >
                    {t('shop.header.categories.' + cat.toLowerCase())}
                  </button>
                ))}
              </div>
            </div>

          </aside>
        )}

        {/* PRODUCTS BENTO GRID */}
        <main className={`lg:col-span-9 ${
          (showMobileFilters || window.innerWidth >= 1024) ? 'lg:col-span-9' : 'lg:col-span-12'
        } w-full`}>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="space-y-4 animate-pulse">
                  <div className="bg-stone-200 aspect-square w-full rounded-lg"></div>
                  <div className="h-4 bg-stone-200 w-1/3"></div>
                  <div className="h-6 bg-stone-200 w-3/4"></div>
                  <div className="h-4 bg-stone-200 w-1/4"></div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white border border-champagne-100 rounded-lg space-y-4">
              <div className="text-stone-300 flex justify-center">
                <RefreshCw size={48} className="animate-spin duration-[6s]" />
              </div>
              <p className="font-serif text-xl text-stone-800 font-medium">{t('shop.empty.title')}</p>
              <p className="text-stone-400 text-xs">{t('shop.empty.desc')}</p>
              <button
                onClick={handleResetFilters}
                className="cursor-pointer bg-champagne-500 hover:bg-champagne-600 text-white uppercase text-xs tracking-widest px-6 py-3 font-semibold transition-colors mt-2"
              >
                {t('shop.empty.reset')}
              </button>
            </div>
          ) : (
            <motion.div 
              layout 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                  >
                    <ProductCard
                      product={product}
                      onViewDetails={(id) => onPageChange('product', { id })}
                      onAddToCartDirect={onAddToCartDirect}
                      wishlist={wishlist}
                      onToggleWishlist={onToggleWishlist}
                      currency={currency}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </main>

      </div>
    </div>
  );
}
