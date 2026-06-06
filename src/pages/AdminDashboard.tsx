import React, { useState, useMemo } from 'react';
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
  // Session Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('ccjaouhara_admin_session') === 'authenticated';
  });
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  
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
      showToast('Admin authorization granted! ✓');
    } else {
      setLoginError('Incorrect artisan passcode. Access blocked.');
      showToast('Login failed ✗', true);
    }
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('ccjaouhara_admin_session');
    setIsAuthenticated(false);
    showToast('Securely logged out.');
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
          showToast('Image uploaded successfully! ✓');
        }
      } catch (err: any) {
        console.error('[Upload trigger error]', err);
        setActionError(err.message || 'Image upload failed. Is your Supabase client properly initialized?');
        showToast('Storage upload failed ✗', true);
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
      showToast('Product settings successfully recorded! ✓');
      onRefreshProducts(); // hydratate clients list
      setShowProductForm(false);
      setEditingProduct(null);
    } catch (err: any) {
      console.error(err);
      setActionError(err.message || 'Server connectivity errors. Failed to save product criteria.');
      showToast('Failed to save product ✗', true);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Delete product action trigger
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to retire this product from circulation? This operation is tarnish-permanent.')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Retirement failed');
      }

      showToast('Product successfully retired.');
      onRefreshProducts(); // refresh products list
    } catch (err: any) {
      showToast(err.message || 'Failed to retire product', true);
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

      showToast(`Order status updated to "${status.toUpperCase()}"! ✓`);
      onRefreshOrders(); // refresh order listings
    } catch (err: any) {
      showToast(err.message || 'Failed to commit state of delivery', true);
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
              Security Protocol
            </span>
            <h1 className="font-serif text-2xl text-stone-900 font-semibold">ccjaouhara Atelier</h1>
            <p className="text-stone-500 text-[11px] leading-relaxed max-w-[280px] mx-auto">
              Please enter the master artisan passcode to access administrative control logs & inventory.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="passcode-field" className="text-[9px] uppercase tracking-widest text-stone-400 font-bold block">Artisan Passcode</label>
              <input
                id="passcode-field"
                type="password"
                required
                placeholder="••••••••••••"
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
              Authorize Locker
            </button>
          </form>

          <p className="text-center text-[9px] text-stone-400 italic">
            Enter administrative passcode configured via environment variable.
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
            <h1 className="font-serif text-3xl sm:text-4xl text-stone-950 font-medium">Bespoke Admin Center</h1>
            <button
              onClick={handleLogoutClick}
              className="cursor-pointer bg-stone-50 hover:bg-rose-50 border border-stone-200 hover:border-rose-200 text-stone-500 hover:text-rose-600 px-2.5 py-1.5 rounded-sm transition-all text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5"
              title="Logout session"
            >
              <LogOut size={10} /> Logout
            </button>
          </div>
          <p className="text-stone-500 text-xs mt-1">Configure and manage active inventories, edit technical sheets, and fulfill placed shipments.</p>
        </div>

        {/* Action controllers */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              onRefreshProducts();
              onRefreshOrders();
            }}
            className="cursor-pointer bg-white text-stone-700 hover:text-champagne-600 font-sans border border-stone-200 hover:border-champagne-300 p-3 rounded-md transition-colors text-xs font-semibold flex items-center gap-1"
            title="Reload items"
          >
            <RefreshCw size={14} className={isLoadingProducts || isLoadingOrders ? 'animate-spin' : ''} />
            Refresh Files
          </button>
          
          <button
            onClick={handleOpenAddNew}
            className="cursor-pointer bg-stone-900 hover:bg-champagne-600 text-white font-sans tracking-widest text-xs uppercase px-5 py-3 rounded-md transition-all flex items-center gap-2 font-medium"
          >
            <Plus size={14} /> Add Bracelet
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
            <span className="text-[10px] uppercase font-semibold text-stone-400 block font-sans">Active Revenue</span>
            <span className="font-serif text-lg sm:text-xl font-bold text-stone-900">
              {currency === 'MAD' 
                ? `${(stats.grossSales * 10).toLocaleString()} درهم`
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
            <span className="text-[10px] uppercase font-semibold text-stone-400 block font-sans">Lifetime Orders</span>
            <span className="font-serif text-lg sm:text-xl font-bold text-stone-900">{stats.ordersQty} orders</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 border border-champagne-100/50 rounded-lg flex items-center space-x-4">
          <div className="p-3 bg-champagne-50 border border-champagne-150 text-champagne-500 rounded-lg shrink-0">
            <Layers size={20} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-stone-400 block font-sans">Unique Designs</span>
            <span className="font-serif text-lg sm:text-xl font-bold text-stone-900">{stats.uniquesQty} styles</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 border border-champagne-100/50 rounded-lg flex items-center space-x-4">
          <div className="p-3 bg-champagne-50 border border-champagne-150 text-champagne-500 rounded-lg shrink-0">
            <Archive size={20} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-stone-400 block font-sans">Total Inventory</span>
            <span className="font-serif text-lg sm:text-xl font-bold text-stone-900">{stats.inventoryStock} items</span>
          </div>
        </div>

      </div>

      {/* Category Breakdown Cards */}
      <div className="bg-stone-50/50 border border-champagne-105 p-5 rounded-lg">
        <h3 className="text-xs font-serif uppercase tracking-[0.2em] font-semibold text-stone-700 mb-4 flex items-center gap-2">
          <span>✧</span> Live Catalog Curation breakdown
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { key: 'bracelets', label: 'Bracelets' },
            { key: 'rings', label: 'Rings' },
            { key: 'earrings', label: 'Earrings' },
            { key: 'anklets', label: 'Anklets' },
            { key: 'necklaces', label: 'Necklaces' },
            { key: 'jewelry_sets', label: 'Jewelry Sets' }
          ].map((cat) => (
            <div key={cat.key} className="bg-white p-3.5 border border-champagne-100/40 rounded-md text-center shadow-2xs hover:border-champagne-300 transition-all duration-300">
              <span className="text-[10px] tracking-widest uppercase text-stone-400 font-sans block font-semibold">{cat.label}</span>
              <span className="font-serif text-lg font-bold text-champagne-600 block mt-1">{categoryCounts[cat.key] || 0} styles</span>
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
            title="Close Drawer"
          >
            <X size={20} />
          </button>

          <div className="pb-4 border-b border-stone-100">
            <h2 className="font-serif text-xl font-medium text-stone-900 flex items-center gap-1.5">
              <Sparkles size={18} className="text-champagne-500" />
              {editingProduct ? `Edit Sheet: ${editingProduct.name}` : 'Introduce a Bespoke Assembly Draft'}
            </h2>
            <p className="text-stone-500 text-xs mt-0.5">Please define technical metrics, fine metals, and photo URLs for standard catalog hydration.</p>
          </div>

          <form onSubmit={handleProductSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-1">
                <label htmlFor="product-title" className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">Bracelet Title Name *</label>
                <input
                  id="product-title"
                  type="text"
                  required
                  placeholder="e.g. Florentine Gold Chain"
                  className="w-full bg-stone-50 text-xs px-3 py-3 rounded-sm border border-stone-200 focus:outline-hidden focus:border-champagne-400 font-sans"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="product-price" className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">Retail Price (USD) *</label>
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
                  <label htmlFor="product-stock" className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">Initial Stock *</label>
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
              <label htmlFor="product-description" className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">Craftsman Narrative Description</label>
              <textarea
                id="product-description"
                rows={3}
                placeholder="Narrate the heritage story, gemstone quality, and clasp structures of this piece..."
                className="w-full bg-stone-50 text-xs p-3 rounded-sm border border-stone-200 focus:outline-hidden focus:border-champagne-400 font-sans"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              <div className="space-y-1">
                <label htmlFor="product-category" className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">Category Group *</label>
                <select
                  id="product-category"
                  className="w-full bg-stone-50 text-xs px-3 py-3 rounded-sm border border-stone-200 focus:outline-hidden focus:border-champagne-400 font-sans"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                >
                  <option value="bracelets">Bracelets</option>
                  <option value="rings">Rings</option>
                  <option value="earrings">Earrings</option>
                  <option value="anklets">Anklets</option>
                  <option value="necklaces">Necklaces</option>
                  <option value="jewelry_sets">Jewelry Sets</option>
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="product-material" className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">Core Material *</label>
                <input
                  id="product-material"
                  type="text"
                  required
                  placeholder="e.g. 18k Rose Gold"
                  className="w-full bg-stone-50 text-xs px-3 py-3 rounded-sm border border-stone-200 focus:outline-hidden focus:border-champagne-400 font-sans"
                  value={formMaterial}
                  onChange={(e) => setFormMaterial(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="product-color" className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">Color Option *</label>
                <input
                  id="product-color"
                  type="text"
                  required
                  placeholder="e.g. Rose Gold / Silver"
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
                  placeholder="https://images.unsplash.com/..., https://images.unsplash.com/..."
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
                  <span>{uploadLoading ? 'Uploading...' : 'Upload File'}</span>
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
                Please reference high-resolution Unsplash URLs OR click 'Upload File' to host images on Supabase Storage bucket. Separate multiple frames with commas.
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
                Cancel Draft
              </button>
              
              <button
                type="submit"
                disabled={submitLoading}
                className="cursor-pointer bg-stone-900 hover:bg-champagne-600 disabled:bg-stone-200 text-white font-sans tracking-widest text-xs uppercase px-7 py-3 font-semibold transition-all flex items-center gap-2 font-medium"
              >
                {submitLoading && <Loader2 size={12} className="animate-spin" />}
                {editingProduct ? 'Commit Changes' : 'Introduce to Catalog'}
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
          Active Jewelry Products ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`cursor-pointer pb-4 text-xs tracking-widest uppercase transition-colors font-semibold relative ${
            activeTab === 'orders'
              ? 'text-stone-900 border-b-2 border-champagne-500'
              : 'text-stone-400 hover:text-stone-750'
          }`}
        >
          Customer Order Logs ({orders.length})
        </button>
      </div>

      {/* TAB 1 CONTENT: PRODUCTS TABLE */}
      {activeTab === 'products' ? (
        <section className="bg-white border border-champagne-105 rounded-lg overflow-hidden">
          {isLoadingProducts ? (
            <div className="text-center py-16 text-xs text-stone-405 flex flex-col items-center justify-center gap-2">
              <Loader2 className="animate-spin text-champagne-500" />
              <span>Retrieving current precious catalog entries...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-stone-400 text-xs">
              No products available in the database registry. Click 'Add Bracelet' to begin building the closet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-sans text-xs">
                <thead>
                  <tr className="bg-champagne-50/50 text-stone-500 border-b border-champagne-100 uppercase tracking-wider text-[10px]">
                    <th className="p-4 font-semibold">Bracelet Details</th>
                    <th className="p-4 font-semibold">Category</th>
                    <th className="p-4 font-semibold">Material</th>
                    <th className="p-4 font-semibold">Stock</th>
                    <th className="p-4 font-semibold">Retail Price</th>
                    <th className="p-4 text-right font-semibold">Action Control</th>
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
                          {{
                            bracelets: 'Bracelets',
                            rings: 'Rings',
                            earrings: 'Earrings',
                            anklets: 'Anklets',
                            necklaces: 'Necklaces',
                            jewelry_sets: 'Jewelry Sets'
                          }[p.category.toLowerCase()] || p.category}
                        </td>
                        <td className="p-4 text-stone-600 font-medium">{p.material}</td>
                        <td className="p-4 font-mono font-medium">
                          <span className={isLowStock ? 'text-rose-500 font-semibold' : 'text-stone-705'}>
                            {p.stock} units {isLowStock && '⚠️'}
                          </span>
                        </td>
                        <td className="p-4 font-serif font-bold text-stone-900 text-sm">
                          {currency === 'MAD' ? `${(p.price * 10).toLocaleString()} درهم` : `$${p.price.toLocaleString()}`}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditClick(p)}
                              className="bg-white border border-stone-200 text-stone-600 hover:text-champagne-600 hover:border-champagne-300 p-2 rounded-md transition-colors font-semibold"
                              title="Edit specifications"
                            >
                              <Edit size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="bg-white border border-stone-200 text-stone-600 hover:text-rose-500 hover:border-rose-350 p-2 rounded-md transition-colors font-semibold"
                              title="Delete sheet"
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
        /* TAB 2 CONTENT: ORDERS TABLE */
        <section className="bg-white border border-champagne-105 rounded-lg overflow-hidden">
          {isLoadingOrders ? (
            <div className="text-center py-16 text-xs text-stone-405 flex flex-col items-center justify-center gap-2">
              <Loader2 className="animate-spin text-champagne-500" />
              <span>Scanning transactions logs stream...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 text-stone-400 text-xs leading-relaxed space-y-2">
              <ShoppingBag className="mx-auto text-stone-200" size={32} />
              <p>No transactions registered in database yet.</p>
              <p className="text-[10px]">Add items elements to shopping cart, process and checkout to populate logs.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-sans text-xs">
                <thead>
                  <tr className="bg-champagne-50/50 text-stone-500 border-b border-champagne-100 uppercase tracking-wider text-[10px]">
                    <th className="p-4 font-semibold">Reference & Buyer</th>
                    <th className="p-4 font-semibold">Date Placed</th>
                    <th className="p-4 font-semibold">Line Items Details</th>
                    <th className="p-4 font-semibold">Grand Total</th>
                    <th className="p-4 font-semibold">Fulfillment status</th>
                    <th className="p-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-105">
                  {orders.map((o) => {
                    const statusColors: Record<Order['status'], string> = {
                      pending: 'bg-amber-50 text-amber-700 border-amber-200',
                      completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                      shipped: 'bg-blue-50 text-blue-700 border-blue-200',
                      cancelled: 'bg-stone-100 text-stone-550 border-stone-250',
                    };

                    return (
                      <tr key={o.id} className="hover:bg-luxe-pink-50/20">
                        <td className="p-4">
                          <span className="font-mono font-semibold text-stone-900 block">{o.id}</span>
                          <span className="text-stone-550 block font-sans text-[11px] font-medium mt-0.5">{o.customer_name}</span>
                          <span className="text-stone-400 block font-mono text-[9px] truncate max-w-[150px]">{o.customer_email}</span>
                        </td>
                        <td className="p-4 text-stone-500 font-mono">
                          {o.created_at ? new Date(o.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'N/A'}
                        </td>
                        <td className="p-4">
                          <div className="space-y-1 max-w-sm">
                            {o.items?.map((item: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-baseline text-[11px] text-stone-600">
                                <span className="line-clamp-1">{item.name} <strong className="text-stone-440">x{item.quantity}</strong></span>
                                <span className="font-mono font-medium pl-2">{item.selected_size.split(' ')[0]}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 font-serif font-bold text-stone-900 text-sm">
                          {currency === 'MAD' 
                            ? `${((o.total || 0) * 10).toLocaleString()} درهم` 
                            : `$${(o.total || 0).toLocaleString()}`}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-md border text-[10px] uppercase font-sans tracking-wide ${statusColors[o.status] || 'bg-stone-50 text-stone-500'}`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <select
                            value={o.status}
                            onChange={(e) => handleStatusUpdate(o.id, e.target.value as Order['status'])}
                            className="bg-transparent border border-stone-200 text-[10px] text-stone-700 font-semibold py-1 px-2 focus:outline-hidden focus:border-champagne-400 rounded-sm uppercase tracking-wider"
                          >
                            <option value="pending">PENDING</option>
                            <option value="completed">COMPLETED</option>
                            <option value="shipped">SHIPPED</option>
                            <option value="cancelled">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

    </div>
  );
}
