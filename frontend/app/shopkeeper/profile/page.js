"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';

import { ProfileHeader } from '../../../components/profile/ProfileHeader';
import { StoreProfileCard } from '../../../components/profile/StoreProfileCard';
import { StoreAddressLocationCard } from '../../../components/profile/StoreAddressLocationCard';
import { KYCComplianceSummaryCard } from '../../../components/profile/KYCComplianceSummaryCard';
import { SignOutSection } from '../../../components/profile/SignOutSection';

export default function ShopkeeperProfilePage() {
  const { user } = useAuthStore();
  const [toast, setToast] = useState(null);

  const showToast = (title, message, type = 'success') => {
    setToast({ title, message, type });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="space-y-6 relative text-left">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`p-4 text-white rounded-2xl shadow-2xl border flex items-start justify-between gap-3 z-50 mb-2 ${
              toast.type === 'error' ? 'bg-red-950 border-red-500/50' : 'bg-slate-900 border-emerald-500/30'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${toast.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
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

      <div>
        <h1 className="text-2xl font-black font-heading text-slate-800 dark:text-slate-100 tracking-tight">
          User Merchant Account & Profile
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-0.5">
          Manage your personal account profile, physical store location, and view compliance credentials.
        </p>
      </div>

      {/* 1. Header Banner Card */}
      <ProfileHeader user={user} storeName="Gupta Kirana Store" category="Grocery" />

      {/* 2. Store Profile & Identity */}
      <StoreProfileCard showToast={showToast} />

      {/* 3. Physical Address & OpenStreetMap Location Pin */}
      <StoreAddressLocationCard showToast={showToast} />

      {/* 4. KYC & Legal Compliance Credentials */}
      <KYCComplianceSummaryCard />

      {/* 5. Sign Out Section (Located at the Bottom of Profile Page) */}
      <SignOutSection />
    </div>
  );
}
