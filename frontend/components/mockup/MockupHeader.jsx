"use client";

import React from 'react';
import { ShoppingBag } from 'lucide-react';

export const MockupHeader = ({ onClose }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-955/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="p-2 bg-emerald-600 text-white rounded-xl shadow-md">
          <ShoppingBag className="w-5 h-5" />
        </span>
        <div>
          <h1 className="text-lg font-black tracking-tight text-white font-heading">
            Local<span className="text-emerald-500">Kart</span> Mockup Showroom
          </h1>
          <p className="text-xs text-slate-400">Interactive live prototype with multi-document upload support</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-slate-800/80 border border-slate-700/50 px-3 py-1.5 rounded-lg text-xs">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-slate-300">Live Data Sync Active</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-lg shadow-emerald-900/20"
          >
            Exit Mockup Showroom
          </button>
        )}
      </div>
    </header>
  );
};
