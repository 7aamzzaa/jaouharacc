import { useState, useEffect } from 'react';
import { Check, AlertCircle, X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

export function showToast(message: string, isError: boolean = false) {
  window.dispatchEvent(
    new CustomEvent('toast', {
      detail: { message, type: isError ? 'error' : 'success' },
    })
  );
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail as { message: string; type: 'success' | 'error' };
      if (!detail) return;

      const newToast: Toast = {
        id: Math.random().toString(36).substring(2, 9),
        message: detail.message,
        type: detail.type,
      };

      setToasts((prev) => [...prev, newToast]);

      // Auto dismiss after 3.5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 3500);
    };

    window.addEventListener('toast', handleToastEvent);
    return () => {
      window.removeEventListener('toast', handleToastEvent);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 bg-white border rounded-sm px-4 py-3.5 shadow-lg animate-[slide-in_0.3s_ease-out] border-champagne-300`}
          style={{
            animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          {toast.type === 'success' ? (
            <div className="w-5 h-5 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
              <Check size={12} strokeWidth={3} />
            </div>
          ) : (
            <div className="w-5 h-5 bg-rose-50 border border-rose-100 text-rose-500 rounded-full flex items-center justify-center shrink-0">
              <AlertCircle size={12} strokeWidth={3} />
            </div>
          )}

          <p className="font-sans text-xs font-semibold text-stone-800 flex-1 leading-snug">
            {toast.message}
          </p>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-stone-400 hover:text-stone-700 transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      ))}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(1rem);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
