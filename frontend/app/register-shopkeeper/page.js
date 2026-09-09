"use client";

import React, { useState, useEffect } from 'react';
import { useAppRouter } from '../../hooks/useAppRouter';
import { useAuthStore } from '../../store/useAuthStore';
import API from '../../api/api';

import { RegistrationNavbar } from '../../components/register/RegistrationNavbar';
import { RegistrationHero } from '../../components/register/RegistrationHero';
import { RegistrationStepper } from '../../components/register/RegistrationStepper';
import { RegistrationSuccess } from '../../components/register/RegistrationSuccess';

import { Step1PersonalInfo } from '../../components/register-shopkeeper/Step1PersonalInfo';
import { Step2BusinessDetails } from '../../components/register-shopkeeper/Step2BusinessDetails';
import { Step3AddressDetails } from '../../components/register-shopkeeper/Step3AddressDetails';
import { Step4DocumentUpload } from '../../components/register-shopkeeper/Step4DocumentUpload';
import { Step5ReviewSubmit } from '../../components/register-shopkeeper/Step5ReviewSubmit';

import { ArrowLeft, ArrowRight, Save, Loader2, Sparkles } from 'lucide-react';

export default function RegisterShopkeeperPage() {
  const router = useAppRouter();
  const loginStore = useAuthStore((state) => state.login);
  
  // 5 Onboarding Steps: 1 (Personal), 2 (Business), 3 (Address), 4 (Documents), 5 (Review)
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [draftSavedToast, setDraftSavedToast] = useState(false);

  // Step 1: Personal Info
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [regEmail, setRegEmail] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2: Business & Category Compliance Details (Aadhaar removed)
  const [businessName, setBusinessName] = useState('');
  const [shopName, setShopName] = useState('');
  const [category, setCategory] = useState('Grocery');
  const [gst, setGst] = useState('');
  const [pan, setPan] = useState('');
  const [fssaiNumber, setFssaiNumber] = useState('');
  const [shelfLifeDetails, setShelfLifeDetails] = useState('');
  const [drugLicenseNumber, setDrugLicenseNumber] = useState('');
  const [mfgLicenseNumber, setMfgLicenseNumber] = useState('');
  const [bisCrsNumber, setBisCrsNumber] = useState('');
  const [iecCode, setIecCode] = useState('');
  const [isPrivateLabel, setIsPrivateLabel] = useState(false);
  const [isImported, setIsImported] = useState(false);

  // Payout Details
  const [bankAccount, setBankAccount] = useState('');
  const [bankName, setBankName] = useState('');
  const [ifsc, setIfsc] = useState('');

  // Step 3: Address Info
  const [addressBuildingNo, setAddressBuildingNo] = useState('');
  const [addressRoadName, setAddressRoadName] = useState('');
  const [addressLandmark, setAddressLandmark] = useState('');
  const [addressPincode, setAddressPincode] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressStateName, setAddressStateName] = useState('Delhi');
  const [mapLat, setMapLat] = useState(28.6139);
  const [mapLng, setMapLng] = useState(77.2090);
  const [googleMapsLocation, setGoogleMapsLocation] = useState('');
  const [mapsVerified, setMapsVerified] = useState(false);

  // Step 4: Files State
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [ocrStatus, setOcrStatus] = useState({});

  // Auto-restore draft from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('merchant_registration_full_draft');
      if (saved) {
        const d = JSON.parse(saved);
        if (d.fullName) setFullName(d.fullName);
        if (d.phone) setPhone(d.phone);
        if (d.phoneVerified) setPhoneVerified(d.phoneVerified);
        if (d.regEmail) setRegEmail(d.regEmail);
        if (d.emailVerified) setEmailVerified(d.emailVerified);
        if (d.businessName) setBusinessName(d.businessName);
        if (d.shopName) setShopName(d.shopName);
        if (d.category) setCategory(d.category);
        if (d.gst) setGst(d.gst);
        if (d.pan) setPan(d.pan);
        if (d.fssaiNumber) setFssaiNumber(d.fssaiNumber);
        if (d.shelfLifeDetails) setShelfLifeDetails(d.shelfLifeDetails);
        if (d.drugLicenseNumber) setDrugLicenseNumber(d.drugLicenseNumber);
        if (d.mfgLicenseNumber) setMfgLicenseNumber(d.mfgLicenseNumber);
        if (d.bisCrsNumber) setBisCrsNumber(d.bisCrsNumber);
        if (d.iecCode) setIecCode(d.iecCode);
        if (d.isPrivateLabel !== undefined) setIsPrivateLabel(d.isPrivateLabel);
        if (d.isImported !== undefined) setIsImported(d.isImported);
        if (d.bankAccount) setBankAccount(d.bankAccount);
        if (d.bankName) setBankName(d.bankName);
        if (d.ifsc) setIfsc(d.ifsc);
        if (d.addressBuildingNo) setAddressBuildingNo(d.addressBuildingNo);
        if (d.addressRoadName) setAddressRoadName(d.addressRoadName);
        if (d.addressLandmark) setAddressLandmark(d.addressLandmark);
        if (d.addressPincode) setAddressPincode(d.addressPincode);
        if (d.addressCity) setAddressCity(d.addressCity);
        if (d.addressStateName) setAddressStateName(d.addressStateName);
        if (d.googleMapsLocation) setGoogleMapsLocation(d.googleMapsLocation);
      }
    } catch (e) {}
  }, []);

  const saveProgressDraft = (targetStep) => {
    const draft = {
      step: targetStep,
      fullName, phone, phoneVerified, regEmail, emailVerified,
      businessName, shopName, category, gst, pan,
      fssaiNumber, shelfLifeDetails, drugLicenseNumber, mfgLicenseNumber, bisCrsNumber, iecCode,
      isPrivateLabel, isImported,
      bankAccount, bankName, ifsc,
      addressBuildingNo, addressRoadName, addressLandmark, addressPincode, addressCity, addressStateName, mapLat, mapLng, googleMapsLocation
    };
    localStorage.setItem('merchant_registration_full_draft', JSON.stringify(draft));
    setDraftSavedToast(true);
    setTimeout(() => setDraftSavedToast(false), 3000);
  };

  const handleFileUploadSim = (fileKey, file) => {
    if (!file) return;
    setUploadedFiles(prev => ({ ...prev, [fileKey]: { name: file.name, progress: 0, verified: false } }));
    let cur = 0;
    const interval = setInterval(() => {
      cur += 25;
      setUploadedFiles(prev => ({ ...prev, [fileKey]: { ...prev[fileKey], progress: cur } }));
      if (cur >= 100) {
        clearInterval(interval);
        setUploadedFiles(prev => ({ ...prev, [fileKey]: { ...prev[fileKey], verified: true } }));
        setOcrStatus(prev => ({ ...prev, [fileKey]: 'success' }));
      }
    }, 150);
  };

  const handleRemoveFile = (fileKey) => {
    setUploadedFiles(prev => { const n = { ...prev }; delete n[fileKey]; return n; });
    setOcrStatus(prev => { const n = { ...prev }; delete n[fileKey]; return n; });
  };

  const isStepValid = () => {
    if (step === 1) return fullName && phoneVerified && emailVerified && regEmail.includes('@') && regPassword.length >= 8 && regPassword === confirmPassword;
    if (step === 2) {
      const basic = businessName && shopName && pan.length === 10 && bankAccount && bankName && ifsc.length === 11;
      if (!basic) return false;
      if ((category === 'Grocery' || category === 'Bakery & Dairy' || category === 'Supplements') && !fssaiNumber) return false;
      if ((category === 'Pharmacy' || category === 'Cosmetics & Beauty') && !drugLicenseNumber) return false;
      if (isImported && !iecCode) return false;
      return true;
    }
    if (step === 3) return addressBuildingNo && addressRoadName && addressPincode.length === 6 && addressCity && addressStateName;
    if (step === 4) {
      const baseVerified = uploadedFiles['pan']?.verified && uploadedFiles['bank_passbook']?.verified && uploadedFiles['digital_signature']?.verified && uploadedFiles['storefront']?.verified;
      if (!baseVerified) return false;
      if ((category === 'Grocery' || category === 'Bakery & Dairy' || category === 'Supplements') && !uploadedFiles['fssai_cert']?.verified) return false;
      return true;
    }
    return true;
  };

  const handleContinue = () => {
    if (isStepValid()) {
      setError(null);
      const nextStep = Math.min(step + 1, 5);
      setStep(nextStep);
      saveProgressDraft(nextStep);
    } else {
      if (step === 1 && regPassword.length < 8) {
        setError('Password must be at least 8 characters long.');
      } else {
        setError('Please review required business and compliance fields before continuing.');
      }
    }
  };

  const handleBackStep = () => { setError(null); setStep(prev => Math.max(prev - 1, 1)); };

  const handleSubmitRegistration = async () => {
    if (!isStepValid()) { setError('Required fields are incomplete.'); return; }
    setLoading(true);
    setError(null);
    try {
      const payload = { name: fullName, email: regEmail, password: regPassword, phone, role: 'SHOPKEEPER', shopName, shopAddress: googleMapsLocation };
      const res = await API.post('/auth/register', payload);
      const { user, token } = res.data.data;
      localStorage.setItem('onboarding_user_login', JSON.stringify({ user, token }));
      localStorage.removeItem('merchant_registration_full_draft');
      setLoading(false);
      setShowSuccess(true);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || err.message || 'Registration failed');
    }
  };

  const handleFinalRedirectDashboard = () => {
    const saved = localStorage.getItem('onboarding_user_login');
    if (saved) {
      const { user, token } = JSON.parse(saved);
      loginStore({ ...user, role: 'shopkeeper' }, token);
    }
    router.push('/');
  };

  if (showSuccess) {
    return <RegistrationSuccess shopName={shopName} handleFinalRedirectDashboard={handleFinalRedirectDashboard} />;
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] text-slate-800 flex flex-col font-sans relative">
      {draftSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#105634] text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold font-heading flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-300" /> Progress Auto-Saved to Draft!
        </div>
      )}

      <RegistrationNavbar onBack={() => router.push('/')} />
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <RegistrationHero />
          
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200/70 shadow-lg rounded-3xl overflow-hidden flex flex-col">
              <RegistrationStepper currentStep={step} />
              
              <div className="p-6 md:p-8 space-y-6 flex-1 text-left">
                {step === 1 && (
                  <Step1PersonalInfo
                    fullName={fullName} setFullName={setFullName}
                    phone={phone} setPhone={setPhone}
                    phoneVerified={phoneVerified} setPhoneVerified={setPhoneVerified}
                    regEmail={regEmail} setRegEmail={setRegEmail}
                    emailVerified={emailVerified} setEmailVerified={setEmailVerified}
                    regPassword={regPassword} setRegPassword={setRegPassword}
                    confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
                  />
                )}
                {step === 2 && (
                  <Step2BusinessDetails
                    businessName={businessName} setBusinessName={setBusinessName}
                    shopName={shopName} setShopName={setShopName}
                    category={category} setCategory={setCategory}
                    gst={gst} setGst={setGst}
                    pan={pan} setPan={setPan}
                    fssaiNumber={fssaiNumber} setFssaiNumber={setFssaiNumber}
                    shelfLifeDetails={shelfLifeDetails} setShelfLifeDetails={setShelfLifeDetails}
                    drugLicenseNumber={drugLicenseNumber} setDrugLicenseNumber={setDrugLicenseNumber}
                    mfgLicenseNumber={mfgLicenseNumber} setMfgLicenseNumber={setMfgLicenseNumber}
                    bisCrsNumber={bisCrsNumber} setBisCrsNumber={setBisCrsNumber}
                    iecCode={iecCode} setIecCode={setIecCode}
                    isPrivateLabel={isPrivateLabel} setIsPrivateLabel={setIsPrivateLabel}
                    isImported={isImported} setIsImported={setIsImported}
                    bankAccount={bankAccount} setBankAccount={setBankAccount}
                    bankName={bankName} setBankName={setBankName}
                    ifsc={ifsc} setIfsc={setIfsc}
                  />
                )}
                {step === 3 && (
                  <Step3AddressDetails
                    addressBuildingNo={addressBuildingNo} setAddressBuildingNo={setAddressBuildingNo}
                    addressRoadName={addressRoadName} setAddressRoadName={setAddressRoadName}
                    addressLandmark={addressLandmark} setAddressLandmark={setAddressLandmark}
                    addressPincode={addressPincode} setAddressPincode={setAddressPincode}
                    addressCity={addressCity} setAddressCity={setAddressCity}
                    addressStateName={addressStateName} setAddressStateName={setAddressStateName}
                    mapLat={mapLat} setMapLat={setMapLat}
                    mapLng={mapLng} setMapLng={setMapLng}
                    setGoogleMapsLocation={setGoogleMapsLocation}
                    setMapsVerified={setMapsVerified}
                    onSaveDraft={() => saveProgressDraft(3)}
                  />
                )}
                {step === 4 && (
                  <Step4DocumentUpload
                    category={category}
                    isPrivateLabel={isPrivateLabel}
                    isImported={isImported}
                    uploadedFiles={uploadedFiles}
                    ocrStatus={ocrStatus}
                    handleFileUploadSim={handleFileUploadSim}
                    handleRemoveFile={handleRemoveFile}
                    onSaveDraft={() => saveProgressDraft(4)}
                  />
                )}
                {step === 5 && (
                  <Step5ReviewSubmit
                    fullName={fullName} phone={phone} regEmail={regEmail}
                    businessName={businessName} shopName={shopName} category={category}
                    gst={gst} pan={pan}
                    fssaiNumber={fssaiNumber} shelfLifeDetails={shelfLifeDetails}
                    drugLicenseNumber={drugLicenseNumber} mfgLicenseNumber={mfgLicenseNumber}
                    bisCrsNumber={bisCrsNumber} iecCode={iecCode}
                    isPrivateLabel={isPrivateLabel} isImported={isImported}
                    bankName={bankName} ifsc={ifsc}
                    googleMapsLocation={googleMapsLocation}
                    uploadedFiles={uploadedFiles}
                  />
                )}

                {error && <p className="text-xs font-bold text-red-500">{error}</p>}

                <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                  {step > 1 ? (
                    <button type="button" onClick={handleBackStep} className="bg-slate-100 text-slate-700 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1 font-heading"><ArrowLeft className="w-3.5 h-3.5" /> Back</button>
                  ) : <div />}

                  {step < 5 ? (
                    <button type="button" onClick={handleContinue} className="bg-[#105634] hover:bg-[#0e3e26] text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1 shadow-md font-heading">Continue <ArrowRight className="w-3.5 h-3.5" /></button>
                  ) : (
                    <button type="button" disabled={loading} onClick={handleSubmitRegistration} className="bg-[#105634] hover:bg-[#0e3e26] text-white font-bold px-7 py-3 rounded-xl text-xs flex items-center gap-2 shadow-lg font-heading">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Complete Registration</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
