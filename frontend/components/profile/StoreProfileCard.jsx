"use client";

import React, { useState } from 'react';
import { Store, Phone, User, Tag, Save, Check } from 'lucide-react';
import { FormInput } from '../common/FormInput';

export const StoreProfileCard = ({ showToast }) => {
  const [storeName, setStoreName] = useState('Gupta Kirana Store');
  const [ownerName, setOwnerName] = useState('Ashwani Gupta');
  const [phone, setPhone] = useState('9876543210');
  const [category, setCategory] = useState('Grocery');
  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      if (showToast) showToast('Store Info Saved', 'Public store details updated successfully!');
    }, 700);
  };

  return (
    <div className="bg-white border border-slate-200/70 rounded-3xl shadow-card overflow-hidden text-left">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
          <Store className="w-4 h-4 text-[#105634]" /> Store Identity & Profile
        </h3>
        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
          Public Merchant Facing
        </span>
      </div>

      <form onSubmit={handleSave} className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Shop / Display Name"
            required
            icon={Store}
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="Consumer facing name"
          />

          <FormInput
            label="Primary Category"
            required
            icon={Tag}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Store category"
          />

          <FormInput
            label="Owner / Contact Person"
            required
            icon={User}
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            placeholder="Full name of merchant"
          />

          <FormInput
            label="Contact Phone Number"
            required
            icon={Phone}
            fontMono
            maxLength={10}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            placeholder="10-digit mobile number"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#105634] hover:bg-[#0e3e26] text-white font-bold px-5 py-2.5 rounded-2xl text-xs flex items-center gap-2 font-heading shadow-md transition-all active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Updating...' : 'Save Store Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
export default StoreProfileCard;
