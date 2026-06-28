import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import API from '../../api/axios';
import logoUrl from '../../assets/Logo.png';
import { 
  Check, 
  Upload, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  ShieldAlert, 
  Sparkles, 
  MapPin, 
  Building, 
  CreditCard, 
  FileText, 
  HelpCircle, 
  Phone, 
  Mail, 
  MessageSquare, 
  ShieldCheck, 
  AlertCircle, 
  Loader2, 
  Info,
  ExternalLink,
  Lock,
  User,
  CheckCircle2
} from 'lucide-react';

export const ShopkeeperRegistration = ({ onBack, onRegisterSuccess }) => {
  const loginStore = useAuthStore((state) => state.login);
  
  // Onboarding Steps: 1, 2, 3, 4
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [toast, setToast] = useState(null);
  const [showAutoSaveIndicator, setShowAutoSaveIndicator] = useState(false);

  // --- Step 1: Personal Info ---
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // --- OTP Verification State ---
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpId, setOtpId] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState(null);

  // OTP Countdown timer
  useEffect(() => {
    let interval = null;
    if (otpSent && otpTimer > 0 && !phoneVerified) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    } else if (otpTimer === 0 && otpSent && !phoneVerified) {
      clearInterval(interval);
      setOtpError('OTP has expired. Request a new OTP.');
    }
    return () => clearInterval(interval);
  }, [otpSent, otpTimer, phoneVerified]);

  // Resend cooldown timer
  useEffect(() => {
    let interval = null;
    if (otpSent && resendCooldown > 0 && !phoneVerified) {
      setCanResend(false);
      interval = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    } else if (resendCooldown === 0 && otpSent && !phoneVerified) {
      clearInterval(interval);
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [otpSent, resendCooldown, phoneVerified]);

  // Check phone session on restore or input change
  const checkPhoneSessionBackend = async (phoneNumber) => {
    try {
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      if (cleanPhone.length !== 10) return;
      
      const formatted = '+91' + cleanPhone;
      const res = await API.get(`/auth/check-phone-session?phoneNumber=${encodeURIComponent(formatted)}`);
      if (res.data.data && res.data.data.verified) {
        setPhoneVerified(true);
      }
    } catch (err) {
      console.error('Failed to restore phone session', err);
    }
  };

  const handleSendOtp = async () => {
    const isPhoneValid = /^[6-9]\d{9}$/.test(phone);
    if (!isPhoneValid) {
      setOtpError('Enter a valid 10-digit mobile number');
      return;
    }

    setSendingOtp(true);
    setOtpError(null);

    try {
      const formattedPhone = '+91' + phone;
      const res = await API.post('/auth/send-otp', { phoneNumber: formattedPhone });
      
      setOtpId(res.data.data.otpId);
      setOtpSent(true);
      setOtpTimer(res.data.data.expiresIn || 120);
      setResendCooldown(30);
      setOtpDigits(['', '', '', '', '', '']);
      
      setToast({
        title: 'OTP Sent',
        message: 'A 6-digit verification code has been sent to +91 ' + phone,
        type: 'success'
      });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otpDigits.join('');
    if (otpCode.length !== 6) {
      setOtpError('Please enter all 6 digits of the OTP.');
      return;
    }

    setVerifyingOtp(true);
    setOtpError(null);

    try {
      const res = await API.post('/auth/verify-otp', { otpId, otp: otpCode });
      if (res.data.data && res.data.data.verified) {
        setPhoneVerified(true);
        setOtpSent(false);
        setToast({
          title: 'Verified Successfully',
          message: 'Your phone number has been authenticated.',
          type: 'success'
        });
        setTimeout(() => setToast(null), 3000);
      }
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleChangeNumber = () => {
    setPhoneVerified(false);
    setOtpSent(false);
    setOtpId('');
    setOtpDigits(['', '', '', '', '', '']);
    setOtpError(null);
  };

  const handleOtpChange = (idx, val) => {
    if (val && !/^\d$/.test(val)) return;

    const newDigits = [...otpDigits];
    newDigits[idx] = val;
    setOtpDigits(newDigits);

    // Focus next box
    if (val && idx < 5) {
      const nextInput = document.getElementById(`otp-${idx + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
      const prevInput = document.getElementById(`otp-${idx - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasteData)) {
      const digits = pasteData.split('');
      setOtpDigits(digits);
      const lastInput = document.getElementById('otp-5');
      if (lastInput) lastInput.focus();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- Email OTP Verification State ---
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpId, setEmailOtpId] = useState('');
  const [emailOtpDigits, setEmailOtpDigits] = useState(['', '', '', '', '', '']);
  const [emailOtpTimer, setEmailOtpTimer] = useState(120);
  const [emailCanResend, setEmailCanResend] = useState(false);
  const [emailResendCooldown, setEmailResendCooldown] = useState(30);
  const [sendingEmailOtp, setSendingEmailOtp] = useState(false);
  const [verifyingEmailOtp, setVerifyingEmailOtp] = useState(false);
  const [emailOtpError, setEmailOtpError] = useState(null);

  // Email OTP Countdown timer
  useEffect(() => {
    let interval = null;
    if (emailOtpSent && emailOtpTimer > 0 && !emailVerified) {
      interval = setInterval(() => {
        setEmailOtpTimer(prev => prev - 1);
      }, 1000);
    } else if (emailOtpTimer === 0 && emailOtpSent && !emailVerified) {
      clearInterval(interval);
      setEmailOtpError('OTP has expired. Request a new OTP.');
    }
    return () => clearInterval(interval);
  }, [emailOtpSent, emailOtpTimer, emailVerified]);

  // Email Resend cooldown timer
  useEffect(() => {
    let interval = null;
    if (emailOtpSent && emailResendCooldown > 0 && !emailVerified) {
      setEmailCanResend(false);
      interval = setInterval(() => {
        setEmailResendCooldown(prev => prev - 1);
      }, 1000);
    } else if (emailResendCooldown === 0 && emailOtpSent && !emailVerified) {
      clearInterval(interval);
      setEmailCanResend(true);
    }
    return () => clearInterval(interval);
  }, [emailOtpSent, emailResendCooldown, emailVerified]);

  const checkEmailSessionBackend = async (emailAddr) => {
    try {
      if (!emailAddr || !emailAddr.includes('@')) return;
      const cleanEmail = emailAddr.trim();
      const res = await API.get(`/auth/check-email-session?email=${encodeURIComponent(cleanEmail)}`);
      if (res.data.data && res.data.data.verified) {
        setEmailVerified(true);
      }
    } catch (err) {
      console.error('Failed to restore email session', err);
    }
  };

  const handleSendEmailOtp = async () => {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail);
    if (!isEmailValid) {
      setEmailOtpError('Enter a valid email address');
      return;
    }

    setSendingEmailOtp(true);
    setEmailOtpError(null);

    try {
      const res = await API.post('/auth/send-email-otp', { email: regEmail });
      
      setEmailOtpId(res.data.data.otpId);
      setEmailOtpSent(true);
      setEmailOtpTimer(res.data.data.expiresIn || 120);
      setEmailResendCooldown(30);
      setEmailOtpDigits(['', '', '', '', '', '']);
      
      setToast({
        title: 'OTP Sent',
        message: 'A 6-digit verification code has been sent to ' + regEmail,
        type: 'success'
      });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setEmailOtpError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setSendingEmailOtp(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    const otpCode = emailOtpDigits.join('');
    if (otpCode.length !== 6) {
      setEmailOtpError('Please enter all 6 digits of the OTP.');
      return;
    }

    setVerifyingEmailOtp(true);
    setEmailOtpError(null);

    try {
      const res = await API.post('/auth/verify-email-otp', { otpId: emailOtpId, otp: otpCode });
      if (res.data.data && res.data.data.verified) {
        setEmailVerified(true);
        setEmailOtpSent(false);
        setToast({
          title: 'Verified Successfully',
          message: 'Your email address has been authenticated.',
          type: 'success'
        });
        setTimeout(() => setToast(null), 3000);
      }
    } catch (err) {
      setEmailOtpError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setVerifyingEmailOtp(false);
    }
  };

  const handleChangeEmail = () => {
    setEmailVerified(false);
    setEmailOtpSent(false);
    setEmailOtpId('');
    setEmailOtpDigits(['', '', '', '', '', '']);
    setEmailOtpError(null);
  };

  const handleEmailOtpChange = (idx, val) => {
    if (val && !/^\d$/.test(val)) return;

    const newDigits = [...emailOtpDigits];
    newDigits[idx] = val;
    setEmailOtpDigits(newDigits);

    // Focus next box
    if (val && idx < 5) {
      const nextInput = document.getElementById(`email-otp-${idx + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleEmailOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !emailOtpDigits[idx] && idx > 0) {
      const prevInput = document.getElementById(`email-otp-${idx - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleEmailOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasteData)) {
      const digits = pasteData.split('');
      setEmailOtpDigits(digits);
      const lastInput = document.getElementById('email-otp-5');
      if (lastInput) lastInput.focus();
    }
  };

  // --- Step 2: Business Info ---
  const [businessName, setBusinessName] = useState('');
  const [shopName, setShopName] = useState('');
  const [category, setCategory] = useState('Grocery');
  const [gst, setGst] = useState('');
  const [pan, setPan] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankName, setBankName] = useState('');
  const [ifsc, setIfsc] = useState('');

  // --- Step 3: Documents & Maps ---
  const [googleMapsLocation, setGoogleMapsLocation] = useState('');
  const [mapsVerified, setMapsVerified] = useState(false);
  const [mapsVerifying, setMapsVerifying] = useState(false);

  // Files State: { fileKey: { name: string, progress: number, verified: boolean, content: string } }
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [ocrStatus, setOcrStatus] = useState({}); // { fileKey: 'idle' | 'processing' | 'success' }

  // Drag and Drop Ref
  const dragRef = useRef(null);

  // OCR Toast helper
  const showOcrToast = (docName, details) => {
    setToast({
      title: `OCR Extraction: ${docName}`,
      message: `Successfully verified! Pre-populated: ${details}`,
      type: 'success'
    });
    setTimeout(() => setToast(null), 5000);
  };

  // Trigger OCR Simulation
  const runOcrSimulation = (fileKey, fileName) => {
    setOcrStatus(prev => ({ ...prev, [fileKey]: 'processing' }));
    
    setTimeout(() => {
      setOcrStatus(prev => ({ ...prev, [fileKey]: 'success' }));
      
      if (fileKey === 'aadhaar') {
        if (!fullName) setFullName('Rajesh Kumar Gupta');
        if (!phone) setPhone('9876543210');
        showOcrToast('Aadhaar Card', 'Name: Rajesh Kumar Gupta, Phone: 9876543210');
      } else if (fileKey === 'pan') {
        if (!pan) setPan('AJHPG8912K');
        if (!businessName) setBusinessName('R.K. Gupta Enterprises');
        showOcrToast('PAN Card', 'PAN: AJHPG8912K, Business: R.K. Gupta Enterprises');
      } else if (fileKey === 'gst') {
        if (!gst) setGst('09AJHPG8912K1Z5');
        if (!shopName) setShopName('Gupta Kirana Store');
        if (!googleMapsLocation) setGoogleMapsLocation('28.6139° N, 77.2090° E (Civil Lines Main Market)');
        setMapsVerified(true);
        showOcrToast('GSTIN Certificate', 'GSTIN: 09AJHPG8912K1Z5, Shop: Gupta Kirana Store');
      }
    }, 1500);
  };

  // Simulating File Upload Progress
  const handleFileUploadSim = (fileKey, file) => {
    if (!file) return;

    // Set file upload status
    setUploadedFiles(prev => ({
      ...prev,
      [fileKey]: {
        name: file.name,
        progress: 0,
        verified: false
      }
    }));

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 20;
      setUploadedFiles(prev => {
        if (!prev[fileKey]) return prev;
        return {
          ...prev,
          [fileKey]: {
            ...prev[fileKey],
            progress: currentProgress
          }
        };
      });

      if (currentProgress >= 100) {
        clearInterval(interval);
        setUploadedFiles(prev => {
          if (!prev[fileKey]) return prev;
          return {
            ...prev,
            [fileKey]: {
              ...prev[fileKey],
              verified: true
            }
          };
        });
        runOcrSimulation(fileKey, file.name);
      }
    }, 150);
  };

  const handleRemoveFile = (fileKey) => {
    setUploadedFiles(prev => {
      const updated = { ...prev };
      delete updated[fileKey];
      return updated;
    });
    setOcrStatus(prev => {
      const updated = { ...prev };
      delete updated[fileKey];
      return updated;
    });
  };

  // Document Checklist depending on selected category
  const getRequiredDocs = () => {
    const base = [
      { key: 'aadhaar', label: 'Aadhaar Card', description: 'Upload colored front & back copy' },
      { key: 'pan', label: 'PAN Card', description: 'Business or Individual PAN' },
      { key: 'gst', label: 'GSTIN Registration Certificate', description: 'Form GST REG-06 copy' },
      { key: 'udyam', label: 'MSME / Udyam Certificate', description: 'Optional but recommended' }
    ];

    if (category === 'Grocery' || category === 'Bakery & Dairy') {
      base.push({ key: 'fssai', label: 'FSSAI License Certificate', description: 'Required for food handling compliance' });
    } else if (category === 'Pharmacy') {
      base.push({ key: 'drug_license', label: 'Drug License Copy', description: 'Form 20/21 pharmacy registry' });
    }
    
    base.push({ key: 'storefront', label: 'Store Front Photo', description: 'Photo showing shop signage' });
    return base;
  };

  // Google Maps Verification Simulation
  const handleVerifyMaps = () => {
    if (!googleMapsLocation) return;
    setMapsVerifying(true);
    setTimeout(() => {
      setMapsVerifying(false);
      setMapsVerified(true);
      setToast({
        title: 'Location Synced',
        message: 'Google Maps geofencing verified successfully!',
        type: 'success'
      });
      setTimeout(() => setToast(null), 3000);
    }, 1000);
  };

  // --- Auto-Save draft logic ---
  useEffect(() => {
    const savedDraft = localStorage.getItem('localkart_merchant_registration_draft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setFullName(draft.fullName || '');
        setPhone(draft.phone || '');
        setRegEmail(draft.regEmail || '');
        setRegPassword(draft.regPassword || '');
        setConfirmPassword(draft.regPassword || '');
        setBusinessName(draft.businessName || '');
        setShopName(draft.shopName || '');
        setCategory(draft.category || 'Grocery');
        setGst(draft.gst || '');
        setPan(draft.pan || '');
        setBankAccount(draft.bankAccount || '');
        setBankName(draft.bankName || '');
        setIfsc(draft.ifsc || '');
        setGoogleMapsLocation(draft.googleMapsLocation || '');
        setStep(draft.step || 1);
        
        if (draft.phone) {
          checkPhoneSessionBackend(draft.phone);
        }
        if (draft.regEmail) {
          checkEmailSessionBackend(draft.regEmail);
        }

        setToast({
          title: 'Draft Loaded',
          message: 'We restored your progress from your last session.',
          type: 'info'
        });
        setTimeout(() => setToast(null), 4000);
      } catch (err) {
        console.error('Failed to parse draft', err);
      }
    }
  }, []);

  // Set up 30-sec Auto-save
  useEffect(() => {
    const saveDraft = () => {
      const draft = {
        fullName, phone, regEmail, regPassword,
        businessName, shopName, category, gst, pan,
        bankAccount, bankName, ifsc,
        googleMapsLocation,
        step
      };
      localStorage.setItem('localkart_merchant_registration_draft', JSON.stringify(draft));
      setShowAutoSaveIndicator(true);
      setTimeout(() => setShowAutoSaveIndicator(false), 2000);
    };

    const interval = setInterval(saveDraft, 30000);
    return () => clearInterval(interval);
  }, [
    fullName, phone, regEmail, regPassword,
    businessName, shopName, category, gst, pan,
    bankAccount, bankName, ifsc,
    googleMapsLocation, step
  ]);

  const handleManualSaveDraft = () => {
    const draft = {
      fullName, phone, regEmail, regPassword,
      businessName, shopName, category, gst, pan,
      bankAccount, bankName, ifsc,
      googleMapsLocation,
      step
    };
    localStorage.setItem('localkart_merchant_registration_draft', JSON.stringify(draft));
    setToast({
      title: 'Progress Saved',
      message: 'Your registration draft is saved locally.',
      type: 'success'
    });
    setTimeout(() => setToast(null), 3000);
  };

  // --- Dynamic Completion Calculations ---
  const calculateProgress = () => {
    let score = 0;
    let total = 14;

    if (fullName) score++;
    if (phone && phone.length === 10) score++;
    if (regEmail && regEmail.includes('@')) score++;
    if (regPassword && regPassword.length >= 6) score++;
    if (confirmPassword && confirmPassword === regPassword) score++;

    if (businessName) score++;
    if (shopName) score++;
    if (gst && gst.length === 15) score++;
    if (pan && pan.length === 10) score++;
    if (bankAccount) score++;
    if (bankName) score++;
    if (ifsc) score++;

    if (googleMapsLocation && mapsVerified) score++;
    
    // Document Upload Files Count
    const requiredDocs = getRequiredDocs();
    const uploadedDocs = requiredDocs.filter(doc => uploadedFiles[doc.key]?.verified).length;
    
    const pct = Math.round(((score + uploadedDocs) / (total + requiredDocs.length)) * 100);
    return {
      pct: Math.min(pct, 100),
      docsUploaded: uploadedDocs,
      docsTotal: requiredDocs.length
    };
  };

  const progressInfo = calculateProgress();

  // --- Validate Steps before allowing Continue ---
  const isStepValid = () => {
    if (step === 1) {
      return (
        fullName && 
        phoneVerified && 
        emailVerified && 
        regEmail.includes('@') && 
        regPassword.length >= 6 && 
        regPassword === confirmPassword
      );
    }
    if (step === 2) {
      return (
        businessName && 
        shopName && 
        gst.length === 15 && 
        pan.length === 10 && 
        bankAccount && 
        bankName && 
        ifsc
      );
    }
    if (step === 3) {
      const docs = getRequiredDocs();
      const mandatoryUploaded = docs
        .filter(d => d.key !== 'udyam') // Make Udyam optional
        .every(d => uploadedFiles[d.key]?.verified);
      return googleMapsLocation && mapsVerified && mandatoryUploaded;
    }
    return true;
  };

  // --- Step navigation ---
  const handleContinue = () => {
    if (isStepValid()) {
      setError(null);
      setStep(prev => Math.min(prev + 1, 4));
    } else {
      setError('Please review all fields and make sure they are filled out correctly.');
    }
  };

  const handleBack = () => {
    setError(null);
    setStep(prev => Math.max(prev - 1, 1));
  };

  // --- Form submission ---
  const handleSubmitRegistration = async (e) => {
    if (e) e.preventDefault();
    if (!isStepValid()) {
      setError('Required fields are missing.');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      name: fullName,
      email: regEmail,
      password: regPassword,
      phone,
      role: 'SHOPKEEPER',
      shopName,
      shopAddress: googleMapsLocation
    };

    try {
      const res = await API.post('/auth/register', payload);
      const { user, token } = res.data.data;
      
      // Save local mock variables (photos/KYC verification files) in LocalStorage
      const kycStatus = {
        status: 'Pending',
        submittedAt: new Date().toISOString(),
        shopName,
        docsCount: progressInfo.docsUploaded,
        timeline: [
          {
            title: "Business Verification",
            description: "GSTIN and PAN verification details processed.",
            status: "complete",
            date: new Date().toLocaleDateString()
          },
          {
            title: "Document Authentication",
            description: "Reviewing Aadhaar & address maps location.",
            status: "current",
            date: "In Progress"
          },
          {
            title: "Account Setup",
            description: "Creating payment gateways and billing profiles.",
            status: "pending",
            date: ""
          },
          {
            title: "Final Compliance Approval",
            description: "Final review by LocalKart compliance officer.",
            status: "pending",
            date: ""
          }
        ]
      };
      
      localStorage.setItem('localkart_kyc_status', JSON.stringify(kycStatus));
      
      // Save file tokens for profile showcase if needed
      localStorage.setItem('localkart_aadhaar_file', uploadedFiles['aadhaar']?.name || 'verified');
      localStorage.setItem('localkart_pan_file', uploadedFiles['pan']?.name || 'verified');
      localStorage.setItem('localkart_gst_file', uploadedFiles['gst']?.name || 'verified');
      localStorage.setItem('localkart_store_photo', uploadedFiles['storefront']?.name || 'verified');

      // Clear draft
      localStorage.removeItem('localkart_merchant_registration_draft');

      setLoading(false);
      setShowSuccess(true);
      
      // Save details to auto-login later or trigger login directly on Dashboard button click
      localStorage.setItem('onboarding_user_login', JSON.stringify({ user, token }));
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || err.message || 'Registration failed');
    }
  };

  const handleFinalRedirectDashboard = () => {
    const savedLogin = localStorage.getItem('onboarding_user_login');
    if (savedLogin) {
      try {
        const { user, token } = JSON.parse(savedLogin);
        const safeUser = {
          ...user,
          role: 'shopkeeper'
        };
        loginStore(safeUser, token);
        if (onRegisterSuccess) onRegisterSuccess();
        localStorage.removeItem('onboarding_user_login');
      } catch (err) {
        console.error('Failed to log in from onboarding flow', err);
        onBack();
      }
    } else {
      onBack();
    }
  };

  // --- SVGs & Components ---
  const MerchantTabletIllustration = () => (
    <svg viewBox="0 0 500 400" className="w-full h-auto max-w-[420px] mx-auto filter drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background Shapes */}
      <circle cx="250" cy="200" r="160" fill="#ECFDF5" />
      <rect x="180" y="80" width="280" height="240" rx="24" fill="#10B981" fillOpacity="0.08" />
      
      {/* Shop Counter */}
      <rect x="80" y="280" width="340" height="40" rx="10" fill="#334155" />
      <rect x="60" y="320" width="380" height="15" fill="#1E293B" />
      
      {/* Grocery Shelves / Stock */}
      <rect x="120" y="160" width="50" height="120" rx="4" fill="#E2E8F0" />
      <rect x="130" y="180" width="30" height="10" fill="#34D399" />
      <rect x="130" y="210" width="30" height="10" fill="#10B981" />
      <rect x="130" y="240" width="30" height="10" fill="#059669" />

      {/* Another shelf */}
      <rect x="330" y="160" width="50" height="120" rx="4" fill="#E2E8F0" />
      <rect x="340" y="180" width="30" height="10" fill="#F87171" />
      <rect x="340" y="210" width="30" height="10" fill="#F59E0B" />
      <rect x="340" y="240" width="30" height="10" fill="#60A5FA" />

      {/* Tablet Screen */}
      <rect x="180" y="140" width="140" height="96" rx="8" fill="#0F172A" />
      <rect x="186" y="146" width="128" height="84" rx="4" fill="#F8FAFC" />
      {/* Shopkeeper Hands */}
      <path d="M150 280C150 250 170 230 190 230L200 240L180 280H150Z" fill="#FDBA74" />
      <path d="M350 280C350 250 330 230 310 230L300 240L320 280H350Z" fill="#FDBA74" />
      
      {/* Tablet UI Elements */}
      <rect x="194" y="156" width="50" height="12" rx="2" fill="#10B981" />
      <circle cx="288" cy="162" r="6" fill="#64748B" />
      <rect x="194" y="176" width="112" height="6" rx="1" fill="#CBD5E1" />
      <rect x="194" y="188" width="80" height="6" rx="1" fill="#E2E8F0" />
      <rect x="194" y="200" width="112" height="18" rx="3" fill="#10B981" fillOpacity="0.15" />
      <rect x="202" y="206" width="60" height="6" rx="1" fill="#10B981" />
      
      {/* Store Owner illustration */}
      <circle cx="250" cy="100" r="28" fill="#FDBA74" />
      {/* Hair */}
      <path d="M222 98C222 80 232 72 250 72C268 72 278 80 278 98C270 94 265 96 250 90C235 96 230 94 222 98Z" fill="#1E293B" />
      {/* Apron Straps */}
      <path d="M226 128L250 148L274 128" stroke="#10B981" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-body transition-colors duration-300 dark:bg-slate-955 dark:text-slate-100">
      
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/80 px-6 py-4 transition-all">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logoUrl} className="h-9 w-auto" alt="e-LocalKart Logo" />
            <span className="text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-450 border border-emerald-200/50 px-2 py-0.5 rounded-md">Merchant Hub</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">Already started?</span>
            <button
              onClick={onBack}
              className="text-xs font-bold text-slate-600 dark:text-slate-350 hover:text-slate-800 dark:hover:text-white px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Exit to Login
            </button>
          </div>
        </div>
      </nav>

      {/* TOAST / FLOATING NOTIFICATION BAR */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 max-w-sm w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl p-4 flex gap-3 animate-fade-in">
          {toast.type === 'success' ? (
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-5 h-5 text-emerald-555 shrink-0 mt-0.5" />
          )}
          <div className="text-left">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{toast.title}</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-6 py-10">
        
        {/* Animated Banner for Auto-Save */}
        <AnimatePresence>
          {showAutoSaveIndicator && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 max-w-md mx-auto bg-emerald-50/70 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900 px-4 py-2 rounded-xl text-xs flex items-center justify-between gap-2 shadow-sm font-semibold"
            >
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Autosaved progress draft successfully
              </span>
              <span className="text-[10px] font-bold text-emerald-500 font-mono">100% sync</span>
            </motion.div>
          )}
        </AnimatePresence>

        {showSuccess ? (
          /* SUCCESS SCREEN FLOW */
          <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-10 shadow-2xl text-center space-y-6 animate-scale-in">
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/40 rounded-full flex items-center justify-center mx-auto text-emerald-500 border border-emerald-100 dark:border-emerald-900">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              >
                <Check className="w-10 h-10" />
              </motion.div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 font-heading">Application Submitted!</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
                Your Merchant Registration for <strong className="text-slate-800 dark:text-white font-semibold">{shopName}</strong> has been successfully uploaded to the local compliance registry.
              </p>
            </div>

            <div className="border border-slate-100 dark:border-slate-800/60 p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl max-w-sm mx-auto text-xs space-y-2">
              <div className="flex justify-between font-medium">
                <span className="text-slate-450">Estimated Review Time:</span>
                <span className="text-slate-700 dark:text-slate-200 font-bold">24–48 Hours</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-450">Documents Uploaded:</span>
                <span className="text-slate-700 dark:text-slate-200 font-bold">{progressInfo.docsUploaded} Files verified</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-450">Current Verification Status:</span>
                <span className="text-amber-600 dark:text-amber-500 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  Review Pending
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <button 
                onClick={handleFinalRedirectDashboard}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02]"
              >
                Go to Dashboard
              </button>
              <button 
                onClick={handleFinalRedirectDashboard}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-700/80 font-bold px-6 py-3 rounded-xl text-sm transition-all"
              >
                Track Application
              </button>
            </div>
          </div>
        ) : (
          /* CORE ONBOARDING LAYOUT (2 Columns) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: HERO, BENEFITS, TRUSTS (40%) */}
            <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-24">
              <div className="space-y-4 text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-700 dark:text-emerald-450 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50">
                  <Sparkles className="w-3.5 h-3.5" /> Start Earning Locally
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white leading-tight tracking-tight font-heading">
                  Become an <br />e-LocalKart Merchant
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md">
                  Digitize your neighborhood store today. Partner with local delivery runners and serve thousands of households instantly.
                </p>
              </div>

              {/* Grocery Shopkeeper Tablet Illustration */}
              <MerchantTabletIllustration />

              {/* Benefits checklist */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-left border-b border-slate-100 dark:border-slate-800/60 pb-2">Why Sell with Us?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  {[
                    "Sell to customers nearby",
                    "Same-day delivery support",
                    "Zero setup fees",
                    "Secure online payments",
                    "Dedicated seller dashboard",
                    "AI-powered inventory management"
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                      <span className="p-0.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-full text-emerald-600 dark:text-emerald-450 shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Section Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { value: "10,000+", label: "Customers" },
                  { value: "500+", label: "Verified Sellers" },
                  { value: "24 Hours", label: "Average Approval" },
                  { value: "4.9 ★", label: "Merchant Rating" }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/50 p-4 rounded-2xl shadow-sm text-center">
                    <div className="text-base font-black text-[#10B981] font-heading">{stat.value}</div>
                    <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 mt-0.5 uppercase tracking-wide">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Bottom Support Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs border-t border-slate-200/60 dark:border-slate-800/60 pt-4">
                <span className="font-bold text-slate-555">Need Help?</span>
                <div className="flex flex-wrap gap-2.5">
                  <a href="mailto:support@localkart.com" className="flex items-center gap-1 text-slate-500 hover:text-emerald-600 dark:text-slate-400 transition-colors font-medium">
                    <Mail className="w-3.5 h-3.5" /> Email
                  </a>
                  <span className="text-slate-300">•</span>
                  <a href="tel:+918005550199" className="flex items-center gap-1 text-slate-500 hover:text-emerald-600 dark:text-slate-400 transition-colors font-medium">
                    <Phone className="w-3.5 h-3.5" /> Call Support
                  </a>
                  <span className="text-slate-300">•</span>
                  <button className="flex items-center gap-1 text-slate-500 hover:text-emerald-600 dark:text-slate-400 transition-colors font-medium">
                    <MessageSquare className="w-3.5 h-3.5" /> Chat
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: WHITE CARD WITH ONBOARDING STEPS + STICKY SIDEBAR (60%) */}
            <div className="lg:col-span-7">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-lg rounded-3xl overflow-hidden flex flex-col transition-colors">
                
                {/* Stepper Header Progress */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50 select-none">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base font-extrabold text-slate-850 dark:text-white font-heading">Merchant Registration</h2>
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500">Step {step} of 4</span>
                  </div>

                  {/* Horizontal visual stepper lines */}
                  <div className="flex items-center justify-between gap-2 relative">
                    {[
                      { idx: 1, title: "Personal" },
                      { idx: 2, title: "Business" },
                      { idx: 3, title: "Documents" },
                      { idx: 4, title: "Review" }
                    ].map((s, index) => (
                      <React.Fragment key={s.idx}>
                        <div className="flex items-center gap-2 z-10">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                            step > s.idx 
                              ? 'bg-emerald-500 border-emerald-500 text-white' 
                              : step === s.idx
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-450 animate-pulse'
                                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500'
                          }`}>
                            {step > s.idx ? <Check className="w-3.5 h-3.5 stroke-[3]" fill="none" /> : s.idx}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider hidden md:inline ${
                            step >= s.idx ? 'text-slate-850 dark:text-white' : 'text-slate-400 dark:text-slate-500'
                          }`}>
                            {s.title}
                          </span>
                        </div>

                        {index < 3 && (
                          <div className="flex-1 h-0.5 bg-slate-200 dark:bg-slate-800 relative rounded">
                            <div className="absolute top-0 left-0 h-full bg-emerald-500 transition-all duration-300" style={{ width: step > s.idx ? '100%' : '0%' }}></div>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Form area & Sidebar Area Grid */}
                <div className="flex flex-col lg:flex-row min-h-[500px]">
                  
                  {/* Left part: Onboarding Form (max-width: 760px) */}
                  <div className="flex-1 p-6 md:p-8 space-y-6 text-left max-w-[760px] w-full">
                    
                    {error && (
                      <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-750 dark:text-red-400 border border-red-100 dark:border-red-900/60 rounded-xl text-xs flex items-center gap-2 font-medium">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* STEP 1: PERSONAL INFORMATION */}
                        {step === 1 && (
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">Personal & Security Profile</h3>
                              <p className="text-xs text-slate-400 mb-4 font-medium">Provide valid login credentials and contact details to manage your store.</p>
                            </div>

                            <div>
                              <label className="block text-xs font-black text-slate-700 dark:text-slate-350 uppercase tracking-wider mb-2">Full Name *</label>
                              <div className="relative">
                                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                                <input 
                                  type="text"
                                  value={fullName}
                                  onChange={(e) => setFullName(e.target.value)}
                                  placeholder="e.g. Rajesh Kumar Gupta"
                                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 rounded-xl pl-10 pr-4 py-3 text-xs outline-none transition-all dark:text-slate-100 font-semibold shadow-sm"
                                />
                              </div>
                            </div>
                                               <div className="grid grid-cols-1 gap-6">
                              {/* PHONE NUMBER SECTION */}
                              <div className="space-y-2">
                                <label className="block text-xs font-black text-slate-700 dark:text-slate-350 uppercase tracking-wider">Phone Number *</label>
                                <div className="flex gap-3">
                                  <div className="relative flex-1">
                                    <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                                    <div className="absolute left-10 top-3.5 text-xs font-bold text-slate-500 flex items-center h-[18px] pr-2.5 border-r border-slate-200">
                                      +91
                                    </div>
                                    <input 
                                      type="text"
                                      disabled={phoneVerified || otpSent}
                                      maxLength={10}
                                      value={phone}
                                      onChange={(e) => {
                                        setPhone(e.target.value.replace(/\D/g, ''));
                                        setPhoneVerified(false);
                                      }}
                                      placeholder="9876543210"
                                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 rounded-xl pl-[72px] pr-4 py-3 text-xs outline-none transition-all dark:text-slate-100 disabled:bg-slate-50 dark:disabled:bg-slate-900/50 disabled:text-slate-500 font-semibold shadow-sm"
                                    />
                                  </div>

                                  {phoneVerified ? (
                                    <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-450 border border-emerald-200 text-xs font-bold px-5 py-3 rounded-xl flex items-center gap-1.5 shrink-0 shadow-sm animate-fade-in select-none">
                                      <Check className="w-4 h-4 stroke-[3]" />
                                      Verified
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      disabled={!/^[6-9]\d{9}$/.test(phone) || sendingOtp || otpSent}
                                      onClick={handleSendOtp}
                                      className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-100 dark:disabled:bg-slate-800 text-white disabled:text-slate-400 font-bold px-6 py-3 rounded-xl text-xs transition-all shrink-0 active:scale-95 shadow-sm hover:shadow-emerald-500/10 disabled:shadow-none"
                                    >
                                      {sendingOtp ? 'Sending...' : 'Send OTP'}
                                    </button>
                                  )}
                                </div>

                                {phoneVerified && (
                                  <div className="flex justify-between items-center mt-2 animate-fade-in text-[10px]">
                                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                                      ✓ Mobile number verified successfully
                                    </span>
                                    <button type="button" onClick={handleChangeNumber} className="text-emerald-600 hover:text-emerald-700 font-bold underline">
                                      Change Number
                                    </button>
                                  </div>
                                )}

                                {!otpSent && !phoneVerified && (
                                  <p className={`text-[10px] font-bold mt-1.5 ${/^[6-9]\d{9}$/.test(phone) ? 'text-emerald-600' : 'text-slate-450'}`}>
                                    {/^[6-9]\d{9}$/.test(phone) ? '✓ Valid mobile number' : 'Enter a valid 10-digit mobile number'}
                                  </p>
                                )}

                                <AnimatePresence>
                                  {otpSent && !phoneVerified && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.25, ease: 'easeOut' }}
                                      className="overflow-hidden bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 text-left shadow-inner mt-3"
                                    >
                                      <div>
                                        <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-350 uppercase tracking-wider mb-1.5">Enter Verification Code</label>
                                        <p className="text-[10px] text-slate-400 font-medium font-sans">Enter the 6-digit code sent to your mobile</p>
                                      </div>

                                      {/* 6 separate stylish OTP input boxes */}
                                      <div className="flex gap-2.5 items-center justify-start animate-fade-in" onPaste={handleOtpPaste}>
                                        {otpDigits.map((digit, idx) => (
                                          <input
                                            key={idx}
                                            id={`otp-${idx}`}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                            className="w-10 h-12 text-center text-base font-extrabold bg-white dark:bg-slate-955 border border-slate-250 dark:border-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl outline-none transition-all dark:text-slate-100 shadow-sm"
                                          />
                                        ))}
                                      </div>

                                      {otpError && (
                                        <p className="text-[10px] text-red-500 font-bold flex items-center gap-1.5 animate-shake">
                                          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {otpError}
                                        </p>
                                      )}

                                      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between pt-1">
                                        <button
                                          type="button"
                                          disabled={otpDigits.some(d => !d) || verifyingOtp}
                                          onClick={handleVerifyOtp}
                                          className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 dark:disabled:bg-slate-850 text-white disabled:text-slate-400 font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-emerald-500/10 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                                        >
                                          {verifyingOtp ? (
                                            <>
                                              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Verifying...
                                            </>
                                          ) : (
                                            'Verify OTP'
                                          )}
                                        </button>

                                        <div className="flex items-center gap-3 text-[10px] font-medium text-slate-500">
                                          <span className="font-semibold">
                                            OTP expires in: <strong className="text-slate-700 dark:text-slate-200 font-extrabold font-mono">{formatTime(otpTimer)}</strong>
                                          </span>
                                          <span className="text-slate-300">|</span>
                                          <button
                                            type="button"
                                            disabled={!canResend || sendingOtp}
                                            onClick={handleSendOtp}
                                            className={`font-bold hover:underline ${
                                              canResend 
                                                ? 'text-emerald-600 hover:text-emerald-700' 
                                                : 'text-slate-400 cursor-not-allowed'
                                            }`}
                                          >
                                            {canResend ? 'Resend OTP' : `Resend in ${resendCooldown}s`}
                                          </button>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>

                              {/* EMAIL ADDRESS SECTION */}
                              <div className="space-y-2">
                                <label className="block text-xs font-black text-slate-700 dark:text-slate-350 uppercase tracking-wider">Email Address *</label>
                                <div className="flex gap-3">
                                  <div className="relative flex-1">
                                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                                    <input 
                                      type="email"
                                      disabled={emailVerified || emailOtpSent}
                                      value={regEmail}
                                      onChange={(e) => {
                                        setRegEmail(e.target.value);
                                        setEmailVerified(false);
                                      }}
                                      placeholder="name@example.com"
                                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 rounded-xl pl-10 pr-4 py-3 text-xs outline-none transition-all dark:text-slate-100 disabled:bg-slate-50 dark:disabled:bg-slate-900/50 disabled:text-slate-500 font-semibold shadow-sm"
                                    />
                                  </div>

                                  {emailVerified ? (
                                    <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-450 border border-emerald-200 text-xs font-bold px-5 py-3 rounded-xl flex items-center gap-1.5 shrink-0 shadow-sm animate-fade-in select-none">
                                      <Check className="w-4 h-4 stroke-[3]" />
                                      Verified
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      disabled={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail) || sendingEmailOtp || emailOtpSent}
                                      onClick={handleSendEmailOtp}
                                      className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-100 dark:disabled:bg-slate-800 text-white disabled:text-slate-400 font-bold px-6 py-3 rounded-xl text-xs transition-all shrink-0 active:scale-95 shadow-sm hover:shadow-emerald-500/10 disabled:shadow-none"
                                    >
                                      {sendingEmailOtp ? 'Sending...' : 'Send OTP'}
                                    </button>
                                  )}
                                </div>

                                {emailVerified && (
                                  <div className="flex justify-between items-center mt-2 animate-fade-in text-[10px]">
                                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                                      ✓ Email address verified successfully
                                    </span>
                                    <button type="button" onClick={handleChangeEmail} className="text-emerald-600 hover:text-emerald-700 font-bold underline">
                                      Change Email
                                    </button>
                                  </div>
                                )}

                                {!emailOtpSent && !emailVerified && (
                                  <p className={`text-[10px] font-bold mt-1.5 ${/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail) ? 'text-emerald-600' : 'text-slate-455'}`}>
                                    {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail) ? '✓ Valid email format' : 'Enter a valid email address'}
                                  </p>
                                )}

                                <AnimatePresence>
                                  {emailOtpSent && !emailVerified && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.25, ease: 'easeOut' }}
                                      className="overflow-hidden bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 text-left shadow-inner mt-3"
                                    >
                                      <div>
                                        <label className="block text-[11px] font-extrabold text-slate-700 dark:text-slate-350 uppercase tracking-wider mb-1.5">Enter Verification Code</label>
                                        <p className="text-[10px] text-slate-400 font-medium font-sans">Enter the 6-digit code sent to your email</p>
                                      </div>

                                      {/* 6 separate stylish OTP input boxes */}
                                      <div className="flex gap-2.5 items-center justify-start animate-fade-in" onPaste={handleEmailOtpPaste}>
                                        {emailOtpDigits.map((digit, idx) => (
                                          <input
                                            key={idx}
                                            id={`email-otp-${idx}`}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleEmailOtpChange(idx, e.target.value)}
                                            onKeyDown={(e) => handleEmailOtpKeyDown(idx, e)}
                                            className="w-10 h-12 text-center text-base font-extrabold bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl outline-none transition-all dark:text-slate-100 shadow-sm"
                                          />
                                        ))}
                                      </div>

                                      {emailOtpError && (
                                        <p className="text-[10px] text-red-500 font-bold flex items-center gap-1.5 animate-shake">
                                          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {emailOtpError}
                                        </p>
                                      )}

                                      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between pt-1">
                                        <button
                                          type="button"
                                          disabled={emailOtpDigits.some(d => !d) || verifyingEmailOtp}
                                          onClick={handleVerifyEmailOtp}
                                          className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 dark:disabled:bg-slate-855 text-white disabled:text-slate-400 font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-emerald-500/10 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                                        >
                                          {verifyingEmailOtp ? (
                                            <>
                                              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Verifying...
                                            </>
                                          ) : (
                                            'Verify OTP'
                                          )}
                                        </button>

                                        <div className="flex items-center gap-3 text-[10px] font-medium text-slate-500">
                                          <span className="font-semibold">
                                            OTP expires in: <strong className="text-slate-700 dark:text-slate-200 font-extrabold font-mono">{formatTime(emailOtpTimer)}</strong>
                                          </span>
                                          <span className="text-slate-300">|</span>
                                          <button
                                            type="button"
                                            disabled={!emailCanResend || sendingEmailOtp}
                                            onClick={handleSendEmailOtp}
                                            className={`font-bold hover:underline ${
                                              emailCanResend 
                                                ? 'text-emerald-600 hover:text-emerald-700' 
                                                : 'text-slate-400 cursor-not-allowed'
                                            }`}
                                          >
                                            {emailCanResend ? 'Resend OTP' : `Resend in ${emailResendCooldown}s`}
                                          </button>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800/60 pt-4 mt-2">
                              <div>
                                <label className="block text-xs font-black text-slate-700 dark:text-slate-350 uppercase tracking-wider mb-2">Password *</label>
                                <div className="relative">
                                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                                  <input 
                                    type="password"
                                    value={regPassword}
                                    onChange={(e) => setRegPassword(e.target.value)}
                                    placeholder="Min 6 characters"
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 rounded-xl pl-10 pr-4 py-3 text-xs outline-none transition-all dark:text-slate-100 font-semibold shadow-sm"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-xs font-black text-slate-700 dark:text-slate-350 uppercase tracking-wider mb-2">Confirm Password *</label>
                                <div className="relative">
                                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                                  <input 
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Verify password"
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 rounded-xl pl-10 pr-4 py-3 text-xs outline-none transition-all dark:text-slate-100 font-semibold shadow-sm"
                                  />
                                </div>
                              </div>
                            </div>
                            
                            {confirmPassword && regPassword !== confirmPassword && (
                              <p className="text-[10px] text-red-500 font-bold mt-1">✓ Passwords do not match yet.</p>
                            )}
                          </div>
                        )}

                        {/* STEP 2: BUSINESS DETAILS */}
                        {step === 2 && (
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">Merchant Business Registry</h3>
                              <p className="text-xs text-slate-400 mb-4 font-medium">Verify your tax registries and banking routing codes for payouts.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-slate-555 dark:text-slate-400 uppercase mb-1.5 font-heading">Registered Business Name</label>
                                <input 
                                  type="text"
                                  value={businessName}
                                  onChange={(e) => setBusinessName(e.target.value)}
                                  placeholder="Legal Entity (e.g. Gupta Retail Ltd)"
                                  className="w-full bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900/80 rounded-xl px-4 py-3 text-xs outline-none transition-all dark:text-slate-100"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-slate-555 dark:text-slate-400 uppercase mb-1.5">Shop Name</label>
                                <input 
                                  type="text"
                                  value={shopName}
                                  onChange={(e) => setShopName(e.target.value)}
                                  placeholder="Public Label (e.g. Gupta Kirana)"
                                  className="w-full bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900/80 rounded-xl px-4 py-3 text-xs outline-none transition-all dark:text-slate-100"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-slate-555 dark:text-slate-400 uppercase mb-1.5">Category</label>
                                <select 
                                  value={category}
                                  onChange={(e) => setCategory(e.target.value)}
                                  className="w-full bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900/80 rounded-xl px-3 py-3 text-xs outline-none transition-all dark:text-slate-100"
                                >
                                  <option value="Grocery">Grocery</option>
                                  <option value="Bakery & Dairy">Bakery & Dairy</option>
                                  <option value="Fruits & Vegetables">Fruits & Veggies</option>
                                  <option value="Pharmacy">Pharmacy / Medicine</option>
                                  <option value="Electronics">Electronics</option>
                                  <option value="Other">Other Retail Goods</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-slate-555 dark:text-slate-400 uppercase mb-1.5">GST Number</label>
                                <input 
                                  type="text"
                                  maxLength={15}
                                  value={gst}
                                  onChange={(e) => setGst(e.target.value.toUpperCase())}
                                  placeholder="15-character GSTIN"
                                  className="w-full bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900/80 rounded-xl px-4 py-3 text-xs outline-none transition-all dark:text-slate-100"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-slate-555 dark:text-slate-400 uppercase mb-1.5">PAN Card Number</label>
                                <input 
                                  type="text"
                                  maxLength={10}
                                  value={pan}
                                  onChange={(e) => setPan(e.target.value.toUpperCase())}
                                  placeholder="10-character PAN"
                                  className="w-full bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900/80 rounded-xl px-4 py-3 text-xs outline-none transition-all dark:text-slate-100"
                                />
                              </div>
                            </div>

                            <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 mt-2">
                              <h4 className="text-xs font-bold text-slate-450 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                                <CreditCard className="w-4 h-4 text-emerald-500" /> Bank Payout Account
                              </h4>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                  <label className="block text-xs font-bold text-slate-555 dark:text-slate-400 uppercase mb-1.5 font-heading">Bank Name</label>
                                  <input 
                                    type="text"
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    placeholder="e.g. State Bank of India"
                                    className="w-full bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900/80 rounded-xl px-4 py-3 text-xs outline-none transition-all dark:text-slate-100"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-xs font-bold text-slate-555 dark:text-slate-400 uppercase mb-1.5">IFSC Routing Code</label>
                                  <input 
                                    type="text"
                                    value={ifsc}
                                    onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                                    placeholder="SBIN0001822"
                                    className="w-full bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900/80 rounded-xl px-4 py-3 text-xs outline-none transition-all dark:text-slate-100"
                                  />
                                </div>
                                
                                <div className="md:col-span-3">
                                  <label className="block text-xs font-bold text-slate-555 dark:text-slate-400 uppercase mb-1.5">Account Number</label>
                                  <input 
                                    type="password"
                                    value={bankAccount}
                                    onChange={(e) => setBankAccount(e.target.value.replace(/\D/g, ''))}
                                    placeholder="Deposits router destination address"
                                    className="w-full bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900/80 rounded-xl px-4 py-3 text-xs outline-none transition-all dark:text-slate-100"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* STEP 3: DOCUMENT UPLOAD */}
                        {step === 3 && (
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">KYC Document Upload</h3>
                              <p className="text-xs text-slate-400 mb-4 font-medium">Upload copies for instant automated OCR authentication verification.</p>
                            </div>

                            {/* Google Maps Location widget */}
                            <div className="bg-slate-50/70 dark:bg-slate-900/60 p-4 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl space-y-3">
                              <label className="block text-xs font-bold text-[#6B7280] dark:text-slate-400 uppercase tracking-wide">Google Maps Geolocation Coordinate</label>
                              <div className="flex gap-2">
                                <div className="relative flex-1">
                                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-emerald-500 shrink-0" />
                                  <input 
                                    type="text"
                                    value={googleMapsLocation}
                                    onChange={(e) => { setGoogleMapsLocation(e.target.value); setMapsVerified(false); }}
                                    placeholder="Paste maps link or lat/long (e.g. 28.6139, 77.2090)"
                                    className="w-full bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-800 focus:border-emerald-500 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none transition-all dark:text-slate-100"
                                  />
                                </div>
                                <button 
                                  type="button"
                                  disabled={!googleMapsLocation || mapsVerifying}
                                  onClick={handleVerifyMaps}
                                  className={`text-xs font-bold px-3.5 rounded-xl border transition-all shrink-0 flex items-center gap-1.5 shadow-sm ${
                                    mapsVerified 
                                      ? 'bg-emerald-50 border-emerald-250 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-450' 
                                      : 'bg-white hover:bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-350 disabled:opacity-50'
                                  }`}
                                >
                                  {mapsVerifying ? (
                                    <>
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Verifying...
                                    </>
                                  ) : mapsVerified ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-500" /> Synced
                                    </>
                                  ) : (
                                    'Ping GPS'
                                  )}
                                </button>
                              </div>
                              <p className="text-[10px] text-slate-400 font-medium">Pinging sets geofencing delivery boundary radius bounds for your store.</p>
                            </div>

                            {/* Dynamic Category Documents checklist */}
                            <div className="space-y-3.5 mt-4">
                              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Category Upload Checklist ({category})</h4>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {getRequiredDocs().map((doc) => {
                                  const file = uploadedFiles[doc.key];
                                  const ocr = ocrStatus[doc.key];

                                  return (
                                    <div key={doc.key} className="border border-slate-200/80 dark:border-slate-800/80 p-3 bg-white dark:bg-slate-900 rounded-2xl flex flex-col justify-between gap-3 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                                      <div className="text-left space-y-0.5">
                                        <div className="flex justify-between items-center">
                                          <h5 className="text-[11px] font-bold text-slate-850 dark:text-slate-250">{doc.label}</h5>
                                          {doc.key === 'udyam' && (
                                            <span className="text-[8px] bg-slate-100 dark:bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-bold">Optional</span>
                                          )}
                                        </div>
                                        <p className="text-[9px] text-slate-400 leading-normal font-medium">{doc.description}</p>
                                      </div>

                                      {file ? (
                                        /* UPLOADED FILE SHOWCASE */
                                        <div className="border border-slate-100 dark:border-slate-800/60 p-2.5 rounded-xl bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-between gap-2 text-left animate-fade-in">
                                          <div className="flex items-center gap-2 shrink-0 max-w-[70%]">
                                            <span className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-lg">
                                              <FileText className="w-4 h-4" />
                                            </span>
                                            <div className="overflow-hidden">
                                              <p className="text-[10px] font-bold text-slate-700 dark:text-slate-350 truncate font-mono">{file.name}</p>
                                              {file.progress < 100 ? (
                                                <div className="w-24 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-1">
                                                  <div className="h-full bg-emerald-500 transition-all" style={{ width: `${file.progress}%` }}></div>
                                                </div>
                                              ) : ocr === 'processing' ? (
                                                <span className="text-[8px] font-bold text-amber-500 animate-pulse flex items-center gap-0.5 mt-0.5">
                                                  <Loader2 className="w-2.5 h-2.5 animate-spin" /> Simulating OCR...
                                                </span>
                                              ) : ocr === 'success' ? (
                                                <span className="text-[8px] font-bold text-emerald-600 dark:text-emerald-450 flex items-center gap-0.5 mt-0.5">
                                                  <Check className="w-2.5 h-2.5 text-emerald-500 stroke-[3]" /> OCR Authenticated
                                                </span>
                                              ) : (
                                                <span className="text-[8px] font-bold text-slate-400 mt-0.5 block font-heading">File uploaded</span>
                                              )}
                                            </div>
                                          </div>

                                          <button 
                                            type="button" 
                                            onClick={() => handleRemoveFile(doc.key)}
                                            className="text-slate-400 hover:text-red-500 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors shrink-0"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      ) : (
                                        /* DRAG & DROP PLACEHOLDER */
                                        <label className="border border-dashed border-slate-200 hover:border-emerald-500 dark:border-slate-800 dark:hover:border-emerald-800 rounded-xl p-4 text-center cursor-pointer transition-all bg-slate-50/50 hover:bg-emerald-50/5 dark:bg-slate-900/40 relative flex flex-col items-center justify-center h-24">
                                          <input 
                                            type="file" 
                                            accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                            onChange={(e) => handleFileUploadSim(doc.key, e.target.files[0])}
                                          />
                                          <Upload className="w-4 h-4 text-slate-400 dark:text-slate-650 mb-1" />
                                          <span className="text-[9px] font-bold text-slate-600 dark:text-slate-400">Drag/Drop or Browse</span>
                                          <span className="text-[8px] text-slate-400 mt-0.5 font-mono">Max size 5MB</span>
                                        </label>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* STEP 4: REVIEW AND SUBMIT */}
                        {step === 4 && (
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">Review Merchant Agreement</h3>
                              <p className="text-xs text-slate-400 mb-4 font-medium">Please audit details before submitting for official compliance registry.</p>
                            </div>

                            <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-2">
                              {/* Step 1 Profile review */}
                              <div className="p-3 bg-slate-50 dark:bg-slate-800/30 border border-slate-150 dark:border-slate-800 rounded-2xl">
                                <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider mb-2">1. Personal & Contact Details</h4>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div>
                                    <span className="text-slate-400 block text-[9px]">Full Name</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">{fullName}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block text-[9px]">Phone Number</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">{phone}</span>
                                  </div>
                                  <div className="col-span-2 mt-1">
                                    <span className="text-slate-400 block text-[9px]">Email Address</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{regEmail}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Step 2 Business details review */}
                              <div className="p-3 bg-slate-50 dark:bg-slate-800/30 border border-slate-150 dark:border-slate-800 rounded-2xl">
                                <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider mb-2">2. Business Registry KYC</h4>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div>
                                    <span className="text-slate-400 block text-[9px]">Legal Entity Business</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">{businessName}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block text-[9px]">Shop Public Name</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">{shopName}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block text-[9px]">Store Category</span>
                                    <span className="font-semibold text-slate-850 dark:text-white">{category}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block text-[9px]">GSTIN Registration</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{gst}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block text-[9px]">Taxpayer PAN</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{pan}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block text-[9px]">Bank Destination Routing</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{ifsc} ({bankName})</span>
                                  </div>
                                </div>
                              </div>

                              {/* Step 3 Documents & GPS review */}
                              <div className="p-3 bg-slate-50 dark:bg-slate-800/30 border border-slate-150 dark:border-slate-800 rounded-2xl">
                                <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider mb-2">3. GPS Mapping & Files Compliance</h4>
                                <div className="space-y-2 text-xs">
                                  <div>
                                    <span className="text-slate-400 block text-[9px]">Google Maps Coordinate Location</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                      <MapPin className="w-3.5 h-3.5 text-emerald-500" /> {googleMapsLocation}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block text-[9px] mb-1">Uploaded KYC Documents</span>
                                    <div className="flex flex-wrap gap-1.5">
                                      {Object.keys(uploadedFiles).map(k => (
                                        <span key={k} className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wide">
                                          <Check className="w-2.5 h-2.5 text-emerald-500" /> {k === 'storefront' ? 'Shop Photo' : k}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="p-3 border border-amber-100 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-955/10 rounded-2xl flex items-start gap-2.5 text-xs">
                                <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                <p className="text-slate-500 dark:text-slate-400 text-[10px] leading-normal font-semibold">
                                  By submitting, you authorize e-LocalKart to authenticate banking records via GSTIN/PAN and coordinate geofencing map boundaries. Estimated review completion is 24 to 48 hours.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Right part: Sticky Sidebar (300px width) */}
                  <div className="w-full lg:w-[300px] shrink-0 p-6 bg-slate-50/50 dark:bg-slate-900/40 border-t lg:border-t-0 lg:border-l border-slate-200/60 dark:border-slate-800/80 lg:sticky lg:top-[73px] h-fit self-start space-y-6">
                    
                    {/* Animated Circular Progress Profile Completion */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800 p-5 rounded-2xl shadow-sm text-center flex flex-col items-center justify-center space-y-3">
                      <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Profile Completion</h4>
                      
                      <div className="relative w-28 h-28 flex items-center justify-center">
                        {/* Circle SVG */}
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" stroke="#CBD5E1" strokeWidth="8" fill="transparent" className="text-slate-200 dark:text-slate-800" />
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="40" 
                            stroke="#10B981" 
                            strokeWidth="8" 
                            fill="transparent" 
                            strokeDasharray={2 * Math.PI * 40}
                            strokeDashoffset={2 * Math.PI * 40 - (progressInfo.pct / 100) * (2 * Math.PI * 40)}
                            className="transition-all duration-500 ease-out"
                          />
                        </svg>
                        <div className="absolute text-center">
                          <span className="text-xl font-black text-slate-800 dark:text-white font-heading">{progressInfo.pct}%</span>
                          <span className="text-[8px] font-bold text-slate-400 uppercase block mt-0.5 font-heading">Complete</span>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        Uploaded <strong className="text-slate-800 dark:text-white font-semibold">{progressInfo.docsUploaded} / {progressInfo.docsTotal}</strong> required KYC credentials.
                      </div>
                    </div>

                    {/* Verification status indicator card */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800 p-4.5 rounded-2xl shadow-sm space-y-3 text-left">
                      <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Compliance Registry</h4>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Queue State:</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-350">
                            {step === 4 ? 'Ready' : 'Drafting'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Status Check:</span>
                          <span className="font-bold text-slate-500 flex items-center gap-1 font-heading">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                            Not Submitted
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-2 mt-1">
                          <span className="text-slate-455">Review Period:</span>
                          <span className="font-bold text-slate-800 dark:text-white">24–48 Hours</span>
                        </div>
                      </div>
                    </div>

                    {/* Support Panel links */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800 p-4.5 rounded-2xl shadow-sm space-y-3 text-left">
                      <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Onboarding Support</h4>
                      
                      <div className="space-y-2.5 text-xs font-semibold">
                        <a href="mailto:onboarding@localkart.com" className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 dark:text-slate-400 transition-colors">
                          <Mail className="w-4 h-4 text-emerald-500" />
                          <span>onboarding@localkart.com</span>
                        </a>
                        <a href="tel:+918005550199" className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 dark:text-slate-400 transition-colors">
                          <Phone className="w-4 h-4 text-emerald-500" />
                          <span>1800 555 0199</span>
                        </a>
                        <button className="flex items-center gap-2 text-slate-650 hover:text-emerald-600 dark:text-slate-400 transition-colors w-full text-left">
                          <MessageSquare className="w-4 h-4 text-emerald-500" />
                          <span>Talk to Onboarding Agent</span>
                        </button>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Sticky Action Footer Bar */}
                <div className="sticky bottom-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800 px-6 py-4 flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-2">
                    <button 
                      type="button"
                      disabled={step === 1}
                      onClick={handleBack}
                      className="text-xs font-bold text-slate-600 dark:text-slate-350 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/40 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    
                    <button 
                      type="button"
                      onClick={handleManualSaveDraft}
                      className="text-xs font-bold text-slate-600 dark:text-slate-350 hover:text-slate-800 dark:hover:text-white px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-all flex items-center gap-1"
                    >
                      <Save className="w-3.5 h-3.5" /> Save Draft
                    </button>
                  </div>

                  {step === 1 && !isStepValid() && (
                    <div className="flex flex-col items-end text-right text-[10px] text-slate-500 font-bold max-w-[200px] sm:max-w-xs leading-normal animate-fade-in select-none">
                      <span>Complete all required fields</span>
                      <span className="text-red-500 font-extrabold flex items-center gap-1 mt-0.5 justify-end">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        {!phoneVerified && !emailVerified 
                          ? 'Phone & Email verification required' 
                          : !phoneVerified 
                            ? 'Phone verification required' 
                            : 'Email verification required'}
                      </span>
                    </div>
                  )}

                  {step < 4 ? (
                    <button 
                      type="button"
                      disabled={!isStepValid()}
                      onClick={handleContinue}
                      className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white disabled:text-slate-400 font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-emerald-500/10 flex items-center gap-1.5 active:scale-95"
                    >
                      Continue <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button 
                      type="button"
                      disabled={!isStepValid() || loading}
                      onClick={handleSubmitRegistration}
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-slate-200 disabled:to-slate-200 dark:disabled:from-slate-800 dark:disabled:to-slate-800 text-white disabled:text-slate-450 font-black px-6 py-3 rounded-xl text-xs transition-all shadow-lg active:scale-95 flex items-center gap-1.5"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5" /> Submit for Verification
                        </>
                      )}
                    </button>
                  )}
                </div>

              </div>
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 py-6 text-center text-xs text-slate-400 dark:text-slate-600 mt-auto transition-colors">
        <p>© {new Date().getFullYear()} LocalKart MERN Onboarding Suite. Designed for compliance & hyper-commerce.</p>
      </footer>

    </div>
  );
};
