import React, { useState } from 'react';
import { Instagram, Facebook, Compass, Heart, ArrowRight } from 'lucide-react';
import { useTranslation } from '../i18n';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { t } = useTranslation();

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
            {t('footer.column1.title')}
          </span>
          <p className="text-xs text-stone-500 uppercase tracking-wider leading-relaxed">
            {t('footer.column1.desc')}
          </p>
        </div>

        {/* Value 02 */}
        <div className="border-b md:border-b-0 md:border-r border-champagne-150 p-8 md:p-12 flex flex-col justify-between space-y-4">
          <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-stone-900 block">
            {t('footer.column2.title')}
          </span>
          <p className="text-xs text-stone-500 uppercase tracking-wider leading-relaxed">
            {t('footer.column2.desc')}
          </p>
        </div>

        {/* Value 03: Newsletter Box */}
        <div className="p-8 md:p-12 flex flex-col justify-between bg-champagne-500 text-white min-h-[200px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold">
              {t('footer.newsletter.title')}
            </span>
            <div className="w-5 h-5 border border-white flex items-center justify-center text-[10px] rounded-full">
              →
            </div>
          </div>

          <div className="mt-6">
            {subscribed ? (
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-widest font-bold">{t('footer.newsletter.subscribed')}</p>
                <p className="text-[11px] text-white/80">{t('footer.newsletter.welcome')}</p>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="border-b border-white/40 pb-1 flex items-center justify-between">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('footer.newsletter.placeholder')}
                    className="bg-transparent text-white placeholder-white/60 text-xs uppercase tracking-widest focus:outline-hidden w-full"
                  />
                  <button type="submit" aria-label="Submit" className="cursor-pointer hover:text-white/70">
                    <ArrowRight size={14} />
                  </button>
                </div>
                <p className="text-[9px] text-white/70 uppercase tracking-widest">{t('footer.newsletter.note')}</p>
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
              {t('footer.brand')}
            </span>
            <span className="text-[10px] tracking-widest text-stone-400 uppercase font-sans">
              {t('footer.tagline')}
            </span>
          </div>

          {/* Social icons */}
          <div className="flex space-x-6">
            <a href="#" className="text-stone-400 hover:text-champagne-500 transition-colors" aria-label={t('footer.instagram')}>
              <Instagram size={16} />
            </a>
            <a href="#" className="text-stone-400 hover:text-champagne-500 transition-colors" aria-label={t('footer.facebook')}>
              <Facebook size={16} />
            </a>
            <a href="#" className="text-stone-400 hover:text-champagne-500 transition-colors" aria-label={t('footer.pinterest')}>
              <Compass size={16} />
            </a>
          </div>

        </div>

        <div className="border-t border-champagne-150 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-stone-400 uppercase tracking-widest space-y-2 md:space-y-0">
          <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
          <div className="flex items-center space-x-1">
            <span>{t('footer.sourced')}</span>
            <Heart size={8} className="text-rose-400 fill-rose-400" />
            <span>{t('footer.finished')}</span>
          </div>
        </div>

      </div>

    </footer>
  );
}
