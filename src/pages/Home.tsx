import { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowLeft,
  Compass, 
  Shield, 
  Gem, 
  Award, 
  Truck, 
  Lock, 
  Gift, 
  Star, 
  Sparkles,
  Check,
  Copy
} from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { useTranslation } from '../i18n';

interface HomeProps {
  products: Product[];
  isLoading: boolean;
  onPageChange: (pageName: string, params?: any) => void;
  onAddToCartDirect: (product: Product, size: string) => void;
  currency: 'USD' | 'MAD';
}

export default function Home({ products, isLoading, onPageChange, onAddToCartDirect, currency }: HomeProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const { t } = useTranslation();

  // Dynamic SEO Meta tags injection
  useEffect(() => {
    const prevTitle = document.title;
    document.title = t('home.seo.title');
    
    // Set meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    const prevDescription = metaDescription?.getAttribute('content') || '';
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', t('home.seo.desc'));

    // Set meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    const prevKeywords = metaKeywords?.getAttribute('content') || '';
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', t('home.seo.keywords'));

    return () => {
      document.title = prevTitle;
      if (metaDescription) {
        if (prevDescription) {
          metaDescription.setAttribute('content', prevDescription);
        } else {
          metaDescription.remove();
        }
      }
      if (metaKeywords) {
        if (prevKeywords) {
          metaKeywords.setAttribute('content', prevKeywords);
        } else {
          metaKeywords.remove();
        }
      }
    };
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(t('home.offer.code'));
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  // Safe slice of items
  const bestSellers = products.slice(0, 4);
  const newArrivals = products.slice(4, 8);

  const categories = [
    { name: t('home.categories.items')[0], image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=600', id: 'bracelets' },
    { name: t('home.categories.items')[1], image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600', id: 'rings' },
    { name: t('home.categories.items')[2], image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=600', id: 'earrings' },
    { name: t('home.categories.items')[3], image: 'https://images.unsplash.com/photo-1543294001-f7cbfe92237e?auto=format&fit=crop&q=80&w=600', id: 'anklets' },
    { name: t('home.categories.items')[4], image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=600', id: 'necklaces' },
    { name: t('home.categories.items')[5], image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600', id: 'jewelry_sets' },
  ];

  // Motion variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 35 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  return (
    <div className="space-y-24 bg-[#FAF7F2]/30 overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center bg-gradient-to-tr from-[#FFF9F5] via-[#FFFDFB] to-[#FFF3EB] overflow-hidden py-12 md:py-20 border-b border-champagne-150 relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-champagne-300/10 to-transparent -skew-x-12 transform origin-top-right hidden lg:block"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(197,160,89,0.1),transparent_60%)]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left/Text Column */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
              className="lg:col-span-6 space-y-6 text-center lg:text-right flex flex-col items-center lg:items-end justify-center" dir="rtl"
            >
              <motion.h1 
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}
                className="font-serif text-[42px] sm:text-5xl md:text-6xl lg:text-[70px] leading-[1.1] font-black text-stone-900 tracking-tight"
              >
                {t('home.hero.title')} <br />
                <span className="text-champagne-600 italic font-medium leading-normal">{t('home.hero.titleHighlight')}</span>
              </motion.h1>
              
              <motion.p 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}
                className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-xl font-medium font-sans"
              >
                {t('home.hero.desc')}
              </motion.p>
              
              <motion.div 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}
                className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto"
              >
                <button
                  onClick={() => onPageChange('shop')}
                  className="cursor-pointer w-full sm:w-auto bg-stone-900 text-white px-8 py-4 text-xs uppercase tracking-widest font-bold hover:bg-champagne-500 hover:-translate-y-0.5 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 rounded-xs font-sans"
                >
                  {t('home.hero.cta')}
                  <ArrowLeft size={14} />
                </button>
                <button
                  onClick={() => onPageChange('shop')}
                  className="cursor-pointer w-full sm:w-auto bg-transparent text-champagne-700 border-2 border-champagne-500/40 hover:border-champagne-500 px-8 py-3.5 text-xs uppercase tracking-widest font-bold hover:bg-champagne-500/5 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2 rounded-xs font-sans"
                >
                  {t('home.hero.secondaryCta')}
                </button>
              </motion.div>
            </motion.div>

            {/* Right/Image Column */}
            <div className="lg:col-span-6 relative flex items-center justify-center h-[350px] sm:h-[480px]">
              
              {/* Back elegant geometry outline */}
              <div className="absolute -inset-4 border border-champagne-300/20 rounded-2xl scale-95 md:scale-100 -rotate-3 transition-transform duration-700 pointer-events-none"></div>

              {/* Main Premium Illustration Image */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, rotate: 2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full max-w-lg border border-champagne-150 bg-white relative z-10 overflow-hidden shadow-2xl rounded-lg group/hero"
              >
                <img
                  src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800"
                  alt="High Luxury Fine Jewelry"
                  className="w-full h-full object-cover scale-100 transition-transform duration-700 ease-out group-hover/hero:scale-110"
                  loading="lazy"
                />
                
                {/* Embedded Floating Glassmorphism Badge */}
                <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md border border-white/40 p-4 rounded-md shadow-lg z-20 flex flex-col gap-1 items-start text-right max-w-[190px]" dir="rtl">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-champagne-600 block">{t('home.hero.badge')}</span>
                  <span className="font-serif text-sm font-bold text-stone-900 leading-tight">{t('home.hero.badgeDesc')}</span>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. TRUST BAR */}
      <section className="bg-white border-y border-champagne-105 py-8 md:py-10 shadow-3xs" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-[#FAF1E6]">
            
            {/* Trust item 1 */}
            <div className="flex items-center gap-4 justify-center py-2 lg:py-0">
              <span className="text-2xl sm:text-3xl filter drop-shadow-xs">🏆</span>
              <div className="text-right">
                <h4 className="font-sans font-bold text-stone-850 text-xs sm:text-sm">{t('home.trust')[0].title}</h4>
                <p className="text-[10px] sm:text-xs text-stone-400 font-medium">{t('home.trust')[0].desc}</p>
              </div>
            </div>

            {/* Trust item 2 */}
            <div className="flex items-center gap-4 justify-center py-2 lg:py-0 pt-4 lg:pt-0">
              <span className="text-2xl sm:text-3xl filter drop-shadow-xs">🚚</span>
              <div className="text-right">
                <h4 className="font-sans font-bold text-stone-850 text-xs sm:text-sm">{t('home.trust')[1].title}</h4>
                <p className="text-[10px] sm:text-xs text-stone-400 font-medium">{t('home.trust')[1].desc}</p>
              </div>
            </div>

            {/* Trust item 3 */}
            <div className="flex items-center gap-4 justify-center py-2 lg:py-0 pt-4 lg:pt-0">
              <span className="text-2xl sm:text-3xl filter drop-shadow-xs">🚪</span>
              <div className="text-right">
                <h4 className="font-sans font-bold text-stone-850 text-xs sm:text-sm">{t('home.trust')[2].title}</h4>
                <p className="text-[10px] sm:text-xs text-stone-400 font-medium">{t('home.trust')[2].desc}</p>
              </div>
            </div>

            {/* Trust item 4 */}
            <div className="flex items-center gap-4 justify-center py-2 lg:py-0 pt-4 lg:pt-0">
              <span className="text-2xl sm:text-3xl filter drop-shadow-xs">💎</span>
              <div className="text-right">
                <h4 className="font-sans font-bold text-stone-850 text-xs sm:text-sm">{t('home.trust')[3].title}</h4>
                <p className="text-[10px] sm:text-xs text-stone-400 font-medium">{t('home.trust')[3].desc}</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. SHOP BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <span className="text-xs tracking-widest font-bold uppercase text-champagne-500 block">
            {t('home.categories.label')}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-black">
            {t('home.categories.heading')}
          </h2>
          <div className="w-16 h-[2px] bg-champagne-500 mx-auto rounded-full"></div>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-3 gap-6"
        >
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              variants={fadeInUp}
              onClick={() => onPageChange('shop', { filterCategory: cat.id })}
              className="cursor-pointer group relative aspect-[4/5] bg-stone-100 overflow-hidden rounded-md border border-champagne-105 shadow-xs hover:shadow-xl hover:border-champagne-400 transition-all duration-500"
            >
              {/* Image with subtle zoom hover */}
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-700 ease-in-out"
                loading="lazy"
              />
              
              {/* Premium Golden Blending Overlays */}
              <div className="absolute inset-0 bg-stone-950/40 opacity-100 group-hover:bg-amber-950/20 group-hover:opacity-90 transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/10 to-transparent group-hover:from-amber-950/95 transition-all duration-500" />
              
              {/* Category Typography & Interactive Discover CTA */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 z-10 text-right" dir="rtl">
                <span className="text-[10px] tracking-wider text-champagne-300 font-bold mb-1 opacity-90">
                  {t('home.categories.overlay')}
                </span>
                <h3 className="font-sans text-lg sm:text-xl md:text-2xl text-white tracking-wide font-extrabold mb-2">
                  {cat.name}
                </h3>
                
                <div className="pt-2 border-t border-white/10 flex items-center justify-between opacity-80 group-hover:opacity-100 transition-opacity">
                  <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-white group-hover:bg-champagne-500 group-hover:text-white group-hover:-translate-x-1 transition-all duration-300">
                    <ArrowLeft size={11} />
                  </div>
                  <span className="text-[10px] tracking-wider text-champagne-100 font-bold">
                    {t('home.categories.cta')}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 4. BEST SELLERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 border-b border-champagne-105 pb-5" dir="rtl">
          <div className="space-y-1 text-center md:text-right mb-4 md:mb-0">
            <span className="text-xs tracking-widest uppercase font-bold text-champagne-500 block">
              {t('home.bestsellers.label')}
            </span>
            <h2 className="font-serif text-3xl text-stone-900 font-black relative inline-block">
              {t('home.bestsellers.heading')}
              <span className="absolute bottom-0 right-0 left-0 h-[3px] bg-gradient-to-r from-champagne-400 to-transparent rounded-full translate-y-2"></span>
            </h2>
          </div>
          <button
            onClick={() => onPageChange('shop')}
            className="cursor-pointer text-xs uppercase tracking-widest text-champagne-600 hover:text-champagne-700 font-bold flex items-center gap-1.5 group transition-colors"
          >
            {t('home.bestsellers.cta')}
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Dynamic product lists loading state */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="space-y-4 animate-pulse">
                <div className="bg-stone-200 aspect-[4/5] w-full rounded-md"></div>
                <div className="h-4 bg-stone-200 w-1/3 mx-auto"></div>
                <div className="h-6 bg-stone-200 w-3/4 mx-auto"></div>
                <div className="h-4 bg-stone-200 w-1/4 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={(id) => onPageChange('product', { id })}
                onAddToCartDirect={onAddToCartDirect}
                currency={currency}
              />
            ))}
          </div>
        )}
      </section>

      {/* 5. LUXURY PROMOTIONAL BANNER */}
      <section className="bg-stone-900 text-white relative py-20 px-4 md:px-8 overflow-hidden border-y border-champagne-400/25">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(197,160,89,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-stone-950/20"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-12 h-12 rounded-full border border-champagne-400/30 flex items-center justify-center text-champagne-400 mb-2"
          >
            <Sparkles size={18} />
          </motion.div>
          
          <h3 className="font-serif text-xl sm:text-2xl md:text-3.5xl font-black text-champagne-300 leading-relaxed italic px-4">
            {t('home.promo.quote')}
          </h3>
          
          <p className="text-stone-400 text-xs sm:text-sm font-sans max-w-lg leading-relaxed">
            {t('home.promo.desc')}
          </p>

          <button
            onClick={() => onPageChange('shop')}
            className="cursor-pointer bg-champagne-500 text-stone-905 font-bold hover:bg-champagne-400 text-xs uppercase tracking-widest px-8 py-3.5 shadow-md hover:shadow-xl transition-all duration-300 rounded-xs font-sans active:scale-95"
          >
            {t('home.promo.cta')}
          </button>
        </div>
      </section>

      {/* 6. NEW ARRIVALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <span className="text-xs tracking-widest font-bold uppercase text-champagne-500 block">
            {t('home.arrivals.label')}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-extrabold flex items-center justify-center gap-2">
            {t('home.arrivals.heading')}
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
            {t('home.arrivals.desc')}
          </p>
          <div className="w-16 h-[2px] bg-champagne-500 mx-auto rounded-full"></div>
        </div>

        {/* Dynamic product lists loading state */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="space-y-4 animate-pulse">
                <div className="bg-stone-200 aspect-[4/5] w-full rounded-md"></div>
                <div className="h-4 bg-stone-200 w-1/3 mx-auto"></div>
                <div className="h-6 bg-stone-200 w-3/4 mx-auto"></div>
                <div className="h-4 bg-stone-200 w-1/4 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={(id) => onPageChange('product', { id })}
                onAddToCartDirect={onAddToCartDirect}
                currency={currency}
              />
            ))}
          </div>
        )}
      </section>

      {/* 7. WHY CHOOSE US */}
      <section className="bg-white border-y border-champagne-100 py-16 md:py-20" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs tracking-widest font-bold uppercase text-champagne-500 block">
              ما يميزنا
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-extrabold">لماذا ccjaouhara؟</h2>
            <div className="w-16 h-[2px] bg-champagne-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Value card 1 */}
            <div className="bg-[#FFFDFB] border border-champagne-105 p-6 hover:border-champagne-300 hover:shadow-lg rounded-md transition-all duration-300 flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 bg-champagne-500/10 border border-champagne-200 rounded-full flex items-center justify-center text-champagne-600 shadow-sm">
                <Gem size={20} />
              </div>
              <h3 className="font-sans font-bold text-stone-850 text-base">{t('home.whyUs.items')[0].title}</h3>
              <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
                {t('home.whyUs.items')[0].desc}
              </p>
            </div>

            {/* Value card 2 */}
            <div className="bg-[#FFFDFB] border border-champagne-105 p-6 hover:border-champagne-300 hover:shadow-lg rounded-md transition-all duration-300 flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 bg-champagne-500/10 border border-champagne-200 rounded-full flex items-center justify-center text-champagne-600 shadow-sm">
                <Shield size={20} />
              </div>
              <h3 className="font-sans font-bold text-stone-850 text-base">{t('home.whyUs.items')[1].title}</h3>
              <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
                {t('home.whyUs.items')[1].desc}
              </p>
            </div>

            {/* Value card 3 */}
            <div className="bg-[#FFFDFB] border border-champagne-105 p-6 hover:border-champagne-300 hover:shadow-lg rounded-md transition-all duration-300 flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 bg-champagne-500/10 border border-champagne-200 rounded-full flex items-center justify-center text-champagne-600 shadow-sm">
                <Truck size={20} />
              </div>
              <h3 className="font-sans font-bold text-stone-850 text-base">{t('home.whyUs.items')[2].title}</h3>
              <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
                {t('home.whyUs.items')[2].desc}
              </p>
            </div>

            {/* Value card 4 */}
            <div className="bg-[#FFFDFB] border border-champagne-105 p-6 hover:border-champagne-300 hover:shadow-lg rounded-md transition-all duration-300 flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 bg-champagne-500/10 border border-champagne-200 rounded-full flex items-center justify-center text-champagne-600 shadow-sm">
                <Lock size={20} />
              </div>
              <h3 className="font-sans font-bold text-stone-850 text-base">{t('home.whyUs.items')[3].title}</h3>
              <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
                {t('home.whyUs.items')[3].desc}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 8. SPECIAL OFFER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-champagne-100/30 to-[#FFEFE5] border border-champagne-200 rounded-2xl p-8 md:p-12 shadow-sm relative overflow-hidden" dir="rtl">
          <div className="absolute top-0 left-0 w-24 h-24 bg-champagne-300/10 rounded-full -translate-x-6 -translate-y-6"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            <div className="md:col-span-8 space-y-4 text-center md:text-right">
              <h3 className="font-serif text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {t('home.offer.heading')}
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm max-w-xl leading-relaxed">
                {t('home.offer.desc')}
              </p>
              
              {/* Copy Coupon Box */}
              <div className="flex flex-wrap gap-3 items-center justify-center md:justify-start pt-2">
                <div className="border-2 border-dashed border-champagne-500 bg-white px-5 py-2.5 rounded-md font-mono text-base font-bold tracking-widest text-champagne-750 inline-flex items-center gap-3">
                  {t('home.offer.code')}
                </div>
                <button
                  onClick={handleCopyCode}
                  className="cursor-pointer bg-stone-900 text-white px-5 py-3 rounded-md text-xs font-bold hover:bg-stone-800 transition-colors flex items-center gap-1.5 font-sans"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-emerald-400" />
                      {t('home.offer.copied')}
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      {t('home.offer.copyBtn')}
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="md:col-span-4 flex justify-center md:justify-end">
              <button
                onClick={() => onPageChange('shop')}
                className="cursor-pointer bg-champagne-600 text-white font-bold hover:bg-champagne-750 text-xs uppercase tracking-widest px-8 py-4.5 shadow-md hover:shadow-xl transition-all duration-300 rounded-sm font-sans active:scale-95"
              >
                {t('home.offer.cta')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CUSTOMER REVIEWS */}
      <section className="bg-[#FAF7F2]/50 border-y border-champagne-100 py-16 md:py-20" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs tracking-widest font-bold uppercase text-champagne-500 block">
              {t('home.reviews.label')}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-extrabold">{t('home.reviews.heading')}</h2>
            <div className="w-16 h-[2px] bg-champagne-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Review 1 */}
            <div className="bg-white border border-champagne-105 p-6 rounded-lg shadow-2xs hover:shadow-md transition-all duration-300 space-y-4 flex flex-col justify-between text-right">
              <div className="space-y-3">
                <div className="flex gap-1 justify-start">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed font-medium">
                  {t('home.reviews.items')[0].text}
                </p>
              </div>
              <div className="border-t border-stone-50 pt-3 mt-4 text-xs">
                <span className="font-bold text-stone-850">{t('home.reviews.items')[0].name}</span>
                <span className="text-stone-400 inline-block mr-1">، {t('home.reviews.items')[0].location}</span>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-white border border-champagne-105 p-6 rounded-lg shadow-2xs hover:shadow-md transition-all duration-300 space-y-4 flex flex-col justify-between text-right">
              <div className="space-y-3">
                <div className="flex gap-1 justify-start">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed font-medium">
                  {t('home.reviews.items')[1].text}
                </p>
              </div>
              <div className="border-t border-stone-50 pt-3 mt-4 text-xs">
                <span className="font-bold text-stone-850">{t('home.reviews.items')[1].name}</span>
                <span className="text-stone-400 inline-block mr-1">، {t('home.reviews.items')[1].location}</span>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-white border border-champagne-105 p-6 rounded-lg shadow-2xs hover:shadow-md transition-all duration-300 space-y-4 flex flex-col justify-between text-right">
              <div className="space-y-3">
                <div className="flex gap-1 justify-start">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed font-medium">
                  {t('home.reviews.items')[2].text}
                </p>
              </div>
              <div className="border-t border-stone-50 pt-3 mt-4 text-xs">
                <span className="font-bold text-stone-850">{t('home.reviews.items')[2].name}</span>
                <span className="text-stone-400 inline-block mr-1">، {t('home.reviews.items')[2].location}</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 10. GIFT SECTION */}
      <section className="bg-gradient-to-tr from-[#FFF7F3] via-white to-[#FFFAF7] border-y border-champagne-105 py-20 px-4" dir="rtl">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="w-14 h-14 bg-champagne-500/10 border border-champagne-200 rounded-full flex items-center justify-center text-champagne-600 shadow-sm mx-auto mb-2">
            <Gift size={24} />
          </div>
          
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900 leading-tight">
            {t('home.gift.heading')}
          </h2>
          
          <p className="text-stone-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            {t('home.gift.desc')}
          </p>

          <div className="pt-4">
            <button
              onClick={() => onPageChange('shop', { filterCategory: 'jewelry_sets' })}
              className="cursor-pointer bg-stone-900 text-white font-bold hover:bg-champagne-600 text-xs uppercase tracking-widest px-8 py-4 shadow-md hover:shadow-xl transition-all duration-300 rounded-xs font-sans active:scale-95 flex items-center justify-center gap-2 mx-auto"
            >
              {t('home.gift.cta')}
              <ArrowLeft size={14} />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
