import React, { useState, useEffect } from 'react';
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
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Building2,
  ShieldCheck,
  CreditCard,
  FileCheck2,
  HelpCircle,
  Eye,
  Info
} from 'lucide-react';

const ApplicationForm = ({ editingApplication = null, onComplete }) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { submitApplication, updateApplication } = useData();

  const isBengali = i18n.language === 'bn';

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
    branchName: '',
    
    // Declaration
    agreeDeclaration: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingApplication) {
      const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toISOString().split('T')[0];
      };

      setFormData({
        fullName: editingApplication.fullName || user.name || '',
        fatherName: editingApplication.fatherName || '',
        motherName: editingApplication.motherName || '',
        dateOfBirth: formatDate(editingApplication.dateOfBirth),
        nidNumber: editingApplication.nidNumber || '',
        phoneNumber: editingApplication.phoneNumber || user.phone || '',
        address: editingApplication.address || user.address || '',
        lastDesignation: editingApplication.lastDesignation || '',
        department: editingApplication.department || '',
        joiningDate: formatDate(editingApplication.joiningDate),
        retirementDate: formatDate(editingApplication.retirementDate),
        lastSalary: editingApplication.lastSalary?.toString() || '',
        jobAge: editingApplication.jobAge?.toString() || '',
        nidFile: null,
        jobDocuments: null,
        bankName: editingApplication.bankName || '',
        accountNumber: editingApplication.accountNumber || '',
        branchName: editingApplication.branchName || '',
        agreeDeclaration: true
      });
    }
  }, [editingApplication, user]);

  const steps = [
    { id: 1, nameBn: 'ব্যক্তিগত বিবরণ', nameEn: 'Personal Information', icon: User },
    { id: 2, nameBn: 'চাকুরির তথ্য', nameEn: 'Employment Details', icon: Calendar },
    { id: 3, nameBn: 'নথিপত্র সংযুক্তি', nameEn: 'Document Attachments', icon: Upload },
    { id: 4, nameBn: 'ব্যাংক হিসাব ও EFT', nameEn: 'Bank & EFT Details', icon: CreditCard },
    { id: 5, nameBn: 'ঘোষণা ও পর্যালোচনা', nameEn: 'Review & Declaration', icon: FileCheck2 }
  ];

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
    let years = retirement.getFullYear() - joining.getFullYear();
    const monthDiff = retirement.getMonth() - joining.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && retirement.getDate() < joining.getDate())) {
      years--;
    }
    return years > 0 ? years : 0;
  };

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (file && file.size > 10 * 1024 * 1024) {
        toast.error(isBengali ? 'ফাইলের আকার ১০ মেগাবাইটের কম হতে হবে' : 'File size must be under 10MB');
        return;
      }
      setFormData(prev => ({ ...prev, [name]: file }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = isBengali ? 'পূর্ণ নাম আবশ্যক' : 'Full name is required';
      if (!formData.fatherName.trim()) newErrors.fatherName = isBengali ? 'পিতার নাম আবশ্যক' : "Father's name is required";
      if (!formData.motherName.trim()) newErrors.motherName = isBengali ? 'মাতার নাম আবশ্যক' : "Mother's name is required";
      if (!formData.dateOfBirth) newErrors.dateOfBirth = isBengali ? 'জন্ম তারিখ আবশ্যক' : 'Date of birth is required';
      if (!formData.nidNumber.trim()) {
        newErrors.nidNumber = isBengali ? 'জাতীয় পরিচয়পত্র (NID) নম্বর আবশ্যক' : 'NID number is required';
      } else if (formData.nidNumber.trim().length < 10) {
        newErrors.nidNumber = isBengali ? 'সঠিক NID নম্বর প্রদান করুন (১০-১৭ ডিজিট)' : 'Valid NID number required (10-17 digits)';
      }
      if (!formData.phoneNumber.trim()) newErrors.phoneNumber = isBengali ? 'মোবাইল নম্বর আবশ্যক' : 'Phone number is required';
      if (!formData.address.trim()) newErrors.address = isBengali ? 'বর্তমান ও স্থায়ী ঠিকানা আবশ্যক' : 'Address is required';
    }

    if (step === 2) {
      if (!formData.lastDesignation.trim()) newErrors.lastDesignation = isBengali ? 'শেষ পদবি আবশ্যক' : 'Last designation is required';
      if (!formData.department.trim()) newErrors.department = isBengali ? 'মন্ত্রণালয় বা বিভাগ আবশ্যক' : 'Department/Ministry is required';
      if (!formData.joiningDate) newErrors.joiningDate = isBengali ? 'যোগদানের তারিখ আবশ্যক' : 'Joining date is required';
      if (!formData.retirementDate) newErrors.retirementDate = isBengali ? 'অবসর গ্রহণের তারিখ আবশ্যক' : 'Retirement date is required';
      if (!formData.lastSalary || parseFloat(formData.lastSalary) <= 0) {
        newErrors.lastSalary = isBengali ? 'সঠিক সর্বশেষ মূল বেতন লিখুন' : 'Valid last basic salary is required';
      }

      if (formData.joiningDate && formData.dateOfBirth) {
        if (new Date(formData.joiningDate) <= new Date(formData.dateOfBirth)) {
          newErrors.joiningDate = isBengali ? 'যোগদানের তারিখ অবশ্যই জন্মতারিখের পরবর্তী হতে হবে' : 'Joining date must be after birth date';
        }
      }

      if (formData.joiningDate && formData.retirementDate) {
        if (new Date(formData.retirementDate) <= new Date(formData.joiningDate)) {
          newErrors.retirementDate = isBengali ? 'অবসরগ্রহণের তারিখ অবশ্যই যোগদানের পরবর্তী হতে হবে' : 'Retirement date must be after joining date';
        }

        const calculatedYears = calculateJobAge(formData.joiningDate, formData.retirementDate);
        if (calculatedYears < 19) {
          newErrors.jobAge = isBengali 
            ? 'সরকারি পেনশন বিধি অনুযায়ী ন্যূনতম ১৯ বছর সন্তোষজনক চাকরি আবশ্যক (আপনার চাকরি: ' + calculatedYears + ' বছর)'
            : 'Minimum qualifying service for pension is 19 years (Calculated: ' + calculatedYears + ' years)';
        }
      }
    }

    if (step === 3) {
      if (!editingApplication && !formData.nidFile) {
        newErrors.nidFile = isBengali ? 'জাতীয় পরিচয়পত্রের কপি আপলোড করুন' : 'NID copy attachment is required';
      }
      if (!editingApplication && !formData.jobDocuments) {
        newErrors.jobDocuments = isBengali ? 'সার্ভিস বুক বা চাকুরির প্রত্যায়নপত্র আপলোড করুন' : 'Service record document is required';
      }
    }

    if (step === 4) {
      if (!formData.bankName) newErrors.bankName = isBengali ? 'তফসিলি ব্যাংকের নাম নির্বাচন করুন' : 'Select scheduled bank';
      if (!formData.accountNumber.trim()) newErrors.accountNumber = isBengali ? 'ব্যাংক হিসাব নম্বর আবশ্যক' : 'Bank account number is required';
      if (!formData.branchName.trim()) newErrors.branchName = isBengali ? 'শাখার নাম আবশ্যক' : 'Branch name is required';
    }

    if (step === 5) {
      if (!formData.agreeDeclaration) {
        newErrors.agreeDeclaration = isBengali ? 'ঘোষণাপত্রে সম্মতি প্রদান করা আবশ্যক' : 'You must accept the official declaration';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(5)) return;

    try {
      const payload = {
        ...formData,
        jobAge: calculateJobAge(formData.joiningDate, formData.retirementDate),
        age: calculateAge(formData.dateOfBirth),
        pensionAmount: Math.floor(parseFloat(formData.lastSalary || 0) * 0.5)
      };

      if (editingApplication) {
        await updateApplication(editingApplication._id, payload);
      } else {
        await submitApplication(payload);
      }

      if (onComplete) onComplete();
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  const computedJobAge = calculateJobAge(formData.joiningDate, formData.retirementDate);
  const computedPension = Math.floor(parseFloat(formData.lastSalary || 0) * 0.5);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Official Form Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-bd-green-700 text-white font-bold text-xl flex items-center justify-center mx-auto mb-2">
          BD
        </div>
        <div className="text-xs font-bold uppercase tracking-wider text-bd-green-700 dark:text-bd-green-400">
          {isBengali ? 'বাংলাদেশ ফরম নং ২.১ (সংশোধিত)' : 'Bangladesh Form No. 2.1 (Revised)'}
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mt-1">
          {isBengali 
            ? 'বেসামরিক সরকারি কর্মচারীদের পেনশন ও আনুতোষিক প্রাপ্তির আবেদনপত্র' 
            : 'Application for Pension & Gratuity of Civilian Government Servants'}
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {isBengali ? 'হিসাব মহানিয়ন্ত্রকের কার্যালয়, অর্থ বিভাগ, অর্থ মন্ত্রণালয়' : 'Office of the Controller General of Accounts, Finance Division'}
        </p>
      </div>

      {/* Stepper Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between min-w-[550px]">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted 
                      ? 'bg-bd-green-700 text-white shadow-sm' 
                      : isCurrent 
                      ? 'bg-bd-green-100 text-bd-green-800 ring-2 ring-bd-green-600 dark:bg-bd-green-950 dark:text-bd-green-300' 
                      : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-[11px] font-semibold mt-1.5 whitespace-nowrap ${
                    isCurrent ? 'text-bd-green-700 dark:text-bd-green-400 font-bold' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {isBengali ? step.nameBn : step.nameEn}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    currentStep > idx + 1 ? 'bg-bd-green-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Form Content Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
        
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div className="border-b border-gray-100 dark:border-gray-700 pb-3">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <User className="w-4 h-4 text-bd-green-600" />
                <span>{isBengali ? 'অংশ ১: আবেদনকারীর ব্যক্তিগত ও পারিবারিক তথ্য' : 'Part 1: Personal & Family Information'}</span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isBengali ? 'জাতীয় পরিচয়পত্র ও সার্ভিস বুকের সাথে মিল রেখে তথ্য পূরণ করুন' : 'Enter personal details as per NID & Service Book records'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              
              <div className="sm:col-span-2">
                <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  {isBengali ? 'কর্মকর্তা/কর্মচারীর পূর্ণ নাম' : 'Full Name'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:ring-2 focus:ring-bd-green-500"
                />
                {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  {isBengali ? 'পিতার নাম' : "Father's Name"} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:ring-2 focus:ring-bd-green-500"
                />
                {errors.fatherName && <p className="text-xs text-red-600 mt-1">{errors.fatherName}</p>}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  {isBengali ? 'মাতার নাম' : "Mother's Name"} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:ring-2 focus:ring-bd-green-500"
                />
                {errors.motherName && <p className="text-xs text-red-600 mt-1">{errors.motherName}</p>}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  {isBengali ? 'জন্ম তারিখ (Date of Birth)' : 'Date of Birth'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:ring-2 focus:ring-bd-green-500"
                />
                {errors.dateOfBirth && <p className="text-xs text-red-600 mt-1">{errors.dateOfBirth}</p>}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  {isBengali ? 'জাতীয় পরিচয়পত্র নম্বর (NID Number)' : 'National ID (NID) Number'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nidNumber"
                  value={formData.nidNumber}
                  onChange={handleChange}
                  placeholder="10 or 17 digit NID"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm font-mono focus:ring-2 focus:ring-bd-green-500"
                />
                {errors.nidNumber && <p className="text-xs text-red-600 mt-1">{errors.nidNumber}</p>}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  {isBengali ? 'যোগাযোগের মোবাইল নম্বর' : 'Mobile Phone Number'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm font-mono focus:ring-2 focus:ring-bd-green-500"
                />
                {errors.phoneNumber && <p className="text-xs text-red-600 mt-1">{errors.phoneNumber}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  {isBengali ? 'বর্তমান ও স্থায়ী যোগাযোগের ঠিকানা' : 'Permanent & Present Address'} <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder={isBengali ? 'গ্রাম/বাড়ি, ডাকঘর, থানা/উপজেলা, জেলা' : 'House, Post Office, Police Station/Upazila, District'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:ring-2 focus:ring-bd-green-500"
                />
                {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
              </div>

            </div>
          </div>
        )}

        {/* Step 2: Job Information */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div className="border-b border-gray-100 dark:border-gray-700 pb-3">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-bd-green-600" />
                <span>{isBengali ? 'অংশ ২: চাকুরির বিবরণ ও সার্ভিস রেকর্ড' : 'Part 2: Employment & Service Record'}</span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isBengali ? 'অবসর গ্রহণের পূর্বের সর্বশেষ পদবি, দপ্তর ও বেতন বিবরণী' : 'Official service history prior to retirement'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  {isBengali ? 'সর্বশেষ পদবি (Last Designation)' : 'Last Designation'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastDesignation"
                  value={formData.lastDesignation}
                  onChange={handleChange}
                  placeholder={isBengali ? 'উদা: সহকারী সচিব / প্রধান শিক্ষক' : 'e.g. Assistant Secretary / Head Teacher'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:ring-2 focus:ring-bd-green-500"
                />
                {errors.lastDesignation && <p className="text-xs text-red-600 mt-1">{errors.lastDesignation}</p>}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  {isBengali ? 'মন্ত্রণালয় / দপ্তর / অধিদপ্তর' : 'Ministry / Department / Directorate'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder={isBengali ? 'উদা: জনপ্রশাসন মন্ত্রণালয়' : 'e.g. Ministry of Public Administration'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:ring-2 focus:ring-bd-green-500"
                />
                {errors.department && <p className="text-xs text-red-600 mt-1">{errors.department}</p>}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  {isBengali ? 'সরকারি চাকুরিতে প্রথম যোগদানের তারিখ' : 'Initial Government Joining Date'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:ring-2 focus:ring-bd-green-500"
                />
                {errors.joiningDate && <p className="text-xs text-red-600 mt-1">{errors.joiningDate}</p>}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  {isBengali ? 'অবসর গ্রহণের তারিখ (PRL / Retirement Date)' : 'Retirement / PRL Date'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="retirementDate"
                  value={formData.retirementDate}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:ring-2 focus:ring-bd-green-500"
                />
                {errors.retirementDate && <p className="text-xs text-red-600 mt-1">{errors.retirementDate}</p>}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  {isBengali ? 'সর্বশেষ মূল বেতন (Last Basic Salary in BDT)' : 'Last Basic Salary (BDT)'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  name="lastSalary"
                  value={formData.lastSalary}
                  onChange={handleChange}
                  placeholder="e.g. 52000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm font-mono focus:ring-2 focus:ring-bd-green-500"
                />
                {errors.lastSalary && <p className="text-xs text-red-600 mt-1">{errors.lastSalary}</p>}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  {isBengali ? 'স্বয়ংক্রিয় গণনা: চাকরির বয়স (Service Length)' : 'Calculated Service Length'}
                </label>
                <div className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-sm font-mono font-bold text-gray-800 dark:text-white">
                  {computedJobAge} {isBengali ? 'বছর' : 'Years'}
                </div>
                {errors.jobAge && <p className="text-xs text-red-600 mt-1 font-bold">{errors.jobAge}</p>}
              </div>

            </div>

            {/* Service Summary Highlight Box */}
            {formData.joiningDate && formData.retirementDate && (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-start space-x-3 text-xs">
                <ShieldCheck className="w-5 h-5 text-bd-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-bd-green-900 dark:text-emerald-300">
                    {isBengali ? 'পেনশন যোগ্যতা ও প্রাথমিক হিসাব' : 'Pension Eligibility Assessment'}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 mt-0.5">
                    {isBengali 
                      ? `আপনার মোট সন্তোষজনক চাকুরির বয়স: ${computedJobAge} বছর। ` +
                        (computedJobAge >= 19 ? '✅ আপনি সরকারি পূর্ণ পেনশন প্রাপ্তির যোগ্য।' : '⚠️ বিধি অনুযায়ী ন্যূনতম ১৯ বছর আবশ্যক।')
                      : `Total Qualifying Service: ${computedJobAge} years. ` +
                        (computedJobAge >= 19 ? 'Eligible for standard pension benefits.' : 'Minimum 19 years required.')}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Document Attachments */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div className="border-b border-gray-100 dark:border-gray-700 pb-3">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <Upload className="w-4 h-4 text-bd-green-600" />
                <span>{isBengali ? 'অংশ ৩: নথিপত্র ও প্রমাণক আপলোড' : 'Part 3: Required Document Attachments'}</span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isBengali ? 'পরিষ্কার স্ক্যান কপি আপলোড করুন (PDF, JPG, PNG - সর্বোচ্চ ১০ মেগাবাইট)' : 'Upload clear scanned copies (PDF, JPG, PNG - Max 10MB)'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* NID File Upload */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-6 text-center hover:border-bd-green-500 transition-colors">
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                  {isBengali ? 'জাতীয় পরিচয়পত্র (NID)' : 'National ID Document'} <span className="text-red-500">*</span>
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                  {isBengali ? 'NID এর উভয় পিঠের স্পষ্ট স্ক্যান কপি' : 'Front & Back Scanned Copy'}
                </p>

                <div className="mt-4">
                  <label className="px-4 py-2 rounded-xl bg-bd-green-50 text-bd-green-700 hover:bg-bd-green-100 font-bold text-xs cursor-pointer border border-bd-green-200 transition-colors inline-block">
                    <span>{formData.nidFile ? (isBengali ? 'ফাইল পরিবর্তন করুন' : 'Change File') : (isBengali ? 'ফাইল নির্বাচন করুন' : 'Choose File')}</span>
                    <input
                      type="file"
                      name="nidFile"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleChange}
                      className="sr-only"
                    />
                  </label>
                </div>

                {formData.nidFile && (
                  <div className="mt-3 text-xs text-bd-green-700 dark:text-bd-green-400 font-medium truncate">
                    ✓ {formData.nidFile.name}
                  </div>
                )}
                {errors.nidFile && <p className="text-xs text-red-600 mt-2">{errors.nidFile}</p>}
              </div>

              {/* Service Book Upload */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-6 text-center hover:border-bd-green-500 transition-colors">
                <FileText className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                  {isBengali ? 'সার্ভিস বুক / প্রত্যায়নপত্র' : 'Service Record Book / Certificate'} <span className="text-red-500">*</span>
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                  {isBengali ? 'প্রথম ও শেষ পাতার সত্যায়িত কপি' : 'Certified Service Record / LPC'}
                </p>

                <div className="mt-4">
                  <label className="px-4 py-2 rounded-xl bg-bd-green-50 text-bd-green-700 hover:bg-bd-green-100 font-bold text-xs cursor-pointer border border-bd-green-200 transition-colors inline-block">
                    <span>{formData.jobDocuments ? (isBengali ? 'ফাইল পরিবর্তন করুন' : 'Change File') : (isBengali ? 'ফাইল নির্বাচন করুন' : 'Choose File')}</span>
                    <input
                      type="file"
                      name="jobDocuments"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleChange}
                      className="sr-only"
                    />
                  </label>
                </div>

                {formData.jobDocuments && (
                  <div className="mt-3 text-xs text-bd-green-700 dark:text-bd-green-400 font-medium truncate">
                    ✓ {formData.jobDocuments.name}
                  </div>
                )}
                {errors.jobDocuments && <p className="text-xs text-red-600 mt-2">{errors.jobDocuments}</p>}
              </div>

            </div>
          </div>
        )}

        {/* Step 4: Bank Information & EFT */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <div className="border-b border-gray-100 dark:border-gray-700 pb-3">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-bd-green-600" />
                <span>{isBengali ? 'অংশ ৪: মাসিক পেনশন প্রাপ্তির ব্যাংক হিসাব ও EFT' : 'Part 4: EFT & Bank Account Details'}</span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isBengali ? 'অবসর ভাতা সরাসরি আপনার নির্ধারিত ব্যাংক হিসাবে পৌঁছানোর জন্য সঠিক তথ্য দিন' : 'Enter scheduled bank details for direct electronic fund transfer (EFT)'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  {isBengali ? 'তফসিলি ব্যাংকের নাম' : 'Scheduled Bank Name'} <span className="text-red-500">*</span>
                </label>
                <select
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:ring-2 focus:ring-bd-green-500"
                >
                  <option value="">{isBengali ? 'ব্যাংক নির্বাচন করুন' : 'Select Scheduled Bank'}</option>
                  <option value="sonali_bank">Sonali Bank PLC (সোনালী ব্যাংক)</option>
                  <option value="janata_bank">Janata Bank PLC (জনতা ব্যাংক)</option>
                  <option value="agrani_bank">Agrani Bank PLC (অগ্রণী ব্যাংক)</option>
                  <option value="rupali_bank">Rupali Bank PLC (রূপালী ব্যাংক)</option>
                  <option value="dutch_bangla_bank">Dutch-Bangla Bank (ডাচ্-বাংলা ব্যাংক)</option>
                  <option value="brac_bank">BRAC Bank PLC (ব্র্যাক ব্যাংক)</option>
                  <option value="city_bank">City Bank PLC (সিটি ব্যাংক)</option>
                  <option value="eastern_bank">Eastern Bank PLC (ইস্টার্ন ব্যাংক)</option>
                </select>
                {errors.bankName && <p className="text-xs text-red-600 mt-1">{errors.bankName}</p>}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  {isBengali ? 'হিসাব নম্বর (13-17 Digit Bank Account Number)' : 'Account Number (13-17 Digits)'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  placeholder="e.g. 1023456789012"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm font-mono focus:ring-2 focus:ring-bd-green-500"
                />
                {errors.accountNumber && <p className="text-xs text-red-600 mt-1">{errors.accountNumber}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  {isBengali ? 'শাখার নাম ও জেলা (Branch Name & District)' : 'Branch Name & Location'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="branchName"
                  value={formData.branchName}
                  onChange={handleChange}
                  placeholder={isBengali ? 'উদা: সেগুনবাগিচা কর্পোরেট শাখা, ঢাকা' : 'e.g. Segunbagicha Corporate Branch, Dhaka'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:ring-2 focus:ring-bd-green-500"
                />
                {errors.branchName && <p className="text-xs text-red-600 mt-1">{errors.branchName}</p>}
              </div>

            </div>

            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 text-xs text-blue-900 dark:text-blue-300 flex items-center space-x-2">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>
                {isBengali 
                  ? 'মাসিক পেনশনের অর্থ সরাসরি বাংলাদেশ ব্যাংকের BEFTN/NPSB নেটওয়ার্কের মাধ্যমে এই ব্যাংক হিসাবে জমা হবে।' 
                  : 'Monthly pension will be disbursed directly through Bangladesh Bank BEFTN/NPSB gateway.'}
              </span>
            </div>
          </div>
        )}

        {/* Step 5: Review & Declaration */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 dark:border-gray-700 pb-3">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <FileCheck2 className="w-4 h-4 text-bd-green-600" />
                <span>{isBengali ? 'অংশ ৫: চূড়ান্ত পর্যালোচনা, পেনশন হিসাব ও অঙ্গীকারনামা' : 'Part 5: Summary, Computation & Declaration'}</span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isBengali ? 'দাখিলের পূর্বে সকল তথ্য যত্নসহকারে মিলিয়ে নিন' : 'Carefully review all dossier information before final submission'}
              </p>
            </div>

            {/* Computation Highlight Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-bd-green-800 to-bd-green-700 text-white shadow-md space-y-3">
              <div className="text-xs text-bd-green-200 font-semibold uppercase tracking-wider">
                {isBengali ? 'স্বয়ংক্রিয় পেনশন ও আনুতোষিক হিসাব' : 'Official Benefit Computation Summary'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-bd-green-600/80 pt-3">
                <div>
                  <div className="text-[11px] text-bd-green-200">{isBengali ? 'যোগ্য চাকরিকাল:' : 'Qualifying Service:'}</div>
                  <div className="text-xl font-black font-mono">{computedJobAge} {isBengali ? 'বছর' : 'Years'}</div>
                </div>
                <div>
                  <div className="text-[11px] text-bd-green-200">{isBengali ? 'মাসিক পেনশন (৫০%):' : 'Monthly Pension (50%):'}</div>
                  <div className="text-xl font-black text-amber-300 font-mono">৳ {computedPension.toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <div className="text-[11px] text-bd-green-200">{isBengali ? 'সর্বশেষ মূল বেতন:' : 'Last Basic Salary:'}</div>
                  <div className="text-xl font-black font-mono">৳ {parseFloat(formData.lastSalary || 0).toLocaleString('en-IN')}</div>
                </div>
              </div>
            </div>

            {/* Dossier Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-gray-50 dark:bg-gray-700/40 p-5 rounded-2xl border border-gray-200 dark:border-gray-600">
              <div>
                <span className="text-gray-500 dark:text-gray-400 block">{isBengali ? 'কর্মকর্তার নাম:' : 'Applicant Name:'}</span>
                <span className="font-bold text-gray-900 dark:text-white">{formData.fullName}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block">{isBengali ? 'জাতীয় পরিচয়পত্র (NID):' : 'NID Number:'}</span>
                <span className="font-bold text-gray-900 dark:text-white font-mono">{formData.nidNumber}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block">{isBengali ? 'মন্ত্রণালয় / পদবি:' : 'Designation & Dept:'}</span>
                <span className="font-bold text-gray-900 dark:text-white">{formData.lastDesignation}, {formData.department}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block">{isBengali ? 'ব্যাংক ও হিসাব নম্বর:' : 'Bank & Account:'}</span>
                <span className="font-bold text-gray-900 dark:text-white font-mono">{formData.bankName} - {formData.accountNumber}</span>
              </div>
            </div>

            {/* Official Citizen Declaration */}
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-amber-50/50 dark:bg-amber-950/20 space-y-3">
              <label className="flex items-start space-x-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="agreeDeclaration"
                  checked={formData.agreeDeclaration}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 text-bd-green-600 focus:ring-bd-green-500 border-gray-300 rounded cursor-pointer"
                />
                <div className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                  <strong>{isBengali ? 'অঙ্গীকারনামা (Declaration):' : 'Official Declaration:'}</strong>{' '}
                  {isBengali 
                    ? 'আমি এই মর্মে অঙ্গীকার করিতেছি যে, উপরে বর্ণিত যাবতীয় তথ্য আমার জানামতে সম্পূর্ণ সত্য ও সঠিক। যদি পরবর্তীতে কোনো তথ্য অসত্য বা ভুল প্রমাণিত হয়, তবে সরকারি বিধি অনুযায়ী গৃহীত যেকোনো প্রশাসনিক বা আইনানুগ ব্যবস্থা আমি মানিয়া লইতে বাধ্য থাকিব।' 
                    : 'I solemnly declare that all information and documents submitted above are true and accurate to the best of my knowledge and official service records.'}
                </div>
              </label>
              {errors.agreeDeclaration && <p className="text-xs text-red-600 font-bold pl-7">{errors.agreeDeclaration}</p>}
            </div>

          </div>
        )}

        {/* Navigation & Submit Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-700 mt-6">
          
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 font-bold text-xs sm:text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isBengali ? 'পূর্ববর্তী ধাপ' : 'Previous'}</span>
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-bd-green-700 hover:bg-bd-green-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center space-x-1.5"
            >
              <span>{isBengali ? 'পরবর্তী ধাপ' : 'Next Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-7 py-3 rounded-xl bg-bd-green-700 hover:bg-bd-green-800 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-bd-green-700/20 transition-all flex items-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {editingApplication 
                  ? (isBengali ? 'সংশোধিত আবেদন পুনঃদাখিল করুন' : 'Resubmit Corrected Application') 
                  : (isBengali ? 'ফরম ২.১ চূড়ান্ত দাখিল করুন' : 'Submit Final Application (Form 2.1)')}
              </span>
            </button>
          )}

        </div>

      </div>

    </div>
  );
};

export default ApplicationForm;
