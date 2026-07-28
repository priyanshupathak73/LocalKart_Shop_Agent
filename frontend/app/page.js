"use client";

import React, { useState, useEffect } from 'react';
import { useAppRouter } from '../hooks/useAppRouter';
import { useAuthStore } from '../store/useAuthStore';
import { LoginForm } from '../components/auth/LoginForm';

import { MockupHeader } from '../components/mockup/MockupHeader';
import { MockupScreenLogin } from '../components/mockup/MockupScreenLogin';
import { MockupScreenRegistration } from '../components/mockup/MockupScreenRegistration';
import { MockupScreenProfile } from '../components/mockup/MockupScreenProfile';

import { Sparkles, MapPin, ShoppingBag, Truck } from 'lucide-react';

export default function Home() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useAppRouter();
  
  const [showMockup, setShowMockup] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'delivery-register'
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

  if (!mounted) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400">Loading...</div>;
  if (isAuthenticated) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400">Redirecting to portal...</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-body flex flex-col justify-between">
      {showMockup ? (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-body">
          <MockupHeader onClose={() => setShowMockup(false)} />
          <main className="flex-1 overflow-x-auto overflow-y-auto px-8 py-10 flex flex-col items-center">
            <div className="max-w-4xl text-center mb-8 space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400 bg-emerald-950 border border-emerald-800">
                <Sparkles className="w-3.5 h-3.5" /> 3-Screen UI/UX Flow
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white font-heading">Store Onboarding Journey</h2>
              <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                Upload files in <strong className="text-emerald-400">Screen 2</strong> to preview in <strong className="text-emerald-400">Screen 3</strong>.
              </p>
            </div>

            <div className="flex flex-row gap-8 items-start justify-center pb-12 w-fit">
              <MockupScreenLogin email={email} setEmail={setEmail} password={password} setPassword={setPassword} />
              <MockupScreenRegistration fullName={fullName} setFullName={setFullName} phone={phone} setPhone={setPhone} shopName={shopName} setShopName={setShopName} aadhaar={aadhaar} setAadhaar={setAadhaar} aadhaarFile={aadhaarFile} pan={pan} setPan={setPan} panFile={panFile} handleKycUpload={(e, docType) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    if (docType === 'aadhaar') setAadhaarFile(reader.result);
                    if (docType === 'pan') setPanFile(reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              }} />
              <MockupScreenProfile shopName={shopName} fullName={fullName} phone={phone} email={email} storePhoto={storePhoto} handleStorePhotoUpload={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => setStorePhoto(reader.result);
                  reader.readAsDataURL(file);
                }
              }} aadhaarFile={aadhaarFile} panFile={panFile} />
            </div>
          </main>
        </div>
      ) : (
        <>
          <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200/60 px-6 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/assets/Logo.png" className="h-11 w-auto" alt="e-LocalKart Logo" />
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMockup(true)}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5 font-heading"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Interactive UI Mockups
                </button>
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto px-6 py-8 md:py-12 flex-1 flex flex-col justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
              <div className="lg:col-span-7 space-y-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
                  <MapPin className="w-3.5 h-3.5" /> Empowering Neighborhood Commerce
                </span>
                <h1 className="text-4xl sm:text-5xl font-black text-slate-800 leading-[1.15] tracking-tight font-heading">
                  Your Offline Store <br />
                  <span className="text-[#10B981]">Digitally Orchestrated</span>
                </h1>
                <p className="text-slate-500 text-sm max-w-xl font-body">
                  LocalKart connects offline shopkeepers directly with neighborhood delivery partners and buyers, streamlining logistics and saving time.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200/50 shadow-sm">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><ShoppingBag className="w-5 h-5" /></div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 font-heading">For Shopkeepers</h3>
                      <p className="text-xs text-slate-400 mt-1">Digitize inventory, manage stock, and request instant deliveries.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200/50 shadow-sm">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Truck className="w-5 h-5" /></div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 font-heading">For Delivery Partners</h3>
                      <p className="text-xs text-slate-400 mt-1">Earn on every local order pickup and drop-off nearby.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center">
                <LoginForm
                  onRegisterShopkeeper={() => router.push('/register-shopkeeper')}
                  onRegisterDelivery={() => router.push('/register-delivery')}
                />
              </div>
            </div>
          </main>
        </>
      )}
    </div>
  );
}
