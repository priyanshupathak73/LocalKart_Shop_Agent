"use client";

import React, { useState } from 'react';
import { Bike, Shield, FileCheck, Save } from 'lucide-react';
import { FormInput } from '../../common/FormInput';

export const DeliveryVehicleInfoCard = ({ showToast }) => {
  const [vehicleType, setVehicleType] = useState('Electric Two-Wheeler (EV)');
  const [plateNumber, setPlateNumber] = useState('DL01AB1234');
  const [licenseNo, setLicenseNo] = useState('DL-1420220098765');
  const [insurancePolicy, setInsurancePolicy] = useState('POL-88776655');
  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      if (showToast) showToast('Vehicle Info Updated', 'Rider vehicle and licensing details saved!');
    }, 800);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-left">
      <div className="p-5 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2 font-heading">
          <Bike className="w-4 h-4 text-emerald-500" /> Vehicle & Driving License Registration
        </h3>
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          RTO Verified
        </span>
      </div>

      <form onSubmit={handleSave} className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Vehicle Type & Model"
            required
            icon={Bike}
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            placeholder="e.g. Electric Scooter"
          />

          <FormInput
            label="Registration Plate Number"
            required
            uppercase
            fontMono
            icon={FileCheck}
            value={plateNumber}
            onChange={(e) => setPlateNumber(e.target.value)}
            placeholder="e.g. DL01AB1234"
          />

          <FormInput
            label="Driving License Number"
            required
            uppercase
            fontMono
            icon={Shield}
            value={licenseNo}
            onChange={(e) => setLicenseNo(e.target.value)}
            placeholder="DL Number"
          />

          <FormInput
            label="Vehicle Insurance Policy"
            required
            uppercase
            fontMono
            icon={FileCheck}
            value={insurancePolicy}
            onChange={(e) => setInsurancePolicy(e.target.value)}
            placeholder="Policy ID"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 font-heading shadow-md transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Saving...' : 'Update Vehicle Details'}
          </button>
        </div>
      </form>
    </div>
  );
};
