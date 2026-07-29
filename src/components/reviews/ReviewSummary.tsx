import { Star } from 'lucide-react';
import { useTranslation } from '../../i18n';

interface ReviewSummaryProps {
  averageRating: number;
  totalReviews: number;
}

export default function ReviewSummary({ averageRating, totalReviews }: ReviewSummaryProps) {
  const { t } = useTranslation();

  const fullStars = Math.floor(averageRating);
  const hasHalf = averageRating - fullStars >= 0.25;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <span className="text-3xl font-bold text-stone-900 font-sans leading-none">
          {averageRating.toFixed(1)}
        </span>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: fullStars }).map((_, i) => (
            <Star
              key={`full-${i}`}
              size={16}
              className="text-champagne-500 fill-champagne-500"
            />
          ))}
          {hasHalf && (
            <div className="relative" style={{ width: 16, height: 16 }}>
              <Star size={16} className="absolute inset-0 text-stone-300" />
              <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                <Star size={16} className="text-stone-300 fill-champagne-500" />
              </div>
            </div>
          )}
          {Array.from({ length: emptyStars }).map((_, i) => (
            <Star
              key={`empty-${i}`}
              size={16}
              className="text-stone-300"
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-stone-500 font-sans">
        {t('reviewsPage.totalReviews', { count: totalReviews })}
      </p>
    </div>
  );
}
