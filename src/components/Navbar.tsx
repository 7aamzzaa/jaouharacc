import { ShoppingBag, Menu, X, ChevronDown, CircleDot, Sparkles, Heart, Crown, Gem, Circle, Globe } from 'lucide-react';
import { useState, lazy, Suspense } from 'react';
import { CartItem, Product } from '../types';
import { useTranslation, type Lang } from '../i18n';
import { useCurrency, type CurrencyCode } from '../CurrencyContext';
import SearchButton from './search/SearchButton';

const SearchModal = lazy(() => import('./search/SearchModal'));

interface NavbarProps {
  currentPage: string;
  onPageChange: (pageName: string, params?: any) => void;
  cart: CartItem[];
  onOpenCart: () => void;
  wishlist: string[];
  allProducts: Product[];
}

export default function Navbar({ currentPage, onPageChange, cart, wishlist, onOpenCart, allProducts }: NavbarProps) {
  const { t, lang, setLang, dir } = useTranslation();
  const { currency, setCurrency } = useCurrency();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(false);
  const [mobileGiftOpen, setMobileGiftOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currOpen, setCurrOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const isHome = currentPage === 'home';
  const mobileIconClass = isHome ? 'text-white sm:text-stone-700' : 'text-stone-700';
  const mobileHoverClass = isHome ? 'hover:text-champagne-400 sm:hover:text-champagne-500' : 'hover:text-champagne-500';

  const languages: { code: Lang; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'fr', label: 'FR' },
    { code: 'ar', label: 'AR' },
  ];

  const categoryIds = ['bracelets', 'rings', 'earrings', 'anklets', 'necklaces', 'jewelry_sets'] as const;
  const categoryIcons: Record<string, typeof CircleDot> = { bracelets: CircleDot, rings: Circle, earrings: Sparkles, anklets: Heart, necklaces: Crown, jewelry_sets: Gem };

  return (
    <header
      className={
        isHome
          ? 'absolute top-0 left-0 right-0 z-[100] bg-transparent sm:sticky sm:z-40 sm:bg-white/80 sm:backdrop-blur-md sm:border-b sm:border-champagne-100 sm:shadow-xs'
          : 'sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-champagne-100 shadow-xs relative'
      }
      style={isHome ? { paddingTop: 'calc(env(safe-area-inset-top) + 14px)' } : undefined}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={isHome ? 'grid grid-cols-[1fr_auto_1fr] items-center h-[72px] sm:flex sm:justify-between sm:items-center sm:h-20' : 'flex justify-between items-center h-20'}>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`cursor-pointer ${mobileIconClass} ${mobileHoverClass} p-2 focus:outline-hidden`}
              aria-label={t('nav.toggleMenu')}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Luxury Brand Typography */}
          <div className={`${isHome ? 'justify-self-center mt-2 sm:mt-0 sm:flex sm:flex-none' : 'flex-1 flex md:flex-none'} justify-center md:justify-start`}>
            <button
              onClick={() => {
                onPageChange('home');
                setMobileMenuOpen(false);
              }}
              className="cursor-pointer group flex flex-col items-center sm:items-start focus:outline-hidden"
              id="brand-logo-btn"
            >
              <img
                src="/images/diamond-logo.png"
                alt=""
                aria-hidden="true"
                className={`block shrink-0 w-[48px] h-auto mb-1.5 ${isHome ? 'sm:hidden' : 'hidden'}`}
              />
              <span className={`font-serif ${isHome ? 'text-[21px] sm:text-3xl text-white sm:text-champagne-500' : 'text-2xl sm:text-3xl text-champagne-500'} tracking-[0.3em] font-bold italic uppercase transition-all duration-300 group-hover:opacity-80`}>
                ccjaouhara
              </span>
              <span className={`text-[8px] tracking-[0.4em] uppercase font-sans -mt-0.5 font-semibold ${isHome ? 'hidden sm:block text-champagne-400 sm:text-stone-400' : 'text-stone-400'}`}>
                {t('nav.fineJewelry')}
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex space-x-10 items-center">
            <button
              onClick={() => onPageChange('home')}
              className={`cursor-pointer text-[11px] tracking-[0.25em] uppercase transition-colors duration-300 font-medium ${
                currentPage === 'home'
                  ? 'text-champagne-500 border-b border-champagne-400 pb-1 font-semibold'
                  : 'text-stone-600 hover:text-champagne-500 pb-1'
              }`}
            >
              {t('nav.home')}
            </button>

            {/* Collections Dropdown Mega-Menu */}
            <div className="relative group">
              <button
                className={`cursor-pointer text-[11px] tracking-[0.25em] uppercase transition-colors duration-300 font-medium flex items-center gap-1.5 pb-1 ${
                  currentPage === 'shop'
                    ? 'text-champagne-500'
                    : 'text-stone-600 hover:text-champagne-500'
                }`}
              >
                {t('nav.collections')}
                <ChevronDown size={11} className="transition-transform duration-300 group-hover:rotate-180" />
              </button>

              <div className="absolute top-full left-0 mt-0 pt-3 w-[280px] bg-white border border-champagne-150 rounded-lg shadow-xl z-50 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
                <div className="p-2 space-y-1">
                  {categoryIds.map((id) => {
                    const CatIcon = categoryIcons[id];
                    return (
                      <button
                        key={id}
                        onClick={() => onPageChange('shop', { filterCategory: id })}
                        className="w-full text-start flex items-start gap-3 p-2.5 rounded-md hover:bg-champagne-50/50 transition-colors group"
                      >
                        <div className="mt-0.5 p-1.5 bg-champagne-50 border border-champagne-100 rounded-md text-champagne-500 group-hover:bg-champagne-500 group-hover:text-white transition-all">
                          <CatIcon size={14} />
                        </div>
                        <div>
                          <span className="font-serif text-xs font-semibold text-stone-800 block group-hover:text-champagne-600 transition-colors">
                            {t(`nav.categories.${id}.name`)}
                          </span>
                          <span className="text-[10px] text-stone-400 block mt-0.5">
                            {t(`nav.categories.${id}.desc`)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="bg-stone-50 p-2.5 rounded-b-lg border-t border-champagne-105 flex justify-center">
                  <button
                    onClick={() => onPageChange('shop')}
                    className="text-[10px] tracking-widest uppercase font-bold text-champagne-600 hover:text-champagne-700"
                  >
                    {t('nav.exploreAll')}
                  </button>
                </div>
              </div>
            </div>

            {/* Gift Dropdown Mega-Menu */}
            <div className="relative group">
              <button
                className={`cursor-pointer text-[11px] tracking-[0.25em] uppercase transition-colors duration-300 font-medium flex items-center gap-1.5 pb-1 ${
                  currentPage === 'gift'
                    ? 'text-champagne-500'
                    : 'text-stone-600 hover:text-champagne-500'
                }`}
              >
                {t('nav.gift')}
                <ChevronDown size={11} className="transition-transform duration-300 group-hover:rotate-180" />
              </button>

              <div className="absolute top-full left-0 mt-0 pt-3 w-[280px] bg-white border border-champagne-150 rounded-lg shadow-xl z-50 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
                <div className="p-2 space-y-1">
                  {(['birthday', 'anniversary', 'wedding', 'holidays'] as const).map((key) => (
                    <button
                      key={key}
                      onClick={() => onPageChange('gift', { category: key })}
                      className="w-full text-start flex items-start gap-3 p-2.5 rounded-md hover:bg-champagne-50/50 transition-colors group"
                    >
                      <div>
                        <span className="font-serif text-xs font-semibold text-stone-800 block group-hover:text-champagne-600 transition-colors">
                          {t(`gift.${key}.title`)}
                        </span>
                        <span className="text-[10px] text-stone-400 block mt-0.5">
                          {t(`gift.${key}.description`)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="bg-stone-50 p-2.5 rounded-b-lg border-t border-champagne-105 flex justify-center">
                  <button
                    onClick={() => onPageChange('gift')}
                    className="text-[10px] tracking-widest uppercase font-bold text-champagne-600 hover:text-champagne-700"
                  >
                    {t('nav.exploreAllGifts')}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => onPageChange('shop')}
              className={`cursor-pointer text-[11px] tracking-[0.25em] uppercase transition-colors duration-300 font-medium ${
                currentPage === 'shop'
                  ? 'text-champagne-500 border-b border-champagne-400 pb-1 font-semibold'
                  : 'text-stone-600 hover:text-champagne-500 pb-1'
              }`}
            >
              {t('nav.shopAll')}
            </button>

            <button
              onClick={() => onPageChange('contact')}
              className={`cursor-pointer text-[11px] tracking-[0.25em] uppercase transition-colors duration-300 font-medium ${
                currentPage === 'contact'
                  ? 'text-champagne-500 border-b border-champagne-400 pb-1 font-semibold'
                  : 'text-stone-600 hover:text-champagne-500 pb-1'
              }`}
            >
              {t('nav.contact')}
            </button>

            <button
              onClick={() => onPageChange('blog')}
              className={`cursor-pointer text-[11px] tracking-[0.25em] uppercase transition-colors duration-300 font-medium ${
                currentPage === 'blog' || currentPage === 'blog-article'
                  ? 'text-champagne-500 border-b border-champagne-400 pb-1 font-semibold'
                  : 'text-stone-600 hover:text-champagne-500 pb-1'
              }`}
            >
              {t('nav.blog')}
            </button>
          </nav>

          {/* Cart + Language Switcher */}
          <div className={`flex items-center ${isHome ? 'gap-2 justify-self-end' : 'space-x-2'}`}>
            {/* Language Switcher */}
            <div className={`relative ${isHome ? 'hidden sm:block' : ''}`}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className={`cursor-pointer p-2 ${mobileIconClass} ${mobileHoverClass} transition-colors duration-300 focus:outline-hidden flex items-center gap-1`}
                aria-label={t('nav.switchLanguage')}
              >
                <Globe size={18} strokeWidth={1.5} />
                <span className="text-[11px] font-semibold uppercase">{lang.toUpperCase()}</span>
              </button>

              {langOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 bg-white border border-champagne-150 rounded-lg shadow-xl z-50 min-w-[120px] py-1">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => { setLang(l.code); setLangOpen(false); }}
                        className={`w-full text-start px-4 py-2 text-xs tracking-widest uppercase font-medium transition-colors ${
                          lang === l.code
                            ? 'text-champagne-500 bg-champagne-50 font-semibold'
                            : 'text-stone-600 hover:bg-champagne-50 hover:text-champagne-500'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Currency Switcher */}
            <div className={`relative ${isHome ? 'hidden sm:block' : ''}`}>
              <button
                onClick={() => setCurrOpen(!currOpen)}
                className={`cursor-pointer p-2 ${mobileIconClass} ${mobileHoverClass} transition-colors duration-300 focus:outline-hidden flex items-center gap-1`}
                aria-label="Select currency"
              >
                <span className="text-[11px] font-semibold uppercase">{currency}</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${currOpen ? 'rotate-180' : ''}`} />
              </button>

              {currOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setCurrOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 bg-white border border-champagne-150 rounded-lg shadow-xl z-50 min-w-[100px] py-1">
                    {(['MAD', 'EUR', 'USD'] as CurrencyCode[]).map((c) => (
                      <button
                        key={c}
                        onClick={() => { setCurrency(c); setCurrOpen(false); }}
                        className={`w-full text-start px-4 py-2 text-xs tracking-widest uppercase font-medium transition-colors ${
                          currency === c
                            ? 'text-champagne-500 bg-champagne-50 font-semibold'
                            : 'text-stone-600 hover:bg-champagne-50 hover:text-champagne-500'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

          <button
              onClick={() => onPageChange("wishlist")}
              className={`cursor-pointer relative p-2 ${mobileIconClass} ${mobileHoverClass} transition-colors duration-300 focus:outline-hidden ${isHome ? 'order-2 sm:order-none' : ''}`}
              aria-label={t('nav.wishlist')}
            >
              <Heart size={22} strokeWidth={1.5} className={isHome ? 'w-6 h-6 sm:w-[22px] sm:h-[22px]' : ''} />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold leading-none text-white bg-champagne-500 rounded-full scale-90 border border-white">
                  {wishlist.length}
                </span>
              )}
            </button>

            <SearchButton onClick={() => setSearchOpen(true)} className={`${mobileIconClass} ${mobileHoverClass} ${isHome ? 'order-1 sm:order-none' : ''}`} iconClassName={isHome ? 'w-6 h-6 sm:w-[22px] sm:h-[22px]' : ''} />

            <button
              id="desktop-cart-trigger"
              onClick={onOpenCart}
              className={`cursor-pointer relative p-2 ${mobileIconClass} ${mobileHoverClass} transition-colors duration-300 focus:outline-hidden ${isHome ? 'order-3 sm:order-none' : ''}`}
              aria-label={t('nav.viewBag')}
            >
              <ShoppingBag size={22} strokeWidth={1.5} className={isHome ? 'w-6 h-6 sm:w-[22px] sm:h-[22px]' : ''} />
              {totalItemsCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold leading-none text-white bg-champagne-500 hover:bg-champagne-600 rounded-full scale-90 border border-white">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Slide */}
      {mobileMenuOpen && (
        <div id="mobile-nav-panel" className="md:hidden bg-white border-b border-champagne-105 px-4 pt-2 pb-6 space-y-2 shadow-lg max-h-[85vh] overflow-y-auto">
          <button
            onClick={() => {
              onPageChange('home');
              setMobileMenuOpen(false);
            }}
            className={`block w-full text-start py-2.5 px-4 rounded-md text-sm tracking-widest uppercase font-medium ${
              currentPage === 'home'
                ? 'bg-luxe-pink-50 text-champagne-500 font-semibold'
                : 'text-stone-700 hover:bg-champagne-50/50 hover:text-champagne-500'
            }`}
          >
            {t('nav.home')}
          </button>

          {/* Mobile Collapsible Collections */}
          <div className="space-y-1">
            <button
              onClick={() => setMobileCollectionsOpen(!mobileCollectionsOpen)}
              className="w-full flex justify-between items-center py-2.5 px-4 rounded-md text-sm tracking-widest uppercase font-medium text-stone-700 hover:bg-champagne-50/50 hover:text-champagne-500"
            >
              <span>{t('nav.collections')}</span>
              <ChevronDown size={14} className={`transition-transform duration-300 ${mobileCollectionsOpen ? 'rotate-180 text-champagne-500' : ''}`} />
            </button>

            {mobileCollectionsOpen && (
              <div className="bg-stone-50/60 rounded-lg p-2 space-y-1 ms-4 border-s border-champagne-150">
                {categoryIds.map((id) => {
                  const CatIcon = categoryIcons[id];
                  return (
                    <button
                      key={id}
                      onClick={() => {
                        onPageChange('shop', { filterCategory: id });
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-start flex items-center gap-3 py-2 px-3 hover:bg-champagne-50/50 rounded-md group"
                    >
                      <span className="text-champagne-500">
                        <CatIcon size={12} />
                      </span>
                      <span className="font-serif text-xs font-semibold text-stone-800">
                        {t(`nav.categories.${id}.name`)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mobile Collapsible Gift */}
          <div className="space-y-1">
            <button
              onClick={() => setMobileGiftOpen(!mobileGiftOpen)}
              className="w-full flex justify-between items-center py-2.5 px-4 rounded-md text-sm tracking-widest uppercase font-medium text-stone-700 hover:bg-champagne-50/50 hover:text-champagne-500"
            >
              <span>{t('nav.gift')}</span>
              <ChevronDown size={14} className={`transition-transform duration-300 ${mobileGiftOpen ? 'rotate-180 text-champagne-500' : ''}`} />
            </button>

            {mobileGiftOpen && (
              <div className="bg-stone-50/60 rounded-lg p-2 space-y-1 ms-4 border-s border-champagne-150">
                {(['birthday', 'anniversary', 'wedding', 'holidays'] as const).map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      onPageChange('gift', { category: key });
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-start flex items-center gap-3 py-2 px-3 hover:bg-champagne-50/50 rounded-md group"
                  >
                    <span className="font-serif text-xs font-semibold text-stone-800">
                      {t(`gift.${key}.title`)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              onPageChange('shop');
              setMobileMenuOpen(false);
            }}
            className={`block w-full text-start py-2.5 px-4 rounded-md text-sm tracking-widest uppercase font-medium ${
              currentPage === 'shop'
                ? 'bg-luxe-pink-50 text-champagne-500 font-semibold'
                : 'text-stone-700 hover:bg-champagne-50/50'
            }`}
          >
            {t('nav.shopAll')}
          </button>

          <button
            onClick={() => {
              onPageChange('contact');
              setMobileMenuOpen(false);
            }}
            className={`block w-full text-start py-2.5 px-4 rounded-md text-sm tracking-widest uppercase font-medium ${
              currentPage === 'contact'
                ? 'bg-luxe-pink-50 text-champagne-500 font-semibold'
                : 'text-stone-700 hover:bg-champagne-50/50'
            }`}
          >
            {t('nav.contact')}
          </button>

          <button
            onClick={() => {
              onPageChange('blog');
              setMobileMenuOpen(false);
            }}
            className={`block w-full text-start py-2.5 px-4 rounded-md text-sm tracking-widest uppercase font-medium ${
              currentPage === 'blog' || currentPage === 'blog-article'
                ? 'bg-luxe-pink-50 text-champagne-500 font-semibold'
                : 'text-stone-700 hover:bg-champagne-50/50'
            }`}
          >
            {t('nav.blog')}
          </button>

          {/* Mobile Language Switcher */}
          <div className="border-t border-champagne-100 pt-3 mt-3">
            <div className="flex gap-2">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setMobileMenuOpen(false); }}
                  className={`flex-1 py-2 px-3 rounded-md text-xs tracking-widest uppercase font-bold text-center transition-colors ${
                    lang === l.code
                      ? 'bg-champagne-500 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-champagne-50 hover:text-champagne-600'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Currency Switcher */}
          <div className="pt-3">
            <div className="flex gap-2">
              {(['MAD', 'EUR', 'USD'] as CurrencyCode[]).map((c) => (
                <button
                  key={c}
                  onClick={() => { setCurrency(c); setMobileMenuOpen(false); }}
                  className={`flex-1 py-2 px-3 rounded-md text-xs tracking-widest uppercase font-bold text-center transition-colors ${
                    currency === c
                      ? 'bg-champagne-500 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-champagne-50 hover:text-champagne-600'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <Suspense fallback={null}>
        <SearchModal
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          products={allProducts}
          onSelectProduct={(id) => {
            const p = allProducts.find(x => x.id === id);
            onPageChange('product', { slug: p?.slug, id });
          }}
        />
      </Suspense>
    </header>
  );
}
