"use client";

import React, { useState } from 'react';
import { Landmark, CreditCard, Save, CheckCircle2 } from 'lucide-react';
import { FormInput } from '../../common/FormInput';

export const DeliveryBankPayoutCard = ({ showToast }) => {
  const [bankName, setBankName] = useState('HDFC Bank');
  const [accountNo, setAccountNo] = useState('50100298765432');
  const [ifsc, setIfsc] = useState('HDFC0001234');
  const [upiId, setUpiId] = useState('rohan.rider@upi');
  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      if (showToast) showToast('Payout Bank Updated', 'Weekly deposit bank account details saved!');
    }, 800);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-left">
      <div className="p-5 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2 font-heading">
          <Landmark className="w-4 h-4 text-emerald-500" /> Daily Earnings Deposit & UPI Payout
        </h3>
        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active Payout Destination
        </span>
      </div>

      <form onSubmit={handleSave} className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Bank Name"
            required
            icon={Landmark}
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            placeholder="e.g. HDFC Bank"
          />

          <FormInput
            label="Account Number"
            required
            fontMono
            icon={CreditCard}
            value={accountNo}
            onChange={(e) => setAccountNo(e.target.value.replace(/\D/g, ''))}
            placeholder="Account number"
          />

          <FormInput
            label="IFSC Code"
            required
            uppercase
            fontMono
            icon={Landmark}
            value={ifsc}
            onChange={(e) => setIfsc(e.target.value)}
            placeholder="IFSC code"
          />

          <FormInput
            label="Instant Withdrawal UPI ID"
            required
            icon={CreditCard}
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="username@upi"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 font-heading shadow-md transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Saving...' : 'Save Payout Details'}
          </button>
        </div>
      </form>
    </div>
  );
};
