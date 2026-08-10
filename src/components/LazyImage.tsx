import { useState, useEffect } from 'react';
import { useTranslation } from '../i18n';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
}

export default function LazyImage({ src, alt, className = '', loading = 'lazy', fetchPriority = 'auto' }: LazyImageProps) {
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
          loading === 'eager' || isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
