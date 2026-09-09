"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IndianRupee, 
  TrendingUp, 
  Calendar, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  Download, 
  Sparkles, 
  Building2, 
  Smartphone, 
  ShieldCheck,
  Clock,
  Loader2
} from 'lucide-react';
import { useStore } from '../../../store/useStore';

export default function EarningsPage() {
  const orders = useStore((state) => state.orders);
  
  // States
  const [isRequesting, setIsRequesting] = useState(false);
  const [payoutRequested, setPayoutRequested] = useState(false);
  const [payouts, setPayouts] = useState([
    { id: 'TXN-90210', date: '2026-07-01', amount: 8500, status: 'Completed', method: 'UPI (gupta@okaxis)' },
    { id: 'TXN-87421', date: '2026-06-15', amount: 4800, status: 'Completed', method: 'HDFC Bank (...9012)' },
    { id: 'TXN-85112', date: '2026-06-01', amount: 6200, status: 'Completed', method: 'UPI (gupta@okaxis)' },
  ]);

  // Calculations
  const deliveredOrders = orders.filter(o => o.status === 'Delivered');
  const baseRevenue = 12450;
  const ordersRevenue = deliveredOrders.reduce((sum, o) => sum + (o.total || 0), 0);
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
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black font-heading text-slate-900 tracking-tight">
              Merchant Financial Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Verified Settlement
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Monitor gross customer checkout volumes, track 5% platform commissions, and request instant bank payouts.
          </p>
        </div>

        <button
          onClick={handleRequestPayout}
          disabled={payoutRequested || isRequesting}
          className={`px-5 py-3 rounded-2xl font-bold text-xs tracking-tight transition-all duration-200 shadow-md flex items-center justify-center gap-2 font-heading active:scale-95 ${
            payoutRequested
              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
              : 'bg-[#105634] hover:bg-[#0e3e26] text-white hover:shadow-lg'
          }`}
        >
          {isRequesting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing Settlement...</span>
            </>
          ) : payoutRequested ? (
            <>
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Payout Pending Approval</span>
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 text-emerald-300" />
              <span>Request Instant Payout</span>
            </>
          )}
        </button>
      </div>

      {/* Financial Metric Cards (3 cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Gross Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-card relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Sales Volume</span>
            <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <IndianRupee className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-3xl font-black font-heading text-slate-900">₹{totalRevenue.toLocaleString()}</h3>
          <div className="flex items-center gap-1.5 mt-2.5 text-xs text-emerald-700 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.2% from previous settlement cycle</span>
          </div>
        </div>

        {/* Platform Fee */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-card relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Platform Commission (5%)</span>
            <span className="p-2 bg-slate-100 text-slate-600 rounded-xl">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-3xl font-black font-heading text-slate-900">₹{platformFee.toLocaleString()}</h3>
          <p className="text-slate-400 text-xs mt-2.5">
            Covers payment gateway charges & delivery logistics
          </p>
        </div>

        {/* Net Settled Earnings (Featured Emerald Card) */}
        <div className="bg-gradient-to-br from-[#0e3e26] to-[#105634] text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Available Net Balance</span>
            <span className="p-2 bg-white/10 text-emerald-300 rounded-xl border border-white/20">
              <Sparkles className="w-4 h-4 text-emerald-300" />
            </span>
          </div>
          <h3 className="text-3xl font-black font-heading text-white">₹{netEarnings.toLocaleString()}</h3>
          <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-emerald-200 font-bold bg-white/10 px-2.5 py-1 rounded-xl w-fit border border-white/15">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
            <span>Ready for Direct Transfer</span>
          </div>
        </div>
      </div>

      {/* Payout Pending Toast/Alert */}
      <AnimatePresence>
        {payoutRequested && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 flex items-start gap-3 shadow-xs"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-emerald-900 font-heading">Payout Request Successfully Initiated</h4>
              <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                Your settlement request for current net balance has been securely queued. Funds will be deposited to your registered account (gupta@okaxis) within 24-48 business hours.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bank Account Verification & Settlement Statement */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Settlement Account Card */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/70 shadow-card space-y-4">
          <h3 className="text-base font-bold font-heading text-slate-900">Connected Payout Method</h3>
          
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 font-heading">Primary UPI VPA</p>
                  <p className="text-[11px] text-slate-400 font-mono">gupta@okaxis</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
              <span>Beneficiary Name:</span>
              <span className="font-bold text-slate-700">Ashwani Gupta</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 font-heading">Bank Account</p>
                  <p className="text-[11px] text-slate-400 font-mono">HDFC •••• 9012</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                Backup
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
              <span>IFSC Code:</span>
              <span className="font-mono font-bold text-slate-700">HDFC0001234</span>
            </div>
          </div>
        </div>

        {/* Payout Statements Table */}
        <div className="lg:col-span-8 bg-white border border-slate-200/70 rounded-3xl shadow-card overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-heading text-slate-900">Historical Settlement Statements</h3>
              <p className="text-xs text-slate-400 mt-0.5">Audited transfers and merchant payouts</p>
            </div>
            <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5" /> Bi-weekly schedule
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3.5 px-6">Reference ID</th>
                  <th className="py-3.5 px-6">Settlement Date</th>
                  <th className="py-3.5 px-6">Deposit Method</th>
                  <th className="py-3.5 px-6 text-right">Net Amount</th>
                  <th className="py-3.5 px-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payouts.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-mono text-slate-700 font-bold">{po.id}</td>
                    <td className="py-4 px-6 text-slate-500">{po.date}</td>
                    <td className="py-4 px-6 text-slate-700 font-medium">{po.method}</td>
                    <td className="py-4 px-6 text-right font-black font-heading text-slate-900 text-sm">
                      ₹{po.amount.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold ${
                        po.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
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

    </div>
  );
}
