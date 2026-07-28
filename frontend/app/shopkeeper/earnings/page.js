"use client";

import React, { useState } from 'react';
import { IndianRupee, TrendingUp, Calendar, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStore } from '../../../store/useStore';

export default function EarningsPage() {
  const orders = useStore((state) => state.orders);
  
  // States
  const [isRequesting, setIsRequesting] = useState(false);
  const [payoutRequested, setPayoutRequested] = useState(false);
  const [payouts, setPayouts] = useState([
    { id: 'TXN-90210', date: '2026-07-01', amount: 8500, status: 'Completed', method: 'UPI (gpay@upi)' },
    { id: 'TXN-87421', date: '2026-06-15', amount: 4800, status: 'Completed', method: 'Bank Transfer (...9012)' },
    { id: 'TXN-85112', date: '2026-06-01', amount: 6200, status: 'Completed', method: 'UPI (gpay@upi)' },
  ]);

  // Calculations
  const deliveredOrders = orders.filter(o => o.status === 'Delivered');
  const baseRevenue = 12450; // Mock base revenue to start with
  const ordersRevenue = deliveredOrders.reduce((sum, o) => sum + o.total, 0);
  const totalRevenue = baseRevenue + ordersRevenue;
  
  const platformFee = Math.round(totalRevenue * 0.05); // 5% platform fee
  const netEarnings = totalRevenue - platformFee;

  // Handle request payout
  const handleRequestPayout = () => {
    setIsRequesting(true);
    setTimeout(() => {
      setIsRequesting(false);
      setPayoutRequested(true);
      const newPayout = {
        id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
        date: new Date().toISOString().split('T')[0],
        amount: Math.round(netEarnings - payouts.reduce((sum, p) => sum + p.amount, 0)),
        status: 'Processing',
        method: 'UPI (gupta@okaxis)'
      };
      setPayouts([newPayout, ...payouts]);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-800">Financial Center</h1>
          <p className="text-slate-500 text-sm">Monitor revenue statistics, commissions, and request payouts.</p>
        </div>
        <button
          onClick={handleRequestPayout}
          disabled={payoutRequested || isRequesting}
          className={`px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all duration-200 shadow-md flex items-center gap-2 ${
            payoutRequested
              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
              : 'bg-[#10B981] hover:bg-emerald-600 text-white hover:shadow-lg'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          {isRequesting ? 'Requesting...' : payoutRequested ? 'Payout Pending' : 'Request Payout'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-bl-full"></div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Revenue</p>
          <h3 className="text-3xl font-bold font-heading text-slate-800 mt-2">₹{totalRevenue.toLocaleString()}</h3>
          <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12.4% from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 rounded-bl-full"></div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Platform Commission (5%)</p>
          <h3 className="text-3xl font-bold font-heading text-slate-800 mt-2">₹{platformFee.toLocaleString()}</h3>
          <p className="text-slate-400 text-[10px] mt-2">Deducted dynamically per checkout</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#10B981]/20 shadow-md relative overflow-hidden bg-gradient-to-br from-white to-emerald-50/10">
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#10B981]/10 rounded-bl-full"></div>
          <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Net Earnings</p>
          <h3 className="text-3xl font-bold font-heading text-[#166534] mt-2">₹{netEarnings.toLocaleString()}</h3>
          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md w-fit">
            <span>Settled & Audited</span>
          </div>
        </div>
      </div>

      {payoutRequested && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-emerald-800">Payout Request Processing</h4>
            <p className="text-xs text-emerald-700 mt-0.5">Your request to settle the current net balance has been logged. Funds should reflect in your UPI account in 24-48 business hours.</p>
          </div>
        </div>
      )}

      {/* Transactions & Settlements */}
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800">Payout Statements</h3>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Showing recent settlements
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-bold text-xs uppercase tracking-wider border-b border-slate-100">
                <th className="py-4 px-6">Reference ID</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Method</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payouts.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-mono text-slate-600 font-semibold">{po.id}</td>
                  <td className="py-4 px-6 text-slate-500">{po.date}</td>
                  <td className="py-4 px-6 text-slate-600 font-medium">{po.method}</td>
                  <td className="py-4 px-6 text-slate-800 font-bold">₹{po.amount.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      po.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700 animate-pulse'
                    }`}>
                      {po.status === 'Completed' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      {po.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
