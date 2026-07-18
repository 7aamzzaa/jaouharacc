import React, { useState, useMemo } from 'react';
import { useTranslation } from '../i18n';
import { 
  Database, Plus, Edit, Trash2, ShoppingBag, DollarSign, ListOrdered, 
  Layers, Hammer, Archive, Sparkles, RefreshCw, X, Loader2, LogOut, Lock, Upload
} from 'lucide-react';
import { Product, Order } from '../types';
import { showToast } from '../components/ToastContainer';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  isLoadingProducts: boolean;
  isLoadingOrders: boolean;
  onRefreshProducts: () => void;
  onRefreshOrders: () => void;
  currency: 'USD' | 'MAD';
}

export default function AdminDashboard({
  products,
  orders,
  isLoadingProducts,
  isLoadingOrders,
  onRefreshProducts,
  onRefreshOrders,
  currency
}: AdminDashboardProps) {
  const { t } = useTranslation();
  // Session Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('ccjaouhara_admin_session') === 'authenticated';
  });
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  
  // Products Management Form State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState<boolean>(false);
  
  // Fields for Add / Edit
  const [formName, setFormName] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formPrice, setFormPrice] = useState<number>(100);
  const [formCategory, setFormCategory] = useState<string>('bracelets');
  const [formMaterial, setFormMaterial] = useState<string>('14k Yellow Gold');
  const [formColor, setFormColor] = useState<string>('Gold');
  const [formStock, setFormStock] = useState<number>(10);
  const [formImagesInput, setFormImagesInput] = useState<string>(''); // comma-separated URLs
  
  // Server-Submit actions loading States
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string>('');

  // Authentication Lock handle
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const correctPassword = (import.meta as any).env?.VITE_ADMIN_PASSWORD;
    if (correctPassword && passcode === correctPassword) {
      localStorage.setItem('ccjaouhara_admin_session', 'authenticated');
      setIsAuthenticated(true);
      showToast(t('admin.login.successToast'));
    } else {
      setLoginError(t('admin.login.error'));
      showToast(t('admin.login.errorToast'), true);
    }
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('ccjaouhara_admin_session');
    setIsAuthenticated(false);
    showToast(t('admin.dashboard.logoutToast'));
  };

  // Image upload stream to Supabase Storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    setActionError('');

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Content = reader.result as string;
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: file.name,
            type: file.type,
            base64: base64Content
          })
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Upload returned bad interface status');
        }

        if (data.url) {
          setFormImagesInput(prev => prev ? `${prev}, ${data.url}` : data.url);
          showToast(t('admin.form.uploadSuccess'));
        }
      } catch (err: any) {
        console.error('[Upload trigger error]', err);
        setActionError(err.message || 'Image upload failed. Is your Supabase client properly initialized?');
        showToast(t('admin.form.uploadError'), true);
      } finally {
        setUploadLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Hydrate fields on Edit action click
  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormDescription(product.description);
    setFormPrice(product.price);
    setFormCategory(product.category);
    setFormMaterial(product.material);
    setFormColor(product.color);
    setFormStock(product.stock);
    setFormImagesInput(product.images.join(', '));
    setShowProductForm(true);
    // Scroll smoothly to form
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleOpenAddNew = () => {
    setEditingProduct(null);
    setFormName('');
    setFormDescription('');
    setFormPrice(150);
    setFormCategory('bracelets');
    setFormMaterial('14k Yellow Gold');
    setFormColor('Gold');
    setFormStock(10);
    setFormImagesInput('https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600');
    setShowProductForm(true);
  };

  // Create or Update Product in local Database via API
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    setSubmitLoading(true);

    const imageUrls = formImagesInput
      .split(',')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    const targetProduct: Product = {
      id: editingProduct ? editingProduct.id : 'prod-' + Date.now(),
      name: formName,
      description: formDescription,
      price: Number(formPrice),
      stock: Number(formStock),
      category: formCategory,
      material: formMaterial,
      color: formColor,
      images: imageUrls.length > 0 ? imageUrls : ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600']
    };

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(targetProduct)
      });

      if (!response.ok) {
        throw new Error('Database product transaction protocol failed');
      }

      await response.json();
      showToast(t('admin.form.saveSuccess'));
      onRefreshProducts(); // hydratate clients list
      setShowProductForm(false);
      setEditingProduct(null);
    } catch (err: any) {
      console.error(err);
      setActionError(err.message || 'Server connectivity errors. Failed to save product criteria.');
      showToast(t('admin.form.saveError'), true);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Delete product action trigger
  const handleDeleteProduct = async (id: string) => {
    if (!confirm(t('admin.form.deleteConfirm'))) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Retirement failed');
      }

      showToast(t('admin.form.deleteSuccess'));
      onRefreshProducts(); // refresh products list
    } catch (err: any) {
      showToast(err.message || 'Failed to retire product', true);
    }
  };

  // Delete an order
  const handleDeleteOrder = async (id: string) => {
    if (!confirm(t('admin.ordersTable.deleteConfirm'))) return;
    try {
      const response = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Delete failed');
      showToast(t('admin.ordersTable.deleteSuccess'));
      onRefreshOrders();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete order', true);
    }
  };

  // Update real status of the Order
  const handleStatusUpdate = async (id: string, status: Order['status']) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Database order modification status code error');
      }

      showToast(t('admin.form.orderStatusUpdate', { status: status.toUpperCase() }));
      onRefreshOrders(); // refresh order listings
    } catch (err: any) {
      showToast(err.message || t('admin.form.orderStatusError'), true);
    }
  };

  // Calculations for KPI boards
  const stats = useMemo(() => {
    const totalRev = orders.reduce((sum, o) => o.status !== 'cancelled' ? sum + o.total : sum, 0);
    const itemsCircu = products.reduce((sum, p) => sum + p.stock, 0);
    return {
      grossSales: totalRev,
      ordersQty: orders.length,
      uniquesQty: products.length,
      inventoryStock: itemsCircu
    };
  }, [orders, products]);

  // Calculation of product count per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      bracelets: 0,
      rings: 0,
      earrings: 0,
      anklets: 0,
      necklaces: 0,
      jewelry_sets: 0
    };
    products.forEach((p) => {
      const cat = p.category.toLowerCase();
      if (counts[cat] !== undefined) {
        counts[cat]++;
      } else {
        counts[cat] = 1;
      }
    });
    return counts;
  }, [products]);

  // LOGIN SCREEN IMPLEMENTATION
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 sm:py-24 animate-fade-in">
        <div className="bg-white border border-champagne-300 rounded-lg p-8 shadow-md space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-champagne-50 border border-champagne-150 rounded-full flex items-center justify-center text-champagne-500 mx-auto">
              <Lock size={22} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] uppercase font-bold text-champagne-500 block font-sans tracking-widest">
              {t('admin.login.label')}
            </span>
            <h1 className="font-serif text-2xl text-stone-900 font-semibold">{t('admin.login.heading')}</h1>
            <p className="text-stone-500 text-[11px] leading-relaxed max-w-[280px] mx-auto">
              {t('admin.login.desc')}
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="passcode-field" className="text-[9px] uppercase tracking-widest text-stone-400 font-bold block">{t('admin.login.passcodeLabel')}</label>
              <input
                id="passcode-field"
                type="password"
                required
                placeholder={t('admin.login.passcodePlaceholder')}
                className="w-full bg-stone-50 text-xs px-3 py-3 rounded-sm border border-stone-200 focus:outline-hidden focus:border-champagne-400 font-mono text-center tracking-widest"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
              />
            </div>

            {loginError && (
              <p className="text-[11px] text-rose-500 font-semibold text-center">{loginError}</p>
            )}

            <button
              type="submit"
              className="cursor-pointer w-full bg-stone-900 duration-300 hover:bg-champagne-500 text-white text-xs uppercase tracking-widest py-3.5 font-semibold transition-colors font-medium rounded-sm"
            >
              {t('admin.login.button')}
            </button>
          </form>

            <p className="text-center text-[9px] text-stone-400 italic">
              {t('admin.login.footnote')}
            </p>
        </div>
      </div>
    );
  }

  // MAIN ADMIN DASHBOARD INTERFACE
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-fade-in">
      
      {/* Page Editorial title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline border-b border-champagne-100 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl sm:text-4xl text-stone-950 font-medium">{t('admin.dashboard.heading')}</h1>
            <button
              onClick={handleLogoutClick}
              className="cursor-pointer bg-stone-50 hover:bg-rose-50 border border-stone-200 hover:border-rose-200 text-stone-500 hover:text-rose-600 px-2.5 py-1.5 rounded-sm transition-all text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5"
              title={t('admin.dashboard.logout')}
            >
              <LogOut size={10} /> {t('admin.dashboard.logout')}
            </button>
          </div>
          <p className="text-stone-500 text-xs mt-1">{t('admin.dashboard.desc')}</p>
        </div>

        {/* Action controllers */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              onRefreshProducts();
              onRefreshOrders();
            }}
            className="cursor-pointer bg-white text-stone-700 hover:text-champagne-600 font-sans border border-stone-200 hover:border-champagne-300 p-3 rounded-md transition-colors text-xs font-semibold flex items-center gap-1"
            title={t('admin.dashboard.refresh')}
          >
            <RefreshCw size={14} className={isLoadingProducts || isLoadingOrders ? 'animate-spin' : ''} />
            {t('admin.dashboard.refresh')}
          </button>
          
          <button
            onClick={handleOpenAddNew}
            className="cursor-pointer bg-stone-900 hover:bg-champagne-600 text-white font-sans tracking-widest text-xs uppercase px-5 py-3 rounded-md transition-all flex items-center gap-2 font-medium"
          >
            <Plus size={14} /> {t('admin.dashboard.addProduct')}
          </button>
        </div>
      </div>

      {/* 1. ANALYTICS KPI TILES BOARD */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1 */}
        <div className="bg-white p-5 border border-champagne-100/50 rounded-lg flex items-center space-x-4">
          <div className="p-3 bg-champagne-50 border border-champagne-150 text-champagne-500 rounded-lg shrink-0">
            <DollarSign size={20} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-stone-400 block font-sans">{t('admin.kpi.revenue')}</span>
            <span className="font-serif text-lg sm:text-xl font-bold text-stone-900">
              {currency === 'MAD' 
                ? `${(stats.grossSales * 10).toLocaleString()} ${t('common.currency')}`
                : `$${stats.grossSales.toLocaleString()}`}
            </span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 border border-champagne-100/50 rounded-lg flex items-center space-x-4">
          <div className="p-3 bg-champagne-50 border border-champagne-150 text-champagne-500 rounded-lg shrink-0">
            <ListOrdered size={20} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-stone-400 block font-sans">{t('admin.kpi.orders')}</span>
            <span className="font-serif text-lg sm:text-xl font-bold text-stone-900">{t('admin.kpi.ordersValue', { count: stats.ordersQty })}</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 border border-champagne-100/50 rounded-lg flex items-center space-x-4">
          <div className="p-3 bg-champagne-50 border border-champagne-150 text-champagne-500 rounded-lg shrink-0">
            <Layers size={20} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-stone-400 block font-sans">{t('admin.kpi.designs')}</span>
            <span className="font-serif text-lg sm:text-xl font-bold text-stone-900">{t('admin.kpi.designsValue', { count: stats.uniquesQty })}</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 border border-champagne-100/50 rounded-lg flex items-center space-x-4">
          <div className="p-3 bg-champagne-50 border border-champagne-150 text-champagne-500 rounded-lg shrink-0">
            <Archive size={20} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-stone-400 block font-sans">{t('admin.kpi.inventory')}</span>
            <span className="font-serif text-lg sm:text-xl font-bold text-stone-900">{t('admin.kpi.inventoryValue', { count: stats.inventoryStock })}</span>
          </div>
        </div>

      </div>

      {/* Category Breakdown Cards */}
      <div className="bg-stone-50/50 border border-champagne-105 p-5 rounded-lg">
        <h3 className="text-xs font-serif uppercase tracking-[0.2em] font-semibold text-stone-700 mb-4 flex items-center gap-2">
          <span>✧</span> {t('admin.catalog.heading')}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { key: 'bracelets', label: t('admin.catalog.bracelets') },
            { key: 'rings', label: t('admin.catalog.rings') },
            { key: 'earrings', label: t('admin.catalog.earrings') },
            { key: 'anklets', label: t('admin.catalog.anklets') },
            { key: 'necklaces', label: t('admin.catalog.necklaces') },
            { key: 'jewelry_sets', label: t('admin.catalog.jewelry_sets') }
          ].map((cat) => (
            <div key={cat.key} className="bg-white p-3.5 border border-champagne-100/40 rounded-md text-center shadow-2xs hover:border-champagne-300 transition-all duration-300">
              <span className="text-[10px] tracking-widest uppercase text-stone-400 font-sans block font-semibold">{cat.label}</span>
              <span className="font-serif text-lg font-bold text-champagne-600 block mt-1">{t('admin.catalog.styles', { count: categoryCounts[cat.key] || 0 })}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. DYNAMIC FORM AREA: Add of edit product */}
      {showProductForm && (
        <section className="bg-white border-2 border-champagne-150 rounded-lg p-6 sm:p-8 space-y-6 animate-fade-in relative">
          
          <button
            onClick={() => {
              setShowProductForm(false);
              setEditingProduct(null);
            }}
            className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 cursor-pointer"
            title={t('admin.form.close')}
          >
            <X size={20} />
          </button>

          <div className="pb-4 border-b border-stone-100">
            <h2 className="font-serif text-xl font-medium text-stone-900 flex items-center gap-1.5">
              <Sparkles size={18} className="text-champagne-500" />
              {editingProduct ? t('admin.form.editTitle', { name: editingProduct.name }) : t('admin.form.newTitle')}
            </h2>
            <p className="text-stone-500 text-xs mt-0.5">{t('admin.form.desc')}</p>
          </div>

          <form onSubmit={handleProductSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-1">
                <label htmlFor="product-title" className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">{t('admin.form.name')}</label>
                <input
                  id="product-title"
                  type="text"
                  required
                  placeholder={t('admin.form.namePlaceholder')}
                  className="w-full bg-stone-50 text-xs px-3 py-3 rounded-sm border border-stone-200 focus:outline-hidden focus:border-champagne-400 font-sans"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="product-price" className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">{t('admin.form.price')}</label>
                  <input
                    id="product-price"
                    type="number"
                    required
                    min={1}
                    className="w-full bg-stone-50 text-xs px-3 py-3 rounded-sm border border-stone-200 focus:outline-hidden focus:border-champagne-400 font-mono"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="product-stock" className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">{t('admin.form.stock')}</label>
                  <input
                    id="product-stock"
                    type="number"
                    required
                    min={0}
                    className="w-full bg-stone-50 text-xs px-3 py-3 rounded-sm border border-stone-200 focus:outline-hidden focus:border-champagne-400 font-mono"
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                  />
                </div>
              </div>

            </div>

            <div className="space-y-1">
              <label htmlFor="product-description" className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">{t('admin.form.description')}</label>
              <textarea
                id="product-description"
                rows={3}
                placeholder={t('admin.form.descriptionPlaceholder')}
                className="w-full bg-stone-50 text-xs p-3 rounded-sm border border-stone-200 focus:outline-hidden focus:border-champagne-400 font-sans"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              <div className="space-y-1">
                <label htmlFor="product-category" className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">{t('admin.form.category')}</label>
                <select
                  id="product-category"
                  className="w-full bg-stone-50 text-xs px-3 py-3 rounded-sm border border-stone-200 focus:outline-hidden focus:border-champagne-400 font-sans"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                >
                  <option value="bracelets">{t('admin.catalog.bracelets')}</option>
                  <option value="rings">{t('admin.catalog.rings')}</option>
                  <option value="earrings">{t('admin.catalog.earrings')}</option>
                  <option value="anklets">{t('admin.catalog.anklets')}</option>
                  <option value="necklaces">{t('admin.catalog.necklaces')}</option>
                  <option value="jewelry_sets">{t('admin.catalog.jewelry_sets')}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="product-material" className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">{t('admin.form.material')}</label>
                <input
                  id="product-material"
                  type="text"
                  required
                  placeholder={t('admin.form.materialPlaceholder')}
                  className="w-full bg-stone-50 text-xs px-3 py-3 rounded-sm border border-stone-200 focus:outline-hidden focus:border-champagne-400 font-sans"
                  value={formMaterial}
                  onChange={(e) => setFormMaterial(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="product-color" className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">{t('admin.form.color')}</label>
                <input
                  id="product-color"
                  type="text"
                  required
                  placeholder={t('admin.form.colorPlaceholder')}
                  className="w-full bg-stone-50 text-xs px-3 py-3 rounded-sm border border-stone-200 focus:outline-hidden focus:border-champagne-400 font-sans"
                  value={formColor}
                  onChange={(e) => setFormColor(e.target.value)}
                />
              </div>

            </div>

            <div className="space-y-1">
              <label htmlFor="product-images" className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">
                Visual Image URLs (comma-separated list)
              </label>
              
              <div className="flex gap-3">
                <input
                  id="product-images"
                  type="text"
                  placeholder={t('admin.form.imagesPlaceholder')}
                  className="w-full bg-stone-50 text-xs px-3 py-3 rounded-sm border border-stone-200 focus:outline-hidden focus:border-champagne-400 font-mono flex-1"
                  value={formImagesInput}
                  onChange={(e) => setFormImagesInput(e.target.value)}
                />

                <label className="cursor-pointer bg-stone-900 duration-300 hover:bg-champagne-500 text-white font-sans text-xs uppercase px-4 py-3 rounded-sm font-semibold flex items-center justify-center gap-1.5 min-w-[130px] shrink-0">
                  {uploadLoading ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Upload size={12} />
                  )}
                  <span>{uploadLoading ? t('admin.form.uploading') : t('admin.form.upload')}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadLoading}
                  />
                </label>
              </div>
              <p className="text-[9px] text-stone-400">
                {t('admin.form.uploadNote')}
              </p>
            </div>

            {actionError && (
              <p className="text-xs text-rose-500 font-semibold">{actionError}</p>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-stone-50">
              <button
                type="button"
                onClick={() => {
                  setShowProductForm(false);
                  setEditingProduct(null);
                }}
                className="cursor-pointer bg-white text-stone-700 hover:bg-stone-50 border border-stone-200 px-5 py-3 text-xs uppercase tracking-widest font-semibold transition-colors"
              >
                {t('admin.form.cancel')}
              </button>
              
              <button
                type="submit"
                disabled={submitLoading}
                className="cursor-pointer bg-stone-900 hover:bg-champagne-600 disabled:bg-stone-200 text-white font-sans tracking-widest text-xs uppercase px-7 py-3 font-semibold transition-all flex items-center gap-2 font-medium"
              >
                {submitLoading && <Loader2 size={12} className="animate-spin" />}
                {editingProduct ? t('admin.form.commit') : t('admin.form.introduce')}
              </button>
            </div>

          </form>
        </section>
      )}

      {/* 3. SWITCH TAB NAVIGATIONS */}
      <div className="border-b border-champagne-100 flex gap-6">
        <button
          onClick={() => setActiveTab('products')}
          className={`cursor-pointer pb-4 text-xs tracking-widest uppercase transition-colors font-semibold relative ${
            activeTab === 'products'
              ? 'text-stone-900 border-b-2 border-champagne-500'
              : 'text-stone-400 hover:text-stone-750'
          }`}
        >
          {t('admin.tabs.products', { count: products.length })}
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`cursor-pointer pb-4 text-xs tracking-widest uppercase transition-colors font-semibold relative ${
            activeTab === 'orders'
              ? 'text-stone-900 border-b-2 border-champagne-500'
              : 'text-stone-400 hover:text-stone-750'
          }`}
        >
          {t('admin.tabs.orders', { count: orders.length })}
        </button>
      </div>

      {/* TAB 1 CONTENT: PRODUCTS TABLE */}
      {activeTab === 'products' ? (
        <section className="bg-white border border-champagne-105 rounded-lg overflow-hidden">
          {isLoadingProducts ? (
            <div className="text-center py-16 text-xs text-stone-405 flex flex-col items-center justify-center gap-2">
              <Loader2 className="animate-spin text-champagne-500" />
              <span>{t('admin.productsTable.loading')}</span>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-stone-400 text-xs">
              {t('admin.productsTable.empty')}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-start border-collapse font-sans text-xs">
                <thead>
                  <tr className="bg-champagne-50/50 text-stone-500 border-b border-champagne-100 uppercase tracking-wider text-[10px]">
                    <th className="p-4 font-semibold">{t('admin.productsTable.name')}</th>
                    <th className="p-4 font-semibold">{t('admin.productsTable.category')}</th>
                    <th className="p-4 font-semibold">{t('admin.productsTable.material')}</th>
                    <th className="p-4 font-semibold">{t('admin.productsTable.stock')}</th>
                    <th className="p-4 font-semibold">{t('admin.productsTable.price')}</th>
                    <th className="p-4 text-end font-semibold">{t('admin.productsTable.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-105">
                  {products.map((p) => {
                    const isLowStock = p.stock <= 4;
                    return (
                      <tr key={p.id} className="hover:bg-luxe-pink-50/20">
                        <td className="p-4 flex items-center gap-3">
                          <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded-sm border border-stone-150" />
                          <div>
                            <span className="font-serif font-semibold text-stone-900 block text-sm">{p.name}</span>
                            <span className="text-[10px] font-mono text-stone-400 block">{p.id.toUpperCase()}</span>
                          </div>
                        </td>
                        <td className="p-4 text-stone-600 font-medium whitespace-nowrap capitalize">
                          {({
                            bracelets: t('admin.catalog.bracelets'),
                            rings: t('admin.catalog.rings'),
                            earrings: t('admin.catalog.earrings'),
                            anklets: t('admin.catalog.anklets'),
                            necklaces: t('admin.catalog.necklaces'),
                            jewelry_sets: t('admin.catalog.jewelry_sets')
                          }[p.category.toLowerCase()] || p.category)}
                        </td>
                        <td className="p-4 text-stone-600 font-medium">{p.material}</td>
                        <td className="p-4 font-mono font-medium">
                          <span className={isLowStock ? 'text-rose-500 font-semibold' : 'text-stone-705'}>
                            {t('admin.productsTable.units', { count: p.stock })} {isLowStock && t('admin.productsTable.lowStock')}
                          </span>
                        </td>
                        <td className="p-4 font-serif font-bold text-stone-900 text-sm">
                          {currency === 'MAD' ? `${(p.price * 10).toLocaleString()} ${t('common.currency')}` : `$${p.price.toLocaleString()}`}
                        </td>
                        <td className="p-4 text-end">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditClick(p)}
                              className="bg-white border border-stone-200 text-stone-600 hover:text-champagne-600 hover:border-champagne-300 p-2 rounded-md transition-colors font-semibold"
                              title={t('admin.form.edit')}
                            >
                              <Edit size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="bg-white border border-stone-200 text-stone-600 hover:text-rose-500 hover:border-rose-350 p-2 rounded-md transition-colors font-semibold"
                              title={t('admin.form.delete')}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : (
        /* TAB 2 CONTENT: ENHANCED ORDERS TABLE */
        <section className="bg-white border border-champagne-105 rounded-lg overflow-hidden">
          {/* Search & Filter Bar */}
          <div className="p-4 border-b border-champagne-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <input
              type="text"
              placeholder={t('admin.ordersTable.searchPlaceholder')}
              className="flex-1 bg-stone-50 text-xs px-3 py-2 rounded-sm border border-stone-200 focus:outline-hidden focus:border-champagne-400"
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
            />
            <select
              value={orderFilter}
              onChange={(e) => setOrderFilter(e.target.value)}
              className="bg-stone-50 border border-stone-200 text-[10px] text-stone-700 font-semibold py-2 px-3 focus:outline-hidden focus:border-champagne-400 rounded-sm uppercase tracking-wider"
            >
              <option value="all">{t('admin.ordersTable.all')}</option>
              <option value="pending">{t('admin.ordersTable.pending')}</option>
              <option value="confirmed">{t('admin.ordersTable.confirmed')}</option>
              <option value="shipped">{t('admin.ordersTable.shipped')}</option>
              <option value="delivered">{t('admin.ordersTable.delivered')}</option>
              <option value="cancelled">{t('admin.ordersTable.cancelled')}</option>
            </select>
          </div>

          {isLoadingOrders ? (
            <div className="text-center py-16 text-xs text-stone-405 flex flex-col items-center justify-center gap-2">
              <Loader2 className="animate-spin text-champagne-500" />
              <span>{t('admin.ordersTable.loading')}</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 text-stone-400 text-xs leading-relaxed space-y-2">
              <ShoppingBag className="mx-auto text-stone-200" size={32} />
              <p>{t('admin.ordersTable.empty')}</p>
              <p className="text-[10px]">{t('admin.ordersTable.emptyDesc')}</p>
            </div>
          ) : (
            <>
              {(() => {
                const filtered = orders.filter(o => {
                  const matchesSearch = !orderSearch || 
                    o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                    o.customer_name.toLowerCase().includes(orderSearch.toLowerCase()) ||
                    o.customer_phone.includes(orderSearch) ||
                    o.customer_email?.toLowerCase().includes(orderSearch.toLowerCase());
                  const matchesStatus = orderFilter === 'all' || o.status === orderFilter;
                  return matchesSearch && matchesStatus;
                });

                if (filtered.length === 0) {
                  return <div className="text-center py-12 text-stone-400 text-xs">{t('admin.ordersTable.noResults')}</div>;
                }

                return (
                  <div className="overflow-x-auto">
                    <table className="w-full text-start border-collapse font-sans text-xs">
                      <thead>
                        <tr className="bg-champagne-50/50 text-stone-500 border-b border-champagne-100 uppercase tracking-wider text-[10px]">
                          <th className="p-4 font-semibold">{t('admin.ordersTable.ref')}</th>
                          <th className="p-4 font-semibold">{t('admin.ordersTable.date')}</th>
                          <th className="p-4 font-semibold">{t('admin.ordersTable.items')}</th>
                          <th className="p-4 font-semibold">{t('admin.ordersTable.total')}</th>
                          <th className="p-4 font-semibold">{t('admin.ordersTable.status')}</th>
                          <th className="p-4 text-end font-semibold">{t('admin.ordersTable.actions')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-105">
                        {filtered.map((o) => {
                          const statusColors: Record<string, string> = {
                            pending: 'bg-amber-50 text-amber-700 border-amber-200',
                            confirmed: 'bg-sky-50 text-sky-700 border-sky-200',
                            shipped: 'bg-blue-50 text-blue-700 border-blue-200',
                            delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                            cancelled: 'bg-stone-100 text-stone-550 border-stone-250',
                          };
                          const isExpanded = expandedOrderId === o.id;

                          return (
                            <React.Fragment key={o.id}>
                              <tr className="hover:bg-luxe-pink-50/20 cursor-pointer" onClick={() => setExpandedOrderId(isExpanded ? null : o.id)}>
                                <td className="p-4">
                                  <span className="font-mono font-semibold text-stone-900 block">{o.id}</span>
                                  <span className="text-stone-550 block font-sans text-[11px] font-medium mt-0.5">{o.customer_name}</span>
                                  <span className="text-stone-400 block font-mono text-[9px] truncate max-w-[150px]">{o.customer_phone}</span>
                                </td>
                                <td className="p-4 text-stone-500 font-mono">
                                  {o.created_at ? new Date(o.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' }) : t('admin.ordersTable.na')}
                                </td>
                                <td className="p-4">
                                  <div className="space-y-1 max-w-sm">
                                    {o.items?.map((item: any, idx: number) => (
                                      <div key={idx} className="flex justify-between items-baseline text-[11px] text-stone-600">
                                        <span className="line-clamp-1">{item.name} <strong className="text-stone-440">x{item.quantity}</strong></span>
                                        <span className="font-mono font-medium pl-2">{item.selected_size?.split(' ')[0] || ''}</span>
                                      </div>
                                    ))}
                                  </div>
                                </td>
                                <td className="p-4 font-serif font-bold text-stone-900 text-sm">
                                  {currency === 'MAD' 
                                    ? `${((o.total || 0) * 10).toLocaleString()} ${t('common.currency')}` 
                                    : `$${(o.total || 0).toLocaleString()}`}
                                </td>
                                <td className="p-4">
                                  <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-md border text-[10px] uppercase font-sans tracking-wide ${statusColors[o.status] || 'bg-stone-50 text-stone-500'}`}>
                                    {o.status}
                                  </span>
                                </td>
                                <td className="p-4 text-end">
                                  <div className="flex items-center justify-end gap-2">
                                    <select
                                      value={o.status}
                                      onClick={(e) => e.stopPropagation()}
                                      onChange={(e) => handleStatusUpdate(o.id, e.target.value as Order['status'])}
                                      className="bg-transparent border border-stone-200 text-[10px] text-stone-700 font-semibold py-1 px-2 focus:outline-hidden focus:border-champagne-400 rounded-sm uppercase tracking-wider"
                                    >
                                      <option value="pending">{t('admin.ordersTable.pending')}</option>
                                      <option value="confirmed">{t('admin.ordersTable.confirmed')}</option>
                                      <option value="shipped">{t('admin.ordersTable.shipped')}</option>
                                      <option value="delivered">{t('admin.ordersTable.delivered')}</option>
                                      <option value="cancelled">{t('admin.ordersTable.cancelled')}</option>
                                    </select>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); handleDeleteOrder(o.id); }}
                                      className="bg-white border border-stone-200 text-stone-600 hover:text-rose-500 hover:border-rose-350 p-2 rounded-md transition-colors"
                                      title={t('admin.ordersTable.delete')}
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                              {isExpanded && (
                                <tr>
                                  <td colSpan={6} className="p-4 bg-stone-50/50 border-b border-champagne-100">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                      <div className="space-y-1">
                                        <h4 className="text-[10px] uppercase tracking-widest font-semibold text-stone-500">{t('admin.ordersTable.contactInfo')}</h4>
                                        <p className="text-stone-900 font-medium">{o.customer_name}</p>
                                        <p className="text-stone-600">{o.customer_phone}</p>
                                        {o.customer_email && <p className="text-stone-500">{o.customer_email}</p>}
                                      </div>
                                      <div className="space-y-1">
                                        <h4 className="text-[10px] uppercase tracking-widest font-semibold text-stone-500">{t('admin.ordersTable.shippingAddress')}</h4>
                                        <p className="text-stone-600">{o.customer_street}{o.customer_apartment ? `, ${o.customer_apartment}` : ''}</p>
                                        <p className="text-stone-600">{o.customer_city}, {o.customer_country}</p>
                                      </div>
                                      <div className="space-y-1">
                                        <h4 className="text-[10px] uppercase tracking-widest font-semibold text-stone-500">{t('admin.ordersTable.pricing')}</h4>
                                        <p className="text-stone-600">{t('admin.ordersTable.subtotal')}: {currency === 'MAD' ? `${((o.subtotal || 0) * 10).toLocaleString()} ${t('common.currency')}` : `$${(o.subtotal || 0).toLocaleString()}`}</p>
                                        {o.discount_amount > 0 && <p className="text-emerald-600">{t('admin.ordersTable.discount')}: -{currency === 'MAD' ? `${((o.discount_amount || 0) * 10).toLocaleString()} ${t('common.currency')}` : `$${(o.discount_amount || 0).toLocaleString()}`} {o.discount_code ? `(${o.discount_code})` : ''}</p>}
                                        <p className="text-stone-900 font-semibold">{t('admin.ordersTable.total')}: {currency === 'MAD' ? `${((o.total || 0) * 10).toLocaleString()} ${t('common.currency')}` : `$${(o.total || 0).toLocaleString()}`}</p>
                                      </div>
                                      <div className="space-y-1">
                                        <h4 className="text-[10px] uppercase tracking-widest font-semibold text-stone-500">{t('admin.ordersTable.payment')}</h4>
                                        <p className="text-stone-600 capitalize">{o.payment_method === 'cod' ? t('admin.ordersTable.cashOnDelivery') : o.payment_method}</p>
                                        {o.order_notes && (
                                          <>
                                            <h4 className="text-[10px] uppercase tracking-widest font-semibold text-stone-500 mt-2">{t('admin.ordersTable.notes')}</h4>
                                            <p className="text-stone-500 italic">{o.order_notes}</p>
                                          </>
                                        )}
                                        <p className="text-[10px] text-stone-400 mt-1">{t('admin.ordersTable.placedOn')} {new Date(o.created_at).toLocaleString()}</p>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </>
          )}
        </section>
      )}

    </div>
  );
}
