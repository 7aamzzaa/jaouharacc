import React, { useState } from 'react';
import { Instagram, Facebook, Compass, Heart, ArrowRight, ChevronRight } from 'lucide-react';
import { useTranslation } from '../i18n';

const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/ccjaouhara/',
  facebook: 'https://www.facebook.com/ccjaouhara/',
  pinterest: 'https://www.pinterest.com/ccjaouhara/',
};

const PAYMENT_METHODS = [
  'Visa', 'Mastercard', 'Cash on Delivery', 'Bank Transfer',
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { t, dir } = useTranslation();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const linkColumns = [
    {
      title: t('footer.links.shop.title'),
      items: [
        { label: t('footer.links.shop.necklaces'), href: '/shop?category=necklaces' },
        { label: t('footer.links.shop.bracelets'), href: '/shop?category=bracelets' },
        { label: t('footer.links.shop.rings'), href: '/shop?category=rings' },
        { label: t('footer.links.shop.earrings'), href: '/shop?category=earrings' },
        { label: t('footer.links.shop.sets'), href: '/shop?category=sets' },
      ],
    },
    {
      title: t('footer.links.support.title'),
      items: [
        { label: t('footer.links.support.faq'), href: '/faq' },
        { label: t('footer.links.support.shipping'), href: '/shipping' },
        { label: t('footer.links.support.sizeGuide'), href: '/size-guide' },
        { label: t('footer.links.support.contact'), href: '/contact' },
        { label: t('footer.links.support.track'), href: '/track-order' },
      ],
    },
    {
      title: t('footer.links.about.title'),
      items: [
        { label: t('footer.links.about.story'), href: '/about' },
        { label: t('footer.links.about.blog'), href: '/blog' },
        { label: t('footer.links.about.press'), href: '/press' },
      ],
    },
  ];

  return (
    <footer className="mt-24 border-t border-champagne-150 bg-stone-50">

      {/* 3-Column Luxury Signature Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 border-b border-champagne-150">

        {/* Value 01 */}
        <div className="border-b md:border-b-0 md:border-r border-champagne-150 p-8 md:p-12 flex flex-col justify-between space-y-4 group hover:bg-white/60 transition-colors duration-300">
          <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-stone-900 block">
            {t('footer.column1.title')}
          </span>
          <p className="text-xs text-stone-500 uppercase tracking-wider leading-relaxed">
            {t('footer.column1.desc')}
          </p>
        </div>

        {/* Value 02 */}
        <div className="border-b md:border-b-0 md:border-r border-champagne-150 p-8 md:p-12 flex flex-col justify-between space-y-4 group hover:bg-white/60 transition-colors duration-300">
          <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-stone-900 block">
            {t('footer.column2.title')}
          </span>
          <p className="text-xs text-stone-500 uppercase tracking-wider leading-relaxed">
            {t('footer.column2.desc')}
          </p>
        </div>

        {/* Value 03: Newsletter Box */}
        <div className="p-8 md:p-12 flex flex-col justify-between bg-champagne-500 text-white min-h-[200px] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-champagne-400/20 to-transparent pointer-events-none"></div>
          <div className="relative z-10 flex justify-between items-start">
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold">
              {t('footer.newsletter.title')}
            </span>
            <div className="w-5 h-5 border border-white/60 flex items-center justify-center text-[10px] rounded-full transition-transform duration-300 group-hover:rotate-45">
              →
            </div>
          </div>

          <div className="relative z-10 mt-6">
            {subscribed ? (
              <div className="space-y-1 animate-fade-slide-up">
                <p className="text-xs uppercase tracking-widest font-bold">{t('footer.newsletter.subscribed')}</p>
                <p className="text-[11px] text-white/80">{t('footer.newsletter.welcome')}</p>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="border-b border-white/40 pb-1 flex items-center justify-between group">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('footer.newsletter.placeholder')}
                    className="bg-transparent text-white placeholder-white/60 text-xs uppercase tracking-widest focus:outline-hidden w-full group-focus-within:border-white transition-all"
                  />
                  <button type="submit" aria-label="Submit" className="cursor-pointer text-white/70 hover:text-white transition-colors">
                    <ArrowRight size={14} />
                  </button>
                </div>
                <p className="text-[9px] text-white/70 uppercase tracking-widest">{t('footer.newsletter.note')}</p>
              </form>
            )}
          </div>
        </div>

      </div>

      {/* Link Columns Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8" dir={dir}>

          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 flex flex-col space-y-4">
            <span className="font-serif text-xl tracking-[0.25em] font-bold text-champagne-500 italic uppercase">
              {t('footer.brand')}
            </span>
            <p className="text-[10px] tracking-widest text-stone-400 uppercase font-sans">
              {t('footer.tagline')}
            </p>
            <div className="flex space-x-4 pt-2">
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-champagne-500 transition-all duration-300 hover:-translate-y-0.5" aria-label={t('footer.instagram')}>
                <Instagram size={16} />
              </a>
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-champagne-500 transition-all duration-300 hover:-translate-y-0.5" aria-label={t('footer.facebook')}>
                <Facebook size={16} />
              </a>
              <a href={SOCIAL_LINKS.pinterest} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-champagne-500 transition-all duration-300 hover:-translate-y-0.5" aria-label={t('footer.pinterest')}>
                <Compass size={16} />
              </a>
            </div>
          </div>

          {/* Dynamic Link Columns */}
          {linkColumns.map((col) => (
            <div key={col.title} className="flex flex-col space-y-3">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-stone-900">
                {col.title}
              </span>
              <ul className="space-y-2">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-xs text-stone-500 hover:text-champagne-500 transition-colors duration-200 inline-flex items-center gap-1"
                    >
                      <ChevronRight size={8} className="text-stone-300" />
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>
      </div>

      {/* Payment Methods & Copyright */}
      <div className="border-t border-champagne-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3 text-[10px] text-stone-400 uppercase tracking-widest">
              <span>{t('footer.payment')}</span>
              <span className="flex items-center gap-2">
                {PAYMENT_METHODS.map((method) => (
                  <span key={method} className="bg-stone-100 px-2 py-1 rounded text-[9px] font-medium text-stone-500">
                    {method}
                  </span>
                ))}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-[10px] text-stone-400 uppercase tracking-widest">
              <span>{t('footer.sourced')}</span>
              <Heart size={8} className="text-rose-400 fill-rose-400" />
              <span>{t('footer.finished')}</span>
            </div>
          </div>
          <p className="text-center md:text-left text-[10px] text-stone-400 uppercase tracking-widest mt-3">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>

    </footer>
  );
}
