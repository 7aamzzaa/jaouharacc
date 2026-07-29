import { Star } from 'lucide-react';
import { useTranslation } from '../../i18n';
import type { Review } from '../../types';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const { t } = useTranslation();

  const fullStars = Math.floor(review.rating);
  const emptyStars = 5 - fullStars;

  const formattedDate = new Date(review.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="border border-champagne-150 rounded-lg p-5 space-y-3 bg-white">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-stone-800 font-sans">
          {review.customerName}
        </span>
        {review.customerEmail && (
          <span className="text-[10px] text-champagne-600 bg-champagne-50 px-2.5 py-0.5 rounded-full font-medium tracking-wide font-sans whitespace-nowrap">
            {t('reviewsPage.verifiedPurchase')}
          </span>
        )}
      </div>

      <div className="flex items-center gap-0.5">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            size={14}
            className="text-champagne-500 fill-champagne-500"
          />
        ))}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            size={14}
            className="text-stone-300"
          />
        ))}
      </div>

      {review.comment && (
        <p className="text-sm text-stone-600 leading-relaxed font-sans">
          {review.comment}
        </p>
      )}

      <p className="text-[10px] text-stone-400 font-sans">
        {formattedDate}
      </p>
    </div>
  );
}
