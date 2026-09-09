"use client";

import React from 'react';
import { Sparkles, Check, Mail, Phone, MessageSquare, ShieldCheck, Zap } from 'lucide-react';

const MerchantTabletIllustration = () => (
  <svg viewBox="0 0 500 400" className="w-full h-auto max-w-[420px] mx-auto filter drop-shadow-xs select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="250" cy="200" r="160" fill="#ECFDF5" />
    <rect x="180" y="80" width="280" height="240" rx="24" fill="#105634" fillOpacity="0.08" />
    <rect x="80" y="280" width="340" height="40" rx="10" fill="#334155" />
    <rect x="60" y="320" width="380" height="15" fill="#1E293B" />
    <rect x="120" y="160" width="50" height="120" rx="4" fill="#E2E8F0" />
    <rect x="130" y="180" width="30" height="10" fill="#34D399" />
    <rect x="130" y="210" width="30" height="10" fill="#105634" />
    <rect x="130" y="240" width="30" height="10" fill="#0e3e26" />
    <rect x="330" y="160" width="50" height="120" rx="4" fill="#E2E8F0" />
    <rect x="340" y="180" width="30" height="10" fill="#F87171" />
    <rect x="340" y="210" width="30" height="10" fill="#F59E0B" />
    <rect x="340" y="240" width="30" height="10" fill="#60A5FA" />
    <rect x="180" y="140" width="140" height="96" rx="8" fill="#0F172A" />
    <rect x="186" y="146" width="128" height="84" rx="4" fill="#F8FAFC" />
    <path d="M150 280C150 250 170 230 190 230L200 240L180 280H150Z" fill="#FDBA74" />
    <path d="M350 280C350 250 330 230 310 230L300 240L320 280H350Z" fill="#FDBA74" />
    <rect x="194" y="156" width="50" height="12" rx="2" fill="#105634" />
    <circle cx="288" cy="162" r="6" fill="#64748B" />
    <rect x="194" y="176" width="112" height="6" rx="1" fill="#CBD5E1" />
    <rect x="194" y="188" width="80" height="6" rx="1" fill="#E2E8F0" />
    <rect x="194" y="200" width="112" height="18" rx="3" fill="#105634" fillOpacity="0.15" />
    <rect x="202" y="206" width="60" height="6" rx="1" fill="#105634" />
    <circle cx="250" cy="100" r="28" fill="#FDBA74" />
    <path d="M222 98C222 80 232 72 250 72C268 72 278 80 278 98C270 94 265 96 250 90C235 96 230 94 222 98Z" fill="#1E293B" />
    <path d="M226 128L250 148L274 128" stroke="#105634" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

export const RegistrationHero = () => {
  return (
    <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-24">
      <div className="space-y-4 text-left">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#105634] bg-emerald-50 border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-[#f27a21]" /> Start Earning in Neighborhood
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight tracking-tight font-heading">
          Become an <br />e-LocalKart Merchant
        </h1>
        <p className="text-slate-600 text-sm max-w-md">
          Digitize your neighborhood store today. Partner with local delivery runners and serve thousands of households instantly.
        </p>
      </div>

      <MerchantTabletIllustration />

      {/* Benefits checklist */}
      <div className="bg-white border border-slate-200/70 rounded-3xl p-6 shadow-card space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-left border-b border-slate-100 pb-2 font-heading">
          Why Sell with Us?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          {[
            "Sell to customers nearby",
            "Same-day delivery support",
            "Zero setup fees",
            "Secure direct bank transfers",
            "Dedicated seller dashboard",
            "Smart inventory management"
          ].map((benefit, i) => (
            <div key={i} className="flex items-start gap-2 text-xs font-medium text-slate-700">
              <span className="p-0.5 bg-emerald-50 rounded-full text-[#105634] shrink-0 border border-emerald-100">
                <Check className="w-3.5 h-3.5" />
              </span>
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { value: "10,000+", label: "Buyers" },
          { value: "500+", label: "Verified Stores" },
          { value: "24 Hours", label: "Fast Approval" },
          { value: "4.9 ★", label: "Store Rating" }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white border border-slate-200/70 p-4 rounded-2xl shadow-xs text-center">
            <div className="text-base font-black text-[#105634] font-heading">{stat.value}</div>
            <div className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase tracking-wide">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Support Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs border-t border-slate-200 pt-4">
        <span className="font-bold text-slate-500">Need Help?</span>
        <div className="flex flex-wrap gap-2.5">
          <a href="mailto:support@localkart.com" className="flex items-center gap-1 text-slate-600 hover:text-[#105634] transition-colors font-medium">
            <Mail className="w-3.5 h-3.5" /> Email
          </a>
          <span className="text-slate-300">•</span>
          <a href="tel:+918005550199" className="flex items-center gap-1 text-slate-600 hover:text-[#105634] transition-colors font-medium">
            <Phone className="w-3.5 h-3.5" /> Call Support
          </a>
          <span className="text-slate-300">•</span>
          <button className="flex items-center gap-1 text-slate-600 hover:text-[#105634] transition-colors font-medium">
            <MessageSquare className="w-3.5 h-3.5" /> Live Chat
          </button>
        </div>
      </div>
    </div>
  );
};
export default RegistrationHero;
