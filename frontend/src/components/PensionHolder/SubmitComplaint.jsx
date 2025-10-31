import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { toast } from 'react-hot-toast';
import { 
  MessageSquare, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle,
  User,
  Calendar,
  FileText,
  Send,
  Eye,
  RefreshCw
} from 'lucide-react';

const SubmitComplaint = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { complaints, officers, submitComplaint, fetchComplaints, fetchOfficers, loading } = useData();
  const [showForm, setShowForm] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [formData, setFormData] = useState({
    officerId: '',
    officerName: '',
    subject: '',
    description: '',
    category: 'other'
  });
  const [errors, setErrors] = useState({});

  const userComplaints = complaints.filter(complaint => complaint.userId === user.id);

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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-fill officer name when officer is selected
    if (name === 'officerId') {
      const selectedOfficer = officers.find(officer => officer._id === value);
      if (selectedOfficer) {
        setFormData(prev => ({
          ...prev,
          officerName: selectedOfficer.name
        }));
      }
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.officerId) newErrors.officerId = 'Please select an officer';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (formData.description.length < 10) newErrors.description = 'Description must be at least 10 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await submitComplaint(formData);
      setFormData({
        officerId: '',
        officerName: '',
        subject: '',
        description: '',
        category: 'other'
      });
      setShowForm(false);
      toast.success('Complaint submitted successfully!');
    } catch (error) {
      console.error('Failed to submit complaint:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'investigating':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'resolved':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'dismissed':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'investigating':
        return <AlertTriangle className="w-4 h-4" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
      case 'dismissed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'delay':
        return <Clock className="w-4 h-4" />;
      case 'misconduct':
        return <AlertTriangle className="w-4 h-4" />;
      case 'corruption':
        return <XCircle className="w-4 h-4" />;
      case 'poor_service':
        return <User className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'delay':
        return 'Processing Delay';
      case 'misconduct':
        return 'Officer Misconduct';
      case 'corruption':
        return 'Corruption';
      case 'poor_service':
        return 'Poor Service';
      default:
        return 'Other';
    }
  };

  const renderComplaintForm = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Submit New Complaint
          </h3>
          <button
            onClick={() => setShowForm(false)}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Officer Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Officer *
          </label>
          <select
            name="officerId"
            value={formData.officerId}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 ${
              errors.officerId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } dark:bg-gray-700 dark:text-white`}
          >
            <option value="">Choose an officer...</option>
            {officers.filter(officer => officer.userType !== 'pension_holder').map((officer) => (
              <option key={officer._id} value={officer._id}>
                {officer.name} - {officer.designation} ({officer.department})
              </option>
            ))}
          </select>
          {errors.officerId && (
            <p className="mt-1 text-sm text-red-600">{errors.officerId}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Complaint Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="delay">Processing Delay</option>
            <option value="misconduct">Officer Misconduct</option>
            <option value="corruption">Corruption</option>
            <option value="poor_service">Poor Service</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Subject *
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Brief description of the issue"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 ${
              errors.subject ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } dark:bg-gray-700 dark:text-white`}
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Detailed Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            placeholder="Provide detailed information about your complaint..."
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } dark:bg-gray-700 dark:text-white`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Minimum 10 characters required
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-2 bg-bd-green-600 text-white rounded-lg hover:bg-bd-green-700 transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? 'Submitting...' : 'Submit Complaint'}</span>
          </button>
        </div>
      </form>
    </div>
  );

  const renderComplaintCard = (complaint) => (
    <div key={complaint._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full border ${getStatusColor(complaint.status)}`}>
              {getCategoryIcon(complaint.category)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {complaint.subject}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Complaint #{complaint.complaintNumber || complaint._id.slice(-6)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(complaint.status)}`}>
              {getCategoryLabel(complaint.category)}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(complaint.status)}`}>
              {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Against: {complaint.officerName}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Submitted: {new Date(complaint.submittedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
          {complaint.description}
        </p>

        {complaint.redFlagIssued && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-800 dark:text-red-200">
                Red Flag Issued
              </span>
            </div>
            <p className="text-xs text-red-700 dark:text-red-300 mt-1">
              This complaint resulted in a red flag warning for the officer.
            </p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-1">
            {getStatusIcon(complaint.status)}
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {complaint.status === 'pending' && 'Under Review'}
              {complaint.status === 'investigating' && 'Being Investigated'}
              {complaint.status === 'resolved' && 'Resolved'}
              {complaint.status === 'dismissed' && 'Dismissed'}
            </span>
          </div>
          <button
            onClick={() => {
              setSelectedComplaint(complaint);
              setShowModal(true);
            }}
            className="flex items-center space-x-2 px-3 py-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderModal = () => {
    if (!showModal || !selectedComplaint) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Complaint Details
            </h3>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Complaint ID:</span>
                <p className="font-medium text-gray-900 dark:text-white">
                  #{selectedComplaint.complaintNumber || selectedComplaint._id.slice(-6)}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Category:</span>
                <p className="font-medium text-gray-900 dark:text-white">
                  {getCategoryLabel(selectedComplaint.category)}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Against Officer:</span>
                <p className="font-medium text-gray-900 dark:text-white">{selectedComplaint.officerName}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Status:</span>
                <p className="font-medium text-gray-900 dark:text-white capitalize">{selectedComplaint.status}</p>
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
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <span className="text-sm font-medium text-green-800 dark:text-green-200">Resolution:</span>
                <p className="text-green-700 dark:text-green-300 mt-1">{selectedComplaint.resolution}</p>
              </div>
            )}

            {selectedComplaint.redFlagIssued && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-red-800 dark:text-red-200">Red Flag Issued</span>
                </div>
                <p className="text-red-700 dark:text-red-300 mt-2">
                  This complaint resulted in a red flag warning for the officer. The matter has been escalated to the Head Office.
                </p>
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
                Submit Complaint
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Report issues or concerns about officer conduct or service quality
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-bd-green-600 text-white rounded-lg hover:bg-bd-green-700 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>New Complaint</span>
              </button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">{userComplaints.length}</p>
                  <p className="text-sm text-blue-600">Total Complaints</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Clock className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-yellow-600">
                    {userComplaints.filter(c => c.status === 'pending').length}
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
                    {userComplaints.filter(c => c.status === 'resolved').length}
                  </p>
                  <p className="text-sm text-green-600">Resolved</p>
                </div>
              </div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-600">
                    {userComplaints.filter(c => c.redFlagIssued).length}
                  </p>
                  <p className="text-sm text-red-600">Red Flags</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Complaint Form */}
      {showForm && renderComplaintForm()}

      {/* Complaints List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bd-green-600 mx-auto"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-4">Loading complaints...</p>
          </div>
        ) : userComplaints.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Complaints Submitted
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              You haven't submitted any complaints yet.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-bd-green-600 text-white rounded-lg hover:bg-bd-green-700 transition-colors"
            >
              Submit Your First Complaint
            </button>
          </div>
        ) : (
          userComplaints.map(renderComplaintCard)
        )}
      </div>

      {/* Modal */}
      {renderModal()}
    </div>
  );
};

export default SubmitComplaint;