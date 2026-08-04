import {
  Home,
  ShoppingBag,
  ShoppingCart,
  Heart,
  Phone,
} from "lucide-react";

import { useTranslation } from "../i18n";

type MobileBottomNavProps = {
  currentPage: string;
  cartCount: number;
  wishlistCount: number;
  onPageChange: (pageName: string, params?: any) => void;
};

export default function MobileBottomNav({
  currentPage,
  cartCount,
  wishlistCount,
  onPageChange,
}: MobileBottomNavProps) {
  const { t, dir } = useTranslation();

  const items = [
    { page: "home", icon: Home, label: t("app.bottomNav.home") },
    { page: "shop", icon: ShoppingBag, label: t("app.bottomNav.shop") },
    { page: "cart", icon: ShoppingCart, label: t("app.bottomNav.cart"), badge: cartCount },
    { page: "wishlist", icon: Heart, label: t("app.bottomNav.wishlist"), badge: wishlistCount },
    { page: "contact", icon: Phone, label: t("app.bottomNav.contact") },
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-white/95 backdrop-blur-md border-t border-champagne-150 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      dir={dir}
    >
      <div className="grid grid-cols-5 items-stretch">
        {items.map(({ page, icon: Icon, label, badge }) => {
          const active = currentPage === page;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              aria-label={label}
              className={`relative flex flex-col items-center justify-center gap-1 py-2.5 cursor-pointer focus:outline-hidden transition-colors ${
                active ? "text-champagne-500" : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <span className="relative">
                <Icon size={22} strokeWidth={active ? 2 : 1.5} />
                {badge != null && badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 inline-flex items-center justify-center rounded-full bg-champagne-500 text-white text-[9px] font-bold leading-none">
                    {badge > 99 ? "99+" : badge}
                  </span>
                )}
              </span>
              <span className={`max-w-full truncate text-[10px] font-semibold tracking-wide ${active ? "text-champagne-500" : "text-stone-500"}`}>
                {label}
              </span>
              {active && <span className="absolute top-0 w-8 h-0.5 bg-champagne-500 rounded-b" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
