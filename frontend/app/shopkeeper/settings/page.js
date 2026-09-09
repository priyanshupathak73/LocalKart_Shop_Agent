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
            className={`p-4 rounded-2xl shadow-xl border flex items-start justify-between gap-3 z-50 mb-2 ${
              toast.type === 'error' 
                ? 'bg-rose-50 text-rose-900 border-rose-200' 
                : 'bg-emerald-50 text-emerald-900 border-emerald-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${toast.type === 'error' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-700'}`}>
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold font-heading">
                  {toast.title}
                </h4>
                <p className="text-[11px] text-slate-600 font-medium">{toast.message}</p>
              </div>
            </div>
            <button onClick={() => setToast(null)} className="text-slate-400 hover:text-slate-700 p-1">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <h1 className="text-2xl font-black font-heading text-slate-900 tracking-tight flex items-center gap-2">
          Store Operations & Settings
        </h1>
        <p className="text-slate-500 text-xs font-medium mt-0.5">
          Configure business operating hours, sound alerts, hyper-local delivery limits, and account security.
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
