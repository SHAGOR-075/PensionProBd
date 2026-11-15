import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useData } from '../../contexts/DataContext';
import { 
  Sun, 
  Moon, 
  Globe, 
  LogOut,
  Bell,
  PhoneCall,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

const Header = ({ onMenuToggle, mobileMenuOpen }) => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, markNotificationAsRead } = useData();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  const isBengali = i18n.language === 'bn';

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      setCurrentTime(now.toLocaleDateString(isBengali ? 'bn-BD' : 'en-US', options));
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, [isBengali]);

  const toggleLanguage = () => {
    const newLang = isBengali ? 'en' : 'bn';
    i18n.changeLanguage(newLang);
  };

  const getRoleLabel = (userType) => {
    switch (userType) {
      case 'pension_holder':
        return isBengali ? 'পেনশনভোগী' : 'Pension Holder';
      case 'assistant_accountant':
        return isBengali ? 'সহকারী হিসাবরক্ষক' : 'Asst. Accountant';
      case 'head_office':
        return isBengali ? 'প্রধান কার্যালয়' : 'Head of Office';
      default:
        return isBengali ? 'ব্যবহারকারী' : 'Official';
    }
  };

  const unreadNotifications = (notifications || []).filter(n => !n.read);

  const handleNotificationClick = async (notification) => {
    if (!notification.read && markNotificationAsRead) {
      await markNotificationAsRead(notification._id);
    }
    setShowNotifications(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F3] dark:bg-stone-950 border-b border-stone-300 dark:border-stone-800 transition-colors">
      
      {/* 1. Top Government Strip (Government Name Left, Date/Time and Helpline Right) */}
      <div className="border-b border-stone-200 dark:border-stone-800 bg-[#FAF8F3] dark:bg-stone-950 py-1.5 px-4 sm:px-8 text-xs text-stone-700 dark:text-stone-300">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          
          {/* Government Name Left */}
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#0B5D3B]"></span>
            <span className="font-medium tracking-wide">
              {isBengali ? 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার | অর্থ বিভাগ' : "Government of the People's Republic of Bangladesh | Finance Division"}
            </span>
            <span className="hidden md:inline text-stone-400">|</span>
            <span className="hidden md:inline text-stone-500 font-serif italic">
              {isBengali ? 'হিসাব মহানিয়ন্ত্রকের কার্যালয় (CGA)' : 'Office of Controller General of Accounts'}
            </span>
          </div>

          {/* Date/Time and Helpline Right */}
          <div className="flex items-center space-x-4 font-mono text-[11px] text-stone-600 dark:text-stone-400">
            <span className="hidden sm:inline">{currentTime}</span>
            <span className="hidden sm:inline text-stone-300 dark:text-stone-700">•</span>
            <div className="flex items-center space-x-1 font-semibold text-stone-800 dark:text-stone-200">
              <PhoneCall className="w-3 h-3 text-[#0B5D3B] dark:text-emerald-400" />
              <span>{isBengali ? 'হেল্পলাইন: ১৬১২২ / ৩৩৩' : 'Helpline: 16122 / 333'}</span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Main Portal Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Mobile Toggle + Logo + Portal Name + Role Label */}
        <div className="flex items-center space-x-3.5">
          {/* Mobile Menu Toggle Button */}
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="p-1.5 rounded-[3px] border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 lg:hidden hover:bg-stone-200 dark:hover:bg-stone-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          )}

          {/* Bangladesh Official Seal Motif */}
          <div className="w-9 h-9 rounded-full border border-[#0B5D3B] bg-white dark:bg-stone-900 flex items-center justify-center shrink-0">
            <div className="w-5 h-5 rounded-full bg-[#C8102E] flex items-center justify-center text-[9px] text-white font-bold">
              BD
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-serif font-bold text-stone-900 dark:text-stone-100 leading-tight">
                PensionProBD
              </h1>
              {/* Role Label */}
              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider rounded-[2px] bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-[#0B5D3B] dark:text-emerald-400">
                {getRoleLabel(user?.userType)}
              </span>
            </div>
            <div className="text-[11px] text-stone-500 dark:text-stone-400 hidden sm:block">
              {isBengali ? 'জাতীয় পেনশন ও অবসর সুবিধা পোর্টাল' : 'National Pension & Retirement Portal'}
            </div>
          </div>
        </div>

        {/* Right: Controls (Language Toggle, Dark Mode, Notification Bell, User Menu) */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1 rounded-[3px] border border-stone-300 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors flex items-center space-x-1"
            title="Toggle Language"
            aria-label="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5 text-[#0B5D3B] dark:text-emerald-400" />
            <span>{isBengali ? 'English' : 'বাংলা'}</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-[3px] border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
            title="Toggle Dark Mode"
            aria-label="Toggle Dark Mode"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-stone-700" />}
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserDropdown(false);
              }}
              className="p-1.5 rounded-[3px] border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors relative"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C8102E] text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                  {unreadNotifications.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-stone-900 rounded-[4px] shadow-lg border border-stone-300 dark:border-stone-800 z-50 overflow-hidden">
                <div className="p-3 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-800/80">
                  <h3 className="text-xs font-serif font-bold text-stone-900 dark:text-stone-100">
                    {isBengali ? 'বিজ্ঞপ্তি ও বার্তা' : 'Official Notifications'}
                  </h3>
                  {unreadNotifications.length > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-[2px] bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 font-bold">
                      {unreadNotifications.length} {isBengali ? 'নতুন' : 'new'}
                    </span>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-stone-500 dark:text-stone-400">
                      {isBengali ? 'কোনো নতুন বিজ্ঞপ্তি নেই' : 'No notifications'}
                    </div>
                  ) : (
                    notifications.slice(0, 8).map((notification) => (
                      <div
                        key={notification._id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-3 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/60 transition-colors ${
                          !notification.read ? 'bg-emerald-50/50 dark:bg-emerald-950/20' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                            !notification.read ? 'bg-[#0B5D3B]' : 'bg-stone-300'
                          }`} />
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                              {notification.title || notification.message}
                            </p>
                            {notification.message && notification.title && (
                              <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5">
                                {notification.message}
                              </p>
                            )}
                            <p className="text-[10px] font-mono text-stone-400 mt-1">
                              {new Date(notification.timestamp || notification.createdAt).toLocaleDateString(isBengali ? 'bn-BD' : 'en-US')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          {user && (
            <div className="relative pl-1">
              <button
                onClick={() => {
                  setShowUserDropdown(!showUserDropdown);
                  setShowNotifications(false);
                }}
                className="flex items-center space-x-2 p-1 rounded-[3px] border border-stone-300 dark:border-stone-700 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
                aria-label="User Profile"
              >
                <div className="w-7 h-7 rounded-[2px] bg-[#0B5D3B] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="hidden sm:block text-left pr-1">
                  <div className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate max-w-[110px]">
                    {user.name}
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-stone-400 hidden sm:block" />
              </button>

              {/* User Dropdown */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-stone-900 rounded-[4px] shadow-lg border border-stone-300 dark:border-stone-800 z-50 p-4 space-y-3">
                  <div className="border-b border-stone-200 dark:border-stone-800 pb-3">
                    <p className="text-xs font-bold text-stone-900 dark:text-stone-100">{user.name}</p>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 font-mono truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-[2px] bg-stone-100 dark:bg-stone-800 text-[#0B5D3B] dark:text-emerald-400 border border-stone-300 dark:border-stone-700">
                      {getRoleLabel(user.userType)}
                    </span>
                  </div>

                  <div>
                    <button
                      onClick={logout}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-[3px] text-xs font-semibold text-[#C8102E] hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{isBengali ? 'লগআউট / প্রস্থান' : 'Sign Out'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </header>
  );
};

export default Header;
