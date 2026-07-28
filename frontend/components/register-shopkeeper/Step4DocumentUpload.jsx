"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, CheckCircle2, X, ShieldCheck } from 'lucide-react';
import { DocumentUploadCard } from './DocumentUploadCard';

export const Step4DocumentUpload = ({
  category = 'Grocery',
  isPrivateLabel = false,
  isImported = false,
  uploadedFiles = {},
  ocrStatus = {},
  handleFileUploadSim,
  handleRemoveFile,
  onSaveDraft
}) => {
  const [toast, setToast] = useState(null);

  const showToast = (title, message, type = 'success') => {
    setToast({ title, message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleLocalSaveDraft = () => {
    localStorage.setItem('merchant_step4_draft', JSON.stringify({ uploadedFilesKeys: Object.keys(uploadedFiles) }));
    if (onSaveDraft) onSaveDraft();
    showToast('Draft Saved!', 'Step 4 document upload progress saved to draft!');
  };

  const getRequiredDocs = () => {
    // 1. General Base KYC Documents (Aadhaar removed per request)
    const docsList = [
      { key: 'pan', label: 'PAN Card', description: 'Business or Individual PAN copy' },
      { key: 'gst', label: 'GSTIN Registration Certificate', description: 'Form GST REG-06 copy (if applicable)', optional: true },
      { key: 'bank_passbook', label: 'Bank Details (Passbook / Cancelled Cheque)', description: 'Upload copy showing Account Number & IFSC' },
      { key: 'digital_signature', label: 'Digital Signature / Specimen Signature', description: 'Upload signed specimen copy or digital signature certificate' },
      { key: 'storefront', label: 'Store Front Photo', description: 'Photo showing shop signage' }
    ];

    // 2. Food / Grocery / Bakery / Dairy / Supplements
    if (category === 'Grocery' || category === 'Bakery & Dairy' || category === 'Supplements' || category === 'Organic & Fresh') {
      docsList.push(
        { key: 'fssai_cert', label: 'FSSAI License Certificate', description: 'Upload valid FSSAI License Document' },
        { key: 'fssai_declaration', label: 'Signed FSSAI Declaration Form', description: 'Self-signed food safety compliance declaration' },
        { key: 'product_label', label: 'Product Label Images', description: 'Clear photo showing FSSAI logo, manufacturing & expiry info' },
        { key: 'nutritional_info', label: 'Nutritional Information Images', description: 'Back-of-pack nutritional values label photo' }
      );
    }

    // 3. Electronics / Appliances / Toys / Mobile Shop
    else if (category === 'Electronics' || category === 'Home Appliances' || category === 'Toys & Baby Care' || category === 'Mobile & Accessories') {
      docsList.push(
        { key: 'bis_cert', label: 'BIS Certificate', description: 'Bureau of Indian Standards compliance certificate' },
        { key: 'crs_reg', label: 'CRS Registration', description: 'Compulsory Registration Scheme registration copy' },
        { key: 'bee_rating', label: 'BEE Star Rating Certificate', description: 'Energy efficiency star rating certificate', optional: true }
      );
    }

    // 4. Cosmetics / Wellness / Pharmacy / Beauty / Ayurveda
    else if (category === 'Pharmacy' || category === 'Cosmetics & Beauty' || category === 'Ayurveda & Herbal') {
      docsList.push(
        { key: 'drug_license', label: 'Drug License Copy', description: 'Form 20 / 21 Pharmacy Registry License' },
        { key: 'mfg_license', label: 'Manufacturing License', description: 'Factory manufacturing license certificate' },
        { key: 'lab_test', label: 'Lab Test Reports', description: 'Third-party safety test & purity report' },
        { key: 'safety_declaration', label: 'Safety Declaration Form', description: 'Dermatological / cosmetic safety declaration' }
      );
    }

    // 5. Books & Handicrafts / Sports / Fashion
    else if (category === 'Books & Stationery' || category === 'Handicrafts & Gifts' || category === 'Sports & Fitness') {
      docsList.push(
        { key: 'passport_id', label: 'Secondary ID Proof / Passport', description: 'Passport or secondary Photo ID copy', optional: true }
      );
    }

    // 6. Special Checklist: Private Label Brand
    if (isPrivateLabel) {
      docsList.push(
        { key: 'trademark_cert', label: 'Trademark Registration Certificate', description: 'Brand trademark registry certificate' },
        { key: 'brand_auth', label: 'Brand Authorization Letter', description: 'Manufacturer / Brand authorization letter' },
        { key: 'brand_registry', label: 'Brand Registry Certificate', description: 'Official brand enrollment document' }
      );
    }

    // 7. Special Checklist: Imported Products
    if (isImported) {
      docsList.push(
        { key: 'iec_cert', label: 'Import Export Code (IEC) Certificate', description: 'DGFT issued IEC registration copy' },
        { key: 'bill_of_entry', label: 'Bill of Entry', description: 'Customs import Bill of Entry copy' },
        { key: 'customs_docs', label: 'Customs Clearance Documents', description: 'Port clearance & duty payment receipts' },
        { key: 'coo_cert', label: 'Country of Origin Certificate', description: 'Official Certificate of Origin' }
      );
    }

    // 8. MSME Optional
    docsList.push(
      { key: 'udyam', label: 'MSME / Udyam Certificate', description: 'Optional small business registration certificate', optional: true }
    );

    return docsList;
  };

  const docs = getRequiredDocs();

  return (
    <div className="space-y-5 relative">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`p-4 text-white rounded-2xl shadow-2xl border flex items-start justify-between gap-3 z-50 mb-2 ${
              toast.type === 'error'
                ? 'bg-red-950 border-red-500/50'
                : 'bg-slate-900 border-emerald-500/30'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${toast.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className={`text-xs font-bold font-heading ${toast.type === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>
                  {toast.title}
                </h4>
                <p className="text-[11px] text-slate-300 font-medium">{toast.message}</p>
              </div>
            </div>
            <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="text-left">
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider font-heading flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Category Document Upload
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Upload clear copies in JPG, PNG, or PDF format (Max 10MB per file).
          </p>
        </div>
        <button
          type="button"
          onClick={handleLocalSaveDraft}
          className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 font-heading shrink-0"
        >
          <Save className="w-3.5 h-3.5" /> Save Draft
        </button>
      </div>

      <div className="space-y-3.5 text-left">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide font-heading">
            Upload Checklist for <span className="text-emerald-600 dark:text-emerald-400 font-black">{category}</span>
          </h4>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
            {isPrivateLabel && <span className="bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 px-2 py-0.5 rounded-md">Private Label Active</span>}
            {isImported && <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-md">Imported Goods Active</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {docs.map((doc) => (
            <DocumentUploadCard
              key={doc.key}
              doc={doc}
              file={uploadedFiles[doc.key]}
              ocr={ocrStatus[doc.key]}
              handleFileUploadSim={handleFileUploadSim}
              handleRemoveFile={handleRemoveFile}
              showToast={showToast}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
