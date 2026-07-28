"use client";

import React, { useState } from 'react';
import { LogOut, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppRouter } from '../../hooks/useAppRouter';

export const SignOutSection = () => {
  const { logout } = useAuthStore();
  const router = useAppRouter();
  const [confirming, setConfirming] = useState(false);

  const handleSignOut = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="bg-red-50/50 dark:bg-red-950/20 border border-red-200/80 dark:border-red-800/60 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
      <div className="flex items-center gap-3.5">
        <div className="p-3 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl shrink-0">
          <LogOut className="w-6 h-6 stroke-[2]" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-heading">Sign Out of Merchant Account</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">Safely log out of your session on this device</p>
        </div>
      </div>

      {confirming ? (
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleSignOut}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md font-heading transition-colors"
          >
            <AlertTriangle className="w-4 h-4" /> Yes, Sign Out Now
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 font-bold px-3 py-2.5 rounded-xl text-xs font-heading transition-colors"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md font-heading transition-all shrink-0"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      )}
    </div>
  );
};
