import React from 'react';

export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#f9fafb]/90 backdrop-blur-xs">
      {/* Top Loading Progress Line */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-slate-100 overflow-hidden">
        <div className="h-full bg-[#105634] rounded-full animate-pulse shadow-[0_0_8px_#105634] w-[65%]"></div>
      </div>
      
      {/* Spinner card */}
      <div className="flex flex-col items-center gap-4 bg-white border border-slate-200/80 p-8 rounded-3xl shadow-xl">
        <div className="relative w-14 h-14">
          {/* Static outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
          {/* Spinning ring */}
          <div className="absolute inset-0 rounded-full border-4 border-t-[#105634] animate-spin"></div>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <span className="text-sm font-black text-slate-900 font-heading tracking-tight">LocalKart</span>
          <span className="text-xs text-slate-400 animate-pulse mt-0.5">Connecting Store...</span>
        </div>
      </div>
    </div>
  );
}
