import { useState, FormEvent } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { useTranslation } from '../../i18n';

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export default function ReviewForm({ productId, onSuccess, onError }: ReviewFormProps) {
  const { t } = useTranslation();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting || submitted) return;

    if (!customerName.trim()) return;
    if (rating < 1 || rating > 5) return;
    if (!comment.trim()) return;

    if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      onError?.('Invalid email format');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim() || undefined,
          rating,
          comment: comment.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit review');
      }

      setSubmitted(true);
      setCustomerName('');
      setCustomerEmail('');
      setRating(0);
      setComment('');
      onSuccess?.();
    } catch (err: any) {
      onError?.(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-champagne-50 border border-champagne-200 rounded-lg p-6 text-center space-y-2">
        <p className="text-sm font-semibold text-stone-800 font-sans">
          {t('reviewsPage.successMessage')}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="block text-[10px] tracking-widest uppercase font-bold text-stone-600 font-sans">
          {t('reviewsPage.ratingLabel')}
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star === rating ? 0 : star)}
              className="p-0.5 transition-colors"
            >
              <Star
                size={20}
                className={
                  star <= (hoverRating || rating)
                    ? 'text-champagne-500 fill-champagne-500'
                    : 'text-stone-300'
                }
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-[10px] tracking-widest uppercase font-bold text-stone-600 font-sans">
          {t('reviewsPage.commentLabel')}
        </label>
        <textarea
          required
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 bg-stone-50 border border-champagne-150 rounded-lg text-xs text-stone-800 focus:outline-hidden focus:border-champagne-400 focus:bg-white transition-all font-sans resize-none"
          placeholder={t('reviewsPage.commentPlaceholder')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-[10px] tracking-widest uppercase font-bold text-stone-600 font-sans">
            {t('contact.fullName')}
          </label>
          <input
            type="text"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-4 py-3 bg-stone-50 border border-champagne-150 rounded-lg text-xs text-stone-800 focus:outline-hidden focus:border-champagne-400 focus:bg-white transition-all font-sans"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[10px] tracking-widest uppercase font-bold text-stone-600 font-sans">
            {t('contact.email')}
          </label>
          <input
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            className="w-full px-4 py-3 bg-stone-50 border border-champagne-150 rounded-lg text-xs text-stone-800 focus:outline-hidden focus:border-champagne-400 focus:bg-white transition-all font-sans"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting || rating === 0}
        className="w-full py-3 bg-stone-900 text-white text-xs font-bold tracking-widest uppercase rounded-lg hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-sans flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            {t('contact.sending')}
          </>
        ) : (
          t('reviewsPage.submitReview')
        )}
      </button>
    </form>
  );
}
