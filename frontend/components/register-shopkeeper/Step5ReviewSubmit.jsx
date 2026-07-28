"use client";

import React from 'react';
import { User, Building, MapPin, FileText, CheckCircle2 } from 'lucide-react';

export const Step5ReviewSubmit = ({
  fullName, phone, regEmail,
  businessName, shopName, category, gst, pan,
  fssaiNumber, shelfLifeDetails, drugLicenseNumber, mfgLicenseNumber, bisCrsNumber, iecCode,
  isPrivateLabel, isImported,
  bankName, ifsc,
  googleMapsLocation,
  uploadedFiles = {}
}) => {
  return (
    <div className="space-y-5 text-left">
      <div>
        <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2 mb-2 font-heading">
          Final Audit & Submission Review
        </h3>
        <p className="text-xs text-slate-400 mb-4 font-medium">
          Please review all entered information before submitting your merchant registration application.
        </p>
      </div>

      <div className="space-y-4">
        {/* Personal Details */}
        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase flex items-center gap-1.5 font-heading">
            <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Personal & Contact Info
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><span className="text-slate-400">Name:</span> <strong className="text-slate-800 dark:text-slate-200 font-semibold">{fullName}</strong></div>
            <div><span className="text-slate-400">Phone:</span> <strong className="text-slate-800 dark:text-slate-200 font-semibold">+91 {phone}</strong></div>
            <div className="col-span-2"><span className="text-slate-400">Email:</span> <strong className="text-slate-800 dark:text-slate-200 font-semibold">{regEmail}</strong></div>
          </div>
        </div>

        {/* Business & Category Payout Info */}
        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase flex items-center gap-1.5 font-heading">
            <Building className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Business & Compliance Info
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><span className="text-slate-400">Legal Entity:</span> <strong className="text-slate-800 dark:text-slate-200 font-semibold">{businessName}</strong></div>
            <div><span className="text-slate-400">Shop Name:</span> <strong className="text-slate-800 dark:text-slate-200 font-semibold">{shopName}</strong></div>
            <div><span className="text-slate-400">Category:</span> <strong className="text-slate-800 dark:text-slate-200 font-semibold">{category}</strong></div>
            <div><span className="text-slate-400">GSTIN:</span> <strong className="text-slate-800 dark:text-slate-200 font-semibold">{gst || 'N/A'}</strong></div>
            <div><span className="text-slate-400">PAN:</span> <strong className="text-slate-800 dark:text-slate-200 font-semibold">{pan}</strong></div>
            {fssaiNumber && <div><span className="text-slate-400">FSSAI No:</span> <strong className="text-slate-800 dark:text-slate-200 font-semibold font-mono">{fssaiNumber}</strong></div>}
            {shelfLifeDetails && <div className="col-span-2"><span className="text-slate-400">Shelf-Life Details:</span> <strong className="text-slate-800 dark:text-slate-200 font-semibold">{shelfLifeDetails}</strong></div>}
            {drugLicenseNumber && <div><span className="text-slate-400">Drug Lic No:</span> <strong className="text-slate-800 dark:text-slate-200 font-semibold font-mono">{drugLicenseNumber}</strong></div>}
            {mfgLicenseNumber && <div><span className="text-slate-400">Mfg Lic No:</span> <strong className="text-slate-800 dark:text-slate-200 font-semibold font-mono">{mfgLicenseNumber}</strong></div>}
            {bisCrsNumber && <div><span className="text-slate-400">BIS/CRS Reg:</span> <strong className="text-slate-800 dark:text-slate-200 font-semibold font-mono">{bisCrsNumber}</strong></div>}
            {iecCode && <div><span className="text-slate-400">IEC Code:</span> <strong className="text-slate-800 dark:text-slate-200 font-semibold font-mono">{iecCode}</strong></div>}
            <div className="col-span-2"><span className="text-slate-400 font-medium">Bank Details:</span> <strong className="text-slate-800 dark:text-slate-200 font-semibold">{bankName} ({ifsc})</strong></div>
          </div>
        </div>

        {/* Store Location */}
        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase flex items-center gap-1.5 font-heading">
            <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Shop / Godown Address
          </h4>
          <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">{googleMapsLocation || 'Address details set via map pin'}</p>
        </div>

        {/* Uploaded Documents */}
        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase flex items-center gap-1.5 font-heading">
            <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Uploaded Credentials
          </h4>
          <div className="flex flex-wrap gap-2 text-[11px]">
            {Object.keys(uploadedFiles).length > 0 ? (
              Object.keys(uploadedFiles).map((k) => (
                <span key={k} className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> {k.toUpperCase()}: {uploadedFiles[k].name}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 font-medium">No documents uploaded yet</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
