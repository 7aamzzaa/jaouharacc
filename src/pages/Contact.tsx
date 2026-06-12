import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Send, Check, ArrowLeft } from 'lucide-react';
import { useTranslation } from '../i18n';

export default function Contact() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">

      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs tracking-[0.3em] font-medium uppercase text-champagne-500 block font-sans">
          {t('contact.label')}
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-stone-900 font-black tracking-tight">
          {t('contact.heading')}
        </h1>
        <p className="text-stone-500 text-sm sm:text-base leading-relaxed max-w-lg mx-auto font-sans">
          {t('contact.desc')}
        </p>
        <div className="w-16 h-[2px] bg-champagne-500 mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Contact Form */}
        <div className="lg:col-span-7">
          {submitted ? (
            <div className="bg-champagne-50 border border-champagne-200 rounded-xl p-10 text-center space-y-4">
              <div className="w-16 h-16 bg-champagne-500/10 rounded-full flex items-center justify-center mx-auto">
                <Check size={28} className="text-champagne-600" />
              </div>
              <h3 className="font-serif text-xl text-stone-900 font-bold">{t('contact.successTitle')}</h3>
              <p className="text-stone-500 text-sm font-sans">{t('contact.successDesc')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border border-champagne-150 rounded-xl p-8 md:p-10 space-y-5 shadow-xs" dir="rtl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-[10px] tracking-widest uppercase font-bold text-stone-600 font-sans">{t('contact.fullName')}</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-stone-50 border border-champagne-150 rounded-lg text-xs text-stone-800 focus:outline-hidden focus:border-champagne-400 focus:bg-white transition-all font-sans"
                    placeholder={t('contact.namePlaceholder')}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] tracking-widest uppercase font-bold text-stone-600 font-sans">{t('contact.email')}</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-stone-50 border border-champagne-150 rounded-lg text-xs text-stone-800 focus:outline-hidden focus:border-champagne-400 focus:bg-white transition-all font-sans"
                    placeholder={t('contact.emailPlaceholder')}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-[10px] tracking-widest uppercase font-bold text-stone-600 font-sans">{t('contact.phone')}</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-stone-50 border border-champagne-150 rounded-lg text-xs text-stone-800 focus:outline-hidden focus:border-champagne-400 focus:bg-white transition-all font-sans"
                    placeholder={t('contact.phonePlaceholder')}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] tracking-widest uppercase font-bold text-stone-600 font-sans">{t('contact.subject')}</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    className="w-full px-4 py-3 bg-stone-50 border border-champagne-150 rounded-lg text-xs text-stone-800 focus:outline-hidden focus:border-champagne-400 focus:bg-white transition-all font-sans"
                    placeholder={t('contact.subjectPlaceholder')}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] tracking-widest uppercase font-bold text-stone-600 font-sans">{t('contact.message')}</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  className="w-full px-4 py-3 bg-stone-50 border border-champagne-150 rounded-lg text-xs text-stone-800 focus:outline-hidden focus:border-champagne-400 focus:bg-white transition-all resize-none font-sans"
                  placeholder={t('contact.messagePlaceholder')}
                />
              </div>
              <button
                type="submit"
                className="cursor-pointer w-full bg-stone-900 text-white py-3.5 text-xs uppercase tracking-widest font-bold hover:bg-champagne-500 transition-all rounded-lg shadow-md font-sans flex items-center justify-center gap-2"
              >
                <Send size={13} />
                {t('contact.send')}
              </button>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white border border-champagne-150 rounded-xl p-8 shadow-xs space-y-6">
            <h3 className="font-serif text-lg text-stone-900 font-bold">{t('contact.atelier')}</h3>
            <div className="space-y-5">
              <div className="flex items-start gap-4" dir="rtl">
                <div className="w-10 h-10 bg-champagne-50 border border-champagne-100 rounded-lg flex items-center justify-center text-champagne-600 shrink-0">
                  <MapPin size={16} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] tracking-widest uppercase font-bold text-stone-500 font-sans">{t('contact.address')}</p>
                  <p className="text-sm text-stone-800 font-sans">{t('contact.addressValue')}</p>
                </div>
              </div>
              <div className="flex items-start gap-4" dir="rtl">
                <div className="w-10 h-10 bg-champagne-50 border border-champagne-100 rounded-lg flex items-center justify-center text-champagne-600 shrink-0">
                  <Phone size={16} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] tracking-widest uppercase font-bold text-stone-500 font-sans">{t('contact.phoneLabel')}</p>
                  <p className="text-sm text-stone-800 font-sans">{t('contact.phoneValue')}</p>
                </div>
              </div>
              <div className="flex items-start gap-4" dir="rtl">
                <div className="w-10 h-10 bg-champagne-50 border border-champagne-100 rounded-lg flex items-center justify-center text-champagne-600 shrink-0">
                  <Mail size={16} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] tracking-widest uppercase font-bold text-stone-500 font-sans">{t('contact.emailLabel')}</p>
                  <p className="text-sm text-stone-800 font-sans">{t('contact.emailValue')}</p>
                </div>
              </div>
              <div className="flex items-start gap-4" dir="rtl">
                <div className="w-10 h-10 bg-champagne-50 border border-champagne-100 rounded-lg flex items-center justify-center text-champagne-600 shrink-0">
                  <Clock size={16} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] tracking-widest uppercase font-bold text-stone-500 font-sans">{t('contact.hours')}</p>
                  <p className="text-sm text-stone-800 font-sans">{t('contact.hoursValue')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="bg-stone-100 border border-champagne-150 rounded-xl h-64 flex items-center justify-center overflow-hidden">
            <div className="text-center space-y-2">
              <MapPin size={28} className="text-champagne-500 mx-auto" />
              <p className="text-xs text-stone-500 font-sans">{t('contact.addressValue')}</p>
              <p className="text-[9px] text-stone-400 font-sans">{t('contact.mapPlaceholder')}</p>
            </div>
          </div>

          {/* Quick nav */}
          <button
            onClick={() => navigate('/')}
            className="cursor-pointer w-full flex items-center justify-center gap-2 py-3 text-[10px] tracking-widest uppercase font-bold text-champagne-600 hover:text-champagne-700 border border-champagne-200 rounded-lg hover:bg-champagne-50/50 transition-all font-sans"
          >
            <ArrowLeft size={12} />
            {t('contact.backHome')}
          </button>
        </div>
      </div>
    </div>
  );
}
