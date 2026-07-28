"use client";

import React from 'react';
import { Check } from 'lucide-react';

export const DEFAULT_STEPS = [
  { idx: 1, title: "Personal" },
  { idx: 2, title: "Business" },
  { idx: 3, title: "Address" },
  { idx: 4, title: "Documents" },
  { idx: 5, title: "Review" }
];

export const RegistrationStepper = ({ 
  currentStep, 
  title = "Merchant Registration", 
  steps = DEFAULT_STEPS 
}) => {
  return (
    <div className="p-6 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50 select-none">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-extrabold text-slate-800 dark:text-white font-heading">
          {title}
        </h2>
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
          Step {currentStep} of {steps.length}
        </span>
      </div>

      {/* Horizontal visual stepper */}
      <div className="flex items-center justify-between gap-2 relative">
        {steps.map((s) => (
          <div key={s.idx} className="flex items-center gap-1.5 z-10">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                currentStep > s.idx
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : currentStep === s.idx
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500'
              }`}
            >
              {currentStep > s.idx ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.idx}
            </span>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider hidden md:inline ${
                currentStep >= s.idx ? 'text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              {s.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
