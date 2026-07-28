import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Plus, Package, IndianRupee, ShoppingCart, Users, Trash2 } from 'lucide-react';

export const ShopkeeperDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [products, setProducts] = useState([
    { id: '1', name: 'Premium Basmati Rice (5kg)', price: 450, stock: 25, category: 'Grains' },
    { id: '2', name: 'Fresh Farm Milk (1L)', price: 60, stock: 40, category: 'Dairy' },
    { id: '3', name: 'Organic Tur Dal (1kg)', price: 160, stock: 15, category: 'Pulses' },
    { id: '4', name: 'Whole Wheat Bread', price: 40, stock: 8, category: 'Bakery' },
  ]);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('Grains');

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!name || !price || !stock) return;

    const newProd = {
      id: Date.now().toString(),
      name,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
    };

    setProducts([newProd, ...products]);
    setName('');
    setPrice('');
    setStock('');
  };

  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Shopkeeper Dashboard</h1>
          <p className="text-slate-500 text-sm">Welcome back, {user?.name || 'Partner'}! Manage your store inventory here.</p>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors self-start md:self-auto"
        >
          Sign Out
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Today's Revenue</p>
            <p className="text-xl font-bold text-slate-800">₹14,250</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Orders Completed</p>
            <p className="text-xl font-bold text-slate-800">38 Orders</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Unique Items</p>
            <p className="text-xl font-bold text-slate-800">{products.length} Items</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Active Deliveries</p>
            <p className="text-xl font-bold text-slate-800">3 Partners</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Product Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm lg:col-span-1">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-600" />
            Add New Item
          </h2>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Item Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Fresh Apples"
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/30 rounded-xl px-4 py-2 text-sm text-slate-800 outline-none transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="99"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/30 rounded-xl px-4 py-2 text-sm text-slate-800 outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Stock Qty
                </label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="50"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/30 rounded-xl px-4 py-2 text-sm text-slate-800 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/30 rounded-xl px-4 py-2 text-sm text-slate-800 outline-none transition-all"
              >
                <option value="Grains">Grains</option>
                <option value="Dairy">Dairy</option>
                <option value="Pulses">Pulses</option>
                <option value="Bakery">Bakery</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2.5 font-medium text-sm transition-colors shadow-md shadow-emerald-600/10 outline-none"
            >
              Add to Inventory
            </button>
          </form>
        </div>

        {/* Inventory Table */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" />
            Current Inventory
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-150 text-slate-400 font-semibold uppercase tracking-wider text-xs">
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-center">Stock</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-700">{product.name}</td>
                    <td className="py-3 px-4 text-slate-500 text-xs">
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-800">₹{product.price}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block font-semibold px-2.5 py-0.5 rounded-full text-xs ${
                          product.stock > 10
                            ? 'bg-emerald-50 text-emerald-700'
                            : product.stock > 0
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {product.stock} left
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
