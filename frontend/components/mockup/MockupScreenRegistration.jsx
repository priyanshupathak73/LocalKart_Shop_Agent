"use client";

import React from 'react';
import { User, Building, FileText, Upload, Check } from 'lucide-react';
import { MockupPhoneFrame } from './MockupPhoneFrame';

export const MockupScreenRegistration = ({
  fullName, setFullName,
  phone, setPhone,
  shopName, setShopName,
  aadhaar, setAadhaar, aadhaarFile,
  pan, setPan, panFile,
  handleKycUpload
}) => {
  return (
    <MockupPhoneFrame title="Screen 2: Store Registration & KYC">
      <div className="flex-1 flex flex-col p-4 bg-white text-slate-800 space-y-3.5">
        <div className="text-left border-b border-slate-100 pb-2">
          <h3 className="text-sm font-black text-slate-800 font-heading">Seller Registration</h3>
          <p className="text-[9px] text-slate-400">Step 2 of 3: KYC Credential Verification</p>
        </div>

        {/* Inputs */}
        <div className="space-y-2 text-left">
          <div>
            <label className="block text-[8px] font-bold text-slate-500 uppercase">Full Name</label>
            <div className="relative">
              <User className="absolute left-2.5 top-2.5 w-3 h-3 text-slate-400" />
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-2 py-1.5 text-[10px]" />
            </div>
          </div>

          <div>
            <label className="block text-[8px] font-bold text-slate-500 uppercase">Shop Name</label>
            <div className="relative">
              <Building className="absolute left-2.5 top-2.5 w-3 h-3 text-slate-400" />
              <input type="text" value={shopName} onChange={(e) => setShopName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-2 py-1.5 text-[10px]" />
            </div>
          </div>
        </div>

        {/* Upload Checklist */}
        <div className="space-y-2 text-left pt-1">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Required Documents</span>

          {/* Aadhaar */}
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-700">Aadhaar Card</span>
              {aadhaarFile && <span className="text-[8px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5"><Check className="w-2 h-2" /> Verified</span>}
            </div>
            <div className="flex gap-2 items-center">
              <input type="text" value={aadhaar} onChange={(e) => setAadhaar(e.target.value)} className="flex-1 bg-white border border-slate-200 rounded px-2 py-1 text-[9px]" />
              <label className="bg-emerald-600 text-white p-1.5 rounded text-[9px] cursor-pointer flex items-center gap-1 font-bold">
                <Upload className="w-2.5 h-2.5" />
                <input type="file" className="hidden" onChange={(e) => handleKycUpload(e, 'aadhaar')} />
              </label>
            </div>
          </div>

          {/* PAN */}
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-700">PAN Card</span>
              {panFile && <span className="text-[8px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5"><Check className="w-2 h-2" /> Verified</span>}
            </div>
            <div className="flex gap-2 items-center">
              <input type="text" value={pan} onChange={(e) => setPan(e.target.value)} className="flex-1 bg-white border border-slate-200 rounded px-2 py-1 text-[9px]" />
              <label className="bg-emerald-600 text-white p-1.5 rounded text-[9px] cursor-pointer flex items-center gap-1 font-bold">
                <Upload className="w-2.5 h-2.5" />
                <input type="file" className="hidden" onChange={(e) => handleKycUpload(e, 'pan')} />
              </label>
            </div>
          </div>
        </div>
      </div>
    </MockupPhoneFrame>
  );
};
