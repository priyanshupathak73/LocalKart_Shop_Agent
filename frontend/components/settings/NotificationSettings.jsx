"use client";

import React, { useState } from 'react';
import { Bell, Mail, Smartphone, Volume2, Save, CheckCircle2 } from 'lucide-react';

export const NotificationSettings = ({ showToast }) => {
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [smsPromos, setSmsPromos] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      if (showToast) showToast('Notifications Saved', 'Notification preferences updated!');
    }, 800);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-left">
      <div className="p-5 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2 font-heading">
          <Bell className="w-4 h-4 text-emerald-500" /> Notification & Alert Preferences
        </h3>
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          Real-time Sync
        </span>
      </div>

      <form onSubmit={handleSave} className="p-6 space-y-4">
        {/* Order Push Alerts */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-lg">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">New Order Push Alerts</p>
              <p className="text-[10px] text-slate-400">Receive instant push notifications for incoming orders</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOrderAlerts(!orderAlerts)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${orderAlerts ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}
          >
            <span className="w-4 h-4 bg-white rounded-full shadow-md" />
          </button>
        </div>

        {/* Audio Sound Alerts */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-lg">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Audio Chime Sound Alerts</p>
              <p className="text-[10px] text-slate-400">Play sound ringtone when a new customer order arrives</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSoundAlerts(!soundAlerts)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${soundAlerts ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}
          >
            <span className="w-4 h-4 bg-white rounded-full shadow-md" />
          </button>
        </div>

        {/* Email Daily Digest */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-lg">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Daily Sales Email Summary</p>
              <p className="text-[10px] text-slate-400">Send end-of-day sales and earnings report to registered email</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setEmailDigest(!emailDigest)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${emailDigest ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}
          >
            <span className="w-4 h-4 bg-white rounded-full shadow-md" />
          </button>
        </div>

        {/* SMS Promotions */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-lg">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">SMS Marketing & Campaign Alerts</p>
              <p className="text-[10px] text-slate-400">Receive SMS alerts for local platform discounts and merchant offers</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSmsPromos(!smsPromos)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${smsPromos ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}
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
            {saving ? 'Saving...' : 'Save Notification Preferences'}
          </button>
        </div>
      </form>
    </div>
  );
};
