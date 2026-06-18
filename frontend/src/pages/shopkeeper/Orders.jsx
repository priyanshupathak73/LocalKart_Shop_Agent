import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Package, Clock, Truck, CheckCircle, ArrowRight } from 'lucide-react';

export const Orders = () => {
  const orders = useStore((state) => state.orders);
  const updateOrderStatus = (state) => state.updateOrderStatus;
  const storeActions = useStore();

  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];

  const filteredOrders = activeTab === 'All'
    ? orders
    : orders.filter((o) => o.status.toLowerCase() === activeTab.toLowerCase());

  const handleUpdateStatus = (id, currentStatus) => {
    let nextStatus = '';
    if (currentStatus === 'Pending') nextStatus = 'Confirmed';
    else if (currentStatus === 'Confirmed') nextStatus = 'Preparing';
    else if (currentStatus === 'Preparing') nextStatus = 'Out for Delivery';
    else if (currentStatus === 'Out for Delivery') nextStatus = 'Delivered';

    if (nextStatus) {
      storeActions.updateOrderStatus(id, nextStatus);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'Confirmed':
        return 'bg-[#10B981]/10 text-[#166534] border border-[#10B981]/20';
      case 'Preparing':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'Out for Delivery':
        return 'bg-purple-50 text-purple-700 border border-purple-200';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getActionButton = (order) => {
    if (order.status === 'Pending') {
      return (
        <button
          onClick={() => handleUpdateStatus(order.id, order.status)}
          className="px-3.5 py-1.5 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1"
        >
          Confirm <ArrowRight className="w-3.5 h-3.5" />
        </button>
      );
    }
    if (order.status === 'Confirmed') {
      return (
        <button
          onClick={() => handleUpdateStatus(order.id, order.status)}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1"
        >
          Prepare <ArrowRight className="w-3.5 h-3.5" />
        </button>
      );
    }
    if (order.status === 'Preparing') {
      return (
        <button
          onClick={() => handleUpdateStatus(order.id, order.status)}
          className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1"
        >
          Dispatch <ArrowRight className="w-3.5 h-3.5" />
        </button>
      );
    }
    return (
      <span className="text-xs font-bold text-slate-400 italic">No action needed</span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
        <div>
          <h1 className="text-xl font-bold font-heading text-slate-800">Order Dispatch Dashboard</h1>
          <p className="text-xs text-slate-400">Manage order workflows, accept checkouts, and dispatch to carriers.</p>
        </div>
      </div>

      {/* Tabs Menu Selection */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/40">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap
              ${activeTab === tab 
                ? 'bg-[#166534] text-white shadow-md' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table list */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center space-y-2">
            <div className="p-3 bg-slate-50 rounded-full text-slate-400">
              <Package className="w-6 h-6" />
            </div>
            <p className="text-slate-500 font-bold text-sm">No orders found</p>
            <p className="text-slate-400 text-xs">There are no orders categorized as "{activeTab}" currently.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-xs">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Delivery Address</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4 text-right">Total</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 font-heading font-semibold text-slate-800 text-xs">
                      {order.id}
                    </td>
                    
                    <td className="py-4 px-4 font-bold text-slate-800">
                      {order.customerName}
                    </td>

                    <td className="py-4 px-4 text-slate-500 max-w-[200px] truncate" title={order.address}>
                      {order.address}
                    </td>

                    <td className="py-4 px-4 text-slate-600 text-xs" title={order.items}>
                      {order.items}
                    </td>

                    <td className="py-4 px-4 text-right font-extrabold text-slate-800">
                      ₹{order.total}
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span className={`inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      {getActionButton(order)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
