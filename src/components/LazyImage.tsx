import { useState, useEffect } from 'react';
import { useTranslation } from '../i18n';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function LazyImage({ src, alt, className = '' }: LazyImageProps) {
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
  }, [src]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-stone-50 flex items-center justify-center">
      {!isLoaded && (
        <div className="absolute inset-0 bg-stone-100/80 animate-pulse flex items-center justify-center">
          <span className="text-[9px] uppercase tracking-widest text-stone-300 font-sans">{t('lazyImage.loading')}</span>
        </div>
      )}
      
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={`transition-opacity duration-700 ease-in-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
