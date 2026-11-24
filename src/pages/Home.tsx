import { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  ArrowLeft,
  Compass, 
  Shield, 
  Gem, 
  Truck, 
  Lock, 
  Gift, 
  Star, 
  Sparkles,
  Check,
  Copy
} from 'lucide-react';

import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import TrustBadges from '../components/TrustBadges';
import { useTranslation } from '../i18n';
import { showToast } from '../components/ToastContainer';

interface HomeProps {
  products: Product[];
  isLoading: boolean;
  onPageChange: (pageName: string, params?: any) => void;
  onAddToCartDirect: (product: Product, size: string) => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
}

export default function Home({ products, isLoading, onPageChange, onAddToCartDirect, wishlist, onToggleWishlist }: HomeProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const { t, dir } = useTranslation();

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
  const bestSellers = [
    products.find(p => p.category === 'earrings'),
    products.find(p => p.category === 'rings'),
    products.find(p => p.category === 'bracelets'),
    products.find(p => p.category === 'necklaces'),
  ].filter(Boolean) as Product[];
  const newArrivals = [
    products.filter(p => p.category === 'anklets')[0],
    products.filter(p => p.category === 'earrings')[1],
    products.filter(p => p.category === 'rings')[1],
    products.filter(p => p.category === 'bracelets')[1],
  ].filter(Boolean) as Product[];

  const categoryProduct = (cat: string) => products.find(p => p.category === cat);
  const categories = [
    { name: t('home.categories.items')[0], image: categoryProduct('bracelets')?.images?.[0] || '/images/products/bracelets/CCJ-BRA-001/01-white.webp', id: 'bracelets' },
    { name: t('home.categories.items')[1], image: categoryProduct('rings')?.images?.[0] || '/images/products/rings/CCJ-RNG-001/01-white.webp', id: 'rings' },
    { name: t('home.categories.items')[2], image: categoryProduct('earrings')?.images?.[0] || '/images/products/earrings/CCJ-EAR-001/01-white%20%282%29.webp', id: 'earrings' },
    { name: t('home.categories.items')[3], image: categoryProduct('anklets')?.images?.[0] || '/images/products/anklets/CCJ-ANK-001/01-white.webp', id: 'anklets' },
    { name: t('home.categories.items')[4], image: categoryProduct('necklaces')?.images?.[0] || '/images/products/necklaces/CCJ-NEC-001/01-white.webp', id: 'necklaces' },
    { name: t('home.categories.items')[5], image: categoryProduct('jewelry_sets')?.images?.[0] || '/images/products/jewelry_sets/CCJ-SET-004/01-white.webp', id: 'jewelry_sets' },
  ];

  // Compact mobile-only category slider: every category, real product thumbnails, localized names.
  const mobileCategories = [
    { id: 'bracelets', name: t('nav.categories.bracelets.name'), image: categoryProduct('bracelets')?.images?.[0] || '/images/products/bracelets/CCJ-BRA-001/01-white.webp' },
    { id: 'rings', name: t('nav.categories.rings.name'), image: categoryProduct('rings')?.images?.[0] || '/images/products/rings/CCJ-RNG-001/01-white.webp' },
    { id: 'necklaces', name: t('nav.categories.necklaces.name'), image: categoryProduct('necklaces')?.images?.[0] || '/images/products/necklaces/CCJ-NEC-001/01-white.webp' },
    { id: 'earrings', name: t('nav.categories.earrings.name'), image: categoryProduct('earrings')?.images?.[0] || '/images/products/earrings/CCJ-EAR-001/01-white%20%282%29.webp' },
    { id: 'anklets', name: t('nav.categories.anklets.name'), image: categoryProduct('anklets')?.images?.[0] || '/images/products/anklets/CCJ-ANK-001/01-white.webp' },
    { id: 'jewelry_sets', name: t('nav.categories.jewelry_sets.name'), image: categoryProduct('jewelry_sets')?.images?.[0] || '/images/products/jewelry_sets/CCJ-SET-004/01-white.webp' },
  ];

  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const carouselViewportRef = useRef<HTMLDivElement>(null);
  const carouselTrackRef = useRef<HTMLDivElement>(null);
  const carouselFirstSetRef = useRef<HTMLDivElement>(null);
  const carouselSecondSetRef = useRef<HTMLDivElement>(null);

  // Two identical sets make the loop seamless; the clone is hidden from screen readers and tab order.
  const renderCategorySet = (primary: boolean) => (
    <div
      ref={primary ? carouselFirstSetRef : carouselSecondSetRef}
      className="flex shrink-0 gap-2.5"
      aria-hidden={primary ? undefined : true}
    >
      {mobileCategories.map((cat) => (
        <button
          key={`${primary ? 'primary' : 'clone'}-${cat.id}`}
          type="button"
          onClick={() => onPageChange('shop', { filterCategory: cat.id })}
          aria-label={primary ? cat.name : undefined}
          tabIndex={primary ? 0 : -1}
          className="group flex w-[82px] shrink-0 flex-col items-center gap-1.5 rounded-lg px-0.5 py-0.5 transition-colors duration-300 hover:bg-white/70 active:scale-[0.97]"
        >
          <span className="relative block h-16 w-16">
            <img
              src={cat.image}
              alt=""
              loading="lazy"
              draggable={false}
              className="h-full w-full rounded-full object-cover ring-1 ring-champagne-300/70 shadow-[0_4px_10px_-6px_rgba(120,86,30,0.55)] transition-transform duration-300 group-hover:scale-105"
            />
            <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/40" />
          </span>
          <span dir="auto" className="min-h-[24px] w-full text-center text-[10px] font-semibold leading-[12px] text-stone-700 transition-colors duration-300 group-hover:text-champagne-700">
            {cat.name}
          </span>
        </button>
      ))}
    </div>
  );

  const categoryRef = useRef<HTMLDivElement>(null);
  const [categoryVisible, setCategoryVisible] = useState(false);
  const promoRef = useRef<HTMLDivElement>(null);
  const [promoVisible, setPromoVisible] = useState(false);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const catEl = categoryRef.current;
    if (catEl) {
      const o = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) { setCategoryVisible(true); o.disconnect(); }
      }, { threshold: 0, rootMargin: '-100px' });
      o.observe(catEl);
      observers.push(o);
    }
    const promEl = promoRef.current;
    if (promEl) {
      const o = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) { setPromoVisible(true); o.disconnect(); }
      }, { threshold: 0 });
      o.observe(promEl);
      observers.push(o);
    }
    return () => observers.forEach(o => o.disconnect());
  }, []);

  // Mobile hero video: autoplay only while visible, muted, and paused for reduced motion.
  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;

    const isOnScreen = () => {
      const rect = video.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
    };

    const syncPlayback = () => {
      if ((visible || isOnScreen()) && !reducedMotion.matches && !document.hidden) {
        const playback = video.play();
        if (playback) playback.catch(() => {});
      } else {
        video.pause();
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    }, { threshold: 0.05 });
    observer.observe(video);
    syncPlayback();

    document.addEventListener('visibilitychange', syncPlayback);
    reducedMotion.addEventListener?.('change', syncPlayback);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', syncPlayback);
      reducedMotion.removeEventListener?.('change', syncPlayback);
      video.pause();
    };
  }, []);

  // Seamless, swipeable right-to-left category carousel (mobile section only).
  // The internal track is forced to physical LTR so the duplicate set is always
  // to the right of the original, even when the site language is RTL.
  useEffect(() => {
    const viewport = carouselViewportRef.current;
    const track = carouselTrackRef.current;
    const firstSet = carouselFirstSetRef.current;
    const secondSet = carouselSecondSetRef.current;
    if (!viewport || !track || !firstSet || !secondSet) return;

    const SPEED = 26; // pixels per second
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let offset = 0;
    let period = 0;
    let raf = 0;
    let lastFrame = 0;
    const initialRect = viewport.getBoundingClientRect();
    let visible = initialRect.bottom > 0 && initialRect.top < window.innerHeight;
    let dragging = false;
    let dragPointerId: number | null = null;
    let dragStartX = 0;
    let dragStartOffset = 0;
    let dragged = false;
    let resumeTimer = 0;
    let resizeObserver: ResizeObserver | null = null;

    // Measure the real distance between the two set origins. This includes the
    // inter-set gap and stays correct regardless of translations or font metrics.
    const measurePeriod = () => {
      const gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0;
      const firstRect = firstSet.getBoundingClientRect();
      const secondRect = secondSet.getBoundingClientRect();
      const measuredSpacing = Math.abs(secondRect.left - firstRect.left);
      return measuredSpacing > 0 ? measuredSpacing : firstRect.width + gap;
    };

    const renderOffset = () => {
      track.style.transform = `translate3d(${offset}px, 0, 0)`;
    };

    const normalize = () => {
      if (!period) return;
      // Keep the offset in (-period, 0]. Adding or subtracting one exact
      // period swaps the two identical sets with no visible change.
      while (offset <= -period) offset += period;
      while (offset > 0) offset -= period;
    };

    const shouldAnimate = () => !reducedMotion.matches && visible && !document.hidden && !dragging;

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      lastFrame = 0;
    };

    function tick(time: number) {
      raf = 0;
      if (!shouldAnimate()) {
        lastFrame = 0;
        return;
      }
      if (!lastFrame) {
        lastFrame = time;
        raf = requestAnimationFrame(tick);
        return;
      }
      const delta = Math.min(time - lastFrame, 64);
      lastFrame = time;
      offset -= (SPEED * delta) / 1000;
      normalize();
      renderOffset();
      raf = requestAnimationFrame(tick);
    }

    const start = () => {
      if (!raf && shouldAnimate()) {
        lastFrame = 0;
        raf = requestAnimationFrame(tick);
      }
    };

    const clearResume = () => {
      if (resumeTimer) {
        clearTimeout(resumeTimer);
        resumeTimer = 0;
      }
    };

    const scheduleResume = (delay = 600) => {
      clearResume();
      resumeTimer = window.setTimeout(() => start(), delay);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      stop();
      clearResume();
      dragging = true;
      dragged = false;
      dragPointerId = event.pointerId;
      dragStartX = event.clientX;
      dragStartOffset = offset;
      viewport.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging || event.pointerId !== dragPointerId) return;
      const deltaX = event.clientX - dragStartX;
      if (Math.abs(deltaX) > 4) dragged = true;
      offset = dragStartOffset + deltaX;
      normalize();
      renderOffset();
    };

    const onPointerEnd = (event: PointerEvent) => {
      if (!dragging || event.pointerId !== dragPointerId) return;
      dragging = false;
      dragPointerId = null;
      if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
      scheduleResume();
    };

    const onClickCapture = (event: MouseEvent) => {
      if (!dragged) return;
      event.preventDefault();
      event.stopPropagation();
      dragged = false;
    };

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      stop();
      clearResume();
      offset -= event.deltaX;
      normalize();
      renderOffset();
      scheduleResume(700);
    };

    const onKeyDown = () => {
      stop();
      clearResume();
      scheduleResume(800);
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else {
        period = measurePeriod();
        start();
      }
    };

    const onMotionChange = () => {
      if (reducedMotion.matches) stop();
      else start();
    };

    const onResize = () => {
      const nextPeriod = measurePeriod();
      if (nextPeriod > 0) {
        if (period > 0 && nextPeriod !== period) {
          offset = (offset / period) * nextPeriod;
        }
        period = nextPeriod;
      }
      normalize();
      renderOffset();
    };

    viewport.addEventListener('pointerdown', onPointerDown);
    viewport.addEventListener('pointermove', onPointerMove);
    viewport.addEventListener('pointerup', onPointerEnd);
    viewport.addEventListener('pointercancel', onPointerEnd);
    viewport.addEventListener('click', onClickCapture, true);
    viewport.addEventListener('wheel', onWheel, { passive: true });
    viewport.addEventListener('keydown', onKeyDown);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('resize', onResize);
    reducedMotion.addEventListener?.('change', onMotionChange);

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(track);
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        period = measurePeriod();
        start();
      } else {
        stop();
      }
    }, { threshold: 0.01 });
    observer.observe(viewport);

    period = measurePeriod();
    normalize();
    renderOffset();
    start();

    return () => {
      stop();
      clearResume();
      resizeObserver?.disconnect();
      observer.disconnect();
      viewport.removeEventListener('pointerdown', onPointerDown);
      viewport.removeEventListener('pointermove', onPointerMove);
      viewport.removeEventListener('pointerup', onPointerEnd);
      viewport.removeEventListener('pointercancel', onPointerEnd);
      viewport.removeEventListener('click', onClickCapture, true);
      viewport.removeEventListener('wheel', onWheel);
      viewport.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
      reducedMotion.removeEventListener?.('change', onMotionChange);
    };
  }, []);

  // Newsletter subscription state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      });
      if (response.ok) {
        setNewsletterSubscribed(true);
        setNewsletterEmail('');
        showToast(t('footer.newsletter.subscribed'));
      } else if (response.status === 409) {
        showToast(t('footer.newsletter.alreadySubscribed'), true);
      } else {
        showToast(t('footer.newsletter.error'), true);
      }
    } catch {
      showToast(t('footer.newsletter.error'), true);
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 bg-[#FAF7F2]/30 overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="home-hero-section relative flex flex-col sm:flex-row sm:items-center sm:min-h-[85vh] lg:h-[90vh] bg-gradient-to-tr from-[#FFF9F5] via-[#FFFDFB] to-[#FFF3EB] overflow-hidden pt-0 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pt-12 sm:pb-12 md:py-20 lg:py-0 border-b-0 sm:border-b border-champagne-150">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-champagne-300/10 to-transparent -skew-x-12 transform origin-top-right hidden"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(197,160,89,0.1),transparent_60%)]"></div>

        {/* Desktop full-background image with left dark overlay */}
        <div className="hidden lg:block absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/images/hero.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, rgba(0,0,0,.65) 0%, rgba(0,0,0,.35) 35%, rgba(0,0,0,.15) 60%, rgba(0,0,0,0) 100%)',
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-16 lg:max-w-none lg:self-stretch relative z-10 w-full">
          <div className="relative grid grid-cols-1 lg:flex lg:items-center lg:h-full gap-0 sm:gap-12 lg:gap-20 items-center">

            {/* Mobile hero video — 16:9, full viewport width, contained inside the existing hero */}
            <div className="sm:hidden w-full relative z-10">
              <div className="relative w-full aspect-[16/9] overflow-hidden bg-champagne-100">
                <video
                  ref={heroVideoRef}
                  className="absolute inset-0 h-full w-full object-contain"
                  poster="/images/slider-poster.jpg"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  aria-label={t('home.hero.title')}
                >
                  <source src="/videos/SLIDER.mp4" type="video/mp4" />
                </video>
              </div>
            </div>

            {/* Left/Text Column */}
            <div className="relative z-20 w-full px-4 pt-3 sm:static sm:z-auto sm:w-auto sm:px-0 sm:pt-0 lg:w-[50%] sm:max-w-none sm:space-y-6 lg:space-y-8 text-start sm:text-center lg:text-start flex flex-col items-stretch sm:items-center lg:items-start sm:justify-center hero-stagger hero-fade" dir={dir}>
              <h1 className="hidden md:block font-serif text-[clamp(34px,9.5vw,42px)] sm:text-5xl md:text-6xl lg:text-[70px] leading-[1.05] sm:leading-[1.1] font-black text-stone-900 lg:text-white tracking-tight">
                {t('home.hero.title')} <br />
                <span className="text-champagne-600 lg:text-champagne-400 italic font-medium leading-normal">{t('home.hero.titleHighlight')}</span>
              </h1>
              
              <p className="hidden md:block text-stone-600 lg:text-white/85 text-sm sm:text-base leading-relaxed max-w-xl font-medium font-sans mt-4 sm:mt-0">
                {t('home.hero.desc')}
              </p>
              
              <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-4 sm:pt-4 lg:pt-6">
                <button
                  onClick={() => onPageChange('shop')}
                  className="cursor-pointer w-full sm:w-auto h-11 sm:h-auto px-4 py-0 sm:px-8 sm:py-4 bg-[#B7934F] text-white sm:bg-stone-900 text-[11px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-widest font-bold hover:bg-[#A67E42] sm:hover:bg-champagne-700 hover:-translate-y-0.5 transition-all duration-300 shadow-[0_6px_18px_-6px_rgba(80,55,15,0.55)] active:scale-[0.98] flex items-center justify-center gap-2 rounded-[10px] sm:rounded-xs font-sans"
                >
                  {t('home.hero.cta')}
                  {dir === 'ltr' ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
                </button>
                <button
                  onClick={() => onPageChange('shop')}
                  className="cursor-pointer w-full sm:w-auto h-11 sm:h-auto px-4 py-0 sm:px-8 sm:py-3.5 bg-white/80 sm:bg-transparent backdrop-blur-[2px] sm:backdrop-blur-none border border-[#B7934F]/70 sm:border-2 sm:border-champagne-500/40 lg:border-champagne-400/50 text-[#7A5C27] sm:text-champagne-700 lg:text-champagne-400 text-[11px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-widest font-bold hover:bg-white/90 sm:hover:bg-champagne-500/5 hover:border-[#B7934F] sm:hover:border-champagne-700 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 rounded-[10px] sm:rounded-xs font-sans"
                >
                  {t('home.hero.secondaryCta')}
                </button>
              </div>
            </div>

            {/* Right/Image Column — tablet only (mobile uses its own portrait image, desktop uses full-background) */}
            <div className="relative hidden sm:flex items-center justify-center h-[480px] lg:hidden">

              {/* Back elegant geometry outline */}
              <div className="absolute -inset-4 border border-champagne-300/20 rounded-2xl scale-95 md:scale-100 -rotate-3 transition-transform duration-700 pointer-events-none"></div>

              {/* Tablet Hero Image Container */}
              <div className="w-full h-full max-w-lg relative z-10 overflow-hidden rounded-lg hero-image-in">
                <img
                  src="/images/hero.webp"
                  alt="Hero"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 1b. MOBILE CATEGORY RAIL — fills the space between the hero CTAs and the trust bar */}
      <section
        aria-label={t('home.mobileCategories.label')}
        className="home-mobile-rail md:hidden bg-[#FAF7F3] [margin-block-start:0px] border-y border-champagne-100 py-3"
        dir={dir}
      >
        <div className="px-4">
          <div className="mb-2.5 text-center">
            <span className="block text-[9px] font-bold uppercase tracking-[0.22em] text-champagne-600">
              {t('home.mobileCategories.label')}
            </span>
            <h2 className="mt-0.5 font-serif text-[19px] font-semibold leading-tight text-stone-800">
              {t('home.mobileCategories.heading')}
            </h2>
          </div>

          <div ref={carouselViewportRef} className="mobile-carousel-viewport -mx-1">
            <div ref={carouselTrackRef} dir="ltr" className="mobile-carousel-track gap-2.5">
              {renderCategorySet(true)}
              {renderCategorySet(false)}
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST BAR */}
      <section className="home-trust-bar bg-white border-y border-champagne-105 py-4 sm:py-8 md:py-10 shadow-3xs" dir={dir}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrustBadges />
        </div>
      </section>

      {/* 3. PROMOTIONAL BANNER (hidden on mobile Home) */}
      <section className="hidden sm:block bg-gradient-to-r from-champagne-100/40 via-white to-champagne-100/20 border-y border-champagne-105 py-12 md:py-14" dir={dir}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-5 flex flex-col items-center">
          <span className="text-[10px] tracking-[0.25em] font-bold uppercase text-champagne-500 block">
            {t('home.promoBanner.label')}
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-stone-900 leading-tight">
            {t('home.promoBanner.title')}
          </h3>
          <p className="text-stone-500 text-xs sm:text-sm max-w-md leading-relaxed">
            {t('home.promoBanner.desc')}
          </p>
          <button
            onClick={() => onPageChange('shop')}
            className="cursor-pointer bg-stone-900 text-white font-bold hover:bg-champagne-500 text-xs uppercase tracking-widest px-8 py-3.5 shadow-md hover:shadow-xl transition-all duration-300 rounded-xs font-sans active:scale-95 mt-1"
          >
            {t('home.promoBanner.cta')}
          </button>
        </div>
      </section>

      {/* 4. SHOP BY CATEGORY */}
      {/* Mobile pulls the category heading up right below the Trust Bar (space-y gap cancelled via margin-block-start). */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile heading (below 640px) */}
        <div className="sm:hidden text-center space-y-4 mb-12">
          <span className="text-xs tracking-widest font-bold uppercase text-champagne-500 block">
            {t('home.categories.label')}
          </span>
          <h2 className="font-serif text-3xl text-stone-900 font-black">
            {t('home.categories.heading')}
          </h2>
          <div className="w-16 h-[2px] bg-champagne-500 mx-auto rounded-full"></div>
        </div>

        {/* Tablet / Desktop heading */}
        <div className="hidden sm:block text-center space-y-4 mb-12">
          <span className="text-xs tracking-widest font-bold uppercase text-champagne-500 block">
            {t('home.categories.label')}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-black">
            {t('home.categories.heading')}
          </h2>
          <div className="w-16 h-[2px] bg-champagne-500 mx-auto rounded-full"></div>
        </div>

        <div ref={categoryRef} className={`grid grid-cols-2 md:grid-cols-3 gap-6 category-stagger ${categoryVisible ? 'visible' : ''}`}>
          {categories.map((cat) => (
            <div
              key={cat.id}
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
              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 z-10 text-start" dir={dir}>
                <span className="text-[10px] tracking-wider text-champagne-300 font-bold mb-1 opacity-90">
                  {t('home.categories.overlay')}
                </span>
                <h3 className="font-sans text-lg sm:text-xl md:text-2xl text-white tracking-wide font-extrabold mb-2">
                  {cat.name}
                </h3>
                
                <div className="pt-2 border-t border-white/10 flex items-center justify-between opacity-80 group-hover:opacity-100 transition-opacity">
                  <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-white group-hover:bg-champagne-500 group-hover:text-white group-hover:-translate-x-1 transition-all duration-300">
                    {dir === 'ltr' ? <ArrowRight size={11} /> : <ArrowLeft size={11} />}
                  </div>
                  <span className="text-[10px] tracking-wider text-champagne-100 font-bold">
                    {t('home.categories.cta')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. BEST SELLERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 border-b border-champagne-105 pb-5" dir={dir}>
          <div className="space-y-1 text-center md:text-start mb-4 md:mb-0">
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
            {dir === 'ltr' ? <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /> : <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />}
          </button>
        </div>

        {/* Dynamic product lists loading state */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="space-y-2 sm:space-y-4 animate-pulse">
                <div className="bg-stone-200 aspect-square w-full rounded-[22px] sm:rounded-md"></div>
                <div className="h-4 bg-stone-200 w-3/4"></div>
                <div className="h-4 bg-stone-200 w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
            {bestSellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={(id) => {
                  const p = products.find(x => x.id === id);
                  onPageChange('product', { slug: p?.slug, id });
                }}
                onAddToCartDirect={onAddToCartDirect}
                wishlist={wishlist}
                onToggleWishlist={onToggleWishlist}
                compact
              />
            ))}
          </div>
        )}
      </section>

      {/* 6. LUXURY PROMOTIONAL BANNER */}
      <section className="bg-stone-900 text-white relative py-16 md:py-20 px-4 md:px-8 overflow-hidden border-y border-champagne-400/25">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(197,160,89,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-stone-950/20"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8 flex flex-col items-center">
          <div
            ref={promoRef}
            className={`w-12 h-12 rounded-full border border-champagne-400/30 flex items-center justify-center text-champagne-400 mb-2 promo-scale-in ${promoVisible ? 'visible' : ''}`}
          >
            <Sparkles size={18} />
          </div>
          
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

      {/* 7. NEW ARRIVALS SECTION */}
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
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="space-y-2 sm:space-y-4 animate-pulse">
                <div className="bg-stone-200 aspect-square w-full rounded-[22px] sm:rounded-md"></div>
                <div className="h-4 bg-stone-200 w-3/4"></div>
                <div className="h-4 bg-stone-200 w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
            {newArrivals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={(id) => {
                  const p = products.find(x => x.id === id);
                  onPageChange('product', { slug: p?.slug, id });
                }}
                onAddToCartDirect={onAddToCartDirect}
                wishlist={wishlist}
                onToggleWishlist={onToggleWishlist}
                compact
              />
            ))}
          </div>
        )}
      </section>

      {/* 8. WHY CHOOSE US */}
      <section className="bg-white border-y border-champagne-100 py-16 md:py-20" dir={dir}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs tracking-widest font-bold uppercase text-champagne-500 block">
              {t('home.whyUs.label')}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-extrabold">{t('home.whyUs.heading')}</h2>
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

      {/* 9. SPECIAL OFFER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-champagne-100/30 to-[#FFEFE5] border border-champagne-200 rounded-2xl p-8 md:p-12 shadow-sm relative overflow-hidden" dir={dir}>
          <div className="absolute top-0 left-0 w-24 h-24 bg-champagne-300/10 rounded-full -translate-x-6 -translate-y-6"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            <div className="md:col-span-8 space-y-4 text-center md:text-start">
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

      {/* 10. CUSTOMER REVIEWS */}
      <section className="bg-[#FAF7F2]/50 border-y border-champagne-100 py-16 md:py-20" dir={dir}>
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
            <div className="bg-white border border-champagne-105 p-6 rounded-lg shadow-2xs hover:shadow-md transition-all duration-300 space-y-4 flex flex-col justify-between text-start">
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
                <span className="text-stone-400 inline-block me-1">، {t('home.reviews.items')[0].location}</span>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-white border border-champagne-105 p-6 rounded-lg shadow-2xs hover:shadow-md transition-all duration-300 space-y-4 flex flex-col justify-between text-start">
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
                <span className="text-stone-400 inline-block me-1">، {t('home.reviews.items')[1].location}</span>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-white border border-champagne-105 p-6 rounded-lg shadow-2xs hover:shadow-md transition-all duration-300 space-y-4 flex flex-col justify-between text-start">
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
                <span className="text-stone-400 inline-block me-1">، {t('home.reviews.items')[2].location}</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 11. GIFT SECTION */}
      <section className="bg-gradient-to-tr from-[#FFF7F3] via-white to-[#FFFAF7] border-y border-champagne-105 py-16 md:py-20 px-4" dir={dir}>
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
              {dir === 'ltr' ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
            </button>
          </div>
        </div>
      </section>

      {/* 12. NEWSLETTER */}
      <section className="bg-white border-t border-champagne-105 py-16 md:py-20" dir={dir}>
        <div className="max-w-lg mx-auto px-4 sm:px-6 text-center space-y-6 flex flex-col items-center">
          <div className="w-11 h-11 rounded-full border border-champagne-300/30 flex items-center justify-center text-champagne-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10Z"/><path d="M22 7 12 13 2 7"/></svg>
          </div>
          <div className="space-y-2">
            <span className="text-[10px] tracking-[0.25em] font-bold uppercase text-champagne-500 block">
              {t('home.newsletter.label')}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-black text-stone-900">
              {t('home.newsletter.heading')}
            </h3>
            <p className="text-stone-500 text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
              {t('home.newsletter.desc')}
            </p>
          </div>
          {newsletterSubscribed ? (
            <div className="text-center space-y-1">
              <p className="text-xs uppercase tracking-widest font-bold text-emerald-600">{t('footer.newsletter.subscribed')}</p>
              <p className="text-[11px] text-stone-500">{t('footer.newsletter.welcome')}</p>
            </div>
          ) : (
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm"
            >
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={t('home.newsletter.placeholder')}
                className="w-full border border-champagne-200 bg-[#FFFDFB] px-4 py-3 text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-champagne-500 focus:ring-1 focus:ring-champagne-500/20 transition-all rounded-xs font-sans"
              />
              <button
                type="submit"
                className="cursor-pointer w-full sm:w-auto bg-stone-900 text-white font-bold hover:bg-champagne-500 text-xs uppercase tracking-widest px-6 py-3 shadow-md hover:shadow-xl transition-all duration-300 rounded-xs font-sans active:scale-95 shrink-0"
              >
                {t('home.newsletter.cta')}
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}

