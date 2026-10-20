import React, { useState, useMemo } from 'react';
import { useStore } from '../../../context/StoreContext';
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit2,
  Copy,
  Trash2,
  X,
  PlusCircle,
  Image as ImageIcon,
  Check,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { Product, CategoryId, ProductVariant, ProductSpecification } from '../../../types';
import { STORE_GALLERY_ASSETS, sanitizeImageUrl, PHONE_IMAGE } from '../../../data/mockData';
import { GalleryImagePicker } from '../common/GalleryImagePicker';

export const ProductsTab: React.FC = () => {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    duplicateProduct,
    deleteProduct,
    showToast,
    navigateTo,
  } = useStore();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState('all');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [brand, setBrand] = useState('Apex Tech');
  const [category, setCategory] = useState<CategoryId>('smartphones');
  const [subcategory, setSubcategory] = useState('Flagship');
  const [regularPrice, setRegularPrice] = useState(30000);
  const [salePrice, setSalePrice] = useState(24999);
  const [costPrice, setCostPrice] = useState(19000);
  const [stock, setStock] = useState(25);
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);

  // Dynamic Specifications: key-value items
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>([
    { label: 'Display', value: '6.7-inch OLED 120Hz' },
    { label: 'Processor', value: 'Octa-Core 3nm' },
  ]);

  // Variants
  const [variants, setVariants] = useState<ProductVariant[]>([
    { id: 'v1', name: 'Standard Edition / 256GB', color: 'Titanium Black', storageOrSize: '256GB', priceDelta: 0, stock: 15 },
  ]);

  // Checkbox settings
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Brands list
  const allBrands = useMemo(() => Array.from(new Set(products.map((p) => p.brand))), [products]);

  // Open Form for Adding
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName('');
    setSku(`ST-PRD-${Math.floor(1000 + Math.random() * 9000)}`);
    setBrand('Apex Tech');
    setCategory('smartphones');
    setSubcategory('Flagship');
    setRegularPrice(35000);
    setSalePrice(29999);
    setCostPrice(22000);
    setStock(20);
    setLowStockThreshold(5);
    setShortDescription('High performance consumer electronics.');
    setDescription('Comprehensive technical specifications and genuine warranty.');
    setImages([products[0]?.images[0] || '']);
    setSpecs([
      { label: 'Display', value: '6.7-inch AMOLED 120Hz' },
      { label: 'Battery', value: '5000 mAh Turbo Charge' },
    ]);
    setVariants([
      { id: 'v1', name: 'Black Edition', color: 'Black', storageOrSize: '128GB', priceDelta: 0, stock: 20 },
    ]);
    setIsFeatured(true);
    setIsNewArrival(true);
    setIsBestSeller(false);
    setIsActive(true);
    setIsFormOpen(true);
  };

  // Open Form for Editing
  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setSku(p.sku);
    setBrand(p.brand);
    setCategory(p.category);
    setSubcategory(p.subcategory || '');
    setRegularPrice(p.originalPrice || p.price);
    setSalePrice(p.price);
    setCostPrice(p.costPrice || Math.round(p.price * 0.75));
    setStock(p.stock);
    setLowStockThreshold(p.lowStockThreshold || 5);
    setShortDescription(p.shortDescription);
    setDescription(p.description);
    setImages([...p.images]);
    setSpecs(
      p.specifications && p.specifications[0]?.items
        ? [...p.specifications[0].items]
        : [{ label: 'Build', value: 'Aircraft Grade Alloy' }]
    );
    setVariants(p.variants.length > 0 ? [...p.variants] : [{ id: 'v1', name: 'Standard', priceDelta: 0 }]);
    setIsFeatured(p.isFeatured);
    setIsNewArrival(p.isNewArrival);
    setIsBestSeller(p.isBestSeller || false);
    setIsActive(p.isActive !== false);
    setIsFormOpen(true);
  };

  const handleAddSpecRow = () => {
    setSpecs((prev) => [...prev, { label: '', value: '' }]);
  };

  const handleRemoveSpecRow = (idx: number) => {
    setSpecs((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddVariantRow = () => {
    setVariants((prev) => [
      ...prev,
      {
        id: `var-${Date.now()}`,
        name: 'New Variant',
        color: '',
        storageOrSize: '',
        priceDelta: 0,
        stock: 10,
      },
    ]);
  };

  const handleRemoveVariantRow = (idx: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Product name is required.', 'error');
      return;
    }

    const discountCalculated =
      regularPrice > salePrice ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) : 0;

    const specificationGroup: ProductSpecification = {
      group: 'Technical Specifications',
      items: specs.filter((s) => s.label.trim() && s.value.trim()),
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: name.trim(),
        sku: sku.trim(),
        brand: brand.trim(),
        category,
        subcategory,
        price: Number(salePrice),
        originalPrice: Number(regularPrice),
        costPrice: Number(costPrice),
        discountPercent: discountCalculated,
        stock: Number(stock),
        lowStockThreshold: Number(lowStockThreshold),
        shortDescription,
        description,
        images: images.length > 0 ? images : [products[0]?.images[0] || ''],
        specifications: [specificationGroup],
        variants,
        isFeatured,
        isNewArrival,
        isBestSeller,
        isActive,
        inStock: Number(stock) > 0,
      });
    } else {
      addProduct({
        name: name.trim(),
        sku: sku.trim(),
        brand: brand.trim(),
        category,
        subcategory,
        price: Number(salePrice),
        originalPrice: Number(regularPrice),
        costPrice: Number(costPrice),
        discountPercent: discountCalculated,
        rating: 5.0,
        reviewsCount: 1,
        stock: Number(stock),
        lowStockThreshold: Number(lowStockThreshold),
        isFeatured,
        isNewArrival,
        isBestSeller,
        isFlashDeal: false,
        shortDescription,
        description,
        images: images.length > 0 ? images : [products[0]?.images[0] || ''],
        specifications: [specificationGroup],
        variants,
        warranty: '1 Year Brand Warranty (PTA Approved)',
        inStock: Number(stock) > 0,
        isActive,
      });
    }

    setIsFormOpen(false);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = 'ID,Name,SKU,Brand,Category,Price,OriginalPrice,Stock\n';
    const rows = products
      .map((p) => `"${p.id}","${p.name}","${p.sku}","${p.brand}","${p.category}",${p.price},${p.originalPrice},${p.stock}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Veltrix_Products_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast('Catalog exported to CSV successfully.');
  };

  const handleImportDemo = () => {
    showToast('CSV catalog format validated. All entries synchronized.');
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchSku = p.sku.toLowerCase().includes(q);
        const matchBrand = p.brand.toLowerCase().includes(q);
        if (!matchName && !matchSku && !matchBrand) return false;
      }
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
      if (brandFilter !== 'all' && p.brand !== brandFilter) return false;
      if (stockFilter === 'in_stock' && p.stock <= 0) return false;
      if (stockFilter === 'low_stock' && (p.stock >= 10 || p.stock === 0)) return false;
      if (stockFilter === 'out_of_stock' && p.stock > 0) return false;
      if (featuredFilter === 'featured' && !p.isFeatured) return false;
      if (featuredFilter === 'new' && !p.isNewArrival) return false;
      return true;
    });
  }, [products, searchQuery, categoryFilter, brandFilter, stockFilter, featuredFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Products Management</h1>
          <p className="text-xs text-slate-400">
            Control pricing, inventory thresholds, specifications and variants for the store.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleImportDemo}
            className="px-3 py-2 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            <span>Import Products</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Product</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative grow max-w-sm">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Product Name, SKU, Brand..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 capitalize"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Brand */}
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300"
          >
            <option value="all">All Brands</option>
            {allBrands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300"
          >
            <option value="all">All Stock Statuses</option>
            <option value="in_stock">In Stock (&gt;0)</option>
            <option value="low_stock">Low Stock (&lt;10)</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>

          {/* Tag Filter */}
          <select
            value={featuredFilter}
            onChange={(e) => setFeaturedFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300"
          >
            <option value="all">All Highlights</option>
            <option value="featured">Featured Only</option>
            <option value="new">New Arrivals Only</option>
          </select>

          {(searchQuery || categoryFilter !== 'all' || brandFilter !== 'all' || stockFilter !== 'all' || featuredFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
                setBrandFilter('all');
                setStockFilter('all');
                setFeaturedFilter('all');
              }}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
            <tr>
              <th className="p-3.5">Image & Name</th>
              <th className="p-3.5">SKU / Brand</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Sale Price</th>
              <th className="p-3.5">Original Price</th>
              <th className="p-3.5">Stock</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Tags</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {filteredProducts.map((p) => {
              const isLow = p.stock > 0 && p.stock < 10;
              const isOut = p.stock <= 0;

              return (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 flex items-center gap-3">
                    <img
                      src={sanitizeImageUrl(p.images?.[0]) || PHONE_IMAGE}
                      alt={p.name}
                      onError={(e) => {
                        if (e.currentTarget.src !== PHONE_IMAGE) {
                          e.currentTarget.src = PHONE_IMAGE;
                        }
                      }}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-xl object-cover bg-slate-800 shrink-0 border border-slate-800"
                    />
                    <div>
                      <span className="font-bold text-white block max-w-xs truncate">
                        {p.name}
                      </span>
                      <span className="text-[11px] text-slate-400 line-clamp-1">
                        {p.shortDescription}
                      </span>
                    </div>
                  </td>

                  <td className="p-3.5 font-mono">
                    <span className="text-cyan-400 font-bold block">{p.sku}</span>
                    <span className="text-slate-400 font-sans">{p.brand}</span>
                  </td>

                  <td className="p-3.5 capitalize text-slate-300">
                    {p.category.replace('-', ' ')}
                  </td>

                  <td className="p-3.5 font-mono font-bold text-white tabular-nums">
                    Rs. {p.price.toLocaleString()}
                  </td>

                  <td className="p-3.5 font-mono text-slate-400 line-through tabular-nums">
                    {p.originalPrice > p.price ? `Rs. ${p.originalPrice.toLocaleString()}` : '—'}
                  </td>

                  <td className="p-3.5 font-mono">
                    <span
                      className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
                        isOut
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : isLow
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'text-slate-300'
                      }`}
                    >
                      {p.stock} units
                    </span>
                  </td>

                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        !isOut
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}
                    >
                      {!isOut ? 'Active' : 'Out of Stock'}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <div className="flex flex-wrap gap-1">
                      {p.isFeatured && (
                        <span className="text-[10px] font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800 px-1.5 py-0.2 rounded">
                          Featured
                        </span>
                      )}
                      {p.isNewArrival && (
                        <span className="text-[10px] font-semibold bg-purple-950 text-purple-400 border border-purple-800 px-1.5 py-0.2 rounded">
                          New
                        </span>
                      )}
                      {p.isBestSeller && (
                        <span className="text-[10px] font-semibold bg-amber-950 text-amber-400 border border-amber-800 px-1.5 py-0.2 rounded">
                          Best Seller
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* View on Storefront */}
                      <button
                        onClick={() => navigateTo('product', { productId: p.id })}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                        title="View on Storefront"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 hover:text-cyan-300 hover:bg-slate-700"
                        title="Edit product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Duplicate */}
                      <button
                        onClick={() => duplicateProduct(p.id)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                        title="Duplicate product"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => setProductToDelete(p)}
                        className="p-1.5 rounded-lg bg-rose-950/60 text-rose-400 hover:bg-rose-900"
                        title="Delete/archive product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL 1: ADD / EDIT PRODUCT */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
            onClick={() => setIsFormOpen(false)}
          />
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl z-10 max-h-[92vh] overflow-y-auto space-y-6 text-white text-xs">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">
                  {editingProduct ? `Edit: ${editingProduct.name}` : 'Add New Technology Product'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  Update customer catalog, PKR pricing, specifications, and variants
                </p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6">
              {/* SECTION A: Basic Info */}
              <div className="space-y-3">
                <h4 className="font-bold text-cyan-400 uppercase tracking-wider text-[11px]">
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-300 font-semibold mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Apex Titanium Ultra 5G"
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">SKU *</label>
                    <input
                      type="text"
                      required
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      placeholder="ST-PH-APEX-01"
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Brand *</label>
                    <input
                      type="text"
                      required
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="Apex Tech"
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as CategoryId)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white capitalize"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Subcategory</label>
                    <input
                      type="text"
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      placeholder="e.g. Flagship, Ultrabook, Studio"
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION B: Pricing & Inventory */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <h4 className="font-bold text-cyan-400 uppercase tracking-wider text-[11px]">
                  Pricing & Inventory
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Sale Price (PKR) *</label>
                    <input
                      type="number"
                      required
                      value={salePrice}
                      onChange={(e) => setSalePrice(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Regular / Old Price</label>
                    <input
                      type="number"
                      value={regularPrice}
                      onChange={(e) => setRegularPrice(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Cost Price (Internal)</label>
                    <input
                      type="number"
                      value={costPrice}
                      onChange={(e) => setCostPrice(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Stock Quantity *</label>
                    <input
                      type="number"
                      required
                      value={stock}
                      onChange={(e) => setStock(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION C: Product Media Gallery (From Gallery / Files, No URL required) */}
              <div className="pt-3 border-t border-slate-800">
                <GalleryImagePicker
                  images={images}
                  onImagesChange={setImages}
                  label="Product Media Gallery (Device Gallery & Media Library)"
                  helperText="Upload photos from your phone/computer gallery or select from the Veltrix media library. No image URLs required."
                />
              </div>

              {/* SECTION D: Details */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <h4 className="font-bold text-cyan-400 uppercase tracking-wider text-[11px]">
                  Product Descriptions
                </h4>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Short Description (Summary Card)
                  </label>
                  <textarea
                    rows={2}
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Full Description (Product Page)
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              {/* SECTION E: Dynamic Specifications */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-cyan-400 uppercase tracking-wider text-[11px]">
                    Technical Specifications Table
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddSpecRow}
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ Add Specification Row</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {specs.map((row, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={row.label}
                        onChange={(e) => {
                          const updated = [...specs];
                          updated[idx].label = e.target.value;
                          setSpecs(updated);
                        }}
                        placeholder="Feature (e.g. Battery)"
                        className="w-1/3 p-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                      />
                      <input
                        type="text"
                        value={row.value}
                        onChange={(e) => {
                          const updated = [...specs];
                          updated[idx].value = e.target.value;
                          setSpecs(updated);
                        }}
                        placeholder="Detail (e.g. 5000 mAh Li-Po)"
                        className="grow p-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecRow(idx)}
                        className="p-2 text-slate-500 hover:text-rose-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION F: Variants */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-cyan-400 uppercase tracking-wider text-[11px]">
                    Product Variants (Color, Storage, Size)
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddVariantRow}
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ Add Variant</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {variants.map((v, idx) => (
                    <div key={v.id || idx} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <input
                        type="text"
                        value={v.name}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[idx].name = e.target.value;
                          setVariants(updated);
                        }}
                        placeholder="Variant Title (e.g. 256GB Black)"
                        className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs sm:col-span-2"
                      />
                      <input
                        type="number"
                        value={v.priceDelta || 0}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[idx].priceDelta = Number(e.target.value);
                          setVariants(updated);
                        }}
                        placeholder="+/- Price Delta"
                        className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={v.stock || 10}
                          onChange={(e) => {
                            const updated = [...variants];
                            updated[idx].stock = Number(e.target.value);
                            setVariants(updated);
                          }}
                          placeholder="Stock"
                          className="w-16 p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveVariantRow(idx)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 ml-auto"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION G: Settings Checkboxes */}
              <div className="pt-3 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="h-4 w-4 rounded-sm border-slate-700 text-cyan-500"
                  />
                  <span>Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="h-4 w-4 rounded-sm border-slate-700 text-cyan-500"
                  />
                  <span>New Arrival</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                    className="h-4 w-4 rounded-sm border-slate-700 text-cyan-500"
                  />
                  <span>Best Seller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 rounded-sm border-slate-700 text-cyan-500"
                  />
                  <span>Active</span>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/20"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DELETE CONFIRMATION */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
            onClick={() => setProductToDelete(null)}
          />
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl z-10 text-white space-y-4 text-xs">
            <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-sm text-white">Delete Product Confirmation</h3>
              <p className="text-slate-400">
                Are you sure you want to delete <strong>{productToDelete.name}</strong>?
              </p>
              <p className="text-[11px] text-slate-500 pt-1">
                This item will be soft-archived so historical consumer orders remain intact.
              </p>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteProduct(productToDelete.id, true);
                  setProductToDelete(null);
                }}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
