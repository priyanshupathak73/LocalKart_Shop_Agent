"use client";

import React from 'react';

export const MockupPhoneFrame = ({ children, title }) => (
  <div className="flex flex-col items-center">
    {title && (
      <div className="mb-3 text-center">
        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {title}
        </span>
      </div>
    )}
    <div className="w-[365px] h-[785px] bg-slate-900 rounded-[50px] p-3.5 shadow-2xl relative border-4 border-slate-800 flex flex-col shrink-0">
      {/* Ear Speaker & Camera Notch */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-36 h-6 bg-slate-900 rounded-full z-30 flex items-center justify-between px-6">
        <div className="w-3 h-3 bg-slate-800 rounded-full"></div>
        <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
        <div className="w-3 h-3 bg-slate-800 rounded-full"></div>
      </div>
      
      {/* Screen Container */}
      <div className="w-full h-full bg-slate-50 rounded-[38px] overflow-hidden flex flex-col relative border border-slate-700/10">
        {/* Status Bar */}
        <div className="h-8 bg-white border-b border-slate-100 flex items-center justify-between px-6 pt-1 text-[10px] font-semibold text-slate-500 z-20">
          <span>9:41 AM</span>
          <div className="flex items-center gap-1.5">
            <span>5G</span>
            <div className="w-4 h-2.5 bg-slate-400 rounded-sm"></div>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto scrollbar-none flex flex-col pb-8">
          {children}
        </div>
        
        {/* Home Indicator */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-300 rounded-full z-20"></div>
      </div>
    </div>
  </div>
);
