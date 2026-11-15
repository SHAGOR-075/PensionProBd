import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  TrendingUp, 
  Calendar, 
  Download, 
  User, 
  DollarSign, 
  Eye, 
  RefreshCw, 
  MapPin, 
  Phone, 
  Mail, 
  Building2, 
  Edit3,
  ShieldCheck,
  Award,
  CreditCard
} from 'lucide-react';

const ApplicationStatus = ({ onEditApplication }) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { applications, fetchApplications, loading } = useData();
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const isBengali = i18n.language === 'bn';

  const userApplications = applications.filter(app => {
    const appUserId = app.userId?._id?.toString() || app.userId?.toString() || app.userId;
    return appUserId === user.id;
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchApplications();
    setRefreshing(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return {
          label: isBengali ? 'হিসাব নিরীক্ষাধীন' : 'Under Audit',
          color: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
        };
      case 'forwarded':
        return {
          label: isBengali ? 'হেড অফিসে অগ্রায়িত' : 'Forwarded to Head Office',
          color: 'bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800'
        };
      case 'approved':
        return {
          label: isBengali ? 'পেনশন অনুমোদিত' : 'Pension Approved',
          color: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
        };
      case 'rejected':
        return {
          label: isBengali ? 'সংশোধনের নির্দেশ' : 'Needs Correction',
          color: 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
        };
      default:
        return {
          label: isBengali ? 'প্রক্রিয়াধীন' : 'Processing',
          color: 'bg-gray-100 text-gray-800 border-gray-300'
        };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center space-x-2">
            <Clock className="w-6 h-6 text-bd-green-600" />
            <span>{isBengali ? 'আবেদনের স্থিতি ও লাইভ ট্র্যাকিং' : 'Live Application Tracking'}</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {isBengali 
              ? 'আপনার দাখিলকৃত ফরম ২.১ এর প্রাথমিক নিরীক্ষা ও চূড়ান্ত অনুমোদনের অগ্রগতি' 
              : 'Review progress across Accounts Officer scrutiny and Head Office sanction'}
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{isBengali ? 'হালনাগাদ করুন' : 'Refresh Status'}</span>
        </button>
      </div>

      {/* Applications List */}
      {userApplications.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-bd-green-700 dark:text-bd-green-400 flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            {isBengali ? 'কোনো দাখিলকৃত আবেদন পাওয়া যায়নি' : 'No Submitted Applications Found'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            {isBengali 
              ? 'আপনার এখনও কোনো পেনশন আবেদন জমা দেওয়া হয়নি। সাইডবার থেকে "পেনশন আবেদন (ফরম ২.১)" নির্বাচন করে নতুন আবেদন দাখিল করুন।' 
              : 'You have not submitted any pension dossiers yet. Click "Pension Application" to start.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {userApplications.map((app) => {
            const statusInfo = getStatusBadge(app.status);
            return (
              <div
                key={app._id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                        {isBengali ? 'আবেদন ট্র্যাকিং নম্বর:' : 'Tracking ID:'}
                      </span>
                      <span className="text-sm font-extrabold font-mono text-bd-green-700 dark:text-bd-green-400">
                        #{app.applicationNumber || app._id.slice(-8)}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
                      {app.fullName} • {app.lastDesignation} ({app.department})
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>

                    {app.status === 'rejected' && onEditApplication && (
                      <button
                        onClick={() => onEditApplication(app)}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors flex items-center space-x-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{isBengali ? 'সংশোধন করুন' : 'Edit & Fix'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setSelectedApplication(app);
                        setShowModal(true);
                      }}
                      className="px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-600 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isBengali ? 'বিস্তারিত' : 'View Dossier'}</span>
                    </button>
                  </div>
                </div>

                {/* Key Numbers Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 dark:bg-gray-700/40 p-3.5 rounded-xl border border-gray-200/80 dark:border-gray-600/80">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 block">{isBengali ? 'জাতীয় পরিচয়পত্র:' : 'NID:'}</span>
                    <span className="font-bold text-gray-900 dark:text-white font-mono">{app.nidNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 block">{isBengali ? 'মাসিক পেনশন:' : 'Monthly Pension:'}</span>
                    <span className="font-bold text-bd-green-700 dark:text-bd-green-400 font-mono">
                      ৳ {app.pensionAmount ? app.pensionAmount.toLocaleString('en-IN') : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 block">{isBengali ? 'চাকরির বয়স:' : 'Service Length:'}</span>
                    <span className="font-bold text-gray-900 dark:text-white font-mono">{app.jobAge} {isBengali ? 'বছর' : 'Years'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 block">{isBengali ? 'দাখিলের তারিখ:' : 'Date:'}</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {new Date(app.submittedAt).toLocaleDateString(isBengali ? 'bn-BD' : 'en-US')}
                    </span>
                  </div>
                </div>

                {/* Status Timeline History */}
                {app.history && app.history.length > 0 && (
                  <div className="pt-2">
                    <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                      {isBengali ? 'অফিসিয়াল প্রক্রিয়াকরণ ইতিহাস ও মন্তব্য:' : 'Official Action Log & Remarks:'}
                    </div>
                    <div className="space-y-2 border-l-2 border-bd-green-600 pl-3">
                      {app.history.slice().reverse().map((h, i) => (
                        <div key={i} className="text-xs">
                          <div className="font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                            <span>{h.message}</span>
                            <span className="text-[10px] text-gray-400 font-normal">
                              ({new Date(h.timestamp).toLocaleString(isBengali ? 'bn-BD' : 'en-US')})
                            </span>
                          </div>
                          {h.feedback && (
                            <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-0.5 bg-rose-50 dark:bg-rose-950/40 p-2 rounded-lg border border-rose-200 dark:border-rose-800">
                              <strong>{isBengali ? 'কর্মকর্তার মন্তব্য:' : 'Officer Remarks:'}</strong> {h.feedback}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Dossier Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto space-y-6">
            
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-bd-green-700">বাংলাদেশ ফরম নং ২.১</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {isBengali ? 'পেনশন আবেদন নথিপত্র বিবরণী' : 'Official Pension Application Dossier'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-gray-900 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/40 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div><strong>{isBengali ? 'নাম:' : 'Name:'}</strong> {selectedApplication.fullName}</div>
                  <div><strong>{isBengali ? 'NID:' : 'NID:'}</strong> {selectedApplication.nidNumber}</div>
                  <div><strong>{isBengali ? 'পিতার নাম:' : "Father's Name:"}</strong> {selectedApplication.fatherName}</div>
                  <div><strong>{isBengali ? 'মাতার নাম:' : "Mother's Name:"}</strong> {selectedApplication.motherName}</div>
                  <div><strong>{isBengali ? 'পদবি:' : 'Designation:'}</strong> {selectedApplication.lastDesignation}</div>
                  <div><strong>{isBengali ? 'দপ্তর:' : 'Dept:'}</strong> {selectedApplication.department}</div>
                  <div><strong>{isBengali ? 'যোগদান:' : 'Joining:'}</strong> {new Date(selectedApplication.joiningDate).toLocaleDateString()}</div>
                  <div><strong>{isBengali ? 'অবসর:' : 'Retirement:'}</strong> {new Date(selectedApplication.retirementDate).toLocaleDateString()}</div>
                  <div><strong>{isBengali ? 'মূল বেতন:' : 'Salary:'}</strong> ৳ {selectedApplication.lastSalary}</div>
                  <div><strong>{isBengali ? 'মাসিক পেনশন:' : 'Pension:'}</strong> ৳ {selectedApplication.pensionAmount}</div>
                  <div className="col-span-2"><strong>{isBengali ? 'ব্যাংক তথ্য:' : 'Bank:'}</strong> {selectedApplication.bankName} - {selectedApplication.accountNumber} ({selectedApplication.branchName})</div>
                  <div className="col-span-2"><strong>{isBengali ? 'ঠিকানা:' : 'Address:'}</strong> {selectedApplication.address}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-xl bg-bd-green-700 hover:bg-bd-green-800 text-white font-bold text-xs"
              >
                {isBengali ? 'বন্ধ করুন' : 'Close Dossier'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ApplicationStatus;
