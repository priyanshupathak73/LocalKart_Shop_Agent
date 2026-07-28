"use client";

import React, { useState } from 'react';
import { Mail, Lock, ShieldAlert, ShoppingBag, User } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import API from '../../api/api';
import { AuthLogo } from './AuthLogo';

export const LoginForm = ({ onSuccess, onRegisterShopkeeper, onRegisterDelivery }) => {
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('shopkeeper');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await API.post('/auth/login', { email, password });
      const { user, token } = res.data.data;
      const safeUser = { ...user, role: user.role === 'SHOPKEEPER' ? 'shopkeeper' : 'delivery' };
      login(safeUser, token);
      setLoading(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/85 backdrop-blur-md border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-xl text-slate-800">
      <AuthLogo />
      <div className="text-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 font-heading">Welcome to LocalKart</h2>
        <p className="text-slate-500 text-xs md:text-sm mt-0.5">Access your merchant or delivery portal</p>
      </div>

      {error && (
        <div className="mb-3 p-2.5 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2 border border-red-100">
          <ShieldAlert className="w-4 h-4 shrink-0" /><span>{error}</span>
        </div>
      )}

      {/* Role Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-4 text-xs font-semibold">
        <button type="button" onClick={() => setRole('shopkeeper')} className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${role === 'shopkeeper' ? 'bg-white text-emerald-700 shadow-sm font-bold' : 'text-slate-500'}`}>
          <ShoppingBag className="w-3.5 h-3.5" /> Merchant
        </button>
        <button type="button" onClick={() => setRole('delivery')} className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${role === 'delivery' ? 'bg-white text-purple-700 shadow-sm font-bold' : 'text-slate-500'}`}>
          <User className="w-3.5 h-3.5" /> Delivery Partner
        </button>
      </div>

      <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-left">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-heading">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="merchant@example.com" className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none font-semibold" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-heading">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none font-semibold" />
          </div>
        </div>

        <button type="submit" disabled={loading} className={`w-full py-3 text-white font-bold rounded-xl text-xs shadow-md transition-all font-heading ${role === 'shopkeeper' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-purple-600 hover:bg-purple-700'}`}>
          {loading ? 'Authenticating...' : `Sign In as ${role === 'shopkeeper' ? 'Merchant' : 'Delivery Partner'}`}
        </button>
      </form>

      <div className="mt-5 pt-4 border-t border-slate-100 text-center space-y-2 text-xs">
        {role === 'shopkeeper' ? (
          <p className="text-slate-500">Want to sell on LocalKart? <button onClick={onRegisterShopkeeper} className="font-bold text-emerald-600 hover:underline">Register Store</button></p>
        ) : (
          <p className="text-slate-500">New delivery runner? <button onClick={onRegisterDelivery} className="font-bold text-purple-600 hover:underline">Register Delivery Account</button></p>
        )}
      </div>
    </div>
  );
};
