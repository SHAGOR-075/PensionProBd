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
  Building,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Folder,
  Image,
  FileIcon
} from 'lucide-react';

const MyDocuments = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { applications, fetchApplications, loading } = useData();
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('applications');

  const userApplications = applications.filter(app => app.userId === user.id);

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchApplications();
    setRefreshing(false);
  };

  const getFileIcon = (filename) => {
    if (!filename) return <FileIcon className="w-5 h-5" />;
    
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-600" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <Image className="w-5 h-5 text-blue-600" />;
      default:
        return <FileIcon className="w-5 h-5 text-gray-600" />;
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

  const downloadDocument = (filename, applicationNumber) => {
    // In a real application, this would download the actual file
    // For demo purposes, we'll create a placeholder download
    const link = document.createElement('a');
    link.href = `http://localhost:5000/${filename}`;
    link.download = `${applicationNumber}-${filename.split('/').pop()}`;
    link.click();
  };

  const generateCertificate = (application) => {
    // Generate pension certificate
    const certificateData = {
      applicationNumber: application.applicationNumber,
      fullName: application.fullName,
      fatherName: application.fatherName,
      nidNumber: application.nidNumber,
      lastDesignation: application.lastDesignation,
      department: application.department,
      pensionAmount: application.pensionAmount,
      approvedDate: application.approvedAt,
      bankName: application.bankName,
      accountNumber: application.accountNumber
    };
    
    const dataStr = JSON.stringify(certificateData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `pension-certificate-${application.applicationNumber}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const renderApplicationDocuments = () => (
    <div className="space-y-6">
      {userApplications.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Documents Found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            You haven't submitted any applications yet.
          </p>
          <button className="px-6 py-3 bg-bd-green-600 text-white rounded-lg hover:bg-bd-green-700 transition-colors">
            Submit Your First Application
          </button>
        </div>
      ) : (
        userApplications.map((application) => (
          <div key={application._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Application #{application.applicationNumber || application._id.slice(-6)}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Submitted on {new Date(application.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="p-6">
              {/* Application Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {application.fullName}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {application.lastDesignation}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {application.jobAge} years service
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    BDT {application.pensionAmount?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Documents */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">Uploaded Documents</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* NID Document */}
                  {application.nidFile && (
                    <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(application.nidFile)}
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">NID Document</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {application.nidFile.split('/').pop()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedDocument({
                                name: 'NID Document',
                                path: application.nidFile,
                                application: application
                              });
                              setShowModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => downloadDocument(application.nidFile, application.applicationNumber)}
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Job Documents */}
                  {application.jobDocuments && (
                    <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(application.jobDocuments)}
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Job Documents</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {application.jobDocuments.split('/').pop()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedDocument({
                                name: 'Job Documents',
                                path: application.jobDocuments,
                                application: application
                              });
                              setShowModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => downloadDocument(application.jobDocuments, application.applicationNumber)}
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Generated Documents */}
                {application.status === 'approved' && (
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                    <h5 className="font-medium text-gray-900 dark:text-white mb-3">Generated Documents</h5>
                    <div className="border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="font-medium text-green-900 dark:text-green-100">Pension Certificate</p>
                            <p className="text-xs text-green-700 dark:text-green-300">
                              Official pension approval certificate
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => generateCertificate(application)}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderModal = () => {
    if (!showModal || !selectedDocument) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {selectedDocument.name}
            </h3>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                {getFileIcon(selectedDocument.path)}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedDocument.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Application #{selectedDocument.application.applicationNumber || selectedDocument.application._id.slice(-6)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    File: {selectedDocument.path.split('/').pop()}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Document preview is not available. Click download to view the file.
              </p>
              <button
                onClick={() => downloadDocument(selectedDocument.path, selectedDocument.application.applicationNumber)}
                className="flex items-center space-x-2 px-6 py-3 bg-bd-green-600 text-white rounded-lg hover:bg-bd-green-700 transition-colors mx-auto"
              >
                <Download className="w-4 h-4" />
                <span>Download Document</span>
              </button>
            </div>
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
                My Documents
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                View and download your application documents and certificates
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
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
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {userApplications.filter(app => app.status === 'approved').length}
                  </p>
                  <p className="text-sm text-green-600">Certificates Available</p>
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
                  <p className="text-sm text-yellow-600">Under Review</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Upload className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-purple-600">
                    {userApplications.reduce((total, app) => {
                      let count = 0;
                      if (app.nidFile) count++;
                      if (app.jobDocuments) count++;
                      return total + count;
                    }, 0)}
                  </p>
                  <p className="text-sm text-purple-600">Uploaded Documents</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Content */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bd-green-600 mx-auto"></div>
          <p className="text-gray-500 dark:text-gray-400 mt-4">Loading documents...</p>
        </div>
      ) : (
        renderApplicationDocuments()
      )}

      {/* Modal */}
      {renderModal()}
    </div>
  );
};

export default MyDocuments;