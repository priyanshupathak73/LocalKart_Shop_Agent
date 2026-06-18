import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Search, Save, AlertTriangle, Plus, Minus } from 'lucide-react';

export const Inventory = () => {
  const products = useStore((state) => state.products);
  const updateProductStock = useStore((state) => state.updateProductStock);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Track temporary stock inputs to avoid editing direct state on every key stroke
  const [tempStock, setTempStock] = useState({});

  const handleStockChange = (id, val) => {
    setTempStock({
      ...tempStock,
      [id]: val,
    });
  };

  const handleIncrement = (id, currentStock) => {
    const activeVal = tempStock[id] !== undefined ? tempStock[id] : currentStock;
    const newVal = parseInt(activeVal) + 1;
    handleStockChange(id, newVal);
    updateProductStock(id, newVal);
  };

  const handleDecrement = (id, currentStock) => {
    const activeVal = tempStock[id] !== undefined ? tempStock[id] : currentStock;
    const newVal = Math.max(0, parseInt(activeVal) - 1);
    handleStockChange(id, newVal);
    updateProductStock(id, newVal);
  };

  const handleSaveStock = (id) => {
    if (tempStock[id] !== undefined) {
      updateProductStock(id, tempStock[id]);
      // Remove from temp values
      const updatedTemp = { ...tempStock };
      delete updatedTemp[id];
      setTempStock(updatedTemp);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
        <div>
          <h1 className="text-xl font-bold font-heading text-slate-800">Inventory Stock Controller</h1>
          <p className="text-xs text-slate-400">Quickly adjust stock quantities and manage warehouse replenishments.</p>
        </div>
      </div>

      {/* Main Stock Editor Panel */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search stock..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-[#10B981] focus:bg-white focus:ring-1 focus:ring-[#10B981]/30 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-700 outline-none transition-all"
          />
        </div>

        {/* Table list */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl">
            <p className="text-slate-400 text-sm">No items found matching "{searchTerm}"</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-xs">
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center max-w-[200px]">Adjust Quantity</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {filteredProducts.map((p) => {
                  const currentInputValue = tempStock[p.id] !== undefined ? tempStock[p.id] : p.stock;
                  const isLowStock = p.stock < 10;
                  const hasChanges = tempStock[p.id] !== undefined && tempStock[p.id] !== p.stock;

                  return (
                    <tr key={p.id} className={`transition-colors ${isLowStock ? 'bg-amber-50/20 hover:bg-amber-50/30' : 'hover:bg-slate-50/50'}`}>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{p.name}</div>
                        {isLowStock && (
                          <div className="flex items-center gap-1 text-[10px] text-amber-600 font-semibold mt-0.5">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Low Stock Warning
                          </div>
                        )}
                      </td>
                      
                      <td className="py-3.5 px-4">
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-semibold">
                          {p.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          isLowStock ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {p.stock} units
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1.5 max-w-[160px] mx-auto">
                          <button
                            type="button"
                            onClick={() => handleDecrement(p.id, p.stock)}
                            className="p-1 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-all"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          
                          <input
                            type="number"
                            value={currentInputValue}
                            onChange={(e) => handleStockChange(p.id, parseInt(e.target.value) || 0)}
                            className="w-16 border border-slate-200 focus:border-[#10B981] rounded-lg px-2 py-1 text-xs text-center text-slate-800 outline-none transition-all"
                          />

                          <button
                            type="button"
                            onClick={() => handleIncrement(p.id, p.stock)}
                            className="p-1 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleSaveStock(p.id)}
                          disabled={!hasChanges}
                          className={`
                            px-3 py-1.5 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1
                            ${hasChanges 
                              ? 'bg-[#10B981] text-white hover:bg-[#059669] shadow-sm' 
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }
                          `}
                        >
                          <Save className="w-3.5 h-3.5" /> Save
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
