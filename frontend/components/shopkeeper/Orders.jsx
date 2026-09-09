"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import API from '../../api/api';
import { 
  Package, 
  Clock, 
  Truck, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw, 
  Loader2, 
  XCircle, 
  MapPin, 
  User, 
  ShoppingBag, 
  Copy, 
  Check, 
  Search,
  ChevronRight
} from 'lucide-react';

export const Orders = () => {
  const storeOrders = useStore((state) => state.orders);
  const storeActions = useStore();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [activeTab, setActiveTab] = useState('All');
  const [copiedId, setCopiedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
          date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'Today',
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

  const tabs = ['All', 'Pending', 'Accepted', 'Preparing', 'Out for Delivery', 'Delivered', 'Rejected'];

  const filteredOrders = orders.filter((o) => {
    const matchesTab = activeTab === 'All' || (o.status || '').toLowerCase() === activeTab.toLowerCase();
    const matchesSearch = 
      (o.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(o.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.items || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleCopyId = (id) => {
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAcceptOrder = async (id) => {
    setActionLoadingId(id);
    try {
      await API.put(`/orders/${id}/accept`);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Accepted' } : o));
      storeActions.updateOrderStatus(id, 'Accepted');
    } catch (err) {
      console.warn('Accept order API warning:', err.message);
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
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Accepted':
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Preparing':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Out for Delivery':
      case 'InTransit':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Rejected':
      case 'Cancelled':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Step indicator helper
  const getStepNumber = (status) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Accepted': return 2;
      case 'Preparing': return 3;
      case 'Out for Delivery': return 4;
      case 'Delivered': return 5;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black font-heading text-slate-900 tracking-tight">
              Order Dispatch Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              {orders.length} Total Received
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Accept incoming customer checkouts, prepare packaging, and handover to neighborhood runners.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="p-2.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-2xl transition-all flex items-center gap-1.5 text-xs font-bold"
          title="Refresh orders"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          <span className="hidden sm:inline">Refresh Feed</span>
        </button>
      </div>

      {/* Filter Tabs & Search Row */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/70 shadow-card space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Tab Selector */}
          <div className="flex overflow-x-auto gap-1.5 w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
            {tabs.map((tab) => {
              const count = tab === 'All' 
                ? orders.length 
                : orders.filter(o => (o.status || '').toLowerCase() === tab.toLowerCase()).length;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5
                    ${activeTab === tab 
                      ? 'bg-[#0e3e26] text-white shadow-xs' 
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/50'
                    }
                  `}
                >
                  <span>{tab}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    activeTab === tab ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by customer or order #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-800 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Orders List Content */}
      {loading ? (
        <div className="bg-white p-14 rounded-3xl border border-slate-200/70 shadow-card text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#105634] mx-auto" />
          <p className="text-sm font-bold text-slate-700 font-heading">Fetching Live Orders...</p>
          <p className="text-xs text-slate-400">Syncing neighborhood checkout requests with dispatch queue.</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white p-14 rounded-3xl border border-slate-200/70 shadow-card text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold font-heading text-slate-800">No Orders in "{activeTab}" Category</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchTerm 
              ? `No matching orders for "${searchTerm}". Try adjusting your search query.` 
              : `There are currently no orders flagged as ${activeTab}. As buyers place orders, they will appear here.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isLoading = actionLoadingId === order.id;
            const currentStep = getStepNumber(order.status);
            const isCopied = copiedId === order.id;

            return (
              <motion.div
                key={order.id}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="bg-white rounded-3xl border border-slate-200/80 hover:border-emerald-200 p-5 sm:p-6 shadow-card hover:shadow-hover transition-all text-left space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-xl">
                      <span>Order #{String(order.id).slice(-8)}</span>
                      <button
                        onClick={() => handleCopyId(String(order.id))}
                        className="text-slate-400 hover:text-slate-700 ml-1"
                        title="Copy full Order ID"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {order.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                    <span className="text-base sm:text-lg font-black font-heading text-[#0e3e26]">
                      ₹{order.total}
                    </span>
                  </div>
                </div>

                {/* Workflow Progression Stepper (for active orders) */}
                {order.status !== 'Rejected' && order.status !== 'Cancelled' && (
                  <div className="py-2">
                    <div className="grid grid-cols-5 gap-1 text-center">
                      {[
                        { num: 1, label: 'Received' },
                        { num: 2, label: 'Accepted' },
                        { num: 3, label: 'Preparing' },
                        { num: 4, label: 'Out for Delivery' },
                        { num: 5, label: 'Delivered' }
                      ].map((s) => {
                        const isDone = currentStep >= s.num;
                        const isCurrent = currentStep === s.num;

                        return (
                          <div key={s.num} className="space-y-1">
                            <div className={`h-1.5 rounded-full transition-all ${
                              isDone ? 'bg-[#105634]' : 'bg-slate-200'
                            }`} />
                            <p className={`text-[10px] font-bold truncate ${
                              isCurrent 
                                ? 'text-[#105634]' 
                                : isDone 
                                ? 'text-slate-600' 
                                : 'text-slate-400'
                            }`}>
                              {s.label}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Order Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1">
                  {/* Customer & Address */}
                  <div className="md:col-span-4 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-xs">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 font-heading">
                        {order.customerName}
                      </span>
                    </div>

                    <div className="flex items-start gap-2 text-slate-500 text-xs pl-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-tight line-clamp-2">
                        {order.address}
                      </span>
                    </div>
                  </div>

                  {/* Order Items preview */}
                  <div className="md:col-span-5 bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Ordered Basket Items
                    </p>
                    <p className="text-xs font-medium text-slate-700 leading-relaxed">
                      {order.items}
                    </p>
                  </div>

                  {/* Contextual Action Buttons */}
                  <div className="md:col-span-3 flex md:flex-col justify-end gap-2 shrink-0">
                    {order.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleAcceptOrder(order.id)}
                          disabled={isLoading}
                          className="flex-1 py-2.5 px-4 bg-[#105634] hover:bg-[#0e3e26] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50 active:scale-95"
                        >
                          {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                          <span>Accept Order</span>
                        </button>
                        <button
                          onClick={() => handleRejectOrder(order.id)}
                          disabled={isLoading}
                          className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition-all flex items-center justify-center gap-1 disabled:opacity-50 active:scale-95"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}

                    {(order.status === 'Accepted' || order.status === 'Confirmed') && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'Preparing')}
                        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <span>Start Preparing</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {order.status === 'Preparing' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'Out for Delivery')}
                        className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Dispatch to Runner</span>
                      </button>
                    )}

                    {order.status === 'Out for Delivery' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'Delivered')}
                        className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirm Delivered</span>
                      </button>
                    )}

                    {order.status === 'Delivered' && (
                      <div className="w-full py-2 px-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default Orders;
