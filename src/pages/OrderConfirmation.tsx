import { useEffect, useState, useRef } from 'react';
import { CheckCircle, Printer, Star, Heart, Loader2 } from 'lucide-react';
import { showToast } from '../components/ToastContainer';
import { useTranslation } from '../i18n';

interface OrderConfirmationProps {
  onPageChange: (pageName: string, params?: any) => void;
  currency: 'USD' | 'MAD';
}

export default function OrderConfirmation({ onPageChange, currency }: OrderConfirmationProps) {
  const formatPrice = (priceUSD: number) => {
    if (currency === 'MAD') {
      return `${(priceUSD * 10).toLocaleString()} درهم`;
    }
    return `$${priceUSD.toLocaleString()}`;
  };
  const { t } = useTranslation();
  // Extract details from Query Param string or direct router params
  const urlParams = new URLSearchParams(window.location.search);
  
  // Look both in URL query search string OR in state of the custom router
  const orderId = urlParams.get('orderId') || 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  const name = urlParams.get('name') || t('orderConfirmation.defaultName');
  const email = urlParams.get('email') || t('orderConfirmation.defaultEmail');
  const total = parseFloat(urlParams.get('total') || '295');
  
  // Parse items safely
  let items: any[] = [];
  try {
    const itemsRaw = urlParams.get('items');
    if (itemsRaw) {
      items = JSON.parse(decodeURIComponent(itemsRaw));
    }
  } catch (err) {
    console.error('Failed to parse items list from query checkout confirmation', err);
  }

  // Fallback items array if empty
  if (items.length === 0) {
    items = [
      { name: "ccjaouhara Classic 14k Gold Chain", selected_size: "Medium (7.0\")", price: 295, quantity: 1, image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=300" }
    ];
  }

  const [isSyncing, setIsSyncing] = useState(true);
  const syncInitiated = useRef(false);

  useEffect(() => {
    // Dynamically update document title for SEO on page mount
    document.title = t('orderConfirmation.seoTitle');

    if (syncInitiated.current) return;
    syncInitiated.current = true;

    async function persistOrder() {
      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: orderId,
            customer_name: name,
            customer_email: email,
            items: items,
            total: total,
            status: 'completed'
          })
        });

        if (!res.ok) {
          throw new Error(t('orderConfirmation.saveError'));
        }
        
        showToast(t('orderConfirmation.successToast'), false);
      } catch (err: any) {
        console.error('[Supabase Save Error]', err);
        showToast(t('orderConfirmation.errorToast'), true);
      } finally {
        setIsSyncing(false);
      }
    }

    persistOrder();
  }, [orderId, name, email, total, items]);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in py-6">
      
      {/* Celebration Greeting Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full mb-2">
          {isSyncing ? (
            <Loader2 size={36} className="animate-spin text-champagne-500" />
          ) : (
            <CheckCircle size={36} className="animate-bounce" />
          )}
        </div>
        
        <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-semibold tracking-wide border-b border-champagne-100 pb-3">
          {t('orderConfirmation.heading')}
        </h1>
        <p className="text-stone-500 text-xs max-w-md mx-auto leading-relaxed">
          {t('orderConfirmation.descPart1')} <strong className="text-stone-850">{name}</strong>{t('orderConfirmation.descPart2')}
        </p>
      </div>

      {/* Syncing database indicator strip */}
      {isSyncing && (
        <div className="text-center bg-stone-50 border border-stone-200 py-2.5 rounded-sm flex items-center justify-center gap-2">
          <Loader2 size={12} className="animate-spin text-stone-400" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-stone-400">{t('orderConfirmation.syncing')}</span>
        </div>
      )}

      {/* Recipte Details Card */}
      <div className="bg-white border border-champagne-100 rounded-lg overflow-hidden shadow-xs">
        
        {/* Header Block of Receipt */}
        <div className="p-6 bg-champagne-50/50 border-b border-champagne-100 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-1">
            <span className="text-[10px] tracking-wider uppercase text-stone-400 font-semibold block">{t('orderConfirmation.orderId')}</span>
            <span className="font-mono text-xs sm:text-sm font-bold text-stone-900 bg-white border border-champagne-150 px-3 py-1.5 rounded-sm">
              {orderId}
            </span>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <span className="text-[10px] tracking-wider uppercase text-stone-400 font-semibold block">{t('orderConfirmation.shippingEmail')}</span>
            <span className="text-xs font-semibold text-stone-800 font-mono {email}">{email}</span>
          </div>
        </div>

        {/* List Items Purchased */}
        <div className="p-6 space-y-4 division-y border-b border-champagne-100">
          <h3 className="text-xs tracking-widest uppercase font-semibold text-stone-800">{t('orderConfirmation.selection')}</h3>
          
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex gap-4 items-center">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-sm object-cover border border-stone-150" />
                <div className="flex-1">
                  <h4 className="font-serif text-xs sm:text-sm text-stone-950 font-medium leading-tight">{item.name}</h4>
                  <p className="text-[10px] text-stone-500 mt-0.5">{t('orderConfirmation.sizeQty', { size: item.selected_size, qty: item.quantity })}</p>
                </div>
                <span className="font-serif text-sm text-stone-900 font-semibold">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Summary Breakdown Footer */}
        <div className="p-6 bg-stone-50/50 flex justify-between items-baseline">
          <span className="font-serif text-base text-stone-900 font-semibold">{t('orderConfirmation.grandTotal')}</span>
          <span className="font-serif text-xl sm:text-2xl text-stone-900 font-bold">
            {formatPrice(total)}
          </span>
        </div>

      </div>

      {/* Guild Heritage Assurance */}
      <div className="bg-white border border-champagne-100 rounded-lg p-5 flex gap-4 items-start">
        <div className="text-champagne-500 pt-0.5 shrink-0">
          <Star size={18} className="fill-champagne-500" />
        </div>
        <div className="space-y-1 text-xs font-sans leading-relaxed">
          <h4 className="font-serif text-sm font-semibold text-stone-900">{t('orderConfirmation.guildAssurance')}</h4>
          <p className="text-stone-500">
            {t('orderConfirmation.guildDesc')}
          </p>
        </div>
      </div>

      {/* Button controls actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          onClick={() => onPageChange('shop')}
          className="cursor-pointer w-full sm:w-auto bg-stone-900 hover:bg-champagne-600 text-white font-sans tracking-widest text-xs uppercase font-medium px-8 py-4 transition-colors duration-300"
        >
          {t('orderConfirmation.continueShopping')}
        </button>
        <button
          onClick={() => window.print()}
          className="cursor-pointer w-full sm:w-auto bg-white hover:bg-stone-50 text-stone-700 border border-stone-250 font-sans tracking-widest text-xs uppercase font-medium px-8 py-4 transition-colors duration-300 flex items-center justify-center gap-1.5"
        >
          {t('orderConfirmation.printReceipt')}
        </button>
      </div>

    </div>
  );
}
