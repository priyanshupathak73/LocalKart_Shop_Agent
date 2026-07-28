import React from 'react';

export default function ShopkeeperLoading() {
  return (
    <div className="w-full min-h-[400px] flex flex-col items-center justify-center py-12">
      <div className="flex flex-col items-center gap-4 bg-white border border-slate-200/50 p-8 rounded-3xl shadow-sm max-w-sm w-full">
        <div className="relative w-12 h-12">
          {/* Static Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
          {/* Spin Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-t-emerald-500 animate-spin"></div>
        </div>
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-bold text-slate-600 tracking-wider">Loading Page...</span>
          <span className="text-[10px] text-slate-400 mt-1 animate-pulse">Syncing store records</span>
        </div>
      </div>
    </div>
  );
}
