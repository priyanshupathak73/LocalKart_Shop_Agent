"use client";

import React from 'react';
import { User, ShieldCheck, Mail, Phone, Calendar, Store } from 'lucide-react';

export const ProfileHeader = ({ user, storeName = 'Gupta Kirana Store', category = 'Grocery' }) => {
  return (
    <div className="bg-gradient-to-r from-emerald-800 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden text-left">
      <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg">
            <User className="w-9 h-9 stroke-[2]" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl md:text-2xl font-black font-heading tracking-tight text-white">
                {user?.name || 'Ashwani Gupta'}
              </h2>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400 stroke-[3]" /> Verified Merchant
              </span>
            </div>

            <p className="text-xs text-slate-300 font-medium flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-emerald-400" /> {user?.email || 'ashwani@example.com'}</span>
              <span className="text-slate-500">•</span>
              <span className="flex items-center gap-1"><Store className="w-3.5 h-3.5 text-emerald-400" /> {storeName} ({category})</span>
            </p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl text-left shrink-0 sm:self-center">
          <p className="text-[10px] text-slate-300 uppercase tracking-wider font-bold">Account Role</p>
          <p className="text-xs font-black text-emerald-400 uppercase font-heading">{user?.role || 'SHOPKEEPER'}</p>
        </div>
      </div>
    </div>
  );
};
