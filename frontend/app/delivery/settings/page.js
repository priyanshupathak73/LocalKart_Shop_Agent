"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Power, Navigation, Volume2, Shield, Save, CheckCircle2, X } from 'lucide-react';
import { FormInput } from '../../../components/common/FormInput';

export default function DeliverySettingsPage() {
  const [onDuty, setOnDuty] = useState(true);
  const [autoAccept, setAutoAccept] = useState(true);
  const [maxDistance, setMaxDistance] = useState(8);
  const [navApp, setNavApp] = useState('GoogleMaps');
  const [voiceGuidance, setVoiceGuidance] = useState(true);
  const [highVolumeAlert, setHighVolumeAlert] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (title, message) => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast('Settings Saved', 'Delivery preferences updated successfully!');
    }, 800);
  };

  return (
    <div className="space-y-6 relative text-left">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="p-4 bg-slate-900 border border-emerald-500/30 text-white rounded-2xl shadow-2xl flex items-start justify-between gap-3 z-50 mb-2"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-400 font-heading">{toast.title}</h4>
                <p className="text-[11px] text-slate-300 font-medium">{toast.message}</p>
              </div>
            </div>
            <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <h1 className="text-2xl font-black font-heading text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-emerald-500" /> Delivery Preferences & Duty Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-0.5">
          Manage shift status, navigation app defaults, order ping sound alerts, and rider safety preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Duty Status & Dispatch Settings */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-left">
          <div className="p-5 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2 font-heading">
              <Power className="w-4 h-4 text-emerald-500" /> Shift Duty Mode & Order Auto-Assign
            </h3>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${onDuty ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
              {onDuty ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">On-Duty Availability Status</p>
                <p className="text-[10px] text-slate-400">Receive trip requests from nearby local store merchants</p>
              </div>
              <button
                type="button"
                onClick={() => setOnDuty(!onDuty)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${onDuty ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}
              >
                <span className="w-4 h-4 bg-white rounded-full shadow-md" />
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Auto-Accept Nearest Orders</p>
                <p className="text-[10px] text-slate-400">Automatically accept trip assignments within 2 km</p>
              </div>
              <button
                type="button"
                onClick={() => setAutoAccept(!autoAccept)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${autoAccept ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}
              >
                <span className="w-4 h-4 bg-white rounded-full shadow-md" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 font-heading">
                Maximum Trip Radius Limit (km)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(parseInt(e.target.value) || 0)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-4 pr-12 py-2.5 text-xs font-semibold outline-none focus:border-emerald-500 dark:text-slate-100"
                />
                <span className="absolute right-4 top-2.5 text-xs font-bold text-slate-400">km</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Navigation App & Audio Settings */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-left">
          <div className="p-5 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2 font-heading">
              <Navigation className="w-4 h-4 text-emerald-500" /> GPS Navigation & Audio Alert Ringtones
            </h3>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 font-heading">
                Preferred GPS Navigation Provider
              </label>
              <select
                value={navApp}
                onChange={(e) => setNavApp(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-emerald-500 dark:text-slate-100"
              >
                <option value="GoogleMaps">Google Maps (Turn-by-Turn GPS)</option>
                <option value="OpenStreetMap">OpenStreetMap (Built-in In-App Map)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">High-Volume Ringtone Alerts</p>
                <p className="text-[10px] text-slate-400">Play loud audio alert sound when a new trip order arrives</p>
              </div>
              <button
                type="button"
                onClick={() => setHighVolumeAlert(!highVolumeAlert)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${highVolumeAlert ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}
              >
                <span className="w-4 h-4 bg-white rounded-full shadow-md" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 font-heading shadow-md transition-all"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save All Delivery Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
