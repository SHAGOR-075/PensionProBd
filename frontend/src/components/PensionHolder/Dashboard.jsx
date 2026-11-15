import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { 
  FileText, 
  Check, 
  ArrowRight,
  Printer
} from 'lucide-react';

const PensionHolderDashboard = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { applications, complaints, dashboardStats } = useData();

  const isBengali = i18n.language === 'bn';

  // API response data mapping - strictly identical to existing logic
  const userApplications = (applications || []).filter(app => {
    const appUserId = app.userId?._id?.toString() || app.userId?.toString() || app.userId;
    return appUserId === user?.id || appUserId === user?._id;
  });

  const userComplaints = (complaints || []).filter(complaint => {
    const complaintUserId = complaint.userId?._id?.toString() || complaint.userId?.toString() || complaint.userId;
    return complaintUserId === user?.id || complaintUserId === user?._id;
  });

  const latestApplication = userApplications[0] || null;

  // Status mapping - returns plain text and dot color (NOT pill badges)
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return {
          label: isBengali ? 'হিসাব নিরীক্ষাধীন' : 'Under Audit Review',
          dotColor: 'bg-amber-600',
          step: 2 // currently in scrutiny
        };
      case 'forwarded':
        return {
          label: isBengali ? 'প্রধান কার্যালয়ে অগ্রায়িত' : 'Forwarded to Head Office',
          dotColor: 'bg-teal-600',
          step: 3 // forwarded to head office
        };
      case 'approved':
        return {
          label: isBengali ? 'পেনশন মঞ্জুরিকৃত (PPO ইস্যু সম্পন্ন)' : 'Pension Sanctioned (PPO Issued)',
          dotColor: 'bg-[#0B5D3B]',
          step: 4 // sanctioned/EFT ready
        };
      case 'rejected':
        return {
          label: isBengali ? 'সংশোধনের নির্দেশ' : 'Returned for Correction',
          dotColor: 'bg-[#C8102E]',
          step: 1 // needs resubmission
        };
      default:
        return {
          label: isBengali ? 'প্রক্রিয়াধীন' : 'Processing',
          dotColor: 'bg-stone-500',
          step: 1
        };
    }
  };

  const currentStatus = latestApplication ? getStatusInfo(latestApplication.status) : null;

  // 4 Workflow steps definition
  const workflowSteps = [
    {
      num: 1,
      titleBn: 'আবেদন দাখিল সম্পন্ন',
      titleEn: 'Submitted',
      subBn: 'ফরম ২.১ ও নথি আপলোড',
      subEn: 'Form 2.1 & Documents'
    },
    {
      num: 2,
      titleBn: 'নিরীক্ষা সম্পন্ন',
      titleEn: 'Audit Scrutiny',
      subBn: 'হিসাবরক্ষণ কর্মকর্তা কর্তৃক যাচাই',
      subEn: 'Verified by Accounts Officer'
    },
    {
      num: 3,
      titleBn: 'হেড অফিস অনুমোদন',
      titleEn: 'Head Office Sanction',
      subBn: 'পেনশন মঞ্জুরি ও PPO আদেশ',
      subEn: 'Executive Approval & PPO'
    },
    {
      num: 4,
      titleBn: 'ইএফটি বিতরণ',
      titleEn: 'EFT Disbursement',
      subBn: 'ব্যাংক হিসেবে সরাসরি স্থানান্তর',
      subEn: 'Direct Bank Credit'
    }
  ];

  return (
    <div className="space-y-8 font-sans text-stone-900 dark:text-stone-100 max-w-6xl mx-auto">
      
      {/* ========================================================= */}
      {/* 1. WELCOME AREA (PAPER STYLE, NO GRADIENT BANNER)        */}
      {/* ========================================================= */}
      <section className="border-b border-stone-300 dark:border-stone-800 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
          <span className="font-mono text-xs uppercase tracking-widest text-[#0B5D3B] dark:text-emerald-400 font-semibold">
            {isBengali ? 'পেনশনভোগী নাগরিক ড্যাশবোর্ড' : 'Pension Holder Dashboard'}
          </span>
          <span className="text-xs font-mono text-stone-500 dark:text-stone-400">
            {isBengali ? 'আইডি:' : 'ID:'} {user?.email || user?.id || 'PENSIONER'} • {isBengali ? 'সর্বশেষ লগইন: আজ' : 'Last activity: Today'}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
          {isBengali ? `সম্মানিত ${user?.name || 'নাগরিক'}, স্বাগতম` : `Welcome, ${user?.name || 'Pensioner'}`}
        </h1>

        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-3xl leading-relaxed">
          {isBengali 
            ? 'হিসাব মহানিয়ন্ত্রকের কার্যালয় (CGA) কেন্দ্রীয় ই-পেনশন সার্ভারের মাধ্যমে আপনার অবসর সুবিধা, দাখিলকৃত আবেদন এবং মাসিক ব্যাংক ইএফটি স্থিতি পর্যবেক্ষণ করুন।'
            : 'Track your civilian retirement benefits, Form 2.1 dossier progress, and direct electronic fund transfer (EFT) disbursements from this official dashboard.'}
        </p>
      </section>

      {/* ========================================================= */}
      {/* 2. SUMMARY FIGURES (ONE HORIZONTAL STRIP, NOT CARDS)      */}
      {/* ========================================================= */}
      <section>
        <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-[4px] shadow-sm grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-stone-200 dark:divide-stone-800">
          
          {/* Total Applications */}
          <div className="p-5 sm:p-6">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {isBengali ? 'মোট আবেদন' : 'Total Applications'}
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#0B5D3B] dark:text-emerald-400 mt-2">
              {userApplications.length}
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-mono">
              {isBengali ? 'দাখিলকৃত মোট ফাইল' : 'Submitted dossiers'}
            </div>
          </div>

          {/* Under Review */}
          <div className="p-5 sm:p-6">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {isBengali ? 'নিরীক্ষাধীন আবেদন' : 'Under Review'}
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#0B5D3B] dark:text-emerald-400 mt-2">
              {userApplications.filter(a => a.status === 'pending' || a.status === 'forwarded').length}
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-mono">
              {isBengali ? 'অডিট ও যাচাই চলমান' : 'Verification ongoing'}
            </div>
          </div>

          {/* Approved Benefits */}
          <div className="p-5 sm:p-6">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {isBengali ? 'অনুমোদিত সুবিধা' : 'Approved Benefits'}
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#0B5D3B] dark:text-emerald-400 mt-2">
              {userApplications.filter(a => a.status === 'approved').length}
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-mono">
              {isBengali ? 'PPO ও ইএফটি প্রস্তুত' : 'Sanctioned & EFT ready'}
            </div>
          </div>

          {/* Grievances */}
          <div className="p-5 sm:p-6">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {isBengali ? 'দাখিলকৃত অভিযোগ' : 'Grievances (GRS)'}
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-stone-800 dark:text-stone-200 mt-2">
              {userComplaints.length}
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-mono">
              {isBengali ? 'প্রতিকার সেল ট্র্যাকিং' : 'Grievance cell logs'}
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. CURRENT APPLICATION SUMMARY (PRINTED SLIP STYLE)       */}
      {/* ========================================================= */}
      <section className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-[4px] p-6 sm:p-8 shadow-sm">
        
        {/* Slip Header */}
        <div className="border-b border-stone-200 dark:border-stone-800 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400 font-semibold">
              {isBengali ? 'বাংলাদেশ ফরম নং ২.১ • সারসংক্ষেপ স্লিপ' : 'BANGLADESH FORM 2.1 • DOSSIER SUMMARY SLIP'}
            </div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-0.5">
              {isBengali ? 'চলতি পেনশন আবেদন বিবরণী' : 'Current Application Summary'}
            </h2>
          </div>

          {/* Plain bold status with small coloured dot (NO pill badge) */}
          {latestApplication && currentStatus && (
            <div className="flex items-center space-x-2 border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 px-3 py-1.5 rounded-[3px]">
              <span className={`w-2 h-2 rounded-full ${currentStatus.dotColor} shrink-0`}></span>
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                {currentStatus.label}
              </span>
            </div>
          )}
        </div>

        {latestApplication ? (
          <div className="space-y-8">
            
            {/* Two-Column Ruled Details List with Dotted Leader Lines */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 text-xs sm:text-sm font-sans">
              
              {/* Application No */}
              <div className="flex items-baseline justify-between py-2 border-b border-dotted border-stone-300 dark:border-stone-700">
                <span className="text-stone-500 dark:text-stone-400 font-medium">
                  {isBengali ? 'আবেদন নম্বর:' : 'Application No:'}
                </span>
                <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
                  #{latestApplication.applicationNumber || (latestApplication._id ? latestApplication._id.slice(-8) : 'APP2026')}
                </span>
              </div>

              {/* Monthly Pension */}
              <div className="flex items-baseline justify-between py-2 border-b border-dotted border-stone-300 dark:border-stone-700">
                <span className="text-stone-500 dark:text-stone-400 font-medium">
                  {isBengali ? 'প্রাক্কলিত মাসিক পেনশন:' : 'Monthly Pension:'}
                </span>
                <span className="font-mono font-bold text-[#0B5D3B] dark:text-emerald-400 text-sm sm:text-base">
                  ৳ {latestApplication.pensionAmount ? latestApplication.pensionAmount.toLocaleString('en-IN') : 'N/A'}
                </span>
              </div>

              {/* Qualifying Service */}
              <div className="flex items-baseline justify-between py-2 border-b border-dotted border-stone-300 dark:border-stone-700">
                <span className="text-stone-500 dark:text-stone-400 font-medium">
                  {isBengali ? 'যোগ্য চাকরিকাল:' : 'Qualifying Service:'}
                </span>
                <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
                  {latestApplication.jobAge || 25} {isBengali ? 'বছর' : 'Years'}
                </span>
              </div>

              {/* Submission Date */}
              <div className="flex items-baseline justify-between py-2 border-b border-dotted border-stone-300 dark:border-stone-700">
                <span className="text-stone-500 dark:text-stone-400 font-medium">
                  {isBengali ? 'দাখিলের তারিখ:' : 'Submission Date:'}
                </span>
                <span className="font-mono font-semibold text-stone-900 dark:text-stone-100">
                  {latestApplication.submittedAt 
                    ? new Date(latestApplication.submittedAt).toLocaleDateString(isBengali ? 'bn-BD' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric' })
                    : (isBengali ? '০৫ নভেম্বর ২০২৬' : '05 Nov 2026')}
                </span>
              </div>

            </div>

            {/* ========================================================= */}
            {/* 4. PROCESSING WORKFLOW (HORIZONTAL STEPPER WITH DOTS)     */}
            {/* ========================================================= */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800">
              <div className="text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-6">
                {isBengali ? 'অনলাইন প্রক্রিয়াকরণ ধাপ (Processing Workflow):' : 'Online Processing Workflow:'}
              </div>

              {/* Stepper Line and Dots */}
              <div className="relative">
                {/* Horizontal Connecting Line */}
                <div className="absolute top-3 left-6 right-6 h-[2px] bg-stone-200 dark:bg-stone-700 -z-0"></div>

                {/* 4 Steps */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                  {workflowSteps.map((step) => {
                    const stepState = currentStatus?.step || 1;
                    const isCompleted = step.num < stepState || (step.num === stepState && latestApplication.status === 'approved');
                    const isCurrent = step.num === stepState && latestApplication.status !== 'approved';
                    const isPending = step.num > stepState;

                    return (
                      <div key={step.num} className="flex flex-col items-center text-center">
                        {/* Dot */}
                        {isCompleted ? (
                          <div className="w-6 h-6 rounded-full bg-[#0B5D3B] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : isCurrent ? (
                          <div className="w-6 h-6 rounded-full border-2 border-[#0B5D3B] bg-white dark:bg-stone-900 flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-[#0B5D3B]"></span>
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 flex items-center justify-center text-[10px] font-mono text-stone-400">
                            {step.num}
                          </div>
                        )}

                        {/* Title */}
                        <div className="mt-2.5">
                          <div className={`text-xs font-semibold ${isCompleted || isCurrent ? 'text-stone-900 dark:text-stone-100 font-bold' : 'text-stone-500 dark:text-stone-400'}`}>
                            {isBengali ? step.titleBn : step.titleEn}
                          </div>
                          <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 leading-tight hidden sm:block">
                            {isBengali ? step.subBn : step.subEn}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* Plain Empty State */
          <div className="py-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-400 flex items-center justify-center mx-auto">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-serif font-bold text-stone-800 dark:text-stone-200">
              {isBengali ? 'এখনো কোনো পেনশন আবেদন দাখিল করা হয়নি' : 'No Pension Application Submitted Yet'}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto">
              {isBengali 
                ? 'অবসর প্রস্তুতিমূলক ছুটি (PRL) সমাপ্তির পর সরকারি ফরম ২.১ পূরণ করে অনলাইনে আপনার পেনশন নথিপত্র দাখিল করুন।' 
                : 'Fill out Government Form 2.1 to submit your formal retirement pension dossier directly to the accounts office.'}
            </p>
          </div>
        )}

      </section>

      {/* ========================================================= */}
      {/* 5. PENSIONER ADVISORY NOTICE (THICK LEFT BORDER NOTE)     */}
      {/* ========================================================= */}
      <section className="border-l-4 border-amber-600 bg-stone-100 dark:bg-stone-900 p-4 sm:p-5 rounded-[2px] text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
        <div className="font-semibold text-stone-900 dark:text-stone-100 mb-0.5">
          {isBengali ? 'পেনশনভোগী সুরক্ষা নোটিশ ও নির্দেশনা:' : 'Pensioner Advisory & Statutory Rights:'}
        </div>
        <div>
          {isBengali 
            ? 'পেনশন মঞ্জুরি বা নিরীক্ষার জন্য কোনো কর্মকর্তা বা ব্যক্তিকে কোনো প্রকার অনানুষ্ঠানিক ফি প্রদান করবেন না। আবেদন সংক্রান্ত কোনো অযথা বিলম্ব বা হয়রানির শিকার হলে হেল্পলাইন ১৬১২২ অথবা অভিযোগ সেলে (GRS) সরাসরি জানান।' 
            : 'Government pension services are fully official and fee-free. Report any unjustified delay or harassment directly through the Grievance Redress Cell (GRS) or call the toll-free helpline at 16122.'}
        </div>
      </section>

    </div>
  );
};

export default PensionHolderDashboard;
