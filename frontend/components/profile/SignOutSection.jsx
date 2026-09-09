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
    <div className="bg-rose-50/60 border border-rose-200/80 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-xs">
      <div className="flex items-center gap-3.5">
        <div className="p-3 bg-rose-100 text-rose-700 rounded-2xl shrink-0">
          <LogOut className="w-5 h-5 stroke-[2]" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 font-heading">Sign Out of Merchant Account</h4>
          <p className="text-xs text-slate-500">Safely terminate active shopkeeper session on this computer</p>
        </div>
      </div>

      {confirming ? (
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleSignOut}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-1.5 shadow-md font-heading transition-colors"
          >
            <AlertTriangle className="w-4 h-4" /> Yes, Sign Out Now
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-3.5 py-2.5 rounded-2xl text-xs font-heading transition-colors shadow-xs"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-md font-heading transition-all shrink-0 active:scale-95"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      )}
    </div>
  );
};
export default SignOutSection;
