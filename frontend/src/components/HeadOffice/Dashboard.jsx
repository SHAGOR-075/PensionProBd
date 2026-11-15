import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { 
  Building2, 
  Users, 
  FileText, 
  CheckCircle2, 
  X, 
  AlertTriangle, 
  Flag,
  Plus,
  Eye,
  Award,
  ArrowRight,
  Printer,
  ShieldCheck,
  Clock,
  UserCheck,
  UserX
} from 'lucide-react';

const HeadOfficeDashboard = ({ activeTab: currentTab = 'dashboard' }) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { 
    applications, 
    complaints, 
    officers, 
    updateApplicationStatus, 
    updateComplaintStatus, 
    issueRedFlag, 
    addOfficer, 
    toggleOfficerStatus, 
    dashboardStats, 
    fetchApplications, 
    fetchComplaints, 
    fetchOfficers 
  } = useData();

  const isBengali = i18n.language === 'bn';

  const [activeTab, setActiveTab] = useState(currentTab || 'dashboard');
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showAppModal, setShowAppModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showAddOfficerModal, setShowAddOfficerModal] = useState(false);
  const [resolutionText, setResolutionText] = useState('');
  const [appFeedback, setAppFeedback] = useState('');

  // Add Officer Form State
  const [newOfficer, setNewOfficer] = useState({
    name: '',
    email: '',
    phone: '',
    address: 'Bangladesh Secretariat, Dhaka',
    designation: 'Assistant Accountant',
    department: 'Pension Department',
    userType: 'assistant_accountant'
  });

  useEffect(() => {
    if (fetchApplications) fetchApplications();
    if (fetchComplaints) fetchComplaints();
    if (fetchOfficers) fetchOfficers();
  }, [fetchApplications, fetchComplaints, fetchOfficers]);

  useEffect(() => {
    if (currentTab) setActiveTab(currentTab);
  }, [currentTab]);

  // Safe Array Wrappers to prevent any TypeError crashes
  const allApps = Array.isArray(applications) ? applications : [];
  const allComplaints = Array.isArray(complaints) ? complaints : [];
  const allOfficers = Array.isArray(officers) ? officers : [];

  const forwardedApplications = allApps.filter(a => a?.status === 'forwarded');
  const approvedApplications = allApps.filter(a => a?.status === 'approved');
  const pendingComplaints = allComplaints.filter(c => c?.status === 'pending');
  const activeOfficers = allOfficers.filter(o => o?.isActive);
  const redFlaggedOfficers = allOfficers.filter(o => (o?.redFlags || 0) > 0);

  // Handle Pension Final Approval / Sanction
  const handleApprovePension = async (appId) => {
    try {
      await updateApplicationStatus(appId, 'approved', appFeedback || (isBengali ? 'প্রধান কার্যালয় কর্তৃক চূড়ান্তভাবে পেনশন ও আনুতোষিক মঞ্জুরিকৃত (PPO Issued)।' : 'PPO Sanctioned by Head Office'));
      setShowAppModal(false);
      setSelectedApp(null);
      setAppFeedback('');
    } catch (error) {
      console.error('Approval failed:', error);
    }
  };

  // Handle Pension Rejection
  const handleRejectPension = async (appId) => {
    if (!appFeedback.trim()) {
      toast.error(isBengali ? 'আবেদন বাতিলের সুনির্দিষ্ট কারণ প্রদান করুন' : 'Specify reason for rejection');
      return;
    }
    try {
      await updateApplicationStatus(appId, 'rejected', appFeedback);
      setShowAppModal(false);
      setSelectedApp(null);
      setAppFeedback('');
    } catch (error) {
      console.error('Rejection failed:', error);
    }
  };

  // Handle Complaint Resolution
  const handleResolveComplaint = async (complaintId) => {
    if (!resolutionText.trim()) {
      toast.error(isBengali ? 'নিষ্পত্তির কারণ ও সিদ্ধান্ত প্রদান করুন' : 'Provide resolution decision');
      return;
    }
    try {
      await updateComplaintStatus(complaintId, 'resolved', resolutionText);
      setShowComplaintModal(false);
      setSelectedComplaint(null);
      setResolutionText('');
    } catch (error) {
      console.error('Complaint resolution failed:', error);
    }
  };

  // Handle Red Flag Issuance
  const handleRedFlag = async (complaintId) => {
    try {
      await issueRedFlag(complaintId);
      setShowComplaintModal(false);
      setSelectedComplaint(null);
    } catch (error) {
      console.error('Failed to issue red flag:', error);
    }
  };

  // Handle Add Officer
  const handleCreateOfficer = async (e) => {
    e.preventDefault();
    if (!newOfficer.name || !newOfficer.email) {
      toast.error(isBengali ? 'নাম ও ইমেইল আবশ্যক' : 'Name and email required');
      return;
    }
    try {
      await addOfficer(newOfficer);
      setShowAddOfficerModal(false);
      setNewOfficer({
        name: '',
        email: '',
        phone: '',
        address: 'Bangladesh Secretariat, Dhaka',
        designation: 'Assistant Accountant',
        department: 'Pension Department',
        userType: 'assistant_accountant'
      });
    } catch (error) {
      console.error('Failed to add officer:', error);
    }
  };

  return (
    <div className="space-y-8 font-sans text-stone-900 dark:text-stone-100 max-w-6xl mx-auto">
      
      {/* ========================================================= */}
      {/* 1. WELCOME AREA (PAPER STYLE, EDITORIAL GOVERNMENT HEADER) */}
      {/* ========================================================= */}
      <section className="border-b border-stone-300 dark:border-stone-800 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
          <span className="font-mono text-xs uppercase tracking-widest text-[#0B5D3B] dark:text-emerald-400 font-semibold">
            {isBengali ? 'প্রধান কার্যালয় ও কেন্দ্রীয় প্রশাসন' : 'EXECUTIVE DIRECTORATE & ADMINISTRATION'}
          </span>
          <span className="text-xs font-mono text-stone-500 dark:text-stone-400">
            {isBengali ? 'সর্বশেষ হালনাগাদ:' : 'Last updated:'} {new Date().toLocaleDateString(isBengali ? 'bn-BD' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
          {isBengali ? `সম্মানিত ${user?.name || 'মহাপরিচালক'}, স্বাগতম` : `Welcome, ${user?.name || 'Executive Officer'}`}
        </h1>

        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-3xl leading-relaxed">
          {isBengali 
            ? 'পেনশন ফাইল চূড়ান্ত অনুমোদন (PPO মঞ্জুরি), হিসাবরক্ষণ কর্মকর্তা নিয়ন্ত্রণ, নাগরিক অভিযোগ নিষ্পত্তি এবং দেশব্যাপী কেন্দ্রীয় পরিসংখ্যান ব্যবস্থাপনা।' 
            : 'Final executive sanction of Form 2.1 dossiers, disciplinary oversight, accounts officer roster management, and national pension statistical analytics.'}
        </p>
      </section>

      {/* ========================================================= */}
      {/* 2. SUMMARY FIGURES (ONE HORIZONTAL STRIP, NO CLUTTER)     */}
      {/* ========================================================= */}
      <section>
        <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-[4px] shadow-sm grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-stone-200 dark:divide-stone-800">
          
          {/* Pending Sanctions */}
          <div className="p-5 sm:p-6">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {isBengali ? 'অনুমোদন অপেক্ষমাণ' : 'Pending Sanction'}
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-amber-600 dark:text-amber-400 mt-2">
              {forwardedApplications.length}
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-mono">
              {isBengali ? 'PPO আদেশের অপেক্ষায়' : 'Forwarded by audits'}
            </div>
          </div>

          {/* Total Approved */}
          <div className="p-5 sm:p-6">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {isBengali ? 'মঞ্জুরিকৃত পেনশন' : 'Total Approved'}
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#0B5D3B] dark:text-emerald-400 mt-2">
              {approvedApplications.length}
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-mono">
              {isBengali ? 'ইএফটি সক্রিয় নথি' : 'PPO issued & EFT ready'}
            </div>
          </div>

          {/* Pending Grievances */}
          <div className="p-5 sm:p-6">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {isBengali ? 'তদন্তাধীন অভিযোগ' : 'Pending Grievances'}
            </div>
            <div className={`text-3xl sm:text-4xl font-serif font-bold mt-2 ${
              pendingComplaints.length > 0 ? 'text-[#C8102E]' : 'text-stone-900 dark:text-stone-100'
            }`}>
              {pendingComplaints.length}
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-mono">
              {isBengali ? 'শৃঙ্খলা সেল পর্যালোচনা' : 'Awaiting resolution'}
            </div>
          </div>

          {/* Active Officers */}
          <div className="p-5 sm:p-6">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {isBengali ? 'সক্রিয় হিসাবরক্ষণ কর্মকর্তা' : 'Active Officers'}
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-2">
              {activeOfficers.length}
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-mono">
              {isBengali ? 'হিসাবরক্ষণ ডেস্কে নিয়োজিত' : 'Authorized audit desks'}
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. TAB NAVIGATION BAR                                     */}
      {/* ========================================================= */}
      <section className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-[4px] shadow-sm overflow-hidden">
        
        {/* Navigation Tabs Header */}
        <div className="border-b border-stone-200 dark:border-stone-800 px-4 sm:px-6 py-3 bg-[#FAF8F3] dark:bg-stone-950 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1 text-xs">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-[3px] font-semibold transition-colors ${
                activeTab === 'dashboard' || activeTab === 'applications'
                  ? 'bg-[#0B5D3B] text-white'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800'
              }`}
            >
              {isBengali ? 'চূড়ান্ত অনুমোদন ডেস্ক (PPO)' : 'Sanction Desk (PPO)'}
            </button>

            <button
              onClick={() => setActiveTab('complaints')}
              className={`px-3 py-1.5 rounded-[3px] font-semibold transition-colors ${
                activeTab === 'complaints'
                  ? 'bg-[#0B5D3B] text-white'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800'
              }`}
            >
              {isBengali ? 'নাগরিক অভিযোগ ও শৃঙ্খলা' : 'Grievance Resolution'}
            </button>

            <button
              onClick={() => setActiveTab('officers')}
              className={`px-3 py-1.5 rounded-[3px] font-semibold transition-colors ${
                activeTab === 'officers'
                  ? 'bg-[#0B5D3B] text-white'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800'
              }`}
            >
              {isBengali ? 'কর্মকর্তা ব্যবস্থাপনা' : 'Officer Accounts'}
            </button>

            <button
              onClick={() => setActiveTab('red-flags')}
              className={`px-3 py-1.5 rounded-[3px] font-semibold transition-colors ${
                activeTab === 'red-flags'
                  ? 'bg-[#0B5D3B] text-white'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800'
              }`}
            >
              {isBengali ? 'লাল পতাকা মনিটরিং' : 'Red Flag Monitoring'}
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`px-3 py-1.5 rounded-[3px] font-semibold transition-colors ${
                activeTab === 'reports'
                  ? 'bg-[#0B5D3B] text-white'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800'
              }`}
            >
              {isBengali ? 'কেন্দ্রীয় প্রতিবেদন' : 'Central Reports'}
            </button>
          </div>

          <div className="text-[11px] font-mono text-stone-500">
            CGA-DIRECTORATE
          </div>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: PENSION FINAL SANCTION DESK (PPO)                  */}
        {/* ========================================================= */}
        {(activeTab === 'dashboard' || activeTab === 'applications') && (
          <div className="p-5 sm:p-6 space-y-4">
            <div className="border-b border-stone-200 dark:border-stone-800 pb-3">
              <h3 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100">
                {isBengali ? 'সহকারী হিসাবরক্ষক কর্তৃক অগ্রায়িত পেনশন নথি' : 'Applications Forwarded by Audit Desks'}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                {isBengali ? 'যাচাইপূর্বক চূড়ান্ত পেনশন পেমেন্ট আদেশ (PPO) মঞ্জুর করুন বা নির্দেশিকা প্রদান করুন' : 'Grant executive sanction or return with administrative remarks'}
              </p>
            </div>

            {forwardedApplications.length === 0 ? (
              <div className="text-center py-12 text-xs text-stone-500 dark:text-stone-400">
                {isBengali ? 'কোনো পেনশন আবেদন অনুমোদনের জন্য পেন্ডিং নেই।' : 'No applications pending sanction'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-stone-300 dark:border-stone-800 bg-[#FAF8F3] dark:bg-stone-950 font-mono text-[11px] text-stone-600 dark:text-stone-400 uppercase tracking-wider">
                      <th className="py-2.5 px-4 font-semibold">{isBengali ? 'ট্র্যাকিং নম্বর' : 'Tracking ID'}</th>
                      <th className="py-2.5 px-4 font-semibold">{isBengali ? 'আবেদনকারী ও দপ্তর' : 'Applicant'}</th>
                      <th className="py-2.5 px-4 font-semibold">{isBengali ? 'মূল বেতন ও পেনশন' : 'Pay & Pension'}</th>
                      <th className="py-2.5 px-4 font-semibold">{isBengali ? 'চাকরিকাল' : 'Service'}</th>
                      <th className="py-2.5 px-4 font-semibold">{isBengali ? 'অগ্রায়নের তারিখ' : 'Date'}</th>
                      <th className="py-2.5 px-4 font-semibold text-right">{isBengali ? 'মঞ্জুরি সিদ্ধান্ত' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                    {forwardedApplications.map(app => (
                      <tr key={app._id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#0B5D3B] dark:text-emerald-400">
                          #{app.applicationNumber || app._id.slice(-8)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-stone-900 dark:text-stone-100">{app.fullName}</div>
                          <div className="text-[11px] text-stone-500">{app.lastDesignation} ({app.department})</div>
                        </td>
                        <td className="py-3 px-4 font-mono">
                          <div className="text-stone-600 dark:text-stone-400">বেতন: ৳ {app.lastSalary?.toLocaleString()}</div>
                          <div className="font-bold text-[#0B5D3B] dark:text-emerald-400">পেনশন: ৳ {app.pensionAmount?.toLocaleString()}</div>
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-stone-800 dark:text-stone-200">
                          {app.jobAge} {isBengali ? 'বছর' : 'Yrs'}
                        </td>
                        <td className="py-3 px-4 font-mono text-stone-500">
                          {new Date(app.submittedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedApp(app);
                              setShowAppModal(true);
                            }}
                            className="px-3 py-1.5 rounded-[3px] bg-[#0B5D3B] hover:bg-[#074229] text-white font-semibold text-xs transition-colors"
                          >
                            {isBengali ? 'PPO মঞ্জুরি আদেশ' : 'Issue PPO Sanction'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: CITIZEN GRIEVANCES & DISCIPLINARY DESK            */}
        {/* ========================================================= */}
        {activeTab === 'complaints' && (
          <div className="p-5 sm:p-6 space-y-4">
            <div className="border-b border-stone-200 dark:border-stone-800 pb-3">
              <h3 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100">
                {isBengali ? 'নাগরিক অভিযোগ প্রতিকার সেল (GRS)' : 'Grievance Redress & Disciplinary Cell'}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                {isBengali ? 'অভিযোগ তদন্তপূর্বক প্রশাসনিক সিদ্ধান্ত নিন অথবা সংশ্লিষ্ট কর্মকর্তাকে লাল পতাকা জারি করুন' : 'Review complaints, record official resolutions, or penalize with Red Flags'}
              </p>
            </div>

            {allComplaints.length === 0 ? (
              <div className="text-center py-12 text-xs text-stone-500 dark:text-stone-400">
                {isBengali ? 'কোনো অভিযোগ নথিভুক্ত নেই।' : 'No grievances on record'}
              </div>
            ) : (
              <div className="space-y-3">
                {allComplaints.map(c => (
                  <div
                    key={c._id}
                    className="border-l-[3px] border-stone-300 dark:border-stone-700 bg-[#FAF8F3]/60 dark:bg-stone-900 p-4 rounded-[2px] border-y border-r border-stone-200 dark:border-stone-800 space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <div>
                        <div className="flex items-baseline space-x-2">
                          <span className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">
                            {c.subject}
                          </span>
                          {c.redFlagIssued && (
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#C8102E] font-bold">
                              🚩 RED FLAG PENALIZED
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 font-mono mt-0.5">
                          {isBengali ? 'অভিযুক্ত কর্মকর্তা:' : 'Officer:'} <strong>{c.officerName || c.officerId?.name || 'Assigned Officer'}</strong> • {new Date(c.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className={`text-xs font-mono font-bold capitalize ${
                          c.status === 'resolved' ? 'text-[#0B5D3B]' : 'text-amber-600'
                        }`}>
                          ● {c.status}
                        </span>

                        {c.status !== 'resolved' && (
                          <button
                            onClick={() => {
                              setSelectedComplaint(c);
                              setShowComplaintModal(true);
                            }}
                            className="px-3 py-1 bg-[#0B5D3B] hover:bg-[#074229] text-white font-semibold text-xs rounded-[3px]"
                          >
                            {isBengali ? 'তদন্ত ও নিষ্পত্তি' : 'Investigate'}
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed bg-white dark:bg-stone-800 p-3 rounded-[2px] border border-stone-200 dark:border-stone-700">
                      {c.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: OFFICER ROSTER & MANAGEMENT                       */}
        {/* ========================================================= */}
        {activeTab === 'officers' && (
          <div className="p-5 sm:p-6 space-y-4">
            <div className="border-b border-stone-200 dark:border-stone-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100">
                  {isBengali ? 'হিসাবরক্ষণ কর্মকর্তা তালিকা ও নিয়ন্ত্রণ' : 'Accounts Officers Roster'}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  {isBengali ? 'সহকারী হিসাবরক্ষকদের স্ট্যাটাস, কর্মক্ষমতা ও নতুন অ্যাকাউন্ট তৈরি' : 'Manage authorized accountants and scrutiny desk access'}
                </p>
              </div>

              <button
                onClick={() => setShowAddOfficerModal(true)}
                className="px-3.5 py-1.5 rounded-[3px] bg-[#0B5D3B] hover:bg-[#074229] text-white font-semibold text-xs flex items-center space-x-1.5 self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isBengali ? 'নতুন কর্মকর্তা যুক্ত করুন' : 'Add New Officer'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allOfficers.map(off => (
                <div
                  key={off._id || off.id}
                  className="p-4 rounded-[3px] border border-stone-200 dark:border-stone-800 bg-[#FAF8F3]/50 dark:bg-stone-900 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center space-x-2">
                      <span>{off.name}</span>
                      {(off.redFlags || 0) > 0 && (
                        <span className="text-[10px] font-mono text-[#C8102E] font-bold">
                          🚩 {off.redFlags} Flags
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-mono text-stone-500">{off.email}</div>
                    <div className="text-[11px] text-stone-400 capitalize">{off.designation || off.userType}</div>
                  </div>

                  <button
                    onClick={() => toggleOfficerStatus(off._id || off.id)}
                    className={`px-3 py-1 rounded-[3px] text-xs font-semibold border transition-colors ${
                      off.isActive 
                        ? 'border-emerald-300 bg-emerald-50 text-[#0B5D3B] hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300' 
                        : 'border-red-300 bg-red-50 text-[#C8102E] hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300'
                    }`}
                  >
                    {off.isActive ? (isBengali ? 'সক্রিয় (Active)' : 'Active') : (isBengali ? 'স্থগিত (Disabled)' : 'Disabled')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: RED FLAG MONITORING (PREVIOUSLY MISSING TAB)       */}
        {/* ========================================================= */}
        {activeTab === 'red-flags' && (
          <div className="p-5 sm:p-6 space-y-4">
            <div className="border-b border-stone-200 dark:border-stone-800 pb-3">
              <h3 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2">
                <Flag className="w-4 h-4 text-[#C8102E]" />
                <span>{isBengali ? 'শৃঙ্খলা ও লাল পতাকা মনিটরিং' : 'Disciplinary & Red Flag Monitoring'}</span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                {isBengali ? 'যে সকল কর্মকর্তার বিরুদ্ধে গাফিলতি বা অসঙ্গতির কারণে লাল পতাকা জারি হয়েছে তাদের তালিকা' : 'Oversight of accountants with active red flag penalties'}
              </p>
            </div>

            {redFlaggedOfficers.length === 0 ? (
              <div className="text-center py-12 text-xs text-stone-500 dark:text-stone-400">
                {isBengali ? 'বর্তমানে কোনো কর্মকর্তার বিরুদ্ধে সক্রিয় লাল পতাকা নেই।' : 'No officers currently penalized with red flags'}
              </div>
            ) : (
              <div className="space-y-3">
                {redFlaggedOfficers.map(off => (
                  <div key={off._id || off.id} className="p-4 border-l-[3px] border-[#C8102E] border-y border-r border-stone-200 dark:border-stone-800 bg-[#FAF8F3]/50 dark:bg-stone-900 rounded-[2px] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                        {off.name}
                      </div>
                      <div className="text-xs font-mono text-stone-500">{off.email} • {off.designation}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm font-bold text-[#C8102E]">
                        {off.redFlags} / 3 Flags
                      </div>
                      <div className="text-[11px] font-mono text-stone-500">
                        {off.redFlags >= 3 ? (isBengali ? 'স্থগিতকরণ জারি' : 'Auto Suspended') : (isBengali ? 'সতর্কতা সক্রিয়' : 'Warning Active')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: CENTRAL STATISTICAL REPORTS                        */}
        {/* ========================================================= */}
        {activeTab === 'reports' && (
          <div className="p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800 gap-2">
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100">
                  {isBengali ? 'সমন্বিত জাতীয় পেনশন পরিসংখ্যান প্রতিবেদন' : 'Comprehensive National Pension Reports'}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  {isBengali ? 'মন্ত্রণালয়ভিত্তিক পেনশন মঞ্জুরি ও বার্ষিক আর্থিক দায়বদ্ধতা বিশ্লেষণ' : 'Directorate statistical summaries and financial liability analytics'}
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-[3px] bg-stone-800 text-white font-semibold text-xs flex items-center space-x-1.5 self-start sm:self-auto"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{isBengali ? 'প্রতিবেদন প্রিন্ট করুন' : 'Print Report'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-5 rounded-[3px] border border-stone-300 dark:border-stone-800 bg-[#FAF8F3]/60 dark:bg-stone-900">
                <div className="text-xs text-stone-600 dark:text-stone-400 font-semibold">{isBengali ? 'মোট প্রাপ্ত আবেদন' : 'Total Received'}</div>
                <div className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-1">{allApps.length}</div>
              </div>
              <div className="p-5 rounded-[3px] border border-stone-300 dark:border-stone-800 bg-[#FAF8F3]/60 dark:bg-stone-900">
                <div className="text-xs text-[#0B5D3B] dark:text-emerald-400 font-semibold">{isBengali ? 'নিষ্পত্তিকৃত ও অনুমোদিত' : 'Approved & Settled'}</div>
                <div className="text-3xl font-serif font-bold text-[#0B5D3B] dark:text-emerald-400 mt-1">{approvedApplications.length}</div>
              </div>
              <div className="p-5 rounded-[3px] border border-stone-300 dark:border-stone-800 bg-[#FAF8F3]/60 dark:bg-stone-900">
                <div className="text-xs text-amber-700 dark:text-amber-400 font-semibold">{isBengali ? 'প্রক্রিয়াধীন ফাইল' : 'Processing Files'}</div>
                <div className="text-3xl font-serif font-bold text-amber-700 dark:text-amber-400 mt-1">
                  {allApps.filter(a => a?.status === 'pending' || a?.status === 'forwarded').length}
                </div>
              </div>
            </div>
          </div>
        )}

      </section>

      {/* ========================================================= */}
      {/* MODAL 1: PPO SANCTION ORDER                               */}
      {/* ========================================================= */}
      {showAppModal && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 rounded-[4px] max-w-xl w-full p-6 sm:p-8 shadow-xl border border-stone-300 dark:border-stone-800 space-y-4">
            <div className="border-b border-stone-200 dark:border-stone-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100">
                  {isBengali ? 'পেনশন পেমেন্ট আদেশ (PPO) চূড়ান্ত অনুমোদন' : 'PPO Final Sanction Order'}
                </h3>
                <p className="text-xs text-stone-500 font-mono mt-0.5">
                  {selectedApp.fullName} • {isBengali ? 'পেনশন:' : 'Pension:'} ৳ {selectedApp.pensionAmount?.toLocaleString()}
                </p>
              </div>
              <button onClick={() => setShowAppModal(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                {isBengali ? 'মঞ্জুরি আদেশ ও মন্তব্য (PPO Order Note):' : 'Sanction Order Note:'}
              </label>
              <textarea
                rows={3}
                value={appFeedback}
                onChange={(e) => setAppFeedback(e.target.value)}
                placeholder={isBengali ? 'উদা: সন্তোষজনক চাকরির ভিত্তিতে চূড়ান্ত পেনশন ও আনুতোষিক মঞ্জুর করা হলো।' : 'Official sanction remarks...'}
                className="w-full px-3 py-2 rounded-[3px] border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs focus:ring-1 focus:ring-[#0B5D3B]"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-stone-200 dark:border-stone-800">
              <button
                type="button"
                onClick={() => setShowAppModal(false)}
                className="px-3 py-1.5 rounded-[3px] border border-stone-300 text-xs font-semibold text-stone-700 dark:text-stone-300"
              >
                {isBengali ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => handleRejectPension(selectedApp._id)}
                className="px-3.5 py-1.5 rounded-[3px] border border-red-300 text-[#C8102E] hover:bg-red-50 text-xs font-semibold"
              >
                {isBengali ? 'বাতিল করুন' : 'Reject'}
              </button>
              <button
                type="button"
                onClick={() => handleApprovePension(selectedApp._id)}
                className="px-5 py-1.5 rounded-[3px] bg-[#0B5D3B] hover:bg-[#074229] text-white font-semibold text-xs"
              >
                {isBengali ? 'চূড়ান্ত অনুমোদন ও PPO জারি' : 'Sanction & Issue PPO'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: COMPLAINT RESOLUTION & RED FLAG                  */}
      {/* ========================================================= */}
      {showComplaintModal && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 rounded-[4px] max-w-xl w-full p-6 sm:p-8 shadow-xl border border-stone-300 dark:border-stone-800 space-y-4">
            <div className="border-b border-stone-200 dark:border-stone-800 pb-3 flex items-center justify-between">
              <h3 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100">
                {isBengali ? 'অভিযোগ তদন্ত ও প্রশাসনিক নিষ্পত্তি' : 'Grievance Resolution & Penalty'}
              </h3>
              <button onClick={() => setShowComplaintModal(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-800 p-3 rounded-[2px] border border-stone-200 dark:border-stone-700 leading-relaxed">
              <strong>{isBengali ? 'অভিযোগ:' : 'Subject:'}</strong> {selectedComplaint.subject} <br />
              <strong>{isBengali ? 'বিবরণ:' : 'Details:'}</strong> {selectedComplaint.description}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                {isBengali ? 'প্রশাসনিক সিদ্ধান্ত ও নিষ্পত্তি আদেশ:' : 'Administrative Decision:'}
              </label>
              <textarea
                rows={3}
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                placeholder={isBengali ? 'উদা: তদন্তে অভিযোগের সত্যতা পাওয়া গিয়েছে, ফাইল ছাড়করণের নির্দেশ প্রদান করা হলো।' : 'Official resolution directive...'}
                className="w-full px-3 py-2 rounded-[3px] border border-stone-300 dark:border-stone-700 text-xs bg-white dark:bg-stone-800"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-stone-200 dark:border-stone-800">
              <button
                type="button"
                onClick={() => handleRedFlag(selectedComplaint._id)}
                className="w-full sm:w-auto px-3.5 py-1.5 rounded-[3px] border border-red-300 text-[#C8102E] hover:bg-red-50 text-xs font-semibold flex items-center justify-center space-x-1"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{isBengali ? 'কর্মকর্তাকে লাল পতাকা (Red Flag) দিন' : 'Issue Red Flag Penalty'}</span>
              </button>

              <div className="flex space-x-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setShowComplaintModal(false)}
                  className="px-3.5 py-1.5 rounded-[3px] border border-stone-300 text-xs font-semibold text-stone-700 dark:text-stone-300"
                >
                  {isBengali ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={() => handleResolveComplaint(selectedComplaint._id)}
                  className="px-4 py-1.5 rounded-[3px] bg-[#0B5D3B] hover:bg-[#074229] text-white text-xs font-semibold"
                >
                  {isBengali ? 'নিষ্পত্তি সম্পন্ন করুন' : 'Confirm Resolution'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: ADD OFFICER                                      */}
      {/* ========================================================= */}
      {showAddOfficerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 rounded-[4px] max-w-md w-full p-6 shadow-xl border border-stone-300 dark:border-stone-800 space-y-4">
            <div className="border-b border-stone-200 dark:border-stone-800 pb-3 flex items-center justify-between">
              <h3 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100">
                {isBengali ? 'নতুন হিসাবরক্ষণ কর্মকর্তা অ্যাকাউন্ট তৈরি' : 'Create Accounts Officer Account'}
              </h3>
              <button onClick={() => setShowAddOfficerModal(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOfficer} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1 uppercase tracking-wider text-[11px] text-stone-700 dark:text-stone-300">
                  {isBengali ? 'পূর্ণ নাম *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={newOfficer.name}
                  onChange={(e) => setNewOfficer(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={isBengali ? 'উদা: মো: আনিসুর রহমান' : 'e.g. Md. Anisur Rahman'}
                  className="w-full px-3 py-2 rounded-[3px] border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 uppercase tracking-wider text-[11px] text-stone-700 dark:text-stone-300">
                  {isBengali ? 'অফিসিয়াল ইমেইল *' : 'Official Email *'}
                </label>
                <input
                  type="email"
                  required
                  value={newOfficer.email}
                  onChange={(e) => setNewOfficer(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="name@pensionprobd.gov.bd"
                  className="w-full px-3 py-2 rounded-[3px] border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 uppercase tracking-wider text-[11px] text-stone-700 dark:text-stone-300">
                  {isBengali ? 'পদবি' : 'Designation'}
                </label>
                <input
                  type="text"
                  value={newOfficer.designation}
                  onChange={(e) => setNewOfficer(prev => ({ ...prev, designation: e.target.value }))}
                  className="w-full px-3 py-2 rounded-[3px] border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowAddOfficerModal(false)}
                  className="px-3.5 py-1.5 rounded-[3px] border border-stone-300 text-xs font-semibold text-stone-700"
                >
                  {isBengali ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-[3px] bg-[#0B5D3B] hover:bg-[#074229] text-white text-xs font-semibold"
                >
                  {isBengali ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create Officer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default HeadOfficeDashboard;
