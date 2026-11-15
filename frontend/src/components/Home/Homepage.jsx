import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  ShieldCheck, 
  ArrowRight, 
  PhoneCall, 
  Mail, 
  MapPin, 
  Clock, 
  Download, 
  Sun, 
  Moon,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Send,
  Building,
  FileText
} from 'lucide-react';

const Homepage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const isBengali = i18n.language === 'bn';

  // Application Tracking State
  const [trackingNumber, setTrackingNumber] = useState('');

  // Interactive Live Pension Calculator State (Default 45,000 BDT, 25 years)
  const [calcSalary, setCalcSalary] = useState('45000');
  const [calcYears, setCalcYears] = useState('25');

  // Helpdesk Contact Form State
  const [helpForm, setHelpForm] = useState({
    name: '',
    contact: '',
    trackingId: '',
    subject: '',
    message: ''
  });
  const [helpSubmitted, setHelpSubmitted] = useState(false);

  const toggleLanguage = () => {
    const newLang = isBengali ? 'en' : 'bn';
    i18n.changeLanguage(newLang);
  };

  // Bangladesh Government Pension Formula Calculations:
  // 1. Gross Monthly Pension = 50% of last basic pay
  // 2. Commutation/Surrender = 50% mandatory for one-time gratuity
  // 3. Net Monthly Pension Drawn = (Last Basic * 0.5 * 0.5) = 25% of Basic
  // 4. Fixed Monthly Medical Allowance = 1,500 BDT
  // 5. Total Net Monthly Benefit = Net Pension Drawn + 1,500 BDT
  // 6. Lump-sum Gratuity = (Monthly Pension Surrendered) * Gratuity Rate (for 25 years: 230 BDT per Taka)
  const salaryNum = Math.max(0, parseFloat(calcSalary) || 0);
  const yearsNum = Math.min(35, Math.max(0, parseFloat(calcYears) || 0));

  const grossMonthlyPension = Math.round(salaryNum * 0.5);
  const surrenderedPension = Math.round(grossMonthlyPension * 0.5);
  const netMonthlyPensionDrawn = grossMonthlyPension - surrenderedPension;
  const medicalAllowance = 1500;
  const totalMonthlyEft = netMonthlyPensionDrawn + medicalAllowance;

  // Rate table simplified for years >= 25 is 230, scaled smoothly for lower service
  const gratuityRate = yearsNum >= 25 ? 230 : yearsNum >= 20 ? 215 : yearsNum >= 15 ? 195 : 180;
  const totalGratuityLumpSum = Math.round(surrenderedPension * gratuityRate);

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;
    navigate(`/pension/login?track=${encodeURIComponent(trackingNumber.trim())}`);
  };

  const handleHelpSubmit = (e) => {
    e.preventDefault();
    if (!helpForm.name || !helpForm.contact) return;
    setHelpSubmitted(true);
    setTimeout(() => {
      setHelpForm({ name: '', contact: '', trackingId: '', subject: '', message: '' });
      setHelpSubmitted(false);
    }, 4500);
  };

  const services = [
    {
      num: '01',
      titleBn: 'অনলাইন পেনশন আবেদন (ফরম ২.১)',
      titleEn: 'Online Pension Application (Form 2.1)',
      descBn: 'অবসর প্রস্তুতিকালীন ছুটি (PRL) বা চূড়ান্ত অবসরের প্রাক্কালে ফরম নং ২.১ পূরণ করে ঘরে বসেই অনলাইন পেনশন ও আনুতোষিকের আবেদন দাখিল করুন। কোনো শারীরিক উপস্থিতি ছাড়াই সেবা বই ও এনআইডি সরাসরি আপলোডযোগ্য।',
      descEn: 'Submit your formal Form 2.1 retirement benefits application digitally from anywhere. Direct upload of your Service Book and NID with automated basic salary validation.',
      linkTextBn: 'আবেদন শুরু করুন',
      linkTextEn: 'Begin Application',
      link: '/pension/register'
    },
    {
      num: '02',
      titleBn: 'আবেদন ট্র্যাকিং ও নিরবচ্ছিন্ন নিরীক্ষা ইতিহাস',
      titleEn: 'Multi-tier Application Tracking & Audit History',
      descBn: 'আবেদন দাখিলের পর হিসাবরক্ষণ কর্মকর্তার নিরীক্ষা, প্রধান কার্যালয়ের মঞ্জুরি এবং বাংলাদেশ ব্যাংক ইএফটি প্রেরণ পর্যন্ত প্রতিটি পদক্ষেপের স্বচ্ছ ও সময়ানুবর্তী স্থিতি পর্যবেক্ষণ করুন।',
      descEn: 'Full visibility from initial Accounts Officer audit scrutiny to Head Office sanction and final Bangladesh Bank EFT batch disbursement with precise date-stamped logs.',
      linkTextBn: 'ট্র্যাকিং ড্যাশবোর্ড',
      linkTextEn: 'Tracking Dashboard',
      link: '/pension/login'
    },
    {
      num: '03',
      titleBn: 'অভিযোগ প্রতিকার ব্যবস্থা ও জবাবদিহিতা (GRS)',
      titleEn: 'Grievance Redress System & Administrative Accountability',
      descBn: 'পেনশন ফাইল প্রক্রিয়াকরণে অযথা বিলম্ব বা অসঙ্গতির ক্ষেত্রে সরাসরি অভিযোগ দাখিল করুন। অভিযোগের সাথে যুক্ত থাকে প্রশাসনিক লাল পতাকা (Red Flag) সতর্কতা ও জবাবদিহিতা ব্যবস্থা।',
      descEn: 'Direct citizen grievance redress channel with an automated Red Flag penalty system for audit delays, ensuring officer accountability and guaranteed resolution.',
      linkTextBn: 'অভিযোগ দাখিল করুন',
      linkTextEn: 'Submit Grievance',
      link: '/pension/login'
    },
    {
      num: '04',
      titleBn: 'ডিজিটাল পেনশন পেমেন্ট অর্ডার (PPO) ও নথিপত্র লকার',
      titleEn: 'Electronic Pension Payment Order (e-PPO) Locker',
      descBn: 'অনুমোদিত পেনশন পেমেন্ট অর্ডার (PPO), সার্ভিস ভেরিফিকেশন সনদ এবং বার্ষিক জীবনকাল প্রমাণীকরণ সংক্রান্ত নথিগুলো নিরাপদ ক্লাউড লকার থেকে আজীবন সংরক্ষণ ও ডাউনলোড করুন।',
      descEn: 'Download your digitally certified Pension Payment Order (PPO), life verification certificates, and deduction statements anytime with 256-bit encryption.',
      linkTextBn: 'নথিপত্র লকার',
      linkTextEn: 'Document Locker',
      link: '/pension/login'
    }
  ];

  const circulars = [
    {
      typeBn: 'স্মারক',
      typeEn: 'Memo',
      dateBn: '০৫ নভেম্বর ২০২৬',
      dateEn: '05 Nov 2026',
      titleBn: 'সকল বেসামরিক অবসরপ্রাপ্ত কর্মচারীদের বার্ষিক জীবনকাল প্রমাণীকরণ (Digital Life Verification) ও ইএফটি সক্রিয়করণ নির্দেশিকা।',
      titleEn: 'Directive regarding Annual Digital Life Verification and EFT bank account synchronization for civilian pensioners.',
      code: '০৭.০০.০০০০.০৮১.২২.০০১.২৬-৫৪৩'
    },
    {
      typeBn: 'পরিপত্র',
      typeEn: 'Circular',
      dateBn: '২৮ অক্টোবর ২০২৬',
      dateEn: '28 Oct 2026',
      titleBn: 'বাংলাদেশ সরকারি কর্মচারী (পেনশন ও আনুতোষিক) বিধিমালা অনুসারে অনলাইন আবেদন ফরম ২.১ বাধ্যতামূলক ব্যবহার সংক্রান্ত প্রজ্ঞাপন।',
      titleEn: 'Mandatory adoption of unified online Form 2.1 for all civilian retirement and family pension claims.',
      code: '০৭.০০.০০০০.০৮২.১২.০০৪.২৬-২১০'
    },
    {
      typeBn: 'বিজ্ঞপ্তি',
      typeEn: 'Gazette',
      dateBn: '১৫ অক্টোবর ২০২৬',
      dateEn: '15 Oct 2026',
      titleBn: 'মাসিক নিট পেনশনের সাথে চিকিৎসা ভাতা (১৫০০ টাকা) এবং উৎসব ভাতার স্বয়ংক্রিয় হিসাবরক্ষণ পদ্ধতি প্রয়োগ।',
      titleEn: 'Automated treasury disbursement protocol for monthly medical allowances and festival grants via EFT.',
      code: '০৭.০০.০০০০.০৮১.১৮.০০২.২৬-১৮৯'
    },
    {
      typeBn: 'নির্দেশিকা',
      typeEn: 'Guideline',
      dateBn: '০২ অক্টোবর ২০২৬',
      dateEn: '02 Oct 2026',
      titleBn: 'পেনশনভোগীদের অভিযোগ নিষ্পত্তি ও কর্মকর্তা পর্যায়ে লাল পতাকা (Red Flag) নীতিমালার স্ট্যান্ডার্ড অপারেটিং প্রসিডিউর (SOP)।',
      titleEn: 'Standard Operating Procedure (SOP) for Grievance Redressal and administrative officer accountability metrics.',
      code: '০৭.০০.০০০০.০৮৩.১৫.০০৩.২৬-০৭৭'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#1A1A1A] font-sans antialiased selection:bg-[#0B5D3B] selection:text-white transition-colors duration-200">
      
      {/* ========================================================= */}
      {/* SECTION 1: TOP GOVERNMENT STRIP                           */}
      {/* ========================================================= */}
      <div className="border-b border-stone-200 bg-[#FAF8F3] text-xs text-stone-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2 flex flex-wrap justify-between items-center gap-2">
          
          {/* Government Name Left */}
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#0B5D3B]"></span>
            <span className="font-medium tracking-wide">
              {isBengali 
                ? 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার | অর্থ বিভাগ, অর্থ মন্ত্রণালয়' 
                : "Government of the People's Republic of Bangladesh | Finance Division"}
            </span>
            <span className="hidden md:inline text-stone-400">|</span>
            <span className="hidden md:inline text-stone-500 font-serif italic">
              {isBengali ? 'হিসাব মহানিয়ন্ত্রকের কার্যালয় (CGA)' : 'Office of the Controller General of Accounts'}
            </span>
          </div>

          {/* Helpline and Controls Right */}
          <div className="flex items-center space-x-5">
            <div className="flex items-center space-x-1.5 text-stone-700">
              <PhoneCall className="w-3.5 h-3.5 text-[#0B5D3B]" />
              <span className="font-semibold tracking-wide">
                {isBengali ? 'হেল্পলাইন: ১৬১২২ / ৩৩৩' : 'Helpline: 16122 / 333'}
              </span>
            </div>

            <div className="flex items-center space-x-2 pl-3 border-l border-stone-300">
              <button
                onClick={toggleLanguage}
                className="px-2 py-0.5 border border-stone-400 rounded-[3px] text-xs font-semibold hover:bg-stone-200 transition-colors"
                title="Toggle Language"
              >
                {isBengali ? 'English' : 'বাংলা'}
              </button>
              
              <button
                onClick={toggleTheme}
                className="p-1 text-stone-600 hover:text-stone-900 transition-colors"
                title="Toggle Theme"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 2: HEADER / NAV                                   */}
      {/* ========================================================= */}
      <header className="border-b border-stone-300 bg-[#FAF8F3] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Portal Identity */}
          <Link to="/" className="flex items-center space-x-3.5 group">
            {/* Bangladesh Official Seal Motif */}
            <div className="w-11 h-11 rounded-full border-2 border-[#0B5D3B] bg-white flex items-center justify-center shrink-0">
              <div className="w-6 h-6 rounded-full bg-[#C8102E] flex items-center justify-center text-[10px] text-white font-bold tracking-tighter">
                BD
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-semibold">
                {isBengali ? 'অর্থ বিভাগ ও সিজিএ' : 'MINISTRY OF FINANCE & CGA'}
              </div>
              <h1 className="text-lg sm:text-xl font-bold font-serif text-[#0B5D3B] tracking-tight leading-snug">
                PensionProBD
              </h1>
              <div className="text-[11px] text-stone-600 hidden sm:block font-medium">
                {isBengali ? 'জাতীয় পেনশন ও অবসর সুবিধা ব্যবস্থাপনা পোর্টাল' : 'National Pension & Retirement Portal'}
              </div>
            </div>
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden lg:flex items-center space-x-8 text-xs font-semibold tracking-wide uppercase text-stone-700">
            <a href="#services" className="hover:text-[#0B5D3B] transition-colors">
              {isBengali ? 'নাগরিক সেবাসমূহ' : 'Services'}
            </a>
            <a href="#calculator" className="hover:text-[#0B5D3B] transition-colors">
              {isBengali ? 'পেনশন ক্যালকুলেটর' : 'Calculator'}
            </a>
            <a href="#notices" className="hover:text-[#0B5D3B] transition-colors">
              {isBengali ? 'পরিপত্র ও নোটিশ' : 'Notices & Circulars'}
            </a>
            <a href="#helpdesk" className="hover:text-[#0B5D3B] transition-colors">
              {isBengali ? 'হেল্পডেস্ক' : 'Helpdesk'}
            </a>
          </nav>

          {/* Plain "Login" and "Register" Buttons (Hard Requirement 1) */}
          <div className="flex items-center space-x-3">
            <Link
              to="/pension/login"
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-[#0B5D3B] border border-[#0B5D3B] rounded-[4px] hover:bg-[#0B5D3B] hover:text-white transition-colors"
            >
              {isBengali ? 'লগইন' : 'Login'}
            </Link>

            <Link
              to="/pension/register"
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#0B5D3B] hover:bg-[#074229] rounded-[4px] transition-colors shadow-none"
            >
              {isBengali ? 'নিবন্ধন' : 'Register'}
            </Link>
          </div>

        </div>
      </header>

      {/* ========================================================= */}
      {/* SECTION 3: HERO WITH TRACK APPLICATION STATUS             */}
      {/* ========================================================= */}
      <section className="border-b border-stone-300 py-12 sm:py-16 bg-[#FAF8F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column (7 Columns): Editorial Text & Actions */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Rubber Stamp Mark */}
              <div className="inline-block border border-stone-400 px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest text-stone-700 rounded-[2px] bg-stone-100">
                {isBengali ? '✦ গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের অফিসিয়াল সেবা পোর্টাল' : '✦ OFFICIAL BANGLADESH GOVERNMENT SERVICE PORTAL'}
              </div>

              {/* Large Serif Headline */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A1A1A] leading-[1.18] tracking-tight">
                {isBengali ? (
                  <>
                    সমন্বিত ডিজিটাল পেনশন ও{' '}
                    <span className="relative inline-block">
                      অবসর সুবিধা
                      {/* Subtle human hand-drawn style curved underline */}
                      <svg className="absolute -bottom-1.5 left-0 w-full h-2.5 text-[#C8102E]" viewBox="0 0 100 12" preserveAspectRatio="none">
                        <path d="M0,8 Q50,0 100,6" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      </svg>
                    </span>{' '}
                    ব্যবস্থাপনা পোর্টাল
                  </>
                ) : (
                  <>
                    Unified Digital Pension &{' '}
                    <span className="relative inline-block">
                      Retirement Benefits
                      {/* Subtle human hand-drawn style curved underline */}
                      <svg className="absolute -bottom-1.5 left-0 w-full h-2.5 text-[#C8102E]" viewBox="0 0 100 12" preserveAspectRatio="none">
                        <path d="M0,8 Q50,0 100,6" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      </svg>
                    </span>{' '}
                    Management Portal
                  </>
                )}
              </h2>

              <p className="text-sm sm:text-base text-stone-700 leading-relaxed max-w-2xl font-normal">
                {isBengali 
                  ? 'বেসামরিক অবসরপ্রাপ্ত সরকারি কর্মকর্তা ও কর্মচারীদের পেনশন মঞ্জুরি, হিসাব নিরীক্ষা এবং সরাসরি ব্যাংক হিসেবে ইলেকট্রনিক ফান্ড ট্রান্সফার (ইএফটি) নিশ্চিতকরণে অর্থ বিভাগের কেন্দ্রীয় প্ল্যাটফর্ম।'
                  : 'A centralized Bangladesh Government platform for civilian pension processing, automated audit scrutiny, executive sanction, and direct EFT disbursement to bank accounts.'}
              </p>

              {/* Two Squared Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  to="/pension/register"
                  className="px-6 py-3 bg-[#0B5D3B] hover:bg-[#074229] text-white text-sm font-semibold rounded-[4px] transition-colors flex items-center space-x-2"
                >
                  <span>{isBengali ? 'অনলাইন পেনশন আবেদন (ফরম ২.১)' : 'Apply for Pension (Form 2.1)'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/pension/login"
                  className="px-6 py-3 border border-stone-400 hover:border-stone-700 text-stone-800 text-sm font-semibold rounded-[4px] bg-white transition-colors"
                >
                  {isBengali ? 'ড্যাশবোর্ডে প্রবেশ করুন' : 'Login to Dashboard'}
                </Link>
              </div>

              {/* Subtle Human Trust Detail */}
              <div className="pt-4 flex items-center space-x-4 text-xs text-stone-500 border-t border-stone-200">
                <span className="font-mono">GAZETTE COMPLIANT: 2015/2026</span>
                <span>•</span>
                <span>{isBengali ? 'সর্বশেষ হালনাগাদ: ০৭ নভেম্বর ২০২৬' : 'Last Updated: 07 November 2026'}</span>
              </div>

            </div>

            {/* Right Column (5 Columns): Track Application Status Box */}
            <div className="lg:col-span-5">
              <div className="bg-white border-2 border-[#0B5D3B]/40 p-6 sm:p-7 rounded-[4px] shadow-sm">
                
                <div className="border-b border-stone-200 pb-3 mb-4">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#0B5D3B] font-bold">
                    {isBengali ? 'নাগরিক সেবা ডেস্ক' : 'CITIZEN INQUIRY'}
                  </div>
                  <h3 className="text-lg font-bold font-serif text-stone-900">
                    {isBengali ? 'আবেদনের বর্তমান অবস্থা যাচাই' : 'Track Application Status'}
                  </h3>
                  <p className="text-xs text-stone-600 mt-0.5">
                    {isBengali ? 'আপনার ট্র্যাকিং আইডি বা এনআইডি নম্বর লিখুন' : 'Enter your 10 or 17 digit Tracking ID or NID'}
                  </p>
                </div>

                <form onSubmit={handleTrackSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                      {isBengali ? 'ট্র্যাকিং নম্বর বা এনআইডি *' : 'Tracking Number / NID *'}
                    </label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder={isBengali ? 'উদা: APP2026000001 বা NID' : 'e.g. APP2026000001 or NID'}
                      className="w-full px-3.5 py-2.5 bg-white text-stone-900 border border-stone-300 rounded-[4px] text-sm focus:outline-none focus:ring-1 focus:ring-[#0B5D3B] focus:border-[#0B5D3B]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#0B5D3B] hover:bg-[#074229] text-white text-sm font-semibold rounded-[4px] transition-colors flex items-center justify-center space-x-2"
                  >
                    <Search className="w-4 h-4" />
                    <span>{isBengali ? 'যাচাই করুন' : 'Track Status'}</span>
                  </button>
                </form>

                {/* 4 Steps shown as a horizontal progress line with dots (Hard Requirement 3) */}
                <div className="mt-6 pt-5 border-t border-stone-200">
                  <div className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider mb-3">
                    {isBengali ? 'পেনশন নিষ্পত্তির ৪টি স্তর:' : '4 Stages of Settlement:'}
                  </div>

                  <div className="relative flex items-center justify-between text-center">
                    {/* Connecting line */}
                    <div className="absolute top-2.5 left-4 right-4 h-[2px] bg-stone-300 -z-0"></div>

                    {/* Step 1 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-[#0B5D3B] text-white text-[10px] flex items-center justify-center font-bold">
                        ১
                      </div>
                      <span className="text-[11px] font-medium text-stone-800 mt-1.5">
                        {isBengali ? 'দাখিল' : 'Submitted'}
                      </span>
                    </div>

                    {/* Step 2 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-[#0B5D3B] text-white text-[10px] flex items-center justify-center font-bold">
                        ২
                      </div>
                      <span className="text-[11px] font-medium text-stone-800 mt-1.5">
                        {isBengali ? 'নিরীক্ষা' : 'Scrutiny'}
                      </span>
                    </div>

                    {/* Step 3 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-stone-300 text-stone-700 text-[10px] flex items-center justify-center font-bold">
                        ৩
                      </div>
                      <span className="text-[11px] font-medium text-stone-600 mt-1.5">
                        {isBengali ? 'অনুমোদন' : 'Sanction'}
                      </span>
                    </div>

                    {/* Step 4 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-stone-300 text-stone-700 text-[10px] flex items-center justify-center font-bold">
                        ৪
                      </div>
                      <span className="text-[11px] font-medium text-stone-600 mt-1.5">
                        {isBengali ? 'ইএফটি' : 'EFT'}
                      </span>
                    </div>

                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Big Plain Numbers Below Hero (No rounded gradient cards!) */}
          <div className="mt-14 pt-8 border-t border-stone-300 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#0B5D3B]">
                {isBengali ? '৩,৪৫,০০০+' : '345,000+'}
              </div>
              <div className="text-xs text-stone-600 uppercase tracking-wider font-medium mt-1">
                {isBengali ? 'নিবন্ধিত পেনশনভোগী' : 'Registered Pensioners'}
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#0B5D3B]">
                {isBengali ? '৯৯.৪%' : '99.4%'}
              </div>
              <div className="text-xs text-stone-600 uppercase tracking-wider font-medium mt-1">
                {isBengali ? 'ইএফটি সফলতার হার' : 'EFT Success Rate'}
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#0B5D3B]">
                {isBengali ? '১২ কার্যদিবস' : '12 Workdays'}
              </div>
              <div className="text-xs text-stone-600 uppercase tracking-wider font-medium mt-1">
                {isBengali ? 'গড় নিষ্পত্তি সময়' : 'Avg Settlement Time'}
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#0B5D3B]">
                {isBengali ? '৬৪ জেলায়' : '64 Districts'}
              </div>
              <div className="text-xs text-stone-600 uppercase tracking-wider font-medium mt-1">
                {isBengali ? 'দেশব্যাপী কার্যকর সেবা' : 'Nationwide Coverage'}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 4: CITIZEN SERVICES (NUMBERED LIST WITH DIVIDERS) */}
      {/* ========================================================= */}
      <section id="services" className="border-b border-stone-300 py-16 bg-[#FAF8F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          {/* Section Marker */}
          <div className="border-b border-stone-400 pb-3 mb-10 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <span className="font-mono text-xs text-[#0B5D3B] font-bold uppercase tracking-widest">
                01 / {isBengali ? 'নাগরিক সেবাসমূহ' : 'CITIZEN SERVICES'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
                {isBengali ? 'পেনশন ও অবসর সুবিধা পোর্টফোলিও' : 'Pension & Retirement Services Portfolio'}
              </h2>
            </div>
            <div className="text-xs text-stone-500 font-mono">
              OFFICIAL CGA FRAMEWORK
            </div>
          </div>

          {/* Vertical Numbered List in a Two-Column Layout (Title Left, Desc + Link Right) */}
          <div className="divide-y divide-stone-300">
            {services.map((svc) => (
              <div key={svc.num} className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start group">
                
                {/* Left (5 Columns): Numeral and Service Title */}
                <div className="md:col-span-5 flex items-baseline space-x-4">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-[#0B5D3B] opacity-80 shrink-0">
                    {svc.num}
                  </span>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-serif leading-snug">
                      {isBengali ? svc.titleBn : svc.titleEn}
                    </h3>
                  </div>
                </div>

                {/* Right (7 Columns): Description and Plain Link */}
                <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                  <p className="text-sm text-stone-700 leading-relaxed font-normal">
                    {isBengali ? svc.descBn : svc.descEn}
                  </p>

                  <div>
                    <Link
                      to={svc.link}
                      className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#0B5D3B] hover:text-[#074229] border-b border-[#0B5D3B] pb-0.5"
                    >
                      <span>{isBengali ? svc.linkTextBn : svc.linkTextEn}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 5: PENSION CALCULATOR (CLEAR INPUTS & RESULT SLIP) */}
      {/* ========================================================= */}
      <section id="calculator" className="border-b border-stone-300 py-16 bg-[#FAF8F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          {/* Section Marker */}
          <div className="border-b border-stone-400 pb-3 mb-10 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <span className="font-mono text-xs text-[#0B5D3B] font-bold uppercase tracking-widest">
                02 / {isBengali ? 'পেনশন ক্যালকুলেটর' : 'PENSION CALCULATOR'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
                {isBengali ? 'অনলাইন পেনশন ও আনুতোষিক হিসাব বিবরণী' : 'Pension & Gratuity Calculation Memo'}
              </h2>
            </div>
            <div className="text-xs text-stone-500 font-mono">
              FORMULA: 50% BASIC + GRATUITY
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Form: Large Clear High-Contrast Inputs (Hard Requirement 5) */}
            <div className="lg:col-span-6 bg-white border border-stone-300 p-6 sm:p-8 rounded-[4px] shadow-sm space-y-6">
              
              <div>
                <h3 className="text-base font-bold font-serif text-stone-900">
                  {isBengali ? 'চাকরির বিবরণ ও বেতন ইনপুট' : 'Employment & Salary Parameters'}
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  {isBengali 
                    ? 'সরকারি কর্মচারী (পেনশন ও আনুতোষিক) বিধিমালা অনুসারে শেষ মূল বেতন ও চাকরির সময়কাল লিখুন।' 
                    : 'Values update live. Text is clearly displayed with high contrast.'}
                </p>
              </div>

              <div className="space-y-5">
                
                {/* Last Basic Salary */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-800 mb-1.5">
                    {isBengali ? 'সর্বশেষ মূল বেতন (Last Basic Pay in BDT) *' : 'Last Basic Pay (BDT) *'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-base font-serif font-bold text-stone-500">৳</span>
                    <input
                      type="number"
                      min="8250"
                      step="500"
                      value={calcSalary}
                      onChange={(e) => setCalcSalary(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-white text-stone-900 border border-stone-300 rounded-[4px] text-lg font-bold font-mono focus:outline-none focus:ring-1 focus:ring-[#0B5D3B] focus:border-[#0B5D3B]"
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    {['35000', '45000', '56500', '78000'].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setCalcSalary(amt)}
                        className="px-2 py-1 text-[11px] font-mono border border-stone-200 bg-stone-50 hover:bg-stone-100 rounded text-stone-700"
                      >
                        ৳ {parseInt(amt).toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Qualifying Service Years */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-800 mb-1.5">
                    {isBengali ? 'মোট যোগ্য চাকরিকাল (Years of Service: ১৯ থেকে ৩৫ বছর) *' : 'Qualifying Service (19 to 35 Years) *'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="19"
                      max="35"
                      value={calcYears}
                      onChange={(e) => setCalcYears(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white text-stone-900 border border-stone-300 rounded-[4px] text-lg font-bold font-mono focus:outline-none focus:ring-1 focus:ring-[#0B5D3B] focus:border-[#0B5D3B]"
                    />
                    <span className="absolute right-3.5 top-3 text-xs text-stone-500 font-medium">
                      {isBengali ? 'বছর' : 'Years'}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {['20', '25', '28', '30'].map((yr) => (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => setCalcYears(yr)}
                        className="px-2.5 py-1 text-[11px] font-mono border border-stone-200 bg-stone-50 hover:bg-stone-100 rounded text-stone-700"
                      >
                        {yr} {isBengali ? 'বছর' : 'Yrs'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Commutation Rate Note */}
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-[4px] text-xs text-stone-600 leading-relaxed">
                  <span className="font-semibold text-stone-800">{isBengali ? 'সরকারি বিধি:' : 'Rule Note:'}</span>{' '}
                  {isBengali 
                    ? 'সরকারি বিধি অনুযায়ী মূল পেনশনের ৫০% বাধ্যতামূলক সমর্পণ করে প্রতি ১ টাকার বিপরীতে ২৩০ টাকা হারে এককালীন আনুতোষিক প্রদেয়।'
                    : '50% of gross pension is mandatorily commuted for a one-time gratuity lump sum at the rate of 230 BDT per Taka.'}
                </div>

              </div>

            </div>

            {/* Right: Green "Result Slip" styled like a printed pension estimate with ruled lines */}
            <div className="lg:col-span-6 bg-[#0B5D3B] text-white p-6 sm:p-8 rounded-[4px] border border-[#074229] shadow-md">
              
              {/* Slip Header */}
              <div className="border-b border-[#074229] pb-4 mb-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-200 font-semibold">
                    {isBengali ? 'হিসাব মহানিয়ন্ত্রক কার্যালয় • প্রাক্কলন স্মারক' : 'OFFICE OF CGA • ESTIMATE MEMO'}
                  </div>
                  <div className="text-lg font-serif font-bold text-white">
                    {isBengali ? 'পেনশন ও আনুতোষিক হিসাব বিবরণী' : 'Pension & Gratuity Calculation Slip'}
                  </div>
                </div>
                <div className="text-right font-mono text-[11px] text-emerald-200">
                  SL: PEN-2026-EST
                </div>
              </div>

              {/* Ruled Lines Table of Calculation Breakdown */}
              <div className="space-y-3 font-mono text-xs sm:text-sm">
                
                <div className="flex justify-between py-1.5 border-b border-emerald-800/80">
                  <span className="text-emerald-100">{isBengali ? 'মূল বেতন (Last Basic):' : 'Last Basic Pay:'}</span>
                  <span className="font-bold">৳ {salaryNum.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-emerald-800/80">
                  <span className="text-emerald-100">{isBengali ? 'যোগ্য চাকরিকাল:' : 'Qualifying Service:'}</span>
                  <span className="font-bold">{yearsNum} {isBengali ? 'বছর' : 'Years'}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-emerald-800/80">
                  <span className="text-emerald-100">{isBengali ? 'মোট মাসিক পেনশন (৫০% মূল বেতন):' : 'Gross Monthly Pension (50%):'}</span>
                  <span className="font-bold">৳ {grossMonthlyPension.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-emerald-800/80">
                  <span className="text-emerald-100">{isBengali ? 'সমর্পিত অংশ (আনুতোষিকের জন্য ৫০%):' : 'Commuted for Gratuity (50%):'}</span>
                  <span className="font-bold">(-) ৳ {surrenderedPension.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-emerald-800/80">
                  <span className="text-emerald-100">{isBengali ? 'মাসিক পেনশন প্রাপ্য (৫০% অবশিষ্ট):' : 'Net Monthly Pension Draw:'}</span>
                  <span className="font-bold">৳ {netMonthlyPensionDrawn.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-emerald-800/80">
                  <span className="text-emerald-100">{isBengali ? 'মাসিক চিকিৎসা ভাতা (স্থায়ী):' : 'Medical Allowance (Fixed):'}</span>
                  <span className="font-bold">(+) ৳ {medicalAllowance.toLocaleString('en-IN')}</span>
                </div>

                {/* Highlighted Net Monthly Total */}
                <div className="flex justify-between py-2 border-b-2 border-emerald-400 font-sans">
                  <span className="font-semibold text-emerald-100 text-sm">{isBengali ? 'প্রতি মাসে ব্যাংক EFT প্রাপ্য:' : 'Total Monthly Bank EFT:'}</span>
                  <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-300">
                    ৳ {totalMonthlyEft.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Lump-Sum Gratuity Highlight */}
                <div className="pt-2 flex justify-between items-baseline font-sans">
                  <div>
                    <span className="block font-semibold text-emerald-100 text-sm">
                      {isBengali ? 'এককালীন আনুতোষিক (Gratuity Lump Sum):' : 'One-Time Gratuity Lump-Sum:'}
                    </span>
                    <span className="text-[11px] text-emerald-300 font-mono">
                      (৳ {surrenderedPension.toLocaleString('en-IN')} × {gratuityRate} BDT)
                    </span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
                    ৳ {totalGratuityLumpSum.toLocaleString('en-IN')}
                  </span>
                </div>

              </div>

              {/* Action Button: Submit Formal Application */}
              <div className="mt-8 pt-4 border-t border-emerald-800/80 text-center">
                <Link
                  to="/pension/register"
                  className="w-full inline-block py-3 px-6 bg-white hover:bg-stone-100 text-[#0B5D3B] font-bold text-sm rounded-[4px] transition-colors"
                >
                  {isBengali ? 'ফরম ২.১ পূরণ শুরু করুন (আনুষ্ঠানিক আবেদন)' : 'Submit Formal Application (Form 2.1)'}
                </Link>
                <div className="text-[11px] text-emerald-200 mt-2 font-mono">
                  {isBengali ? '※ এটি একটি সম্ভাব্য হিসাব। চূড়ান্ত হিসাব নিরীক্ষা সাপেক্ষ।' : '※ Estimate only. Final calculation subject to audit scrutiny.'}
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 6: CIRCULARS & NOTICES (TABLE-STYLE ROWS)         */}
      {/* ========================================================= */}
      <section id="notices" className="border-b border-stone-300 py-16 bg-[#FAF8F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          {/* Section Marker */}
          <div className="border-b border-stone-400 pb-3 mb-10 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <span className="font-mono text-xs text-[#0B5D3B] font-bold uppercase tracking-widest">
                03 / {isBengali ? 'পরিপত্র ও গেজেট' : 'CIRCULARS & GAZETTES'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
                {isBengali ? 'সাম্প্রতিক সরকারি পরিপত্র ও পেনশন নীতিমালা' : 'Recent Government Circulars & Regulatory Orders'}
              </h2>
            </div>
            <div className="text-xs text-stone-500 font-mono">
              FINANCE DIVISION OFFICIAL ORDERS
            </div>
          </div>

          {/* Clean Table-Style List with Thin Row Dividers */}
          <div className="border-t border-stone-300 divide-y divide-stone-300 bg-white border-b">
            {circulars.map((c, idx) => (
              <div key={idx} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-stone-50 transition-colors">
                
                {/* Type & Date */}
                <div className="md:w-48 shrink-0 flex items-center space-x-3">
                  <span className="inline-block px-2 py-0.5 border border-stone-300 bg-stone-100 text-stone-800 text-[11px] font-mono font-semibold uppercase rounded-[2px]">
                    {isBengali ? c.typeBn : c.typeEn}
                  </span>
                  <span className="text-xs font-mono text-stone-500">
                    {isBengali ? c.dateBn : c.dateEn}
                  </span>
                </div>

                {/* Title and Code */}
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-stone-900 hover:text-[#0B5D3B] cursor-pointer">
                    {isBengali ? c.titleBn : c.titleEn}
                  </h4>
                  <div className="text-[11px] font-mono text-stone-400 mt-0.5">
                    {c.code}
                  </div>
                </div>

                {/* Download PDF Action */}
                <div className="shrink-0">
                  <a
                    href="#download"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(isBengali ? 'সরকারি পরিপত্রটি ডাউনলোড হচ্ছে...' : 'Downloading official PDF circular...');
                    }}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 border border-stone-300 hover:border-stone-600 rounded-[3px] text-xs font-semibold text-stone-700 hover:text-stone-900 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-[#0B5D3B]" />
                    <span>{isBengali ? 'পিডিএফ ডাউনলোড' : 'Download PDF'}</span>
                  </a>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 7: HELPDESK (FULL-WIDTH CONTACT + FORM, NO ROLE LOGIN) */}
      {/* ========================================================= */}
      <section id="helpdesk" className="border-b border-stone-300 py-16 bg-[#FAF8F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          {/* Section Marker */}
          <div className="border-b border-stone-400 pb-3 mb-10 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <span className="font-mono text-xs text-[#0B5D3B] font-bold uppercase tracking-widest">
                04 / {isBengali ? 'হেল্পডেস্ক ও নাগরিক সেবা' : 'HELPDESK & CITIZEN DESK'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
                {isBengali ? 'নাগরিক সহায়তা ও সরাসরি যোগাযোগ' : 'Direct Citizen Support & Inquiry Desk'}
              </h2>
            </div>
            <div className="text-xs text-stone-500 font-mono">
              DIRECT DESK • 16122 / 333
            </div>
          </div>

          {/* Full-width Layout: Contact Details Left (5 Cols), Inquiry Form Right (7 Cols) */}
          {/* NOTE: Role-based portal navigation card has been COMPLETELY REMOVED as required */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 5 Columns: Official Contact Details & Office Hours */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white border border-stone-300 p-6 sm:p-7 rounded-[4px] shadow-sm space-y-5">
                <h3 className="text-base font-bold font-serif text-stone-900 border-b border-stone-200 pb-2">
                  {isBengali ? 'হিসাব মহানিয়ন্ত্রক কার্যালয় হেল্পডেস্ক' : 'CGA Official Contact Points'}
                </h3>

                <div className="space-y-4 text-xs sm:text-sm">
                  
                  {/* Helpline */}
                  <div className="flex items-start space-x-3">
                    <PhoneCall className="w-4 h-4 text-[#0B5D3B] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-stone-800">
                        {isBengali ? 'টোল-ফ্রি জাতীয় কল সেন্টার:' : 'Toll-Free National Helpline:'}
                      </div>
                      <div className="font-mono font-bold text-[#0B5D3B] text-base">
                        ১৬১২২ / ৩৩৩
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {isBengali ? '২৪ ঘণ্টা সক্রিয় (যেকোনো মোবাইল অপারেটর থেকে ফ্রি)' : 'Active 24/7 toll-free from any mobile operator'}
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start space-x-3">
                    <Mail className="w-4 h-4 text-[#0B5D3B] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-stone-800">
                        {isBengali ? 'অফিসিয়াল ইমেইল হেল্পডেস্ক:' : 'Official Email Helpdesk:'}
                      </div>
                      <div className="font-mono text-stone-900 font-medium">
                        helpdesk@pensionprobd.gov.bd
                      </div>
                    </div>
                  </div>

                  {/* Head Office Address */}
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-[#0B5D3B] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-stone-800">
                        {isBengali ? 'প্রধান কার্যালয়ের ঠিকানা:' : 'Head Office Location:'}
                      </div>
                      <div className="text-stone-700 leading-snug">
                        {isBengali 
                          ? 'হিসাব ভবন (৪র্থ তলা), সেগুনবাগিচা, ঢাকা-১০০০, বাংলাদেশ।' 
                          : 'Hisab Bhaban (4th Floor), Segunbagicha, Dhaka-1000, Bangladesh.'}
                      </div>
                    </div>
                  </div>

                  {/* Office Hours Block */}
                  <div className="flex items-start space-x-3 pt-2 border-t border-stone-200">
                    <Clock className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-stone-800">
                        {isBengali ? 'দাপ্তরিক কর্মঘণ্টা (Office Hours):' : 'Official Office Hours:'}
                      </div>
                      <div className="text-stone-600 text-xs mt-0.5">
                        {isBengali 
                          ? 'রবিবার – বৃহস্পতিবার: সকাল ৯:০০ টা থেকে বিকাল ৫:০০ টা (সরকারি ছুটির দিন ব্যতীত)' 
                          : 'Sunday – Thursday: 9:00 AM – 5:00 PM (Excluding public holidays)'}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Dignified photo placeholder / trust frame */}
              <div className="border border-stone-300 p-3 bg-white rounded-[4px]">
                <div className="h-28 bg-[#FAF8F3] border border-stone-200 rounded-[2px] flex items-center justify-center text-center p-4">
                  <div>
                    <Building className="w-6 h-6 text-[#0B5D3B] mx-auto mb-1.5 opacity-80" />
                    <div className="text-xs font-serif font-bold text-stone-800">
                      {isBengali ? 'হিসাব ভবন, সেগুনবাগিচা, ঢাকা' : 'Hisab Bhaban, Segunbagicha, Dhaka'}
                    </div>
                    <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                      CGA CENTRAL SECRETARIAT
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right 7 Columns: "Contact the Helpdesk" Form */}
            <div className="lg:col-span-7 bg-white border border-stone-300 p-6 sm:p-8 rounded-[4px] shadow-sm">
              
              <div className="border-b border-stone-200 pb-3 mb-6">
                <h3 className="text-base font-bold font-serif text-stone-900">
                  {isBengali ? 'হেল্পডেস্কে সরাসরি বার্তা পাঠান' : 'Submit an Inquiry to the Helpdesk'}
                </h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  {isBengali 
                    ? 'আবেদন সংক্রান্ত যেকোনো সমস্যা বা তথ্যের জন্য ফর্মটি পূরণ করুন। আমাদের কর্মকর্তা দ্রুত যোগাযোগ করবেন।' 
                    : 'Fill in your details below. An assigned Accounts Support Officer will get back to you.'}
                </p>
              </div>

              {helpSubmitted ? (
                <div className="p-6 bg-emerald-50 border border-[#0B5D3B] rounded-[4px] text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-[#0B5D3B] mx-auto" />
                  <h4 className="text-sm font-bold text-[#0B5D3B] font-serif">
                    {isBengali ? 'আপনার বার্তা সফলভাবে গৃহীত হয়েছে' : 'Your inquiry has been received'}
                  </h4>
                  <p className="text-xs text-stone-600">
                    {isBengali 
                      ? 'একটি ট্র্যাকিং টিকিট তৈরি হয়েছে। ২৪ ঘণ্টার মধ্যে আপনার প্রদত্ত নম্বরে যোগাযোগ করা হবে।' 
                      : 'A support ticket has been created. Our desk will contact you within 24 business hours.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleHelpSubmit} className="space-y-4">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                        {isBengali ? 'আপনার নাম *' : 'Full Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={helpForm.name}
                        onChange={(e) => setHelpForm({ ...helpForm, name: e.target.value })}
                        placeholder={isBengali ? 'মো: আমিনুল ইসলাম' : 'Md. Aminul Islam'}
                        className="w-full px-3.5 py-2 text-sm bg-white text-stone-900 border border-stone-300 rounded-[4px] focus:outline-none focus:ring-1 focus:ring-[#0B5D3B] focus:border-[#0B5D3B]"
                      />
                    </div>

                    {/* Mobile / Contact */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                        {isBengali ? 'মোবাইল বা ইমেইল *' : 'Contact Number / Email *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={helpForm.contact}
                        onChange={(e) => setHelpForm({ ...helpForm, contact: e.target.value })}
                        placeholder="017XXXXXXXX"
                        className="w-full px-3.5 py-2 text-sm bg-white text-stone-900 border border-stone-300 rounded-[4px] focus:outline-none focus:ring-1 focus:ring-[#0B5D3B] focus:border-[#0B5D3B]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Tracking ID or PRL No (Optional) */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                        {isBengali ? 'আবেদন ট্র্যাকিং / পিআরএল নম্বর (ঐচ্ছিক)' : 'Tracking / PRL Number (Optional)'}
                      </label>
                      <input
                        type="text"
                        value={helpForm.trackingId}
                        onChange={(e) => setHelpForm({ ...helpForm, trackingId: e.target.value })}
                        placeholder="APP2026..."
                        className="w-full px-3.5 py-2 text-sm bg-white text-stone-900 border border-stone-300 rounded-[4px] focus:outline-none focus:ring-1 focus:ring-[#0B5D3B] focus:border-[#0B5D3B]"
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                        {isBengali ? 'জিজ্ঞাসার বিষয় *' : 'Subject of Inquiry *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={helpForm.subject}
                        onChange={(e) => setHelpForm({ ...helpForm, subject: e.target.value })}
                        placeholder={isBengali ? 'ফরম ২.১ যাচাই বিলম্ব' : 'Audit verification delay'}
                        className="w-full px-3.5 py-2 text-sm bg-white text-stone-900 border border-stone-300 rounded-[4px] focus:outline-none focus:ring-1 focus:ring-[#0B5D3B] focus:border-[#0B5D3B]"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      {isBengali ? 'বিস্তারিত বিবরণ *' : 'Detailed Message *'}
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={helpForm.message}
                      onChange={(e) => setHelpForm({ ...helpForm, message: e.target.value })}
                      placeholder={isBengali ? 'আপনার সমস্যার বিস্তারিত এখানে লিখুন...' : 'Write your details here...'}
                      className="w-full px-3.5 py-2 text-sm bg-white text-stone-900 border border-stone-300 rounded-[4px] focus:outline-none focus:ring-1 focus:ring-[#0B5D3B] focus:border-[#0B5D3B]"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#0B5D3B] hover:bg-[#074229] text-white text-sm font-semibold rounded-[4px] transition-colors flex items-center space-x-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isBengali ? 'বার্তা প্রেরণ করুন' : 'Send Message'}</span>
                    </button>
                  </div>

                </form>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 8: TIDY 4-COLUMN GOVERNMENT FOOTER                 */}
      {/* ========================================================= */}
      <footer className="bg-[#074229] text-stone-100 border-t-2 border-[#C8102E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Col 1: Government Crest & Overview */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full border border-white bg-[#0B5D3B] flex items-center justify-center font-bold text-xs text-white">
                  BD
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-white">PensionProBD</h4>
                  <p className="text-[11px] text-emerald-200">
                    {isBengali ? 'অর্থ বিভাগ, অর্থ মন্ত্রণালয়' : 'Finance Division, MoF'}
                  </p>
                </div>
              </div>
              <p className="text-xs text-emerald-100 leading-relaxed font-normal">
                {isBengali 
                  ? 'অবসরপ্রাপ্ত বেসামরিক সরকারি কর্মচারী ও তাঁদের উত্তরাধিকারীদের জন্য স্বচ্ছ ও স্বয়ংক্রিয় পেনশন বিতরণ ব্যবস্থা।' 
                  : 'An integrated national portal for civilian pension application, audit verification, executive sanction, and direct EFT payments.'}
              </p>
              <div className="text-[10px] font-mono text-emerald-300">
                SYSTEM VER: 4.2.0 • 256-BIT SSL
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-emerald-300 font-bold mb-3 border-b border-emerald-800 pb-1">
                {isBengali ? 'গুরুত্বপূর্ণ সেবা' : 'Core Services'}
              </h4>
              <ul className="space-y-2 text-xs text-emerald-100">
                <li><Link to="/pension/login" className="hover:text-white transition-colors">{isBengali ? 'পেনশন পোর্টাল লগইন' : 'Portal Login'}</Link></li>
                <li><Link to="/pension/register" className="hover:text-white transition-colors">{isBengali ? 'নতুন পেনশনভোগী নিবন্ধন' : 'Pensioner Registration'}</Link></li>
                <li><a href="#services" className="hover:text-white transition-colors">{isBengali ? 'ফরম নং ২.১ নির্দেশিকা' : 'Form 2.1 Guidelines'}</a></li>
                <li><a href="#calculator" className="hover:text-white transition-colors">{isBengali ? 'পেনশন ও আনুতোষিক ক্যালকুলেটর' : 'Pension Calculator'}</a></li>
                <li><a href="#notices" className="hover:text-white transition-colors">{isBengali ? 'সরকারি পরিপত্র ও গেজেট' : 'Circulars & Gazettes'}</a></li>
              </ul>
            </div>

            {/* Col 3: National Portals */}
            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-emerald-300 font-bold mb-3 border-b border-emerald-800 pb-1">
                {isBengali ? 'সরকারি সংযোগ' : 'National Portals'}
              </h4>
              <ul className="space-y-2 text-xs text-emerald-100">
                <li><a href="https://bangladesh.gov.bd" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">বাংলাদেশ জাতীয় তথ্য বাতায়ন</a></li>
                <li><a href="https://mof.gov.bd" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">অর্থ বিভাগ, অর্থ মন্ত্রণালয়</a></li>
                <li><a href="https://cga.gov.bd" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">হিসাব মহানিয়ন্ত্রকের কার্যালয়</a></li>
                <li><a href="https://grs.gov.bd" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">অভিযোগ প্রতিকার ব্যবস্থা (GRS)</a></li>
              </ul>
            </div>

            {/* Col 4: Contact & Verification */}
            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-emerald-300 font-bold mb-3 border-b border-emerald-800 pb-1">
                {isBengali ? 'জরুরি সহায়তা' : 'Helpdesk & Support'}
              </h4>
              <div className="space-y-1.5 text-xs text-emerald-100">
                <p>{isBengali ? 'হিসাব ভবন, সেগুনবাগিচা, ঢাকা' : 'Hisab Bhaban, Segunbagicha, Dhaka'}</p>
                <p className="font-mono font-bold text-white">হেল্পলাইন: ১৬১২২ / ৩৩৩</p>
                <p className="font-mono">ইমেইল: helpdesk@pensionprobd.gov.bd</p>
                <div className="pt-2">
                  <span className="inline-block px-2 py-0.5 rounded-[2px] bg-[#0B5D3B] text-emerald-200 text-[10px] font-mono border border-emerald-700">
                    EFT COMPLIANT
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Line */}
          <div className="mt-10 pt-6 border-t border-emerald-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-200 gap-2">
            <div>
              &copy; {new Date().getFullYear()} {isBengali ? 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার। সর্বস্বত্ব সংরক্ষিত।' : 'Government of the People\'s Republic of Bangladesh. All rights reserved.'}
            </div>
            <div className="text-[11px] font-mono text-emerald-300">
              {isBengali ? 'সর্বশেষ হালনাগাদ: ০৭ নভেম্বর ২০২৬' : 'Last Updated: 07 November 2026'}
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default Homepage;
