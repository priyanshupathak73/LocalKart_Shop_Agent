"use client";

import React, { useState } from 'react';
import { Building, Save } from 'lucide-react';
import { AddressFields } from '../address/AddressFields';
import { OpenStreetMapPicker } from '../address/OpenStreetMapPicker';

export const StoreAddressLocationCard = ({ showToast }) => {
  const [buildingNo, setBuildingNo] = useState('Shop No. 4, Ground Floor');
  const [roadName, setRoadName] = useState('Main Market Road, Sector 4');
  const [landmark, setLandmark] = useState('Near Bus Terminal');
  const [pincode, setPincode] = useState('201301');
  const [city, setCity] = useState('Noida');
  const [stateName, setStateName] = useState('Uttar Pradesh');
  const [lat, setLat] = useState(28.5708);
  const [lng, setLng] = useState(77.3260);
  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      if (showToast) showToast('Address Saved', 'Physical address and location coordinates updated!');
    }, 900);
  };

  return (
    <div className="bg-white border border-slate-200/70 rounded-3xl shadow-card overflow-hidden text-left">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
          <Building className="w-4 h-4 text-[#105634]" /> Physical Address & Delivery Pin
        </h3>
        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          OpenStreetMap Verified
        </span>
      </div>

      <form onSubmit={handleSave} className="p-6 space-y-6">
        <AddressFields
          buildingNo={buildingNo} setBuildingNo={setBuildingNo}
          roadName={roadName} setRoadName={setRoadName}
          landmark={landmark} setLandmark={setLandmark}
          pincode={pincode} setPincode={setPincode}
          city={city} setCity={setCity}
          stateName={stateName} setStateName={setStateName}
        />

        <OpenStreetMapPicker
          lat={lat}
          lng={lng}
          onLocationSelect={(m) => {
            if (m.lat) setLat(m.lat);
            if (m.lng) setLng(m.lng);
            if (m.road) setRoadName(m.road);
            if (m.city) setCity(m.city);
            if (m.state) setStateName(m.state);
            if (m.pincode) setPincode(m.pincode);
          }}
        />

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#105634] hover:bg-[#0e3e26] text-white font-bold px-5 py-2.5 rounded-2xl text-xs flex items-center gap-2 font-heading shadow-md transition-all active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Physical Address & Coordinates'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
export default StoreAddressLocationCard;
