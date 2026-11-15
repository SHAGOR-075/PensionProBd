import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { 
  FileText, 
  Download, 
  Eye, 
  Upload, 
  Calendar, 
  User, 
  Building2, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  RefreshCw, 
  FolderOpen, 
  Image, 
  FileIcon,
  ShieldCheck,
  ExternalLink,
  Award
} from 'lucide-react';

const MyDocuments = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { applications, fetchApplications, loading } = useData();
  const [selectedDoc, setSelectedDoc] = useState(null);
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

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center space-x-2">
            <FolderOpen className="w-6 h-6 text-bd-green-600" />
            <span>{isBengali ? 'ডিজিটাল পেনশন নথিপত্র ভল্ট' : 'Digital Pension Document Locker'}</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {isBengali 
              ? 'আপনার দাখিলকৃত প্রমাণক, জাতীয় পরিচয়পত্র এবং অনুমোদিত পেনশন সনদপত্র (PPO)' 
              : 'Secure repository for your submitted records and official Pension Payment Order (PPO)'}
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{isBengali ? 'হালনাগাদ করুন' : 'Refresh Documents'}</span>
        </button>
      </div>

      {userApplications.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-bd-green-700 dark:text-bd-green-400 flex items-center justify-center mx-auto">
            <FolderOpen className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            {isBengali ? 'কোনো সংরক্ষিত নথিপত্র পাওয়া যায়নি' : 'No Stored Documents Found'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            {isBengali 
              ? 'ফরম ২.১ এর মাধ্যমে আবেদন দাখিল করার পর সংযুক্ত সকল নথিপত্র ও অনুমোদিত পেনশন সনদ এখানে সংরক্ষিত থাকবে।' 
              : 'Submit Form 2.1 to store your verification records and digital PPO letters here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {userApplications.map(app => (
            <div
              key={app._id}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm space-y-5"
            >
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <span className="text-xs font-bold text-bd-green-700 dark:text-bd-green-400 font-mono">
                    #{app.applicationNumber || app._id.slice(-8)}
                  </span>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
                    {app.fullName} • {app.lastDesignation} ({app.department})
                  </h3>
                </div>

                <div className="text-xs text-gray-500 font-medium">
                  {isBengali ? 'দাখিলের তারিখ:' : 'Date:'} {new Date(app.submittedAt).toLocaleDateString(isBengali ? 'bn-BD' : 'en-US')}
                </div>
              </div>

              {/* Documents Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* NID Card Document */}
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-700/30 flex flex-col justify-between space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                        {isBengali ? 'জাতীয় পরিচয়পত্র (NID)' : 'National ID Document'}
                      </h4>
                      <p className="text-[11px] text-gray-500 font-mono truncate">
                        {app.nidNumber}
                      </p>
                    </div>
                  </div>

                  {app.nidFile ? (
                    <a
                      href={`http://localhost:5000/${app.nidFile.replace(/\\/g, '/')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 px-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs font-bold text-bd-green-700 dark:text-bd-green-400 hover:bg-bd-green-50 flex items-center justify-center space-x-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isBengali ? 'নথি দেখুন / ডাউনলোড' : 'View / Download'}</span>
                    </a>
                  ) : (
                    <div className="text-[11px] text-gray-400 italic text-center py-1">
                      {isBengali ? 'ফাইল সংরক্ষিত নেই' : 'No file on record'}
                    </div>
                  )}
                </div>

                {/* Service Record Document */}
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-700/30 flex flex-col justify-between space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                        {isBengali ? 'সার্ভিস রেকর্ড / প্রত্যায়ন' : 'Service Record Book'}
                      </h4>
                      <p className="text-[11px] text-gray-500 truncate">
                        {app.jobAge} {isBengali ? 'বছরের চাকরিকাল' : 'Years Service'}
                      </p>
                    </div>
                  </div>

                  {app.jobDocuments ? (
                    <a
                      href={`http://localhost:5000/${app.jobDocuments.replace(/\\/g, '/')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 px-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs font-bold text-bd-green-700 dark:text-bd-green-400 hover:bg-bd-green-50 flex items-center justify-center space-x-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isBengali ? 'নথি দেখুন / ডাউনলোড' : 'View / Download'}</span>
                    </a>
                  ) : (
                    <div className="text-[11px] text-gray-400 italic text-center py-1">
                      {isBengali ? 'ফাইল সংরক্ষিত নেই' : 'No file on record'}
                    </div>
                  )}
                </div>

                {/* Official Pension Payment Order (PPO) */}
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-emerald-50/60 dark:bg-emerald-950/30 flex flex-col justify-between space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-bd-green-700 dark:text-emerald-300 flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                        {isBengali ? 'পেনশন পেমেন্ট অর্ডার (PPO)' : 'Pension Payment Order'}
                      </h4>
                      <p className="text-[11px] text-bd-green-700 dark:text-emerald-400 font-semibold truncate">
                        {app.status === 'approved' ? (isBengali ? '✅ প্রস্তুত ও অনুমোদিত' : '✅ Approved & Issued') : (isBengali ? '⏳ চূড়ান্ত অনুমোদন অপেক্ষমাণ' : '⏳ Pending Approval')}
                      </p>
                    </div>
                  </div>

                  {app.status === 'approved' ? (
                    <button
                      onClick={() => window.print()}
                      className="w-full py-2 px-3 rounded-lg bg-bd-green-700 hover:bg-bd-green-800 text-white text-xs font-bold flex items-center justify-center space-x-1 transition-colors shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isBengali ? 'PPO সনদ প্রিন্ট / ডাউনলোড' : 'Print / Download PPO'}</span>
                    </button>
                  ) : (
                    <div className="text-[11px] text-gray-400 italic text-center py-1">
                      {isBengali ? 'অনুমোদনের পর সক্রিয় হবে' : 'Active after final sanction'}
                    </div>
                  )}
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default MyDocuments;
