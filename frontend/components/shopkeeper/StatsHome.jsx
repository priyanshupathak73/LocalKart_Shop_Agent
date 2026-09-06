"use client";

import React, { useEffect } from 'react';
import { useStore } from '../../store/useStore';
import API from '../../api/api';
import { IndianRupee, ShoppingCart, AlertTriangle, Star, ArrowUpRight, TrendingUp } from 'lucide-react';

export const StatsHome = ({ setActiveTab }) => {
  const products = useStore((state) => state.products);
  const orders = useStore((state) => state.orders);
  const setProducts = useStore((state) => state.setProducts);
  const setOrders = useStore((state) => state.setOrders);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          API.get('/orders').catch(() => ({ data: [] })),
          API.get('/products').catch(() => ({ data: [] }))
        ]);
        if (Array.isArray(ordersRes.data)) {
          setOrders(ordersRes.data.map(o => ({
            id: o.id || o._id,
            customerName: o.customerName || 'Customer',
            items: Array.isArray(o.items) ? o.items.map(i => `${i.name} (x${i.quantity})`).join(', ') : 'Items',
            total: o.totalAmount || o.total || 0,
            status: o.status || 'Pending',
            date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'Today'
          })));
        }
        if (Array.isArray(productsRes.data)) {
          setProducts(productsRes.data.map(p => ({
            id: p.id || p._id,
            name: p.name,
            price: p.price,
            stock: p.stock ?? p.stockQuantity ?? 0,
            category: p.category || 'General',
            image: p.image || '/placeholder.jpg'
          })));
        }
      } catch (err) {
        console.error('Error loading stats data:', err);
      }
    };
    fetchData();
  }, [setOrders, setProducts]);

  // Math metrics
  const totalSales = orders
    .filter(o => o.status === 'Delivered')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const pendingOrders = orders.filter(o => o.status !== 'Delivered').length;
  const lowStockCount = products.filter(p => p.stock < 10).length;

  // Render recent orders (limit to 3)
  const recentOrders = orders.slice(0, 3);

  // SVG Chart Mock Coordinates
  const chartPoints = [
    { label: 'Mon', val: 1200 },
    { label: 'Tue', val: 1900 },
    { label: 'Wed', val: 1500 },
    { label: 'Thu', val: 2800 },
    { label: 'Fri', val: 2400 },
    { label: 'Sat', val: 3800 },
    { label: 'Sun', val: 4200 }
  ];

  // Map values to Y coordinates
  const mapY = (val) => 170 - (val / 5000) * 140;
  const pathPoints = chartPoints.map((pt, i) => `${40 + i * 80},${mapY(pt.val)}`);
  
  let pathD = `M ${pathPoints[0]}`;
  for (let i = 1; i < pathPoints.length; i++) {
    const [prevX, prevY] = pathPoints[i-1].split(',').map(Number);
    const [currX, currY] = pathPoints[i].split(',').map(Number);
    const cpX1 = prevX + 40;
    const cpY1 = prevY;
    const cpX2 = currX - 40;
    const cpY2 = currY;
    pathD += ` C ${cpX1},${cpY1} ${cpX2},${cpY2} ${currX},${currY}`;
  }

  const areaD = `${pathD} L 520,180 L 40,180 Z`;

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-slate-800">Shop Overview</h1>
        <p className="text-slate-500 text-sm">Real-time stats and metrics for Gupta Kirana Store.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full transition-transform group-hover:scale-105"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <IndianRupee className="w-6 h-6" />
            </span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> Live
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Revenue</p>
          <h3 className="text-2xl font-bold font-heading text-slate-800 mt-1">₹{totalSales.toLocaleString()}</h3>
          <p className="text-[11px] text-slate-400 mt-1.5">Calculated from delivered orders</p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <ShoppingCart className="w-6 h-6" />
            </span>
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {pendingOrders} Active
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Orders</p>
          <h3 className="text-2xl font-bold font-heading text-slate-800 mt-1">{orders.length}</h3>
          <p className="text-[11px] text-slate-400 mt-1.5">All time orders registered</p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </span>
            {lowStockCount > 0 && (
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full animate-pulse">
                Action Required
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Low Stock items</p>
          <h3 className="text-2xl font-bold font-heading text-slate-800 mt-1">{lowStockCount}</h3>
          <p className="text-[11px] text-slate-400 mt-1.5">Stock quantity is below 10</p>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-bl-full"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
              <Star className="w-6 h-6 fill-current" />
            </span>
            <span className="text-[11px] font-bold text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-full">
              Top Tier
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Store Rating</p>
          <h3 className="text-2xl font-bold font-heading text-slate-800 mt-1">4.8 <span className="text-xs text-slate-400">/ 5.0</span></h3>
          <p className="text-[11px] text-slate-400 mt-1.5">Based on customer reviews</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800">Weekly Revenue Flow</h3>
              <p className="text-xs text-slate-400">Weekly checkout volume chart</p>
            </div>
            <span className="text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
              Live Feed <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-ping"></span>
            </span>
          </div>

          {/* SVG Spline Graph */}
          <div className="relative w-full h-[200px]">
            <svg viewBox="0 0 560 200" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              
              <line x1="40" y1="30" x2="520" y2="30" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="65" x2="520" y2="65" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="100" x2="520" y2="100" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="135" x2="520" y2="135" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="170" x2="520" y2="170" stroke="#cbd5e1" strokeWidth="1.5" />

              <path d={areaD} fill="url(#chartGrad)" />
              <path d={pathD} fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />

              {chartPoints.map((pt, i) => {
                const cx = 40 + i * 80;
                const cy = mapY(pt.val);
                return (
                  <g key={i}>
                    <circle cx={cx} cy={cy} r="6" fill="#166534" stroke="#ffffff" strokeWidth="2" className="cursor-pointer" />
                    <text x={cx} y={cy - 12} textAnchor="middle" className="text-[10px] font-bold fill-slate-700 font-heading">
                      ₹{pt.val}
                    </text>
                  </g>
                );
              })}

              {chartPoints.map((pt, i) => (
                <text key={i} x={40 + i * 80} y="192" textAnchor="middle" className="text-[10px] font-semibold fill-slate-400">
                  {pt.label}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Low Stock Alert Sidebar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 mb-1">Restock Alerts</h3>
            <p className="text-xs text-slate-400 mb-4">Products currently running low on stock</p>
            
            <div className="space-y-3">
              {products.filter(p => p.stock < 10).length === 0 ? (
                <p className="text-xs text-slate-400 italic py-4 text-center">No low stock items</p>
              ) : (
                products.filter(p => p.stock < 10).map((product) => (
                  <div key={product.id} className="flex justify-between items-center p-3 bg-rose-50/50 hover:bg-rose-50 border border-rose-100 rounded-xl transition-all">
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">{product.name}</h5>
                      <p className="text-[10px] text-slate-400 font-semibold">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        {product.stock} left
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <button
            onClick={() => setActiveTab('inventory')}
            className="w-full mt-6 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            Manage Inventory <ArrowUpRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Recent Orders table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-800">Recent Checkout Activities</h3>
            <p className="text-xs text-slate-400">Review status logs for pending dispatchments</p>
          </div>
          <button
            onClick={() => setActiveTab('orders')}
            className="text-xs font-bold text-[#10B981] hover:text-[#059669] transition-colors"
          >
            View All Orders
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-xs">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-400 text-xs font-semibold">
                    No orders yet
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-heading font-semibold text-slate-800 text-xs">{order.id}</td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{order.customerName}</td>
                    <td className="py-3.5 px-4 text-slate-500 truncate max-w-[200px]">{order.items}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-800">₹{order.total}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`
                        inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border
                        ${order.status === 'Pending' && 'bg-amber-50 text-amber-700 border-amber-200'}
                        ${order.status === 'Preparing' && 'bg-blue-50 text-blue-700 border-blue-200'}
                        ${order.status === 'Out for Delivery' && 'bg-purple-50 text-purple-700 border-purple-200'}
                        ${order.status === 'Delivered' && 'bg-emerald-50 text-emerald-700 border-emerald-200'}
                      `}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
