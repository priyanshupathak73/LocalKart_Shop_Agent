"use client";

import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export const KYCComplianceSummaryCard = () => {
  return (
    <div className="bg-white border border-slate-200/70 rounded-3xl shadow-card overflow-hidden text-left">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
          <ShieldCheck className="w-4 h-4 text-[#105634]" /> KYC & Regulatory Compliance
        </h3>
        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Authenticated
        </span>
      </div>

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">PAN Card</p>
          <p className="text-xs font-bold text-slate-900 font-mono">ABCDE1234F</p>
          <span className="text-[10px] text-emerald-700 font-bold block">✓ Identity Verified</span>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">GSTIN Registry</p>
          <p className="text-xs font-bold text-slate-900 font-mono">07AAAAA0000A1Z5</p>
          <span className="text-[10px] text-emerald-700 font-bold block">✓ Form REG-06 Verified</span>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">FSSAI License</p>
          <p className="text-xs font-bold text-slate-900 font-mono">10020011000123</p>
          <span className="text-[10px] text-emerald-700 font-bold block">✓ Food Compliance Active</span>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1 sm:col-span-2 md:col-span-3">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Bank Payout Destination</p>
          <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
            <p className="text-xs font-bold text-slate-900 font-heading">State Bank of India (IFSC: SBIN0001822)</p>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-lg font-mono">
              A/C: ••••••••8912
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default KYCComplianceSummaryCard;
