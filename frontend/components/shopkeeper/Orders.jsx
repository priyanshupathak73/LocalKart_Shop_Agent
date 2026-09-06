"use client";

import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import API from '../../api/api';
import { Package, Clock, Truck, CheckCircle, ArrowRight, RefreshCw, Loader2, XCircle } from 'lucide-react';

export const Orders = () => {
  const storeOrders = useStore((state) => state.orders);
  const storeActions = useStore();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [activeTab, setActiveTab] = useState('All');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await API.get('/orders');
      const apiData = res.data.data || res.data.orders || (Array.isArray(res.data) ? res.data : null);
      if (apiData && Array.isArray(apiData)) {
        const formatted = apiData.map(o => ({
          id: o.id || o._id,
          customerName: o.customerName || o.user?.name || 'Customer',
          address: o.deliveryAddress || o.address || 'Local Delivery Address',
          items: Array.isArray(o.items) 
            ? o.items.map(i => `${i.name} (${i.quantity || i.qty || 1})`).join(', ') 
            : (typeof o.items === 'string' ? o.items : 'Grocery items'),
          total: o.totalAmount !== undefined ? o.totalAmount : (o.totalPrice || o.total || 0),
          status: o.status || 'Pending',
          rawOrder: o
        }));
        setOrders(formatted);
      } else {
        setOrders(storeOrders);
      }
    } catch (err) {
      console.warn('Backend API orders fetch warning, fallback to local store:', err.message);
      setOrders(storeOrders);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const tabs = ['All', 'Pending', 'Accepted', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Rejected'];

  const filteredOrders = activeTab === 'All'
    ? orders
    : orders.filter((o) => (o.status || '').toLowerCase() === activeTab.toLowerCase());

  const handleAcceptOrder = async (id) => {
    setActionLoadingId(id);
    try {
      await API.put(`/orders/${id}/accept`);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Accepted' } : o));
      storeActions.updateOrderStatus(id, 'Accepted');
    } catch (err) {
      console.warn('Accept order API warning:', err.message);
      // Fallback local update
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Accepted' } : o));
      storeActions.updateOrderStatus(id, 'Accepted');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectOrder = async (id) => {
    if (!window.confirm('Reject this order and restore stock?')) return;
    setActionLoadingId(id);
    try {
      await API.put(`/orders/${id}/reject`);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Rejected' } : o));
      storeActions.updateOrderStatus(id, 'Rejected');
    } catch (err) {
      console.warn('Reject order API warning:', err.message);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Rejected' } : o));
      storeActions.updateOrderStatus(id, 'Rejected');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleUpdateStatus = (id, nextStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: nextStatus } : o));
    storeActions.updateOrderStatus(id, nextStatus);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'Accepted':
      case 'Confirmed':
        return 'bg-[#10B981]/10 text-[#166534] border border-[#10B981]/20';
      case 'Preparing':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'Out for Delivery':
      case 'InTransit':
        return 'bg-purple-50 text-purple-700 border border-purple-200';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'Rejected':
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getActionButton = (order) => {
    const isLoading = actionLoadingId === order.id;

    if (order.status === 'Pending') {
      return (
        <div className="flex justify-end gap-1.5">
          <button
            onClick={() => handleAcceptOrder(order.id)}
            disabled={isLoading}
            className="px-3 py-1 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />} Accept
          </button>
          <button
            onClick={() => handleRejectOrder(order.id)}
            disabled={isLoading}
            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl border border-rose-200 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <XCircle className="w-3.5 h-3.5" /> Reject
          </button>
        </div>
      );
    }
    if (order.status === 'Accepted' || order.status === 'Confirmed') {
      return (
        <button
          onClick={() => handleUpdateStatus(order.id, 'Preparing')}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
        >
          Prepare <ArrowRight className="w-3.5 h-3.5" />
        </button>
      );
    }
    if (order.status === 'Preparing') {
      return (
        <button
          onClick={() => handleUpdateStatus(order.id, 'Out for Delivery')}
          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
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

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
          title="Refresh orders"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Tabs Menu Selection */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/40">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer
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
        {loading ? (
          <div className="text-center py-16 border border-slate-100 rounded-2xl flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#10B981]" />
            <p className="text-slate-400 text-xs">Fetching orders from backend...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
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
                      #{String(order.id).slice(-8)}
                    </td>
                    
                    <td className="py-4 px-4 font-bold text-slate-800">
                      {order.customerName}
                    </td>

                    <td className="py-4 px-4 text-slate-500 max-w-[200px] truncate" title={order.address}>
                      {order.address}
                    </td>

                    <td className="py-4 px-4 text-slate-600 text-xs max-w-[220px] truncate" title={order.items}>
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

