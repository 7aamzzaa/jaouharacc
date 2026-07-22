import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from '../i18n';

const FAQ_ITEMS = ['waterproof', 'color', 'material', 'shipping', 'return'] as const;

export default function FAQAccordion() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      {FAQ_ITEMS.map((key, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={key} className="border-b border-champagne-100 last:border-b-0">
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between py-4 px-0 text-left cursor-pointer transition-colors hover:text-champagne-600 gap-4"
            >
              <span className="font-serif text-sm text-stone-800 font-medium">
                {t(`productDetail.faq.${key}.question`)}
              </span>
              <ChevronDown
                size={14}
                className={`text-stone-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="text-stone-500 text-xs sm:text-sm leading-relaxed font-sans">
                {t(`productDetail.faq.${key}.answer`)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
