"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Store, Tag, FileText, CreditCard, Landmark, Search, Check, ChevronDown, Save, X, CheckCircle2, ShieldCheck } from 'lucide-react';
import { FormInput } from '../common/FormInput';

const CATEGORIES = [
  "Grocery", "Fruits & Vegetables", "Dairy", "Bakery", "Pharmacy",
  "Electronics", "Mobile Shop", "Fashion", "Beauty", "Stationery",
  "Restaurant", "Hardware", "Furniture", "Home Decor", "Toys",
  "Sports", "Books", "Jewellery", "Pet Store", "Automobile", "Others"
];

export const Step2BusinessDetails = ({
  businessName, setBusinessName,
  shopName, setShopName,
  category, setCategory,
  gst, setGst,
  pan, setPan,
  fssaiNumber = '', setFssaiNumber = () => {},
  shelfLifeDetails = '', setShelfLifeDetails = () => {},
  drugLicenseNumber = '', setDrugLicenseNumber = () => {},
  mfgLicenseNumber = '', setMfgLicenseNumber = () => {},
  bisCrsNumber = '', setBisCrsNumber = () => {},
  iecCode = '', setIecCode = () => {},
  isPrivateLabel = false, setIsPrivateLabel = () => {},
  isImported = false, setIsImported = () => {},
  bankAccount, setBankAccount,
  bankName, setBankName,
  ifsc, setIfsc
}) => {
  // Category Searchable Dropdown State
  const [isOpenCategoryMenu, setIsOpenCategoryMenu] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const categoryMenuRef = useRef(null);

  // Toast Pop-up State
  const [toast, setToast] = useState(null);
  const showToast = (title, message) => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(e.target)) {
        setIsOpenCategoryMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCategories = CATEGORIES.filter(cat =>
    cat.toLowerCase().includes(categorySearchQuery.toLowerCase())
  );

  const handleSelectCategory = (cat) => {
    setCategory(cat);
    setIsOpenCategoryMenu(false);
    setCategorySearchQuery('');
  };

  const handleSaveDraft = () => {
    const draft = {
      businessName, shopName, category, gst, pan,
      fssaiNumber, shelfLifeDetails, drugLicenseNumber, mfgLicenseNumber, bisCrsNumber, iecCode,
      isPrivateLabel, isImported,
      bankAccount, bankName, ifsc
    };
    localStorage.setItem('merchant_step2_draft', JSON.stringify(draft));
    showToast('Draft Saved!', 'Step 2 business registry details saved to draft!');
  };

  // Format checks
  const isGstValid = gst.length === 15;
  const isPanValid = pan.length === 10;
  const isIfscValid = ifsc.length === 11;

  return (
    <div className="space-y-5 relative text-left">
      {/* Toast Pop-up Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="p-4 bg-slate-900 text-white rounded-2xl shadow-2xl border border-emerald-500/30 flex items-start justify-between gap-3 z-50 mb-2"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold font-heading text-emerald-400">{toast.title}</h4>
                <p className="text-[11px] text-slate-300 font-medium">{toast.message}</p>
              </div>
            </div>
            <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider font-heading">
            Business & Legal Registry
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Enter registered entity credentials and payout account info.</p>
        </div>
        <button
          type="button"
          onClick={handleSaveDraft}
          className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 font-heading shrink-0"
        >
          <Save className="w-3.5 h-3.5" /> Save Draft
        </button>
      </div>

      <div className="space-y-4">
        {/* Business Legal Entity Name */}
        <FormInput
          label="Registered Business Legal Name"
          required
          icon={Building2}
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="As shown on GSTIN or PAN (e.g. LocalKart Retail Pvt Ltd)"
        />

        {/* Shop Display Name & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Shop / Display Name"
            required
            icon={Store}
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="Consumer facing name (e.g. Sharma Super Store)"
          />

          {/* Searchable Store Category Dropdown */}
          <div className="space-y-1.5 relative" ref={categoryMenuRef}>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider font-heading">
              Store Category *
            </label>
            <div
              onClick={() => setIsOpenCategoryMenu(!isOpenCategoryMenu)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-xs outline-none dark:text-slate-100 font-semibold cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-slate-400" />
                <span className={category ? 'text-slate-800 dark:text-slate-100 font-bold' : 'text-slate-400'}>
                  {category || 'Select Primary Category'}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpenCategoryMenu ? 'rotate-180' : ''}`} />
            </div>

            {isOpenCategoryMenu && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden max-h-60 flex flex-col">
                <div className="p-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 bg-slate-50 dark:bg-slate-950">
                  <Search className="w-3.5 h-3.5 text-slate-400 ml-1" />
                  <input
                    type="text"
                    value={categorySearchQuery}
                    onChange={(e) => setCategorySearchQuery(e.target.value)}
                    placeholder="Search category..."
                    className="w-full bg-transparent text-xs font-semibold outline-none dark:text-slate-100"
                    autoFocus
                  />
                </div>
                <div className="overflow-y-auto p-1 divide-y divide-slate-100 dark:divide-slate-800/50">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleSelectCategory(cat)}
                        className={`w-full text-left px-3 py-2 text-xs rounded-xl font-medium transition-colors flex items-center justify-between ${
                          category === cat
                            ? 'bg-emerald-50 text-emerald-600 font-bold dark:bg-emerald-950/40 dark:text-emerald-400'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span>{cat}</span>
                        {category === cat && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-center text-xs text-slate-400 font-medium">No matching category found</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* GSTIN & PAN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="GSTIN Number"
            badge={isGstValid ? '✓ Valid 15-char GSTIN' : 'Optional / 15 chars'}
            badgeColor={isGstValid ? 'text-emerald-600' : 'text-slate-400'}
            icon={FileText}
            maxLength={15}
            fontMono
            uppercase
            value={gst}
            onChange={(e) => setGst(e.target.value.toUpperCase())}
            placeholder="15-character GSTIN (e.g. 07AAAAA0000A1Z5)"
          />

          <FormInput
            label="PAN Card Number"
            required
            badge={isPanValid ? '✓ Valid 10-char PAN' : '10 characters required'}
            badgeColor={isPanValid ? 'text-emerald-600' : 'text-slate-400'}
            icon={CreditCard}
            maxLength={10}
            fontMono
            uppercase
            value={pan}
            onChange={(e) => setPan(e.target.value.toUpperCase())}
            placeholder="10-character PAN (e.g. ABCDE1234F)"
          />
        </div>

        {/* Category Compliance Information Box */}
        <div className="p-4 bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-4">
          <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider font-heading flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Category Compliance Information ({category || 'General'})
          </h4>

          {/* Food / Grocery / Bakery / Dairy / Supplements */}
          {(category === 'Grocery' || category === 'Bakery & Dairy' || category === 'Supplements' || category === 'Organic & Fresh' || category === 'Dairy') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="FSSAI License Number"
                required
                fontMono
                maxLength={14}
                value={fssaiNumber}
                onChange={(e) => setFssaiNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="14-digit FSSAI License No (e.g. 10020011000123)"
              />
              <FormInput
                label="Shelf-Life & Storage Details"
                required
                value={shelfLifeDetails}
                onChange={(e) => setShelfLifeDetails(e.target.value)}
                placeholder="e.g. 6 Months / Ambient temperature"
              />
            </div>
          )}

          {/* Cosmetics / Wellness / Pharmacy / Beauty / Ayurveda */}
          {(category === 'Pharmacy' || category === 'Cosmetics & Beauty' || category === 'Ayurveda & Herbal' || category === 'Beauty') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Drug License Number"
                required
                fontMono
                uppercase
                value={drugLicenseNumber}
                onChange={(e) => setDrugLicenseNumber(e.target.value.toUpperCase())}
                placeholder="e.g., DL-20/21-123456"
              />
              <FormInput
                label="Manufacturing License Number"
                fontMono
                uppercase
                value={mfgLicenseNumber}
                onChange={(e) => setMfgLicenseNumber(e.target.value.toUpperCase())}
                placeholder="e.g., MFG-LIC-98765"
              />
            </div>
          )}

          {/* Electronics / Appliances / Toys / Mobile Shop */}
          {(category === 'Electronics' || category === 'Home Appliances' || category === 'Toys & Baby Care' || category === 'Mobile & Accessories' || category === 'Mobile Shop' || category === 'Toys') && (
            <FormInput
              label="BIS / CRS Registration Number"
              fontMono
              uppercase
              value={bisCrsNumber}
              onChange={(e) => setBisCrsNumber(e.target.value.toUpperCase())}
              placeholder="e.g., R-41001234 (Compulsory Registration Scheme)"
            />
          )}

          {/* Special Business Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <label className="flex items-center gap-2.5 p-2.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl cursor-pointer hover:border-emerald-500/50 transition-colors">
              <input
                type="checkbox"
                checked={isPrivateLabel}
                onChange={(e) => setIsPrivateLabel(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-500"
              />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-heading">Private Label Brand Store</span>
            </label>

            <label className="flex items-center gap-2.5 p-2.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl cursor-pointer hover:border-emerald-500/50 transition-colors">
              <input
                type="checkbox"
                checked={isImported}
                onChange={(e) => setIsImported(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-500"
              />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-heading">Sells Imported Goods</span>
            </label>
          </div>

          {/* IEC Code (If Imported Products enabled) */}
          {isImported && (
            <FormInput
              label="Import Export Code (IEC)"
              required
              fontMono
              uppercase
              maxLength={10}
              value={iecCode}
              onChange={(e) => setIecCode(e.target.value.toUpperCase())}
              placeholder="10-digit IEC Code (e.g. 0512345678)"
            />
          )}
        </div>

        {/* Bank Payout Account Section */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-4">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-emerald-600" />
            <h4 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider font-heading">
              Bank Payout Account
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <FormInput
                label="Bank Name"
                required
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g. State Bank of India"
              />
            </div>

            <div>
              <FormInput
                label="IFSC Code"
                required
                badge={isIfscValid ? '✓ Valid IFSC' : '11 characters'}
                badgeColor={isIfscValid ? 'text-emerald-600' : 'text-slate-400'}
                fontMono
                uppercase
                maxLength={11}
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                placeholder="SBIN0001822"
              />
            </div>

            <div className="md:col-span-3">
              <FormInput
                label="Account Number"
                required
                type="password"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value.replace(/\D/g, ''))}
                placeholder="Deposits routing destination account number"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
