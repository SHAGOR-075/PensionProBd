import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Common
      'welcome': 'Welcome',
      'login': 'Login',
      'register': 'Register',
      'logout': 'Logout',
      'dashboard': 'Dashboard',
      'profile': 'Profile',
      'settings': 'Settings',
      'submit': 'Submit',
      'cancel': 'Cancel',
      'save': 'Save',
      'edit': 'Edit',
      'delete': 'Delete',
      'search': 'Search',
      'filter': 'Filter',
      'status': 'Status',
      'actions': 'Actions',
      'loading': 'Loading...',
      'error': 'Error',
      'success': 'Success',
      'pending': 'Pending',
      'approved': 'Approved',
      'rejected': 'Rejected',
      'name': 'Name',
      'email': 'Email',
      'phone': 'Phone',
      'address': 'Address',
      'date': 'Date',
      'download': 'Download',
      'upload': 'Upload',
      'view': 'View',
      'back': 'Back',
      'next': 'Next',
      'previous': 'Previous',
      'confirm': 'Confirm',
      'language': 'Language',
      'theme': 'Theme',
      'light': 'Light',
      'dark': 'Dark',
      'home': 'Home',
      'features': 'Features',
      'about': 'About',
      'contact': 'Contact',
      'services': 'Services',
      
      // App specific
      'app_title': 'PensionProBD',
      'app_subtitle': 'Digital Bangladesh Pension Management System',
      'govt_title': 'Government of Bangladesh',
      'dept_title': 'Department of Pension Management',
      'digital_bangladesh': 'Digital Bangladesh',
      'change_language': 'Change Language',
      'toggle_theme': 'Toggle Theme',
      
      // Homepage
      'hero_title_1': 'Digital',
      'hero_title_2': 'Pension',
      'hero_title_3': 'Management',
      'hero_description': 'Streamlined, secure, and transparent pension management system for the people of Bangladesh. Apply, track, and manage your pension benefits digitally.',
      'start_application': 'Start Your Application',
      'login_dashboard': 'Login to Dashboard',
      'quick_application': 'Quick Application',
      'submit_minutes': 'Submit in minutes',
      'realtime_tracking': 'Real-time Tracking',
      'monitor_progress': 'Monitor progress live',
      'secure_process': 'Secure Process',
      'bank_level_security': 'Bank-level security',
      
      // Features
      'why_choose_title': 'Why Choose PensionProBD?',
      'why_choose_desc': 'Experience the future of pension management with our comprehensive digital platform',
      'secure_reliable': 'Secure & Reliable',
      'secure_reliable_desc': 'Bank-level security with encrypted data protection',
      'fast_processing': 'Fast Processing',
      'fast_processing_desc': 'Quick application processing with real-time updates',
      'expert_support': 'Expert Support',
      'expert_support_desc': '24/7 customer support from pension experts',
      'digital_documents': 'Digital Documents',
      'digital_documents_desc': 'Paperless application with digital document management',
      
      // Stats
      'pension_holders': 'Pension Holders',
      'success_rate': 'Success Rate',
      'support_available': 'Support Available',
      'secure_platform': 'Secure Platform',
      'support': 'Support',
      
      // Testimonials
      'testimonials_title': 'What Our Users Say',
      'testimonials_desc': 'Trusted by thousands of pension holders across Bangladesh',
      'retired_officer': 'Retired Government Officer',
      'former_teacher': 'Former Teacher',
      'ex_bank_employee': 'Ex-Bank Employee',
      'testimonial_1': 'PensionProBD made my pension application process incredibly smooth and transparent.',
      'testimonial_2': 'The digital platform saved me countless trips to government offices.',
      'testimonial_3': 'Real-time tracking and updates kept me informed throughout the process.',
      
      // Contact
      'contact_title': 'Get in Touch',
      'contact_desc': 'Need help with your pension application? Our support team is here to assist you.',
      'phone_support': 'Phone Support',
      'email_support': 'Email Support',
      'office_address': 'Office Address',
      'office_location': 'Bangladesh Secretariat, Dhaka-1000',
      'send_message': 'Send us a Message',
      'full_name': 'Full Name',
      'enter_full_name': 'Enter your full name',
      'email_address': 'Email Address',
      'enter_email': 'Enter your email',
      'message': 'Message',
      'enter_message': 'Enter your message',
      
      // Footer
      'footer_desc': 'Empowering Bangladesh with digital pension management solutions.',
      'quick_links': 'Quick Links',
      'pension_application': 'Pension Application',
      'status_tracking': 'Status Tracking',
      'document_management': 'Document Management',
      'contact_info': 'Contact Info',
      'bangladesh_secretariat': 'Bangladesh Secretariat',
      'dhaka_bangladesh': 'Dhaka-1000, Bangladesh',
      'all_rights_reserved': 'All rights reserved.',
      
      // Authentication
      'login_title': 'Login to Your Account',
      'register_title': 'Create New Account',
      'pension_holder_login': 'Pension Holder Login',
      'admin_login': 'Admin Login',
      'email_placeholder': 'Enter your email',
      'password_placeholder': 'Enter your password',
      'confirm_password': 'Confirm Password',
      'remember_me': 'Remember me',
      'forgot_password': 'Forgot Password?',
      'no_account': "Don't have an account?",
      'have_account': 'Already have an account?',
      'register_here': 'Register here',
      'login_here': 'Login here',
      'invalid_email': 'Invalid email format',
      'email_required': 'Email is required',
      'password_required': 'Password is required',
      'passwords_not_match': 'Passwords do not match',
      'invalid_email_domain': 'Only @gmail.com, @yahoo.com, @bing.com, and .bd emails are allowed',
      
      // Dashboard
      'my_documents': 'My Documents',
      'pension_form': 'Pension Form',
      'nid_upload': 'NID Upload',
      'job_documents': 'Job Documents',
      'age_requirement': 'Minimum age requirement is 19 years',
      'job_age': 'Job Age',
      'service_length': 'Service Length',
      'last_salary': 'Last Salary',
      'pension_amount': 'Pension Amount',
      'application_submitted': 'Application Submitted Successfully',
      'complaint_submitted': 'Complaint Submitted Successfully',
      'download_certificate': 'Download Pension Certificate',
      'application_status': 'Application Status',
      'submit_complaint': 'Submit Complaint',
      
      // Admin
      'pending_applications': 'Pending Applications',
      'review_application': 'Review Application',
      'manage_complaints': 'Manage Complaints',
      'manage_officers': 'Manage Officers',
      'red_flag_system': 'Red Flag System',
    }
  },
  bn: {
    translation: {
      // Common
      'welcome': 'স্বাগতম',
      'login': 'লগইন',
      'register': 'নিবন্ধন',
      'logout': 'লগআউট',
      'dashboard': 'ড্যাশবোর্ড',
      'profile': 'প্রোফাইল',
      'settings': 'সেটিংস',
      'submit': 'জমা দিন',
      'cancel': 'বাতিল',
      'save': 'সংরক্ষণ',
      'edit': 'সম্পাদনা',
      'delete': 'মুছুন',
      'search': 'অনুসন্ধান',
      'filter': 'ফিল্টার',
      'status': 'অবস্থা',
      'actions': 'কার্যাবলী',
      'loading': 'লোড হচ্ছে...',
      'error': 'ত্রুটি',
      'success': 'সফল',
      'pending': 'অপেক্ষমান',
      'approved': 'অনুমোদিত',
      'rejected': 'প্রত্যাখ্যাত',
      'name': 'নাম',
      'email': 'ইমেইল',
      'phone': 'ফোন',
      'address': 'ঠিকানা',
      'date': 'তারিখ',
      'download': 'ডাউনলোড',
      'upload': 'আপলোড',
      'view': 'দেখুন',
      'back': 'পেছনে',
      'next': 'পরবর্তী',
      'previous': 'পূর্ববর্তী',
      'confirm': 'নিশ্চিত করুন',
      'language': 'ভাষা',
      'theme': 'থিম',
      'light': 'আলো',
      'dark': 'অন্ধকার',
      'home': 'হোম',
      'features': 'বৈশিষ্ট্য',
      'about': 'সম্পর্কে',
      'contact': 'যোগাযোগ',
      'services': 'সেবা',
      
      // App specific
      'app_title': 'পেনশনপ্রোবিডি',
      'app_subtitle': 'ডিজিটাল বাংলাদেশ পেনশন ব্যবস্থাপনা সিস্টেম',
      'govt_title': 'বাংলাদেশ সরকার',
      'dept_title': 'পেনশন ব্যবস্থাপনা বিভাগ',
      'digital_bangladesh': 'ডিজিটাল বাংলাদেশ',
      'change_language': 'ভাষা পরিবর্তন',
      'toggle_theme': 'থিম পরিবর্তন',
      
      // Homepage
      'hero_title_1': 'ডিজিটাল',
      'hero_title_2': 'পেনশন',
      'hero_title_3': 'ব্যবস্থাপনা',
      'hero_description': 'বাংলাদেশের জনগণের জন্য সুশৃঙ্খল, নিরাপদ এবং স্বচ্ছ পেনশন ব্যবস্থাপনা সিস্টেম। ডিজিটালভাবে আবেদন করুন, ট্র্যাক করুন এবং আপনার পেনশন সুবিধা পরিচালনা করুন।',
      'start_application': 'আপনার আবেদন শুরু করুন',
      'login_dashboard': 'ড্যাশবোর্ডে লগইন',
      'quick_application': 'দ্রুত আবেদন',
      'submit_minutes': 'মিনিটেই জমা দিন',
      'realtime_tracking': 'রিয়েল-টাইম ট্র্যাকিং',
      'monitor_progress': 'লাইভ অগ্রগতি পর্যবেক্ষণ',
      'secure_process': 'নিরাপদ প্রক্রিয়া',
      'bank_level_security': 'ব্যাংক-স্তরের নিরাপত্তা',
      
      // Features
      'why_choose_title': 'কেন পেনশনপ্রোবিডি বেছে নেবেন?',
      'why_choose_desc': 'আমাদের ব্যাপক ডিজিটাল প্ল্যাটফর্মের সাথে পেনশন ব্যবস্থাপনার ভবিষ্যত অনুভব করুন',
      'secure_reliable': 'নিরাপদ ও নির্ভরযোগ্য',
      'secure_reliable_desc': 'এনক্রিপ্টেড ডেটা সুরক্ষা সহ ব্যাংক-স্তরের নিরাপত্তা',
      'fast_processing': 'দ্রুত প্রক্রিয়াকরণ',
      'fast_processing_desc': 'রিয়েল-টাইম আপডেট সহ দ্রুত আবেদন প্রক্রিয়াকরণ',
      'expert_support': 'বিশেষজ্ঞ সহায়তা',
      'expert_support_desc': 'পেনশন বিশেষজ্ঞদের কাছ থেকে ২৪/৭ গ্রাহক সহায়তা',
      'digital_documents': 'ডিজিটাল নথিপত্র',
      'digital_documents_desc': 'ডিজিটাল নথি ব্যবস্থাপনা সহ কাগজবিহীন আবেদন',
      
      // Stats
      'pension_holders': 'পেনশনধারী',
      'success_rate': 'সফলতার হার',
      'support_available': 'সহায়তা উপলব্ধ',
      'secure_platform': 'নিরাপদ প্ল্যাটফর্ম',
      'support': 'সহায়তা',
      
      // Testimonials
      'testimonials_title': 'আমাদের ব্যবহারকারীরা কী বলেন',
      'testimonials_desc': 'সারা বাংলাদেশের হাজার হাজার পেনশনধারীর বিশ্বস্ত',
      'retired_officer': 'অবসরপ্রাপ্ত সরকারি কর্মকর্তা',
      'former_teacher': 'প্রাক্তন শিক্ষক',
      'ex_bank_employee': 'প্রাক্তন ব্যাংক কর্মচারী',
      'testimonial_1': 'পেনশনপ্রোবিডি আমার পেনশন আবেদন প্রক্রিয়াকে অবিশ্বাস্যভাবে মসৃণ এবং স্বচ্ছ করেছে।',
      'testimonial_2': 'ডিজিটাল প্ল্যাটফর্ম আমাকে সরকারি অফিসে অগণিত ভ্রমণ থেকে বাঁচিয়েছে।',
      'testimonial_3': 'রিয়েল-টাইম ট্র্যাকিং এবং আপডেট পুরো প্রক্রিয়া জুড়ে আমাকে অবহিত রেখেছে।',
      
      // Contact
      'contact_title': 'যোগাযোগ করুন',
      'contact_desc': 'আপনার পেনশন আবেদনে সাহায্য প্রয়োজন? আমাদের সহায়তা দল আপনাকে সহায়তা করতে এখানে আছে।',
      'phone_support': 'ফোন সহায়তা',
      'email_support': 'ইমেইল সহায়তা',
      'office_address': 'অফিসের ঠিকানা',
      'office_location': 'বাংলাদেশ সচিবালয়, ঢাকা-১০০০',
      'send_message': 'আমাদের একটি বার্তা পাঠান',
      'full_name': 'পূর্ণ নাম',
      'enter_full_name': 'আপনার পূর্ণ নাম লিখুন',
      'email_address': 'ইমেইল ঠিকানা',
      'enter_email': 'আপনার ইমেইল লিখুন',
      'message': 'বার্তা',
      'enter_message': 'আপনার বার্তা লিখুন',
      
      // Footer
      'footer_desc': 'ডিজিটাল পেনশন ব্যবস্থাপনা সমাধান দিয়ে বাংলাদেশকে ক্ষমতায়ন।',
      'quick_links': 'দ্রুত লিংক',
      'pension_application': 'পেনশন আবেদন',
      'status_tracking': 'স্ট্যাটাস ট্র্যাকিং',
      'document_management': 'নথি ব্যবস্থাপনা',
      'contact_info': 'যোগাযোগের তথ্য',
      'bangladesh_secretariat': 'বাংলাদেশ সচিবালয়',
      'dhaka_bangladesh': 'ঢাকা-১০০০, বাংলাদেশ',
      'all_rights_reserved': 'সকল অধিকার সংরক্ষিত।',
      
      // Authentication
      'login_title': 'আপনার অ্যাকাউন্টে লগইন করুন',
      'register_title': 'নতুন অ্যাকাউন্ট তৈরি করুন',
      'pension_holder_login': 'পেনশনধারী লগইন',
      'admin_login': 'অ্যাডমিন লগইন',
      'email_placeholder': 'আপনার ইমেইল লিখুন',
      'password_placeholder': 'আপনার পাসওয়ার্ড লিখুন',
      'confirm_password': 'পাসওয়ার্ড নিশ্চিত করুন',
      'remember_me': 'আমাকে মনে রাখুন',
      'forgot_password': 'পাসওয়ার্ড ভুলে গেছেন?',
      'no_account': 'অ্যাকাউন্ট নেই?',
      'have_account': 'ইতিমধ্যে অ্যাকাউন্ট আছে?',
      'register_here': 'এখানে নিবন্ধন করুন',
      'login_here': 'এখানে লগইন করুন',
      'invalid_email': 'অবৈধ ইমেইল ফরম্যাট',
      'email_required': 'ইমেইল প্রয়োজন',
      'password_required': 'পাসওয়ার্ড প্রয়োজন',
      'passwords_not_match': 'পাসওয়ার্ড মিলছে না',
      'invalid_email_domain': 'শুধুমাত্র @gmail.com, @yahoo.com, @bing.com, এবং .bd ইমেইল অনুমোদিত',
      
      // Dashboard
      'my_documents': 'আমার নথিপত্র',
      'pension_form': 'পেনশন ফরম',
      'nid_upload': 'জাতীয় পরিচয়পত্র আপলোড',
      'job_documents': 'চাকরির নথিপত্র',
      'age_requirement': 'সর্বনিম্ন বয়সের প্রয়োজন ১৯ বছর',
      'job_age': 'চাকরির বয়স',
      'service_length': 'চাকরির দৈর্ঘ্য',
      'last_salary': 'শেষ বেতন',
      'pension_amount': 'পেনশনের পরিমাণ',
      'application_submitted': 'আবেদন সফলভাবে জমা দেওয়া হয়েছে',
      'complaint_submitted': 'অভিযোগ সফলভাবে জমা দেওয়া হয়েছে',
      'download_certificate': 'পেনশন সার্টিফিকেট ডাউনলোড করুন',
      'application_status': 'আবেদনের অবস্থা',
      'submit_complaint': 'অভিযোগ জমা দিন',
      
      // Admin
      'pending_applications': 'অপেক্ষমান আবেদন',
      'review_application': 'আবেদন পর্যালোচনা',
      'manage_complaints': 'অভিযোগ ব্যবস্থাপনা',
      'manage_officers': 'কর্মকর্তা ব্যবস্থাপনা',
      'red_flag_system': 'লাল পতাকা সিস্টেম',
    }
  }
};

// Get saved language preference from localStorage, default to English
const getSavedLanguage = () => {
  try {
    const savedLang = localStorage.getItem('pensionProBD_language');
    return savedLang || 'en'; // Default to English
  } catch (error) {
    return 'en'; // Default to English if localStorage is not available
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getSavedLanguage(), // Default language (English)
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

// Save language preference to localStorage when it changes
i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem('pensionProBD_language', lng);
  } catch (error) {
    console.error('Failed to save language preference:', error);
  }
});

export default i18n;