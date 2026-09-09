"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Loader2, 
  AlertCircle, 
  RefreshCw, 
  LayoutGrid, 
  List, 
  Package, 
  Tag, 
  CheckCircle2, 
  AlertTriangle,
  XCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import API from '../../api/api';
import AddProductModal from './AddProductModal';

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState('all'); // 'all' | 'in_stock' | 'low_stock' | 'out_of_stock'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get('/products');
      setProducts(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Categories list
  const categories = [
    'All',
    'Grocery & Staples',
    'Dairy & Bakery',
    'Fruits & Vegetables',
    'Packaged Food',
    'Beverages',
    'Personal Care',
    'Household Essentials'
  ];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = 
      (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = 
      selectedCategory === 'All' || 
      (p.category || '').toLowerCase() === selectedCategory.toLowerCase();

    const stock = p.stock !== undefined ? p.stock : (p.stockQuantity ?? 0);
    const matchesStock = 
      stockFilter === 'all' ? true :
      stockFilter === 'in_stock' ? stock >= 10 :
      stockFilter === 'low_stock' ? stock > 0 && stock < 10 :
      stock === 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setDeletingId(id);
    try {
      await API.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => (p.id || p._id) !== id));
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  const handlePublishSuccess = (savedProduct, isEdit) => {
    if (savedProduct) {
      const pId = savedProduct.id || savedProduct._id;
      if (isEdit) {
        setProducts((prev) => prev.map((p) => ((p.id || p._id) === pId ? savedProduct : p)));
      } else {
        setProducts((prev) => [savedProduct, ...prev]);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black font-heading text-slate-900 tracking-tight">Products Catalog</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              {products.length} Items Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage your store's live grocery listings, pricing, and active buyer availability.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* View mode toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/50">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-all ${
                viewMode === 'grid' 
                  ? 'bg-white text-[#0e3e26] shadow-xs' 
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Grid Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl transition-all ${
                viewMode === 'table' 
                  ? 'bg-white text-[#0e3e26] shadow-xs' 
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="List Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={openAddModal}
            className="flex-1 sm:flex-none bg-[#105634] hover:bg-[#0e3e26] text-white px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 font-heading active:scale-95"
          >
            <Plus className="w-4 h-4 text-emerald-300" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controller */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-card space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by product name, category, or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-slate-800 outline-none transition-all font-medium"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Stock Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'All Stock' },
              { id: 'in_stock', label: 'In Stock' },
              { id: 'low_stock', label: 'Low Stock (<10)' },
              { id: 'out_of_stock', label: 'Out of Stock' }
            ].map((sf) => (
              <button
                key={sf.id}
                onClick={() => setStockFilter(sf.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  stockFilter === sf.id
                    ? 'bg-[#0e3e26] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {sf.label}
              </button>
            ))}

            <button
              onClick={fetchProducts}
              disabled={loading}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all shrink-0 ml-1"
              title="Refresh catalog"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Category Horizontal Scroll Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 no-scrollbar border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Categories:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-100 text-[#0e3e26] font-bold border border-emerald-300/80 shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Catalog Body */}
      {loading ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200/70 shadow-card text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#105634] mx-auto" />
          <p className="text-sm font-bold text-slate-700 font-heading">Loading Store Catalog...</p>
          <p className="text-xs text-slate-400">Fetching active items and stock levels from database.</p>
        </div>
      ) : error ? (
        <div className="bg-white p-12 rounded-3xl border border-rose-200 shadow-card text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
          <p className="text-sm font-bold text-rose-800 font-heading">{error}</p>
          <button
            onClick={fetchProducts}
            className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-colors shadow-xs"
          >
            Retry Connection
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200/70 shadow-card text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#105634] flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold font-heading text-slate-800">No Products Matching Criteria</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              {searchTerm 
                ? `No items found matching "${searchTerm}". Try resetting your search or filters.` 
                : 'Your store catalog is currently empty. Add your first item to start receiving orders.'}
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-[#105634] hover:bg-[#0e3e26] text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add First Product
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID CARDS VIEW (Matching customer product cards) */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.map((p) => {
            const pId = p.id || p._id;
            const stock = p.stock !== undefined ? p.stock : (p.stockQuantity ?? 0);
            const image = p.imageUrl || p.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400';

            return (
              <motion.div
                key={pId}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white rounded-3xl border border-slate-200/80 hover:border-emerald-200/80 p-4 shadow-card hover:shadow-hover transition-all flex flex-col justify-between group text-left relative"
              >
                <div>
                  {/* Image Canvas */}
                  <div className="w-full h-44 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden relative mb-3.5 flex items-center justify-center group-hover:shadow-xs transition-shadow">
                    <img
                      src={image}
                      alt={p.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Category Pill Over Image */}
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 backdrop-blur-md text-slate-700 shadow-xs border border-white/60">
                      {p.category || 'General'}
                    </span>

                    {/* Stock Status Badge */}
                    <span className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-xs border ${
                      stock === 0
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : stock < 10
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {stock === 0 ? 'Out of Stock' : `${stock} in stock`}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-sm font-bold font-heading text-slate-800 line-clamp-1 group-hover:text-emerald-800 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Unit: {p.unit || p.netWeight || 'Standard'}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100">
                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <span className="text-xs text-slate-400 font-medium mr-1">Price:</span>
                      <span className="text-base font-black font-heading text-[#0e3e26]">
                        ₹{p.price}
                      </span>
                    </div>

                    {p.mrp && p.mrp > p.price && (
                      <span className="text-[11px] text-slate-400 line-through">
                        ₹{p.mrp}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-[#0e3e26] text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeleteProduct(pId)}
                      disabled={deletingId === pId}
                      className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      {deletingId === pId ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
                      ) : (
                        <>
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* TABLE LIST VIEW */
        <div className="bg-white rounded-3xl border border-slate-200/70 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-4 px-5">Product Name</th>
                  <th className="py-4 px-5">Category</th>
                  <th className="py-4 px-5 text-right">Price</th>
                  <th className="py-4 px-5 text-center">Stock Level</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const pId = p.id || p._id;
                  const stock = p.stock !== undefined ? p.stock : (p.stockQuantity ?? 0);
                  const image = p.imageUrl || p.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400';

                  return (
                    <tr key={pId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-5 font-bold text-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden shrink-0">
                            <img src={image} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-heading text-slate-900 font-bold">{p.name}</p>
                            <p className="text-[10px] text-slate-400 font-normal">{p.unit || 'Standard'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-[11px] font-semibold">
                          {p.category || 'General'}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right font-black font-heading text-slate-900 text-sm">
                        ₹{p.price}
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold ${
                          stock === 0
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : stock < 10
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {stock} units
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-2 text-slate-500 hover:text-[#0e3e26] hover:bg-emerald-50 rounded-xl transition-all"
                            title="Edit product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(pId)}
                            disabled={deletingId === pId}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-50"
                            title="Delete product"
                          >
                            {deletingId === pId ? (
                              <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <AddProductModal
          isOpen={isModalOpen}
          editingProduct={editingProduct}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
          onPublishSuccess={(savedProduct, isEdit) => {
            handlePublishSuccess(savedProduct, isEdit);
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};
export default Products;
