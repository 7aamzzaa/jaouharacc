import { useState, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function LazyImage({ src, alt, className = '' }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Reset when src changes
    setIsLoaded(false);
  }, [src]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-stone-50 flex items-center justify-center">
      {/* Soft skeletal pulse indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-stone-100/80 animate-pulse flex items-center justify-center">
          <span className="text-[9px] uppercase tracking-widest text-stone-300 font-sans">Luxe Frame</span>
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
