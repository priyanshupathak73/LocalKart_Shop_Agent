"use client";

import React, { useState } from 'react';
import { Lock, Shield, Key, Save } from 'lucide-react';
import { FormInput } from '../common/FormInput';

export const SecuritySettings = ({ showToast }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactor, setTwoFactor] = useState(false);
  const [saving, setSaving] = useState(false);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      if (showToast) showToast('Password Mismatch', 'New passwords do not match!', 'error');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      if (showToast) showToast('Password Updated', 'Account password changed successfully!');
    }, 1000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-left">
      <div className="p-5 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2 font-heading">
          <Shield className="w-4 h-4 text-emerald-500" /> Account Security & Password
        </h3>
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          Encrypted
        </span>
      </div>

      <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            label="Current Password"
            type="password"
            icon={Key}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
          />
          <FormInput
            label="New Password"
            type="password"
            icon={Lock}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Min 8 characters"
          />
          <FormInput
            label="Confirm New Password"
            type="password"
            icon={Lock}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
          />
        </div>

        <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Two-Factor Authentication (2FA)</p>
            <p className="text-[10px] text-slate-400">Require OTP verification on new device logins</p>
          </div>
          <button
            type="button"
            onClick={() => setTwoFactor(!twoFactor)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${twoFactor ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}
          >
            <span className="w-4 h-4 bg-white rounded-full shadow-md" />
          </button>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving || !newPassword}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 font-heading shadow-md disabled:opacity-50 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
};
