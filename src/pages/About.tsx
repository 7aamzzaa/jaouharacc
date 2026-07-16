import { Gem, Heart, Shield, Globe, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from '../i18n';
import { useNavigate } from 'react-router-dom';

const VALUE_ICONS: Record<string, typeof Gem> = { Gem, Heart, Shield, Globe };

export default function About() {
  const { t, dir } = useTranslation();
  const navigate = useNavigate();

  const values = t('about.values.items') as unknown as Array<{ icon: string; title: string; desc: string }>;
  const paragraphs = t('about.story.paragraphs') as unknown as string[];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-16">

      <div className="text-center space-y-4">
        <span className="text-xs tracking-[0.3em] font-medium uppercase text-champagne-500 block font-sans">
          {t('about.label')}
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-stone-900 font-black tracking-tight">
          {t('about.heading')}
        </h1>
        <p className="text-stone-500 text-sm sm:text-base leading-relaxed max-w-lg mx-auto font-sans">
          {t('about.desc')}
        </p>
        <div className="w-16 h-[2px] bg-champagne-500 mx-auto rounded-full"></div>
      </div>

      <div className="bg-white border border-champagne-150 rounded-xl p-8 md:p-10 shadow-xs text-center space-y-4">
        <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-bold">{t('about.hero.title')}</h2>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-sans">{t('about.hero.desc')}</p>
      </div>

      <div className="bg-champagne-50 border border-champagne-200 rounded-xl p-8 md:p-10 text-center space-y-4">
        <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-bold">{t('about.mission.title')}</h2>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-sans">{t('about.mission.desc')}</p>
      </div>

      <div className="space-y-6">
        <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-bold text-center">{t('about.values.title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {values.map((v, i) => {
            const Icon = VALUE_ICONS[v.icon] || Gem;
            return (
              <div key={i} className="bg-white border border-champagne-150 rounded-xl p-6 shadow-xs space-y-3 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-champagne-50 border border-champagne-100 rounded-lg flex items-center justify-center text-champagne-600">
                  <Icon size={18} />
                </div>
                <h3 className="font-serif text-base font-bold text-stone-900">{v.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed font-sans">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-champagne-150 rounded-xl p-8 md:p-10 shadow-xs space-y-6">
        <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-bold text-center">{t('about.story.title')}</h2>
        <div className="space-y-4 max-w-3xl mx-auto">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-sm text-stone-600 leading-relaxed font-sans">{p}</p>
          ))}
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => navigate('/shop')}
          className="cursor-pointer inline-flex items-center gap-2 py-3.5 px-8 text-xs uppercase tracking-widest font-bold text-white bg-stone-900 hover:bg-champagne-500 transition-all rounded-lg shadow-md font-sans"
        >
          {dir === 'ltr' ? <ArrowRight size={13} /> : <ArrowLeft size={13} />}
          {t('about.cta')}
        </button>
      </div>
    </div>
  );
}
