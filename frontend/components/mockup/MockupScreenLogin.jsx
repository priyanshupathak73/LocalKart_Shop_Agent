"use client";

import React from 'react';
import { Mail, Lock, ChevronRight } from 'lucide-react';
import { MockupPhoneFrame } from './MockupPhoneFrame';

export const MockupScreenLogin = ({ email, setEmail, password, setPassword, onSimulateLogin }) => {
  return (
    <MockupPhoneFrame title="Screen 1: Login Screen">
      <div className="flex-1 flex flex-col justify-between p-5 pt-8 bg-white text-slate-800">
        <div className="text-center space-y-3.5">
          <img src="/assets/Logo.png" className="w-20 h-auto mx-auto" alt="e-LocalKart Logo" />
          <h3 className="text-lg font-black text-slate-800 leading-tight font-heading">
            Welcome to LocalKart
          </h3>
        </div>

        <div className="my-4 space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 shadow-sm">
          <div className="space-y-2 text-left">
            <div>
              <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-2.5 w-3 h-3 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white border border-slate-200 focus:border-emerald-500 rounded-lg pl-8 pr-2.5 py-2 text-[10px] text-slate-800 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-2.5 top-2.5 w-3 h-3 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-200 focus:border-emerald-500 rounded-lg pl-8 pr-2.5 py-2 text-[10px] text-slate-800 outline-none"
                />
              </div>
            </div>
          </div>

          <button
            onClick={onSimulateLogin}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <span>Sign In to Dashboard</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-[10px] text-slate-400">
            Don't have an account? <span className="font-bold text-emerald-600">Register Store</span>
          </p>
        </div>
      </div>
    </MockupPhoneFrame>
  );
};
