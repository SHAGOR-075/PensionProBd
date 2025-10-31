import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
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
  Building
} from 'lucide-react';

const ApplicationStatus = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { applications, fetchApplications, loading } = useData();
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const userApplications = applications.filter(app => app.userId === user.id);

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchApplications();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'forwarded':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'approved':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'rejected':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'forwarded':
        return <TrendingUp className="w-5 h-5" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5" />;
      case 'rejected':
        return <XCircle className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'pending':
        return 'Your application is under review by the Assistant Accountant General.';
      case 'forwarded':
        return 'Your application has been forwarded to the Head Office for final approval.';
      case 'approved':
        return 'Congratulations! Your pension application has been approved.';
      case 'rejected':
        return 'Your application has been rejected. Please check the feedback for details.';
      default:
        return 'Application status unknown.';
    }
  };

  const downloadCertificate = (application) => {
    // Generate and download pension certificate
    const certificateData = {
      applicationNumber: application.applicationNumber,
      fullName: application.fullName,
      pensionAmount: application.pensionAmount,
      approvedDate: application.approvedAt
    };
    
    // Create a simple certificate download (in real app, this would be a PDF)
    const dataStr = JSON.stringify(certificateData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `pension-certificate-${application.applicationNumber}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const renderApplicationCard = (application) => (
    <div key={application._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full border ${getStatusColor(application.status)}`}>
              {getStatusIcon(application.status)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Application #{application.applicationNumber || application._id.slice(-6)}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Submitted on {new Date(application.submittedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(application.status)}`}>
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {application.lastDesignation}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Building className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {application.department}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Service: {application.jobAge} years
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Pension: BDT {application.pensionAmount?.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Status:</strong> {getStatusMessage(application.status)}
          </p>
          {application.history && application.history.length > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Last updated: {new Date(application.history[application.history.length - 1].timestamp).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setSelectedApplication(application);
              setShowModal(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </button>
          
          {application.status === 'approved' && (
            <button
              onClick={() => downloadCertificate(application)}
              className="flex items-center space-x-2 px-4 py-2 bg-bd-green-600 text-white rounded-lg hover:bg-bd-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Certificate</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderModal = () => {
    if (!showModal || !selectedApplication) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Application Details
            </h3>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Full Name:</span>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedApplication.fullName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Father's Name:</span>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedApplication.fatherName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Mother's Name:</span>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedApplication.motherName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">NID Number:</span>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedApplication.nidNumber}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Date of Birth:</span>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(selectedApplication.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Age:</span>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedApplication.age} years</p>
                </div>
              </div>
            </div>

            {/* Job Information */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Job Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Last Designation:</span>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedApplication.lastDesignation}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Department:</span>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedApplication.department}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Joining Date:</span>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(selectedApplication.joiningDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Retirement Date:</span>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(selectedApplication.retirementDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Service Length:</span>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedApplication.jobAge} years</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Last Salary:</span>
                  <p className="font-medium text-gray-900 dark:text-white">
                    BDT {selectedApplication.lastSalary?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Bank Information */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Bank Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Bank Name:</span>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedApplication.bankName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Account Number:</span>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedApplication.accountNumber}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Branch Name:</span>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedApplication.branchName}</p>
                </div>
              </div>
            </div>

            {/* Status History */}
            {selectedApplication.history && selectedApplication.history.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Status History</h4>
                <div className="space-y-3">
                  {selectedApplication.history.slice().reverse().map((entry, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-600 rounded-lg">
                      <div className={`p-1 rounded-full ${getStatusColor(entry.status)}`}>
                        {getStatusIcon(entry.status)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{entry.message}</p>
                        {entry.feedback && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{entry.feedback}</p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {new Date(entry.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Application Status
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Track the progress of your pension applications
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-bd-green-600 text-white rounded-lg hover:bg-bd-green-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">{userApplications.length}</p>
                  <p className="text-sm text-blue-600">Total Applications</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Clock className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-yellow-600">
                    {userApplications.filter(app => app.status === 'pending').length}
                  </p>
                  <p className="text-sm text-yellow-600">Pending</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {userApplications.filter(app => app.status === 'approved').length}
                  </p>
                  <p className="text-sm text-green-600">Approved</p>
                </div>
              </div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <XCircle className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-600">
                    {userApplications.filter(app => app.status === 'rejected').length}
                  </p>
                  <p className="text-sm text-red-600">Rejected</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bd-green-600 mx-auto"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-4">Loading applications...</p>
          </div>
        ) : userApplications.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Applications Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              You haven't submitted any pension applications yet.
            </p>
            <button className="px-6 py-3 bg-bd-green-600 text-white rounded-lg hover:bg-bd-green-700 transition-colors">
              Submit Your First Application
            </button>
          </div>
        ) : (
          userApplications.map(renderApplicationCard)
        )}
      </div>

      {/* Modal */}
      {renderModal()}
    </div>
  );
};

export default ApplicationStatus;