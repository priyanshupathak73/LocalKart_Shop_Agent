import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import API from '../../api/axios';
import logoUrl from '../../assets/Logo.png';
import { 
  Mail, 
  Lock, 
  ShieldAlert, 
  ShoppingBag, 
  Truck, 
  User, 
  ArrowLeft, 
  Camera, 
  Phone, 
  FileText,
  Check,
  Upload
} from 'lucide-react';

// Custom e-LocalKart Logo
const Logo = () => (
  <div className="flex flex-col items-center justify-center select-none mb-5">
    <img src={logoUrl} className="w-24 h-auto" alt="e-LocalKart Logo" />
  </div>
);

export const Login = ({ onSuccess, onRegisterShopkeeper }) => {
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('shopkeeper');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Registration Mode: null | 'delivery'
  const [isRegistering, setIsRegistering] = useState(null);

  // Registration Form States
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Delivery-specific field
  const [vehicleType, setVehicleType] = useState('MOTORCYCLE');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError(null);
    
    try {
      const res = await API.post('/auth/login', { email, password });
      const { user, token } = res.data.data;
      
      // Map uppercase roles to frontend lowercase dashboard layout checks
      const safeUser = {
        ...user,
        role: user.role === 'SHOPKEEPER' ? 'shopkeeper' : 'delivery'
      };
      
      login(safeUser, token);
      setLoading(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Login failed');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !regEmail || !regPassword || !phone) {
      setError('Please fill in Name, Email, Password, and Phone Number');
      return;
    }
    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      name: fullName,
      email: regEmail,
      password: regPassword,
      phone,
      role: 'DELIVERY_PARTNER',
      vehicleType
    };

    try {
      const res = await API.post('/auth/register', payload);
      const { user, token } = res.data.data;

      const safeUser = {
        ...user,
        role: 'delivery'
      };

      login(safeUser, token);
      setLoading(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Registration failed');
    }
  };



  // Render Delivery Signup view
  if (isRegistering === 'delivery') {
    return (
      <div className="w-full max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-8 shadow-xl text-slate-800">
        <button 
          onClick={() => { setIsRegistering(null); setError(null); }}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors mb-5"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </button>
        
        <Logo />

        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-slate-800">Become a Delivery Partner</h2>
          <p className="text-slate-500 text-sm mt-1">Register to start accepting deliveries in your neighborhood</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-750 rounded-xl text-sm flex items-center gap-2 border border-red-100">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div className="text-left space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter 10-digit number"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input 
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input 
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Vehicle Type</label>
              <select 
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
              >
                <option value="MOTORCYCLE">Motorcycle</option>
                <option value="BICYCLE">Bicycle</option>
                <option value="CAR">Car</option>
                <option value="AUTO">Auto Rickshaw</option>
              </select>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md mt-4 disabled:opacity-50"
          >
            {loading ? 'Processing Registration...' : 'Complete Registration'}
          </button>
        </form>
      </div>
    );
  }

  // Standard Login view
  return (
    <div className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 shadow-xl text-slate-800">
      
      <Logo />

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Welcome to LocalKart</h2>
        <p className="text-slate-500 text-sm mt-1">Access your shopkeeper or delivery partner dashboard</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-755 rounded-xl text-sm flex items-center gap-2 border border-red-100">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Role Selector Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-6 text-sm font-semibold">
        <button
          type="button"
          onClick={() => setRole('shopkeeper')}
          className={`py-2 rounded-lg transition-all ${
            role === 'shopkeeper'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Shopkeeper
        </button>
        <button
          type="button"
          onClick={() => setRole('delivery')}
          className={`py-2 rounded-lg transition-all ${
            role === 'delivery'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Delivery
        </button>
      </div>

      <form onSubmit={handleLoginSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1 text-left">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1 text-left">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 outline-none transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#10b981] hover:bg-emerald-600 text-white rounded-xl py-2.5 font-bold text-sm transition-colors shadow-md shadow-emerald-600/10 focus:ring-2 focus:ring-emerald-500/30 outline-none disabled:opacity-50 animate-fade-in"
        >
          {loading ? 'Logging in...' : `Log in as ${role === 'delivery' ? 'Delivery' : 'Shopkeeper'}`}
        </button>
      </form>

      {/* Don't have an account? section */}
      <div className="mt-6 border-t border-slate-150 pt-5 text-center space-y-3">
        <p className="text-xs font-bold text-slate-550">Don't have an account?</p>
        <div className="grid grid-cols-1 gap-2">
          <button
            type="button"
            onClick={() => { if (onRegisterShopkeeper) onRegisterShopkeeper(); }}
            className="w-full bg-[#10b981] hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <span>📱</span> Register as Shopkeeper
          </button>
          <button
            type="button"
            onClick={() => { setIsRegistering('delivery'); setError(null); }}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <span>🛵</span> Become Delivery Partner
          </button>
        </div>
      </div>
    </div>
  );
};
