import React, { useState } from 'react';
import { Instagram, Facebook, Compass, Heart, ArrowRight } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="mt-24 border-t border-champagne-150 bg-stone-50">
      
      {/* 3-Column Luxury Signature Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 border-b border-champagne-150">
        
        {/* Value 01 */}
        <div className="border-b md:border-b-0 md:border-r border-champagne-150 p-8 md:p-12 flex flex-col justify-between space-y-4">
          <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-stone-900 block">
            01. Noble Material
          </span>
          <p className="text-xs text-stone-500 uppercase tracking-wider leading-relaxed">
            Sourced ethically, finished by hand with 18k solid gold plating and premium tarnish-free gemstones.
          </p>
        </div>

        {/* Value 02 */}
        <div className="border-b md:border-b-0 md:border-r border-champagne-150 p-8 md:p-12 flex flex-col justify-between space-y-4">
          <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-stone-900 block">
            02. Geneva Craftsmanship
          </span>
          <p className="text-xs text-stone-500 uppercase tracking-wider leading-relaxed">
            Every link is inspected for custom perfection in our heritage atelier located in Geneva.
          </p>
        </div>

        {/* Value 03: Newsletter Box */}
        <div className="p-8 md:p-12 flex flex-col justify-between bg-champagne-500 text-white min-h-[200px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold">
              03. Newsletter
            </span>
            <div className="w-5 h-5 border border-white flex items-center justify-center text-[10px] rounded-full">
              →
            </div>
          </div>

          <div className="mt-6">
            {subscribed ? (
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-widest font-bold">ACCESS GRANTED</p>
                <p className="text-[11px] text-white/80">Welcome to ccjaouhara's private inner circle.</p>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="border-b border-white/40 pb-1 flex items-center justify-between">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Join the Inner Circle"
                    className="bg-transparent text-white placeholder-white/60 text-xs uppercase tracking-widest focus:outline-hidden w-full"
                  />
                  <button type="submit" aria-label="Submit" className="cursor-pointer hover:text-white/70">
                    <ArrowRight size={14} />
                  </button>
                </div>
                <p className="text-[9px] text-white/70 uppercase tracking-widest">ccjaouhara's Exclusive Private Catalogs</p>
              </form>
            )}
          </div>
        </div>

      </div>

      {/* Main Footer Sitemap & Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-1">
            <span className="font-serif text-xl tracking-[0.25em] font-bold text-champagne-500 italic uppercase">
              ccjaouhara
            </span>
            <span className="text-[10px] tracking-widest text-stone-400 uppercase font-sans">
              fine jewelry • since 1984
            </span>
          </div>

          {/* Social icons */}
          <div className="flex space-x-6">
            <a href="#" className="text-stone-400 hover:text-champagne-500 transition-colors" aria-label="Instagram">
              <Instagram size={16} />
            </a>
            <a href="#" className="text-stone-400 hover:text-champagne-500 transition-colors" aria-label="Facebook">
              <Facebook size={16} />
            </a>
            <a href="#" className="text-stone-400 hover:text-champagne-500 transition-colors" aria-label="Pinterest">
              <Compass size={16} />
            </a>
          </div>

        </div>

        <div className="border-t border-champagne-150 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-stone-400 uppercase tracking-widest space-y-2 md:space-y-0">
          <p>© {new Date().getFullYear()} ccjaouhara fine jewelry. All lifetime warranty rights reserved.</p>
          <div className="flex items-center space-x-1">
            <span>Sourced Ethically</span>
            <Heart size={8} className="text-rose-400 fill-rose-400" />
            <span>Finished lovingly by hand</span>
          </div>
        </div>

      </div>

    </footer>
  );
}
