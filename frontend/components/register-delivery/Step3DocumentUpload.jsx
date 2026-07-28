"use client";

import React, { useRef } from 'react';
import { UploadCloud, PenTool, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { DocumentUploadCard } from '../register-shopkeeper/DocumentUploadCard';

export const Step3DocumentUpload = ({
  documents,
  setDocuments,
  signatureUrl,
  setSignatureUrl
}) => {
  const signatureInputRef = useRef(null);

  const handleDocumentUploaded = (docKey, result) => {
    setDocuments((prev) => ({
      ...prev,
      [docKey]: result.fileUrl || result.fileName || result.name
    }));
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setSignatureUrl(evt.target.result);
    };
    reader.readAsDataURL(file);
  };

  const docTypes = [
    { key: 'drivingLicense', label: 'Driving License (DL)', description: 'Front & Back clear photo copy of valid driving license', optional: false },
    { key: 'vehicleRc', label: 'Vehicle RC (Registration Certificate)', description: 'RTO Vehicle Registration Certificate', optional: false },
    { key: 'bankPassbook', label: 'Bank Passbook / Cancelled Cheque', description: 'Proof of bank account showing Name & IFSC', optional: false },
    { key: 'panCard', label: 'PAN Card Photo', description: 'Clear scan/photo of individual PAN Card', optional: false }
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-black font-heading text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-emerald-500" /> Mandatory Document Upload Checklist
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Upload clear photo/PDF copies of your identity, vehicle licensing, and bank proof (Max 10MB per file: JPG, PNG, PDF).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {docTypes.map((item) => (
            <DocumentUploadCard
              key={item.key}
              doc={item}
              docKey={item.key}
              title={item.label}
              subtitle={item.description}
              required={!item.optional}
              uploadedUrl={documents[item.key]}
              onUploadSuccess={(res) => handleDocumentUploaded(item.key, res)}
            />
          ))}
        </div>

        {/* Digital Signature Picker */}
        <div className="border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 bg-slate-50/50 dark:bg-slate-850 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-xl">
                <PenTool className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 font-heading">Digital Signature Attachment</h4>
                <p className="text-[10px] text-slate-400">Upload signature image or sign digitally for merchant agreement</p>
              </div>
            </div>
            {signatureUrl && (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Signature Attached
              </span>
            )}
          </div>

          {signatureUrl ? (
            <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
              <img src={signatureUrl} alt="Signature Preview" className="h-10 object-contain" />
              <button
                type="button"
                onClick={() => setSignatureUrl(null)}
                className="text-xs text-red-500 font-bold hover:underline"
              >
                Remove
              </button>
            </div>
          ) : (
            <div>
              <input
                type="file"
                ref={signatureInputRef}
                onChange={handleSignatureUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => signatureInputRef.current?.click()}
                className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-emerald-500 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center gap-2 transition-colors bg-white dark:bg-slate-900"
              >
                <ImageIcon className="w-4 h-4 text-emerald-500" /> Click to Select Signature Image
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
