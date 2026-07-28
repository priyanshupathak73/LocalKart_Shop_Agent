"use client";

import React, { useState } from 'react';
import { Navigation, ShoppingBag, Truck, Save } from 'lucide-react';
import { FormInput } from '../common/FormInput';

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
    }, 800);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-left">
      <div className="p-5 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2 font-heading">
          <Truck className="w-4 h-4 text-emerald-500" /> Delivery Zone & Free Shipping Thresholds
        </h3>
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          Hyper-Local
        </span>
      </div>

      <form onSubmit={handleSave} className="p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 font-heading flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5 text-slate-400" /> Max Delivery Radius
            </label>
            <div className="relative">
              <input
                type="number"
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value) || 0)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-4 pr-12 py-2.5 text-xs font-semibold outline-none focus:border-emerald-500 dark:text-slate-100"
              />
              <span className="absolute right-4 top-2.5 text-xs font-bold text-slate-400">km</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 font-heading flex items-center gap-1">
              <ShoppingBag className="w-3.5 h-3.5 text-slate-400" /> Min Free Delivery Threshold
            </label>
            <div className="relative">
              <input
                type="number"
                value={minFreeDelivery}
                onChange={(e) => setMinFreeDelivery(parseInt(e.target.value) || 0)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-4 pr-12 py-2.5 text-xs font-semibold outline-none focus:border-emerald-500 dark:text-slate-100"
              />
              <span className="absolute right-4 top-2.5 text-xs font-bold text-slate-400">INR</span>
            </div>
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Express 30-Minute Delivery</p>
            <p className="text-[10px] text-slate-400">Enable priority quick delivery option for nearby orders</p>
          </div>
          <button
            type="button"
            onClick={() => setExpressDelivery(!expressDelivery)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${expressDelivery ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}
          >
            <span className="w-4 h-4 bg-white rounded-full shadow-md" />
          </button>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 font-heading shadow-md transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Saving...' : 'Save Delivery Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};
