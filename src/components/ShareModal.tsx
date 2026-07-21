import { useEffect, useRef } from 'react';
import { Facebook, Instagram, Link, X } from 'lucide-react';
import { showToast } from './ToastContainer';
import { useTranslation } from '../i18n';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productUrl: string;
}

const WHATSAPP_PATH = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-1.099-1.005-1.84-2.245-2.055-2.62-.217-.374-.023-.576.163-.763.166-.166.368-.433.555-.65.185-.217.247-.373.37-.623.117-.25-.062-.468-.277-.468-.274 0-.59-.083-.926-.083-.296 0-.564.028-.89.15-.33.127-1.002.49-1.027 1.29-.025.8.584 1.572.672 1.68.088.108 1.16 1.77 2.81 2.48.39.168.695.269.934.345.397.127.758.109 1.044.066.323-.048.965-.395 1.101-.776.136-.381.136-.708.095-.775-.04-.067-.148-.108-.296-.19zM12 2C6.48 2 2 6.48 2 12c0 1.89.523 3.688 1.418 5.236L2 22l4.888-1.378A9.956 9.956 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.591 0-3.084-.496-4.318-1.332l-.31-.195-2.9.817.864-2.826-.19-.304A7.965 7.965 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z';

export default function ShareModal({ isOpen, onClose, productName, productUrl }: ShareModalProps) {
  const { t } = useTranslation();
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;
    const buttons = modalRef.current.querySelectorAll<HTMLElement>('button');
    buttons[0]?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  const encodedUrl = encodeURIComponent(productUrl);
  const encodedName = encodeURIComponent(productName);
  const whatsappUrl = `https://wa.me/?text=${encodedName}%20${encodedUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const instagramUrl = 'https://www.instagram.com/ccjaouhara/';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(productUrl).then(() => {
      showToast(t('productDetail.shareCopied'));
      onClose();
    });
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('productDetail.shareTitle')}
        className="bg-white w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
        style={{
          animation: 'shareModalIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-champagne-100">
          <h3 className="font-serif text-lg text-stone-900 font-medium">
            {t('productDetail.shareTitle')}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 transition-colors text-stone-400 hover:text-stone-600"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-6 space-y-3">
          <button
            onClick={() => window.open(whatsappUrl, '_blank')}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d={WHATSAPP_PATH} />
              </svg>
            </span>
            <span className="font-sans text-sm font-semibold">WhatsApp</span>
          </button>

          <button
            onClick={() => window.open(facebookUrl, '_blank')}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl bg-[#1877F2] hover:bg-[#166FE5] text-white transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20">
              <Facebook size={20} />
            </span>
            <span className="font-sans text-sm font-semibold">Facebook</span>
          </button>

          <button
            onClick={() => window.open(instagramUrl, '_blank')}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20">
              <Instagram size={20} />
            </span>
            <span className="font-sans text-sm font-semibold">Instagram</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-stone-200/70">
              <Link size={20} className="text-stone-600" />
            </span>
            <span className="font-sans text-sm font-semibold">{t('productDetail.shareCopyLink')}</span>
          </button>
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl border border-stone-200 text-stone-600 font-sans text-sm font-medium hover:bg-stone-50 transition-all cursor-pointer"
          >
            {t('productDetail.shareCancel')}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes shareModalIn {
          from {
            opacity: 0;
            transform: translateY(1.5rem) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
