"use client";

import React from 'react';
import { User, ShieldCheck, Mail, Store, Sparkles } from 'lucide-react';

export const ProfileHeader = ({ user, storeName = 'Gupta Kirana Store', category = 'Grocery' }) => {
  return (
    <div className="bg-gradient-to-r from-[#0e3e26] via-[#105634] to-[#126b41] text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden text-left">
      <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-48 h-48 bg-emerald-300/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-300 shrink-0 shadow-lg">
            <User className="w-9 h-9 stroke-[2]" />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl md:text-2xl font-black font-heading tracking-tight text-white">
                {user?.name || 'Ashwani Gupta'}
              </h2>
              <span className="bg-white/15 text-emerald-200 border border-white/20 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 backdrop-blur-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300 stroke-[2.5]" /> Verified Merchant Partner
              </span>
            </div>

            <p className="text-xs text-emerald-100/80 font-medium flex items-center gap-2.5 flex-wrap">
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-emerald-300" /> {user?.email || 'merchant@localkart.in'}</span>
              <span className="text-emerald-400">•</span>
              <span className="flex items-center gap-1"><Store className="w-3.5 h-3.5 text-emerald-300" /> {storeName} ({category})</span>
            </p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3 rounded-2xl text-left shrink-0 sm:self-center">
          <p className="text-[10px] text-emerald-200 uppercase tracking-wider font-bold">Portal Access</p>
          <p className="text-xs font-black text-white uppercase font-heading">{user?.role || 'SHOPKEEPER'}</p>
        </div>
      </div>
    </div>
  );
};
export default ProfileHeader;
