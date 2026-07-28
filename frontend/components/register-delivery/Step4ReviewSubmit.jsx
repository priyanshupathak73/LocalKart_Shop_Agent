"use client";

import React from 'react';
import { User, Bike, Landmark, FileCheck, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const Step4ReviewSubmit = ({
  formData,
  onEditStep
}) => {
  const {
    fullName, phone, email,
    vehicleType, vehicleNo, drivingLicenseNo,
    bankName, accountNo, ifscCode
  } = formData;

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-black font-heading text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" /> Review Application Details & Final Submit
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Please verify your personal, vehicle, bank, and document attachments before final submission.
          </p>
        </div>

        <div className="space-y-4">
          {/* Personal Info Summary */}
          <div className="p-4 bg-slate-50/70 dark:bg-slate-850 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 font-heading">
                <User className="w-4 h-4 text-emerald-500" /> Personal Identity & Contacts
              </span>
              <button
                type="button"
                onClick={() => onEditStep(1)}
                className="text-[11px] font-bold text-emerald-600 hover:underline"
              >
                Edit
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <p><span className="text-slate-400">Full Name:</span> <strong className="text-slate-800 dark:text-slate-200">{fullName}</strong></p>
              <p><span className="text-slate-400">Phone:</span> <strong className="text-slate-800 dark:text-slate-200 font-mono">{phone} (Verified)</strong></p>
              <p><span className="text-slate-400">Email:</span> <strong className="text-slate-800 dark:text-slate-200 font-mono">{email} (Verified)</strong></p>
            </div>
          </div>

          {/* Vehicle Info Summary */}
          <div className="p-4 bg-slate-50/70 dark:bg-slate-850 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 font-heading">
                <Bike className="w-4 h-4 text-emerald-500" /> Vehicle & Driving Licensing
              </span>
              <button
                type="button"
                onClick={() => onEditStep(2)}
                className="text-[11px] font-bold text-emerald-600 hover:underline"
              >
                Edit
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <p><span className="text-slate-400">Vehicle Type:</span> <strong className="text-slate-800 dark:text-slate-200">{vehicleType}</strong></p>
              <p><span className="text-slate-400">Registration Plate:</span> <strong className="text-slate-800 dark:text-slate-200 font-mono">{vehicleNo || 'N/A'}</strong></p>
              <p><span className="text-slate-400">Driving License:</span> <strong className="text-slate-800 dark:text-slate-200 font-mono">{drivingLicenseNo || 'N/A'}</strong></p>
            </div>
          </div>

          {/* Bank Details Summary */}
          <div className="p-4 bg-slate-50/70 dark:bg-slate-850 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 font-heading">
                <Landmark className="w-4 h-4 text-emerald-500" /> Bank Payout Destination
              </span>
              <button
                type="button"
                onClick={() => onEditStep(2)}
                className="text-[11px] font-bold text-emerald-600 hover:underline"
              >
                Edit
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <p><span className="text-slate-400">Bank Name:</span> <strong className="text-slate-800 dark:text-slate-200">{bankName}</strong></p>
              <p><span className="text-slate-400">Account No:</span> <strong className="text-slate-800 dark:text-slate-200 font-mono">••••••••{accountNo ? accountNo.slice(-4) : ''}</strong></p>
              <p><span className="text-slate-400">IFSC Code:</span> <strong className="text-slate-800 dark:text-slate-200 font-mono">{ifscCode}</strong></p>
            </div>
          </div>

          {/* Uploaded Documents Checklist */}
          <div className="p-4 bg-slate-50/70 dark:bg-slate-850 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 font-heading">
                <FileCheck className="w-4 h-4 text-emerald-500" /> Uploaded Document Verification Status
              </span>
              <button
                type="button"
                onClick={() => onEditStep(3)}
                className="text-[11px] font-bold text-emerald-600 hover:underline"
              >
                Edit
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
              <span className="text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Driving License</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Vehicle RC</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Bank Passbook</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> PAN Card</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
