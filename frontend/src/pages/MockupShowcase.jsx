import React, { useState } from 'react';
import logoUrl from '../assets/Logo.png';
import { 
  ShoppingBag, 
  Truck, 
  User, 
  Mail, 
  Lock, 
  FileText, 
  CheckCircle2, 
  Camera, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Sparkles,
  Edit,
  Check,
  Upload
} from 'lucide-react';

// Custom e-LocalKart Logo
export const eLocalKartLogo = ({ className = "w-20 h-auto" }) => (
  <div className="flex flex-col items-center justify-center select-none">
    <img src={logoUrl} className={className} alt="e-LocalKart Logo" />
  </div>
);

// Phone Frame Shell
const PhoneFrame = ({ children, title }) => (
  <div className="flex flex-col items-center">
    {title && (
      <div className="mb-3 text-center">
        <span className="text-xs font-bold text-emerald-855 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-255">
          {title}
        </span>
      </div>
    )}
    <div className="w-[365px] h-[785px] bg-slate-900 rounded-[50px] p-3.5 shadow-2xl relative border-4 border-slate-800 flex flex-col shrink-0">
      {/* Ear Speaker & Camera Notch */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-36 h-6 bg-slate-900 rounded-full z-30 flex items-center justify-between px-6">
        <div className="w-3 h-3 bg-slate-800 rounded-full"></div>
        <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
        <div className="w-3 h-3 bg-slate-800 rounded-full"></div>
      </div>
      
      {/* Screen Container */}
      <div className="w-full h-full bg-slate-50 rounded-[38px] overflow-hidden flex flex-col relative border border-slate-700/10">
        {/* Status Bar */}
        <div className="h-8 bg-white border-b border-slate-100 flex items-center justify-between px-6 pt-1 text-[10px] font-semibold text-slate-500 z-20">
          <span>9:41 AM</span>
          <div className="flex items-center gap-1.5">
            <span>5G</span>
            <div className="w-4 h-2.5 bg-slate-400 rounded-sm"></div>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto scrollbar-none flex flex-col pb-8">
          {children}
        </div>
        
        {/* Home Indicator */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-350 rounded-full z-20"></div>
      </div>
    </div>
  </div>
);

export const MockupShowcase = ({ onClose }) => {
  // Shared States for Live Interactivity
  const [fullName, setFullName] = useState('Rajesh Kumar');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [email, setEmail] = useState('rajesh.kirana@example.com');
  const [password, setPassword] = useState('••••••••••');
  const [shopName, setShopName] = useState('Rajesh Kirana & General Store');
  const [aadhaar, setAadhaar] = useState('5432 9876 1234');
  const [aadhaarFile, setAadhaarFile] = useState('mock-aadhaar.png');
  
  const [pan, setPan] = useState('ABCDE1234F');
  const [panFile, setPanFile] = useState('mock-pan.png');
  
  const [udyam, setUdyam] = useState('UDYAM-MH-12-0004567');
  const [udyamFile, setUdyamFile] = useState('mock-udyam.png');
  
  const [gst, setGst] = useState('27ABCDE1234F1Z5');
  const [gstFile, setGstFile] = useState('mock-gst.png');
  
  const [fssai, setFssai] = useState('12345678901234');
  const [fssaiFile, setFssaiFile] = useState('mock-fssai.png');
  
  const [storePhoto, setStorePhoto] = useState('https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&auto=format&fit=crop&q=80');

  // Trigger signup success banner
  const [showRegSuccess, setShowRegSuccess] = useState(false);

  const handleStorePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStorePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKycUpload = (e, docType) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (docType === 'aadhaar') setAadhaarFile(reader.result);
        if (docType === 'pan') setPanFile(reader.result);
        if (docType === 'udyam') setUdyamFile(reader.result);
        if (docType === 'gst') setGstFile(reader.result);
        if (docType === 'fssai') setFssaiFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-body">
      {/* Top Header Controls */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-emerald-600 text-white rounded-xl shadow-md">
            <ShoppingBag className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white font-heading">
              Local<span className="text-emerald-500">Kart</span> Mockup Showroom
            </h1>
            <p className="text-xs text-slate-400">Interactive live prototype with multi-document upload support</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-slate-800/80 border border-slate-700/50 px-3 py-1.5 rounded-lg text-xs">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-slate-300">Live Data Sync Active</span>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-lg shadow-emerald-900/20"
            >
              Exit Mockup Showroom
            </button>
          )}
        </div>
      </header>

      {/* Main Interactive Workspace */}
      <main className="flex-1 overflow-x-auto overflow-y-auto px-8 py-10 flex flex-col items-center">
        {/* Helper guide */}
        <div className="max-w-4xl text-center mb-8 space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400 bg-emerald-950 border border-emerald-800">
            <Sparkles className="w-3.5 h-3.5" /> 3-Screen UI/UX Flow
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white font-heading">
            Store Onboarding Journey
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            Try uploading document files next to each KYC field in <strong className="text-emerald-400">Screen 2</strong>. They will instantly show as verified and viewable in <strong className="text-emerald-400">Screen 3 (Shop Profile)</strong>.
          </p>
        </div>

        {/* 3 Connected Phones composition */}
        <div className="flex flex-row gap-8 items-start justify-center pb-12 w-fit">
          
          {/* SCREEN 1: Login Screen */}
          <div className="relative group">
            <PhoneFrame title="Screen 1: Login Screen">
              <div className="flex-1 flex flex-col justify-between p-5 pt-8 bg-white text-slate-800">
                {/* Logo & Heading */}
                <div className="text-center space-y-3.5">
                  {eLocalKartLogo({ className: "w-20 h-auto mx-auto" })}
                  <h3 className="text-lg font-black text-slate-800 leading-tight font-heading">
                    Welcome to LocalKart
                  </h3>
                </div>

                {/* Login Inputs Widget */}
                <div className="my-4 space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 shadow-sm">
                  {/* Input Fields */}
                  <div className="space-y-2 text-left">
                    <div>
                      <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-2.5 top-2.5 w-3 h-3 text-slate-400" />
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full bg-white border border-slate-200 focus:border-emerald-500 rounded-lg pl-8 pr-2.5 py-2 text-[10px] text-slate-800 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-2.5 top-2.5 w-3 h-3 text-slate-400" />
                        <input 
                          type="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-white border border-slate-200 focus:border-emerald-500 rounded-lg pl-8 pr-2.5 py-2 text-[10px] text-slate-800 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    type="button" 
                    className="w-full bg-[#10b981] hover:bg-emerald-600 text-white font-bold py-2 rounded-xl text-[10px] transition-colors shadow-sm"
                  >
                    Log in as Shopkeeper
                  </button>
                </div>

                {/* Don't have an account? Section */}
                <div className="border-t border-slate-150 pt-4 text-center space-y-2">
                  <p className="text-[10px] font-extrabold text-slate-450">Don't have an account?</p>
                  <div className="space-y-1.5">
                    <button 
                      onClick={() => {
                        document.getElementById('screen-2-container')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full bg-[#10b981] hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-xl text-[10px] transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span>📱</span> Register as Shopkeeper
                    </button>
                    <button 
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-xl text-[10px] transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span>🛵</span> Become Delivery Partner
                    </button>
                  </div>
                </div>

              </div>
            </PhoneFrame>
            {/* Dotted Flow Connector */}
            <div className="hidden xl:flex absolute top-[40%] -right-6 items-center z-10 pointer-events-none">
              <div className="border-t-2 border-dashed border-emerald-500/60 w-5"></div>
              <ChevronRight className="w-4 h-4 text-emerald-500/60 -ml-1" />
            </div>
          </div>

          {/* SCREEN 2: Shopkeeper Signup Form */}
          <div id="screen-2-container" className="relative">
            <PhoneFrame title="Screen 2: Store Onboarding Form">
              <div className="flex-1 flex flex-col p-5 space-y-4">
                <div>
                  <h3 className="text-sm font-black text-slate-800 font-heading">Register Your Store on LocalKart</h3>
                  <p className="text-slate-400 text-[10px]">Provide store metadata & upload validation documents</p>
                </div>

                {/* Registration Fields Container */}
                <div className="space-y-3.5 max-h-[560px] overflow-y-auto pr-1">
                  
                  {/* Signup inputs list */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200/60 shadow-sm space-y-3.5 text-left">
                    <span className="text-[9px] font-bold text-slate-400 tracking-wider block uppercase">KYC & Contact Details</span>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[8px] font-bold text-slate-500 uppercase mb-0.5">Full Name</label>
                        <input 
                          type="text" 
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full text-[10px] bg-slate-50 border border-slate-200/80 focus:border-emerald-500 focus:bg-white rounded-lg px-2.5 py-1.5 text-slate-800 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-[8px] font-bold text-slate-500 uppercase mb-0.5">Phone Number</label>
                        <input 
                          type="text" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full text-[10px] bg-slate-50 border border-slate-200/80 focus:border-emerald-500 focus:bg-white rounded-lg px-2.5 py-1.5 text-slate-800 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-[8px] font-bold text-slate-500 uppercase mb-0.5">Email Address</label>
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full text-[10px] bg-slate-50 border border-slate-200/80 focus:border-emerald-500 focus:bg-white rounded-lg px-2.5 py-1.5 text-slate-800 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-[8px] font-bold text-slate-500 uppercase mb-0.5">Password</label>
                        <input 
                          type="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full text-[10px] bg-slate-50 border border-slate-200/80 focus:border-emerald-500 focus:bg-white rounded-lg px-2.5 py-1.5 text-slate-800 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-[8px] font-bold text-slate-500 uppercase mb-0.5">Shop Name</label>
                        <input 
                          type="text" 
                          value={shopName}
                          onChange={(e) => setShopName(e.target.value)}
                          className="w-full text-[10px] bg-slate-50 border border-slate-200/80 focus:border-emerald-500 focus:bg-white rounded-lg px-2.5 py-1.5 text-slate-800 outline-none transition-all"
                        />
                      </div>

                      {/* Aadhaar + Upload */}
                      <div>
                        <label className="block text-[8px] font-bold text-slate-500 uppercase mb-0.5">Aadhaar Number & Image</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={aadhaar}
                            onChange={(e) => setAadhaar(e.target.value)}
                            className="flex-1 text-[10px] bg-slate-50 border border-slate-200/80 focus:border-emerald-500 focus:bg-white rounded-lg px-2.5 py-1.5 text-slate-800 outline-none transition-all"
                          />
                          <label className={`cursor-pointer border rounded-lg px-2.5 py-1.5 flex items-center justify-center gap-1 text-[9px] font-bold transition-all shrink-0 ${aadhaarFile ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'}`}>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleKycUpload(e, 'aadhaar')} />
                            {aadhaarFile ? <Check className="w-3 h-3" /> : <Upload className="w-3 h-3" />}
                            {aadhaarFile ? 'Uploaded' : 'Upload'}
                          </label>
                        </div>
                      </div>

                      {/* PAN + Upload */}
                      <div>
                        <label className="block text-[8px] font-bold text-slate-500 uppercase mb-0.5">PAN Card Number & Image</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={pan}
                            onChange={(e) => setPan(e.target.value)}
                            className="flex-1 text-[10px] bg-slate-50 border border-slate-200/80 focus:border-emerald-500 focus:bg-white rounded-lg px-2.5 py-1.5 text-slate-800 outline-none transition-all"
                          />
                          <label className={`cursor-pointer border rounded-lg px-2.5 py-1.5 flex items-center justify-center gap-1 text-[9px] font-bold transition-all shrink-0 ${panFile ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'}`}>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleKycUpload(e, 'pan')} />
                            {panFile ? <Check className="w-3 h-3" /> : <Upload className="w-3 h-3" />}
                            {panFile ? 'Uploaded' : 'Upload'}
                          </label>
                        </div>
                      </div>

                      {/* Udyam + Upload */}
                      <div>
                        <label className="block text-[8px] font-bold text-slate-500 uppercase mb-0.5">Udyam Registration & Image</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={udyam}
                            onChange={(e) => setUdyam(e.target.value)}
                            className="flex-1 text-[10px] bg-slate-50 border border-slate-200/80 focus:border-emerald-500 focus:bg-white rounded-lg px-2.5 py-1.5 text-slate-800 outline-none transition-all"
                          />
                          <label className={`cursor-pointer border rounded-lg px-2.5 py-1.5 flex items-center justify-center gap-1 text-[9px] font-bold transition-all shrink-0 ${udyamFile ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'}`}>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleKycUpload(e, 'udyam')} />
                            {udyamFile ? <Check className="w-3 h-3" /> : <Upload className="w-3 h-3" />}
                            {udyamFile ? 'Uploaded' : 'Upload'}
                          </label>
                        </div>
                      </div>

                      {/* GST + Upload */}
                      <div>
                        <label className="block text-[8px] font-bold text-slate-500 uppercase mb-0.5">GST Number & Certificate</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={gst}
                            onChange={(e) => setGst(e.target.value)}
                            className="flex-1 text-[10px] bg-slate-50 border border-slate-200/80 focus:border-emerald-500 focus:bg-white rounded-lg px-2.5 py-1.5 text-slate-800 outline-none transition-all"
                          />
                          <label className={`cursor-pointer border rounded-lg px-2.5 py-1.5 flex items-center justify-center gap-1 text-[9px] font-bold transition-all shrink-0 ${gstFile ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'}`}>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleKycUpload(e, 'gst')} />
                            {gstFile ? <Check className="w-3 h-3" /> : <Upload className="w-3 h-3" />}
                            {gstFile ? 'Uploaded' : 'Upload'}
                          </label>
                        </div>
                      </div>

                      {/* FSSAI + Upload */}
                      <div>
                        <div className="flex justify-between items-center mb-0.5">
                          <label className="block text-[8px] font-bold text-slate-500 uppercase">FSSAI Number & Doc</label>
                          <span className="text-[8px] text-slate-400 font-bold bg-slate-100 px-1.5 py-0.2 rounded">Optional</span>
                        </div>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={fssai}
                            onChange={(e) => setFssai(e.target.value)}
                            className="flex-1 text-[10px] bg-slate-50 border border-slate-200/80 focus:border-emerald-500 focus:bg-white rounded-lg px-2.5 py-1.5 text-slate-800 outline-none transition-all"
                          />
                          <label className={`cursor-pointer border rounded-lg px-2.5 py-1.5 flex items-center justify-center gap-1 text-[9px] font-bold transition-all shrink-0 ${fssaiFile ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'}`}>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleKycUpload(e, 'fssai')} />
                            {fssaiFile ? <Check className="w-3 h-3" /> : <Upload className="w-3 h-3" />}
                            {fssaiFile ? 'Uploaded' : 'Upload'}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Store image upload section */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200/60 shadow-sm space-y-3 text-left">
                    <span className="text-[9px] font-bold text-slate-400 tracking-wider block uppercase">Upload Store Photo</span>
                    <div className="border-2 border-dashed border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/10 rounded-2xl p-4 transition-all flex flex-col items-center justify-center text-center cursor-pointer relative overflow-hidden group">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleStorePhotoUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      {storePhoto ? (
                        <div className="w-full">
                          <img src={storePhoto} alt="Store Preview" className="h-28 w-full object-cover rounded-xl mb-1.5" />
                          <p className="text-[8px] text-emerald-600 font-bold flex items-center justify-center gap-1">
                            <Check className="w-3 h-3" /> Photo Selected. Tap to change.
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-full mb-2 group-hover:scale-110 transition-transform">
                            <Camera className="w-5 h-5" />
                          </div>
                          <p className="text-xs font-bold text-slate-700">Upload Store Image</p>
                          <p className="text-[8px] text-slate-400 mt-0.5">Click or drag image file here</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Registration Action Button */}
                <button 
                  onClick={() => {
                    setShowRegSuccess(true);
                    setTimeout(() => {
                      setShowRegSuccess(false);
                      document.getElementById('screen-3-container')?.scrollIntoView({ behavior: 'smooth' });
                    }, 1800);
                  }}
                  className="w-full bg-[#10b981] hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-md shrink-0 flex items-center justify-center gap-2"
                >
                  Complete Registration
                </button>

                {/* Registration Toast feedback */}
                {showRegSuccess && (
                  <div className="absolute inset-x-4 top-12 bg-slate-900/95 text-white p-3 rounded-2xl shadow-xl flex items-center gap-2 border border-emerald-500/30 animate-bounce z-40">
                    <span className="p-1.5 bg-emerald-500 text-white rounded-full">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <div className="text-left">
                      <p className="text-xs font-bold">Registration Completed!</p>
                      <p className="text-[8px] text-slate-400">Verifying documents. Moving to profile...</p>
                    </div>
                  </div>
                )}
              </div>
            </PhoneFrame>
            {/* Dotted Flow Connector */}
            <div className="hidden xl:flex absolute top-[40%] -right-6 items-center z-10 pointer-events-none">
              <div className="border-t-2 border-dashed border-emerald-500/60 w-5"></div>
              <ChevronRight className="w-4 h-4 text-emerald-500/60 -ml-1" />
            </div>
          </div>

          {/* SCREEN 3: Shop Profile View */}
          <div id="screen-3-container" className="relative">
            <PhoneFrame title="Screen 3: Shop Profile">
              <div className="flex-1 flex flex-col bg-slate-50 text-slate-800">
                {/* Store Header Image */}
                <div className="h-40 bg-slate-200 relative shrink-0">
                  <img src={storePhoto} alt="Shop Front" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                  
                  {/* Floating Profile Details Badge */}
                  <div className="absolute bottom-3 left-4 flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#10b981] text-white flex items-center justify-center font-black text-sm shadow-md border border-white/20">
                      {shopName.charAt(0)}
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-extrabold text-white truncate max-w-[200px]">{shopName}</h4>
                      <p className="text-[9px] text-emerald-300 font-semibold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> KYC Verified Partner
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details sections */}
                <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[500px]">
                  
                  {/* Shop Details Card */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-200/60 shadow-sm space-y-2.5 text-left">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <span className="text-[8px] font-bold text-slate-400 tracking-wider uppercase">Store Details & Contact</span>
                      <button className="text-[8px] text-emerald-600 font-bold flex items-center gap-1 hover:text-emerald-700">
                        <Edit className="w-2.5 h-2.5" /> Edit Profile
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      <div>
                        <p className="text-[8px] text-slate-400 uppercase font-semibold">Store Owner</p>
                        <p className="font-bold text-slate-850 mt-0.5">{fullName}</p>
                      </div>
                      <div>
                        <p className="text-[8px] text-slate-400 uppercase font-semibold">Phone Number</p>
                        <p className="font-bold text-slate-850 mt-0.5">{phone}</p>
                      </div>
                      <div>
                        <p className="text-[8px] text-slate-400 uppercase font-semibold">Email Address</p>
                        <p className="font-bold text-slate-850 mt-0.5 truncate">{email}</p>
                      </div>
                    </div>
                  </div>

                  {/* KYC Status Checklist */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-200/60 shadow-sm space-y-2.5 text-left">
                    <span className="text-[8px] font-bold text-slate-400 tracking-wider uppercase block border-b border-slate-100 pb-2">
                      KYC Documents Verification
                    </span>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-slate-700 font-medium">Aadhaar Card</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-mono text-slate-400">{aadhaar}</span>
                          {aadhaarFile && <span className="text-[8px] text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded font-bold">PDF Image</span>}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-slate-700 font-medium">PAN Card</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-mono text-slate-400">{pan}</span>
                          {panFile && <span className="text-[8px] text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded font-bold">Copy</span>}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-slate-700 font-medium">Udyam Number</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-mono text-slate-400">{udyam}</span>
                          {udyamFile && <span className="text-[8px] text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded font-bold">Doc</span>}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-slate-700 font-medium">GST Number</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-mono text-slate-400">{gst}</span>
                          {gstFile && <span className="text-[8px] text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded font-bold">Cert</span>}
                        </div>
                      </div>

                      {fssai && (
                        <div className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-slate-700 font-medium">FSSAI License</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-mono text-slate-400">{fssai}</span>
                            {fssaiFile && <span className="text-[8px] text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded font-bold">Copy</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Operating Location & Hours */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-200/60 shadow-sm space-y-2 text-left">
                    <span className="text-[8px] font-bold text-slate-400 tracking-wider uppercase block border-b border-slate-100 pb-1.5">
                      Operational Area & Timings
                    </span>
                    
                    <div className="space-y-2 text-[11px] leading-snug">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-455 shrink-0" />
                        <span className="text-slate-650">Shop No. 4, Green Glen Layout, Outer Ring Road, Bangalore</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-455 shrink-0" />
                        <span className="text-slate-650">Daily: 9:00 AM - 10:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </PhoneFrame>
          </div>

        </div>
      </main>
    </div>
  );
};
