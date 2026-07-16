import { useState, FormEvent } from 'react';
import { Package, Search, CheckCircle2, Circle, Clock, Truck, XCircle, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from '../i18n';
import { useNavigate } from 'react-router-dom';
import type { Order } from '../types';

const STEP_ICONS = { pending: Clock, processing: Package, shipped: Truck, delivered: CheckCircle2, cancelled: XCircle } as const;
const STEP_ORDER = ['pending', 'processing', 'shipped', 'delivered'] as const;

function getCurrentStep(status: string): number {
  if (status === 'cancelled') return -1;
  const idx = STEP_ORDER.indexOf(status as any);
  return idx >= 0 ? idx : 0;
}

export default function TrackOrder() {
  const { t, dir } = useTranslation();
  const navigate = useNavigate();
  const [ref, setRef] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setOrder(null);

    if (!ref.trim() || !email.trim()) {
      setError(t('trackOrder.errorEmpty'));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('API error');
      const orders: Order[] = await res.json();
      const found = orders.find(o => o.id === ref.trim() && o.customer_email === email.trim());
      if (!found) {
        setError(t('trackOrder.errorNotFound'));
      } else {
        setOrder(found);
      }
    } catch {
      setError(t('trackOrder.errorGeneric'));
    } finally {
      setLoading(false);
    }
  };

  const statusLabels = t('trackOrder.statusLabels') as unknown as Record<string, string>;
  const statusDescs = t('trackOrder.statusDescriptions') as unknown as Record<string, string>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">

      <div className="text-center space-y-4">
        <span className="text-xs tracking-[0.3em] font-medium uppercase text-champagne-500 block font-sans">
          {t('trackOrder.label')}
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-stone-900 font-black tracking-tight">
          {t('trackOrder.heading')}
        </h1>
        <p className="text-stone-500 text-sm sm:text-base leading-relaxed max-w-lg mx-auto font-sans">
          {t('trackOrder.desc')}
        </p>
        <div className="w-16 h-[2px] bg-champagne-500 mx-auto rounded-full"></div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-champagne-150 rounded-xl p-8 md:p-10 shadow-xs space-y-5" dir={dir}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-[10px] tracking-widest uppercase font-bold text-stone-600 font-sans">
              {t('trackOrder.refLabel')}
            </label>
            <input
              type="text"
              required
              value={ref}
              onChange={e => setRef(e.target.value)}
              className="w-full px-4 py-3 bg-stone-50 border border-champagne-150 rounded-lg text-xs text-stone-800 focus:outline-hidden focus:border-champagne-400 focus:bg-white transition-all font-sans"
              placeholder={t('trackOrder.refPlaceholder')}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] tracking-widest uppercase font-bold text-stone-600 font-sans">
              {t('trackOrder.emailLabel')}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-stone-50 border border-champagne-150 rounded-lg text-xs text-stone-800 focus:outline-hidden focus:border-champagne-400 focus:bg-white transition-all font-sans"
              placeholder={t('trackOrder.emailPlaceholder')}
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-xs font-sans">
            <AlertCircle size={14} className="shrink-0" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer w-full bg-stone-900 text-white py-3.5 text-xs uppercase tracking-widest font-bold hover:bg-champagne-500 transition-all rounded-lg shadow-md font-sans flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              {t('trackOrder.loading')}
            </span>
          ) : (
            <><Search size={13} />{t('trackOrder.submit')}</>
          )}
        </button>
      </form>

      {order && (
        <div className="space-y-8 animate-fade-slide-up">
          <div className="bg-white border border-champagne-150 rounded-xl p-8 md:p-10 shadow-xs space-y-8">
            <div className="flex items-center gap-2 text-champagne-600">
              <Package size={18} />
              <h2 className="font-serif text-lg font-bold text-stone-900">{t('trackOrder.orderDetails')}</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans">
              {[
                { label: t('trackOrder.reference'), value: order.id },
                { label: t('trackOrder.email'), value: order.customer_email },
                { label: t('trackOrder.date'), value: new Date(order.created_at).toLocaleDateString() },
                { label: t('trackOrder.status'), value: statusLabels[order.status] || order.status },
              ].map(f => (
                <div key={f.label} className="bg-stone-50 rounded-lg p-3.5 space-y-1">
                  <p className="text-[9px] uppercase tracking-widest font-bold text-stone-500">{f.label}</p>
                  <p className="text-stone-900 font-medium break-all">{f.value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-stone-700 uppercase tracking-widest font-sans">{t('trackOrder.items')}</p>
              <div className="divide-y divide-stone-100">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5">
                    <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded border border-stone-100 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-stone-800 truncate font-sans">{item.name}</p>
                      <p className="text-[10px] text-stone-500 font-sans">{t('productDetail.sizes.medium')} × {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-stone-900 font-sans shrink-0">
                      {((item.price * item.quantity) * 10).toLocaleString()} {t('common.currency')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-champagne-150 pt-4 flex justify-between items-center">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-widest font-sans">{t('trackOrder.total')}</span>
              <span className="font-serif text-lg font-bold text-stone-900">
                {(order.total * 10).toLocaleString()} {t('common.currency')}
              </span>
            </div>
          </div>

          <div className="bg-white border border-champagne-150 rounded-xl p-8 md:p-10 shadow-xs">
            <div className="space-y-6">
              {order.status === 'cancelled' ? (
                <div className="flex flex-col items-center text-center space-y-3 py-4">
                  <div className="w-14 h-14 bg-red-50 border border-red-200 rounded-full flex items-center justify-center">
                    <XCircle size={28} className="text-red-500" />
                  </div>
                  <div>
                    <p className="font-serif text-base font-bold text-stone-900">{statusLabels.cancelled}</p>
                    <p className="text-xs text-stone-500 mt-1 font-sans">{statusDescs.cancelled}</p>
                  </div>
                </div>
              ) : (
                <div className="relative" dir="ltr">
                  <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-champagne-200"></div>
                  <div className="space-y-8">
                    {STEP_ORDER.map((step, i) => {
                      const currentStep = getCurrentStep(order.status);
                      const isComplete = i <= currentStep;
                      const isCurrent = i === currentStep;
                      const StepIcon = STEP_ICONS[step];
                      return (
                        <div key={step} className="relative flex items-start gap-5">
                          <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 transition-all ${
                            isComplete ? 'bg-champagne-500 border-champagne-500 text-white' : 'bg-white border-stone-300 text-stone-400'
                          } ${isCurrent ? 'ring-4 ring-champagne-200' : ''}`}>
                            <StepIcon size={16} />
                          </div>
                          <div className="pt-1.5">
                            <p className={`text-sm font-bold font-sans ${isComplete ? 'text-stone-900' : 'text-stone-400'}`}>
                              {statusLabels[step]}
                            </p>
                            <p className={`text-xs mt-0.5 font-sans ${isComplete ? 'text-stone-600' : 'text-stone-400'}`}>
                              {statusDescs[step]}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-champagne-50 border border-champagne-200 rounded-xl p-6 text-center space-y-3">
            <p className="text-xs text-stone-700 font-sans">{t('trackOrder.help')}</p>
            <button
              onClick={() => navigate('/contact')}
              className="cursor-pointer inline-flex items-center gap-2 py-2.5 px-6 text-[10px] uppercase tracking-widest font-bold text-white bg-stone-900 hover:bg-champagne-500 transition-all rounded-lg shadow-sm font-sans"
            >
              {dir === 'ltr' ? <ArrowRight size={12} /> : <ArrowLeft size={12} />}
              {t('trackOrder.helpCta')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
