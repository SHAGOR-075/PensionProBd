import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const API_BASE_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token and validate
    const token = localStorage.getItem('pensionProBD_token');
    if (token) {
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('pensionProBD_token');
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      localStorage.removeItem('pensionProBD_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, userType) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, userType }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.requireOtp) {
          // Exclusively for Pension Holder: OTP verification required
          return data;
        }
        setUser(data.user);
        localStorage.setItem('pensionProBD_token', data.token);
        toast.success(data.message || 'Logged in successfully!');
        return data.user;
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      toast.error(error.message || 'Login failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyLoginOtp = async (email, otp) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/verify-login-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('pensionProBD_token', data.token);
        toast.success(data.message || 'লগইন সফল হয়েছে!');
        return data.user;
      } else {
        throw new Error(data.message || 'ভেরিফিকেশন ব্যর্থ হয়েছে');
      }
    } catch (error) {
      toast.error(error.message || 'OTP verification failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.requireOtp) {
          // Exclusively for Pension Holder: OTP verification required
          return data;
        }
        setUser(data.user);
        localStorage.setItem('pensionProBD_token', data.token);
        toast.success(data.message || 'Registration successful!');
        return data.user;
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyRegistrationOtp = async (email, otp) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/verify-registration-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('pensionProBD_token', data.token);
        toast.success(data.message || 'নিবন্ধন ও ভেরিফিকেশন সফল হয়েছে!');
        return data.user;
      } else {
        throw new Error(data.message || 'ভেরিফিকেশন ব্যর্থ হয়েছে');
      }
    } catch (error) {
      toast.error(error.message || 'OTP verification failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async (email, purpose) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, purpose }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'নতুন ওটিপি কোড পাঠানো হয়েছে!');
        return data;
      } else {
        throw new Error(data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to resend OTP');
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pensionProBD_token');
    toast.success('Logged out successfully!');
  };

  const updateProfile = async (profileData) => {
    try {
      const token = localStorage.getItem('pensionProBD_token');
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        toast.success('Profile updated successfully!');
        return data.user;
      } else {
        throw new Error(data.message || 'Profile update failed');
      }
    } catch (error) {
      toast.error(error.message || 'Profile update failed');
      throw error;
    }
  };

  const value = {
    user,
    login,
    verifyLoginOtp,
    register,
    verifyRegistrationOtp,
    resendOtp,
    logout,
    updateProfile,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.userType === 'admin' || user?.userType === 'head_office',
    isPensionHolder: user?.userType === 'pension_holder',
    isAssistantAccountant: user?.userType === 'assistant_accountant',
    isHeadOfOffice: user?.userType === 'head_office'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};