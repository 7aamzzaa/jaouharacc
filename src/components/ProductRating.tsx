import { Star, StarHalf } from 'lucide-react';

interface ProductRatingProps {
  rating: number;
  reviewsCount: number;
  size?: number;
  compact?: boolean;
}

export default function ProductRating({
  rating,
  reviewsCount,
  size = 12,
  compact = false,
}: ProductRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.25;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
  const starSize = compact ? 10 : size;

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
      <span className={`font-medium ${compact ? 'text-[10px] text-stone-500' : 'text-xs text-stone-600'}`}>{rating.toFixed(1)}</span>
      {!compact && (
        <>
          <span className="text-[10px] text-stone-400 leading-none">|</span>
          <span className="text-[10px] text-stone-400">{reviewsCount} Verified Reviews</span>
        </>
      )}
    </div>
  );
}
