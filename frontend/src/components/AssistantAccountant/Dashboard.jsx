import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { toast } from 'react-hot-toast';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  Send,
  AlertTriangle,
  User,
  Calendar,
  DollarSign,
  Flag
} from 'lucide-react';

const AssistantAccountantDashboard = ({ activeTab }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { applications, updateApplicationStatus, dashboardStats, complaints, fetchComplaints } = useData();
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [actionType, setActionType] = useState('');

  // Fetch complaints on mount
  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const reviewedApplications = applications.filter(app => app.status !== 'pending');
  
  // Filter complaints against this assistant accountant that resulted in red flags
  const redFlagComplaints = complaints.filter(complaint => {
    const complaintOfficerId = complaint.officerId?._id?.toString() || complaint.officerId?.toString() || complaint.officerId;
    return complaintOfficerId === user.id && complaint.redFlagIssued === true;
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
      message = feedback || 'Application forwarded to Head Office for final approval';
    } else if (actionType === 'reject') {
      status = 'rejected';
      message = feedback || 'Application rejected due to incomplete information';
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'forwarded':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'approved':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'rejected':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-bd-green-600 to-bd-green-700 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome, {user.name}
        </h1>
        <p className="text-bd-green-100">
          Assistant Accountant General Dashboard - Review and process pension applications
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pending Applications
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {dashboardStats.pendingApplications || pendingApplications.length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/20">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Reviewed Today
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {dashboardStats.reviewedToday || reviewedApplications.filter(app => 
                  new Date(app.history[app.history.length - 1]?.timestamp).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Processed
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {dashboardStats.totalApplications || applications.length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-2 ${
          (user.redFlags || 0) >= 3 
            ? 'border-red-500 dark:border-red-600' 
            : (user.redFlags || 0) >= 2 
            ? 'border-orange-500 dark:border-orange-600'
            : (user.redFlags || 0) > 0
            ? 'border-yellow-500 dark:border-yellow-600'
            : 'border-gray-200 dark:border-gray-700'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Red Flags
              </p>
              <p className={`text-3xl font-bold ${
                (user.redFlags || 0) >= 3 
                  ? 'text-red-600' 
                  : (user.redFlags || 0) >= 2 
                  ? 'text-orange-600'
                  : (user.redFlags || 0) > 0
                  ? 'text-yellow-600'
                  : 'text-gray-900 dark:text-white'
              }`}>
                {user.redFlags || 0}/3
              </p>
            </div>
            <div className={`p-3 rounded-full ${
              (user.redFlags || 0) >= 3 
                ? 'bg-red-100 dark:bg-red-900/20' 
                : (user.redFlags || 0) >= 2 
                ? 'bg-orange-100 dark:bg-orange-900/20'
                : (user.redFlags || 0) > 0
                ? 'bg-yellow-100 dark:bg-yellow-900/20'
                : 'bg-gray-100 dark:bg-gray-900/20'
            }`}>
              <Flag className={`w-6 h-6 ${
                (user.redFlags || 0) >= 3 
                  ? 'text-red-600' 
                  : (user.redFlags || 0) >= 2 
                  ? 'text-orange-600'
                  : (user.redFlags || 0) > 0
                  ? 'text-yellow-600'
                  : 'text-gray-600'
              }`} />
            </div>
          </div>
        </div>
      </div>

      {/* Red Flags Alert */}
      {user.redFlags > 0 && (
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 ${
          user.redFlags >= 3 
            ? 'border-red-500 dark:border-red-600' 
            : user.redFlags >= 2 
            ? 'border-orange-500 dark:border-orange-600'
            : 'border-yellow-500 dark:border-yellow-600'
        }`}>
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full ${
                user.redFlags >= 3 
                  ? 'bg-red-100 dark:bg-red-900/20' 
                  : user.redFlags >= 2 
                  ? 'bg-orange-100 dark:bg-orange-900/20'
                  : 'bg-yellow-100 dark:bg-yellow-900/20'
              }`}>
                <Flag className={`w-6 h-6 ${
                  user.redFlags >= 3 
                    ? 'text-red-600' 
                    : user.redFlags >= 2 
                    ? 'text-orange-600'
                    : 'text-yellow-600'
                }`} />
              </div>
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${
                  user.redFlags >= 3 
                    ? 'text-red-900 dark:text-red-100' 
                    : user.redFlags >= 2 
                    ? 'text-orange-900 dark:text-orange-100'
                    : 'text-yellow-900 dark:text-yellow-100'
                }`}>
                  {user.redFlags >= 3 
                    ? 'Account Disabled - 3 Red Flags Received' 
                    : `Red Flag Warning - ${user.redFlags}/3 Red Flags`}
                </h3>
                <p className={`text-sm mt-1 ${
                  user.redFlags >= 3 
                    ? 'text-red-700 dark:text-red-300' 
                    : user.redFlags >= 2 
                    ? 'text-orange-700 dark:text-orange-300'
                    : 'text-yellow-700 dark:text-yellow-300'
                }`}>
                  {user.redFlags >= 3 
                    ? 'Your account has been disabled due to receiving 3 red flag warnings. Please contact the Head Office for assistance.'
                    : user.redFlags >= 2
                    ? `You have received ${user.redFlags} red flag warnings. One more red flag will result in account deactivation.`
                    : `You have received ${user.redFlags} red flag warning. Please review the complaints below and improve your service quality.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Red Flags Section */}
      {redFlagComplaints.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <Flag className="w-5 h-5 text-red-600" />
              <span>Red Flag Complaints ({redFlagComplaints.length})</span>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Complaints that resulted in red flag warnings against you
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {redFlagComplaints.map((complaint) => (
                <div key={complaint._id} className="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-900/10">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Flag className="w-5 h-5 text-red-600" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {complaint.subject}
                        </h3>
                        <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 rounded-full text-xs font-medium">
                          Red Flag Issued
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Complaint #{complaint.complaintNumber || complaint._id.slice(-6)} • 
                        Submitted: {new Date(complaint.submittedAt).toLocaleDateString()}
                        {complaint.resolvedAt && (
                          <span> • Resolved: {new Date(complaint.resolvedAt).toLocaleDateString()}</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                        {complaint.description.substring(0, 150)}...
                      </p>
                      {complaint.resolution && (
                        <div className="bg-white dark:bg-gray-700 rounded-lg p-3 mt-2">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Resolution:</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{complaint.resolution}</p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedComplaint(complaint);
                        setShowComplaintModal(true);
                      }}
                      className="ml-4 p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pending Applications */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Pending Applications
          </h2>
        </div>
        <div className="p-6">
          {pendingApplications.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No pending applications
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingApplications.map((application) => (
                <div key={application._id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-bd-green-100 dark:bg-bd-green-900/20 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-bd-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {application.fullName}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Application #{application.applicationNumber || application._id.slice(-6)} • {application.lastDesignation}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Submitted: {new Date(application.submittedAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-bd-green-600 dark:text-bd-green-400 font-medium">
                          Pension: BDT {application.pensionAmount?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                      <button
                        onClick={() => handleAction(application, 'view')}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAction(application, 'forward')}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAction(application, 'reject')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderApplications = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            All Applications
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {applications.map((application) => (
              <div key={application._id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-bd-green-100 dark:bg-bd-green-900/20 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-bd-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {application.fullName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Application #{application.applicationNumber || application._id.slice(-6)} • {application.lastDesignation}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Submitted: {new Date(application.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                    <button
                      onClick={() => handleAction(application, 'view')}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Modal for complaint details
  const renderComplaintModal = () => {
    if (!showComplaintModal || !selectedComplaint) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <Flag className="w-5 h-5 text-red-600" />
              <span>Red Flag Complaint Details</span>
            </h3>
            <button
              onClick={() => setShowComplaintModal(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Flag className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-900 dark:text-red-100">Red Flag Issued</span>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300">
                This complaint resulted in a red flag warning being issued against you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Complaint ID:</span>
                <p className="font-medium text-gray-900 dark:text-white">
                  #{selectedComplaint.complaintNumber || selectedComplaint._id.slice(-6)}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Category:</span>
                <p className="font-medium text-gray-900 dark:text-white capitalize">
                  {selectedComplaint.category || 'other'}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Submitted:</span>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(selectedComplaint.submittedAt).toLocaleDateString()}
                </p>
              </div>
              {selectedComplaint.resolvedAt && (
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Resolved:</span>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(selectedComplaint.resolvedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Subject:</span>
              <p className="font-medium text-gray-900 dark:text-white mt-1">{selectedComplaint.subject}</p>
            </div>

            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Description:</span>
              <p className="text-gray-700 dark:text-gray-300 mt-1">{selectedComplaint.description}</p>
            </div>

            {selectedComplaint.resolution && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Resolution:</span>
                <p className="text-gray-700 dark:text-gray-300 mt-1">{selectedComplaint.resolution}</p>
              </div>
            )}

            {selectedComplaint.userId && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Complainant:</span>
                <p className="text-blue-700 dark:text-blue-300 mt-1">
                  {selectedComplaint.userId.name || selectedComplaint.userId.email || 'N/A'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Modal for actions
  const renderModal = () => {
    if (!showModal || !selectedApplication) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {actionType === 'view' ? 'Application Details' : 
               actionType === 'forward' ? 'Forward Application' : 'Reject Application'}
            </h3>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          {actionType === 'view' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedApplication.fullName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    NID Number
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedApplication.nidNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Last Designation
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedApplication.lastDesignation}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Department
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedApplication.department}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Service Length
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedApplication.jobAge} years</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Last Salary
                  </label>
                  <p className="text-gray-900 dark:text-white">BDT {selectedApplication.lastSalary?.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Pension Amount
                  </label>
                  <p className="text-gray-900 dark:text-white">BDT {selectedApplication.pensionAmount?.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Bank Details
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {selectedApplication.bankName} - {selectedApplication.accountNumber}
                  </p>
                </div>
              </div>
            </div>
          )}

          {(actionType === 'forward' || actionType === 'reject') && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {actionType === 'forward' ? 'Comments (Optional)' : 'Rejection Reason'}
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 dark:bg-gray-700 dark:text-white"
                  placeholder={actionType === 'forward' ? 'Add any comments...' : 'Please provide reason for rejection...'}
                  required={actionType === 'reject'}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={submitAction}
                  className={`px-4 py-2 text-white rounded-lg ${
                    actionType === 'forward' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {actionType === 'forward' ? 'Forward' : 'Reject'}
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
      return (
        <>
          {renderApplications()}
          {renderModal()}
          {renderComplaintModal()}
        </>
      );
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