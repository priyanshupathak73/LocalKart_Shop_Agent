"use client";

import React, { useState, useEffect } from 'react';
import { useAppRouter } from '../hooks/useAppRouter';
import { useAuthStore } from '../store/useAuthStore';
import { LoginForm } from '../components/auth/LoginForm';

import { MockupHeader } from '../components/mockup/MockupHeader';
import { MockupScreenLogin } from '../components/mockup/MockupScreenLogin';
import { MockupScreenRegistration } from '../components/mockup/MockupScreenRegistration';
import { MockupScreenProfile } from '../components/mockup/MockupScreenProfile';

import { Sparkles, MapPin, ShoppingBag, Truck, ShieldCheck, ArrowRight, Store } from 'lucide-react';

export default function Home() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useAppRouter();
  
  const [showMockup, setShowMockup] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mockup Shared State
  const [fullName, setFullName] = useState('Rajesh Kumar');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [email, setEmail] = useState('rajesh.kirana@example.com');
  const [password, setPassword] = useState('••••••••••');
  const [shopName, setShopName] = useState('Rajesh Kirana & General Store');
  const [aadhaar, setAadhaar] = useState('5432 9876 1234');
  const [aadhaarFile, setAadhaarFile] = useState('mock-aadhaar.png');
  const [pan, setPan] = useState('ABCDE1234F');
  const [panFile, setPanFile] = useState('mock-pan.png');
  const [storePhoto, setStorePhoto] = useState('https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&auto=format&fit=crop&q=80');

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      const role = user?.role?.toLowerCase();
      if (role === 'shopkeeper') router.push('/shopkeeper/dashboard');
      else if (role === 'delivery' || role === 'delivery_partner') router.push('/delivery/dashboard');
      else logout();
    }
  }, [isAuthenticated, user, router, mounted, logout]);

  if (!mounted) return <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center text-slate-400 font-sans">Loading LocalKart...</div>;
  if (isAuthenticated) return <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center text-slate-400 font-sans">Redirecting to portal...</div>;

  return (
    <div className="min-h-screen bg-[#f9fafb] font-sans text-slate-800 flex flex-col justify-between">
      {showMockup ? (
        <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
          <MockupHeader onClose={() => setShowMockup(false)} />
          <main className="flex-1 overflow-x-auto overflow-y-auto px-8 py-10 flex flex-col items-center bg-slate-50">
            <div className="max-w-4xl text-center mb-8 space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#105634] bg-emerald-50 border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Interactive 3-Screen Preview
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-heading">
                Store Onboarding Experience
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto">
                Explore the guided flow designed for neighborhood merchants to list their store on LocalKart.
              </p>
            </div>

            <div className="flex flex-row gap-8 items-start justify-center pb-12 w-fit">
              <MockupScreenLogin email={email} setEmail={setEmail} password={password} setPassword={setPassword} />
              <MockupScreenRegistration 
                fullName={fullName} setFullName={setFullName} 
                phone={phone} setPhone={setPhone} 
                shopName={shopName} setShopName={setShopName} 
                aadhaar={aadhaar} setAadhaar={setAadhaar} 
                aadhaarFile={aadhaarFile} 
                pan={pan} setPan={setPan} 
                panFile={panFile} 
                handleKycUpload={(e, docType) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      if (docType === 'aadhaar') setAadhaarFile(reader.result);
                      if (docType === 'pan') setPanFile(reader.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }} 
              />
              <MockupScreenProfile 
                shopName={shopName} fullName={fullName} phone={phone} email={email} 
                storePhoto={storePhoto} 
                handleStorePhotoUpload={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setStorePhoto(reader.result);
                    reader.readAsDataURL(file);
                  }
                }} 
                aadhaarFile={aadhaarFile} panFile={panFile} 
              />
            </div>
          </main>
        </div>
      ) : (
        <>
          {/* Top Navbar */}
          <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/70 px-6 py-3.5">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white p-1.5 rounded-xl shadow-xs border border-slate-100">
                  <img src="/assets/Logo.png" className="h-8 w-auto object-contain" alt="LocalKart" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-black font-heading text-slate-900 leading-tight">LocalKart</p>
                  <span className="text-[10px] text-slate-400 font-semibold block">Merchant & Partner Hub</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMockup(true)}
                  className="bg-emerald-50 hover:bg-emerald-100/70 text-[#0e3e26] border border-emerald-200 text-xs font-bold px-4 py-2 rounded-2xl transition-all shadow-xs flex items-center gap-1.5 font-heading"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>UI Flow Mockup</span>
                </button>
              </div>
            </div>
          </nav>

          {/* Hero & Login Body */}
          <main className="max-w-7xl mx-auto px-6 py-10 md:py-16 flex-1 flex flex-col justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
              
              {/* Left Column: Value Proposition */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#105634] bg-emerald-50 border border-emerald-200/70">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Empowering Neighborhood Commerce
                </span>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.12] tracking-tight font-heading">
                  Your Offline Store, <br />
                  <span className="text-[#105634]">Digitally Connected</span>
                </h1>

                <p className="text-slate-600 text-sm sm:text-base max-w-xl leading-relaxed">
                  LocalKart connects offline neighborhood kirana and grocery stores directly with local customers and delivery runners, orchestrating orders in 40 minutes.
                </p>

                {/* Feature highlight cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-start gap-3.5 bg-white p-5 rounded-3xl border border-slate-200/70 shadow-card hover:border-emerald-200 transition-all">
                    <div className="p-3 bg-emerald-50 text-[#105634] rounded-2xl shrink-0 border border-emerald-100">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 font-heading">For Store Merchants</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Digitize catalog, manage stock live, and receive automated neighborhood orders.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 bg-white p-5 rounded-3xl border border-slate-200/70 shadow-card hover:border-purple-200 transition-all">
                    <div className="p-3 bg-purple-50 text-purple-700 rounded-2xl shrink-0 border border-purple-100">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 font-heading">For Delivery Runners</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Earn on every local order pickup and quick drop-off within a 5km radius.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
                  <span className="flex items-center gap-1.5 font-bold text-slate-700">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Instant Bank Payouts
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5 font-bold text-slate-700">
                    <Store className="w-4 h-4 text-emerald-600" /> 0% Listing Fee
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5 font-bold text-slate-700">
                    <MapPin className="w-4 h-4 text-emerald-600" /> Hyper-Local Reach
                  </span>
                </div>
              </div>

              {/* Right Column: Sign In Card */}
              <div className="lg:col-span-5 flex justify-center">
                <LoginForm
                  onRegisterShopkeeper={() => router.push('/register-shopkeeper')}
                  onRegisterDelivery={() => router.push('/register-delivery')}
                />
              </div>

            </div>
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-200/70 bg-white py-6 px-6 text-center text-xs text-slate-400">
            <p>© {new Date().getFullYear()} e-LocalKart Commerce Technologies. All rights reserved.</p>
          </footer>
        </>
      )}
    </div>
  );
}
