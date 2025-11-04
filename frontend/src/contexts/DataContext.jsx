import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

const API_BASE_URL = 'http://localhost:5000/api';

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('pensionProBD_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Fetch data when user changes
  useEffect(() => {
    if (user) {
      fetchApplications();
      fetchComplaints();
      fetchNotifications();
      fetchDashboardStats();
      
      if (user.userType === 'head_office') {
        fetchOfficers();
      }
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/applications`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
        console.error('Failed to fetch applications:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComplaints = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/complaints`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setComplaints(data);
      }
    } catch (error) {
      console.error('Failed to fetch complaints:', error);
    }
  };

  const fetchOfficers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/officers`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setOfficers(data);
      }
    } catch (error) {
      console.error('Failed to fetch officers:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  };

  const submitApplication = async (applicationData) => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      
      // Append all form fields
      Object.keys(applicationData).forEach(key => {
        if (applicationData[key] !== null && applicationData[key] !== undefined) {
          formData.append(key, applicationData[key]);
        }
      });

      const token = localStorage.getItem('pensionProBD_token');
      const response = await fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Application submitted successfully!');
        await fetchApplications(); // Refresh applications
        await fetchDashboardStats(); // Refresh stats
        return data.application;
      } else {
        throw new Error(data.message || 'Application submission failed');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to submit application');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, status, feedback = '') => {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, feedback }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Application status updated successfully!');
        await fetchApplications(); // Refresh applications
        await fetchDashboardStats(); // Refresh stats
        return data.application;
      } else {
        throw new Error(data.message || 'Status update failed');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update application status');
      throw error;
    }
  };

  const submitComplaint = async (complaintData) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/complaints`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(complaintData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Complaint submitted successfully!');
        await fetchComplaints(); // Refresh complaints
        await fetchDashboardStats(); // Refresh stats
        return data.complaint;
      } else {
        throw new Error(data.message || 'Complaint submission failed');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to submit complaint');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const issueRedFlag = async (complaintId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}/red-flag`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Red flag issued successfully!');
        await fetchComplaints(); // Refresh complaints
        await fetchOfficers(); // Refresh officers
        await fetchDashboardStats(); // Refresh stats
        return data.complaint;
      } else {
        throw new Error(data.message || 'Failed to issue red flag');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to issue red flag');
      throw error;
    }
  };

  const addOfficer = async (officerData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/officers`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(officerData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Officer added successfully!');
        await fetchOfficers(); // Refresh officers
        return data.officer;
      } else {
        throw new Error(data.message || 'Failed to add officer');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to add officer');
      throw error;
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        await fetchNotifications(); // Refresh notifications
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const value = {
    applications,
    complaints,
    officers,
    notifications,
    dashboardStats,
    loading,
    submitApplication,
    updateApplicationStatus,
    submitComplaint,
    issueRedFlag,
    addOfficer,
    markNotificationAsRead,
    fetchApplications,
    fetchComplaints,
    fetchOfficers,
    fetchNotifications,
    fetchDashboardStats
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};