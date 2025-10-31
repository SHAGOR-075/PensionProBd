import React from 'react';
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
  DollarSign
} from 'lucide-react';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { applications, complaints, dashboardStats } = useData();

  const userApplications = applications.filter(app => app.userId === user.id);
  const userComplaints = complaints.filter(complaint => complaint.userId === user.id);

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

  const stats = [
    {
      name: 'Total Applications',
      value: dashboardStats.totalApplications || userApplications.length,
      icon: FileText,
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20'
    },
    {
      name: 'Pending Applications',
      value: dashboardStats.pendingApplications || userApplications.filter(app => app.status === 'pending').length,
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
    },
    {
      name: 'Approved Applications',
      value: dashboardStats.approvedApplications || userApplications.filter(app => app.status === 'approved').length,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-100 dark:bg-green-900/20'
    },
    {
      name: 'Total Complaints',
      value: dashboardStats.totalComplaints || userComplaints.length,
      icon: AlertTriangle,
      color: 'text-red-600 bg-red-100 dark:bg-red-900/20'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-bd-green-600 to-bd-green-700 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          {t('welcome')}, {user.name}!
        </h1>
        <p className="text-bd-green-100">
          Welcome to your pension management dashboard. Track your applications and manage your pension benefits.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.name}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Applications */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Applications
          </h2>
        </div>
        <div className="p-6">
          {userApplications.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No applications submitted yet
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Click on "Pension Application" to submit your first application
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {userApplications.slice(0, 3).map((application) => (
                <div key={application._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Application #{application.applicationNumber || application._id.slice(-6)}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Submitted on {new Date(application.submittedAt).toLocaleDateString()}
                      </p>
                      {application.pensionAmount && (
                        <p className="text-sm text-bd-green-600 dark:text-bd-green-400 font-medium">
                          Pension Amount: BDT {application.pensionAmount.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                    {application.status === 'approved' && (
                      <button className="p-2 text-bd-green-600 hover:bg-bd-green-50 rounded-lg">
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Application History */}
      {userApplications.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Application History
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {userApplications.map((application) => (
                <div key={application._id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {application.fullName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {application.lastDesignation} • {application.department}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                  </div>
                  
                  {/* Application Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Age: {application.age} years
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
                        Last Salary: BDT {application.lastSalary?.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Status History */}
                  {application.history && application.history.length > 0 && (
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Status History:
                      </h4>
                      <div className="space-y-2">
                        {application.history.slice().reverse().map((entry, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              {entry.message}
                            </span>
                            <span className="text-gray-500 dark:text-gray-500">
                              {new Date(entry.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="p-4 bg-bd-green-50 dark:bg-bd-green-900/20 rounded-lg hover:bg-bd-green-100 dark:hover:bg-bd-green-900/30 transition-colors">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-bd-green-600" />
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {t('pension_application')}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Submit a new pension application
                  </p>
                </div>
              </div>
            </button>
            <button className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {t('application_status')}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Track your application status
                  </p>
                </div>
              </div>
            </button>
            <button className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {t('submit_complaint')}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Report any issues or concerns
                  </p>
                </div>
              </div>
            </button>
            <button className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-purple-600" />
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Schedule Appointment
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Book a meeting with an officer
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;