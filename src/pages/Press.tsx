import { ArrowRight, ArrowLeft, ExternalLink } from 'lucide-react';
import { useTranslation } from '../i18n';
import { useNavigate } from 'react-router-dom';

export default function Press() {
  const { t, dir } = useTranslation();
  const navigate = useNavigate();

  const items = t('press.items') as unknown as Array<{ outlet: string; title: string; excerpt: string; url: string; date: string }>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">

      <div className="text-center space-y-4">
        <span className="text-xs tracking-[0.3em] font-medium uppercase text-champagne-500 block font-sans">
          {t('press.label')}
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-stone-900 font-black tracking-tight">
          {t('press.heading')}
        </h1>
        <p className="text-stone-500 text-sm sm:text-base leading-relaxed max-w-lg mx-auto font-sans">
          {t('press.desc')}
        </p>
        <div className="w-16 h-[2px] bg-champagne-500 mx-auto rounded-full"></div>
      </div>

      <div className="space-y-5">
        {items.map((item, i) => (
          <a
            key={i}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white border border-champagne-150 rounded-xl p-6 md:p-8 shadow-xs hover:shadow-md hover:border-champagne-300 transition-all group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-champagne-600 bg-champagne-50 px-2.5 py-1 rounded font-sans">
                    {item.outlet}
                  </span>
                  <span className="text-[10px] text-stone-400 font-sans">{item.date}</span>
                </div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 group-hover:text-champagne-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed font-sans">{item.excerpt}</p>
              </div>
              <ExternalLink size={16} className="shrink-0 text-stone-300 group-hover:text-champagne-500 transition-colors mt-1" />
            </div>
          </a>
        ))}
      </div>

      <div className="bg-champagne-50 border border-champagne-200 rounded-xl p-8 text-center space-y-4">
        <p className="text-sm text-stone-700 font-sans">{t('press.contact')}</p>
        <button
          onClick={() => navigate('/contact')}
          className="cursor-pointer inline-flex items-center gap-2 py-3 px-8 text-xs uppercase tracking-widest font-bold text-white bg-stone-900 hover:bg-champagne-500 transition-all rounded-lg shadow-sm font-sans"
        >
          {dir === 'ltr' ? <ArrowRight size={13} /> : <ArrowLeft size={13} />}
          {t('press.cta')}
        </button>
      </div>
    </div>
  );
}
