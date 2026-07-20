import React, { useState } from 'react';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Ticket, RefreshCw } from 'lucide-react';
import { CartItem } from '../types';
import { useTranslation } from '../i18n';

interface CartProps {
  cart: CartItem[];
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onRemoveItem: (id: string) => void;
  onPageChange: (pageName: string, params?: any) => void;
  onClearCart: () => void;
  currency: 'USD' | 'MAD';
}

export default function Cart({ cart, onUpdateQuantity, onRemoveItem, onPageChange, onClearCart, currency }: CartProps) {
  const formatPrice = (priceUSD: number) => {
    if (currency === 'MAD') {
      return `${(priceUSD * 10).toLocaleString()} ${t('common.currency')}`;
    }
    return `$${priceUSD.toLocaleString()}`;
  };
  const { t } = useTranslation();
  const [promoCode, setPromoCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number } | null>(null);
  const [promoError, setPromoError] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerCountry, setCustomerCountry] = useState<string>('Morocco 🇲🇦');
  const [customerCity, setCustomerCity] = useState<string>('');
  const [customerStreet, setCustomerStreet] = useState<string>('');
  const [customerApartment, setCustomerApartment] = useState<string>('');
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('cod');
  const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.percent) / 100 : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount);

  // Promo code validation handler
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();

    if (code === 'CCJAOUHARA10') {
      setAppliedDiscount({ code: 'CCJAOUHARA10', percent: 10 });
      setPromoCode('');
    } else if (code === 'HERITAGE15') {
      setAppliedDiscount({ code: 'HERITAGE15', percent: 15 });
      setPromoCode('');
    } else {
      setPromoError(t('cart.couponInvalid'));
    }
  };

  // Submit order directly to database
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (cart.length === 0) {
      setFormError(t('cart.errorEmpty'));
      return;
    }
    if (!customerName || !customerPhone || !customerCity || !customerStreet) {
      setFormError(t('cart.errorNameEmail'));
      return;
    }

    setCheckoutLoading(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_email: customerEmail,
          customer_country: customerCountry,
          customer_city: customerCity,
          customer_street: customerStreet,
          customer_apartment: customerApartment,
          payment_method: paymentMethod,
          order_notes: orderNotes,
          items: cart,
          subtotal,
          shipping_cost: 0,
          discount_amount: discountAmount,
          discount_code: appliedDiscount?.code || '',
          total: grandTotal
        })
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.error || t('cart.errorInit'));
      }

      const order = await response.json();

      if (!order?.id) {
        throw new Error('Invalid order response from server');
      }

      onClearCart();
      onPageChange('order-confirmation', { orderId: order.id });
    } catch (err: any) {
      console.error('[Order Submit Error]', err);
      setFormError(err.message || t('cart.errorPayment'));
      setCheckoutLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20 bg-white border border-champagne-100 rounded-lg p-8 space-y-6">
        <div className="w-16 h-16 bg-champagne-50 border border-champagne-150 rounded-full flex items-center justify-center text-champagne-500 mx-auto">
          <ShoppingBag size={24} strokeWidth={1.5} />
        </div>
        <h1 className="font-serif text-2xl text-stone-900 font-medium">{t('cart.empty.title')}</h1>
        <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
          {t('cart.empty.desc')}
        </p>
        <button
          onClick={() => onPageChange('shop')}
          className="cursor-pointer bg-stone-900 hover:bg-champagne-500 text-white text-xs uppercase tracking-widest px-8 py-3.5 font-semibold transition-colors font-medium mt-2"
        >
          {t('cart.empty.cta')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Editorial Title */}
      <div className="border-b border-champagne-100 pb-5">
        <h1 className="font-serif text-3xl sm:text-4xl text-stone-950 font-medium">
          {t('cart.heading')}
        </h1>
        <p className="text-stone-500 text-xs mt-1">
          {t('cart.desc')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Aspect: Selected Item Nodes list */}
        <div className="lg:col-span-7 space-y-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex bg-white rounded-lg border border-champagne-100/50 p-4 sm:p-5 gap-4 sm:gap-6 hover:shadow-md transition-shadow"
            >
              {/* Image Frame */}
              <div className="w-20 sm:w-28 aspect-square bg-stone-50 border border-stone-100 rounded-md overflow-hidden shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>

              {/* Item Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-serif text-sm sm:text-base text-stone-900 font-medium leading-tight">
                      {item.name}
                    </h3>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-stone-400 hover:text-rose-500 transition-colors cursor-pointer p-1"
                      title={t('cart.remove')}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-stone-450">
                    <span>{t('cart.size')} <strong className="text-stone-700">{item.selected_size}</strong></span>
                    <span>{t('cart.itemPrice')} <strong className="text-stone-700">{formatPrice(item.price)}</strong></span>
                  </div>

                </div>

                {/* Subtotal & Quantity modifiers */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-stone-200 bg-stone-50/50 px-1 py-0.5 rounded-sm">
                    <button
                      onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="p-1 px-2 text-stone-500 hover:text-stone-950 font-semibold focus:outline-hidden"
                      aria-label={t('cart.reduceQty')}
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-xs font-semibold font-mono">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, Math.min(item.max_stock, item.quantity + 1))}
                      disabled={item.quantity >= item.max_stock}
                      className="p-1 px-2 text-stone-500 hover:text-stone-950 font-semibold disabled:opacity-25 focus:outline-hidden"
                      aria-label={t('cart.increaseQty')}
                    >
                      +
                    </button>
                  </div>

                  <span className="font-serif text-sm sm:text-base text-stone-900 font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Right Aspect: Purchase Calculations Billing Board */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Billing Breakdown Card */}
          <div className="bg-white border border-champagne-100 rounded-lg p-6 space-y-6">
            <h2 className="font-serif text-xl font-medium text-stone-900 pb-4 border-b border-stone-100">
              {t('cart.billing')}
            </h2>

            {/* Calculations rows */}
            <div className="space-y-3.5 text-xs font-sans pb-4 border-b border-stone-50">
              <div className="flex justify-between text-stone-500">
                <span>{t('cart.subtotal')}</span>
                <span className="text-stone-850 font-semibold">{formatPrice(subtotal)}</span>
              </div>
              
              {appliedDiscount && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>{t('cart.discount', { code: appliedDiscount.code, percent: appliedDiscount.percent })}</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-baseline pt-2">
              <span className="font-serif text-lg text-stone-900 font-semibold">{t('cart.grandTotal')}</span>
              <span className="font-serif text-2xl text-stone-900 font-bold">
                {formatPrice(grandTotal)}
              </span>
            </div>

            {/* Promo code entry input */}
            <form onSubmit={handleApplyPromo} className="space-y-2 pt-2">
              <label htmlFor="promo-input" className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
                {t('cart.promoHeading')}
              </label>
              <div className="flex gap-2">
                <input
                  id="promo-input"
                  type="text"
                  placeholder={t('cart.promoPlaceholder')}
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-stone-50 text-xs px-3 py-3 rounded-sm border border-stone-200 focus:outline-hidden focus:border-champagne-400 placeholder-stone-400 font-mono"
                />
                <button
                  type="submit"
                  className="cursor-pointer bg-champagne-100 hover:bg-champagne-200 text-champagne-700 px-4 text-xs font-semibold py-3 transition-colors flex items-center gap-1 shrink-0"
                >
                  <Ticket size={12} /> {t('cart.promoApply')}
                </button>
              </div>
              
              {/* Active Coupons Helper panel */}
              {promoError ? (
                <p className="text-[10px] text-rose-500 font-sans">{promoError}</p>
              ) : (
                <div className="bg-champagne-50/50 p-2.5 rounded-sm border border-champagne-100/50 text-[10px] text-stone-550 space-y-0.5">
                  <p className="font-semibold text-champagne-700 uppercase tracking-wider">{t('cart.activeCodes')}</p>
                  <p>{t('cart.code1')}</p>
                  <p>{t('cart.code2')}</p>
                </div>
              )}
            </form>
          </div>

          {/* Secure Identity & Gateway Dispatch Form */}
          <div className="bg-white border border-champagne-100 rounded-lg p-6 space-y-4">
            <h2 className="font-serif text-lg font-medium text-stone-900 pb-2 border-b border-light-pink-100">
              {t('cart.dispatchHeading')}
            </h2>
            <p className="text-[10px] text-stone-400 tracking-widest font-mono select-none">
              ━━━━━━━━━━━━━━━━━━━━━━
            </p>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">

              {/* Contact Information */}
              <div className="space-y-3">
                <h3 className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold">
                  {t('cart.contactInfo')}
                </h3>
                <p className="text-[10px] text-stone-400 tracking-widest font-mono select-none">
                  ━━━━━━━━━━━━━━━━━━━━━━
                </p>

                <div className="space-y-1">
                  <label htmlFor="dispatch-name" className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">
                    {t('cart.billingName')} <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="dispatch-name"
                    type="text"
                    required
                    placeholder={t('cart.billingPlaceholder')}
                    className="w-full bg-stone-50 text-xs px-3 py-3 rounded-sm border border-stone-200 focus:outline-hidden focus:border-champagne-400 placeholder-stone-450"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="dispatch-phone" className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">
                    {t('cart.phoneLabel')} <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="dispatch-phone"
                    type="tel"
                    required
                    placeholder={t('cart.phonePlaceholder')}
                    className="w-full bg-stone-50 text-xs px-3 py-3 rounded-sm border border-stone-200 focus:outline-hidden focus:border-champagne-400 placeholder-stone-450"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="dispatch-email" className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">
                    {t('cart.emailLabel')}
                  </label>
                  <input
                    id="dispatch-email"
                    type="email"
                    placeholder={t('cart.emailPlaceholder')}
                    className="w-full bg-stone-50 text-xs px-3 py-3 rounded-sm border border-stone-200 focus:outline-hidden focus:border-champagne-400 placeholder-stone-450"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-3">
                <h3 className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold">
                  {t('cart.shippingAddress')}
                </h3>
                <p className="text-[10px] text-stone-400 tracking-widest font-mono select-none">
                  ━━━━━━━━━━━━━━━━━━━━━━
                </p>

                <div className="space-y-1">
                  <label htmlFor="dispatch-country" className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">
                    {t('cart.countryLabel')} <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="dispatch-country"
                    type="text"
                    required
                    placeholder={t('cart.countryDefault')}
                    className="w-full bg-stone-50 text-xs px-3 py-3 rounded-sm border border-stone-200 focus:outline-hidden focus:border-champagne-400 placeholder-stone-450"
                    value={customerCountry}
                    onChange={(e) => setCustomerCountry(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="dispatch-city" className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">
                    {t('cart.cityLabel')} <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="dispatch-city"
                    type="text"
                    required
                    placeholder={t('cart.cityPlaceholder')}
                    className="w-full bg-stone-50 text-xs px-3 py-3 rounded-sm border border-stone-200 focus:outline-hidden focus:border-champagne-400 placeholder-stone-450"
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="dispatch-street" className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">
                    {t('cart.streetLabel')} <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="dispatch-street"
                    type="text"
                    required
                    placeholder={t('cart.streetPlaceholder')}
                    className="w-full bg-stone-50 text-xs px-3 py-3 rounded-sm border border-stone-200 focus:outline-hidden focus:border-champagne-400 placeholder-stone-450"
                    value={customerStreet}
                    onChange={(e) => setCustomerStreet(e.target.value)}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-3">
                <h3 className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold">
                  {t('cart.paymentMethod')}
                </h3>
                <p className="text-[10px] text-stone-400 tracking-widest font-mono select-none">
                  ━━━━━━━━━━━━━━━━━━━━━━
                </p>

                <label className="flex items-center gap-3 p-3 bg-stone-50 rounded-sm border border-stone-200 cursor-pointer">
                  <input
                    type="radio"
                    name="payment-method"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-champagne-500"
                  />
                  <span className="text-xs text-stone-700 font-medium">
                    {t('cart.cashOnDelivery')}
                  </span>
                </label>
              </div>

              {formError && (
                <p className="text-xs text-rose-500 font-semibold">{formError}</p>
              )}

              <button
                type="submit"
                disabled={checkoutLoading}
                className="cursor-pointer w-full bg-stone-900 hover:bg-champagne-600 disabled:bg-stone-200 text-white font-sans font-medium tracking-widest text-xs uppercase py-4 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 group focus:outline-hidden"
              >
                {checkoutLoading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    {t('cart.processing')}
                  </>
                ) : (
                  <>
                    {t('cart.checkout')}
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-400 pt-2 border-t border-stone-50">
                <ShieldCheck size={12} className="text-champagne-500" />
                <span>{t('cart.security')}</span>
              </div>

            </form>
          </div>

        </div>
      </div>

    </div>
  );
}
