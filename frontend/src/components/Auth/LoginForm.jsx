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
  ArrowLeft, 
  PhoneCall, 
  Sun, 
  Moon,
  AlertCircle,
  HelpCircle,
  X,
  Info,
  ShieldCheck,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

const LoginForm = ({ userType = 'pension_holder' }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { login, verifyLoginOtp, resendOtp, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isBengali = i18n.language === 'bn';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  
  // OTP Verification States (For Pension Holders)
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // Forgot Password Modal States
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

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

  // Dynamic Role Label based on userType prop
  const getRoleInfo = (type) => {
    switch (type) {
      case 'pension_holder':
        return {
          labelBn: 'পেনশনভোগী নাগরিক সাইন-ইন',
          labelEn: 'PENSION HOLDER LOGIN',
          subBn: 'অবসরপ্রাপ্ত কর্মকর্তা ও কর্মচারীদের অনলাইন সেবা পোর্টাল',
          subEn: 'Portal for Retired Officers & Staff'
        };
      case 'assistant_accountant':
        return {
          labelBn: 'সহকারী হিসাবরক্ষক সাইন-ইন',
          labelEn: 'ASSISTANT ACCOUNTANT LOGIN',
          subBn: 'হিসাব নিরীক্ষা ও প্রাথমিক যাচাই ডেস্ক',
          subEn: 'Audit Verification & Scrutiny Desk'
        };
      case 'head_office':
        return {
          labelBn: 'প্রধান কার্যালয় সাইন-ইন',
          labelEn: 'HEAD OF OFFICE LOGIN',
          subBn: 'চূড়ান্ত পেনশন মঞ্জুরি ও প্রশাসন',
          subEn: 'Sanction Authority & Executive Office'
        };
      case 'admin':
        return {
          labelBn: 'প্রশাসনিক কর্মকর্তা সাইন-ইন',
          labelEn: 'ADMINISTRATIVE PORTAL LOGIN',
          subBn: 'সিজিএ নিরীক্ষা ও প্রশাসনিক ডেস্ক',
          subEn: 'Official Audit & Administrative Desk'
        };
      default:
        return {
          labelBn: 'অফিসিয়াল পোর্টাল সাইন-ইন',
          labelEn: 'OFFICIAL PORTAL LOGIN',
          subBn: 'জাতীয় পেনশন ও অবসর সুবিধা ব্যবস্থাপনা',
          subEn: 'National Pension & Retirement Portal'
        };
    }
  };

  const roleInfo = getRoleInfo(userType);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = isBengali ? 'সচল ইমেইল ঠিকানা প্রদান করুন' : 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = isBengali ? 'সঠিক ইমেইল ফরম্যাট প্রদান করুন' : 'Please provide a valid email format';
    }
    
    if (!formData.password) {
      newErrors.password = isBengali ? 'পাসওয়ার্ড প্রদান করুন' : 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setOtpError('');
    
    if (!validateForm()) return;
    
    try {
      const result = await login(formData.email.trim().toLowerCase(), formData.password, userType);
      // If pension holder, server returns requireOtp: true
      if (result && result.requireOtp) {
        setOtpStep(true);
        setOtp('');
        setResendCooldown(60);
      }
    } catch (error) {
      console.error('Login failed:', error);
      setServerError(error.message || (isBengali ? 'লগইন ব্যর্থ হয়েছে। ইমেইল ও পাসওয়ার্ড পুনঃযাচাই করুন।' : 'Login failed. Please verify your credentials.'));
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
      await verifyLoginOtp(formData.email.trim().toLowerCase(), cleanOtp);
      // On success, AuthContext updates user state and App auto-redirects to dashboard
    } catch (error) {
      console.error('OTP Verification failed:', error);
      setOtpError(error.message || (isBengali ? 'ওটিপি কোডটি সঠিক নয় অথবা মেয়াদোত্তীর্ণ হয়েছে।' : 'Invalid or expired OTP. Please try again.'));
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setOtpError('');
    try {
      await resendOtp(formData.email.trim().toLowerCase(), 'login');
      setResendCooldown(60);
    } catch (error) {
      console.error('Resend OTP failed:', error);
      setOtpError(error.message || (isBengali ? 'ওটিপি পুনরায় পাঠানো সম্ভব হয়নি।' : 'Failed to resend OTP.'));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] dark:bg-stone-950 text-[#1A1A1A] dark:text-stone-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Government Banner Strip */}
      <div className="border-b border-stone-200 dark:border-stone-800 bg-[#FAF8F3] dark:bg-stone-950 py-1.5 px-4 sm:px-8 text-xs text-stone-700 dark:text-stone-300">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#0B5D3B]"></span>
            <span className="font-medium tracking-wide">
              {isBengali ? 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার | অর্থ বিভাগ' : "Government of the People's Republic of Bangladesh | Finance Division"}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 text-stone-700 dark:text-stone-300 font-mono text-[11px]">
              <PhoneCall className="w-3.5 h-3.5 text-[#0B5D3B] dark:text-emerald-400" />
              <span>{isBengali ? 'হেল্পলাইন: ১৬১২২ / ৩৩৩' : 'Helpline: 16122 / 333'}</span>
            </div>
            
            <button
              onClick={toggleLanguage}
              className="px-2 py-0.5 border border-stone-300 dark:border-stone-700 rounded-[3px] text-xs font-semibold hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
            >
              {isBengali ? 'English' : 'বাংলা'}
            </button>

            <button
              onClick={toggleTheme}
              className="p-1 rounded text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white"
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center">
        
        {/* Navigation Back */}
        <div className="mb-4">
          {otpStep ? (
            <button
              type="button"
              onClick={() => {
                setOtpStep(false);
                setOtpError('');
              }}
              className="inline-flex items-center space-x-1.5 text-xs text-stone-600 dark:text-stone-400 hover:text-[#0B5D3B] dark:hover:text-emerald-400 transition-colors font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isBengali ? 'লগইন ফর্মে ফিরে যান (Back to Login)' : 'Back to Login Form'}</span>
            </button>
          ) : (
            <Link 
              to="/" 
              className="inline-flex items-center space-x-1.5 text-xs text-stone-600 dark:text-stone-400 hover:text-[#0B5D3B] dark:hover:text-emerald-400 transition-colors font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isBengali ? 'মূল পাতায় ফিরে যান' : 'Back to Home'}</span>
            </Link>
          )}
        </div>

        {/* Paper Container Card */}
        <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-[4px] shadow-sm overflow-hidden">
          
          {/* Header Banner */}
          <div className="border-b border-stone-200 dark:border-stone-800 p-6 sm:p-7 bg-[#FCFBF8] dark:bg-stone-900/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full border border-[#0B5D3B] bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center shrink-0">
                <div className="w-6 h-6 rounded-full bg-[#C8102E] flex items-center justify-center text-[10px] text-white font-bold">
                  BD
                </div>
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-mono uppercase tracking-widest text-[#0B5D3B] dark:text-emerald-400 font-bold">
                  {otpStep 
                    ? (isBengali ? 'পেনশনভোগী ওটিপি ভেরিফিকেশন' : 'PENSIONER OTP VERIFICATION') 
                    : (isBengali ? roleInfo.labelBn : roleInfo.labelEn)}
                </div>
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                  {otpStep 
                    ? (isBengali ? '৬-ডিজিটের নিরাপত্তা কোড প্রদান করুন' : 'Enter 6-Digit Verification Code') 
                    : (isBengali ? 'আপনার অ্যাকাউন্টে প্রবেশ করুন' : 'Login to your account')}
                </h1>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                  {otpStep 
                    ? (isBengali ? 'আপনার জিমেইল/ইমেইলে পাঠানো ওটিপি কোডটি নিচে লিখুন।' : 'Please enter the verification OTP sent to your Gmail/email.') 
                    : (isBengali ? roleInfo.subBn : roleInfo.subEn)}
                </p>
              </div>
            </div>
          </div>

          {/* If in OTP Verification Mode for Pension Holder */}
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

              {/* Inline OTP Error */}
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
                  htmlFor="otp" 
                  className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2 text-center"
                >
                  {isBengali ? '৬-ডিজিটের ওটিপি কোড (Enter 6-Digit Code) *' : 'Enter 6-Digit OTP Code *'}
                </label>
                <div className="max-w-xs mx-auto">
                  <input
                    id="otp"
                    name="otp"
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
                    <span>{isBengali ? 'ভেরিফাই ও প্রবেশ করুন' : 'Verify & Sign In'}</span>
                  </>
                )}
              </button>

              {/* Resend and Switch Email Options */}
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
                  {isBengali ? 'ইমেইল পরিবর্তন করুন' : 'Change Email'}
                </button>
              </div>

            </form>
          ) : (
            /* Regular Credentials Form Body */
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
              
              {/* Inline Error Message Area */}
              {serverError && (
                <div 
                  aria-live="polite"
                  className="p-3 border-l-4 border-[#C8102E] bg-red-50 dark:bg-red-950/30 text-xs text-red-800 dark:text-red-300 flex items-start space-x-2 rounded-[2px]"
                >
                  <AlertCircle className="w-4 h-4 text-[#C8102E] shrink-0 mt-0.5" />
                  <span className="leading-snug">{serverError}</span>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5"
                >
                  {isBengali ? 'ইমেইল (Email) *' : 'Email *'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className={`w-full pl-9 pr-3 py-2.5 text-sm bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 border ${
                      errors.email ? 'border-[#C8102E]' : 'border-stone-300 dark:border-stone-700'
                    } rounded-[4px] placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#0B5D3B] focus:border-[#0B5D3B]`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-[#C8102E] font-medium">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5"
                >
                  {isBengali ? 'পাসওয়ার্ড (Password) *' : 'Password *'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-9 pr-10 py-2.5 text-sm bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 border ${
                      errors.password ? 'border-[#C8102E]' : 'border-stone-300 dark:border-stone-700'
                    } rounded-[4px] placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#0B5D3B] focus:border-[#0B5D3B]`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? (isBengali ? 'পাসওয়ার্ড লুকান' : 'Hide password') : (isBengali ? 'পাসওয়ার্ড দেখুন' : 'Show password')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-[#C8102E] font-medium">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password Row */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 rounded-[2px] border-stone-300 text-[#0B5D3B] focus:ring-[#0B5D3B]"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-xs text-stone-700 dark:text-stone-300">
                    {isBengali ? 'স্মরণ রাখুন' : 'Remember me'}
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-semibold text-[#0B5D3B] dark:text-emerald-400 hover:underline"
                >
                  {isBengali ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#0B5D3B] hover:bg-[#074229] active:bg-[#05301e] text-white font-medium text-sm rounded-[4px] transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-[#0B5D3B] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-2"
              >
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>{isBengali ? 'যাচাই করা হচ্ছে...' : 'Verifying...'}</span>
                  </>
                ) : (
                  <span>
                    {userType === 'pension_holder'
                      ? (isBengali ? 'পরবর্তী (ওটিপি গ্রহণ করুন)' : 'Next (Receive OTP)')
                      : (isBengali ? 'সাইন-ইন করুন' : 'Login')}
                  </span>
                )}
              </button>

              {/* Registration Link (Only for pension holder login view) */}
              {userType === 'pension_holder' && (
                <div className="mt-5 pt-4 border-t border-stone-200 dark:border-stone-800 text-center text-xs text-stone-600 dark:text-stone-400">
                  <span>{isBengali ? 'এখনো কোনো অ্যাকাউন্ট নেই?' : "Don't have an account?"}</span>{' '}
                  <Link 
                    to="/pension/register" 
                    className="font-semibold text-[#0B5D3B] dark:text-emerald-400 hover:underline ml-1"
                  >
                    {isBengali ? 'নতুন নিবন্ধন করুন' : 'Register here'}
                  </Link>
                </div>
              )}

            </form>
          )}

          {/* Footer Assistance */}
          <div className="border-t border-stone-200 dark:border-stone-800 bg-[#FCFBF8] dark:bg-stone-900/50 p-4 px-6 text-xs text-stone-600 dark:text-stone-400 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-stone-500" />
              <span>{isBengali ? 'জরুরি সহায়তায় হেল্পলাইন ১৬১২২ বা ৩৩৩' : 'Helpline: 16122 or 333 (Toll-Free)'}</span>
            </div>
            <div className="font-mono text-[11px] text-stone-500">
              256-BIT SSL SECURED
            </div>
          </div>

        </div>

      </div>

      {/* Forgot Password Modal Dialog */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 rounded-[4px] max-w-md w-full p-6 shadow-xl border border-stone-300 dark:border-stone-800 space-y-4">
            
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <h3 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100">
                {isBengali ? 'পাসওয়ার্ড পুনরুদ্ধার সহায়তা' : 'Password Recovery Assistance'}
              </h3>
              <button 
                onClick={() => { setShowForgotModal(false); setForgotSubmitted(false); }}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {forgotSubmitted ? (
              <div className="py-4 text-center space-y-2">
                <div className="text-sm font-semibold text-[#0B5D3B] dark:text-emerald-400">
                  {isBengali ? 'পাসওয়ার্ড রিসেট নির্দেশিকা প্রেরণ করা হয়েছে' : 'Password reset instructions sent'}
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  {isBengali 
                    ? 'আপনার নিবন্ধিত ইমেইলে পাসওয়ার্ড রিসেট লিংক বা সাময়িক ওটিপি পাঠানো হয়েছে।' 
                    : 'Please check your registered government email for the password reset instructions.'}
                </p>
                <button
                  type="button"
                  onClick={() => { setShowForgotModal(false); setForgotSubmitted(false); }}
                  className="mt-3 px-4 py-1.5 bg-[#0B5D3B] text-white rounded-[3px] text-xs font-semibold"
                >
                  {isBengali ? 'ঠিক আছে' : 'OK'}
                </button>
              </div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (forgotEmail.trim()) setForgotSubmitted(true);
                }}
                className="space-y-3 text-xs"
              >
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                  {isBengali 
                    ? 'আপনার নিবন্ধিত ইমেইল ঠিকানা লিখুন। পাসওয়ার্ড পরিবর্তনের লিংক ও হেল্পডেস্ক নির্দেশিকা পাঠানো হবে।' 
                    : 'Enter your registered email address. Password reset instructions will be dispatched to your inbox.'}
                </p>

                <div>
                  <label className="font-semibold block mb-1 uppercase tracking-wider text-[11px] text-stone-700 dark:text-stone-300">
                    {isBengali ? 'নিবন্ধিত ইমেইল *' : 'Registered Email *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 rounded-[3px] border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                  />
                </div>

                <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-[2px] border border-stone-200 dark:border-stone-700 flex items-start space-x-2">
                  <HelpCircle className="w-4 h-4 text-[#0B5D3B] shrink-0 mt-0.5" />
                  <span className="text-[11px] text-stone-600 dark:text-stone-400">
                    {isBengali ? 'জরুরি সহায়তায় সরাসরি হেল্পলাইন ১৬১২২ অথবা ৩৩৩ নম্বরে যোগাযোগ করুন।' : 'For immediate assistance, dial government helpline 16122 or 333.'}
                  </span>
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t border-stone-200 dark:border-stone-800">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3.5 py-1.5 rounded-[3px] border border-stone-300 text-xs font-semibold text-stone-700"
                  >
                    {isBengali ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-[3px] bg-[#0B5D3B] hover:bg-[#074229] text-white text-xs font-semibold"
                  >
                    {isBengali ? 'রিসেট লিংক পাঠান' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default LoginForm;
