import { useState, useEffect, memo } from 'react';
import { ShoppingBag, ArrowRight, X, ShieldCheck, Gem } from 'lucide-react';

// Models & Schemas
import { Product, Order, CartItem } from './types';
import { defaultProducts } from './data/defaultProducts';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ToastContainer, { showToast } from './components/ToastContainer';

// Pages / Views
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import CheckoutSimulation from './pages/CheckoutSimulation';
import OrderConfirmation from './pages/OrderConfirmation';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import Blog from './pages/Blog';
import BlogArticle from './pages/BlogArticle';

export default function App() {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [pageParams, setPageParams] = useState<any>({});

  // Currency fixed to MAD for local Moroccan customers
  const [currency] = useState<'USD' | 'MAD'>('MAD');

  const handleCurrencyToggle = () => {
    // Fixed to MAD - USD selection is removed
  };

  // Core Database States
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  
  // Loading & Sync States
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true);

  // Cart State (stored in localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('ccjaouhara_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // UI Drawer State
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);

  // Synchronize cart with localStorage upon modification (deferred via rAF for non-blocking writes)
  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      try {
        localStorage.setItem('ccjaouhara_cart', JSON.stringify(cart));
      } catch (err) {
        console.error('[Cart Sync Error]', err);
      }
    });
    return () => cancelAnimationFrame(timer);
  }, [cart]);

  // Decode search queries upon initialization (handles Stripe success callback redirect parameters!)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const orderId = urlParams.get('orderId');
    const name = urlParams.get('name');
    const email = urlParams.get('email');
    const total = urlParams.get('total');
    const itemsRaw = urlParams.get('items');

    // If simulating order-redirect or returning from a Stripe Checkout session success page
    if (status === 'success' || orderId) {
      // Navigate to order-confirmation screen passing query attributes as route parameters
      setCurrentPage('order-confirmation');
      setPageParams({
        orderId,
        email,
        name,
        total,
        status
      });
      // Clear the cart on successful checkout redirect
      setCart([]);
    } else {
      // Read initial paths (supports local simulation URL callbacks)
      const pathName = window.location.pathname.replace(/^\//, '');
      if (pathName === 'checkout-simulation') {
        setCurrentPage('checkout-simulation');
      }
    }
  }, []);

  // Fetch precious jewelry products list on mount
  const fetchProductsList = async () => {
    setLoadingProducts(true);
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Server returned error status on products scan');
      }
      const data = await response.json();
      setAllProducts(data);
    } catch (err) {
      console.warn('[API Fetch Warn] Operating products list on fallback data catalog:', err);
      showToast('Backend offline. Loaded local design sheets.', true);
      // Resilience fallback: Prefill client grid to protect preview iframe on initial configurations
      setAllProducts(defaultProducts);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch historic orders placed logs on dev backend mount
  const fetchOrdersLogs = async () => {
    setLoadingOrders(true);
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) {
        throw new Error('Server returned error status on orders query');
      }
      const data = await response.json();
      setAllOrders(data);
    } catch (err) {
      console.warn('[API Fetch Warn] Could not load orders logs from persistence layer:', err);
      setAllOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchProductsList();
    fetchOrdersLogs();
  }, []);

  // Core router change handler (restores scroll position instantly)
  const handlePageChange = (pageName: string, params: any = {}) => {
    setCurrentPage(pageName);
    setPageParams(params);
    setIsCartOpen(false); // Close sliding drawer on redirection
    
    // Smooth scroll back to display top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Handle home curation banner category click
    if (pageName === 'shop' && params?.filterCategory) {
      setActiveCategoryFilter(params.filterCategory);
    }
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number, size: string) => {
    const compositeId = `${product.id}-${size}`;
    setCart((prev) => {
      const index = prev.findIndex((item) => item.id === compositeId);
      if (index !== -1) {
        const nextCart = [...prev];
        nextCart[index].quantity = Math.min(product.stock, nextCart[index].quantity + quantity);
        return nextCart;
      } else {
        return [
          ...prev,
          {
            id: compositeId,
            product_id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            selected_size: size,
            image: product.images[0],
            max_stock: product.stock
          }
        ];
      }
    });

    // Notify user of positive interaction
    showToast('Added to bag ✓');

    // Toggle slide-open drawer for premium interaction
    setIsCartOpen(true);
  };

  // Direct quick-add action from catalog rows
  const handleQuickAdd = (product: Product, size: string) => {
    handleAddToCart(product, 1, size);
  };

  const handleUpdateCartQuantity = (id: string, newQty: number) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Total cart pricing
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="flex flex-col min-h-screen bg-champagne-50/20 selection:bg-champagne-200">
      
      <Marquee />

      {/* Primary Brand Navbar */}
      <Navbar
        currentPage={currentPage}
        onPageChange={handlePageChange}
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        currency={currency}
        onCurrencyToggle={handleCurrencyToggle}
      />

      {/* Main viewport area */}
      <main className="flex-1 py-12 md:py-16">
        {(() => {
          switch (currentPage) {
            case 'home':
              return (
                <Home
                  products={allProducts}
                  isLoading={loadingProducts}
                  onPageChange={handlePageChange}
                  onAddToCartDirect={handleQuickAdd}
                  currency={currency}
                />
              );
            case 'shop':
              return (
                <Shop
                  products={allProducts}
                  isLoading={loadingProducts}
                  initialCategory={activeCategoryFilter}
                  onPageChange={handlePageChange}
                  onAddToCartDirect={handleQuickAdd}
                  onClearInitialCategory={() => setActiveCategoryFilter(null)}
                  currency={currency}
                />
              );
            case 'product':
              return (
                <ProductDetail
                  productId={pageParams.id}
                  allProducts={allProducts}
                  onAddToCart={handleAddToCart}
                  onPageChange={handlePageChange}
                  currency={currency}
                />
              );
            case 'cart':
              return (
                <Cart
                  cart={cart}
                  onUpdateQuantity={handleUpdateCartQuantity}
                  onRemoveItem={handleRemoveCartItem}
                  onPageChange={handlePageChange}
                  currency={currency}
                />
              );
            case 'checkout-simulation':
              return (
                <CheckoutSimulation
                  onPageChange={handlePageChange}
                  onClearCart={handleClearCart}
                  currency={currency}
                />
              );
            case 'order-confirmation':
              return (
                <OrderConfirmation
                  onPageChange={handlePageChange}
                  currency={currency}
                />
              );
      case 'blog':
        return (
          <Blog
            onPageChange={handlePageChange}
            currency={currency}
          />
        );
      case 'blog-article':
        return (
          <BlogArticle
            slug={pageParams.slug}
            onPageChange={handlePageChange}
            currency={currency}
          />
        );
      case 'admin':
        return (
          <AdminDashboard
            products={allProducts}
            orders={allOrders}
            isLoadingProducts={loadingProducts}
            isLoadingOrders={loadingOrders}
            onRefreshProducts={fetchProductsList}
            onRefreshOrders={fetchOrdersLogs}
            currency={currency}
          />
        );
      default:
              return (
                <NotFound onPageChange={handlePageChange} />
              );
          }
        })()}
      </main>

      {/* Sliding Luxury Cart Drawer Panel overlays */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-modal="true" role="dialog">
          
          {/* Backdrop screen */}
          <div
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity duration-500 ease-in-out"
          ></div>

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white border-l border-champagne-105 shadow-2xl flex flex-col justify-between h-full">
              
              {/* Header Drawer */}
              <div className="px-6 py-6 border-b border-champagne-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="text-champagne-500" size={18} />
                  <h2 className="font-serif text-lg text-stone-950 font-semibold tracking-wide">Selected Jewelry</h2>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 text-stone-400 hover:text-stone-900 cursor-pointer"
                  title="Close sidebar"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Line items details selection */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-20 text-stone-400 space-y-3 font-sans">
                    <ShoppingBag className="mx-auto text-stone-200" size={32} />
                    <p className="text-xs">Your bag is currently empty.</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-4 p-3 border border-stone-105 rounded-md hover:border-champagne-100 transition-colors">
                      <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-sm shrink-0 border border-stone-100" />
                      <div className="flex-1 space-y-1">
                        <span className="font-serif text-xs font-semibold text-stone-900 block line-clamp-1">{item.name}</span>
                        <div className="flex justify-between items-baseline text-[10px] text-stone-400">
                          <span>Qty: {item.quantity} • {item.selected_size.split(' ')[0]}</span>
                          <span className="font-serif font-semibold text-stone-900">
                            {currency === 'MAD' 
                              ? `${((item.price * item.quantity) * 10).toLocaleString()} درهم` 
                              : `$${(item.price * item.quantity).toLocaleString()}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Subtotal & Call to actions */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-champagne-100 bg-stone-50/50 space-y-4 font-sans">
                  
                  <div className="flex justify-between items-baseline text-xs pb-2">
                    <span className="text-stone-500">Subtotal:</span>
                    <span className="font-serif text-base font-bold text-stone-900">
                      {currency === 'MAD' 
                        ? `${(cartSubtotal * 10).toLocaleString()} درهم` 
                        : `$${cartSubtotal.toLocaleString()}`}
                    </span>
                  </div>

                  <button
                    onClick={() => handlePageChange('cart')}
                    className="cursor-pointer w-full bg-stone-900 hover:bg-champagne-600 text-white tracking-widest text-[10px] uppercase font-semibold py-4 rounded-sm transition-colors flex items-center justify-center gap-1.5 focus:outline-hidden"
                  >
                    Enter Shopping Bag
                    <ArrowRight size={12} />
                  </button>

                  <div className="flex items-center justify-center gap-1 text-[9px] text-stone-400">
                    <ShieldCheck size={10} className="text-champagne-500" />
                    <span>Insured Courier Deliveries Scheduled</span>
                  </div>

                </div>
              )}

            </div>
          </div>

        </div>
      )}

      {/* Global standard brand footer */}
      <Footer />

      {/* Elegant floating status notifications toast platform */}
      <ToastContainer />

      {/* Floating WhatsApp Button */}
      <a
        id="floating-whatsapp-button"
        href={`https://wa.me/212605091987?text=${encodeURIComponent('مرحبا، بغيت نطلب من ccjaouhara 🌸')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
        aria-label="Contact us on WhatsApp"
      >
        <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.859-4.407 9.862-9.833.001-2.628-1.02-5.1-2.875-6.958C16.604 1.956 14.135.937 11.999.937 6.561.937 2.14 5.344 2.137 10.77c-.001 1.693.447 3.344 1.3 4.794l-.995 3.633 3.731-.973zm11.367-7.354c-.3-.15-1.77-.875-2.046-.975-.276-.1-.477-.15-.677.15-.2.3-.77.975-.945 1.175-.175.2-.35.225-.65.075-.3-.15-1.265-.467-2.41-1.485-.89-.79-1.49-1.77-1.665-2.07-.175-.3-.019-.463.13-.612.135-.135.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.677-1.633-.927-2.233-.24-.582-.486-.503-.678-.512-.175-.008-.375-.01-.575-.01-.2 0-.525.075-.8.375-.275.3-1.05 1.025-1.05 2.5s1.075 2.9 1.225 3.1c.15.2 2.11 3.224 5.112 4.52 3.003 1.297 3.003.865 3.541.815.539-.05 1.77-.725 2.02-1.425.25-.7.25-1.3.175-1.425-.075-.1-.275-.2-.575-.35z"/>
        </svg>
      </a>

      {/* Floating Action Order Button "اطلب الآن" */}
      <button
        id="floating-checkout-btn"
        onClick={() => {
          if (currentPage === 'product') {
            handlePageChange('cart');
          } else {
            handlePageChange('shop');
          }
        }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 md:bottom-24 md:right-6 md:left-auto md:translate-x-0 z-50 bg-[#C5A059] text-white font-serif text-sm font-semibold tracking-widest uppercase rounded-full px-7 py-3.5 shadow-lg flex items-center gap-2 justify-center hover:scale-105 hover:brightness-110 active:scale-95 transition-all duration-300 cursor-pointer animate-floating-btn min-w-[160px] md:min-w-0"
        aria-label="اطلب الآن"
      >
        <Gem className="w-4 h-4" />
        <span className="font-sans font-bold">اطلب الآن</span>
      </button>

    </div>
  );
}

const Marquee = memo(function Marquee() {
  return (
    <div className="bg-stone-900 border-b border-stone-850 text-stone-200 text-[11px] uppercase font-semibold font-sans py-2.5 overflow-hidden relative w-full" dir="rtl">
      <div className="flex whitespace-nowrap select-none" style={{ width: 'max-content' }}>
        <div className="animate-marquee flex items-center shrink-0 pr-8 gap-8 font-sans">
          <span>⭐ أسوارتك كاتحكي عليك</span>
          <span className="text-champagne-500 font-bold">•</span>
          <span>🚚 توصيل لباب الدار</span>
          <span className="text-champagne-500 font-bold">•</span>
          <span>✅ الدفع عند الاستلام</span>
          <span className="text-champagne-500 font-bold">•</span>
          <span>💎 لأن كل مرأة تستاهل الأحسن</span>
          <span className="text-champagne-500 font-bold">•</span>
          <span>🌸 جودة مضمونة 100%</span>
          <span className="text-champagne-500 font-bold">•</span>
          <span>🇲🇦 توصيل لجميع مدن المغرب</span>
          <span className="text-champagne-500 font-bold">•</span>
        </div>
        <div className="animate-marquee flex items-center shrink-0 pr-8 gap-8 font-sans" aria-hidden="true">
          <span>⭐ أسوارتك كاتحكي عليك</span>
          <span className="text-champagne-500 font-bold">•</span>
          <span>🚚 توصيل لباب الدار</span>
          <span className="text-champagne-500 font-bold">•</span>
          <span>✅ الدفع عند الاستلام</span>
          <span className="text-champagne-500 font-bold">•</span>
          <span>💎 لأن كل مرأة تستاهل الأحسن</span>
          <span className="text-champagne-500 font-bold">•</span>
          <span>🌸 جودة مضمونة 100%</span>
          <span className="text-champagne-500 font-bold">•</span>
          <span>🇲🇦 توصيل لجميع مدن المغرب</span>
          <span className="text-champagne-500 font-bold">•</span>
        </div>
      </div>
    </div>
  );
});
