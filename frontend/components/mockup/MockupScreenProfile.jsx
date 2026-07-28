"use client";

import React from 'react';
import { Building, MapPin, FileText, CheckCircle2, Camera } from 'lucide-react';
import { MockupPhoneFrame } from './MockupPhoneFrame';

export const MockupScreenProfile = ({
  shopName,
  fullName,
  phone,
  email,
  storePhoto,
  handleStorePhotoUpload,
  aadhaarFile,
  panFile
}) => {
  return (
    <MockupPhoneFrame title="Screen 3: Verified Shop Profile">
      <div className="flex-1 flex flex-col p-4 bg-slate-50 text-slate-800 space-y-3">
        {/* Banner / Store Header */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white p-4 text-left">
          <img src={storePhoto} className="absolute inset-0 w-full h-full object-cover opacity-30" alt="Store Cover" />
          <div className="relative z-10 space-y-1">
            <span className="bg-emerald-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full inline-block">VERIFIED SELLER</span>
            <h4 className="text-xs font-black truncate">{shopName || 'Rajesh Kirana Store'}</h4>
            <p className="text-[9px] text-slate-300 flex items-center gap-1"><MapPin className="w-2.5 h-2.5" /> Sector 4 Market, Noida</p>
          </div>
          <label className="absolute bottom-2 right-2 bg-white/80 text-slate-900 p-1.5 rounded-full cursor-pointer hover:bg-white z-20">
            <Camera className="w-3 h-3" />
            <input type="file" accept="image/*" className="hidden" onChange={handleStorePhotoUpload} />
          </label>
        </div>

        {/* Profile Info Card */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200/60 text-left space-y-2 text-[10px]">
          <h5 className="font-bold text-slate-700 uppercase tracking-wide border-b pb-1 text-[9px]">Merchant Contact Info</h5>
          <div className="space-y-1 text-slate-600">
            <p><span className="text-slate-400">Owner:</span> <strong>{fullName}</strong></p>
            <p><span className="text-slate-400">Phone:</span> <strong>{phone}</strong></p>
            <p><span className="text-slate-400">Email:</span> <strong>{email}</strong></p>
          </div>
        </div>

        {/* Verified Credentials */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200/60 text-left space-y-2 text-[10px]">
          <h5 className="font-bold text-slate-700 uppercase tracking-wide border-b pb-1 text-[9px]">KYC Credentials</h5>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between p-1.5 bg-emerald-50/50 rounded-lg">
              <span className="flex items-center gap-1 font-semibold text-emerald-800"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> Aadhaar Verified</span>
              <FileText className="w-3 h-3 text-emerald-600" />
            </div>
            <div className="flex items-center justify-between p-1.5 bg-emerald-50/50 rounded-lg">
              <span className="flex items-center gap-1 font-semibold text-emerald-800"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> PAN Card Verified</span>
              <FileText className="w-3 h-3 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>
    </MockupPhoneFrame>
  );
};
