import React, { useEffect } from 'react';
import { ShieldCheck, Lock, Cookie, Mail } from 'lucide-react';

import { useTranslation } from '../i18n';

export default function PrivacyPolicy() {
  const { t, dir } = useTranslation();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = t('privacy.seo.title');

    let description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = description?.getAttribute('content') ?? '';
    if (!description) {
      description = document.createElement('meta');
      description.setAttribute('name', 'description');
      document.head.appendChild(description);
    }
    description.setAttribute('content', t('privacy.seo.desc'));

    return () => {
      document.title = previousTitle;
      description?.setAttribute('content', previousDescription);
    };
  }, [t]);

  const sections = [
    { icon: <ShieldCheck size={16} />, title: t('privacy.sections.scope.title'), body: t('privacy.sections.scope.body') },
    { icon: <Lock size={16} />, title: t('privacy.sections.orders.title'), body: t('privacy.sections.orders.body') },
    { icon: <Mail size={16} />, title: t('privacy.sections.messages.title'), body: t('privacy.sections.messages.body') },
    { icon: <Mail size={16} />, title: t('privacy.sections.newsletter.title'), body: t('privacy.sections.newsletter.body') },
    { icon: <Mail size={16} />, title: t('privacy.sections.reviews.title'), body: t('privacy.sections.reviews.body') },
    { icon: <Cookie size={16} />, title: t('privacy.sections.browserStorage.title'), body: t('privacy.sections.browserStorage.body') },
    { icon: <Lock size={16} />, title: t('privacy.sections.analytics.title'), body: t('privacy.sections.analytics.body') },
    { icon: <Cookie size={16} />, title: t('privacy.sections.cookies.title'), body: t('privacy.sections.cookies.body') },
    { icon: <ShieldCheck size={16} />, title: t('privacy.sections.providers.title'), body: t('privacy.sections.providers.body') },
    { icon: <ShieldCheck size={16} />, title: t('privacy.sections.choices.title'), body: t('privacy.sections.choices.body') },
    { icon: <Mail size={16} />, title: t('privacy.sections.rights.title'), body: t('privacy.sections.rights.body') },
    { icon: <ShieldCheck size={16} />, title: t('privacy.sections.children.title'), body: t('privacy.sections.children.body') },
    { icon: <ShieldCheck size={16} />, title: t('privacy.sections.changes.title'), body: t('privacy.sections.changes.body') },
  ];

  return (
    <div dir={dir} className="min-h-screen bg-champagne-50/20 pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.3em] text-champagne-600">
            CCJAOUHARA
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold tracking-wide text-stone-900 sm:text-4xl">
            {t('privacy.title')}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl font-sans text-sm leading-relaxed text-stone-500">
            {t('privacy.intro')}
          </p>
        </header>

        <div className="space-y-4">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-sm border border-champagne-100 bg-white p-6 shadow-[0_8px_30px_rgba(28,25,23,0.04)] sm:p-8"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-champagne-150 bg-champagne-50 text-champagne-600">
                  {section.icon}
                </span>
                <div>
                  <h2 className="font-serif text-lg font-semibold tracking-wide text-stone-900">
                    {section.title}
                  </h2>
                  <p className="mt-3 font-sans text-xs leading-relaxed text-stone-600 sm:text-sm">
                    {section.body}
                  </p>
                </div>
              </div>
            </section>
          ))}


        </div>

        <div className="mt-10 text-center">
          <a
            href={`mailto:${t('privacy.contactEmail')}`}
            className="inline-flex items-center gap-2 rounded-sm bg-stone-900 px-6 py-3 font-sans text-[10px] font-semibold uppercase tracking-widest text-white transition-colors hover:bg-champagne-600"
          >
            <Mail size={13} />
            {t('privacy.contactLink')}
          </a>
        </div>
      </div>
    </div>
  );
}