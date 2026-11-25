import { useEffect, useRef, useState } from 'react';
import { ImageOff } from 'lucide-react';
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
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Track the exact source that succeeded/failed. Comparing against `src`
  // prevents a stale load/error event from an earlier source from marking a
  // newly rendered product as loaded.
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const isLoaded = !!src && loadedSrc === src;
  const isError = !src || failedSrc === src;
  const showPlaceholder = !isLoaded && !isError;

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    let cancelled = false;
    const checkCachedState = () => {
      if (cancelled) return;

      if (!src) {
        setFailedSrc(src);
        return;
      }

      // Cached images can become `complete` before React sees an onLoad event.
      // A few bounded checks close that race without creating a retry loop.
      if (img.complete) {
        if (img.naturalWidth > 0) {
          setLoadedSrc(src);
        } else if (img.currentSrc) {
          // A selected source with zero dimensions means the URL truly failed.
          setFailedSrc(src);
        }
      }
    };

    checkCachedState();
    const timers = [0, 50, 250, 1000].map((delay) => window.setTimeout(checkCachedState, delay));

    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [src]);

  const handleLoad = () => {
    if (src) setLoadedSrc(src);
  };

  const handleError = () => {
    if (src) setFailedSrc(src);
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-stone-50 flex items-center justify-center">
      <img
        ref={imgRef}
        src={src || undefined}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`h-full w-full object-cover ${className}`}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        referrerPolicy="no-referrer"
      />

      {showPlaceholder && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-stone-100/80 flex items-center justify-center transition-opacity duration-700 ease-in-out"
        >
          <span className="text-[9px] uppercase tracking-widest text-stone-300 font-sans">
            {t('lazyImage.loading')}
          </span>
        </div>
      )}

      {isError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-stone-50 text-stone-400">
          <ImageOff size={18} strokeWidth={1.5} />
          <span className="text-[9px] uppercase tracking-widest font-sans text-center px-2">
            {t('lazyImage.failed') || 'Image unavailable'}
          </span>
        </div>
      )}
    </div>
  );
}
