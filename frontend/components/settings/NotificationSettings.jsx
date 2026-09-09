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
      if (showToast) showToast('Notifications Saved', 'Notification preferences updated successfully!');
    }, 700);
  };

  return (
    <div className="bg-white border border-slate-200/70 rounded-3xl shadow-card overflow-hidden text-left">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
          <Bell className="w-4 h-4 text-[#105634]" /> Sound Alerts & Notifications
        </h3>
        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Real-time Alerts
        </span>
      </div>

      <form onSubmit={handleSave} className="p-6 space-y-4">
        {/* Order Push Alerts */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-[#105634] rounded-xl border border-emerald-100">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">New Order Push Notifications</p>
              <p className="text-[11px] text-slate-400">Receive instant high-priority browser alerts when a customer places an order</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOrderAlerts(!orderAlerts)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${orderAlerts ? 'bg-[#105634] justify-end' : 'bg-slate-300 justify-start'}`}
          >
            <span className="w-4 h-4 bg-white rounded-full shadow-md" />
          </button>
        </div>

        {/* Audio Sound Alerts */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-[#105634] rounded-xl border border-emerald-100">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Sound Chime on Incoming Checkout</p>
              <p className="text-[11px] text-slate-400">Play an audible chime alert in the shop so you never miss an order</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSoundAlerts(!soundAlerts)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${soundAlerts ? 'bg-[#105634] justify-end' : 'bg-slate-300 justify-start'}`}
          >
            <span className="w-4 h-4 bg-white rounded-full shadow-md" />
          </button>
        </div>

        {/* Daily Email Summary */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Daily Financial & Settlement Digest</p>
              <p className="text-[11px] text-slate-400">Receive evening summary of total daily revenue, settled items, and top products</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setEmailDigest(!emailDigest)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${emailDigest ? 'bg-[#105634] justify-end' : 'bg-slate-300 justify-start'}`}
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
            <span>{saving ? 'Saving...' : 'Save Notification Preferences'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
export default NotificationSettings;
