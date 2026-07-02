import React, { useState, useEffect } from 'react';
import { CreditCard, EyeOff, ShieldCheck, Heart, ArrowRight, CornerDownLeft, RefreshCw } from 'lucide-react';
import { useTranslation } from '../i18n';

interface CheckoutSimulationProps {
  onPageChange: (pageName: string, params?: any) => void;
  onClearCart: () => void;
  currency: 'USD' | 'MAD';
}

export default function CheckoutSimulation({ onPageChange, onClearCart, currency }: CheckoutSimulationProps) {
  const formatPrice = (priceUSD: number) => {
    if (currency === 'MAD') {
      return `${(priceUSD * 10).toLocaleString()} ${t('common.currency')}`;
    }
    return `$${priceUSD.toLocaleString()}`;
  };

  const { t } = useTranslation();

  // Extract details from Query Param string
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('orderId') || 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  const name = urlParams.get('name') || t('checkout.guestName');
  const email = urlParams.get('email') || t('checkout.guestEmail');
  const total = parseFloat(urlParams.get('total') || '0');
  
  // Parse items safely
  let items: any[] = [];
  try {
    const itemsRaw = urlParams.get('items');
    if (itemsRaw) {
      items = JSON.parse(decodeURIComponent(itemsRaw));
    }
  } catch (err) {
    console.error('Failed to parse items from redirect params', err);
  }

  // Payment Selection and Form State
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardName, setCardName] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvv, setCardCvv] = useState<string>('');
  const [processing, setProcessing] = useState<boolean>(false);
  const [cardStyle, setCardStyle] = useState<'gold' | 'rose'>('gold');

  // Format Card Number
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    
    // Group into 4s
    const matches = value.match(/\d{1,4}/g);
    const formatted = matches ? matches.join(' ') : '';
    setCardNumber(formatted);
  };

  // Format Expiry Month/Year
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);

    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setExpiry(e.target, value);
  };

  const setExpiry = (target: HTMLInputElement, val: string) => {
    setCardExpiry(val);
  };

  // Process Interactive Checkout Payment and record ORDER in DB
  const handleCompletePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // 1. Post to Express DB /api/orders
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: name,
          customer_email: email,
          items: items.map(item => ({
            product_id: item.product_id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            selected_size: item.selected_size,
            image: item.image
          })),
          total: total
        })
      });

      if (!response.ok) {
        throw new Error(t('checkout.orderError'));
      }

      await response.json();

      // Simple artificial luxurious processing lag
      setTimeout(() => {
        setProcessing(false);
        onClearCart(); // empty cart on completion
        // Redirect to Confirmation
        onPageChange('order-confirmation', {
          orderId,
          email,
          name,
          total: total.toString(),
          status: 'success'
        });
      }, 2500);

    } catch (err) {
      console.error('Failed to commit simulated order', err);
      alert(t('checkout.serverError'));
      // Proceed gracefully anyway for high prototype resilience
      onClearCart();
      onPageChange('order-confirmation', {
        orderId,
        email,
        name,
        total: total.toString(),
        status: 'success'
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Editorial Title */}
      <div className="text-center space-y-3 pb-4">
        <span className="text-[10px] tracking-[0.3em] font-medium uppercase text-champagne-500 font-sans block">
          {t('checkout.encryptionLabel')}
        </span>
        <h1 className="font-serif text-3xl text-stone-900 font-semibold tracking-wide">
          {t('checkout.heading')}
        </h1>
        <p className="text-stone-500 text-xs max-w-md mx-auto">
          {t('checkout.desc')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        
        {/* Left Side: Realistic interactive Credit Card visual */}
        <div className="space-y-6">
          <label className="text-[10px] tracking-wider uppercase font-semibold text-stone-500 block">
            {t('checkout.toggleAesthetics')}
          </label>
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setCardStyle('gold')}
              className={`p-2 px-4 text-xs font-semibold rounded-full border transition-all ${
                cardStyle === 'gold' ? 'bg-champagne-500 text-stone-950 border-champagne-500' : 'bg-white border-stone-200 hover:border-stone-400'
              }`}
            >
              {t('checkout.classicGold')}
            </button>
            <button
              onClick={() => setCardStyle('rose')}
              className={`p-2 px-4 text-xs font-semibold rounded-full border transition-all ${
                cardStyle === 'rose' ? 'bg-rose-400 text-white border-rose-450' : 'bg-white border-stone-200 hover:border-stone-400'
              }`}
            >
              {t('checkout.roseGold')}
            </button>
          </div>

          {/* Interactive Card Node representation */}
          <div className={`p-6 sm:p-8 aspect-[1.58/1] rounded-2xl text-white shadow-2xl relative overflow-hidden transition-all duration-500 transform ${
            cardStyle === 'gold'
              ? 'bg-gradient-to-tr from-stone-950 via-stone-900 to-champagne-650'
              : 'bg-gradient-to-tr from-stone-900 via-stone-800 to-rose-450'
          }`}>
            {/* Background luxury highlights */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-champagne-500/10 rounded-full blur-xl"></div>

            <div className="flex flex-col h-full justify-between relative z-10">
              
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-serif text-lg tracking-widest text-white">AURELIA</h3>
                  <span className="text-[7px] uppercase tracking-widest text-champagne-300 block font-sans">{t('checkout.heirloomCollection')}</span>
                </div>
                <div className="w-10 h-7 bg-white/10 rounded-md border border-white/15 flex items-center justify-center text-xs font-mono font-bold italic text-champagne-300">
                  GOLD
                </div>
              </div>

              {/* Graphic gold microchip rendering */}
              <div className="w-10 h-8 rounded-md bg-gradient-to-br from-champagne-300 to-champagne-500 relative overflow-hidden flex items-center justify-center opacity-85 my-2">
                <div className="absolute w-full h-[1px] bg-stone-950/20 top-1/2"></div>
                <div className="absolute h-full w-[1px] bg-stone-950/20 left-1/2"></div>
                <div className="w-4 h-4 rounded-xs border border-stone-950/30"></div>
              </div>

              <div className="space-y-4">
                {/* Dynamically grouped Number */}
                <p className="font-mono text-base sm:text-lg tracking-widest font-normal">
                  {cardNumber || t('checkout.cardNumberMask')}
                </p>

                <div className="flex justify-between items-center text-[10px] uppercase font-sans tracking-widest text-stone-300">
                  <div>
                    <span className="text-[7px] block text-stone-400">{t('checkout.cardholderLabel')}</span>
                    <span className="font-semibold block truncate leading-tight max-w-[150px] text-white">
                      {cardName || t('checkout.defaultCardName')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[7px] block text-stone-400">{t('checkout.expiryLabel')}</span>
                    <span className="font-mono font-semibold block text-white">{cardExpiry || t('checkout.defaultExpiry')}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Side: Inputs form with processing state */}
        <div className="bg-white p-6 border border-champagne-105 rounded-lg space-y-6 shadow-sm">
          <div className="flex justify-between items-center pb-3 border-b border-stone-100">
            <h2 className="font-serif text-base text-stone-900 font-semibold flex items-center gap-1.5 font-bold">
              {t('checkout.paymentMethod')}
            </h2>
            <span className="text-xs text-stone-850 font-serif font-bold">
              {t('checkout.total')} {formatPrice(total)}
            </span>
          </div>

          {/* Payment Method Selector */}
          <div className="grid grid-cols-2 gap-3 pb-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`cursor-pointer flex items-center justify-center gap-2 py-3 rounded-md text-xs font-semibold uppercase tracking-wider transition-all border ${
                paymentMethod === 'card'
                  ? 'border-stone-900 bg-stone-900 text-white shadow-md'
                  : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400'
              }`}
            >
              <CreditCard size={13} />
              {t('checkout.card')}
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('cod')}
              className={`cursor-pointer flex items-center justify-center gap-2 py-3 rounded-md text-xs font-semibold uppercase tracking-wider transition-all border ${
                paymentMethod === 'cod'
                  ? 'border-stone-900 bg-stone-900 text-white shadow-md'
                  : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400'
              }`}
            >
              {t('checkout.cod')}
            </button>
          </div>

          <form onSubmit={handleCompletePayment} className="space-y-4">
            {paymentMethod === 'cod' ? (
              <div className="p-5 bg-amber-50/50 border border-amber-200/60 rounded-lg space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <span>{t('checkout.codArabic')}</span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed font-semibold">
                  {t('checkout.codDescription')}
                </p>
                <div className="pt-2 border-t border-amber-200/50 text-[11px] text-amber-900 font-bold flex justify-between">
                  <span>{t('checkout.codTotalLabel')}</span>
                  <span className="font-mono text-xs">{formatPrice(total)}</span>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <label htmlFor="card-name-input" className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">
                    {t('checkout.cardholderName')}
                  </label>
                  <input
                    id="card-name-input"
                    type="text"
                    required
                    placeholder={t('checkout.cardNamePlaceholder')}
                    className="w-full bg-stone-50 text-xs px-3 py-3 rounded-sm border border-stone-200 focus:outline-hidden focus:border-champagne-400"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="card-num-input" className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">
{t('checkout.cardNumber')}
                  </label>
                  <input
                    id="card-num-input"
                    type="text"
                    required
                    placeholder={t('checkout.cardNumberPlaceholder')}
                    className="w-full bg-stone-50 text-xs px-3 py-3 rounded-sm border border-stone-200 focus:outline-hidden focus:border-champagne-400 font-mono"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="card-expiry-input" className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">
                      {t('checkout.expirationDate')}
                    </label>
                    <input
                      id="card-expiry-input"
                      type="text"
                      required
                      placeholder={t('checkout.expiryPlaceholder')}
                      className="w-full bg-stone-50 text-xs px-3 py-3 rounded-sm border border-stone-200 focus:outline-hidden focus:border-champagne-400 font-mono"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="card-cvv-input" className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">
                      {t('checkout.cvv')}
                    </label>
                    <input
                      id="card-cvv-input"
                      type="password"
                      required
                      placeholder={t('checkout.cvvPlaceholder')}
                      maxLength={3}
                      className="w-full bg-stone-50 text-xs px-3 py-3 rounded-sm border border-stone-200 focus:outline-hidden focus:border-champagne-400 font-mono"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={processing}
              className="cursor-pointer w-full bg-stone-900 hover:bg-champagne-600 disabled:bg-stone-200 text-white font-sans tracking-widest text-xs uppercase py-4 transition-all flex items-center justify-center gap-2 font-medium"
            >
              {processing ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  {paymentMethod === 'cod' ? t('checkout.processingCod') : t('checkout.processingCard')}
                </>
              ) : (
                <>
                  {paymentMethod === 'cod' ? t('checkout.confirmCod', { total: formatPrice(total) }) : t('checkout.confirmCard', { total: formatPrice(total) })}
                  <ArrowRight size={14} />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[9px] text-stone-400 pt-2 border-t border-stone-50">
              <ShieldCheck size={12} className="text-champagne-500" />
              <span>{t('checkout.security')}</span>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
