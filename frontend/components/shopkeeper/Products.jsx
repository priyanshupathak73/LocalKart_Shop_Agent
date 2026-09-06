"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import API from '../../api/api';
import AddProductModal from './AddProductModal';

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredProducts = products.filter((p) =>
    (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  const handlePublishSuccess = (savedProduct, isEdit) => {
    if (savedProduct) {
      if (isEdit) {
        setProducts((prev) => prev.map((p) => (p.id === savedProduct.id ? savedProduct : p)));
      } else {
        setProducts((prev) => [savedProduct, ...prev]);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
        <div>
          <h1 className="text-xl font-bold font-heading text-slate-800">Products Catalog</h1>
          <p className="text-xs text-slate-400">
            Total cataloged inventory items: {loading ? '...' : products.length}
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-[#10B981] hover:bg-[#059669] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-emerald-500/10 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Filter and List Container */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
        {/* Search */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#10B981] focus:bg-white focus:ring-1 focus:ring-[#10B981]/30 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-700 outline-none transition-all"
            />
          </div>
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
            title="Refresh products"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12 border border-slate-100 rounded-2xl space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-500 mx-auto" />
            <p className="text-slate-400 text-xs font-medium">Fetching catalog from server...</p>
          </div>
        ) : error ? (
          /* Error State */
          <div className="text-center py-12 border border-red-100 bg-red-50/30 rounded-2xl space-y-3">
            <AlertCircle className="w-6 h-6 text-red-500 mx-auto" />
            <p className="text-red-600 text-sm font-semibold">{error}</p>
            <button
              onClick={fetchProducts}
              className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl">
            <p className="text-slate-400 text-sm">
              {searchTerm ? `No products found matching "${searchTerm}"` : 'No products in catalog yet. Click "Add Product" to create one.'}
            </p>
          </div>
        ) : (
          /* Table list */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-xs">
                  <th className="py-3 px-4">Item Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-center">Stock</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      <div className="flex items-center gap-3">
                        {p.imageUrl ? (
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                          />
                        ) : null}
                        <span>{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-semibold">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-800">₹{p.price}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        p.stock < 10 ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-slate-400 hover:text-[#10B981] hover:bg-emerald-50 rounded-lg transition-all"
                          title="Edit product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          disabled={deletingId === p.id}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-50"
                          title="Delete product"
                        >
                          {deletingId === p.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
