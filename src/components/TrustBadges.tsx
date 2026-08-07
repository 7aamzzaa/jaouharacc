import { ShieldCheck, Truck, Lock, RefreshCcw } from 'lucide-react';
import { useTranslation } from '../i18n';

const BADGES = ['quality', 'delivery', 'returns', 'checkout'] as const;
const ICONS = { quality: ShieldCheck, delivery: Truck, checkout: Lock, returns: RefreshCcw } as const;

export default function TrustBadges() {
  const { t } = useTranslation();

  return (
    <div
      className="grid grid-cols-4 divide-x divide-[#EFEAE4] border border-stone-200 rounded-lg bg-white overflow-hidden"
      style={{ animation: 'trustFadeIn 0.5s ease-out forwards' }}
    >
      {BADGES.map((key) => {
        const Icon = ICONS[key];
        return (
          <div key={key} className="flex flex-col items-center justify-center gap-1.5 lg:gap-3 px-1 py-3 lg:py-6 text-center">
            <Icon size={20} strokeWidth={1.5} aria-hidden="true" className="text-champagne-500 shrink-0 w-5 h-5 lg:w-9 lg:h-9" />
            <span className="font-sans font-semibold text-[11px] leading-snug lg:text-base text-stone-800 text-center line-clamp-2">
              {t(`trust.${key}`)}
            </span>
          </div>
        );
      })}
      <style>{`
        @keyframes trustFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
