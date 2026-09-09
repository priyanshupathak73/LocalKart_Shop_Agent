"use client";

import React, { useState } from 'react';
import { Navigation, ShoppingBag, Truck, Save } from 'lucide-react';

export const DeliveryRadiusSettings = ({ showToast }) => {
  const [radius, setRadius] = useState(5);
  const [minFreeDelivery, setMinFreeDelivery] = useState(150);
  const [expressDelivery, setExpressDelivery] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      if (showToast) showToast('Delivery Preferences Saved', 'Delivery limits and radius updated!');
    }, 700);
  };

  return (
    <div className="bg-white border border-slate-200/70 rounded-3xl shadow-card overflow-hidden text-left">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
          <Truck className="w-4 h-4 text-[#105634]" /> Delivery Radius & Hyper-Local Limits
        </h3>
        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Hyper-Local Zone
        </span>
      </div>

      <form onSubmit={handleSave} className="p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 font-heading flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5 text-slate-400" /> Max Delivery Radius
            </label>
            <div className="relative">
              <input
                type="number"
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-2xl pl-4 pr-12 py-2.5 text-xs font-semibold outline-none focus:border-emerald-500 text-slate-800"
              />
              <span className="absolute right-4 top-2.5 text-xs font-bold text-slate-400">km</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 font-heading flex items-center gap-1">
              <ShoppingBag className="w-3.5 h-3.5 text-slate-400" /> Min Free Delivery Threshold
            </label>
            <div className="relative">
              <input
                type="number"
                value={minFreeDelivery}
                onChange={(e) => setMinFreeDelivery(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-2xl pl-4 pr-12 py-2.5 text-xs font-semibold outline-none focus:border-emerald-500 text-slate-800"
              />
              <span className="absolute right-4 top-2.5 text-xs font-bold text-slate-400">INR</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-800">Express 30-Minute Delivery</p>
            <p className="text-[11px] text-slate-400">Enable priority fast-lane dispatch for nearby neighborhood apartments</p>
          </div>
          <button
            type="button"
            onClick={() => setExpressDelivery(!expressDelivery)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${expressDelivery ? 'bg-[#105634] justify-end' : 'bg-slate-300 justify-start'}`}
          >
            <span className="w-4 h-4 bg-white rounded-full shadow-md" />
          </button>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#105634] hover:bg-[#0e3e26] text-white font-bold px-5 py-2.5 rounded-2xl text-xs flex items-center gap-2 font-heading shadow-md transition-all active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Delivery Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
export default DeliveryRadiusSettings;
