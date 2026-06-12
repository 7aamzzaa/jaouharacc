import { useTranslation } from '../i18n';
import { Compass, HelpCircle } from 'lucide-react';

interface NotFoundProps {
  onPageChange: (pageName: string) => void;
}

export default function NotFound({ onPageChange }: NotFoundProps) {
  const { t } = useTranslation();
  return (
    <div className="max-w-md mx-auto text-center py-24 sm:py-32 px-6 flex flex-col items-center justify-center space-y-6 animate-fade-in">
      
      {/* Dynamic graphic indicator */}
      <div className="w-20 h-20 bg-champagne-50 border border-champagne-150 rounded-full flex items-center justify-center text-champagne-500 relative">
        <Compass size={32} className="animate-[spin_60s_linear_infinite]" strokeWidth={1.2} />
        <HelpCircle size={14} className="absolute top-2 right-2 text-champagne-400 bg-white rounded-full p-0.5" />
      </div>

      <div className="space-y-2">
        <span className="text-[10px] tracking-[0.3em] font-medium uppercase text-champagne-500 font-sans block">
          {t('notFound.label')}
        </span>
        <h1 className="font-serif text-3xl text-stone-900 font-semibold tracking-wide">
          {t('notFound.heading')}
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto">
          {t('notFound.desc')}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs pt-4">
        <button
          onClick={() => onPageChange('home')}
          className="cursor-pointer bg-stone-900 hover:bg-champagne-500 text-white text-xs uppercase tracking-widest py-3.5 font-semibold transition-colors font-medium flex-1 rounded-sm"
        >
          {t('notFound.atelier')}
        </button>
        <button
          onClick={() => onPageChange('shop')}
          className="cursor-pointer bg-white hover:bg-stone-50 border border-stone-250 text-stone-700 text-xs uppercase tracking-widest py-3.5 font-semibold transition-colors font-medium flex-1 rounded-sm"
        >
          {t('notFound.explore')}
        </button>
      </div>

    </div>
  );
}
