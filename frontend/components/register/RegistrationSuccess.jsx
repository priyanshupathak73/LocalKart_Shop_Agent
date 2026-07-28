"use client";

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const RegistrationSuccess = ({ shopName, handleFinalRedirectDashboard }) => {
  return (
    <div className="max-w-xl mx-auto bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xl text-center space-y-5 animate-fade-in my-10">
      <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold font-heading text-slate-800">Registration Submitted!</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Congratulations! Your merchant registration application for <strong className="text-slate-800">{shopName || 'your store'}</strong> has been successfully received.
        </p>
      </div>
      <div className="pt-2">
        <button
          onClick={handleFinalRedirectDashboard}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-3 rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
        >
          Go to Merchant Dashboard
        </button>
      </div>
    </div>
  );
};
