import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { toast } from 'react-hot-toast';
import { 
  User, 
  Calendar, 
  DollarSign, 
  Upload, 
  FileText, 
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const ApplicationForm = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { submitApplication } = useData();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: user.name || '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    nidNumber: '',
    phoneNumber: user.phone || '',
    address: user.address || '',
    
    // Job Information
    lastDesignation: '',
    department: '',
    joiningDate: '',
    retirementDate: '',
    lastSalary: '',
    jobAge: '',
    
    // Documents
    nidFile: null,
    jobDocuments: null,
    
    // Bank Information
    bankName: '',
    accountNumber: '',
    branchName: ''
  });

  const [errors, setErrors] = useState({});

  const steps = [
    { id: 1, name: 'Personal Information', icon: User },
    { id: 2, name: 'Job Information', icon: Calendar },
    { id: 3, name: 'Documents', icon: FileText },
    { id: 4, name: 'Bank Details', icon: DollarSign },
    { id: 5, name: 'Review', icon: CheckCircle }
  ];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const calculateJobAge = (joiningDate, retirementDate) => {
    if (!joiningDate || !retirementDate) return 0;
    const joining = new Date(joiningDate);
    const retirement = new Date(retirementDate);
    const years = retirement.getFullYear() - joining.getFullYear();
    return years;
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.fullName) newErrors.fullName = 'Full name is required';
        if (!formData.fatherName) newErrors.fatherName = 'Father name is required';
        if (!formData.motherName) newErrors.motherName = 'Mother name is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.nidNumber) newErrors.nidNumber = 'NID number is required';
        if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
        if (!formData.address) newErrors.address = 'Address is required';
        break;
      
      case 2:
        if (!formData.lastDesignation) newErrors.lastDesignation = 'Last designation is required';
        if (!formData.department) newErrors.department = 'Department is required';
        if (!formData.joiningDate) newErrors.joiningDate = 'Joining date is required';
        if (!formData.retirementDate) newErrors.retirementDate = 'Retirement date is required';
        if (!formData.lastSalary) newErrors.lastSalary = 'Last salary is required';
        
        // Check job age requirement
        const jobAge = calculateJobAge(formData.joiningDate, formData.retirementDate);
        if (jobAge < 19) {
          newErrors.jobAge = t('age_requirement');
        }
        break;
      
      case 3:
        if (!formData.nidFile) newErrors.nidFile = 'NID document is required';
        if (!formData.jobDocuments) newErrors.jobDocuments = 'Job documents are required';
        break;
      
      case 4:
        if (!formData.bankName) newErrors.bankName = 'Bank name is required';
        if (!formData.accountNumber) newErrors.accountNumber = 'Account number is required';
        if (!formData.branchName) newErrors.branchName = 'Branch name is required';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(4)) return;
    
    try {
      const applicationData = {
        ...formData,
        userId: user.id,
        jobAge: calculateJobAge(formData.joiningDate, formData.retirementDate),
        age: calculateAge(formData.dateOfBirth),
        pensionAmount: Math.floor(parseFloat(formData.lastSalary) * 0.5), // 50% of last salary
      };
      
      await submitApplication(applicationData);
      toast.success(t('application_submitted'));
      
      // Reset form
      setCurrentStep(1);
      setFormData({
        fullName: user.name || '',
        fatherName: '',
        motherName: '',
        dateOfBirth: '',
        nidNumber: '',
        phoneNumber: user.phone || '',
        address: user.address || '',
        lastDesignation: '',
        department: '',
        joiningDate: '',
        retirementDate: '',
        lastSalary: '',
        jobAge: '',
        nidFile: null,
        jobDocuments: null,
        bankName: '',
        accountNumber: '',
        branchName: ''
      });
    } catch (error) {
      toast.error('Failed to submit application');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } dark:bg-gray-700 dark:text-white`}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Father's Name
                </label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 ${
                    errors.fatherName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } dark:bg-gray-700 dark:text-white`}
                />
                {errors.fatherName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fatherName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mother's Name
                </label>
                <input
                  type="text"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 ${
                    errors.motherName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } dark:bg-gray-700 dark:text-white`}
                />
                {errors.motherName && (
                  <p className="mt-1 text-sm text-red-600">{errors.motherName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 ${
                    errors.dateOfBirth ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } dark:bg-gray-700 dark:text-white`}
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  NID Number
                </label>
                <input
                  type="text"
                  name="nidNumber"
                  value={formData.nidNumber}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 ${
                    errors.nidNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } dark:bg-gray-700 dark:text-white`}
                />
                {errors.nidNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.nidNumber}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 ${
                    errors.phoneNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } dark:bg-gray-700 dark:text-white`}
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 ${
                  errors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } dark:bg-gray-700 dark:text-white`}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Job Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Designation
                </label>
                <input
                  type="text"
                  name="lastDesignation"
                  value={formData.lastDesignation}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 ${
                    errors.lastDesignation ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } dark:bg-gray-700 dark:text-white`}
                />
                {errors.lastDesignation && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastDesignation}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 ${
                    errors.department ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } dark:bg-gray-700 dark:text-white`}
                />
                {errors.department && (
                  <p className="mt-1 text-sm text-red-600">{errors.department}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Joining Date
                </label>
                <input
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 ${
                    errors.joiningDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } dark:bg-gray-700 dark:text-white`}
                />
                {errors.joiningDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.joiningDate}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Retirement Date
                </label>
                <input
                  type="date"
                  name="retirementDate"
                  value={formData.retirementDate}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 ${
                    errors.retirementDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } dark:bg-gray-700 dark:text-white`}
                />
                {errors.retirementDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.retirementDate}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Salary (BDT)
                </label>
                <input
                  type="number"
                  name="lastSalary"
                  value={formData.lastSalary}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 ${
                    errors.lastSalary ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } dark:bg-gray-700 dark:text-white`}
                />
                {errors.lastSalary && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastSalary}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Service Length (Years)
                </label>
                <input
                  type="number"
                  value={calculateJobAge(formData.joiningDate, formData.retirementDate)}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                />
                {errors.jobAge && (
                  <p className="mt-1 text-sm text-red-600">{errors.jobAge}</p>
                )}
              </div>
            </div>
            
            {formData.joiningDate && formData.retirementDate && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-100">
                      Service Summary
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Total service: {calculateJobAge(formData.joiningDate, formData.retirementDate)} years
                    </p>
                    {formData.lastSalary && (
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Estimated pension: BDT {Math.floor(parseFloat(formData.lastSalary) * 0.5)} (50% of last salary)
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Document Upload
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('nid_upload')}
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2">
                      <label htmlFor="nidFile" className="cursor-pointer">
                        <span className="text-bd-green-600 hover:text-bd-green-500">
                          Upload NID document
                        </span>
                        <input
                          id="nidFile"
                          name="nidFile"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleChange}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PDF, JPG, PNG up to 10MB
                    </p>
                  </div>
                  {formData.nidFile && (
                    <div className="mt-2 text-sm text-green-600">
                      Selected: {formData.nidFile.name}
                    </div>
                  )}
                </div>
                {errors.nidFile && (
                  <p className="mt-1 text-sm text-red-600">{errors.nidFile}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('job_documents')}
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2">
                      <label htmlFor="jobDocuments" className="cursor-pointer">
                        <span className="text-bd-green-600 hover:text-bd-green-500">
                          Upload job documents
                        </span>
                        <input
                          id="jobDocuments"
                          name="jobDocuments"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleChange}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PDF, JPG, PNG up to 10MB
                    </p>
                  </div>
                  {formData.jobDocuments && (
                    <div className="mt-2 text-sm text-green-600">
                      Selected: {formData.jobDocuments.name}
                    </div>
                  )}
                </div>
                {errors.jobDocuments && (
                  <p className="mt-1 text-sm text-red-600">{errors.jobDocuments}</p>
                )}
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Bank Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bank Name
                </label>
                <select
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 ${
                    errors.bankName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } dark:bg-gray-700 dark:text-white`}
                >
                  <option value="">Select Bank</option>
                  <option value="sonali_bank">Sonali Bank</option>
                  <option value="janata_bank">Janata Bank</option>
                  <option value="rupali_bank">Rupali Bank</option>
                  <option value="agrani_bank">Agrani Bank</option>
                  <option value="dutch_bangla_bank">Dutch-Bangla Bank</option>
                  <option value="brac_bank">BRAC Bank</option>
                  <option value="city_bank">City Bank</option>
                  <option value="eastern_bank">Eastern Bank</option>
                </select>
                {errors.bankName && (
                  <p className="mt-1 text-sm text-red-600">{errors.bankName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 ${
                    errors.accountNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } dark:bg-gray-700 dark:text-white`}
                />
                {errors.accountNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.accountNumber}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Branch Name
                </label>
                <input
                  type="text"
                  name="branchName"
                  value={formData.branchName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-bd-green-500 ${
                    errors.branchName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } dark:bg-gray-700 dark:text-white`}
                />
                {errors.branchName && (
                  <p className="mt-1 text-sm text-red-600">{errors.branchName}</p>
                )}
              </div>
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Review Application
            </h3>
            
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Full Name:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{formData.fullName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Father's Name:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{formData.fatherName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">NID Number:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{formData.nidNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Phone:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{formData.phoneNumber}</span>
                  </div>
                </div>
              </div>
              
              {/* Job Information */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Job Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Designation:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{formData.lastDesignation}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Department:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{formData.department}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Service Length:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {calculateJobAge(formData.joiningDate, formData.retirementDate)} years
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Last Salary:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      BDT {parseFloat(formData.lastSalary).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Bank Information */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Bank Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Bank:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{formData.bankName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Account Number:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{formData.accountNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Branch:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{formData.branchName}</span>
                  </div>
                </div>
              </div>
              
              {/* Pension Calculation */}
              <div className="bg-bd-green-50 dark:bg-bd-green-900/20 rounded-lg p-4">
                <h4 className="font-medium text-bd-green-900 dark:text-bd-green-100 mb-3">
                  Pension Calculation
                </h4>
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span className="text-bd-green-700 dark:text-bd-green-300">Last Salary:</span>
                    <span className="text-bd-green-900 dark:text-bd-green-100 font-medium">
                      BDT {parseFloat(formData.lastSalary).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-bd-green-700 dark:text-bd-green-300">Pension Rate:</span>
                    <span className="text-bd-green-900 dark:text-bd-green-100 font-medium">50%</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg mt-2 pt-2 border-t border-bd-green-200 dark:border-bd-green-800">
                    <span className="text-bd-green-800 dark:text-bd-green-200">Monthly Pension:</span>
                    <span className="text-bd-green-900 dark:text-bd-green-100">
                      BDT {Math.floor(parseFloat(formData.lastSalary) * 0.5).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Progress Steps */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  isActive 
                    ? 'bg-bd-green-600 border-bd-green-600 text-white' 
                    : isCompleted 
                      ? 'bg-green-600 border-green-600 text-white'
                      : 'border-gray-300 dark:border-gray-600 text-gray-400'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="ml-2">
                  <div className={`text-sm font-medium ${
                    isActive 
                      ? 'text-bd-green-600' 
                      : isCompleted 
                        ? 'text-green-600' 
                        : 'text-gray-400'
                  }`}>
                    {step.name}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-px ml-4 ${
                    isCompleted ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            {t('previous')}
          </button>
          
          {currentStep === 5 ? (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 text-sm font-medium text-white bg-bd-green-600 rounded-lg hover:bg-bd-green-700 focus:outline-none focus:ring-2 focus:ring-bd-green-500"
            >
              {t('submit')}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2 text-sm font-medium text-white bg-bd-green-600 rounded-lg hover:bg-bd-green-700 focus:outline-none focus:ring-2 focus:ring-bd-green-500"
            >
              {t('next')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;