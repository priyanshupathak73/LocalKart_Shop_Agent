"use client";

import React, { useState } from 'react';
import { Store, Phone, User, Tag, Save } from 'lucide-react';
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
    }, 800);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-left">
      <div className="p-5 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2 font-heading">
          <Store className="w-4 h-4 text-emerald-500" /> Store Profile & Identity
        </h3>
        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
          Public Facing
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
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 font-heading shadow-md transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Saving...' : 'Update Store Info'}
          </button>
        </div>
      </form>
    </div>
  );
};
