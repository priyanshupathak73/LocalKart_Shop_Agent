"use client";

import React from 'react';
import { Bike, Shield, FileCheck, Landmark, CreditCard, CheckCircle2 } from 'lucide-react';
import { FormInput } from '../common/FormInput';

export const Step2VehicleBankDetails = ({
  vehicleType, setVehicleType,
  vehicleNo, setVehicleNo,
  drivingLicenseNo, setDrivingLicenseNo,
  bankName, setBankName,
  accountNo, setAccountNo,
  ifscCode, setIfscCode,
  upiId, setUpiId
}) => {
  const vehicleOptions = [
    { id: 'EV_Scooter', label: 'Electric Two-Wheeler (EV)', desc: 'Zero emissions, lowest operating cost' },
    { id: 'Petrol_Bike', label: 'Petrol Motorcycle / Scooter', desc: 'Standard 2-wheeler motor vehicle' },
    { id: 'Bicycle', label: 'Bicycle / Non-Motorized', desc: 'Hyper-local short distance deliveries' },
    { id: 'Auto_Cargo', label: '3-Wheeler Cargo Auto', desc: 'Heavy / bulk order delivery' },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* 1. Vehicle Selection & Registration */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-black font-heading text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Bike className="w-5 h-5 text-emerald-500" /> Vehicle & Driving Licensing Information
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Select your delivery vehicle mode and enter official RTO registration details.
          </p>
        </div>

        {/* Vehicle Mode Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {vehicleOptions.map((opt) => (
            <div
              key={opt.id}
              onClick={() => setVehicleType(opt.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                vehicleType === opt.id
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500 shadow-sm'
                  : 'bg-slate-50/50 dark:bg-slate-850 border-slate-200/60 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 font-heading">{opt.label}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                vehicleType === opt.id ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300'
              }`}>
                {vehicleType === opt.id && <CheckCircle2 className="w-3.5 h-3.5" />}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Vehicle Registration Plate Number (e.g. DL01AB1234)"
            required={vehicleType !== 'Bicycle'}
            uppercase
            fontMono
            icon={FileCheck}
            value={vehicleNo}
            onChange={(e) => setVehicleNo(e.target.value)}
            placeholder="DL01AB1234"
          />

          <FormInput
            label="Driving License (DL) Number"
            required={vehicleType !== 'Bicycle'}
            uppercase
            fontMono
            icon={Shield}
            value={drivingLicenseNo}
            onChange={(e) => setDrivingLicenseNo(e.target.value)}
            placeholder="DL-1420220098765"
          />
        </div>
      </div>

      {/* 2. Bank Payout Account Details */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-black font-heading text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Landmark className="w-5 h-5 text-emerald-500" /> Daily Earnings Payout & Bank Account
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Enter your bank account or UPI details for direct daily earnings deposit.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Bank Name"
            required
            icon={Landmark}
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            placeholder="e.g. State Bank of India"
          />

          <FormInput
            label="Account Number"
            required
            fontMono
            icon={CreditCard}
            value={accountNo}
            onChange={(e) => setAccountNo(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter bank account number"
          />

          <FormInput
            label="IFSC Code"
            required
            uppercase
            fontMono
            icon={Landmark}
            value={ifscCode}
            onChange={(e) => setIfscCode(e.target.value)}
            placeholder="SBIN0001822"
          />

          <FormInput
            label="Instant Withdrawal UPI ID (Optional)"
            icon={CreditCard}
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="rider@upi"
          />
        </div>
      </div>
    </div>
  );
};
