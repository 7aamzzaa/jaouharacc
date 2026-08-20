import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { Minus, Plus, ShoppingBag, ShieldCheck, Heart, Scale, RefreshCw, ArrowLeft, ArrowRight, ExternalLink, Truck, CreditCard, Lock, CheckCircle } from 'lucide-react';
import { Product, Review } from '../types';
import ProductRating from '../components/ProductRating';
import ProductCard from '../components/ProductCard';
import { useTranslation } from '../i18n';
import { useCurrency } from '../CurrencyContext';

const FAQAccordion = lazy(() => import('../components/FAQAccordion'));
const ShareModal = lazy(() => import('../components/ShareModal'));
const TrustBadges = lazy(() => import('../components/TrustBadges'));
const ReviewSummary = lazy(() => import('../components/reviews/ReviewSummary'));
const ReviewList = lazy(() => import('../components/reviews/ReviewList'));
const ReviewForm = lazy(() => import('../components/reviews/ReviewForm'));

interface ProductDetailProps {
  productParam: string;
  allProducts: Product[];
  onAddToCart: (product: Product, quantity: number, size: string) => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onPageChange: (pageName: string, params?: any) => void;
}

export default function ProductDetail({ productParam, allProducts, onAddToCart, wishlist, onToggleWishlist, onPageChange }: ProductDetailProps) {
  const { formatPrice } = useCurrency();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>('Medium (7.0")');
  const [quantity, setQuantity] = useState<number>(1);
  const RECENTLY_VIEWED_KEY = 'ccjaouhara_recently_viewed';
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const isFavorite = wishlist.includes(product?.id || '');
  const [addedMessage, setAddedMessage] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [translationsData, setTranslationsData] = useState<Record<string, any> | null>(null);
  const { t, lang, dir } = useTranslation();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const fetchReviews = useCallback(async () => {
    if (!product) return;
    setLoadingReviews(true);
    try {
      const response = await fetch(`/api/reviews?product_id=${product.id}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch {
      // silently fail
    } finally {
      setLoadingReviews(false);
    }
  }, [product?.id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }, [reviews]);

  const totalReviews = reviews.length;

  useEffect(() => {
    import('../i18n/productTranslations').then(mod => {
      setTranslationsData(mod.productTranslations);
    });
  }, []);

  // Load product: try slug first, then fall back to ID for backward compatibility
  useEffect(() => {
    const found = allProducts.find(p => p.slug && p.slug === productParam)
      || allProducts.find(p => p.id === productParam);
    if (found) {
      setProduct(found);
      setActiveImageIndex(0);
      setQuantity(1);
    }
    // Scroll to top on load
    window.scrollTo(0, 0);
  }, [productParam, allProducts]);

  // Dynamic SEO Meta tags injection
  useEffect(() => {
    if (!product) return;

    const prevTitle = document.title;
    const title = product.seoTitle || `${product.name} | CCJAOUHARA`;
    document.title = title;

    const metaDesc = product.metaDescription || product.description?.slice(0, 160) || '';
    const url = typeof window !== 'undefined' ? window.location.origin + '/product/' + (product.slug || product.id) : '';

    // meta description
    let elDescription = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const prevDescription = elDescription?.getAttribute('content') || '';
    if (!elDescription) {
      elDescription = document.createElement('meta');
      elDescription.setAttribute('name', 'description');
      document.head.appendChild(elDescription);
    }
    elDescription.setAttribute('content', metaDesc);

    // canonical link
    let elCanonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const prevCanonical = elCanonical?.getAttribute('href') || '';
    if (!elCanonical) {
      elCanonical = document.createElement('link');
      elCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(elCanonical);
    }
    elCanonical.setAttribute('href', url);

    // Open Graph tags
    const ogTags: [string, string][] = [
      ['og:title', title],
      ['og:description', metaDesc],
      ['og:image', product.images?.[0] || ''],
      ['og:url', url],
      ['og:type', 'product'],
    ];
    const prevOg: [HTMLMetaElement, string][] = [];
    for (const [property, content] of ogTags) {
      let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
      const prev = el?.getAttribute('content') || '';
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
      prevOg.push([el, prev]);
    }

    // Twitter Card tags
    const twitterTags: [string, string][] = [
      ['twitter:card', 'summary_large_image'],
      ['twitter:title', title],
      ['twitter:description', metaDesc],
      ['twitter:image', product.images?.[0] || ''],
    ];
    const prevTwitter: [HTMLMetaElement, string][] = [];
    for (const [name, content] of twitterTags) {
      let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      const prev = el?.getAttribute('content') || '';
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
      prevTwitter.push([el, prev]);
    }

    return () => {
      document.title = prevTitle;

      if (elDescription) {
        if (prevDescription) {
          elDescription.setAttribute('content', prevDescription);
        } else {
          elDescription.remove();
        }
      }
      if (elCanonical) {
        if (prevCanonical) {
          elCanonical.setAttribute('href', prevCanonical);
        } else {
          elCanonical.remove();
        }
      }
      for (const [el, prev] of prevOg) {
        if (prev) {
          el.setAttribute('content', prev);
        } else {
          el.remove();
        }
      }
      for (const [el, prev] of prevTwitter) {
        if (prev) {
          el.setAttribute('content', prev);
        } else {
          el.remove();
        }
      }
    };
  }, [product]);

  // Save current product to recently viewed
  useEffect(() => {
    if (!product) return;
    setRecentlyViewedIds(prev => {
      const filtered = prev.filter(i => i !== product.id);
      const updated = [...filtered, product.id];
      const trimmed = updated.slice(-8);
      try {
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(trimmed));
      } catch {}
      return trimmed;
    });
  }, [product?.id]);

  // Complete The Look: complementary categories, up to 3 products across distinct categories
  const completeTheLook = useMemo(() => {
    if (!product) return [];
    const complements: Record<string, string[]> = {
      bracelets: ['necklaces', 'rings', 'earrings'],
      necklaces: ['bracelets', 'earrings', 'rings'],
      rings: ['bracelets', 'necklaces', 'earrings'],
      earrings: ['necklaces', 'bracelets', 'rings'],
      anklets: ['bracelets', 'necklaces', 'earrings'],
      jewelry_sets: ['necklaces', 'rings', 'earrings'],
    };
    const fallback = ['necklaces', 'rings', 'bracelets', 'earrings', 'anklets'];
    const order = complements[product.category] || fallback;
    const picked: Product[] = [];
    const usedCategories = new Set<string>([product.category]);
    for (const cat of order) {
      if (picked.length >= 3) break;
      const candidate = allProducts.find(p => p.category === cat && p.id !== product.id);
      if (candidate) {
        picked.push(candidate);
        usedCategories.add(cat);
      }
    }
    if (picked.length < 3) {
      for (const p of allProducts) {
        if (picked.length >= 3) break;
        if (p.id === product.id) continue;
        if (usedCategories.has(p.category)) continue;
        if (picked.includes(p)) continue;
        picked.push(p);
        usedCategories.add(p.category);
      }
    }
    if (picked.length < 3) {
      for (const p of allProducts) {
        if (picked.length >= 3) break;
        if (p.id === product.id || picked.includes(p)) continue;
        picked.push(p);
      }
    }
    return picked.slice(0, 3);
  }, [product, allProducts]);

  // Recommendations: Other products in same category, up to 4, randomized
  const recommendations = useMemo(() => {
    if (!product) return [];
    const related = allProducts.filter(p => p.category === product.category && p.id !== product.id);
    const shuffled = [...related];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 4);
  }, [productParam, allProducts, product]);

  // Recently viewed products from localStorage
  const recentlyViewedProducts = useMemo(() => {
    if (!product) return [];
    return recentlyViewedIds
      .filter(id => id !== product.id)
      .map(id => allProducts.find(p => p.id === id))
      .filter((p): p is Product => p !== undefined)
      .reverse()
      .slice(0, 4);
  }, [recentlyViewedIds, allProducts, product?.id]);

  const handleQuickAdd = useCallback((p: Product, size: string) => {
    onAddToCart(p, 1, size);
  }, [onAddToCart]);

  const handleViewRelated = useCallback((id: string) => {
    const related = allProducts.find(p => p.id === id);
    onPageChange('product', { slug: related?.slug, id });
  }, [onPageChange, allProducts]);

  const productSchema = useMemo(() => {
    if (!product) return null;
    const desc = product.metaDescription || product.description || '';
    const availability = (product.stock ?? 0) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: desc,
      image: product.images?.[0] || '',
      brand: { '@type': 'Brand', name: 'CCJaouhara' },
      category: product.category,
      sku: product.id,
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'MAD',
        availability,
      },
    };
  }, [product]);

  if (!product) {
    return (
      <div className="text-center py-24 space-y-4">
        <RefreshCw size={36} className="animate-spin text-champagne-500 mx-auto" />
        <p className="font-serif text-lg text-stone-700">{t('productDetail.loading')}</p>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;
  const productTranslation = translationsData?.[product.id]?.[lang];
  const translatedDescription = productTranslation?.description || product.description;

  // Sizes array details
  const sizeOptions = [
    { label: t('productDetail.sizes.small'), desc: t('productDetail.sizes.smallDesc') },
    { label: t('productDetail.sizes.medium'), desc: t('productDetail.sizes.mediumDesc') },
    { label: t('productDetail.sizes.large'), desc: t('productDetail.sizes.largeDesc') },
  ];

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
        {dir === 'ltr' ? <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> : <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
        {t('productDetail.back')}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Aspect: Image Gallery Frame */}
        <div className="lg:col-span-7 lg:space-y-4 max-lg:contents">
          
          {/* Mobile Gallery (below 640px) — swipeable snap thumbnail strip */}
          <div className="sm:hidden space-y-3 max-lg:order-1">
            <div className="zoom-frame aspect-square bg-stone-50 border border-champagne-100 rounded-lg overflow-hidden relative">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.imageAltText || product.name}
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

            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-1">
                {product.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`cursor-pointer shrink-0 w-20 aspect-square bg-stone-50 border rounded-xs overflow-hidden transition-all snap-center ${
                      activeImageIndex === idx
                        ? 'border-champagne-500 ring-1 ring-champagne-500'
                        : 'border-stone-200'
                    }`}
                  >
                    <img src={imgUrl} loading="lazy" alt={product.imageAltText ? `${product.imageAltText} view ${idx + 1}` : `${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop / Tablet Gallery (>=640px) — unchanged */}
          <div className="hidden sm:block space-y-4 max-lg:order-1">
            <div className="zoom-frame aspect-square bg-stone-50 border border-champagne-100 rounded-lg overflow-hidden relative">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.imageAltText || product.name}
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
                    <img src={imgUrl} loading="lazy" alt={product.imageAltText ? `${product.imageAltText} view ${idx + 1}` : `${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Complete The Look */}
          <div className="border-t border-champagne-100 pt-6 space-y-4 max-lg:order-7">
            <h3 className="text-xs tracking-widest uppercase text-stone-800 font-semibold">
              {t('productDetail.sections.style.heading')}
            </h3>
            <p className="text-xs text-stone-500 font-sans">
              {t('productDetail.sections.style.subtitle')}
            </p>
            {completeTheLook.length > 0 && (
              <div className="rounded-lg border border-stone-200 bg-white p-6 space-y-5">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {completeTheLook.map((rec) => (
                    <button
                      key={rec.id}
                      type="button"
                      onClick={() => handleViewRelated(rec.id)}
                      className="cursor-pointer text-left group bg-white border border-stone-100 rounded-sm overflow-hidden transition-colors hover:border-champagne-300 focus:outline-hidden focus-visible:outline-2 focus-visible:outline-champagne-500 flex flex-col"
                      aria-label={t('productDetail.viewLookItem', { name: rec.name })}
                    >
                      <div className="aspect-square bg-[#FFF9F8] overflow-hidden">
                        <img
                          src={rec.images[0]}
                          alt={rec.imageAltText || rec.name}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {rec.stock === 0 && (
                          <span className="text-[9px] bg-stone-900 text-white tracking-widest uppercase font-semibold px-2 py-0.5">
                            {t('productDetail.soldOut')}
                          </span>
                        )}
                      </div>
                      <div className="p-3 space-y-1.5 flex flex-col flex-1">
                        <span className="text-[9px] tracking-widest uppercase font-medium text-champagne-500">
                          {t(`common.categories.${rec.category}.name`)}
                        </span>
                        <p className="font-serif text-sm text-stone-800 font-semibold line-clamp-1 group-hover:text-champagne-500 transition-colors">
                          {rec.name}
                        </p>
                        <div className="mt-auto pt-1">
                          <ProductRating rating={rec.rating} reviewsCount={rec.reviews} compact />
                        </div>
                        <p className="font-serif text-stone-950 font-extrabold text-sm">
                          {formatPrice(rec.price)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => onPageChange('shop')}
                    className="cursor-pointer flex items-center justify-center text-center w-full sm:w-auto px-5 py-3.5 text-xs uppercase tracking-widest font-semibold text-champagne-700 hover:text-champagne-600 bg-champagne-50 hover:bg-champagne-100 border border-champagne-100 rounded-sm transition-colors focus:outline-hidden focus-visible:outline-2 focus-visible:outline-champagne-500"
                  >
                    {t('productDetail.sections.style.button')}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Recently Purchased */}
          <div className="border-t border-champagne-100 pt-6 space-y-4 max-lg:order-11">
            <h3 className="text-xs tracking-widest uppercase text-stone-800 font-semibold">
              {t('productDetail.sections.recently.heading')}
            </h3>
            <p className="text-xs text-stone-500 font-sans">
              {t('productDetail.sections.recently.subtitle')}
            </p>
            <div className="rounded-lg border border-stone-200 bg-[#FAF7F2]/40 p-6 space-y-4">
              <div className="rounded-md bg-white border border-stone-100 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-champagne-100 flex items-center justify-center shrink-0">
                      <span className="text-sm font-semibold text-champagne-700">{t('productDetail.sections.recently.saraInitial')}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-stone-800">{t('productDetail.sections.recently.sara')}</p>
                      <p className="text-xs text-stone-500">{t('productDetail.sections.recently.purchasedItem')}</p>
                    </div>
                  </div>
                  <span className="text-xs text-stone-400 shrink-0">{t('productDetail.sections.recently.hoursAgo', { count: 2 })}</span>
                </div>
              </div>
              <div className="rounded-md bg-white border border-stone-100 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-champagne-100 flex items-center justify-center shrink-0">
                      <span className="text-sm font-semibold text-champagne-700">{t('productDetail.sections.recently.aminaInitial')}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-stone-800 truncate">{t('productDetail.sections.recently.amina')}</p>
                      <p className="text-xs text-stone-500">{t('productDetail.sections.recently.purchasedItem')}</p>
                    </div>
                  </div>
                  <span className="text-xs text-stone-400 shrink-0">{t('productDetail.sections.recently.today')}</span>
                </div>
              </div>
              <div className="rounded-md bg-white border border-stone-100 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-champagne-100 flex items-center justify-center shrink-0">
                      <span className="text-sm font-semibold text-champagne-700">{t('productDetail.sections.recently.khadijaInitial')}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-stone-800 truncate">{t('productDetail.sections.recently.khadija')}</p>
                      <p className="text-xs text-stone-500">{t('productDetail.sections.recently.purchasedItem')}</p>
                    </div>
                  </div>
                  <span className="text-xs text-stone-400 shrink-0">{t('productDetail.sections.recently.yesterday')}</span>
                </div>
              </div>
              <div className="rounded-md bg-white border border-stone-100 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-champagne-100 flex items-center justify-center shrink-0">
                      <span className="text-sm font-semibold text-champagne-700">{t('productDetail.sections.recently.nadiaInitial')}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-stone-800 truncate">{t('productDetail.sections.recently.nadia')}</p>
                      <p className="text-xs text-stone-500">{t('productDetail.sections.recently.purchasedItem')}</p>
                    </div>
                  </div>
                  <span className="text-xs text-stone-400 shrink-0">{t('productDetail.sections.recently.daysAgo', { count: 3 })}</span>
                </div>
              </div>
              <p className="text-xs text-stone-500 text-center leading-relaxed pt-2">
                {t('productDetail.sections.recently.note')}
              </p>
            </div>
          </div>

        </div>

        {/* Right Aspect: Purchasing Controls Portal */}
        <div className="lg:col-span-5 lg:space-y-8 max-lg:contents">
          
          {/* Mobile Header Info (below 640px) — reordered: category, rating, name, price, green In Stock */}
          <div className="sm:hidden pb-6 border-b border-champagne-100 flex flex-col gap-3 max-lg:order-2">
            <span className="text-xs tracking-[0.25em] uppercase text-champagne-600 font-semibold font-sans">
              {product.category}
            </span>
            <div>
              <ProductRating rating={product.rating} reviewsCount={product.reviews} size={14} />
            </div>
            <h1 className="font-serif text-3xl text-stone-950 font-medium leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center justify-between pt-0.5">
                <p className="font-serif text-2xl text-stone-900 font-medium font-bold">
                {formatPrice(product.price)}
              </p>
              <button
                onClick={() => setShowShareModal(true)}
                className="cursor-pointer flex items-center gap-1 text-xs tracking-wider text-stone-500 hover:text-champagne-600 transition-colors font-medium"
              >
                <ExternalLink size={12} />
                {t('productDetail.shareButton')}
              </button>
            </div>
            <div className="pt-0.5">
              {isOutOfStock ? (
                <span className="inline-flex items-center text-[10px] uppercase font-mono tracking-wider font-semibold text-stone-500 bg-stone-100 px-2 py-1 rounded-sm">
                  {t('productDetail.soldOut')}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {t('productDetail.inStock', { count: product.stock })}
                </span>
              )}
            </div>
          </div>

          {/* Desktop / Tablet Header Info (>=640px) — unchanged */}
          <div className="hidden sm:block space-y-3 pb-6 border-b border-champagne-100 max-lg:order-2">
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
            
            <div className="mt-2">
              <ProductRating rating={product.rating} reviewsCount={product.reviews} size={14} />
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <p className="font-serif text-2xl text-stone-900 font-medium font-bold">
                {formatPrice(product.price)}
              </p>
              <button
                onClick={() => setShowShareModal(true)}
                className="cursor-pointer flex items-center gap-1 text-xs tracking-wider text-stone-500 hover:text-champagne-600 transition-colors font-medium"
              >
                <ExternalLink size={12} />
                {t('productDetail.shareButton')}
              </button>
            </div>
          </div>

          {/* Curated Description */}
          <div className="space-y-2 max-lg:order-3">
            <h3 className="text-xs tracking-widest uppercase text-stone-800 font-semibold">{t('productDetail.artisanStory')}</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-sans font-normal">
              {translatedDescription}
            </p>
          </div>

          {/* Mobile Purchase Section (below 640px) */}
          <div className="sm:hidden space-y-5 max-lg:order-4">
            {/* Choose Size */}
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

            {/* Quantity + Wishlist */}
            <div className="flex items-center justify-between gap-4">
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
              <button
                onClick={() => onToggleWishlist(product.id)}
                className={`cursor-pointer p-3 border rounded-sm transition-all focus:outline-hidden ${
                  isFavorite ? 'border-champagne-500 text-champagne-500 bg-champagne-50' : 'border-stone-200 hover:border-stone-400 text-stone-400'
                }`}
                title={t('productDetail.addToWishlist')}
                aria-label={t('productDetail.addToWishlist')}
              >
                <Heart size={16} className={isFavorite ? 'fill-champagne-500' : ''} />
              </button>
            </div>

            {/* Primary Add to Cart — full width */}
            <button
              onClick={handleAddToBag}
              disabled={isOutOfStock}
              className={`cursor-pointer w-full min-h-[56px] px-6 tracking-widest text-xs uppercase font-medium shadow-md transition-all duration-300 flex items-center justify-center gap-2 focus:outline-hidden active:scale-[0.99] ${
                isOutOfStock
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-stone-900 hover:bg-champagne-600 text-white'
              }`}
            >
              <ShoppingBag size={16} />
              {isOutOfStock ? t('productDetail.soldOut') : t('productDetail.addToCart')}
            </button>

            {addedMessage && (
              <div className="text-center bg-emerald-50 text-emerald-800 text-xs py-2 rounded-sm border border-emerald-100 font-sans tracking-wide">
                {t('productDetail.added')}
              </div>
            )}

            {/* Trust list */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-2.5">
                <Truck size={15} className="text-champagne-500 shrink-0" />
                <span className="text-xs text-stone-600 font-sans font-medium">{t('trust.delivery')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CreditCard size={15} className="text-champagne-500 shrink-0" />
                <span className="text-xs text-stone-600 font-sans font-medium">{t('cart.cashOnDelivery')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Lock size={15} className="text-champagne-500 shrink-0" />
                <span className="text-xs text-stone-600 font-sans font-medium">{t('trust.checkout')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={15} className="text-champagne-500 shrink-0" />
                <span className="text-xs text-stone-600 font-sans font-medium">{t('trust.quality')}</span>
              </div>
            </div>
          </div>

          {/* Size Form Selector (Desktop / Tablet) */}
          <div className="hidden sm:block space-y-3 max-lg:order-4">
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

          {/* Quantity Controls and Add to Cart Button Block (Desktop / Tablet) */}
          <div className="hidden sm:block space-y-4 pt-4 max-lg:order-4">
            
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
                onClick={() => onToggleWishlist(product.id)}
                className={`cursor-pointer p-4 border rounded-sm transition-all focus:outline-hidden ${
                  isFavorite ? 'border-champagne-500 text-champagne-500 bg-champagne-50' : 'border-stone-200 hover:border-stone-400 text-stone-400'
                }`}
                title={t('productDetail.addToWishlist')}
              >
                <Heart size={16} className={isFavorite ? 'fill-champagne-500' : ''} />
              </button>

            </div>

            {/* Micro Add Alert */}
            {addedMessage && (
              <div className="text-center bg-emerald-50 text-emerald-800 text-xs py-2 rounded-sm border border-emerald-100 font-sans tracking-wide">
                {t('productDetail.added')}
              </div>
            )}

          </div>

          {/* Trust Badges (Desktop / Tablet) */}
          <div className="hidden sm:block max-lg:order-5">
            <Suspense fallback={<div className="border border-stone-200 rounded-lg p-4 h-[168px] animate-pulse bg-stone-50" />}>
              <TrustBadges />
            </Suspense>
          </div>

          {/* Technical Spec List */}
          <div className="border-t border-champagne-100 pt-6 space-y-4 max-lg:order-6">
            <h3 className="text-xs tracking-widest uppercase text-stone-800 font-semibold">{t('productDetail.specs')}</h3>
            <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-xs font-sans">
              <div className="flex justify-between border-b border-stone-50 pb-1.5">
                <span className="text-stone-400">{t('productDetail.material')}</span>
                <span className="text-stone-700 font-medium">{t('productDetail.materialValue')}</span>
              </div>
              <div className="flex justify-between border-b border-stone-50 pb-1.5">
                <span className="text-stone-400">{t('productDetail.finish')}</span>
                <span className="text-stone-700 font-medium">{t('productDetail.finishValue')}</span>
              </div>
              <div className="flex justify-between border-b border-stone-50 pb-1.5">
                <span className="text-stone-400">{t('productDetail.collection')}</span>
                <span className="text-stone-700 font-medium">{t('productDetail.collectionValue')}</span>
              </div>
              <div className="flex justify-between border-b border-stone-50 pb-1.5">
                <span className="text-stone-400">{t('productDetail.style')}</span>
                <span className="text-stone-700 font-medium">{t('productDetail.styleValue')}</span>
              </div>
            </div>
          </div>

          {/* Jewelry Care Guide */}
          <div className="border-t border-champagne-100 pt-6 space-y-4 max-lg:order-8">
            <h3 className="text-xs tracking-widest uppercase text-stone-800 font-semibold">
              {t('productDetail.sections.care.heading')}
            </h3>
            <p className="text-xs text-stone-500 font-sans">
              {t('productDetail.sections.care.subtitle')}
            </p>
            <div className="rounded-lg border border-stone-200 bg-[#FAF7F2]/40 p-6 space-y-5">
              <div className="flex items-start gap-4">
                <CheckCircle size={20} className="text-champagne-500 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-stone-900">{t('productDetail.sections.care.storeTitle')}</p>
                  <p className="text-sm text-stone-500">{t('productDetail.sections.care.storeDesc')}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle size={20} className="text-champagne-500 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-stone-900">{t('productDetail.sections.care.chemTitle')}</p>
                  <p className="text-sm text-stone-500">{t('productDetail.sections.care.chemDesc')}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle size={20} className="text-champagne-500 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-stone-900">{t('productDetail.sections.care.cleanTitle')}</p>
                  <p className="text-sm text-stone-500">{t('productDetail.sections.care.cleanDesc')}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle size={20} className="text-champagne-500 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-stone-900">{t('productDetail.sections.care.waterTitle')}</p>
                  <p className="text-sm text-stone-500">{t('productDetail.sections.care.waterDesc')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Our Promise */}
          <div className="border-t border-champagne-100 pt-6 space-y-4 max-lg:order-9">
            <h3 className="text-xs tracking-widest uppercase text-stone-800 font-semibold">
              {t('productDetail.sections.promise.heading')}
            </h3>
            <p className="text-xs text-stone-500 font-sans">
              {t('productDetail.sections.promise.subtitle')}
            </p>
            <div className="rounded-lg border border-stone-200 bg-[#FAF7F2]/40 p-6 space-y-5">
              <div className="flex items-start gap-4">
                <CheckCircle size={20} className="text-champagne-500 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-stone-900">{t('productDetail.sections.promise.materialsTitle')}</p>
                  <p className="text-sm text-stone-500">{t('productDetail.sections.promise.materialsDesc')}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle size={20} className="text-champagne-500 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-stone-900">{t('productDetail.sections.promise.handTitle')}</p>
                  <p className="text-sm text-stone-500">{t('productDetail.sections.promise.handDesc')}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle size={20} className="text-champagne-500 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-stone-900">{t('productDetail.sections.promise.packagingTitle')}</p>
                  <p className="text-sm text-stone-500">{t('productDetail.sections.promise.packagingDesc')}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle size={20} className="text-champagne-500 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-stone-900">{t('productDetail.sections.promise.supportTitle')}</p>
                  <p className="text-sm text-stone-500">{t('productDetail.sections.promise.supportDesc')}</p>
                </div>
              </div>
              <p className="text-sm text-stone-500 leading-relaxed">
                {t('productDetail.sections.promise.closing')}
              </p>
            </div>
          </div>

          {/* Estimated Delivery */}
          <div className="border-t border-champagne-100 pt-6 space-y-4 max-lg:order-10">
            <h3 className="text-xs tracking-widest uppercase text-stone-800 font-semibold">
              {t('productDetail.sections.delivery.heading')}
            </h3>
            <p className="text-xs text-stone-500 font-sans">
              {t('productDetail.sections.delivery.subtitle')}
            </p>
            <div className="rounded-lg border border-stone-200 bg-white p-6 space-y-5">
              <div className="flex items-start gap-4">
                <Truck size={20} className="text-champagne-500 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-stone-900">{t('productDetail.sections.delivery.casablancaTitle')}</p>
                  <p className="text-sm text-stone-500">{t('productDetail.sections.delivery.casablancaDesc')}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Truck size={20} className="text-champagne-500 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-stone-900">{t('productDetail.sections.delivery.otherTitle')}</p>
                  <p className="text-sm text-stone-500">{t('productDetail.sections.delivery.otherDesc')}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Truck size={20} className="text-champagne-500 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-stone-900">{t('productDetail.sections.delivery.trackingTitle')}</p>
                  <p className="text-sm text-stone-500">{t('productDetail.sections.delivery.trackingDesc')}</p>
                </div>
              </div>
              <div className="rounded-md bg-champagne-50 border border-champagne-100 p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-champagne-500 shrink-0" aria-hidden="true" />
                  <p className="text-sm text-stone-600">{t('productDetail.sections.delivery.note')}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* FAQ Accordion Section */}
      <section className="border-t border-champagne-100 pt-10 sm:pt-16 pb-4">
        <div className="text-center mb-6 sm:mb-10">
          <span className="text-[10px] tracking-[0.2em] uppercase text-champagne-500 font-medium font-sans">
            {t('productDetail.faq.title')}
          </span>
        </div>
        <div className="max-w-2xl mx-auto">
          <Suspense fallback={<div className="space-y-4"><div className="h-12 bg-stone-50 animate-pulse rounded" /><div className="h-12 bg-stone-50 animate-pulse rounded" /><div className="h-12 bg-stone-50 animate-pulse rounded" /></div>}>
            {/* Compact accordion headers below 640px; preserve >=44px touch targets */}
            <div className="[&_button]:py-3 sm:[&_button]:py-4 [&_button]:gap-2 sm:[&_button]:gap-4 [&_button>span]:min-w-0 [&_button>span]:break-words">
              <FAQAccordion />
            </div>
          </Suspense>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="border-t border-champagne-100 pt-10 sm:pt-16 pb-4 space-y-6 sm:space-y-8">
        <div className="text-center mb-1 sm:mb-2">
          <span className="text-[10px] tracking-[0.2em] uppercase text-champagne-500 font-medium font-sans">
            {t('reviewsPage.heading')}
          </span>
        </div>
        <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
          <Suspense fallback={<div className="h-8 bg-stone-50 animate-pulse rounded w-48 mx-auto" />}>
            <ReviewSummary averageRating={averageRating} totalReviews={totalReviews} />
          </Suspense>
          <div className="min-w-0">
            <Suspense fallback={<div className="space-y-4"><div className="h-24 bg-stone-50 animate-pulse rounded" /><div className="h-24 bg-stone-50 animate-pulse rounded" /></div>}>
              <ReviewList reviews={reviews} />
            </Suspense>
          </div>
          <Suspense fallback={<div className="h-48 bg-stone-50 animate-pulse rounded" />}>
            <ReviewForm productId={product.id} onSuccess={fetchReviews} />
          </Suspense>
        </div>
      </section>

      {/* You May Also Like Section */}
      {recommendations.length > 0 && (
        <section className="space-y-8 border-t border-champagne-100 pt-16">
          <div className="text-center">
            <span className="text-[10px] tracking-[0.2em] uppercase text-champagne-500 font-medium font-sans">
              {t('productDetail.recommendations')}
            </span>
            <h2 className="font-serif text-2xl text-stone-950 mt-1 font-medium">{t('productDetail.youMayAlsoLike')}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {recommendations.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onViewDetails={handleViewRelated}
                onAddToCartDirect={handleQuickAdd}
                wishlist={wishlist}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed Section */}
      {recentlyViewedProducts.length > 0 && (
        <section className="space-y-8 border-t border-champagne-100 pt-16">
          <div className="text-center">
            <span className="text-[10px] tracking-[0.2em] uppercase text-champagne-500 font-medium font-sans">
              {t('productDetail.recentlyViewed')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {recentlyViewedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onViewDetails={handleViewRelated}
                onAddToCartDirect={handleQuickAdd}
                wishlist={wishlist}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        </section>
      )}

      <Suspense fallback={<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"><div className="animate-spin h-8 w-8 border-2 border-champagne-500 border-t-transparent rounded-full" /></div>}>
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          productName={product.name}
          productUrl={typeof window !== 'undefined' ? window.location.href : ''}
        />
      </Suspense>

      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}

    </div>
  );
}
