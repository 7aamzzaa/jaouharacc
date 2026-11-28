import React, { useEffect, useRef, useState } from 'react';
import { Cookie, Settings2, X } from 'lucide-react';

import { useTranslation } from '../i18n';
import {
  OPEN_COOKIE_SETTINGS_EVENT,
} from '../config/analytics';
import {
  activateAnalytics,
  deactivateAnalytics,
  readConsentChoice,
  saveConsentChoice,
} from '../analytics/consent';

export default function CookieConsentBanner() {
  const { t, dir } = useTranslation();
  const [hasChoice, setHasChoice] = useState(() => readConsentChoice() !== null);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(
    () => readConsentChoice()?.analytics ?? false
  );
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const choice = readConsentChoice();
    if (choice?.analytics) activateAnalytics();
    else deactivateAnalytics();
  }, []);

  useEffect(() => {
    const openPreferences = () => {
      setAnalyticsEnabled(readConsentChoice()?.analytics ?? false);
      setPreferencesOpen(true);
    };
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, openPreferences);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, openPreferences);
  }, []);

  useEffect(() => {
    if (hasChoice || preferencesOpen) dialogRef.current?.focus();
  }, [hasChoice, preferencesOpen]);

  useEffect(() => {
    if (!preferencesOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPreferencesOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [preferencesOpen]);

  const commit = (analytics: boolean) => {
    saveConsentChoice(analytics);
    setAnalyticsEnabled(analytics);
    setHasChoice(true);
    setPreferencesOpen(false);
  };

  return (
    <>
      {!hasChoice && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookie-banner-title"
          aria-describedby="cookie-banner-desc"
          dir={dir}
          tabIndex={-1}
          className="fixed inset-x-0 bottom-0 z-[70] border-t border-champagne-150 bg-white/98 px-4 py-5 shadow-[0_-12px_40px_rgba(28,25,23,0.12)] backdrop-blur-sm focus:outline-hidden sm:px-6 sm:py-6"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-3 sm:max-w-3xl">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-champagne-150 bg-champagne-50 text-champagne-600">
                <Cookie size={17} />
              </span>
              <div className="space-y-2">
                <h2 id="cookie-banner-title" className="font-serif text-base font-semibold tracking-wide text-stone-900">
                  {t('cookie.banner.title')}
                </h2>
                <p id="cookie-banner-desc" className="font-sans text-xs leading-relaxed text-stone-500">
                  {t('cookie.banner.desc')}
                </p>
                <a
                  href="/privacy"
                  className="font-sans text-[10px] font-semibold uppercase tracking-widest text-champagne-600 underline underline-offset-4 hover:text-stone-900"
                >
                  {t('cookie.banner.privacy')}
                </a>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:shrink-0 sm:justify-end">
              <button
                type="button"
                onClick={() => commit(false)}
                className="cursor-pointer rounded-sm border border-stone-200 px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-widest text-stone-600 transition-colors hover:border-stone-900 hover:text-stone-900 focus:outline-2 focus:outline-offset-2 focus:outline-champagne-500"
              >
                {t('cookie.banner.reject')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAnalyticsEnabled(false);
                  setPreferencesOpen(true);
                }}
                className="cursor-pointer rounded-sm border border-stone-200 px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-widest text-stone-600 transition-colors hover:border-stone-900 hover:text-stone-900 focus:outline-2 focus:outline-offset-2 focus:outline-champagne-500"
              >
                {t('cookie.banner.preferences')}
              </button>
              <button
                type="button"
                onClick={() => commit(true)}
                className="cursor-pointer rounded-sm bg-stone-900 px-5 py-3 font-sans text-[10px] font-semibold uppercase tracking-widest text-white transition-colors hover:bg-champagne-600 focus:outline-2 focus:outline-offset-2 focus:outline-champagne-500"
              >
                {t('cookie.banner.accept')}
              </button>
            </div>
          </div>
        </div>
      )}

      {preferencesOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" dir={dir}>
          <button
            type="button"
            aria-label={t('cookie.banner.close')}
            onClick={() => setPreferencesOpen(false)}
            className="absolute inset-0 cursor-default bg-stone-900/45 backdrop-blur-xs"
          />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-preferences-title"
            aria-describedby="cookie-preferences-desc"
            tabIndex={-1}
            className="relative w-full max-w-lg rounded-sm border border-champagne-150 bg-white p-6 shadow-2xl focus:outline-hidden sm:p-8"
          >
            <div className="flex items-start justify-between gap-4 border-b border-champagne-100 pb-5">
              <div className="flex items-center gap-2">
                <Settings2 size={16} className="text-champagne-600" />
                <h2 id="cookie-preferences-title" className="font-serif text-lg font-semibold tracking-wide text-stone-900">
                  {t('cookie.banner.preferences')}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setPreferencesOpen(false)}
                aria-label={t('cookie.banner.close')}
                className="cursor-pointer rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-900"
              >
                <X size={18} />
              </button>
            </div>

            <p id="cookie-preferences-desc" className="mt-5 font-sans text-xs leading-relaxed text-stone-500">
              {t('cookie.banner.desc')}
            </p>

            <div className="mt-5 space-y-4">
              <div className="rounded-sm border border-stone-100 bg-stone-50/60 p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-sans text-xs font-semibold text-stone-800">{t('cookie.banner.essential')}</span>
                  <input type="checkbox" checked readOnly disabled aria-label={t('cookie.banner.essential')} className="h-4 w-4 accent-stone-900" />
                </div>
              </div>

              <label className="block cursor-pointer rounded-sm border border-stone-100 p-4 transition-colors hover:border-champagne-150">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-sans text-xs font-semibold text-stone-800">{t('cookie.banner.analytics')}</span>
                  <input
                    type="checkbox"
                    checked={analyticsEnabled}
                    onChange={(event) => setAnalyticsEnabled(event.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-champagne-600"
                  />
                </div>
                <span className="mt-2 block font-sans text-[11px] leading-relaxed text-stone-500">
                  {t('cookie.banner.analyticsDesc')}
                </span>
              </label>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setPreferencesOpen(false)}
                className="cursor-pointer rounded-sm border border-stone-200 px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-widest text-stone-600 transition-colors hover:border-stone-900 hover:text-stone-900"
              >
                {t('cookie.banner.close')}
              </button>
              <button
                type="button"
                onClick={() => commit(analyticsEnabled)}
                className="cursor-pointer rounded-sm bg-stone-900 px-5 py-3 font-sans text-[10px] font-semibold uppercase tracking-widest text-white transition-colors hover:bg-champagne-600"
              >
                {t('cookie.banner.save')}
              </button>
            </div>
            <p className="mt-4 font-sans text-[10px] leading-relaxed text-stone-400">
              {t('cookie.banner.notice')}
            </p>
          </div>
        </div>
      )}
    </>
  );
}