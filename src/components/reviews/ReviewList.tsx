import { useState } from 'react';
import { useTranslation } from '../../i18n';
import type { Review } from '../../types';
import ReviewCard from './ReviewCard';

interface ReviewListProps {
  reviews: Review[];
}

const INITIAL_DISPLAY_COUNT = 3;

export default function ReviewList({ reviews }: ReviewListProps) {
  const { t } = useTranslation();
  const [showCount, setShowCount] = useState(INITIAL_DISPLAY_COUNT);

  if (reviews.length === 0) {
    return (
      <div className="text-center py-10 space-y-2">
        <p className="text-stone-500 text-sm font-sans">
          {t('reviewsPage.noReviews')}
        </p>
      </div>
    );
  }

  const displayed = reviews.slice(0, showCount);
  const hasMore = showCount < reviews.length;

  return (
    <div className="space-y-4">
      {displayed.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
      {hasMore && (
        <button
          type="button"
          onClick={() => setShowCount((c) => c + INITIAL_DISPLAY_COUNT)}
          className="text-xs font-medium text-champagne-600 hover:text-champagne-700 transition-colors font-sans"
        >
            {t('reviewsPage.showMore')}
        </button>
      )}
    </div>
  );
}
