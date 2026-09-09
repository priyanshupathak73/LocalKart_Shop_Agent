"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Bell, 
  User, 
  LogOut, 
  Star, 
  Store, 
  Sparkles,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export const DashboardLayout = ({ 
  sidebarItems = [], 
  activeTab, 
  setActiveTab, 
  user = {}, 
  logout, 
  children 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isStoreLive, setIsStoreLive] = useState(true);

  const activeItem = sidebarItems.find(i => i.id === activeTab);
  const currentTitle = activeItem?.label || (activeTab === 'profile' ? 'Store & Merchant Profile' : 'Dashboard');

  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col md:flex-row font-sans text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Mobile Top Header */}
      <header className="md:hidden bg-[#0e3e26] text-white px-4 py-3 flex items-center justify-between shadow-md z-50 sticky top-0">
        <div className="flex items-center gap-2.5">
          <div className="bg-white px-2 py-1 rounded-xl shadow-sm">
            <img src="/assets/Logo.png" className="h-6 w-auto object-contain" alt="LocalKart" />
          </div>
          <span className="text-[10px] uppercase tracking-wider font-extrabold bg-[#105634] text-emerald-200 border border-emerald-600/40 px-2 py-0.5 rounded-full">
            {user?.role || 'MERCHANT'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Store Live Status Pill */}
          <button
            onClick={() => setIsStoreLive(!isStoreLive)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold transition-all ${
              isStoreLive 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40' 
                : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isStoreLive ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
            <span>{isStoreLive ? 'Live' : 'Paused'}</span>
          </button>

          {/* Profile Shortcut */}
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-emerald-200 hover:bg-white/20 transition-all shrink-0 active:scale-95"
            title="Merchant Profile"
          >
            <User className="w-4 h-4 text-emerald-300" />
          </button>

          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 text-white/90 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            aria-label="Toggle Navigation"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Signature Emerald Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-[#0e3e26] via-[#105634] to-[#0c3620] text-white flex flex-col z-50 transition-transform duration-300 ease-out shadow-2xl
        md:translate-x-0 md:static md:h-screen shrink-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="p-6 border-b border-emerald-800/40">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-2xl shadow-md ring-2 ring-emerald-500/20">
              <img src="/assets/Logo.png" className="h-7 w-auto object-contain" alt="LocalKart" />
            </div>
            <div>
              <h1 className="text-sm font-black font-heading tracking-tight text-white flex items-center gap-1">
                LocalKart <span className="text-[#f27a21] text-xs">●</span>
              </h1>
              <span className="text-[10px] text-emerald-300/80 font-bold uppercase tracking-wider block">
                Merchant Center
              </span>
            </div>
          </div>
        </div>

        {/* Store Quick Status Widget in Sidebar */}
        <div className="px-5 pt-4 pb-2">
          <div className="bg-emerald-950/40 border border-emerald-700/30 rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-800/60 text-emerald-300">
                <Store className="w-4 h-4" />
                {isStoreLive && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0e3e26] animate-pulse" />
                )}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white font-heading">
                  {user?.shopName || 'Gupta Kirana Store'}
                </p>
                <span className="text-[10px] text-emerald-300/90 font-medium">
                  {isStoreLive ? 'Online & Taking Orders' : 'Store Offline'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsStoreLive(!isStoreLive)}
              className={`w-9 h-5 rounded-full transition-colors relative p-0.5 focus:outline-none ${
                isStoreLive ? 'bg-emerald-500' : 'bg-slate-600'
              }`}
              title="Toggle Online/Offline"
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isStoreLive ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 px-4 py-3 space-y-1.5 overflow-y-auto custom-scrollbar">
          <div className="px-3 pb-1 text-[10px] font-bold text-emerald-300/60 uppercase tracking-wider">
            Management
          </div>
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between px-3.5 py-3 text-xs font-semibold rounded-2xl transition-all duration-200 group text-left
                  ${isActive 
                    ? 'bg-white text-[#0e3e26] font-bold shadow-lg shadow-emerald-950/20' 
                    : 'text-emerald-100/85 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    p-1.5 rounded-xl transition-colors
                    ${isActive 
                      ? 'bg-emerald-100 text-[#0e3e26]' 
                      : 'text-emerald-300/90 group-hover:text-white group-hover:bg-white/10'
                    }
                  `}>
                    <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  </div>
                  <span className="tracking-tight">{item.label}</span>
                </div>

                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-[#0e3e26]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Merchant Footer Profile Card & Sign Out */}
        <div className="p-4 border-t border-emerald-800/40 bg-emerald-950/30">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => {
                setActiveTab('profile');
                setIsSidebarOpen(false);
              }}
              className="flex items-center gap-2.5 text-left flex-1 min-w-0 hover:opacity-85 transition-opacity"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-300 text-[#0e3e26] flex items-center justify-center font-bold text-xs shadow-md shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'M'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate font-heading">
                  {user?.name || 'Ashwani Gupta'}
                </p>
                <p className="text-[10px] text-emerald-300/70 truncate">
                  {user?.email || 'merchant@localkart.in'}
                </p>
              </div>
            </button>

            {logout && (
              <button
                onClick={logout}
                className="p-2 rounded-xl text-emerald-300/70 hover:text-white hover:bg-rose-500/20 hover:text-rose-300 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#f9fafb]">
        {/* Desktop Navbar Banner */}
        <header className="hidden md:flex bg-white/90 backdrop-blur-md border-b border-slate-200/70 px-8 py-3.5 items-center justify-between shadow-xs z-30 sticky top-0">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black font-heading text-slate-800 tracking-tight">
              {currentTitle}
            </h2>
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Merchant Portal</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3.5">
            {/* Store Rating Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/60 text-amber-800 text-xs font-bold shadow-xs">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>4.8</span>
              <span className="text-slate-400 font-normal text-[11px]">(128 reviews)</span>
            </div>

            {/* Live Store Status Switcher */}
            <button
              onClick={() => setIsStoreLive(!isStoreLive)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border shadow-xs ${
                isStoreLive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200/70'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isStoreLive ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
              <span>{isStoreLive ? 'Store Open' : 'Store Paused'}</span>
            </button>

            <div className="h-6 w-px bg-slate-200"></div>

            {/* Notification Bell */}
            <button className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-all relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#f27a21] rounded-full ring-2 ring-white"></span>
            </button>

            {/* User Profile Avatar Link */}
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2.5 p-1 rounded-2xl hover:bg-slate-100/80 transition-all group cursor-pointer border border-transparent hover:border-slate-200"
              title="View Store & Merchant Profile"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0e3e26] to-[#105634] text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-105 transition-transform">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'M'}
              </div>
              <div className="text-left hidden xl:block pr-1">
                <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors leading-tight font-heading">
                  {user?.name || 'Ashwani Gupta'}
                </p>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                  {user?.role || 'SHOPKEEPER'}
                </span>
              </div>
            </button>
          </div>
        </header>

        {/* Main Content Pane */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#f9fafb]">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;
