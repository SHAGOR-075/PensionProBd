// import React, { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { useAuth } from '../../contexts/AuthContext';
// import { useData } from '../../contexts/DataContext';
// import { toast } from 'react-hot-toast';
// import { 
//   AlertTriangle, 
//   Users, 
//   Shield, 
//   UserX,
//   UserCheck,
//   MessageSquare,
//   Flag,
//   Eye,
//   Plus,
//   Edit,
//   Trash2
// } from 'lucide-react';

// const HeadOfficeDashboard = ({ activeTab }) => {
//   const { t } = useTranslation();
//   const { user } = useAuth();
//   const { complaints, officers, issueRedFlag, applications, addOfficer, dashboardStats } = useData();
//   const [selectedComplaint, setSelectedComplaint] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [modalType, setModalType] = useState('');
//   const [newOfficer, setNewOfficer] = useState({
//     name: '',
//     email: '',
//     designation: '',
//     department: '',
//     userType: 'assistant_accountant'
//   });

//   const pendingComplaints = complaints.filter(complaint => complaint.status === 'pending');
//   const activeOfficers = officers.filter(officer => officer.isActive);
//   const disabledOfficers = officers.filter(officer => !officer.isActive);

//   const handleComplaintAction = (complaint, action) => {
//     setSelectedComplaint(complaint);
//     setModalType(action);
//     setShowModal(true);
//   };

//   const handleRedFlag = async () => {
//     if (!selectedComplaint) return;
    
//     try {
//       await issueRedFlag(selectedComplaint._id);
//       setShowModal(false);
//     } catch (error) {
//       console.error('Failed to issue red flag:', error);
//     }
//   };

//   const handleAddOfficer = async () => {
//     try {
//       await addOfficer(newOfficer);
//       setShowModal(false);
//       setNewOfficer({ name: '', email: '', designation: '', department: '', userType: 'assistant_accountant' });
//     } catch (error) {
//       console.error('Failed to add officer:', error);
//     }
//   };

//   const renderDashboard = () => (
//     <div className="space-y-6">
//       {/* Welcome Section */}
//       <div className="bg-gradient-to-r from-bd-green-600 to-bd-green-700 rounded-xl p-6 text-white">
//         <h1 className="text-3xl font-bold mb-2">
//           Welcome, {user.name}
//         </h1>
//         <p className="text-bd-green-100">
//           Head of Office Dashboard - Manage complaints and officer accounts
//         </p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
//                 Pending Complaints
//               </p>
//               <p className="text-3xl font-bold text-gray-900 dark:text-white">
//                 {dashboardStats.pendingComplaints || pendingComplaints.length}
//               </p>
//             </div>
//             <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/20">
//               <AlertTriangle className="w-6 h-6 text-red-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
//                 Active Officers
//               </p>
//               <p className="text-3xl font-bold text-gray-900 dark:text-white">
//                 {dashboardStats.activeOfficers || activeOfficers.length}
//               </p>
//             </div>
//             <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
//               <UserCheck className="w-6 h-6 text-green-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
//                 Disabled Officers
//               </p>
//               <p className="text-3xl font-bold text-gray-900 dark:text-white">
//                 {dashboardStats.disabledOfficers || disabledOfficers.length}
//               </p>
//             </div>
//             <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/20">
//               <UserX className="w-6 h-6 text-red-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
//                 Total Applications
//               </p>
//               <p className="text-3xl font-bold text-gray-900 dark:text-white">
//                 {dashboardStats.totalApplications || applications.length}
//               </p>
//             </div>
//             <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
//               <Shield className="w-6 h-6 text-blue-600" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Recent Complaints */}
//       <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
//         <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//           <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
//             Recent Complaints
//           </h2>
//         </div>
//         <div className="p-6">
//           {pendingComplaints.length === 0 ? (
//             <div className="text-center py-8">
//               <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-500 dark:text-gray-400">
//                 No pending complaints
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {pendingComplaints.slice(0, 5).map((complaint) => (
//                 <div key={complaint._id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h3 className="font-semibold text-gray-900 dark:text-white">
//                         Complaint #{complaint.complaintNumber || complaint._id.slice(-6)}
//                       </h3>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         Against: {complaint.officerName} • {new Date(complaint.submittedAt).toLocaleDateString()}
//                       </p>
//                       <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
//                         Subject: {complaint.subject}
//                       </p>
//                       <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
//                         {complaint.description.substring(0, 100)}...
//                       </p>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <button
//                         onClick={() => handleComplaintAction(complaint, 'view')}
//                         className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
//                       >
//                         <Eye className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => handleComplaintAction(complaint, 'red-flag')}
//                         className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
//                       >
//                         <Flag className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );

//   const renderComplaints = () => (
//     <div className="space-y-6">
//       <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
//         <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//           <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
//             All Complaints
//           </h2>
//         </div>
//         <div className="p-6">
//           <div className="space-y-4">
//             {complaints.map((complaint) => (
//               <div key={complaint._id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h3 className="font-semibold text-gray-900 dark:text-white">
//                       Complaint #{complaint.complaintNumber || complaint._id.slice(-6)}
//                     </h3>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                       Against: {complaint.officerName} • {new Date(complaint.submittedAt).toLocaleDateString()}
//                     </p>
//                     <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
//                       Subject: {complaint.subject}
//                     </p>
//                     <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
//                       {complaint.description}
//                     </p>
//                     <div className="mt-2">
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         complaint.status === 'pending' 
//                           ? 'bg-yellow-100 text-yellow-800' 
//                           : complaint.redFlagIssued 
//                             ? 'bg-red-100 text-red-800'
//                             : 'bg-green-100 text-green-800'
//                       }`}>
//                         {complaint.redFlagIssued ? 'Red Flag Issued' : complaint.status}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <button
//                       onClick={() => handleComplaintAction(complaint, 'view')}
//                       className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
//                     >
//                       <Eye className="w-4 h-4" />
//                     </button>
//                     {!complaint.redFlagIssued && complaint.status === 'pending' && (
//                       <button
//                         onClick={() => handleComplaintAction(complaint, 'red-flag')}
//                         className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
//                       >
//                         <Flag className="w-4 h-4" />
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderOfficers = () => (
//     <div className="space-y-6">
//       <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
//         <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
//           <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
//             Officer Management
//           </h2>
//           <button
//             onClick={() => {
//               setModalType('add-officer');
//               setShowModal(true);
//             }}
//             className="flex items-center space-x-2 px-4 py-2 bg-bd-green-600 text-white rounded-lg hover:bg-bd-green-700"
//           >
//             <Plus className="w-4 h-4" />
//             <span>Add Officer</span>
//           </button>
//         </div>
//         <div className="p-6">
//           <div className="space-y-4">
//             {officers.map((officer) => (
//               <div key={officer._id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-4">
//                     <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
//                       officer.isActive ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
//                     }`}>
//                       <Users className={`w-6 h-6 ${officer.isActive ? 'text-green-600' : 'text-red-600'}`} />
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-gray-900 dark:text-white">
//                         {officer.name}
//                       </h3>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         {officer.designation} • {officer.department}
//                       </p>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         Email: {officer.email}
//                       </p>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         Red Flags: {officer.redFlags || 0}/3
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//                       officer.isActive 
//                         ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
//                         : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
//                     }`}>
//                       {officer.isActive ? 'Active' : 'Disabled'}
//                     </span>
//                     {(officer.redFlags || 0) >= 3 && (
//                       <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
//                         3 Red Flags
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderModal = () => {
//     if (!showModal) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
//               {modalType === 'view' ? 'Complaint Details' : 
//                modalType === 'red-flag' ? 'Issue Red Flag' : 'Add New Officer'}
//             </h3>
//             <button
//               onClick={() => setShowModal(false)}
//               className="text-gray-400 hover:text-gray-600"
//             >
//               ×
//             </button>
//           </div>

//           {modalType === 'view' && selectedComplaint && (
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Complaint ID
//                 </label>
//                 <p className="text-gray-900 dark:text-white">#{selectedComplaint.complaintNumber || selectedComplaint._id.slice(-6)}</p>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Against Officer
//                 </label>
//                 <p className="text-gray-900 dark:text-white">{selectedComplaint.officerName}</p>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Subject
//                 </label>
//                 <p className="text-gray-900 dark:text-white">{selectedComplaint.subject}</p>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Description
//                 </label>
//                 <p className="text-gray-900 dark:text-white">{selectedComplaint.description}</p>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Submitted Date
//                 </label>
//                 <p className="text-gray-900 dark:text-white">
//                   {new Date(selectedComplaint.submittedAt).toLocaleDateString()}
//                 </p>
//               </div>
//             </div>
//           )}

//           {modalType === 'red-flag' && selectedComplaint && (
//             <div className="space-y-4">
//               <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
//                 <div className="flex items-center space-x-2">
//                   <AlertTriangle className="w-5 h-5 text-red-600" />
//                   <h4 className="font-medium text-red-900 dark:text-red-100">
//                     Issue Red Flag Warning
//                   </h4>
//                 </div>
//                 <p className="text-red-700 dark:text-red-300 mt-2">
//                   This will issue a red flag warning to {selectedComplaint.officerName}. 
//                   If they receive 3 red flags, their account will be automatically disabled.
//                 </p>
//               </div>
//               <div className="flex justify-end space-x-3">
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleRedFlag}
//                   className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//                 >
//                   Issue Red Flag
//                 </button>
//               </div>
//             </div>
//           )}

//           {modalType === 'add-officer' && (
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Officer Name
//                 </label>
//                 <input
//                   type="text"
//                   value={newOfficer.name}
//                   onChange={(e) => setNewOfficer({...newOfficer, name: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 dark:bg-gray-700 dark:text-white"
//                   placeholder="Enter officer name"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   value={newOfficer.email}
//                   onChange={(e) => setNewOfficer({...newOfficer, email: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 dark:bg-gray-700 dark:text-white"
//                   placeholder="Enter email address"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Designation
//                 </label>
//                 <input
//                   type="text"
//                   value={newOfficer.designation}
//                   onChange={(e) => setNewOfficer({...newOfficer, designation: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 dark:bg-gray-700 dark:text-white"
//                   placeholder="Enter designation"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Department
//                 </label>
//                 <input
//                   type="text"
//                   value={newOfficer.department}
//                   onChange={(e) => setNewOfficer({...newOfficer, department: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 dark:bg-gray-700 dark:text-white"
//                   placeholder="Enter department"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   User Type
//                 </label>
//                 <select
//                   value={newOfficer.userType}
//                   onChange={(e) => setNewOfficer({...newOfficer, userType: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 dark:bg-gray-700 dark:text-white"
//                 >
//                   <option value="assistant_accountant">Assistant Accountant</option>
//                   <option value="head_office">Head Office</option>
//                 </select>
//               </div>
//               <div className="flex justify-end space-x-3">
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleAddOfficer}
//                   className="px-4 py-2 bg-bd-green-600 text-white rounded-lg hover:bg-bd-green-700"
//                 >
//                   Add Officer
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   switch (activeTab) {
//     case 'dashboard':
//       return (
//         <>
//           {renderDashboard()}
//           {renderModal()}
//         </>
//       );
//     case 'complaints':
//       return (
//         <>
//           {renderComplaints()}
//           {renderModal()}
//         </>
//       );
//     case 'officers':
//       return (
//         <>
//           {renderOfficers()}
//           {renderModal()}
//         </>
//       );
//     case 'red-flags':
//       return (
//         <>
//           {renderComplaints()}
//           {renderModal()}
//         </>
//       );
//     default:
//       return (
//         <>
//           {renderDashboard()}
//           {renderModal()}
//         </>
//       );
//   }
// };

// export default HeadOfficeDashboard;

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { 
  AlertTriangle, 
  Users, 
  Shield, 
  UserX,
  UserCheck,
  MessageSquare,
  Flag,
  Eye,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  Calendar,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  Award,
  AlertCircle
} from 'lucide-react';

const HeadOfficeDashboard = ({ activeTab }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { complaints, officers, issueRedFlag, applications, addOfficer, toggleOfficerStatus, dashboardStats, fetchDashboardStats, fetchReports, updateComplaintStatus, fetchComplaints, fetchOfficers } = useData();
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [timeRange, setTimeRange] = useState('week');
  const [newOfficer, setNewOfficer] = useState({
    name: '',
    email: '',
    designation: '',
    department: '',
    userType: 'assistant_accountant'
  });
  const [reports, setReports] = useState(null);
  const [reportType, setReportType] = useState('overall');
  const [reportStartDate, setReportStartDate] = useState('');
  const [reportEndDate, setReportEndDate] = useState('');
  const [loadingReports, setLoadingReports] = useState(false);

  const handleLoadReports = async () => {
    setLoadingReports(true);
    try {
      const data = await fetchReports(reportType, reportStartDate, reportEndDate);
      if (data) {
        setReports(data);
      }
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoadingReports(false);
    }
  };

  // Real-time data refresh - Make the page dynamic
  useEffect(() => {
    // Initial fetch
    fetchDashboardStats();
    fetchComplaints();
    fetchOfficers();
    
    // Set up auto-refresh interval
    const interval = setInterval(() => {
      fetchDashboardStats();
      fetchComplaints();
      fetchOfficers();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [fetchDashboardStats, fetchComplaints, fetchOfficers]);

  const pendingComplaints = complaints.filter(complaint => complaint.status === 'pending');
  const activeOfficers = officers.filter(officer => officer.isActive);
  const disabledOfficers = officers.filter(officer => !officer.isActive);
  const criticalOfficers = officers.filter(officer => (officer.redFlags || 0) >= 2);

  // Filter complaints based on search and status
  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.officerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleComplaintAction = (complaint, action) => {
    setSelectedComplaint(complaint);
    setModalType(action);
    setShowModal(true);
  };

  const handleRedFlag = async () => {
    if (!selectedComplaint) return;
    
    try {
      await issueRedFlag(selectedComplaint._id);
      setShowModal(false);
    } catch (error) {
      console.error('Failed to issue red flag:', error);
    }
  };

  const handleAddOfficer = async () => {
    try {
      await addOfficer(newOfficer);
      setShowModal(false);
      setNewOfficer({ name: '', email: '', designation: '', department: '', userType: 'assistant_accountant' });
    } catch (error) {
      console.error('Failed to add officer:', error);
    }
  };

  const getComplaintPriorityColor = (complaint) => {
    const daysSinceSubmitted = Math.floor((new Date() - new Date(complaint.submittedAt)) / (1000 * 60 * 60 * 24));
    if (daysSinceSubmitted > 7) return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    if (daysSinceSubmitted > 3) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
    return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
  };

  const getComplaintCategoryIcon = (category) => {
    switch (category) {
      case 'delay': return <Clock className="w-4 h-4" />;
      case 'misconduct': return <AlertTriangle className="w-4 h-4" />;
      case 'corruption': return <Shield className="w-4 h-4" />;
      case 'poor_service': return <XCircle className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Enhanced Welcome Section with Real-time Updates */}
      <div className="bg-gradient-to-r from-bd-green-600 via-bd-green-700 to-bd-green-800 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-bd-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome, {user.name}
              </h1>
              <p className="text-bd-green-100 mb-4">
                Head of Office Dashboard - Comprehensive oversight and management
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Activity className="w-4 h-4" />
                  <span>System Status: Active</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Last Updated: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{new Date().toLocaleDateString()}</div>
              <div className="text-bd-green-200">{new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid with Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pending Complaints
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {dashboardStats.pendingComplaints || pendingComplaints.length}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
                <span className="text-sm text-red-600">+12% from last week</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Officers
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {dashboardStats.activeOfficers || activeOfficers.length}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+5% efficiency</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Critical Officers
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {criticalOfficers.length}
              </p>
              <div className="flex items-center mt-2">
                <AlertCircle className="w-4 h-4 text-orange-500 mr-1" />
                <span className="text-sm text-orange-600">2+ Red Flags</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/20">
              <Flag className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Applications
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {dashboardStats.totalApplications || applications.length}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                <span className="text-sm text-blue-600">+8% this month</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Complaint Resolution Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Complaint Resolution Trends
              </h3>
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 dark:bg-gray-700 dark:text-white"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
              </select>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Resolved</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-sm font-medium">75%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                  <span className="text-sm font-medium">20%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Dismissed</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                  </div>
                  <span className="text-sm font-medium">5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Officer Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Officer Performance Overview
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-900 dark:text-green-100">Top Performers</span>
                </div>
                <span className="text-green-600 font-bold">{activeOfficers.filter(o => (o.redFlags || 0) === 0).length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-900 dark:text-yellow-100">Needs Attention</span>
                </div>
                <span className="text-yellow-600 font-bold">{officers.filter(o => (o.redFlags || 0) === 1).length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Flag className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-red-900 dark:text-red-100">Critical Status</span>
                </div>
                <span className="text-red-600 font-bold">{criticalOfficers.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Critical Complaints */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Critical Complaints Requiring Immediate Attention
            </h2>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <Download className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          {pendingComplaints.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                No pending complaints
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                All complaints have been addressed
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingComplaints.slice(0, 5).map((complaint) => {
                const daysSinceSubmitted = Math.floor((new Date() - new Date(complaint.submittedAt)) / (1000 * 60 * 60 * 24));
                return (
                  <div key={complaint._id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center space-x-2">
                            {getComplaintCategoryIcon(complaint.category)}
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {complaint.subject}
                            </h3>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplaintPriorityColor(complaint)}`}>
                            {daysSinceSubmitted === 0 ? 'Today' : `${daysSinceSubmitted} days ago`}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          Against: <span className="font-medium">{complaint.officerName}</span> • 
                          ID: #{complaint.complaintNumber || complaint._id.slice(-6)}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                          {complaint.description.substring(0, 150)}...
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>Category: {complaint.category || 'other'}</span>
                          <span>•</span>
                          <span>Submitted: {new Date(complaint.submittedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleComplaintAction(complaint, 'view')}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleComplaintAction(complaint, 'red-flag')}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Issue Red Flag"
                        >
                          <Flag className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* System Health Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <Activity className="w-6 h-6 text-green-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">System Health</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
              <span className="text-green-600 font-medium">Healthy</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">API Response</span>
              <span className="text-green-600 font-medium">Fast</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Uptime</span>
              <span className="text-green-600 font-medium">99.9%</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Today's Activity</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">New Complaints</span>
              <span className="text-blue-600 font-medium">3</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Resolved Issues</span>
              <span className="text-green-600 font-medium">7</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Red Flags Issued</span>
              <span className="text-red-600 font-medium">1</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="w-6 h-6 text-purple-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Upcoming Tasks</h3>
          </div>
          <div className="space-y-3">
            <div className="text-sm">
              <p className="text-gray-900 dark:text-white font-medium">Monthly Review</p>
              <p className="text-gray-500 dark:text-gray-400">Due in 3 days</p>
            </div>
            <div className="text-sm">
              <p className="text-gray-900 dark:text-white font-medium">Officer Training</p>
              <p className="text-gray-500 dark:text-gray-400">Next week</p>
            </div>
            <div className="text-sm">
              <p className="text-gray-900 dark:text-white font-medium">System Audit</p>
              <p className="text-gray-500 dark:text-gray-400">End of month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderComplaints = () => (
    <div className="space-y-6">
      {/* Enhanced Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Complaint Management
          </h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
            <button className="px-4 py-2 bg-bd-green-600 text-white rounded-lg hover:bg-bd-green-700 transition-colors">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="space-y-4">
            {filteredComplaints.map((complaint) => (
              <div key={complaint._id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getComplaintCategoryIcon(complaint.category)}
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {complaint.subject}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplaintPriorityColor(complaint)}`}>
                        {complaint.category || 'other'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Against: <span className="font-medium">{complaint.officerName}</span> • 
                      ID: #{complaint.complaintNumber || complaint._id.slice(-6)} • 
                      {new Date(complaint.submittedAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      {complaint.description}
                    </p>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                        complaint.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' 
                          : complaint.status === 'resolved'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                          : complaint.status === 'dismissed'
                          ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                          : complaint.redFlagIssued 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                      }`}>
                        {complaint.status === 'resolved' && <CheckCircle className="w-3 h-3" />}
                        <span>{complaint.redFlagIssued ? 'Red Flag Issued' : complaint.status === 'resolved' ? 'Solved' : complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}</span>
                      </span>
                      {complaint.resolvedAt && (
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          Resolved: {new Date(complaint.resolvedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleComplaintAction(complaint, 'view')}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {complaint.status === 'pending' && (
                      <>
                        <button
                          onClick={async () => {
                            try {
                              await updateComplaintStatus(complaint._id, 'resolved', 'Complaint resolved successfully');
                            } catch (error) {
                              console.error('Failed to resolve complaint:', error);
                            }
                          }}
                          className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          title="Mark as Resolved"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        {!complaint.redFlagIssued && (
                          <button
                            onClick={() => handleComplaintAction(complaint, 'red-flag')}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Issue Red Flag"
                          >
                            <Flag className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderOfficers = () => (
    <div className="space-y-6">
      {/* Officer Management Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Officer Management
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage officer accounts and monitor performance
            </p>
          </div>
          <button
            onClick={() => {
              setModalType('add-officer');
              setShowModal(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-bd-green-600 text-white rounded-lg hover:bg-bd-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Officer</span>
          </button>
        </div>

        {/* Officer Stats */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{activeOfficers.length}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Active Officers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{disabledOfficers.length}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Disabled Officers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{criticalOfficers.length}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Critical Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{officers.filter(o => (o.redFlags || 0) === 0).length}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Clean Record</div>
            </div>
          </div>
        </div>

        {/* Officers List */}
        <div className="p-6">
          <div className="space-y-4">
            {officers.map((officer) => (
              <div key={officer._id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      officer.isActive ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
                    }`}>
                      <Users className={`w-6 h-6 ${officer.isActive ? 'text-green-600' : 'text-red-600'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {officer.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {officer.designation} • {officer.department}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">{officer.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Flag className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Red Flags: {officer.redFlags || 0}/3
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      officer.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                    }`}>
                      {officer.isActive ? 'Active' : 'Disabled'}
                    </span>
                    {(officer.redFlags || 0) >= 3 && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full dark:bg-red-900/20 dark:text-red-300">
                        3 Red Flags
                      </span>
                    )}
                    {(officer.redFlags || 0) >= 2 && (officer.redFlags || 0) < 3 && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full dark:bg-orange-900/20 dark:text-orange-300">
                        Critical
                      </span>
                    )}
                    <button
                      onClick={async () => {
                        try {
                          await toggleOfficerStatus(officer._id);
                        } catch (error) {
                          console.error('Failed to toggle officer status:', error);
                        }
                      }}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        officer.isActive
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                      title={officer.isActive ? 'Deactivate Account' : 'Activate Account'}
                    >
                      {officer.isActive ? (
                        <>
                          <UserX className="w-4 h-4 inline mr-1" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-4 h-4 inline mr-1" />
                          Activate
                        </>
                      )}
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

  const renderModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {modalType === 'view' ? 'Complaint Details' : 
               modalType === 'red-flag' ? 'Issue Red Flag Warning' : 'Add New Officer'}
            </h3>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {modalType === 'view' && selectedComplaint && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Complaint ID
                  </label>
                  <p className="text-gray-900 dark:text-white">#{selectedComplaint.complaintNumber || selectedComplaint._id.slice(-6)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <p className="text-gray-900 dark:text-white capitalize">{selectedComplaint.category || 'other'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Against Officer
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedComplaint.officerName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <div className="flex items-center space-x-2">
                    <p className="text-gray-900 dark:text-white capitalize">
                      {selectedComplaint.status === 'resolved' ? 'Solved' : selectedComplaint.status}
                    </p>
                    {selectedComplaint.status === 'resolved' && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Subject
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedComplaint.subject}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedComplaint.description}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Submitted Date
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(selectedComplaint.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Days Pending
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {Math.floor((new Date() - new Date(selectedComplaint.submittedAt)) / (1000 * 60 * 60 * 24))} days
                  </p>
                </div>
                {selectedComplaint.resolution && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Resolution
                    </label>
                    <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      {selectedComplaint.resolution}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {selectedComplaint.status !== 'resolved' && selectedComplaint.status !== 'dismissed' && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex items-center justify-end space-x-3">
                    <button
                      onClick={async () => {
                        try {
                          await updateComplaintStatus(selectedComplaint._id, 'dismissed', 'Complaint dismissed by Head Office');
                          setShowModal(false);
                          setSelectedComplaint(null);
                        } catch (error) {
                          console.error('Failed to dismiss complaint:', error);
                        }
                      }}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Dismiss</span>
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          await updateComplaintStatus(selectedComplaint._id, 'resolved', 'Complaint resolved successfully');
                          setShowModal(false);
                          setSelectedComplaint(null);
                        } catch (error) {
                          console.error('Failed to resolve complaint:', error);
                        }
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Mark as Resolved</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {modalType === 'red-flag' && selectedComplaint && (
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h4 className="font-medium text-red-900 dark:text-red-100">
                    Issue Red Flag Warning
                  </h4>
                </div>
                <p className="text-red-700 dark:text-red-300 mt-2">
                  This will issue a red flag warning to {selectedComplaint.officerName}. 
                  If they receive 3 red flags, their account will be automatically disabled.
                </p>
                <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/40 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    <strong>Complaint:</strong> {selectedComplaint.subject}
                  </p>
                  <p className="text-sm text-red-800 dark:text-red-200 mt-1">
                    <strong>Description:</strong> {selectedComplaint.description}
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRedFlag}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Issue Red Flag
                </button>
              </div>
            </div>
          )}

          {modalType === 'add-officer' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Officer Name
                  </label>
                  <input
                    type="text"
                    value={newOfficer.name}
                    onChange={(e) => setNewOfficer({...newOfficer, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter officer name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newOfficer.email}
                    onChange={(e) => setNewOfficer({...newOfficer, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={newOfficer.designation}
                    onChange={(e) => setNewOfficer({...newOfficer, designation: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter designation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    value={newOfficer.department}
                    onChange={(e) => setNewOfficer({...newOfficer, department: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter department"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    User Type
                  </label>
                  <select
                    value={newOfficer.userType}
                    onChange={(e) => setNewOfficer({...newOfficer, userType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="assistant_accountant">Assistant Accountant</option>
                    <option value="head_office">Head Office</option>
                  </select>
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Note:</strong> The new officer will receive default credentials (password: admin123) 
                  and should change their password on first login.
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddOfficer}
                  className="px-4 py-2 bg-bd-green-600 text-white rounded-lg hover:bg-bd-green-700 transition-colors"
                >
                  Add Officer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (activeTab === 'reports') {
      handleLoadReports();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, reportType, reportStartDate, reportEndDate]);

  const renderReports = () => (
    <div className="space-y-6">
      {/* Report Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Comprehensive Reports & Analytics
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            View detailed reports on applications, complaints, and officer performance
          </p>
        </div>

        {/* Report Filters */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="overall">Overall Statistics</option>
                <option value="applications">Applications</option>
                <option value="complaints">Complaints</option>
                <option value="officers">Officers</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date (Optional)
              </label>
              <input
                type="date"
                value={reportStartDate}
                onChange={(e) => setReportStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date (Optional)
              </label>
              <input
                type="date"
                value={reportEndDate}
                onChange={(e) => setReportEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleLoadReports}
                disabled={loadingReports}
                className="w-full px-4 py-2 bg-bd-green-600 text-white rounded-lg hover:bg-bd-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingReports ? 'Loading...' : 'Generate Report'}
              </button>
            </div>
          </div>
        </div>

        {/* Reports Content */}
        <div className="p-6">
          {loadingReports ? (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
              <p className="text-gray-500 dark:text-gray-400">Loading reports...</p>
            </div>
          ) : reports ? (
            <div className="space-y-6">
              {/* Overall Statistics */}
              {reports.overall && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Overall Statistics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Today's Applications</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{reports.overall.todayApplications || 0}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Today's Complaints</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{reports.overall.todayComplaints || 0}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{reports.overall.totalUsers || 0}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Pension Holders</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{reports.overall.totalPensionHolders || 0}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Application Reports */}
              {reports.applications && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Application Reports
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{reports.applications.total || 0}</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                      <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{reports.applications.pending || 0}</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Forwarded</p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{reports.applications.forwarded || 0}</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Approved</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">{reports.applications.approved || 0}</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Rejected</p>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">{reports.applications.rejected || 0}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Complaint Reports */}
              {reports.complaints && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Complaint Reports
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{reports.complaints.total || 0}</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                      <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{reports.complaints.pending || 0}</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Resolved</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">{reports.complaints.resolved || 0}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Dismissed</p>
                      <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{reports.complaints.dismissed || 0}</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Red Flags</p>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">{reports.complaints.redFlagIssued || 0}</p>
                    </div>
                  </div>
                  {reports.complaints.byCategory && reports.complaints.byCategory.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Complaints by Category</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {reports.complaints.byCategory.map((item, index) => (
                          <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{item._id || 'Other'}</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{item.count || 0}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Officer Reports */}
              {reports.officers && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Officer Performance Reports
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Officers</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{reports.officers.total || 0}</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">{reports.officers.active || 0}</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Disabled</p>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">{reports.officers.disabled || 0}</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">With Red Flags</p>
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{reports.officers.withRedFlags || 0}</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Critical (2+)</p>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">{reports.officers.critical || 0}</p>
                    </div>
                  </div>
                  {reports.officers.topComplaints && reports.officers.topComplaints.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Top Officers with Most Complaints</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                              <th className="text-left p-2 text-gray-700 dark:text-gray-300">Officer Name</th>
                              <th className="text-left p-2 text-gray-700 dark:text-gray-300">Designation</th>
                              <th className="text-left p-2 text-gray-700 dark:text-gray-300">Department</th>
                              <th className="text-center p-2 text-gray-700 dark:text-gray-300">Complaints</th>
                              <th className="text-center p-2 text-gray-700 dark:text-gray-300">Red Flags</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reports.officers.topComplaints.map((item, index) => (
                              <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                                <td className="p-2 text-gray-900 dark:text-white">{item.officerName}</td>
                                <td className="p-2 text-gray-600 dark:text-gray-400">{item.officerDesignation}</td>
                                <td className="p-2 text-gray-600 dark:text-gray-400">{item.officerDepartment}</td>
                                <td className="p-2 text-center">
                                  <span className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-full text-xs font-medium">
                                    {item.complaintCount || 0}
                                  </span>
                                </td>
                                <td className="p-2 text-center">
                                  <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium">
                                    {item.redFlagCount || 0}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Click "Generate Report" to view reports</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  switch (activeTab) {
    case 'dashboard':
      return (
        <>
          {renderDashboard()}
          {renderModal()}
        </>
      );
    case 'complaints':
      return (
        <>
          {renderComplaints()}
          {renderModal()}
        </>
      );
    case 'officers':
      return (
        <>
          {renderOfficers()}
          {renderModal()}
        </>
      );
    case 'red-flags':
      return (
        <>
          {renderComplaints()}
          {renderModal()}
        </>
      );
    case 'reports':
      return renderReports();
    default:
      return (
        <>
          {renderDashboard()}
          {renderModal()}
        </>
      );
  }
};

export default HeadOfficeDashboard;