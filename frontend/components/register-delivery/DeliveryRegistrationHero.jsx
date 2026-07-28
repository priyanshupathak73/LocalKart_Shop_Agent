"use client";

import React from 'react';
import { Sparkles, Check, Mail, Phone, MessageSquare, Bike, ShieldCheck, Zap, IndianRupee } from 'lucide-react';

const DeliveryRiderIllustration = () => (
  <svg viewBox="0 0 500 400" className="w-full h-auto max-w-[420px] mx-auto filter drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="250" cy="200" r="160" fill="#ECFDF5" />
    <path d="M120 280C120 280 180 260 250 260C320 260 380 280 380 280" stroke="#10B981" strokeWidth="8" strokeLinecap="round" />
    <circle cx="160" cy="280" r="45" stroke="#334155" strokeWidth="12" fill="#F8FAFC" />
    <circle cx="340" cy="280" r="45" stroke="#334155" strokeWidth="12" fill="#F8FAFC" />
    <circle cx="160" cy="280" r="12" fill="#10B981" />
    <circle cx="340" cy="280" r="12" fill="#10B981" />
    <path d="M160 280L210 200L270 200L340 280" stroke="#10B981" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M210 200L250 275" stroke="#059669" strokeWidth="8" strokeLinecap="round" />
    <rect x="300" y="160" width="70" height="70" rx="14" fill="#10B981" />
    <path d="M320 185L335 200L355 175" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="230" cy="130" r="22" fill="#FDBA74" />
    <path d="M210 120C210 105 220 95 240 95C255 95 260 105 260 120H210Z" fill="#1E293B" />
    <path d="M210 150L240 185L270 170" stroke="#3B82F6" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const DeliveryRegistrationHero = () => {
  return (
    <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-24 text-left">
      <div className="space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50">
          <Zap className="w-3.5 h-3.5" /> High Demand Rider Network
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white leading-tight tracking-tight font-heading">
          Become an <br />e-LocalKart Delivery Partner
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md">
          Deliver local groceries, food & essentials to neighborhood customers. Flexible hours, instant daily payouts, and zero registration fees.
        </p>
      </div>

      <DeliveryRiderIllustration />

      {/* Benefits checklist */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-left border-b border-slate-100 dark:border-slate-800/60 pb-2">
          Why Ride with Us?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          {[
            "Flexible working shifts",
            "Instant daily earnings payout",
            "Zero setup & sign-up fees",
            "Short-distance local trips",
            "Free delivery kit & helmet",
            "Rider accident insurance cover"
          ].map((benefit, i) => (
            <div key={i} className="flex items-start gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <span className="p-0.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-full text-emerald-600 dark:text-emerald-400 shrink-0">
                <Check className="w-3.5 h-3.5" />
              </span>
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { value: "5,000+", label: "Active Riders" },
          { value: "₹35,000", label: "Monthly Earning" },
          { value: "Instant", label: "Daily Payout" },
          { value: "4.9 ★", label: "Rider Rating" }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/50 p-4 rounded-2xl shadow-sm text-center">
            <div className="text-base font-black text-[#10B981] font-heading">{stat.value}</div>
            <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 mt-0.5 uppercase tracking-wide">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Support Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs border-t border-slate-200/60 dark:border-slate-800/60 pt-4">
        <span className="font-bold text-slate-500">Need Help?</span>
        <div className="flex flex-wrap gap-2.5">
          <a href="mailto:ridersupport@localkart.com" className="flex items-center gap-1 text-slate-500 hover:text-emerald-600 dark:text-slate-400 transition-colors font-medium">
            <Mail className="w-3.5 h-3.5" /> Email Support
          </a>
          <span className="text-slate-300">•</span>
          <a href="tel:18005622552" className="flex items-center gap-1 text-slate-500 hover:text-emerald-600 dark:text-slate-400 transition-colors font-medium">
            <Phone className="w-3.5 h-3.5" /> Call Hotline
          </a>
        </div>
      </div>
    </div>
  );
};
