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
  currency
}: ShopProps) {
  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('All');
  const [selectedColor, setSelectedColor] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<string>('All');
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
    const seoData: Record<string, { title: string; desc: string }> = {
      all: {
        title: "مجوهرات راقية بالمغرب | ccjaouhara Fine Jewelry Maroc",
        desc: "اكتشفي تشكيلة مجوهرات ccjaouhara الراقية بالمغرب: أساور، أقراط، قلادات مطلية بالذهب. توصيل سريع والدفع عند الاستلام بجميع المدن المغربية."
      },
      bracelets: {
        title: "أساور نسائية راقية بالمغرب | Bracelets de Luxe boucle d'oreilles Maroc",
        desc: "أساور وسلاسل مطلية بالذهب عيار 18k وعيار 14k بتصاميم ساحرة. جودة مضمونة وتوصيل سريع والدفع عند الاستلام بالمغرب."
      },
      rings: {
        title: "خواتم نسائية فاخرة بالمغرب | Bagues de Luxe Maroc",
        desc: "اكتشفي تشكيلة الخواتم الراقية من ccjaouhara: خواتم سوليتير مرصعة بالزركون الفاخر والأحجار الكريمة مطلية بالذهب. توصيل لجميع ومناطق المغرب."
      },
      earrings: {
        title: "أقراط وأقراط نسائية فاخرة | Boucles d'oreilles de Luxe Maroc",
        desc: "أقراط ناعمة مرصعة يدويًا بأحجار الزركون اللامعة. توصيل لكافة مدن المغرب والدفع عند الاستلام."
      },
      anklets: {
        title: "خلاخل نسائية فاخرة المغرب | Les Chevillères de Luxe Maroc",
        desc: "خلاخل عصرية وكلاسيكية لإطلالة صيفية ناعمة مطلية بالذهب. الدفع عند الاستلام والتوصيل السريع بالمغرب."
      },
      necklaces: {
        title: "قلادات وسلاسل ذهبية راقية المغرب | Colliers dorés de Haute Bijouterie",
        desc: "قلادات وأطواق ذهبية رائعة مرصعة بأجود الكريستالات. صياغة يدوية فاخرة مع خدمة التوصيل المنزلي بالمغرب."
      },
      jewelry_sets: {
        title: "أطقم مجوهرات فاخرة للعروس بمراكش والرباط | Parures de Bijoux Maroc",
        desc: "أطقم متكاملة من أرقى التصاميم للمناسبات والأعراس. طلاء ذهبي متين لا يتغير لونه وتوصيل مضمون."
      }
    };

    const currentKey = selectedCategory.toLowerCase();
    const currentSeo = seoData[currentKey] || seoData.all;
    document.title = currentSeo.title;
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', currentSeo.desc);
  }, [selectedCategory]);

  // Derive unique materials and colors from existing database list
  const filterOptions = useMemo(() => {
    const categories = ['All', ...new Set(products.map(p => p.category))];
    const materials = ['All', ...new Set(products.map(p => p.material))];
    const colors = ['All', ...new Set(products.map(p => p.color))];
    return { categories, materials, colors };
  }, [products]);

  // Apply Filter Logic
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category Filter
    if (selectedCategory !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Material Filter
    if (selectedMaterial !== 'All') {
      list = list.filter(p => p.material.toLowerCase() === selectedMaterial.toLowerCase());
    }

    // Color Filter
    if (selectedColor !== 'All') {
      list = list.filter(p => p.color.toLowerCase() === selectedColor.toLowerCase());
    }

    // Price Filter Range Helper
    if (priceRange !== 'All') {
      if (priceRange === 'under-200') {
        list = list.filter(p => p.price < 200);
      } else if (priceRange === '200-350') {
        list = list.filter(p => p.price >= 200 && p.price <= 350);
      } else if (priceRange === 'over-350') {
        list = list.filter(p => p.price > 350);
      }
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
  }, [products, selectedCategory, selectedMaterial, selectedColor, priceRange, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedMaterial('All');
    setSelectedColor('All');
    setPriceRange('All');
    setSortBy('default');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Editorial Header */}
      <div className="text-center space-y-4 max-w-xl mx-auto py-6">
        <span className="text-xs tracking-[0.3em] font-medium uppercase text-champagne-500 font-sans block">
          ccjaouhara Collection
        </span>
        <h1 className="font-serif text-4xl text-stone-900 font-semibold tracking-wide capitalize">
          {categoryDisplayNames[selectedCategory.toLowerCase()] || selectedCategory}
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
          {categoryDescriptions[selectedCategory.toLowerCase()] || categoryDescriptions.all}
        </p>
      </div>

      {/* Showcase Banner for Necklaces */}
      {selectedCategory.toLowerCase() === 'necklaces' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full relative overflow-hidden rounded-xl border border-champagne-100/50 shadow-sm"
        >
          <div className="aspect-[21/9] sm:aspect-[24/10] md:aspect-[3/1] w-full">
            <img
              src="/images/necklaces_banner.png"
              alt="Bespoke Necklaces Collection"
              className="w-full h-full object-cover object-center transform hover:scale-[1.01] transition-transform duration-700"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/50 via-stone-900/10 to-transparent flex items-end">
            <div className="p-6 sm:p-10 text-white space-y-2">
              <span className="text-[10px] tracking-[0.25em] font-sans uppercase font-semibold text-amber-200">
                Exclusive Showcase
              </span>
              <h2 className="font-serif text-xl sm:text-3xl font-semibold tracking-wide text-white">
                The Art of Fine Necklaces
              </h2>
              <p className="text-stone-200 text-[10px] sm:text-xs max-w-lg leading-relaxed font-sans hidden sm:block">
                Precision-engineered heritage styles, handcrafted under rigorous covenants of fine jewelry design.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Filtering + Sorting Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-5 border border-champagne-100/50 rounded-lg">
        
        {/* Toggle Filters & Result Statistics */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="cursor-pointer flex items-center gap-2 hover:text-champagne-600 border border-stone-200 hover:border-champagne-300 px-4 py-2 text-xs uppercase tracking-widest text-stone-700 font-medium transition-colors"
          >
            <SlidersHorizontal size={14} />
            {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          
          <span className="text-xs text-stone-400 font-sans font-medium">
            Showing {filteredProducts.length} of {products.length} exquisite designs
          </span>
        </div>

        {/* Dynamic Sorting Selection */}
        <div className="flex items-center w-full md:w-auto justify-end gap-3 border-t md:border-t-0 border-stone-100 pt-3 md:pt-0">
          <label htmlFor="shop-sorting" className="text-stone-500 text-xs font-medium whitespace-nowrap flex items-center gap-1.5">
            <ArrowUpDown size={12} /> Sort By:
          </label>
          <select
            id="shop-sorting"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent border border-stone-200 text-xs text-stone-700 py-2 px-3 focus:outline-hidden focus:border-champagne-400 rounded-xs"
          >
            <option value="default">Default Catalog</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
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
                <Filter size={16} className="text-champagne-500" /> Filter Options
              </h3>
              <button
                onClick={handleResetFilters}
                className="cursor-pointer text-[10px] tracking-widest uppercase font-semibold text-stone-400 hover:text-champagne-500"
              >
                Reset All
              </button>
            </div>

            {/* Categories Sector */}
            <div className="space-y-3">
              <h4 className="text-xs tracking-wider uppercase text-stone-800 font-semibold">Collections</h4>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {filterOptions.categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`cursor-pointer text-xs text-left px-3 py-2 rounded-md transition-all duration-300 w-full ${
                      selectedCategory.toLowerCase() === cat.toLowerCase()
                        ? 'bg-amber-100/30 text-champagne-600 font-semibold border-l-2 border-champagne-500 pl-4 shadow-2xs'
                        : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900 border-l-2 border-transparent'
                    }`}
                  >
                    {categoryDisplayNames[cat.toLowerCase()] || cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter Options */}
            <div className="space-y-3">
              <h4 className="text-xs tracking-wider uppercase text-stone-800 font-semibold">Price Bracket</h4>
              <div className="space-y-2">
                {[
                  { label: 'All Jewelry Prices', value: 'All' },
                  { label: currency === 'MAD' ? 'Under 2,000 درهم' : 'Under $200', value: 'under-200' },
                  { label: currency === 'MAD' ? '2,000 درهم – 3,550 درهم' : '$200 – $350', value: '200-350' },
                  { label: currency === 'MAD' ? 'Above 3,550 درهم' : 'Above $350', value: 'over-350' },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center space-x-3 text-xs text-stone-600 hover:text-stone-900 cursor-pointer">
                    <input
                      type="radio"
                      name="price-bracket"
                      checked={priceRange === opt.value}
                      onChange={() => setPriceRange(opt.value)}
                      className="accent-champagne-500"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Materials Sector */}
            <div className="space-y-3">
              <h4 className="text-xs tracking-wider uppercase text-stone-800 font-semibold">Fine Metal / Material</h4>
              <div className="flex flex-wrap gap-2">
                {filterOptions.materials.map((mat) => (
                  <button
                    key={mat}
                    onClick={() => setSelectedMaterial(mat)}
                    className={`cursor-pointer px-3 py-1.5 rounded-full text-xs transition-all border ${
                      selectedMaterial === mat
                        ? 'bg-stone-900 border-stone-900 text-white font-medium'
                        : 'bg-white border-stone-200 text-stone-600 hover:border-stone-400'
                    }`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Swatch Filters */}
            <div className="space-y-3">
              <h4 className="text-xs tracking-wider uppercase text-stone-800 font-semibold">Color Shade</h4>
              <div className="flex flex-wrap gap-2">
                {filterOptions.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`cursor-pointer px-3 py-1.5 rounded-full text-xs transition-all border ${
                      selectedColor === color
                        ? 'bg-stone-900 border-stone-900 text-white font-medium'
                        : 'bg-white border-stone-200 text-stone-600 hover:border-stone-400'
                    }`}
                  >
                    {color}
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
              <p className="font-serif text-xl text-stone-800 font-medium">No bespoke jewelry matches your filter preferences.</p>
              <p className="text-stone-400 text-xs">Try selecting 'All' in your filtering parameters to reset catalog views.</p>
              <button
                onClick={handleResetFilters}
                className="cursor-pointer bg-champagne-500 hover:bg-champagne-600 text-white uppercase text-xs tracking-widest px-6 py-3 font-semibold transition-colors mt-2"
              >
                Reset All Filters
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
