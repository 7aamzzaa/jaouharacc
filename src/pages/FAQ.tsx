import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { useTranslation } from '../i18n';

export default function FAQ() {
  const navigate = useNavigate();
  const { t, dir } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [search, setSearch] = useState('');

  const items = t('faq.items') as Array<{ q: string; a: string }>;
  const filtered = items.filter(item =>
    item.q.toLowerCase().includes(search.toLowerCase()) ||
    item.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">

      <div className="text-center space-y-4">
        <span className="text-xs tracking-[0.3em] font-medium uppercase text-champagne-500 block font-sans">
          {t('faq.label')}
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-stone-900 font-black tracking-tight">
          {t('faq.heading')}
        </h1>
        <p className="text-stone-500 text-sm sm:text-base leading-relaxed max-w-lg mx-auto font-sans">
          {t('faq.desc')}
        </p>
        <div className="w-16 h-[2px] bg-champagne-500 mx-auto rounded-full"></div>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t('faq.searchPlaceholder') || 'Search questions...'}
          className="w-full pl-11 pr-4 py-3.5 bg-white border border-champagne-150 rounded-xl text-sm text-stone-800 focus:outline-hidden focus:border-champagne-400 focus:ring-1 focus:ring-champagne-300 transition-all font-sans"
        />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-stone-400 text-sm font-sans">{t('faq.noResults') || 'No matching questions found.'}</p>
            <button
              onClick={() => setSearch('')}
              className="mt-2 text-xs text-champagne-600 hover:text-champagne-700 underline font-sans"
            >
              {t('faq.clearSearch') || 'Clear search'}
            </button>
          </div>
        ) : (
          filtered.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-champagne-150 rounded-xl overflow-hidden shadow-xs transition-all duration-200 hover:shadow-md"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between px-6 py-5 text-start cursor-pointer hover:bg-champagne-50/50 transition-colors"
              >
                <span className="font-serif text-sm sm:text-base font-semibold text-stone-900 pr-4">
                  {item.q}
                </span>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-stone-400 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180 text-champagne-500' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-5 border-t border-champagne-100">
                  <p className="pt-4 text-sm text-stone-600 leading-relaxed font-sans">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="text-center">
        <button
          onClick={() => navigate('/contact')}
          className="cursor-pointer inline-flex items-center gap-2 py-3.5 px-8 text-xs uppercase tracking-widest font-bold text-white bg-stone-900 hover:bg-champagne-500 transition-all rounded-lg shadow-md font-sans"
        >
          {dir === 'ltr' ? <ArrowRight size={13} /> : <ArrowLeft size={13} />}
          {t('faq.contactCta') || 'Contact Us'}
        </button>
      </div>
    </div>
  );
}
