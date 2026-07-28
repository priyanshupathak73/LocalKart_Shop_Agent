"use client";

import React from 'react';
import { ArrowLeft } from 'lucide-react';

const logoUrl = '/assets/Logo.png';

export const RegistrationNavbar = ({ onBack }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/80 px-6 py-4 transition-all">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={logoUrl} className="h-9 w-auto" alt="e-LocalKart Logo" />
          <span className="text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 px-2 py-0.5 rounded-md">
            Merchant Hub
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Already started?</span>
          <button
            onClick={onBack}
            className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Exit to Login
          </button>
        </div>
      </div>
    </nav>
  );
};
