"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, CheckCircle2, X } from 'lucide-react';

import { NotificationSettings } from '../../../components/settings/NotificationSettings';
import { BusinessHoursSettings } from '../../../components/settings/BusinessHoursSettings';
import { DeliveryRadiusSettings } from '../../../components/settings/DeliveryRadiusSettings';
import { SecuritySettings } from '../../../components/settings/SecuritySettings';

export default function SettingsPage() {
  const [toast, setToast] = useState(null);

  const showToast = (title, message, type = 'success') => {
    setToast({ title, message, type });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="space-y-6 relative text-left">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`p-4 text-white rounded-2xl shadow-2xl border flex items-start justify-between gap-3 z-50 mb-2 ${
              toast.type === 'error' ? 'bg-red-950 border-red-500/50' : 'bg-slate-900 border-emerald-500/30'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${toast.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className={`text-xs font-bold font-heading ${toast.type === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>
                  {toast.title}
                </h4>
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
          <Settings className="w-6 h-6 text-emerald-500" /> Store Operational Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-0.5">
          Configure business operating hours, notification alerts, hyper-local delivery limits, and account security.
        </p>
      </div>

      <div className="space-y-6">
        {/* 1. Operating Hours & Schedule */}
        <BusinessHoursSettings showToast={showToast} />

        {/* 2. Delivery Zone & Radius Preferences */}
        <DeliveryRadiusSettings showToast={showToast} />

        {/* 3. Notification & Sound Alert Preferences */}
        <NotificationSettings showToast={showToast} />

        {/* 4. Security & Password Configuration */}
        <SecuritySettings showToast={showToast} />
      </div>
    </div>
  );
}
