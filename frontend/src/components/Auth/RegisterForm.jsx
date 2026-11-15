import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Sun, 
  Moon,
  Info,
  RefreshCw
} from 'lucide-react';

const RegisterForm = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { register, verifyRegistrationOtp, resendOtp, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isBengali = i18n.language === 'bn';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // OTP Verification States (For Pension Holder Registration)
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const toggleLanguage = () => {
    const newLang = isBengali ? 'en' : 'bn';
    i18n.changeLanguage(newLang);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = isBengali ? 'জাতীয় পরিচয়পত্র অনুযায়ী আপনার পূর্ণ নাম লিখুন' : 'Full name is required as per NID';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = isBengali ? 'নাম ন্যূনতম ৩ অক্ষরের হতে হবে' : 'Name must be at least 3 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = isBengali ? 'সচল ইমেইল ঠিকানা প্রদান করুন' : 'Active email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = isBengali ? 'সঠিক ইমেইল ফরম্যাট লিখুন (যেমন: name@example.com)' : 'Please enter a valid email format';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = isBengali ? '১১ ডিজিটের মোবাইল নম্বর লিখুন' : '11-digit mobile number is required';
    } else if (!/^01[3-9]\d{8}$/.test(formData.phone.trim().replace(/-/g, ''))) {
      newErrors.phone = isBengali ? 'সঠিক বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)' : 'Provide a valid 11-digit BD mobile number';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = isBengali ? 'বর্তমান বা স্থায়ী ঠিকানা উল্লেখ করুন' : 'Residential address is required';
    } else if (formData.address.trim().length < 5) {
      newErrors.address = isBengali ? 'ঠিকানা ন্যূনতম ৫ অক্ষরের হতে হবে' : 'Address must be at least 5 characters';
    }
    
    if (!formData.password) {
      newErrors.password = isBengali ? 'পাসওয়ার্ড প্রদান করুন' : 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = isBengali ? 'পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে' : 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = isBengali ? 'পাসওয়ার্ড পুনরায় নিশ্চিত করুন' : 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = isBengali ? 'পাসওয়ার্ড দুটি মিলছে না' : 'Passwords do not match';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = isBengali ? 'সরকারি পেনশন নীতিমালার শর্তাবলীতে সম্মতি প্রদান আবশ্যক' : 'You must agree to the official pension rules & terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMsg('');
    setOtpError('');
    
    if (!validateForm()) return;
    
    try {
      const result = await register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        password: formData.password,
        userType: 'pension_holder'
      });

      if (result && result.requireOtp) {
        setOtpStep(true);
        setOtp('');
        setResendCooldown(60);
        setSuccessMsg(isBengali ? 'আপনার জিমেইল/ইমেইলে ৬-ডিজিটের ভেরিফিকেশন ওটিপি পাঠানো হয়েছে।' : 'A 6-digit verification OTP has been sent to your email.');
      } else {
        setSuccessMsg(isBengali ? 'নিবন্ধন সফল হয়েছে! ড্যাশবোর্ডে প্রবেশ করা হচ্ছে...' : 'Registration successful! Directing to dashboard...');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setServerError(error.message || (isBengali ? 'নিবন্ধন সম্পন্ন করা সম্ভব হয়নি। অনুগ্রহ করে তথ্য পুনঃযাচাই করুন।' : 'Registration failed. Please check your information.'));
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError('');

    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      setOtpError(isBengali ? 'অনুগ্রহ করে সঠিক ৬-ডিজিটের ওটিপি লিখুন' : 'Please enter a valid 6-digit OTP');
      return;
    }

    try {
      await verifyRegistrationOtp(formData.email.trim().toLowerCase(), cleanOtp);
      // AuthContext updates user state, App.jsx automatically directs to dashboard
    } catch (error) {
      console.error('Registration OTP verification failed:', error);
      setOtpError(error.message || (isBengali ? 'ওটিপি কোডটি সঠিক নয় অথবা মেয়াদোত্তীর্ণ হয়েছে।' : 'Invalid or expired OTP. Please try again.'));
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setOtpError('');
    try {
      await resendOtp(formData.email.trim().toLowerCase(), 'register');
      setResendCooldown(60);
    } catch (error) {
      console.error('Resend OTP failed:', error);
      setOtpError(error.message || (isBengali ? 'ওটিপি পুনরায় পাঠানো সম্ভব হয়নি।' : 'Failed to resend OTP.'));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Government Bar */}
      <div className="border-b border-stone-200 dark:border-stone-800 bg-[#FAF8F3] dark:bg-stone-950 py-1.5 px-4 sm:px-8 text-xs text-stone-700 dark:text-stone-300">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#0B5D3B]"></span>
            <span className="font-medium tracking-wide">
              {isBengali ? 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার | অর্থ বিভাগ' : "Government of the People's Republic of Bangladesh | Finance Division"}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline text-stone-600 dark:text-stone-400 font-mono text-[11px]">
              {isBengali ? 'হেল্পলাইন: ১৬১২২ / ৩৩৩' : 'Helpline: 16122 / 333'}
            </span>
            <button
              onClick={toggleLanguage}
              className="px-2 py-0.5 border border-stone-300 dark:border-stone-700 rounded text-xs font-semibold hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
            >
              {isBengali ? 'English' : 'বাংলা'}
            </button>
            <button
              onClick={toggleTheme}
              className="p-1 rounded text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className={`flex-1 ${otpStep ? 'max-w-xl' : 'max-w-4xl'} w-full mx-auto px-4 py-8 sm:py-12 transition-all duration-200`}>
        {/* Navigation Back */}
        <div className="mb-6">
          {otpStep ? (
            <button
              type="button"
              onClick={() => {
                setOtpStep(false);
                setOtpError('');
              }}
              className="inline-flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400 hover:text-[#0B5D3B] dark:hover:text-emerald-400 transition-colors font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isBengali ? 'নিবন্ধন ফর্মে ফিরে যান (তথ্য সংশোধন)' : 'Back to Registration Form'}</span>
            </button>
          ) : (
            <Link 
              to="/" 
              className="inline-flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400 hover:text-[#0B5D3B] dark:hover:text-emerald-400 transition-colors font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isBengali ? 'মূল পাতায় ফিরে যান' : 'Back to Home'}</span>
            </Link>
          )}
        </div>

        {/* Paper Container */}
        <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-[4px] shadow-sm overflow-hidden">
          
          {/* Header Banner */}
          <div className="border-b border-stone-200 dark:border-stone-800 p-6 sm:p-8 bg-[#FCFBF8] dark:bg-stone-900/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full border border-[#0B5D3B] bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center shrink-0">
                  <div className="w-6 h-6 rounded-full bg-[#C8102E] flex items-center justify-center text-[10px] text-white font-bold">
                    BD
                  </div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-stone-500 dark:text-stone-400 font-semibold font-mono">
                    {otpStep 
                      ? (isBengali ? 'ধাপ ২/২: ইমেইল ওটিপি ভেরিফিকেশন' : 'STEP 2/2: EMAIL OTP VERIFICATION') 
                      : (isBengali ? 'ফরম নং ২.১ (ক) — নাগরিক একাউন্ট' : 'Official Citizen Account — Form 2.1 (A)')}
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#0B5D3B] dark:text-emerald-400">
                    {otpStep 
                      ? (isBengali ? 'ইমেইল ভেরিফিকেশন সম্পন্ন করুন' : 'Verify Your Email Address')
                      : (isBengali ? 'পেনশনভোগী নাগরিক নিবন্ধন' : 'Pensioner Citizen Registration')}
                  </h1>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
                    {otpStep 
                      ? (isBengali ? 'আপনার জিমেইল/ইমেইলে প্রেরিত ৬-ডিজিটের নিরাপত্তা কোডটি প্রদান করুন।' : 'Enter the 6-digit verification code dispatched to your Gmail.')
                      : (isBengali 
                        ? 'অবসরপ্রাপ্ত কর্মকর্তা ও কর্মচারীদের অনলাইনে পেনশন সুবিধা গ্রহণের জন্য সুরক্ষিত প্রোফাইল তৈরি করুন।' 
                        : 'Create an official secure profile for processing retirement benefits and direct EFT disbursements.')}
                  </p>
                </div>
              </div>
              <div className="hidden sm:block text-right">
                <div className="inline-block px-2.5 py-1 text-[11px] font-mono border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-[3px]">
                  CGA-PORTAL-v4
                </div>
              </div>
            </div>
          </div>

          {/* If in OTP Step */}
          {otpStep ? (
            <form onSubmit={handleVerifyOtp} className="p-6 sm:p-8 space-y-5">
              
              {/* Sent-to Email Banner */}
              <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-[4px] text-xs text-stone-700 dark:text-stone-300 flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#0B5D3B] dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">
                  <div>
                    {isBengali ? 'একটি ওটিপি ভেরিফিকেশন কোড পাঠানো হয়েছে:' : 'A verification OTP has been sent to:'}{' '}
                    <strong className="font-mono text-[#0B5D3B] dark:text-emerald-400">{formData.email}</strong>
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                    {isBengali 
                      ? 'জিমেইলে ইনবক্স না পেলে দয়া করে স্প্যাম (Spam) বা অল মেল (All Mail) ফোল্ডারও চেক করুন।' 
                      : 'If not in your inbox, please check your Spam or Promotions folder.'}
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {otpError && (
                <div 
                  aria-live="polite"
                  className="p-3 border-l-4 border-[#C8102E] bg-red-50 dark:bg-red-950/30 text-xs text-red-800 dark:text-red-300 flex items-start space-x-2 rounded-[2px]"
                >
                  <AlertCircle className="w-4 h-4 text-[#C8102E] shrink-0 mt-0.5" />
                  <span className="leading-snug">{otpError}</span>
                </div>
              )}

              {/* OTP Input Field */}
              <div>
                <label 
                  htmlFor="register-otp" 
                  className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2 text-center"
                >
                  {isBengali ? '৬-ডিজিটের ওটিপি কোড (Enter 6-Digit Code) *' : 'Enter 6-Digit OTP Code *'}
                </label>
                <div className="max-w-xs mx-auto">
                  <input
                    id="register-otp"
                    name="register-otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    autoFocus
                    required
                    value={otp}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setOtp(val);
                      if (otpError) setOtpError('');
                    }}
                    placeholder="••••••"
                    className="w-full text-center tracking-[0.5em] text-2xl font-mono py-3 font-bold bg-[#FAF8F3] dark:bg-stone-800 text-[#0B5D3B] dark:text-emerald-400 border border-stone-300 dark:border-stone-700 rounded-[4px] placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0B5D3B] focus:border-[#0B5D3B]"
                  />
                </div>
                <p className="text-center text-[11px] text-stone-500 dark:text-stone-400 mt-1.5">
                  {isBengali ? 'কোডটির মেয়াদ ১০ মিনিট থাকবে' : 'Code is valid for 10 minutes'}
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-2.5 px-4 bg-[#0B5D3B] hover:bg-[#074229] active:bg-[#05301e] text-white font-medium text-sm rounded-[4px] transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-[#0B5D3B] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>{isBengali ? 'যাচাই করা হচ্ছে...' : 'Verifying Code...'}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isBengali ? 'ভেরিফাই ও অ্যাকাউন্ট সক্রিয় করুন' : 'Verify & Activate Account'}</span>
                  </>
                )}
              </button>

              {/* Resend and Edit Info Options */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || isResending}
                  className="inline-flex items-center gap-1.5 font-medium text-[#0B5D3B] dark:text-emerald-400 hover:underline disabled:text-stone-400 disabled:no-underline disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                  <span>
                    {resendCooldown > 0 
                      ? (isBengali ? `পুনরায় পাঠান (${resendCooldown} সে.)` : `Resend in (${resendCooldown}s)`)
                      : (isBengali ? 'কোড পাননি? পুনরায় পাঠান' : "Didn't receive code? Resend")}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOtpStep(false);
                    setOtpError('');
                  }}
                  className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 underline"
                >
                  {isBengali ? 'তথ্য সংশোধন / ব্যাক করুন' : 'Edit Registration Info'}
                </button>
              </div>

            </form>
          ) : (
            /* Regular Registration Form Body */
            <form onSubmit={handleSubmit} className="p-6 sm:p-8">
              {serverError && (
                <div className="mb-6 p-3.5 bg-red-50 dark:bg-red-950/30 border-l-4 border-[#C8102E] text-xs sm:text-sm text-red-800 dark:text-red-300 flex items-start gap-2.5 rounded-[3px]">
                  <AlertCircle className="w-4 h-4 text-[#C8102E] shrink-0 mt-0.5" />
                  <span>{serverError}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-6 p-3.5 bg-emerald-50 dark:bg-emerald-950/30 border-l-4 border-[#0B5D3B] text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5 rounded-[3px]">
                  <CheckCircle2 className="w-4 h-4 text-[#0B5D3B] shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                    {isBengali ? 'সম্পূর্ণ নাম (জাতীয় পরিচয়পত্র অনুযায়ী) *' : 'Full Name (as per National ID) *'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={isBengali ? 'উদা: মো: রফিকুল ইসলাম' : 'e.g. Md. Rafiqul Islam'}
                      className={`w-full pl-9 pr-3 py-2.5 text-sm bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border ${
                        errors.name ? 'border-red-500' : 'border-stone-300 dark:border-stone-700'
                      } rounded-[4px] focus:outline-none focus:ring-1 focus:ring-[#0B5D3B] focus:border-[#0B5D3B]`}
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-xs text-[#C8102E]">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                    {isBengali ? 'সচল জিমেইল / ইমেইল ঠিকানা *' : 'Active Gmail / Email Address *'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@gmail.com"
                      className={`w-full pl-9 pr-3 py-2.5 text-sm bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border ${
                        errors.email ? 'border-red-500' : 'border-stone-300 dark:border-stone-700'
                      } rounded-[4px] focus:outline-none focus:ring-1 focus:ring-[#0B5D3B] focus:border-[#0B5D3B]`}
                    />
                  </div>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 block">
                    {isBengali ? 'এই ঠিকানায় ৬-ডিজিটের ভেরিফিকেশন ওটিপি পাঠানো হবে' : 'A 6-digit verification OTP will be sent here'}
                  </span>
                  {errors.email && <p className="mt-1 text-xs text-[#C8102E]">{errors.email}</p>}
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                    {isBengali ? 'মোবাইল নম্বর (১১ ডিজিট) *' : 'Mobile Number (11-digits) *'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="017XXXXXXXX"
                      maxLength={14}
                      className={`w-full pl-9 pr-3 py-2.5 text-sm bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border ${
                        errors.phone ? 'border-red-500' : 'border-stone-300 dark:border-stone-700'
                      } rounded-[4px] focus:outline-none focus:ring-1 focus:ring-[#0B5D3B] focus:border-[#0B5D3B]`}
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-xs text-[#C8102E]">{errors.phone}</p>}
                </div>

                {/* Residential Address */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                    {isBengali ? 'বর্তমান / স্থায়ী ঠিকানা (ন্যূনতম ৫ অক্ষর) *' : 'Present / Permanent Address *'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 pt-2.5 pointer-events-none text-stone-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <textarea
                      name="address"
                      rows={2}
                      value={formData.address}
                      onChange={handleChange}
                      placeholder={isBengali ? 'গ্রাম/সড়ক, ডাকঘর, উপজেলা, জেলা' : 'Village/Road, Post Office, Upazila, District'}
                      className={`w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border ${
                        errors.address ? 'border-red-500' : 'border-stone-300 dark:border-stone-700'
                      } rounded-[4px] focus:outline-none focus:ring-1 focus:ring-[#0B5D3B] focus:border-[#0B5D3B]`}
                    />
                  </div>
                  {errors.address && <p className="mt-1 text-xs text-[#C8102E]">{errors.address}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                    {isBengali ? 'নতুন পাসওয়ার্ড (ন্যূনতম ৬ অক্ষর) *' : 'Password (min. 6 characters) *'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full pl-9 pr-10 py-2.5 text-sm bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border ${
                        errors.password ? 'border-red-500' : 'border-stone-300 dark:border-stone-700'
                      } rounded-[4px] focus:outline-none focus:ring-1 focus:ring-[#0B5D3B] focus:border-[#0B5D3B]`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-[#C8102E]">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                    {isBengali ? 'পাসওয়ার্ড নিশ্চিত করুন *' : 'Confirm Password *'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full pl-9 pr-10 py-2.5 text-sm bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border ${
                        errors.confirmPassword ? 'border-red-500' : 'border-stone-300 dark:border-stone-700'
                      } rounded-[4px] focus:outline-none focus:ring-1 focus:ring-[#0B5D3B] focus:border-[#0B5D3B]`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-xs text-[#C8102E]">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="mt-0.5 h-4 w-4 rounded border-stone-300 text-[#0B5D3B] focus:ring-[#0B5D3B]"
                  />
                  <span className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    {isBengali 
                      ? 'আমি ঘোষণা করছি যে প্রদত্ত তথ্যাবলী সম্পূর্ণ সঠিক এবং আমি বাংলাদেশ সরকারি কর্মচারী (পেনশন ও আনুতোষিক) বিধিমালা ও ডিজিটাল নিরাপত্তা নীতিমালার সকল শর্ত মেনে নিতে সম্মত।'
                      : 'I declare that the information provided is accurate and I agree to comply with the Bangladesh Government Servant (Pension & Gratuity) Rules and IT Security Policies.'}
                  </span>
                </label>
                {errors.agreeTerms && <p className="mt-1 text-xs text-[#C8102E]">{errors.agreeTerms}</p>}
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-stone-600 dark:text-stone-400">
                  {isBengali ? 'ইতিমধ্যে অ্যাকাউন্ট রয়েছে?' : 'Already have an official account?'}{' '}
                  <Link 
                    to="/pension/login" 
                    className="text-[#0B5D3B] dark:text-emerald-400 font-semibold hover:underline"
                  >
                    {isBengali ? 'এখানে সাইন-ইন করুন' : 'Sign in here'}
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-2.5 bg-[#0B5D3B] hover:bg-[#074229] text-white font-medium text-sm rounded-[4px] transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-[#0B5D3B] disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>{isBengali ? 'প্রক্রিয়াধীন...' : 'Processing...'}</span>
                    </>
                  ) : (
                    <span>{isBengali ? 'পরবর্তী (ওটিপি গ্রহণ করুন)' : 'Next (Receive OTP)'}</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Footer Assistance */}
          <div className="border-t border-stone-200 dark:border-stone-800 bg-[#FCFBF8] dark:bg-stone-900/50 p-4 px-6 text-xs text-stone-600 dark:text-stone-400 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-stone-500" />
              <span>{isBengali ? 'নিবন্ধন সংক্রান্ত যেকোনো সমস্যায় ১৬১২২ অথবা ৩৩৩ নম্বরে যোগাযোগ করুন।' : 'For registration assistance call 16122 or 333 (Toll Free).'}</span>
            </div>
            <div className="font-mono text-[11px] text-stone-500">
              EFT-READY SECURE SYSTEM
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
