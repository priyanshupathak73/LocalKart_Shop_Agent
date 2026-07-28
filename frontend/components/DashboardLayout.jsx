"use client";

import React, { useState } from 'react';
import { Menu, X, Bell, User, LogOut } from 'lucide-react';

export const DashboardLayout = ({ 
  sidebarItems = [], 
  activeTab, 
  setActiveTab, 
  user = {}, 
  logout, 
  children 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-body text-slate-700">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-[#166534] text-white px-4 py-3 flex items-center justify-between shadow-md z-50">
        <div className="flex items-center gap-2">
          <div className="bg-white px-2 py-0.5 rounded-lg">
            <img src="/assets/Logo.png" className="h-6 w-auto" alt="e-LocalKart Logo" />
          </div>
          <span className="text-[10px] uppercase tracking-wider font-bold bg-[#10B981] text-white px-1.5 py-0.5 rounded">
            {user?.role || 'SHOPKEEPER'}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Mobile Profile Avatar Button Link */}
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all shrink-0 active:scale-95 shadow-xs"
            title="View User Profile"
          >
            <User className="w-4 h-4 text-emerald-300" />
          </button>

          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 text-slate-100 hover:text-white rounded-lg focus:outline-none"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Sidebar - Dark Green (#166534) */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-[#166534] text-white flex flex-col z-40 transition-transform duration-300 transform shadow-xl
        md:translate-x-0 md:static md:h-screen shrink-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Logo Header */}
        <div className="p-6 border-b border-green-700/50 hidden md:block">
          <div className="flex items-center gap-2.5">
            <div className="bg-white px-2.5 py-1.5 rounded-xl shadow-md">
              <img src="/assets/Logo.png" className="h-8 w-auto" alt="e-LocalKart Logo" />
            </div>
            <div>
              <p className="text-[10px] text-green-300 font-semibold uppercase tracking-wider mt-0.5">
                {user?.role} Portal
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Items */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
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
                  w-full flex items-center gap-3.5 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-[#10B981] text-white shadow-lg shadow-emerald-700/20' 
                    : 'text-green-100 hover:bg-green-700/40 hover:text-white'
                  }
                `}
              >
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-105 ${isActive ? 'text-white' : 'text-green-300'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Desktop Navbar Banner */}
        <header className="hidden md:flex bg-white border-b border-slate-200/60 px-8 py-4 items-center justify-between shadow-sm z-30">
          <div>
            <h2 className="text-xl font-bold font-heading text-slate-800 capitalize">
              {sidebarItems.find(i => i.id === activeTab)?.label || (activeTab === 'profile' ? 'User Profile' : 'Dashboard')}
            </h2>
          </div>
          
          <div className="flex items-center gap-5">
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
            </button>
            <div className="h-6 w-px bg-slate-200"></div>

            {/* Profile Avatar Button Link (Second Image Refined) */}
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-3 p-1.5 pl-2.5 rounded-xl hover:bg-slate-100 transition-all group cursor-pointer border border-transparent hover:border-slate-200"
              title="View User Profile"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-105 transition-transform">
                <User className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 transition-colors leading-tight font-heading">
                  {user?.name || 'Ashwani Gupta'}
                </p>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                  {user?.role || 'SHOPKEEPER'}
                </span>
              </div>
            </button>
          </div>
        </header>

        {/* Content Pane */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/70">
          <div className="max-w-6xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
