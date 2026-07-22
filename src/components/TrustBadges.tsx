import { ShieldCheck, Truck, Lock, RefreshCcw } from 'lucide-react';
import { useTranslation } from '../i18n';

const BADGES = ['quality', 'delivery', 'checkout', 'returns'] as const;
const ICONS = { quality: ShieldCheck, delivery: Truck, checkout: Lock, returns: RefreshCcw } as const;

export default function TrustBadges() {
  const { t } = useTranslation();

  return (
    <div className="border border-stone-200 rounded-lg p-4 space-y-3" style={{ animation: 'trustFadeIn 0.5s ease-out forwards' }}>
      {BADGES.map((key) => {
        const Icon = ICONS[key];
        return (
          <div key={key} className="flex items-center gap-3">
            <Icon size={16} className="text-champagne-500 flex-shrink-0" />
            <span className="text-xs text-stone-600 font-sans font-medium">{t(`trust.${key}`)}</span>
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
