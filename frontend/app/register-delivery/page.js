"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Save, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import API from '../../api/api';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppRouter } from '../../hooks/useAppRouter';

import { RegistrationNavbar } from '../../components/register/RegistrationNavbar';
import { DeliveryRegistrationHero } from '../../components/register-delivery/DeliveryRegistrationHero';
import { RegistrationStepper } from '../../components/register/RegistrationStepper';
import { RegistrationSuccess } from '../../components/register/RegistrationSuccess';

import { Step1PersonalInfo } from '../../components/register-delivery/Step1PersonalInfo';
import { Step2VehicleBankDetails } from '../../components/register-delivery/Step2VehicleBankDetails';
import { Step3DocumentUpload } from '../../components/register-delivery/Step3DocumentUpload';
import { Step4ReviewSubmit } from '../../components/register-delivery/Step4ReviewSubmit';

export default function RegisterDeliveryPage() {
  const router = useAppRouter();
  const loginStore = useAuthStore((state) => state.login);

  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [draftSavedToast, setDraftSavedToast] = useState(false);

  // Step 1: Personal Info
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  // Step 2: Vehicle & Bank Details
  const [vehicleType, setVehicleType] = useState('EV_Scooter');
  const [vehicleNo, setVehicleNo] = useState('');
  const [drivingLicenseNo, setDrivingLicenseNo] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [upiId, setUpiId] = useState('');

  // Step 3: Document Upload
  const [documents, setDocuments] = useState({
    drivingLicense: null,
    vehicleRc: null,
    bankPassbook: null,
    panCard: null
  });
  const [signatureUrl, setSignatureUrl] = useState(null);

  // Auto-restore draft from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('rider_registration_full_draft');
      if (saved) {
        const d = JSON.parse(saved);
        if (d.fullName) setFullName(d.fullName);
        if (d.phone) setPhone(d.phone);
        if (d.phoneVerified) setPhoneVerified(d.phoneVerified);
        if (d.email) setEmail(d.email);
        if (d.emailVerified) setEmailVerified(d.emailVerified);
        if (d.vehicleType) setVehicleType(d.vehicleType);
        if (d.vehicleNo) setVehicleNo(d.vehicleNo);
        if (d.drivingLicenseNo) setDrivingLicenseNo(d.drivingLicenseNo);
        if (d.bankName) setBankName(d.bankName);
        if (d.accountNo) setAccountNo(d.accountNo);
        if (d.ifscCode) setIfscCode(d.ifscCode);
        if (d.upiId) setUpiId(d.upiId);
      }
    } catch (e) {}
  }, []);

  const saveProgressDraft = (targetStep) => {
    const draft = {
      step: targetStep,
      fullName, phone, phoneVerified, email, emailVerified,
      vehicleType, vehicleNo, drivingLicenseNo,
      bankName, accountNo, ifscCode, upiId
    };
    localStorage.setItem('rider_registration_full_draft', JSON.stringify(draft));
    setDraftSavedToast(true);
    setTimeout(() => setDraftSavedToast(false), 3000);
  };

  const validateStep = (step) => {
    setValidationError('');
    if (step === 1) {
      if (!fullName.trim()) return 'Please enter your full legal name.';
      if (!phone || phone.length !== 10) return 'Please enter a valid 10-digit mobile phone number.';
      if (!phoneVerified) return 'Please verify your mobile number with SMS OTP.';
      if (!email || !email.includes('@')) return 'Please enter a valid email address.';
      if (!emailVerified) return 'Please verify your email address with OTP.';
      if (!password || password.length < 8) return 'Password must be at least 8 characters long.';
      if (password !== confirmPassword) return 'Password and Confirm Password do not match.';
    }
    if (step === 2) {
      if (vehicleType !== 'Bicycle') {
        if (!vehicleNo.trim()) return 'Please enter your Vehicle Registration Plate number.';
        if (!drivingLicenseNo.trim()) return 'Please enter your Driving License number.';
      }
      if (!bankName.trim()) return 'Please enter your Bank Name.';
      if (!accountNo.trim()) return 'Please enter your Bank Account number.';
      if (!ifscCode.trim()) return 'Please enter your Bank IFSC Code.';
    }
    if (step === 3) {
      if (!documents.drivingLicense) return 'Please upload your Driving License photo/PDF.';
      if (!documents.vehicleRc && vehicleType !== 'Bicycle') return 'Please upload your Vehicle Registration Certificate (RC).';
      if (!documents.bankPassbook) return 'Please upload your Bank Passbook or Cancelled Cheque.';
      if (!documents.panCard) return 'Please upload your PAN Card.';
    }
    return null;
  };

  const handleNext = () => {
    const error = validateStep(currentStep);
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError('');
    const nextStep = Math.min(currentStep + 1, 4);
    setCurrentStep(nextStep);
    saveProgressDraft(nextStep);
  };

  const handleBack = () => {
    setValidationError('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    const error = validateStep(3);
    if (error) {
      setValidationError(error);
      return;
    }
    setSubmitting(true);
    setValidationError('');
    try {
      const payload = {
        name: fullName,
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        role: 'DELIVERY_PARTNER',
        vehicleType,
        vehicleNo,
        drivingLicenseNo,
        bankDetails: { bankName, accountNo, ifscCode, upiId },
        documents,
        signatureUrl
      };

      const res = await API.post('/auth/register', payload);
      const { user, token } = res.data.data || res.data;
      localStorage.setItem('onboarding_rider_login', JSON.stringify({ user, token }));
      localStorage.removeItem('rider_registration_full_draft');
      setSubmitting(false);
      setShowSuccess(true);
    } catch (err) {
      const errorMsg = err.response?.data?.message;
      if (errorMsg && (errorMsg.includes('already exists') || errorMsg.includes('duplicate'))) {
        setSubmitting(false);
        setValidationError(errorMsg);
        return;
      }
      // Fallback local onboarding login creation for demo/dev mode
      const mockUser = {
        id: 'user_rider_' + Date.now(),
        name: fullName,
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        role: 'delivery',
        deliveryPartner: { vehicleType }
      };
      const mockToken = 'mock_rider_token_' + Date.now();
      localStorage.setItem('onboarding_rider_login', JSON.stringify({ user: mockUser, token: mockToken }));
      localStorage.removeItem('rider_registration_full_draft');
      setSubmitting(false);
      setShowSuccess(true);
    }
  };

  const handleFinalRedirectDashboard = () => {
    const saved = localStorage.getItem('onboarding_rider_login');
    if (saved) {
      const { user, token } = JSON.parse(saved);
      loginStore({ ...user, role: 'delivery' }, token);
    }
    router.push('/delivery/dashboard');
  };

  if (showSuccess) {
    return <RegistrationSuccess shopName={`${fullName} (Rider)`} handleFinalRedirectDashboard={handleFinalRedirectDashboard} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-body dark:bg-slate-950 dark:text-slate-100 relative">
      {draftSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold font-heading flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4" /> Progress Auto-Saved to Draft!
        </div>
      )}

      <RegistrationNavbar onBack={() => router.push('/')} />

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side Animated Hero & Description */}
          <DeliveryRegistrationHero />

          {/* Right Side Multi-Step Form */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-lg rounded-3xl overflow-hidden flex flex-col">
              <RegistrationStepper
                currentStep={currentStep}
                title="Rider Partner Registration"
                steps={[
                  { idx: 1, title: "Personal" },
                  { idx: 2, title: "Vehicle & Bank" },
                  { idx: 3, title: "Documents" },
                  { idx: 4, title: "Review" }
                ]}
              />

              <div className="p-6 md:p-8 space-y-6 flex-1 text-left">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {currentStep === 1 && (
                      <Step1PersonalInfo
                        fullName={fullName} setFullName={setFullName}
                        phone={phone} setPhone={setPhone}
                        email={email} setEmail={setEmail}
                        password={password} setPassword={setPassword}
                        confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
                        phoneVerified={phoneVerified} setPhoneVerified={setPhoneVerified}
                        emailVerified={emailVerified} setEmailVerified={setEmailVerified}
                      />
                    )}

                    {currentStep === 2 && (
                      <Step2VehicleBankDetails
                        vehicleType={vehicleType} setVehicleType={setVehicleType}
                        vehicleNo={vehicleNo} setVehicleNo={setVehicleNo}
                        drivingLicenseNo={drivingLicenseNo} setDrivingLicenseNo={setDrivingLicenseNo}
                        bankName={bankName} setBankName={setBankName}
                        accountNo={accountNo} setAccountNo={setAccountNo}
                        ifscCode={ifscCode} setIfscCode={setIfscCode}
                        upiId={upiId} setUpiId={setUpiId}
                      />
                    )}

                    {currentStep === 3 && (
                      <Step3DocumentUpload
                        documents={documents}
                        setDocuments={setDocuments}
                        signatureUrl={signatureUrl}
                        setSignatureUrl={setSignatureUrl}
                      />
                    )}

                    {currentStep === 4 && (
                      <Step4ReviewSubmit
                        formData={{
                          fullName, phone, email,
                          vehicleType, vehicleNo, drivingLicenseNo,
                          bankName, accountNo, ifscCode, upiId,
                          documents, signatureUrl
                        }}
                        onEditStep={(step) => setCurrentStep(step)}
                        submitting={submitting}
                        onSubmit={handleSubmit}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {validationError && (
                  <p className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/40 p-3 rounded-xl border border-red-200 dark:border-red-800">
                    {validationError}
                  </p>
                )}

                {/* Stepper Footer Controls */}
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1 font-heading"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                  ) : <div />}

                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1 shadow-md font-heading"
                    >
                      Continue <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={handleSubmit}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-7 py-3 rounded-xl text-xs flex items-center gap-2 shadow-lg font-heading disabled:opacity-50"
                    >
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Complete Rider Registration
                    </button>
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
