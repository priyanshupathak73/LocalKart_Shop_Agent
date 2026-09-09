"use client";

import React, { useState } from 'react';
import { Mail, Lock, ShieldAlert, ShoppingBag, User, ArrowRight, Loader2 } from 'lucide-react';
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
    <div className="w-full max-w-md mx-auto bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl text-slate-800 text-left">
      <AuthLogo />
      
      <div className="text-center mb-5">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading tracking-tight">
          Welcome to LocalKart
        </h2>
        <p className="text-slate-500 text-xs mt-1">
          Access your merchant store or delivery runner console
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-50 text-rose-800 rounded-2xl text-xs flex items-center gap-2 border border-rose-200 font-medium">
          <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Role Selection Tabs */}
      <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-slate-100 rounded-2xl mb-5 text-xs font-bold">
        <button 
          type="button" 
          onClick={() => setRole('shopkeeper')} 
          className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            role === 'shopkeeper' 
              ? 'bg-white text-[#0e3e26] shadow-xs' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
          <span>Store Merchant</span>
        </button>
        <button 
          type="button" 
          onClick={() => setRole('delivery')} 
          className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            role === 'delivery' 
              ? 'bg-white text-purple-800 shadow-xs' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-3.5 h-3.5 text-purple-700" />
          <span>Delivery Partner</span>
        </button>
      </div>

      <form onSubmit={handleLoginSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-heading">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="merchant@example.com" 
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 outline-none transition-all font-medium" 
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-heading">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 outline-none transition-all font-medium" 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className={`w-full py-3 text-white font-bold rounded-2xl text-xs shadow-md transition-all font-heading flex items-center justify-center gap-2 active:scale-98 ${
            role === 'shopkeeper' 
              ? 'bg-[#105634] hover:bg-[#0e3e26]' 
              : 'bg-purple-700 hover:bg-purple-800'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Credentials...</span>
            </>
          ) : (
            <>
              <span>Sign In as {role === 'shopkeeper' ? 'Store Merchant' : 'Delivery Partner'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs">
        {role === 'shopkeeper' ? (
          <p className="text-slate-500">
            Want to sell your offline store inventory?{' '}
            <button 
              type="button" 
              onClick={onRegisterShopkeeper} 
              className="font-bold text-[#105634] hover:text-[#0e3e26] hover:underline"
            >
              Register Store
            </button>
          </p>
        ) : (
          <p className="text-slate-500">
            Earn delivering local orders?{' '}
            <button 
              type="button" 
              onClick={onRegisterDelivery} 
              className="font-bold text-purple-700 hover:text-purple-900 hover:underline"
            >
              Register as Runner
            </button>
          </p>
        )}
      </div>
    </div>
  );
};
export default LoginForm;
