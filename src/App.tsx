import { useState, useEffect, memo } from 'react';
import { Routes, Route, useNavigate, useLocation, useSearchParams, useParams } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ArrowLeft, X, ShieldCheck, Gem, Heart } from 'lucide-react';

import { Product, Order, CartItem, ContactMessage, Subscriber } from './types';
import { defaultProducts } from './data/defaultProducts';
import { useTranslation } from './i18n';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ToastContainer, { showToast } from './components/ToastContainer';

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
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import SizeGuide from './pages/SizeGuide';
import TrackOrder from './pages/TrackOrder';
import Shipping from './pages/Shipping';
import About from './pages/About';
import Press from './pages/Press';
import Wishlist from './pages/Wishlist';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [currency] = useState<'USD' | 'MAD'>('MAD');

  const handleCurrencyToggle = () => {};

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [allMessages, setAllMessages] = useState<ContactMessage[]>([]);
  const [allSubscribers, setAllSubscribers] = useState<Subscriber[]>([]);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [loadingSubscribers, setLoadingSubscribers] = useState(true);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('ccjaouhara_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('ccjaouhara_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const { t, dir } = useTranslation();

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setIsCartOpen(false);
  }, [location.pathname]);

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

  useEffect(() => {
    try {
      localStorage.setItem('ccjaouhara_wishlist', JSON.stringify(wishlist));
    } catch (err) {
      console.error('[Wishlist Sync Error]', err);
    }
  }, [wishlist]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const orderId = urlParams.get('orderId');
    if (status === 'success' || orderId) {
      setCart([]);
      const params = new URLSearchParams();
      if (orderId) params.set('orderId', orderId);
      if (urlParams.get('name')) params.set('name', urlParams.get('name')!);
      if (urlParams.get('email')) params.set('email', urlParams.get('email')!);
      if (urlParams.get('total')) params.set('total', urlParams.get('total')!);
      if (status) params.set('status', status);
      navigate(`/order-confirmation?${params.toString()}`, { replace: true });
    }
  }, []);

  const fetchProductsList = async () => {
    setLoadingProducts(true);
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Server returned error status on products scan');
      const data = await response.json();
      setAllProducts(data);
    } catch (err) {
      console.warn('[API Fetch Warn] Operating products list on fallback data catalog:', err);
      showToast('Backend offline. Loaded local design sheets.', true);
      setAllProducts(defaultProducts);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchOrdersLogs = async () => {
    setLoadingOrders(true);
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) throw new Error('Server returned error status on orders query');
      const data = await response.json();
      setAllOrders(data);
    } catch (err) {
      console.warn('[API Fetch Warn] Could not load orders logs from persistence layer:', err);
      setAllOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchMessagesLogs = async () => {
    setLoadingMessages(true);
    try {
      const response = await fetch('/api/messages');
      if (!response.ok) throw new Error('Server returned error status on messages query');
      const data = await response.json();
      setAllMessages(data);
    } catch (err) {
      console.warn('[API Fetch Warn] Could not load messages from persistence layer:', err);
      setAllMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchSubscribersLogs = async () => {
    setLoadingSubscribers(true);
    try {
      const response = await fetch('/api/newsletter');
      if (!response.ok) throw new Error('Server returned error status on subscribers query');
      const data = await response.json();
      setAllSubscribers(data);
    } catch (err) {
      console.warn('[API Fetch Warn] Could not load subscribers from persistence layer:', err);
      setAllSubscribers([]);
    } finally {
      setLoadingSubscribers(false);
    }
  };

  useEffect(() => {
    fetchProductsList();
    fetchOrdersLogs();
    fetchMessagesLogs();
    fetchSubscribersLogs();
  }, []);

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
    showToast('Added to bag âœ“');
    setIsCartOpen(true);
  };

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

  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getCurrentPage = (pathname: string): string => {
    if (pathname === '/' || pathname === '') return 'home';
    if (pathname.startsWith('/shop')) return 'shop';
    if (pathname.startsWith('/product')) return 'product';
    if (pathname.startsWith('/blog')) return pathname.startsWith('/blog/') ? 'blog-article' : 'blog';
    if (pathname.startsWith('/admin')) return 'admin';
    if (pathname.startsWith('/cart')) return 'cart';
    if (pathname.startsWith('/checkout')) return 'checkout';
    if (pathname.startsWith('/press')) return 'press';
    if (pathname.startsWith('/about')) return 'about';
    if (pathname.startsWith('/shipping')) return 'shipping';
    if (pathname.startsWith('/track-order')) return 'track-order';
    if (pathname.startsWith('/size-guide')) return 'size-guide';
    if (pathname.startsWith('/faq')) return 'faq';
    if (pathname.startsWith('/wishlist')) return 'wishlist';
    if (pathname.startsWith('/contact')) return 'contact';
    return '';
  };

  const handlePageChange = (pageName: string, params?: any) => {
    switch (pageName) {
      case 'home':
        navigate('/');
        break;
      case 'shop':
        if (params?.filterCategory) {
          navigate(`/shop?category=${params.filterCategory}`);
        } else {
          navigate('/shop');
        }
        break;
      case 'product':
        if (params?.id) navigate(`/product/${params.id}`);
        break;
      case 'blog':
        navigate('/blog');
        break;
      case 'blog-article':
        if (params?.slug) navigate(`/blog/${params.slug}`);
        break;
      case 'admin':
        navigate('/admin');
        break;
      case 'cart':
        navigate('/cart');
        break;
      case 'checkout':
        navigate('/checkout');
        break;
      case 'press':
        navigate('/press');
        break;
      case 'about':
        navigate('/about');
        break;
      case 'shipping':
        navigate('/shipping');
        break;
      case 'track-order':
        navigate('/track-order');
        break;
      case 'size-guide':
        navigate('/size-guide');
        break;
      case 'faq':
        navigate('/faq');
        break;
      case 'contact':
        navigate('/contact');
        break;
      case 'wishlist':
        navigate('/wishlist');
        break;
      case 'order-confirmation':
        if (params?.orderId) navigate(`/order-confirmation?orderId=${params.orderId}`);
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-champagne-50/20 selection:bg-champagne-200">

      <Marquee />

      <Navbar
        currentPage={getCurrentPage(location.pathname)}
        onPageChange={handlePageChange}
        cart={cart}
        wishlist={wishlist}
        onOpenCart={() => setIsCartOpen(true)}
        currency={currency}
        onCurrencyToggle={handleCurrencyToggle}
      />

      <main className="flex-1 py-12 md:py-16">
        <Routes>
          <Route path="/" element={<Home products={allProducts} isLoading={loadingProducts} onAddToCartDirect={handleQuickAdd} onPageChange={handlePageChange} wishlist={wishlist} onToggleWishlist={handleToggleWishlist} currency={currency} />} />
          <Route path="/shop" element={<ShopWithParams products={allProducts} isLoading={loadingProducts} onAddToCartDirect={handleQuickAdd} onPageChange={handlePageChange} wishlist={wishlist} onToggleWishlist={handleToggleWishlist} currency={currency} />} />
          <Route path="/product/:id" element={<ProductDetailWithParams allProducts={allProducts} onAddToCart={handleAddToCart} onPageChange={handlePageChange} wishlist={wishlist} onToggleWishlist={handleToggleWishlist} currency={currency} />} />
          <Route path="/cart" element={<Cart cart={cart} onUpdateQuantity={handleUpdateCartQuantity} onRemoveItem={handleRemoveCartItem} onPageChange={handlePageChange} onClearCart={handleClearCart} currency={currency} />} />
          <Route path="/checkout" element={<CheckoutSimulation onClearCart={handleClearCart} onPageChange={handlePageChange} currency={currency} />} />
          <Route path="/order-confirmation" element={<OrderConfirmation onPageChange={handlePageChange} currency={currency} />} />
          <Route path="/blog" element={<Blog onPageChange={handlePageChange} currency={currency} />} />
          <Route path="/blog/:slug" element={<BlogArticleWithParams onPageChange={handlePageChange} currency={currency} />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/size-guide" element={<SizeGuide />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/about" element={<About />} />
          <Route path="/press" element={<Press />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/wishlist" element={<Wishlist wishlist={wishlist} allProducts={allProducts} onToggleWishlist={handleToggleWishlist} onPageChange={handlePageChange} onAddToCartDirect={handleQuickAdd} currency={currency} />} />
          <Route path="/admin" element={<AdminDashboard products={allProducts} orders={allOrders} messages={allMessages} subscribers={allSubscribers} isLoadingProducts={loadingProducts} isLoadingOrders={loadingOrders} isLoadingMessages={loadingMessages} isLoadingSubscribers={loadingSubscribers} onRefreshProducts={fetchProductsList} onRefreshOrders={fetchOrdersLogs} onRefreshMessages={fetchMessagesLogs} onRefreshSubscribers={fetchSubscribersLogs} currency={currency} />} />
          <Route path="*" element={<NotFound onPageChange={handlePageChange} />} />
        </Routes>
      </main>

      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-modal="true" role="dialog">
          <div onClick={() => setIsCartOpen(false)} className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity duration-500 ease-in-out"></div>
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white border-l border-champagne-105 shadow-2xl flex flex-col justify-between h-full">
              <div className="px-6 py-6 border-b border-champagne-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="text-champagne-500" size={18} />
                  <h2 className="font-serif text-lg text-stone-950 font-semibold tracking-wide">{t('app.cart.title')}</h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-1 text-stone-400 hover:text-stone-900 cursor-pointer" title={t('app.cart.close')}><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-20 text-stone-400 space-y-3 font-sans">
                    <ShoppingBag className="mx-auto text-stone-200" size={32} />
                    <p className="text-xs">{t('app.cart.empty')}</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-4 p-3 border border-stone-105 rounded-md hover:border-champagne-100 transition-colors">
                      <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-sm shrink-0 border border-stone-100" />
                      <div className="flex-1 space-y-1">
                        <span className="font-serif text-xs font-semibold text-stone-900 block line-clamp-1">{item.name}</span>
                        <div className="flex justify-between items-baseline text-[10px] text-stone-400">
                          <span>Qty: {item.quantity} â€¢ {item.selected_size.split(' ')[0]}</span>
                          <span className="font-serif font-semibold text-stone-900">
                            {currency === 'MAD' ? `${((item.price * item.quantity) * 10).toLocaleString()} ${t('common.currency')}` : `$${(item.price * item.quantity).toLocaleString()}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {cart.length > 0 && (
                <div className="p-6 border-t border-champagne-100 bg-stone-50/50 space-y-4 font-sans">
                  <div className="flex justify-between items-baseline text-xs pb-2">
                    <span className="text-stone-500">{t('app.cart.subtotal')}</span>
                    <span className="font-serif text-base font-bold text-stone-900">
                      {currency === 'MAD' ? `${(cartSubtotal * 10).toLocaleString()} ${t('common.currency')}` : `$${cartSubtotal.toLocaleString()}`}
                    </span>
                  </div>
                  <button
                    onClick={() => { setIsCartOpen(false); navigate('/cart'); }}
                    className="cursor-pointer w-full bg-stone-900 hover:bg-champagne-600 text-white tracking-widest text-[10px] uppercase font-semibold py-4 rounded-sm transition-colors flex items-center justify-center gap-1.5 focus:outline-hidden"
                  >
                    {t('app.cart.cta')}
                    {dir === 'ltr' ? <ArrowRight size={12} /> : <ArrowLeft size={12} />}
                  </button>
                  <div className="flex items-center justify-center gap-1 text-[9px] text-stone-400">
                    <ShieldCheck size={10} className="text-champagne-500" />
                    <span>{t('app.cart.security')}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
      <ToastContainer />

      <a
        id="floating-whatsapp-button"
        href={`https://wa.me/212605091987?text=${encodeURIComponent(t('app.floating.whatsappText'))}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
        aria-label={t('app.floating.whatsappAria')}
      >
        <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.859-4.407 9.862-9.833.001-2.628-1.02-5.1-2.875-6.958C16.604 1.956 14.135.937 11.999.937 6.561.937 2.14 5.344 2.137 10.77c-.001 1.693.447 3.344 1.3 4.794l-.995 3.633 3.731-.973zm11.367-7.354c-.3-.15-1.77-.875-2.046-.975-.276-.1-.477-.15-.677.15-.2.3-.77.975-.945 1.175-.175.2-.35.225-.65.075-.3-.15-1.265-.467-2.41-1.485-.89-.79-1.49-1.77-1.665-2.07-.175-.3-.019-.463.13-.612.135-.135.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.677-1.633-.927-2.233-.24-.582-.486-.503-.678-.512-.175-.008-.375-.01-.575-.01-.2 0-.525.075-.8.375-.275.3-1.05 1.025-1.05 2.5s1.075 2.9 1.225 3.1c.15.2 2.11 3.224 5.112 4.52 3.003 1.297 3.003.865 3.541.815.539-.05 1.77-.725 2.02-1.425.25-.7.25-1.3.175-1.425-.075-.1-.275-.2-.575-.35z"/>
        </svg>
      </a>

      <button
        id="floating-checkout-btn"
        onClick={() => {
          if (location.pathname.startsWith('/product')) {
            navigate('/cart');
          } else {
            navigate('/shop');
          }
        }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 md:bottom-24 md:right-6 md:left-auto md:translate-x-0 z-50 bg-[#C5A059] text-white font-serif text-sm font-semibold tracking-widest uppercase rounded-full px-7 py-3.5 shadow-lg flex items-center gap-2 justify-center hover:scale-105 hover:brightness-110 active:scale-95 transition-all duration-300 cursor-pointer animate-floating-btn min-w-[160px] md:min-w-0"
        aria-label={t('app.floating.orderNow')}
      >
        <Gem className="w-4 h-4" />
        <span className="font-sans font-bold">{t('app.floating.orderNow')}</span>
      </button>

    </div>
  );
}

function ShopWithParams(props: any) {
  const [sp] = useSearchParams();
  const [initCat, setInitCat] = useState<string | null>(sp.get('category') || null);
  useEffect(() => {
    setInitCat(sp.get('category') || null);
  }, [sp]);
  return (
    <Shop
      {...props}
      initialCategory={initCat}
      onPageChange={props.onPageChange}
      onClearInitialCategory={() => setInitCat(null)}
    />
  );
}

function ProductDetailWithParams(props: any) {
  const { id } = useParams();
  return <ProductDetail {...props} productId={id || ''} />;
}

function BlogArticleWithParams(props: any) {
  const { slug } = useParams();
  return <BlogArticle {...props} slug={slug || ''} />;
}

const Marquee = memo(function Marquee() {
  const { t, dir } = useTranslation();
  const items = t('app.marquee') as unknown as string[];
  return (
    <div className="bg-stone-900 border-b border-stone-850 text-stone-200 text-[11px] uppercase font-semibold font-sans py-2.5 overflow-hidden relative w-full" dir={dir}>
      <div className="flex whitespace-nowrap select-none" style={{ width: 'max-content' }}>
        <div className="animate-marquee flex items-center shrink-0 pr-8 gap-8 font-sans">
          {items.map((item, i) => (
            <span key={i} className={item === 'â€¢' ? 'text-champagne-500 font-bold' : ''}>{item}</span>
          ))}
        </div>
        <div className="animate-marquee flex items-center shrink-0 pr-8 gap-8 font-sans" aria-hidden="true">
          {items.map((item, i) => (
            <span key={i} className={item === 'â€¢' ? 'text-champagne-500 font-bold' : ''}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
});

















