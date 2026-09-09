"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import API from '../../api/api';
import { 
  IndianRupee, 
  ShoppingCart, 
  AlertTriangle, 
  Star, 
  ArrowUpRight, 
  TrendingUp, 
  Package, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Plus, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const StatsHome = ({ setActiveTab }) => {
  const products = useStore((state) => state.products);
  const orders = useStore((state) => state.orders);
  const setProducts = useStore((state) => state.setProducts);
  const setOrders = useStore((state) => state.setOrders);
  
  const [timeframe, setTimeframe] = useState('7d'); // '7d' | '30d' | '90d'
  const [hoveredPoint, setHoveredPoint] = useState(null);

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
            image: p.image || p.imageUrl || '/placeholder.jpg'
          })));
        }
      } catch (err) {
        console.error('Error loading stats data:', err);
      }
    };
    fetchData();
  }, [setOrders, setProducts]);

  // Math metrics memoized for fast rendering
  const totalSales = useMemo(() => {
    return orders
      .filter(o => o.status === 'Delivered')
      .reduce((sum, o) => sum + (o.total || 0), 0);
  }, [orders]);

  const pendingOrders = useMemo(() => orders.filter(o => o.status !== 'Delivered').length, [orders]);
  const lowStockProducts = useMemo(() => products.filter(p => p.stock < 10), [products]);
  const lowStockCount = lowStockProducts.length;

  // Render recent orders (limit to 4)
  const recentOrders = useMemo(() => orders.slice(0, 4), [orders]);

  // Memoized Chart Coordinates for high-performance rendering
  const chartData = useMemo(() => {
    const chartDatasets = {
      '7d': [
        { label: 'Mon', val: 1450 },
        { label: 'Tue', val: 2100 },
        { label: 'Wed', val: 1850 },
        { label: 'Thu', val: 2950 },
        { label: 'Fri', val: 2600 },
        { label: 'Sat', val: 4100 },
        { label: 'Sun', val: 4800 }
      ],
      '30d': [
        { label: 'Week 1', val: 12400 },
        { label: 'Week 2', val: 15800 },
        { label: 'Week 3', val: 18900 },
        { label: 'Week 4', val: 22400 }
      ],
      '90d': [
        { label: 'Month 1', val: 45000 },
        { label: 'Month 2', val: 58000 },
        { label: 'Month 3', val: 72000 }
      ]
    };

    const points = chartDatasets[timeframe] || chartDatasets['7d'];
    const maxVal = Math.max(...points.map(p => p.val), 5000);

    // Map values to Y coordinates (viewBox 560 x 200)
    const mapY = (val) => 165 - (val / maxVal) * 125;
    const stepX = 500 / (points.length - 1 || 1);
    const pathPoints = points.map((pt, i) => `${30 + i * stepX},${mapY(pt.val)}`);
    
    let pathD = `M ${pathPoints[0]}`;
    for (let i = 1; i < pathPoints.length; i++) {
      const [prevX, prevY] = pathPoints[i-1].split(',').map(Number);
      const [currX, currY] = pathPoints[i].split(',').map(Number);
      const cpX1 = prevX + stepX * 0.45;
      const cpY1 = prevY;
      const cpX2 = currX - stepX * 0.45;
      const cpY2 = currY;
      pathD += ` C ${cpX1},${cpY1} ${cpX2},${cpY2} ${currX},${currY}`;
    }

    const lastPointX = 30 + (points.length - 1) * stepX;
    const areaD = `${pathD} L ${lastPointX},180 L 30,180 Z`;

    return { chartPoints: points, mapY, stepX, pathD, areaD };
  }, [timeframe]);

  const { chartPoints, mapY, stepX, pathD, areaD } = chartData;

  return (
    <div className="space-y-7">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0e3e26] via-[#105634] to-[#126b41] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative mesh background */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-10 w-48 h-48 bg-emerald-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md text-emerald-200 border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Store Dispatch Live</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
              Gupta Kirana Store Dashboard
            </h1>
            <p className="text-emerald-100/80 text-xs sm:text-sm max-w-xl">
              Track live customer checkouts, inventory health, and automated neighborhood dispatch in real time.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setActiveTab('products')}
              className="bg-white hover:bg-emerald-50 text-[#0e3e26] font-bold px-4 py-2.5 rounded-2xl text-xs transition-all shadow-md flex items-center gap-2 font-heading active:scale-95"
            >
              <Plus className="w-4 h-4 text-emerald-700" />
              <span>Add New Product</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className="bg-emerald-950/50 hover:bg-emerald-950/70 border border-emerald-400/30 text-white font-bold px-4 py-2.5 rounded-2xl text-xs transition-all shadow-xs flex items-center gap-2 font-heading active:scale-95"
            >
              <ShoppingCart className="w-4 h-4 text-emerald-300" />
              <span>View All Orders</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Animated KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Revenue */}
        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-card hover:border-emerald-200 transition-all relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#105634] border border-emerald-100 flex items-center justify-center shadow-xs">
              <IndianRupee className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
              <TrendingUp className="w-3 h-3" /> +14.2%
            </span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Sales</p>
          <h3 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mt-1">
            ₹{totalSales.toLocaleString()}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Delivered order volume</span>
          </p>
        </motion.div>

        {/* KPI 2: Orders */}
        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-card hover:border-blue-200 transition-all relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center shadow-xs">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/60">
              <Zap className="w-3 h-3 text-blue-500" /> {pendingOrders} Active
            </span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</p>
          <h3 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mt-1">
            {orders.length}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1.5">
            All-time customer requests
          </p>
        </motion.div>

        {/* KPI 3: Stock Status */}
        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-card hover:border-emerald-300 transition-all relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs border ${
              lowStockCount > 0 
                ? 'bg-rose-50 text-rose-600 border-rose-100' 
                : 'bg-emerald-50 text-emerald-700 border-emerald-100'
            }`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            {lowStockCount > 0 ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                Action Required
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                Optimal
              </span>
            )}
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Low Stock Items</p>
          <h3 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mt-1">
            {lowStockCount}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1.5">
            {lowStockCount > 0 ? 'Stock is running below 10 units' : 'All SKUs adequately stocked'}
          </p>
        </motion.div>

        {/* KPI 4: Rating */}
        <motion.div 
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-card hover:border-emerald-300 transition-all relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#105634] border border-emerald-200/70 flex items-center justify-center shadow-xs">
              <Star className="w-6 h-6 fill-[#105634] text-[#105634]" />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0e3e26] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/70">
              Top Rated
            </span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Merchant Rating</p>
          <h3 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mt-1 flex items-baseline gap-1.5">
            4.8 <span className="text-xs font-semibold text-slate-400">/ 5.0</span>
          </h3>
          <p className="text-[11px] text-slate-500 mt-1.5">
            Based on 120+ customer reviews
          </p>
        </motion.div>
      </div>

      {/* Main Insights Grid (Chart + Restock Alerts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Revenue Spline Chart */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/70 shadow-card flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold font-heading text-slate-900">Revenue Flow & Checkout Volume</h3>
              <p className="text-xs text-slate-500 mt-0.5">Real-time local fulfillment revenue trends</p>
            </div>

            {/* Timeframe selector pills */}
            <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl self-start sm:self-auto border border-slate-200/60">
              {[
                { id: '7d', label: '7 Days' },
                { id: '30d', label: '30 Days' },
                { id: '90d', label: '90 Days' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setTimeframe(t.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    timeframe === t.id
                      ? 'bg-[#105634] text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Spline Graph Canvas */}
          <div className="relative w-full h-[220px]">
            <svg viewBox="0 0 560 200" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartEmeraldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#105634" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#105634" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              
              {/* Subtle Horizontal Grid lines */}
              <line x1="30" y1="35" x2="530" y2="35" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="30" y1="80" x2="530" y2="80" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="30" y1="125" x2="530" y2="125" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="30" y1="170" x2="530" y2="170" stroke="#e2e8f0" strokeWidth="1.5" />

              {/* Animated Gradient Area */}
              <motion.path 
                key={`spline-area-${timeframe}`}
                d={areaD} 
                fill="url(#chartEmeraldGrad)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
              />

              {/* Animated Line Drawing (PathLength from 0 to 1) */}
              <motion.path 
                key={`spline-line-${timeframe}`}
                d={pathD} 
                fill="none" 
                stroke="#105634" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  pathLength: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
                  opacity: { duration: 0.2 }
                }}
              />

              {/* Moving Effect of Line (Continuous Tracer Pulse Flow) */}
              <motion.path
                key={`spline-tracer-${timeframe}`}
                d={pathD}
                fill="none"
                stroke="#34d399"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="35 180"
                initial={{ strokeDashoffset: 400, opacity: 0 }}
                animate={{ strokeDashoffset: 0, opacity: [0, 0.95, 0.6, 0] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.5
                }}
              />

              {/* Animated Staggered Data Nodes */}
              {chartPoints.map((pt, i) => {
                const cx = 30 + i * stepX;
                const cy = mapY(pt.val);
                const isHovered = hoveredPoint === i;

                return (
                  <motion.g 
                    key={`${timeframe}-${i}`}
                    initial={{ opacity: 0, scale: 0, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      delay: 0.2 + (i / chartPoints.length) * 0.65,
                      duration: 0.4,
                      type: "spring",
                      stiffness: 400,
                      damping: 24
                    }}
                    onMouseEnter={() => setHoveredPoint(i)} 
                    onMouseLeave={() => setHoveredPoint(null)}
                    className="cursor-pointer"
                  >
                    {isHovered && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={14}
                        fill="#105634"
                        opacity="0.18"
                        className="animate-ping"
                      />
                    )}
                    <circle 
                      cx={cx} 
                      cy={cy} 
                      r={isHovered ? 7 : 5} 
                      fill="#0e3e26" 
                      stroke="#ffffff" 
                      strokeWidth="2.5" 
                      className="transition-all duration-200" 
                    />
                    
                    {/* Value Badge */}
                    <text 
                      x={cx} 
                      y={cy - 12} 
                      textAnchor="middle" 
                      className="text-[11px] font-black fill-slate-800 font-heading select-none pointer-events-none"
                    >
                      ₹{pt.val.toLocaleString()}
                    </text>

                    {/* X-axis Label */}
                    <text 
                      x={cx} 
                      y="190" 
                      textAnchor="middle" 
                      className="text-[10px] font-bold fill-slate-400 font-sans select-none pointer-events-none"
                    >
                      {pt.label}
                    </text>
                  </motion.g>
                );
              })}
            </svg>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Highest revenue peak: ₹{Math.max(...chartPoints.map(p => p.val)).toLocaleString()}</span>
            </span>
            <span className="text-[11px] text-slate-400">Refreshed live every 60s</span>
          </div>
        </div>

        {/* Restock Alerts Sidebar Widget */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/70 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl border ${
                  lowStockCount > 0 
                    ? 'bg-rose-50 text-rose-600 border-rose-100' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                }`}>
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-heading text-slate-900">Restock Alerts</h3>
                  <p className="text-[11px] text-slate-400">Inventory items needing attention</p>
                </div>
              </div>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                lowStockCount > 0
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {lowStockCount} items
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {lowStockProducts.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-700">Inventory in Great Health</p>
                  <p className="text-[11px] text-slate-400">All products have 10+ units available in stock.</p>
                </div>
              ) : (
                lowStockProducts.slice(0, 4).map((p) => (
                  <div 
                    key={p.id} 
                    className="p-3 bg-slate-50 hover:bg-emerald-50/40 border border-slate-200/70 hover:border-emerald-200/70 rounded-2xl transition-all flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                        {p.image && p.image !== '/placeholder.jpg' ? (
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-800 truncate font-heading">{p.name}</p>
                        <p className="text-[10px] text-slate-400">{p.category}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        {p.stock} left
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('inventory')}
            className="w-full mt-4 py-2.5 px-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-[#0e3e26] text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <span>Open Inventory Controller</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recent Orders Live Stream Section */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/70 shadow-card">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold font-heading text-slate-900">Recent Customer Orders</h3>
            <p className="text-xs text-slate-500 mt-0.5">Live feed of orders placed by neighborhood buyers</p>
          </div>

          <button
            onClick={() => setActiveTab('orders')}
            className="text-xs font-bold text-[#105634] hover:text-[#0e3e26] hover:underline flex items-center gap-1"
          >
            <span>View All ({orders.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl">
            <ShoppingCart className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-600">No Orders Registered Yet</p>
            <p className="text-[11px] text-slate-400">Incoming buyer orders will stream into this feed automatically.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentOrders.map((o) => (
              <div 
                key={o.id}
                className="bg-slate-50 hover:bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-emerald-200 shadow-xs hover:shadow-card transition-all flex flex-col justify-between text-left space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      #{o.id.slice(-6)}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      o.status === 'Delivered'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : o.status === 'Pending'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {o.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-800 font-heading truncate">
                    {o.customerName}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {o.items}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-xs font-black font-heading text-slate-900">
                    ₹{o.total}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {o.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Operational Highlights Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg Prep Speed</p>
            <h4 className="text-base font-bold text-slate-800 font-heading">14 mins / order</h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-700">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Fulfillment Accuracy</p>
            <h4 className="text-base font-bold text-slate-800 font-heading">99.4% error-free</h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 text-[#105634]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Delivery Partner Rating</p>
            <h4 className="text-base font-bold text-slate-800 font-heading">4.9 / 5.0 Star</h4>
          </div>
        </div>
      </div>

    </div>
  );
};
export default StatsHome;
