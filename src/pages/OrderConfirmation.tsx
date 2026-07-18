import { useEffect, useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useTranslation } from '../i18n';

interface OrderConfirmationProps {
  onPageChange: (pageName: string, params?: any) => void;
  currency: 'USD' | 'MAD';
}

export default function OrderConfirmation({ onPageChange, currency }: OrderConfirmationProps) {
  const { t } = useTranslation();
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('orderId') || '';

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const estimatedDelivery = t('orderConfirmation.estimatedDelivery');

  useEffect(() => {
    document.title = t('orderConfirmation.seoTitle');
    if (!orderId) {
      setError(t('orderConfirmation.missingId'));
      setLoading(false);
      return;
    }
    fetch(`/api/orders/${orderId}`)
      .then(res => {
        if (!res.ok) throw new Error('Order not found');
        return res.json();
      })
      .then(data => {
        setOrder(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <Loader2 size={40} className="animate-spin text-champagne-500 mx-auto" />
          <p className="text-stone-400 text-sm">{t('orderConfirmation.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center text-rose-500 mx-auto">
            <span className="text-2xl font-serif">!</span>
          </div>
          <p className="text-stone-500 text-sm">{error || t('orderConfirmation.error')}</p>
          <button onClick={() => onPageChange('shop')} className="bg-stone-900 hover:bg-champagne-600 text-white text-xs uppercase tracking-widest px-8 py-4 font-semibold transition-colors cursor-pointer">
            {t('orderConfirmation.continueShopping')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full mx-auto text-center space-y-8 animate-fade-in">

        {/* Success Icon */}
        <div className="w-20 h-20 bg-emerald-50 border-2 border-emerald-200 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
          <CheckCircle size={44} strokeWidth={1.5} />
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-semibold tracking-wide">
          {t('orderConfirmation.heading')}
        </h1>

        {/* Message */}
        <p className="text-stone-600 text-sm leading-relaxed max-w-sm mx-auto">
          {t('orderConfirmation.message')}
        </p>

        {/* Order ID */}
        <div className="bg-white border border-champagne-100 rounded-lg p-6 space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold block">
            {t('orderConfirmation.orderId')}
          </span>
          <span className="font-mono text-sm font-bold text-stone-900 tracking-wide">
            {order.id}
          </span>
        </div>

        {/* Estimated Delivery */}
        <div className="bg-champagne-50/50 border border-champagne-100 rounded-lg p-5 space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold block">
            {t('orderConfirmation.estimatedDeliveryLabel')}
          </span>
          <p className="text-stone-700 text-sm font-medium">
            {estimatedDelivery}
          </p>
        </div>

        {/* Continue Shopping Button */}
        <button
          onClick={() => onPageChange('shop')}
          className="cursor-pointer w-full sm:w-auto bg-stone-900 hover:bg-champagne-600 text-white font-sans tracking-widest text-xs uppercase font-medium px-12 py-4 transition-colors duration-300"
        >
          {t('orderConfirmation.continueShopping')}
        </button>

      </div>
    </div>
  );
}
