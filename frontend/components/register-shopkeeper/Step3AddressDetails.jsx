"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, CheckCircle2, X } from 'lucide-react';
import { AddressFields } from '../address/AddressFields';
import { OpenStreetMapPicker } from '../address/OpenStreetMapPicker';

export const Step3AddressDetails = ({
  addressBuildingNo, setAddressBuildingNo,
  addressRoadName, setAddressRoadName,
  addressLandmark, setAddressLandmark,
  addressPincode, setAddressPincode,
  addressCity, setAddressCity,
  addressStateName, setAddressStateName,
  mapLat, setMapLat,
  mapLng, setMapLng,
  setGoogleMapsLocation,
  setMapsVerified,
  onSaveDraft
}) => {
  const [toast, setToast] = useState(null);
  const showToast = (title, message) => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleLocalSaveDraft = () => {
    const draft = { addressBuildingNo, addressRoadName, addressLandmark, addressPincode, addressCity, addressStateName, mapLat, mapLng };
    localStorage.setItem('merchant_step3_draft', JSON.stringify(draft));
    if (onSaveDraft) onSaveDraft();
    showToast('Draft Saved!', 'Step 3 address & location details saved to draft!');
  };

  const notifyAddressChange = (updated = {}) => {
    const b = updated.buildingNo ?? addressBuildingNo;
    const r = updated.roadName ?? addressRoadName;
    const l = updated.landmark ?? addressLandmark;
    const p = updated.pincode ?? addressPincode;
    const c = updated.city ?? addressCity;
    const s = updated.stateName ?? addressStateName;
    const parts = [b, r, l ? `Near ${l}` : '', c, s, p ? `PIN: ${p}` : ''].filter(Boolean);
    setGoogleMapsLocation(parts.join(', '));
  };

  return (
    <div className="space-y-4 relative">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="p-4 bg-slate-900 text-white rounded-2xl shadow-2xl border border-emerald-500/30 flex items-start justify-between gap-3 z-50 mb-2"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold font-heading text-emerald-400">{toast.title}</h4>
                <p className="text-[11px] text-slate-300 font-medium">{toast.message}</p>
              </div>
            </div>
            <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider font-heading">
            Shop / Godown Address & Map Coordinates
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Enter complete physical address of your store or godown and place exact location marker on OpenStreetMap.
          </p>
        </div>
        <button
          type="button"
          onClick={handleLocalSaveDraft}
          className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 font-heading shrink-0"
        >
          <Save className="w-3.5 h-3.5" /> Save Draft
        </button>
      </div>

      <div className="bg-slate-50/70 dark:bg-slate-900/60 p-5 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl space-y-6">
        <AddressFields
          buildingNo={addressBuildingNo} setBuildingNo={setAddressBuildingNo}
          roadName={addressRoadName} setRoadName={setAddressRoadName}
          landmark={addressLandmark} setLandmark={setAddressLandmark}
          pincode={addressPincode} setPincode={setAddressPincode}
          city={addressCity} setCity={setAddressCity}
          stateName={addressStateName} setStateName={setAddressStateName}
          onFieldChange={(key, val) => notifyAddressChange({ [key]: val })}
        />

        <OpenStreetMapPicker
          lat={mapLat}
          lng={mapLng}
          onLocationSelect={(mapData) => {
            if (mapData.lat) setMapLat(mapData.lat);
            if (mapData.lng) setMapLng(mapData.lng);
            if (mapData.road) setAddressRoadName(mapData.road);
            if (mapData.city) setAddressCity(mapData.city);
            if (mapData.state) setAddressStateName(mapData.state);
            if (mapData.pincode) setAddressPincode(mapData.pincode);
            setMapsVerified(true);
            notifyAddressChange({
              lat: mapData.lat, lng: mapData.lng,
              ...(mapData.road && { roadName: mapData.road }),
              ...(mapData.city && { city: mapData.city }),
              ...(mapData.state && { stateName: mapData.state }),
              ...(mapData.pincode && { pincode: mapData.pincode })
            });
          }}
        />
      </div>
    </div>
  );
};
