"use client";

import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';

export const Products = () => {
  const products = useStore((state) => state.products);
  const addProduct = useStore((state) => state.addProduct);
  const updateProduct = useStore((state) => state.updateProduct);
  const deleteProduct = useStore((state) => state.deleteProduct);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('Grains');

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setPrice('');
    setStock('');
    setCategory('Grains');
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price);
    setStock(product.stock);
    setCategory(product.category);
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name || !price || !stock) return;

    const payload = {
      id: editingProduct ? editingProduct.id : undefined,
      name,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
    };

    if (editingProduct) {
      updateProduct(payload);
    } else {
      addProduct(payload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
        <div>
          <h1 className="text-xl font-bold font-heading text-slate-800">Products Catalog</h1>
          <p className="text-xs text-slate-400">Total cataloged inventory items: {products.length}</p>
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
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-[#10B981] focus:bg-white focus:ring-1 focus:ring-[#10B981]/30 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-700 outline-none transition-all"
          />
        </div>

        {/* Table list */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl">
            <p className="text-slate-400 text-sm">No products found matching "{searchTerm}"</p>
          </div>
        ) : (
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
                    <td className="py-3.5 px-4 font-bold text-slate-800">{p.name}</td>
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
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 font-heading">
                {editingProduct ? 'Edit Product Details' : 'Add New Catalog Item'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Organic Mustard Oil 1L"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#10B981] focus:bg-white focus:ring-1 focus:ring-[#10B981]/30 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="250"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#10B981] focus:bg-white focus:ring-1 focus:ring-[#10B981]/30 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="15"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#10B981] focus:bg-white focus:ring-1 focus:ring-[#10B981]/30 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#10B981] focus:bg-white focus:ring-1 focus:ring-[#10B981]/30 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none transition-all"
                >
                  <option value="Grains">Grains</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Pulses">Pulses</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Dry Fruits">Dry Fruits</option>
                  <option value="Spices">Spices</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#10B981] hover:bg-[#059669] text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-md shadow-emerald-500/10"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
