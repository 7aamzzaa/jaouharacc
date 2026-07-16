import { Truck, RotateCcw, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from '../i18n';
import { useNavigate } from 'react-router-dom';

const ICON_MAP: Record<string, typeof Truck> = { Truck, RotateCcw, AlertCircle };

export default function Shipping() {
  const { t, dir } = useTranslation();
  const navigate = useNavigate();

  const sections = t('shipping.sections') as unknown as Array<{
    title: string;
    icon: string;
    items: Array<{ q: string; a: string }>;
  }>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">

      <div className="text-center space-y-4">
        <span className="text-xs tracking-[0.3em] font-medium uppercase text-champagne-500 block font-sans">
          {t('shipping.label')}
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-stone-900 font-black tracking-tight">
          {t('shipping.heading')}
        </h1>
        <p className="text-stone-500 text-sm sm:text-base leading-relaxed max-w-lg mx-auto font-sans">
          {t('shipping.desc')}
        </p>
        <div className="w-16 h-[2px] bg-champagne-500 mx-auto rounded-full"></div>
      </div>

      <div className="space-y-8">
        {sections.map((section, i) => {
          const Icon = ICON_MAP[section.icon] || Truck;
          return (
            <div key={i} className="bg-white border border-champagne-150 rounded-xl p-8 md:p-10 shadow-xs space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-champagne-50 border border-champagne-100 rounded-lg flex items-center justify-center text-champagne-600 shrink-0">
                  <Icon size={18} />
                </div>
                <h2 className="font-serif text-lg font-bold text-stone-900">{section.title}</h2>
              </div>
              <div className="space-y-4">
                {section.items.map((item, j) => (
                  <div key={j} className="border-b border-stone-100 last:border-0 pb-4 last:pb-0">
                    <h3 className="text-sm font-bold text-stone-800 font-sans mb-1.5">{item.q}</h3>
                    <p className="text-sm text-stone-600 leading-relaxed font-sans">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-champagne-50 border border-champagne-200 rounded-xl p-8 text-center space-y-4">
        <p className="text-sm text-stone-700 font-sans">{t('shipping.disclaimer')}</p>
        <button
          onClick={() => navigate('/contact')}
          className="cursor-pointer inline-flex items-center gap-2 py-3 px-8 text-xs uppercase tracking-widest font-bold text-white bg-stone-900 hover:bg-champagne-500 transition-all rounded-lg shadow-sm font-sans"
        >
          {dir === 'ltr' ? <ArrowRight size={13} /> : <ArrowLeft size={13} />}
          {t('shipping.cta')}
        </button>
      </div>
    </div>
  );
}
