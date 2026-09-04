"use client";

import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import AddProductModal from './AddProductModal';

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
        <AddProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onPublishSuccess={(productData) => {
            if (productData) {
              addProduct({
                name: productData.productName,
                price: parseFloat(productData.sellingPrice || 0),
                stock: parseInt(productData.stockQuantity || 0, 10),
                category: productData.category || 'Grocery',
              });
            }
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
