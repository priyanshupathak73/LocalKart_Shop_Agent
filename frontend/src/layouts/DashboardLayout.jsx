import React, { useState } from 'react';
import { Menu, X, Bell, User, LogOut } from 'lucide-react';
import logoUrl from '../assets/Logo.png';

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
            <img src={logoUrl} className="h-6 w-auto" alt="e-LocalKart Logo" />
          </div>
          <span className="text-[10px] uppercase tracking-wider font-bold bg-[#10B981] text-white px-1.5 py-0.5 rounded">
            {user?.role}
          </span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1 text-slate-100 hover:text-white rounded-lg focus:outline-none"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
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
              <img src={logoUrl} className="h-8 w-auto" alt="e-LocalKart Logo" />
            </div>
            <div>
              <p className="text-[10px] text-green-300 font-semibold uppercase tracking-wider mt-0.5">
                {user?.role} Portal
              </p>
            </div>
          </div>
        </div>

        {/* User Card Profile */}
        <div className="p-4 mx-4 my-4 bg-green-900/40 border border-green-700/40 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-700/50 flex items-center justify-center border border-[#10B981]/30">
            <User className="w-5 h-5 text-[#10B981]" />
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold truncate leading-tight">{user?.name}</h4>
            <p className="text-[11px] text-green-300/80 truncate mt-0.5">{user?.email}</p>
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

        {/* Footer Logout */}
        <div className="p-4 border-t border-green-700/50">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3.5 px-4 py-3 text-sm font-medium text-red-200 hover:text-white hover:bg-red-900/30 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5 text-red-300" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Desktop Navbar Banner */}
        <header className="hidden md:flex bg-white border-b border-slate-200/60 px-8 py-4 items-center justify-between shadow-sm z-30">
          <div>
            <h2 className="text-xl font-bold font-heading text-slate-800 capitalize">
              {sidebarItems.find(i => i.id === activeTab)?.label || 'Dashboard'}
            </h2>
          </div>
          
          <div className="flex items-center gap-5">
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2.5">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name}</p>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{user?.role}</span>
              </div>
            </div>
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
