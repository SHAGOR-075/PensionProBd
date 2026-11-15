import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { toast } from 'react-hot-toast';
import { 
  MessageSquare, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  User, 
  Calendar, 
  FileText, 
  Send, 
  Eye, 
  RefreshCw,
  ShieldAlert,
  Flag,
  HelpCircle,
  Plus
} from 'lucide-react';

const SubmitComplaint = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { complaints, officers, submitComplaint, fetchComplaints, fetchOfficers, loading } = useData();

  const [showForm, setShowForm] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const isBengali = i18n.language === 'bn';

  const [formData, setFormData] = useState({
    officerId: '',
    officerName: '',
    subject: '',
    description: '',
    category: 'delay'
  });
  const [errors, setErrors] = useState({});

  const userComplaints = complaints.filter(complaint => {
    const complaintUserId = complaint.userId?._id?.toString() || complaint.userId?.toString() || complaint.userId;
    return complaintUserId === user.id;
  });

  useEffect(() => {
    fetchComplaints();
    fetchOfficers();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchComplaints();
    await fetchOfficers();
    setRefreshing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'officerId') {
      const selectedOff = officers.find(o => (o._id?.toString() || o.id?.toString()) === value);
      setFormData(prev => ({
        ...prev,
        officerId: value,
        officerName: selectedOff ? `${selectedOff.name} (${selectedOff.designation || selectedOff.userType})` : ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.officerId) errs.officerId = isBengali ? 'সংশ্লিষ্ট কর্মকর্তা নির্বাচন করুন' : 'Select designated officer';
    if (!formData.subject.trim()) errs.subject = isBengali ? 'অভিযোগের বিষয় উল্লেখ করুন' : 'Subject is required';
    if (!formData.description.trim()) errs.description = isBengali ? 'অভিযোগের বিস্তারিত বিবরণ লিখুন' : 'Detailed description is required';
    else if (formData.description.trim().length < 15) errs.description = isBengali ? 'কমপক্ষে ১৫ অক্ষরের বিবরণ আবশ্যক' : 'Min. 15 characters required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await submitComplaint(formData);
      setFormData({
        officerId: '',
        officerName: '',
        subject: '',
        description: '',
        category: 'delay'
      });
      setShowForm(false);
    } catch (error) {
      console.error('Failed to submit complaint:', error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return {
          label: isBengali ? 'তদন্তাধীন' : 'Under Investigation',
          color: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
        };
      case 'resolved':
        return {
          label: isBengali ? 'নিষ্পত্তিকৃত' : 'Resolved',
          color: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
        };
      case 'rejected':
        return {
          label: isBengali ? 'নথিজাত / বাতিল' : 'Rejected / Filed',
          color: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-300'
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
            <ShieldAlert className="w-6 h-6 text-rose-600" />
            <span>{isBengali ? 'অভিযোগ ও প্রতিকার ব্যবস্থা (GRS)' : 'Grievance Redress System (GRS)'}</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {isBengali 
              ? 'পেনশন প্রক্রিয়াকরণে যেকোনো অযাচিত বিলম্ব, অসঙ্গতি বা অসদাচরণের বিরুদ্ধে সরাসরি অভিযোগ জানান' 
              : 'Lodge formal complaints against delays or administrative irregularities'}
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2.5 rounded-xl bg-bd-green-700 hover:bg-bd-green-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{showForm ? (isBengali ? 'ফর্ম বন্ধ করুন' : 'Close Form') : (isBengali ? 'নতুন অভিযোগ দাখিল' : 'Lodge Grievance')}</span>
          </button>
        </div>
      </div>

      {/* New Complaint Form Card */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-md animate-fade-in space-y-4">
          <div className="border-b border-gray-100 dark:border-gray-700 pb-3">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {isBengali ? 'আনুষ্ঠানিক অভিযোগপত্র পূরণ করুন' : 'Fill Out Formal Grievance Form'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isBengali ? 'অভিযোগটি তদন্তের জন্য প্রধান কার্যালয় প্রশাসনিক সেলে সরাসরি প্রেরিত হবে' : 'This grievance will be routed directly to the Head Office Disciplinary Committee'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  {isBengali ? 'অভিযোগের লক্ষ্য (সংশ্লিষ্ট কর্মকর্তা)' : 'Target Officer / Desk'} <span className="text-red-500">*</span>
                </label>
                <select
                  name="officerId"
                  value={formData.officerId}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:ring-2 focus:ring-bd-green-500"
                >
                  <option value="">{isBengali ? 'কর্মকর্তা নির্বাচন করুন' : 'Select Officer'}</option>
                  {officers.map(off => (
                    <option key={off._id || off.id} value={off._id || off.id}>
                      {off.name} ({off.designation || off.department || off.userType})
                    </option>
                  ))}
                </select>
                {errors.officerId && <p className="text-xs text-red-600 mt-1">{errors.officerId}</p>}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  {isBengali ? 'অভিযোগের বিষয়বস্তুর ধরণ (Category)' : 'Grievance Category'}
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:ring-2 focus:ring-bd-green-500"
                >
                  <option value="delay">{isBengali ? 'অযাচিত বিলম্ব (Unwarranted Delay)' : 'Unwarranted Delay'}</option>
                  <option value="misbehavior">{isBengali ? 'অসদাচরণ বা অসৌজন্যমূলক ব্যবহার' : 'Misconduct / Harassment'}</option>
                  <option value="irregularity">{isBengali ? 'অনিয়ম বা অতিরিক্ত দাবিকরণ' : 'Irregularity / Corruption'}</option>
                  <option value="technical">{isBengali ? 'কারিগরি বা ডাটা অসঙ্গতি' : 'Technical Discrepancy'}</option>
                  <option value="other">{isBengali ? 'অন্যান্য কারণ' : 'Other'}</option>
                </select>
              </div>

            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                {isBengali ? 'অভিযোগের শিরোনাম বা সারসংক্ষেপ' : 'Subject of Complaint'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder={isBengali ? 'উদা: আবেদনের নিরীক্ষা সম্পন্নকরণে ১ মাসের অধিক অযাচিত বিলম্ব' : 'e.g. Unjustified 1 month delay in file audit'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:ring-2 focus:ring-bd-green-500"
              />
              {errors.subject && <p className="text-xs text-red-600 mt-1">{errors.subject}</p>}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                {isBengali ? 'অভিযোগের বিস্তারিত বিবরণ' : 'Detailed Complaint Narrative'} <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder={isBengali ? 'ঘটনার বিস্তারিত তারিখ, যোগাযোগ ও বিবরণ প্রদান করুন...' : 'Describe what happened, dates, and evidence...'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:ring-2 focus:ring-bd-green-500"
              />
              {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 transition-colors"
              >
                {isBengali ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center space-x-1.5"
              >
                <Send className="w-4 h-4" />
                <span>{isBengali ? 'অভিযোগ প্রেরণ করুন' : 'Submit Official Complaint'}</span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Complaints List */}
      {userComplaints.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-bd-green-700 dark:text-bd-green-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            {isBengali ? 'আপনার কোনো বিচারাধীন অভিযোগ নেই' : 'No Active Grievances'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            {isBengali 
              ? 'আপনার কোনো কর্মকর্তা বা আবেদন সম্পর্কিত অভিযোগ থাকলে উপরে "নতুন অভিযোগ দাখিল" বাটনে ক্লিক করুন।' 
              : 'You have not lodged any complaints. Click "Lodge Grievance" above if you face any issues.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {userComplaints.map(complaint => {
            const statusInfo = getStatusBadge(complaint.status);
            return (
              <div
                key={complaint._id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-gray-700">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 font-mono">
                        #{complaint._id.slice(-8)}
                      </span>
                      {complaint.redFlagIssued && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300 text-[10px] font-bold">
                          <Flag className="w-3 h-3 text-red-600" />
                          <span>{isBengali ? 'লাল পতাকা সতর্কবার্তা জারি' : 'Red Flag Penalized'}</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mt-1">
                      {complaint.subject}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {isBengali ? 'অভিযুক্ত কর্মকর্তা:' : 'Against Officer:'}{' '}
                      <strong className="text-gray-800 dark:text-gray-200">
                        {complaint.officerName || complaint.officerId?.name || 'Assigned Officer'}
                      </strong>
                    </p>
                  </div>

                  <span className={`text-xs font-bold px-3 py-1 rounded-full border self-start sm:self-auto ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-700/30 p-3.5 rounded-xl border border-gray-200/80 dark:border-gray-600">
                  {complaint.description}
                </p>

                {complaint.resolution && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-300">
                    <strong>{isBengali ? 'হেড অফিস প্রতিকার ও নিষ্পত্তির সিদ্ধান্ত:' : 'Official Resolution:'}</strong>{' '}
                    {complaint.resolution}
                  </div>
                )}

                <div className="text-[11px] text-gray-400 flex items-center justify-between pt-1">
                  <span>{new Date(complaint.createdAt).toLocaleString(isBengali ? 'bn-BD' : 'en-US')}</span>
                  <span className="capitalize">{complaint.category || 'General'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default SubmitComplaint;
