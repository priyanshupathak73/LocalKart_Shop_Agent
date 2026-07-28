import React from 'react';

export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-sm">
      {/* Top Loading Progress Line */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-slate-100 overflow-hidden">
        <div className="h-full bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981] w-[60%]"></div>
      </div>
      
      {/* Spinner card */}
      <div className="flex flex-col items-center gap-4 bg-white/70 backdrop-blur-md border border-slate-200/50 p-8 rounded-3xl shadow-xl">
        <div className="relative w-16 h-16">
          {/* Static outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-slate-200/60"></div>
          {/* Spinning ring */}
          <div className="absolute inset-0 rounded-full border-4 border-t-emerald-500 animate-spin"></div>
          {/* Center brand cart */}
          <div className="absolute inset-0 flex items-center justify-center text-xl select-none">
            🛒
          </div>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <span className="text-sm font-bold text-slate-700 tracking-wider">LocalKart</span>
          <span className="text-xs text-slate-400 animate-pulse mt-1">Orchestrating Portal...</span>
        </div>
      </div>
    </div>
  );
}
