import { Star, StarHalf } from 'lucide-react';

interface ProductRatingProps {
  rating?: unknown;
  reviewsCount?: unknown;
  size?: number;
  compact?: boolean;
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export default function ProductRating({
  rating,
  reviewsCount,
  size = 12,
  compact = false,
}: ProductRatingProps) {
  const rawRating = toFiniteNumber(rating);
  const hasRating = rawRating !== null && rawRating > 0 && rawRating <= 5;
  const safeRating = hasRating ? Math.min(5, Math.max(0, rawRating ?? 0)) : 0;
  const fullStars = hasRating ? Math.floor(safeRating) : 0;
  const hasHalf = hasRating && safeRating - fullStars >= 0.25;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
  const starSize = compact ? 10 : size;

  const rawReviews = toFiniteNumber(reviewsCount);
  const hasReviews = rawReviews !== null && Number.isInteger(rawReviews) && rawReviews > 0;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            size={starSize}
            className="text-champagne-500 fill-champagne-500"
          />
        ))}
        {hasHalf && (
          <div className="relative" style={{ width: starSize, height: starSize }}>
            <Star size={starSize} className="absolute inset-0 text-stone-300" />
            <StarHalf size={starSize} className="absolute inset-0 text-stone-300 fill-champagne-500" />
          </div>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            size={starSize}
            className="text-stone-300"
          />
        ))}
      </div>
      <span className={`font-medium ${compact ? 'text-[10px] text-stone-500' : 'text-xs text-stone-600'}`}>
        {hasRating ? safeRating.toFixed(1) : '—'}
      </span>
      {!compact && hasReviews && (
        <>
          <span className="text-[10px] text-stone-400 leading-none">|</span>
          <span className="text-[10px] text-stone-400">{rawReviews} Verified Reviews</span>
        </>
      )}
    </div>
  );
}
