"use client";

import React from 'react';
import { Building, Navigation, Compass, MapPin } from 'lucide-react';
import { FormInput } from '../common/FormInput';

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

export const AddressFields = ({
  buildingNo, setBuildingNo,
  roadName, setRoadName,
  landmark, setLandmark,
  pincode, setPincode,
  city, setCity,
  stateName, setStateName,
  onFieldChange
}) => {
  const update = (setter, key, val) => {
    setter(val);
    if (onFieldChange) onFieldChange(key, val);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
      {/* Building / Shop / Godown No */}
      <FormInput
        label="Building No. / Shop No. / Godown No."
        required
        icon={Building}
        value={buildingNo}
        onChange={(e) => update(setBuildingNo, 'buildingNo', e.target.value)}
        placeholder="e.g. Shop No. 4, Ground Floor / Plot 12"
      />

      {/* Road Name / Area / Locality */}
      <FormInput
        label="Road Name / Area / Locality"
        required
        icon={Navigation}
        value={roadName}
        onChange={(e) => update(setRoadName, 'roadName', e.target.value)}
        placeholder="e.g. Main Market Road, Sector 4"
      />

      {/* Landmark */}
      <FormInput
        label="Landmark"
        badge="Optional"
        icon={Compass}
        value={landmark}
        onChange={(e) => update(setLandmark, 'landmark', e.target.value)}
        placeholder="e.g. Opposite SBI Bank / Near Bus Stand"
      />

      {/* Pincode */}
      <FormInput
        label="Pincode"
        required
        icon={MapPin}
        maxLength={6}
        fontMono
        value={pincode}
        onChange={(e) => {
          const val = e.target.value.replace(/\D/g, '').slice(0, 6);
          update(setPincode, 'pincode', val);
        }}
        placeholder="6-digit PIN code (e.g. 201301)"
      />

      {/* City */}
      <FormInput
        label="City"
        required
        value={city}
        onChange={(e) => update(setCity, 'city', e.target.value)}
        placeholder="e.g. Noida / New Delhi"
      />

      {/* State */}
      <div className="space-y-1.5 text-left">
        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider font-heading">
          State *
        </label>
        <select
          value={stateName}
          onChange={(e) => update(setStateName, 'stateName', e.target.value)}
          className="w-full bg-slate-50 focus:bg-white text-slate-800 border border-slate-200 focus:border-[#105634] focus:ring-2 focus:ring-emerald-500/15 rounded-2xl px-4 py-3 text-xs outline-none font-semibold transition-all"
        >
          {INDIAN_STATES.map((st) => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
