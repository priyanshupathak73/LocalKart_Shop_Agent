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
    }, 800);
  };

  return (
    <div className="bg-white border border-slate-200/70 rounded-3xl shadow-card overflow-hidden text-left">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
          <Shield className="w-4 h-4 text-[#105634]" /> Account Security & Password
        </h3>
        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          256-bit Encrypted
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

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-800">Two-Factor Authentication (2FA)</p>
            <p className="text-[11px] text-slate-400">Require mobile OTP verification on new device logins</p>
          </div>
          <button
            type="button"
            onClick={() => setTwoFactor(!twoFactor)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${twoFactor ? 'bg-[#105634] justify-end' : 'bg-slate-300 justify-start'}`}
          >
            <span className="w-4 h-4 bg-white rounded-full shadow-md" />
          </button>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving || !newPassword}
            className="bg-[#105634] hover:bg-[#0e3e26] text-white font-bold px-5 py-2.5 rounded-2xl text-xs flex items-center gap-2 font-heading shadow-md disabled:opacity-50 transition-all active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Updating...' : 'Update Password'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
export default SecuritySettings;
