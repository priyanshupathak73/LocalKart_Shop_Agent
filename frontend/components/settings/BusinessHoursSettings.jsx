"use client";

import React, { useState } from 'react';
import { Clock, Calendar, Check, Save } from 'lucide-react';

export const BusinessHoursSettings = ({ showToast }) => {
  const [openingTime, setOpeningTime] = useState('08:00');
  const [closingTime, setClosingTime] = useState('22:00');
  const [autoAccept, setAutoAccept] = useState(true);
  const [isOpenSunday, setIsOpenSunday] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      if (showToast) showToast('Operational Hours Saved', 'Business hours updated successfully!');
    }, 700);
  };

  return (
    <div className="bg-white border border-slate-200/70 rounded-3xl shadow-card overflow-hidden text-left">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
          <Clock className="w-4 h-4 text-[#105634]" /> Operating Hours & Order Scheduling
        </h3>
        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Auto Schedule
        </span>
      </div>

      <form onSubmit={handleSave} className="p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 font-heading">
              Store Opening Time *
            </label>
            <input
              type="time"
              value={openingTime}
              onChange={(e) => setOpeningTime(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-2xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-[#105634] focus:ring-2 focus:ring-emerald-500/15 text-slate-800 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 font-heading">
              Store Closing Time *
            </label>
            <input
              type="time"
              value={closingTime}
              onChange={(e) => setClosingTime(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-2xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-[#105634] focus:ring-2 focus:ring-emerald-500/15 text-slate-800 transition-all"
            />
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-800">Open on Sundays</p>
            <p className="text-[11px] text-slate-400">Accept neighborhood customer orders on weekends</p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpenSunday(!isOpenSunday)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${isOpenSunday ? 'bg-[#105634] justify-end' : 'bg-slate-300 justify-start'}`}
          >
            <span className="w-4 h-4 bg-white rounded-full shadow-md" />
          </button>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-800">Auto-Pause Store on High Influx</p>
            <p className="text-[11px] text-slate-400">Automatically pause store incoming orders if &gt;15 pending orders</p>
          </div>
          <button
            type="button"
            onClick={() => setAutoAccept(!autoAccept)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${autoAccept ? 'bg-[#105634] justify-end' : 'bg-slate-300 justify-start'}`}
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
            <span>{saving ? 'Saving Schedule...' : 'Save Operating Hours'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
export default BusinessHoursSettings;
