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
      if (showToast) showToast('Operational Hours Saved', 'Business hours updated!');
    }, 800);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-left">
      <div className="p-5 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2 font-heading">
          <Clock className="w-4 h-4 text-emerald-500" /> Operating Hours & Order Fulfillment
        </h3>
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          Auto Schedule
        </span>
      </div>

      <form onSubmit={handleSave} className="p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 font-heading">
              Store Opening Time *
            </label>
            <input
              type="time"
              value={openingTime}
              onChange={(e) => setOpeningTime(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-emerald-500 dark:text-slate-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 font-heading">
              Store Closing Time *
            </label>
            <input
              type="time"
              value={closingTime}
              onChange={(e) => setClosingTime(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-emerald-500 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Open on Sundays</p>
            <p className="text-[10px] text-slate-400">Accept customer orders on weekends</p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpenSunday(!isOpenSunday)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${isOpenSunday ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}
          >
            <span className="w-4 h-4 bg-white rounded-full shadow-md" />
          </button>
        </div>

        <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Auto-Accept Incoming Orders</p>
            <p className="text-[10px] text-slate-400">Automatically accept orders during working hours</p>
          </div>
          <button
            type="button"
            onClick={() => setAutoAccept(!autoAccept)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${autoAccept ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}
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
            {saving ? 'Saving...' : 'Save Business Hours'}
          </button>
        </div>
      </form>
    </div>
  );
};
