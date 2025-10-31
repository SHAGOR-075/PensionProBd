import React, { useState } from 'react';
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
  DollarSign
} from 'lucide-react';

const AssistantAccountantDashboard = ({ activeTab }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { applications, updateApplicationStatus, dashboardStats } = useData();
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState('');

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const reviewedApplications = applications.filter(app => app.status !== 'pending');

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

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Rejected
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {dashboardStats.rejectedApplications || applications.filter(app => app.status === 'rejected').length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/20">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

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
        </>
      );
    case 'applications':
      return (
        <>
          {renderApplications()}
          {renderModal()}
        </>
      );
    case 'reviews':
      return (
        <>
          {renderApplications()}
          {renderModal()}
        </>
      );
    default:
      return (
        <>
          {renderDashboard()}
          {renderModal()}
        </>
      );
  }
};

export default AssistantAccountantDashboard;