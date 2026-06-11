import { ShoppingBag, Menu, X, ShieldAlert, ChevronDown, CircleDot, Sparkles, Heart, Crown, Gem, Circle } from 'lucide-react';
import { useState } from 'react';
import { CartItem } from '../types';

interface NavbarProps {
  currentPage: string;
  onPageChange: (pageName: string, params?: any) => void;
  cart: CartItem[];
  onOpenCart: () => void;
  currency: 'USD' | 'MAD';
  onCurrencyToggle: () => void;
}

export default function Navbar({ currentPage, onPageChange, cart, onOpenCart, currency, onCurrencyToggle }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(false);
  
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const categories = [
    { id: 'bracelets', name: 'Bracelets', icon: CircleDot, desc: 'Bangles, cuffs, and classic chain links' },
    { id: 'rings', name: 'Rings', icon: Circle, desc: 'Solitaires, classic bands, and wedding stacks' },
    { id: 'earrings', name: 'Earrings', icon: Sparkles, desc: 'Solitaires, hoops, and chandelier wires' },
    { id: 'anklets', name: 'Anklets', icon: Heart, desc: 'Double-layered and delicate figaro links' },
    { id: 'necklaces', name: 'Necklaces', icon: Crown, desc: 'Royal crown-set pendants and chokers' },
    { id: 'jewelry_sets', name: 'Jewelry Sets', icon: Gem, desc: 'Artisanal heirloom collections and bridal sets' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-champagne-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-stone-700 hover:text-champagne-500 p-2 focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Luxury Brand Typography */}
          <div className="flex-1 flex md:flex-none justify-center md:justify-start">
            <button
              onClick={() => {
                onPageChange('home');
                setMobileMenuOpen(false);
              }}
              className="cursor-pointer group flex flex-col items-center sm:items-start focus:outline-hidden"
              id="brand-logo-btn"
            >
              <span className="font-serif text-2xl sm:text-3xl tracking-[0.3em] font-bold text-champagne-500 italic uppercase transition-all duration-300 group-hover:opacity-80">
                ccjaouhara
              </span>
              <span className="text-[8px] tracking-[0.4em] uppercase text-stone-400 font-sans -mt-0.5 font-semibold">
                fine jewelry
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
              Home
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
                Collections
                <ChevronDown size={11} className="transition-transform duration-300 group-hover:rotate-180" />
              </button>

              <div className="absolute top-full left-0 mt-0 pt-3 w-[280px] bg-white border border-champagne-150 rounded-lg shadow-xl z-50 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
                <div className="p-2 space-y-1">
                  {categories.map((cat) => {
                    const CatIcon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => onPageChange('shop', { filterCategory: cat.id })}
                        className="w-full text-left flex items-start gap-3 p-2.5 rounded-md hover:bg-champagne-50/50 transition-colors group"
                      >
                        <div className="mt-0.5 p-1.5 bg-champagne-50 border border-champagne-100 rounded-md text-champagne-500 group-hover:bg-champagne-500 group-hover:text-white transition-all">
                          <CatIcon size={14} />
                        </div>
                        <div>
                          <span className="font-serif text-xs font-semibold text-stone-800 block group-hover:text-champagne-600 transition-colors">
                            {cat.name}
                          </span>
                          <span className="text-[10px] text-stone-400 block mt-0.5">
                            {cat.desc}
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
                    Explore All Collections →
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
              Shop All
            </button>

            <button
              onClick={() => onPageChange('admin')}
              className={`cursor-pointer text-[11px] tracking-[0.25em] uppercase transition-colors duration-300 font-medium ${
                currentPage === 'admin'
                  ? 'text-champagne-500 border-b border-champagne-400 pb-1 font-semibold'
                  : 'text-stone-600 hover:text-champagne-500 pb-1'
              }`}
            >
              Admin Portal
            </button>
          </nav>

          {/* Cart triggers section */}
          <div className="flex items-center space-x-3">
            
            <button
              id="desktop-cart-trigger"
              onClick={onOpenCart}
              className="cursor-pointer relative p-2 text-stone-700 hover:text-champagne-500 transition-colors duration-300 focus:outline-hidden"
              aria-label="View shopping bag"
            >
              <ShoppingBag size={22} strokeWidth={1.5} />
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
            className={`block w-full text-left py-2.5 px-4 rounded-md text-sm tracking-widest uppercase font-medium ${
              currentPage === 'home'
                ? 'bg-luxe-pink-50 text-champagne-500 font-semibold'
                : 'text-stone-700 hover:bg-champagne-50/50 hover:text-champagne-500'
            }`}
          >
            Home
          </button>

          {/* Mobile Collapsible Collections */}
          <div className="space-y-1">
            <button
              onClick={() => setMobileCollectionsOpen(!mobileCollectionsOpen)}
              className="w-full flex justify-between items-center py-2.5 px-4 rounded-md text-sm tracking-widest uppercase font-medium text-stone-700 hover:bg-champagne-50/50 hover:text-champagne-500"
            >
              <span>Collections</span>
              <ChevronDown size={14} className={`transition-transform duration-300 ${mobileCollectionsOpen ? 'rotate-180 text-champagne-500' : ''}`} />
            </button>

            {mobileCollectionsOpen && (
              <div className="bg-stone-50/60 rounded-lg p-2 space-y-1 ml-4 border-l border-champagne-150">
                {categories.map((cat) => {
                  const CatIcon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onPageChange('shop', { filterCategory: cat.id });
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-3 py-2 px-3 hover:bg-champagne-50/50 rounded-md group"
                    >
                      <span className="text-champagne-500">
                        <CatIcon size={12} />
                      </span>
                      <span className="font-serif text-xs font-semibold text-stone-800">
                        {cat.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              onPageChange('shop');
              setMobileMenuOpen(false);
            }}
            className={`block w-full text-left py-2.5 px-4 rounded-md text-sm tracking-widest uppercase font-medium ${
              currentPage === 'shop'
                ? 'bg-luxe-pink-50 text-champagne-500 font-semibold'
                : 'text-stone-700 hover:bg-champagne-50/50'
            }`}
          >
            Shop All
          </button>

          <button
            onClick={() => {
              onPageChange('admin');
              setMobileMenuOpen(false);
            }}
            className={`block w-full text-left py-2.5 px-4 rounded-md text-sm tracking-widest uppercase font-medium ${
              currentPage === 'admin'
                ? 'bg-luxe-pink-50 text-champagne-500 font-semibold'
                : 'text-stone-700 hover:bg-champagne-50/50'
            }`}
          >
            Admin Portal
          </button>
        </div>
      )}
    </header>
  );
}
