import { useState } from 'react';
import { Ruler, RotateCcw } from 'lucide-react';
import { useTranslation } from '../i18n';

const tabs = ['bracelet', 'ring', 'necklace', 'anklet'] as const;

export default function SizeGuide() {
  const { t, dir } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>('bracelet');
  const [unit, setUnit] = useState<'cm' | 'inches'>('cm');

  const tabData = t(`sizeGuide.${activeTab}`) as any;
  const tabLabels = t('sizeGuide.tabs') as unknown as string[];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">

      <div className="text-center space-y-4">
        <span className="text-xs tracking-[0.3em] font-medium uppercase text-champagne-500 block font-sans">
          {t('sizeGuide.label')}
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-stone-900 font-black tracking-tight">
          {t('sizeGuide.heading')}
        </h1>
        <p className="text-stone-500 text-sm sm:text-base leading-relaxed max-w-lg mx-auto font-sans">
          {t('sizeGuide.desc')}
        </p>
        <div className="w-16 h-[2px] bg-champagne-500 mx-auto rounded-full"></div>
      </div>

      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setUnit('cm')}
          className={`cursor-pointer px-4 py-2 text-[11px] uppercase tracking-widest font-bold rounded-lg transition-all font-sans ${
            unit === 'cm' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          CM
        </button>
        <button
          onClick={() => setUnit('inches')}
          className={`cursor-pointer px-4 py-2 text-[11px] uppercase tracking-widest font-bold rounded-lg transition-all font-sans ${
            unit === 'inches' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          Inches
        </button>
      </div>

      <div className="flex border-b border-champagne-150 overflow-x-auto" dir={dir}>
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer px-6 py-3.5 text-xs uppercase tracking-widest font-bold font-sans whitespace-nowrap transition-all border-b-2 ${
              activeTab === tab
                ? 'border-champagne-500 text-champagne-600'
                : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
            }`}
          >
            {tabLabels[i]}
          </button>
        ))}
      </div>

      <div className="bg-white border border-champagne-150 rounded-xl p-8 md:p-10 shadow-xs space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-champagne-600">
            <Ruler size={18} />
            <h2 className="font-serif text-lg font-bold text-stone-900">{tabData?.title}</h2>
          </div>
          <p className="text-sm text-stone-600 font-sans">{tabData?.intro}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-champagne-150">
                {tabData?.sizes?.[0] && Object.keys(tabData.sizes[0]).filter(k => k !== 'desc').map((key: string) => (
                  <th key={key} className="py-3 px-4 text-start text-[10px] uppercase tracking-widest font-bold text-stone-500">
                    {key === 'label' ? 'Size' : key === 'wrist' ? 'Wrist' : key === 'diameter' ? 'Diameter' : key === 'circumference' ? 'Circumference' : key === 'position' ? 'Position' : key === 'ankle' ? 'Ankle' : key}
                  </th>
                ))}
                <th className="py-3 px-4 text-start text-[10px] uppercase tracking-widest font-bold text-stone-500">Description</th>
              </tr>
            </thead>
            <tbody>
              {tabData?.sizes?.map((row: any, i: number) => (
                <tr key={i} className="border-b border-stone-100 last:border-0 hover:bg-champagne-50/30 transition-colors">
                  {Object.keys(row).filter(k => k !== 'desc').map((key: string) => (
                    <td key={key} className="py-3.5 px-4 text-stone-800 font-medium">
                      {row[key]}
                    </td>
                  ))}
                  <td className="py-3.5 px-4 text-stone-500 text-xs">{row.desc || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {tabData?.tip && (
          <div className="bg-champagne-50 border border-champagne-200 rounded-lg p-4 flex items-start gap-3">
            <RotateCcw size={16} className="shrink-0 text-champagne-500 mt-0.5" />
            <p className="text-xs text-stone-700 font-sans leading-relaxed">{tabData.tip}</p>
          </div>
        )}
      </div>

      <div className="text-center space-y-3">
        <p className="text-xs text-stone-400 font-sans">
          {t('sizeGuide.disclaimer') || 'Need help finding your size? Contact our support team.'}
        </p>
      </div>
    </div>
  );
}
