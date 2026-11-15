import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { 
  FileText, 
  Clock, 
  Check, 
  X, 
  Eye,
  Send,
  AlertTriangle,
  Flag,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

const AssistantAccountantDashboard = ({ activeTab }) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { applications, updateApplicationStatus, dashboardStats, complaints, fetchComplaints } = useData();
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [actionType, setActionType] = useState('');

  const isBengali = i18n.language === 'bn';

  // Fetch complaints on mount - preserved as-is
  useEffect(() => {
    if (fetchComplaints) {
      fetchComplaints();
    }
  }, [fetchComplaints]);

  const allApps = applications || [];
  const pendingApplications = allApps.filter(app => app.status === 'pending');
  const reviewedApplications = allApps.filter(app => app.status !== 'pending');
  
  // Filter complaints against this assistant accountant that resulted in red flags - preserved as-is
  const redFlagComplaints = (complaints || []).filter(complaint => {
    const complaintOfficerId = complaint.officerId?._id?.toString() || complaint.officerId?.toString() || complaint.officerId;
    return complaintOfficerId === user?.id && complaint.redFlagIssued === true;
  });

  const handleAction = (application, action) => {
    setSelectedApplication(application);
    setActionType(action);
    setShowModal(true);
  };

  const submitAction = async () => {
    if (!selectedApplication) return;

    let status = actionType;
    let message = feedback;

    if (actionType === 'forward') {
      status = 'forwarded';
      message = feedback || (isBengali ? 'আবেদনটি চূড়ান্ত অনুমোদনের জন্য প্রধান কার্যালয়ে অগ্রায়িত করা হলো।' : 'Application forwarded to Head Office for final approval');
    } else if (actionType === 'reject') {
      status = 'rejected';
      message = feedback || (isBengali ? 'অসম্পূর্ণ নথিপত্রের কারণে আবেদনটি সংশোধনের জন্য ফেরত পাঠানো হলো।' : 'Application rejected due to incomplete information');
    }

    try {
      await updateApplicationStatus(selectedApplication._id, status, message);
      setShowModal(false);
      setFeedback('');
      setSelectedApplication(null);
    } catch (error) {
      console.error('Failed to update application status:', error);
    }
  };

  // Plain status text with small colored dot (NO pill badge)
  const renderStatusDot = (status) => {
    switch (status) {
      case 'pending':
        return (
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 capitalize">
              {isBengali ? 'নিরীক্ষাধীন' : 'Pending Review'}
            </span>
          </div>
        );
      case 'forwarded':
        return (
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0"></span>
            <span className="text-xs font-semibold text-teal-700 dark:text-teal-400 capitalize">
              {isBengali ? 'অগ্রায়িত' : 'Forwarded'}
            </span>
          </div>
        );
      case 'approved':
        return (
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0B5D3B] shrink-0"></span>
            <span className="text-xs font-semibold text-[#0B5D3B] dark:text-emerald-400 capitalize">
              {isBengali ? 'অনুমোদিত' : 'Approved'}
            </span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-[#C8102E] shrink-0"></span>
            <span className="text-xs font-semibold text-[#C8102E] dark:text-red-400 capitalize">
              {isBengali ? 'ফেরত / সংশোধন' : 'Rejected'}
            </span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-stone-400 shrink-0"></span>
            <span className="text-xs font-semibold text-stone-600 dark:text-stone-400 capitalize">
              {status || 'Unknown'}
            </span>
          </div>
        );
    }
  };

  const reviewedTodayCount = dashboardStats?.reviewedToday !== undefined 
    ? dashboardStats.reviewedToday 
    : reviewedApplications.filter(app => {
        const lastEntry = app.history && app.history[app.history.length - 1];
        return lastEntry?.timestamp && new Date(lastEntry.timestamp).toDateString() === new Date().toDateString();
      }).length;

  const totalProcessedCount = dashboardStats?.totalApplications !== undefined 
    ? dashboardStats.totalApplications 
    : allApps.length;

  const pendingCount = dashboardStats?.pendingApplications !== undefined 
    ? dashboardStats.pendingApplications 
    : pendingApplications.length;

  const redFlagsCount = user?.redFlags || 0;

  // =========================================================
  // MAIN DASHBOARD VIEW
  // =========================================================
  const renderDashboard = () => (
    <div className="space-y-8 font-sans text-stone-900 dark:text-stone-100 max-w-6xl mx-auto">
      
      {/* 1. Welcome Area (No Gradient Banner - Crisp Paper Style) */}
      <section className="border-b border-stone-300 dark:border-stone-800 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
          <span className="font-mono text-xs uppercase tracking-widest text-[#0B5D3B] dark:text-emerald-400 font-semibold">
            {isBengali ? 'হিসাব নিরীক্ষা ডেস্ক' : 'Audit Desk'}
          </span>
          <span className="text-xs font-mono text-stone-500 dark:text-stone-400">
            {isBengali ? 'সর্বশেষ হালনাগাদ:' : 'Last updated:'} {new Date().toLocaleDateString(isBengali ? 'bn-BD' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
          {isBengali ? `স্বাগতম, ${user?.name || 'সহকারী হিসাবরক্ষক'}` : `Welcome, ${user?.name || 'Assistant Accountant'}`}
        </h1>

        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-3xl leading-relaxed">
          {isBengali 
            ? 'পেনশন ফরম ২.১ নিরীক্ষা, সেবা বই ও এনআইডি যাচাইকরণ এবং হেড অফিসে অগ্রায়নের দাপ্তরিক কার্যক্রম পরিচালনা করুন।'
            : 'Review and process pension applications, verify service records and forward audited dossiers to Head Office.'}
        </p>
      </section>

      {/* 2. Summary Figures (One Horizontal Strip, Big Serif Numerals, Thin Hairlines) */}
      <section>
        <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-[4px] shadow-sm grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-stone-200 dark:divide-stone-800">
          
          {/* Pending Applications */}
          <div className="p-5 sm:p-6">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {isBengali ? 'পেন্ডিং আবেদন' : 'Pending Applications'}
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-amber-600 dark:text-amber-400 mt-2">
              {pendingCount}
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-mono">
              {isBengali ? 'নিরীক্ষার অপেক্ষায়' : 'Awaiting scrutiny'}
            </div>
          </div>

          {/* Reviewed Today */}
          <div className="p-5 sm:p-6">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {isBengali ? 'আজকে নিরীক্ষিত' : 'Reviewed Today'}
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#0B5D3B] dark:text-emerald-400 mt-2">
              {reviewedTodayCount}
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-mono">
              {isBengali ? 'আজকের নিষ্পত্তি' : 'Actions taken today'}
            </div>
          </div>

          {/* Total Processed */}
          <div className="p-5 sm:p-6">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {isBengali ? 'মোট প্রক্রিয়াকৃত' : 'Total Processed'}
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-2">
              {totalProcessedCount}
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-mono">
              {isBengali ? 'সর্বমোট রেকর্ড' : 'Lifetime dossiers'}
            </div>
          </div>

          {/* Red Flags (0/3) - Red ONLY if > 0 */}
          <div className="p-5 sm:p-6">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {isBengali ? 'লাল পতাকা সতর্কতা' : 'Red Flags'}
            </div>
            <div className={`text-3xl sm:text-4xl font-serif font-bold mt-2 ${
              redFlagsCount > 0 ? 'text-[#C8102E]' : 'text-stone-900 dark:text-stone-100'
            }`}>
              {redFlagsCount}/3
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-mono">
              {redFlagsCount > 0 
                ? (isBengali ? 'প্রশাসনিক সতর্কতা' : 'Administrative flag') 
                : (isBengali ? 'সম্পূর্ণ পরিষ্কার' : 'Clear discipline record')}
            </div>
          </div>

        </div>
      </section>

      {/* Red Flags Alert Note (if redFlags > 0) */}
      {redFlagsCount > 0 && (
        <section className="border-l-4 border-[#C8102E] bg-stone-100 dark:bg-stone-900 p-4 sm:p-5 rounded-[2px] text-xs text-stone-800 dark:text-stone-200">
          <div className="flex items-center space-x-2 text-[#C8102E] font-bold text-sm font-serif mb-1">
            <Flag className="w-4 h-4" />
            <span>
              {redFlagsCount >= 3 
                ? (isBengali ? 'অ্যাকাউন্ট নিষ্ক্রিয় — ৩টি লাল পতাকা প্রাপ্ত' : 'Account Disabled — 3 Red Flags Received')
                : (isBengali ? `লাল পতাকা সতর্কতা — ${redFlagsCount}/৩টি জারি হয়েছে` : `Red Flag Warning — ${redFlagsCount}/3 Red Flags Issued`)}
            </span>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            {redFlagsCount >= 3 
              ? (isBengali ? '৩টি লাল পতাকা পাওয়ার কারণে আপনার হিসাব নিরীক্ষা সাময়িকভাবে স্থগিত হয়েছে। অনুগ্রহ করে প্রধান কার্যালয় প্রশাসনের সাথে যোগাযোগ করুন।' : 'Your desk access has been suspended due to 3 red flag warnings. Please contact Head Office administration.')
              : (isBengali ? `আপনি ${redFlagsCount}টি লাল পতাকা সতর্কতা পেয়েছেন। ৩টি সতর্কতা হলে অ্যাকাউন্ট স্বয়ংক্রিয়ভাবে স্থগিত হবে। অভিযোগগুলো সতর্কতার সাথে সমাধান করুন।` : `You have received ${redFlagsCount} red flag warning(s). 3 red flags will result in account deactivation. Review the complaints below.`)}
          </p>
        </section>
      )}

      {/* 3. Red Flag Complaints (Ruled Entries with 3px Red Left Border - NO Pink Box) */}
      {redFlagComplaints.length > 0 && (
        <section className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-[4px] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#C8102E] font-bold">
              {isBengali ? 'শৃঙ্খলা ও প্রতিকার সেল' : 'ADMINISTRATIVE DISCIPLINE'}
            </div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-0.5">
              {isBengali ? `লাল পতাকা সংক্রান্ত অভিযোগ (${redFlagComplaints.length})` : `Red Flag Complaints (${redFlagComplaints.length})`}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {isBengali ? 'যে সকল অভিযোগের ভিত্তিতে আপনার বিরুদ্ধে লাল পতাকা সতর্কবার্তা জারি হয়েছে' : 'Complaints that resulted in red flag warnings against your scrutiny desk'}
            </p>
          </div>

          <div className="space-y-4">
            {redFlagComplaints.map((complaint) => (
              <div 
                key={complaint._id} 
                className="border-l-[3px] border-[#C8102E] border-y border-r border-stone-200 dark:border-stone-800 bg-[#FAF8F3]/50 dark:bg-stone-900 p-4 sm:p-5 rounded-[2px]"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    
                    {/* Title + Small Caps Red Label (No Pill, No Background) */}
                    <div className="flex flex-wrap items-baseline gap-2.5">
                      <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100">
                        {complaint.subject}
                      </h3>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#C8102E] font-bold">
                        RED FLAG ISSUED
                      </span>
                    </div>

                    {/* Meta line */}
                    <div className="text-xs font-mono text-stone-500 dark:text-stone-400">
                      {isBengali ? 'অভিযোগ নং:' : 'Complaint #'} {complaint.complaintNumber || (complaint._id ? complaint._id.slice(-6) : 'GRS')} • 
                      {' '}{isBengali ? 'দাখিল:' : 'Submitted:'} {new Date(complaint.submittedAt).toLocaleDateString(isBengali ? 'bn-BD' : 'en-US')}
                      {complaint.resolvedAt && (
                        <span> • {isBengali ? 'নিষ্পত্তি:' : 'Resolved:'} {new Date(complaint.resolvedAt).toLocaleDateString(isBengali ? 'bn-BD' : 'en-US')}</span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed pt-1">
                      {complaint.description}
                    </p>

                    {/* Resolution Block: Indented Note with Thin Top Rule & Small-Caps Label */}
                    {complaint.resolution && (
                      <div className="mt-3 pt-2.5 border-t border-stone-200 dark:border-stone-800 pl-3 border-l-2 border-stone-300 dark:border-stone-700">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400 font-semibold block mb-0.5">
                          {isBengali ? 'নিষ্পত্তি বিবরণী (Resolution Memo):' : 'Resolution Memo:'}
                        </span>
                        <p className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed font-normal">
                          {complaint.resolution}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* View Details Text Link with tiny icon */}
                  <div className="shrink-0 pt-1 sm:pt-0">
                    <button
                      onClick={() => {
                        setSelectedComplaint(complaint);
                        setShowComplaintModal(true);
                      }}
                      className="inline-flex items-center space-x-1 text-xs font-semibold text-[#0B5D3B] dark:text-emerald-400 hover:underline border-b border-[#0B5D3B] pb-0.5"
                      title={isBengali ? 'বিস্তারিত দেখুন' : 'View Details'}
                      aria-label="View complaint details"
                    >
                      <span>{isBengali ? 'বিস্তারিত' : 'View'}</span>
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Pending Applications (Table-Style List - Hairlines, Text Action Buttons) */}
      <section className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-[4px] shadow-sm overflow-hidden">
        
        {/* Table Section Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400 font-semibold">
              {isBengali ? 'আবেদন নিরীক্ষা রেজিস্টার' : 'APPLICATION SCRUTINY DESK'}
            </div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-0.5">
              {isBengali ? 'পেন্ডিং পেনশন আবেদনসমূহ' : 'Pending Applications'} ({pendingApplications.length})
            </h2>
          </div>
          <div className="text-xs font-mono text-stone-500 dark:text-stone-400">
            {isBengali ? 'ফরম নং ২.১ যাচাই' : 'Form 2.1 Audit'}
          </div>
        </div>

        {pendingApplications.length === 0 ? (
          <div className="p-10 text-center text-xs text-stone-500 dark:text-stone-400">
            {isBengali ? 'কোনো পেন্ডিং আবেদন পাওয়া যায়নি।' : 'No pending applications'}
          </div>
        ) : (
          <div>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-300 dark:border-stone-800 bg-[#FAF8F3] dark:bg-stone-950 font-mono text-[11px] text-stone-600 dark:text-stone-400 uppercase tracking-wider">
                    <th className="py-3 px-5 font-semibold">{isBengali ? 'আবেদনকারী ও দপ্তর' : 'Applicant & Dept'}</th>
                    <th className="py-3 px-5 font-semibold">{isBengali ? 'দাখিলের তারিখ' : 'Submitted'}</th>
                    <th className="py-3 px-5 font-semibold">{isBengali ? 'প্রাক্কলিত পেনশন' : 'Pension'}</th>
                    <th className="py-3 px-5 font-semibold">{isBengali ? 'স্থিতি' : 'Status'}</th>
                    <th className="py-3 px-5 font-semibold text-right">{isBengali ? 'কার্যক্রম' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                  {pendingApplications.map((app) => (
                    <tr 
                      key={app._id} 
                      className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors"
                    >
                      {/* Applicant (Name bold, application no & dept below) */}
                      <td className="py-4 px-5">
                        <div className="font-bold text-stone-900 dark:text-stone-100 text-sm font-sans">
                          {app.fullName}
                        </div>
                        <div className="text-[11px] font-mono text-stone-500 dark:text-stone-400 mt-0.5">
                          #{app.applicationNumber || app._id.slice(-6)} • {app.department || app.lastDesignation || 'Government Service'}
                        </div>
                      </td>

                      {/* Submitted Date */}
                      <td className="py-4 px-5 font-mono text-stone-600 dark:text-stone-400">
                        {new Date(app.submittedAt).toLocaleDateString(isBengali ? 'bn-BD' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>

                      {/* Pension Amount */}
                      <td className="py-4 px-5 font-mono font-bold text-stone-900 dark:text-stone-100">
                        ৳ {app.pensionAmount ? app.pensionAmount.toLocaleString('en-IN') : 'N/A'}
                      </td>

                      {/* Status (Plain amber text with small dot) */}
                      <td className="py-4 px-5">
                        {renderStatusDot(app.status)}
                      </td>

                      {/* Action Buttons: Labelled Text Buttons with Tooltip/Aria */}
                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex items-center space-x-2">
                          {/* View */}
                          <button
                            onClick={() => handleAction(app, 'view')}
                            className="px-2.5 py-1 text-xs font-semibold rounded-[3px] border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors"
                            title={isBengali ? 'আবেদন বিবরণী দেখুন' : 'View Application Details'}
                            aria-label="View application"
                          >
                            {isBengali ? 'দেখুন' : 'View'}
                          </button>

                          {/* Forward */}
                          <button
                            onClick={() => handleAction(app, 'forward')}
                            className="px-2.5 py-1 text-xs font-semibold rounded-[3px] bg-[#0B5D3B] hover:bg-[#074229] text-white transition-colors flex items-center space-x-1"
                            title={isBengali ? 'হেড অফিসে অগ্রায়ণ করুন' : 'Forward to Head Office'}
                            aria-label="Forward application to Head Office"
                          >
                            <span>{isBengali ? 'অগ্রায়ণ' : 'Forward'}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>

                          {/* Reject */}
                          <button
                            onClick={() => handleAction(app, 'reject')}
                            className="px-2.5 py-1 text-xs font-semibold rounded-[3px] border border-red-300 dark:border-red-800 text-[#C8102E] hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            title={isBengali ? 'সংশোধনের জন্য ফেরত পাঠান' : 'Return for Correction'}
                            aria-label="Reject application"
                          >
                            {isBengali ? 'প্রত্যাখ্যান' : 'Reject'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Block View */}
            <div className="md:hidden divide-y divide-stone-200 dark:divide-stone-800">
              {pendingApplications.map((app) => (
                <div key={app._id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                        {app.fullName}
                      </div>
                      <div className="text-[11px] font-mono text-stone-500 mt-0.5">
                        #{app.applicationNumber || app._id.slice(-6)} • {app.department || app.lastDesignation}
                      </div>
                    </div>
                    {renderStatusDot(app.status)}
                  </div>

                  <div className="flex justify-between text-xs font-mono pt-1 text-stone-600 dark:text-stone-400">
                    <span>{isBengali ? 'দাখিল:' : 'Date:'} {new Date(app.submittedAt).toLocaleDateString()}</span>
                    <span className="font-bold text-stone-900 dark:text-stone-100">৳ {app.pensionAmount?.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                    <button
                      onClick={() => handleAction(app, 'view')}
                      className="px-2.5 py-1 text-xs font-semibold rounded-[3px] border border-stone-300 text-stone-700"
                    >
                      {isBengali ? 'দেখুন' : 'View'}
                    </button>
                    <button
                      onClick={() => handleAction(app, 'forward')}
                      className="px-2.5 py-1 text-xs font-semibold rounded-[3px] bg-[#0B5D3B] text-white"
                    >
                      {isBengali ? 'অগ্রায়ণ' : 'Forward'}
                    </button>
                    <button
                      onClick={() => handleAction(app, 'reject')}
                      className="px-2.5 py-1 text-xs font-semibold rounded-[3px] border border-red-300 text-[#C8102E]"
                    >
                      {isBengali ? 'প্রত্যাখ্যান' : 'Reject'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </section>

    </div>
  );

  // =========================================================
  // ALL APPLICATIONS TAB VIEW
  // =========================================================
  const renderApplications = () => (
    <div className="space-y-6 font-sans text-stone-900 dark:text-stone-100 max-w-6xl mx-auto">
      <div className="border-b border-stone-300 dark:border-stone-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
          {activeTab === 'reviews' 
            ? (isBengali ? 'নিরীক্ষিত আবেদন ইতিহাস' : 'Audited Application History')
            : (isBengali ? 'সকল পেনশন আবেদন' : 'All Applications')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
          {isBengali ? 'হিসাবরক্ষণ ডেস্কে রক্ষিত কেন্দ্রীয় আবেদন রেজিস্টার' : 'Complete electronic records of civilian pension claims'}
        </p>
      </div>

      <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-[4px] shadow-sm overflow-hidden">
        {allApps.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-500">
            {isBengali ? 'কোনো আবেদন পাওয়া যায়নি।' : 'No applications found'}
          </div>
        ) : (
          <div className="divide-y divide-stone-200 dark:divide-stone-800">
            {allApps.map((application) => (
              <div key={application._id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">
                <div>
                  <div className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                    {application.fullName}
                  </div>
                  <div className="text-[11px] font-mono text-stone-500 mt-0.5">
                    #{application.applicationNumber || application._id.slice(-6)} • {application.department || application.lastDesignation}
                  </div>
                  <div className="text-xs text-stone-500 font-mono mt-1">
                    {isBengali ? 'দাখিলের তারিখ:' : 'Submitted:'} {new Date(application.submittedAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {renderStatusDot(application.status)}
                  <button
                    onClick={() => handleAction(application, 'view')}
                    className="px-3 py-1 text-xs font-semibold rounded-[3px] border border-stone-300 dark:border-stone-700 hover:border-stone-500 text-stone-700 dark:text-stone-300"
                  >
                    {isBengali ? 'বিস্তারিত দেখুন' : 'View Details'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // =========================================================
  // COMPLAINT DETAILS MODAL
  // =========================================================
  const renderComplaintModal = () => {
    if (!showComplaintModal || !selectedComplaint) return null;

    return (
      <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-[4px] p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
          
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3 mb-5">
            <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2">
              <Flag className="w-4 h-4 text-[#C8102E]" />
              <span>{isBengali ? 'লাল পতাকা অভিযোগ বিবরণী' : 'Red Flag Complaint Details'}</span>
            </h3>
            <button
              onClick={() => setShowComplaintModal(false)}
              className="text-stone-400 hover:text-stone-700 p-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div className="border-l-4 border-[#C8102E] bg-stone-100 dark:bg-stone-800 p-3 rounded-[2px]">
              <span className="font-bold text-[#C8102E] block uppercase tracking-wider text-[10px] font-mono">
                {isBengali ? 'প্রশাসনিক লাল পতাকা সতর্কতা' : 'ADMINISTRATIVE RED FLAG RECORD'}
              </span>
              <p className="text-stone-700 dark:text-stone-300 mt-0.5">
                {isBengali 
                  ? 'এই অভিযোগটি তদন্তান্তে সত্য প্রমাণিত হওয়ায় আপনার হিসাবরক্ষণ ডেস্কের বিরুদ্ধে লাল পতাকা জারি করা হয়েছে।' 
                  : 'This complaint was investigated and confirmed, resulting in a red flag warning against your scrutiny desk.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2 border-y border-stone-200 dark:border-stone-800 font-mono">
              <div>
                <span className="text-stone-500 block">{isBengali ? 'অভিযোগ ট্র্যাকিং আইডি:' : 'Complaint ID:'}</span>
                <span className="font-bold text-stone-900 dark:text-stone-100">
                  #{selectedComplaint.complaintNumber || selectedComplaint._id.slice(-6)}
                </span>
              </div>
              <div>
                <span className="text-stone-500 block">{isBengali ? 'শ্রেণীবিভাগ:' : 'Category:'}</span>
                <span className="font-bold text-stone-900 dark:text-stone-100 capitalize">
                  {selectedComplaint.category || 'Dispute'}
                </span>
              </div>
              <div>
                <span className="text-stone-500 block">{isBengali ? 'দাখিলের তারিখ:' : 'Submitted:'}</span>
                <span>{new Date(selectedComplaint.submittedAt).toLocaleDateString()}</span>
              </div>
              {selectedComplaint.resolvedAt && (
                <div>
                  <span className="text-stone-500 block">{isBengali ? 'নিষ্পত্তির তারিখ:' : 'Resolved:'}</span>
                  <span>{new Date(selectedComplaint.resolvedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            <div>
              <span className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                {isBengali ? 'বিষয়:' : 'Subject:'}
              </span>
              <p className="font-bold text-stone-900 dark:text-stone-100">{selectedComplaint.subject}</p>
            </div>

            <div>
              <span className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                {isBengali ? 'অভিযোগের বিবরণ:' : 'Description:'}
              </span>
              <p className="text-stone-700 dark:text-stone-300 leading-relaxed bg-[#FAF8F3] dark:bg-stone-800 p-3 rounded-[2px] border border-stone-200 dark:border-stone-700">
                {selectedComplaint.description}
              </p>
            </div>

            {selectedComplaint.resolution && (
              <div className="border-l-2 border-stone-400 pl-3 pt-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 block mb-0.5">
                  {isBengali ? 'নিষ্পত্তি আদেশ (Resolution):' : 'Official Resolution:'}
                </span>
                <p className="text-stone-900 dark:text-stone-100 font-medium">{selectedComplaint.resolution}</p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-3 border-t border-stone-200 dark:border-stone-800 flex justify-end">
            <button
              onClick={() => setShowComplaintModal(false)}
              className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-[3px] text-xs font-semibold"
            >
              {isBengali ? 'বন্ধ করুন' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // =========================================================
  // APPLICATION ACTION & DETAILS MODAL
  // =========================================================
  const renderModal = () => {
    if (!showModal || !selectedApplication) return null;

    return (
      <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-[4px] p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
          
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3 mb-5">
            <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
              {actionType === 'view' ? (isBengali ? 'পেনশন আবেদন ফরম ২.১ বিবরণী' : 'Application Details') : 
               actionType === 'forward' ? (isBengali ? 'হেড অফিসে অগ্রায়ন নিশ্চিতকরণ' : 'Forward Application to Head Office') : 
               (isBengali ? 'আবেদন প্রত্যাখ্যান ও সংশোধনের নির্দেশ' : 'Reject Application & Return for Correction')}
            </h3>
            <button
              onClick={() => setShowModal(false)}
              className="text-stone-400 hover:text-stone-700 p-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {actionType === 'view' && (
            <div className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
                <div>
                  <span className="text-stone-500 block">{isBengali ? 'আবেদনকারীর নাম:' : 'Full Name:'}</span>
                  <p className="font-bold text-stone-900 dark:text-stone-100 text-sm">{selectedApplication.fullName}</p>
                </div>
                <div>
                  <span className="text-stone-500 block">{isBengali ? 'জাতীয় পরিচয়পত্র নম্বর:' : 'NID Number:'}</span>
                  <p className="font-mono font-bold text-stone-900 dark:text-stone-100">{selectedApplication.nidNumber}</p>
                </div>
                <div>
                  <span className="text-stone-500 block">{isBengali ? 'সর্বশেষ পদবি:' : 'Last Designation:'}</span>
                  <p className="text-stone-900 dark:text-stone-100 font-medium">{selectedApplication.lastDesignation}</p>
                </div>
                <div>
                  <span className="text-stone-500 block">{isBengali ? 'মন্ত্রণালয় / অধিদপ্তর:' : 'Department:'}</span>
                  <p className="text-stone-900 dark:text-stone-100 font-medium">{selectedApplication.department}</p>
                </div>
                <div>
                  <span className="text-stone-500 block">{isBengali ? 'যোগ্য চাকরিকাল:' : 'Service Length:'}</span>
                  <p className="font-mono text-stone-900 dark:text-stone-100">{selectedApplication.jobAge} {isBengali ? 'বছর' : 'years'}</p>
                </div>
                <div>
                  <span className="text-stone-500 block">{isBengali ? 'সর্বশেষ মূল বেতন:' : 'Last Salary:'}</span>
                  <p className="font-mono font-bold text-stone-900 dark:text-stone-100">
                    ৳ {selectedApplication.lastSalary?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-stone-500 block">{isBengali ? 'প্রাক্কলিত পেনশন প্রাপ্য:' : 'Pension Amount:'}</span>
                  <p className="font-mono font-bold text-[#0B5D3B] dark:text-emerald-400 text-sm">
                    ৳ {selectedApplication.pensionAmount?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-stone-500 block">{isBengali ? 'ব্যাংক ও হিসাব নম্বর:' : 'Bank Details:'}</span>
                  <p className="text-stone-900 dark:text-stone-100 font-mono">
                    {selectedApplication.bankName} - {selectedApplication.accountNumber}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-[3px] font-semibold text-xs"
                >
                  {isBengali ? 'বন্ধ করুন' : 'Close'}
                </button>
              </div>
            </div>
          )}

          {(actionType === 'forward' || actionType === 'reject') && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                  {actionType === 'forward' 
                    ? (isBengali ? 'নিরীক্ষা মন্তব্য ও সুপারিশ (ঐচ্ছিক)' : 'Audit Scrutiny Comments (Optional)') 
                    : (isBengali ? 'প্রত্যাখ্যান / সংশোধনের নির্দিষ্ট কারণ *' : 'Reason for Rejection / Correction *')}
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-700 rounded-[3px] focus:outline-none focus:ring-1 focus:ring-[#0B5D3B]"
                  placeholder={actionType === 'forward' 
                    ? (isBengali ? 'হেড অফিসের সুবিধার্থে কোনো সুপারিশ থাকলে লিখুন...' : 'Add any recommendations for Head Office...') 
                    : (isBengali ? 'যে যে তথ্যে ত্রুটি রয়েছে তা স্পষ্টভাবে উল্লেখ করুন...' : 'Specify the exact discrepancies to be corrected...')}
                  required={actionType === 'reject'}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-stone-200 dark:border-stone-800">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-[3px] font-semibold"
                >
                  {isBengali ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  onClick={submitAction}
                  className={`px-5 py-2 text-white font-semibold rounded-[3px] transition-colors ${
                    actionType === 'forward' 
                      ? 'bg-[#0B5D3B] hover:bg-[#074229]' 
                      : 'bg-[#C8102E] hover:bg-red-800'
                  }`}
                >
                  {actionType === 'forward' 
                    ? (isBengali ? 'হেড অফিসে অগ্রায়ণ করুন' : 'Confirm & Forward') 
                    : (isBengali ? 'প্রত্যাখ্যান নিশ্চিত করুন' : 'Confirm Rejection')}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  };

  switch (activeTab) {
    case 'dashboard':
      return (
        <>
          {renderDashboard()}
          {renderModal()}
          {renderComplaintModal()}
        </>
      );
    case 'applications':
    case 'reviews':
      return (
        <>
          {renderApplications()}
          {renderModal()}
          {renderComplaintModal()}
        </>
      );
    default:
      return (
        <>
          {renderDashboard()}
          {renderModal()}
          {renderComplaintModal()}
        </>
      );
  }
};

export default AssistantAccountantDashboard;
