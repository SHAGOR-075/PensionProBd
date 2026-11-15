import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home,
  FileText,
  Users,
  MessageSquare,
  BarChart3,
  ShieldCheck,
  AlertTriangle,
  ClipboardCheck,
  FileCheck2,
  Clock,
  Award,
  FolderOpen,
  PhoneCall
} from 'lucide-react';

const Sidebar = ({ activeTab, onTabChange, mobileOpen, onCloseMobile }) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isBengali = i18n.language === 'bn';

  const getMenuItems = () => {
    if (user?.userType === 'pension_holder') {
      return [
        { 
          id: 'dashboard', 
          labelBn: 'ড্যাশবোর্ড সারসংক্ষেপ', 
          labelEn: 'Dashboard Overview', 
          icon: Home,
          badge: null
        },
        { 
          id: 'application', 
          labelBn: 'পেনশন আবেদন (ফরম ২.১)', 
          labelEn: 'Pension Application (Form 2.1)', 
          icon: FileText,
          badge: isBengali ? 'আবেদন' : 'Apply'
        },
        { 
          id: 'status', 
          labelBn: 'আবেদনের স্থিতি ও ট্র্যাকিং', 
          labelEn: 'Live Status & Tracking', 
          icon: Clock,
          badge: null
        },
        { 
          id: 'complaints', 
          labelBn: 'অভিযোগ ও প্রতিকার সেল (GRS)', 
          labelEn: 'Grievance Redress (GRS)', 
          icon: MessageSquare,
          badge: null
        },
        { 
          id: 'documents', 
          labelBn: 'ডিজিটাল নথিপত্র ও PPO', 
          labelEn: 'My Documents & PPO', 
          icon: FolderOpen,
          badge: null
        },
      ];
    } else if (user?.userType === 'assistant_accountant') {
      return [
        { 
          id: 'dashboard', 
          labelBn: 'হিসাব নিরীক্ষা ডেস্ক', 
          labelEn: 'Audit Desk Overview', 
          icon: Home 
        },
        { 
          id: 'applications', 
          labelBn: 'পেন্ডিং আবেদনসমূহ', 
          labelEn: 'Pending Audits', 
          icon: FileCheck2 
        },
        { 
          id: 'reviews', 
          labelBn: 'নিরীক্ষিত আবেদন ইতিহাস', 
          labelEn: 'Audit History', 
          icon: ClipboardCheck 
        },
        { 
          id: 'reports', 
          labelBn: 'হিসাবরক্ষণ রিপোর্ট', 
          labelEn: 'Statistical Reports', 
          icon: BarChart3 
        },
      ];
    } else if (user?.userType === 'head_office') {
      return [
        { 
          id: 'dashboard', 
          labelBn: 'প্রশাসনিক ড্যাশবোর্ড', 
          labelEn: 'Executive Dashboard', 
          icon: Home 
        },
        { 
          id: 'applications', 
          labelBn: 'পেনশন চূড়ান্ত অনুমোদন (PPO)', 
          labelEn: 'Sanction & PPO Desk', 
          icon: Award 
        },
        { 
          id: 'complaints', 
          labelBn: 'অভিযোগ ব্যবস্থাপনা ও তদন্ত', 
          labelEn: 'Grievance Resolution', 
          icon: MessageSquare 
        },
        { 
          id: 'officers', 
          labelBn: 'কর্মকর্তা ব্যবস্থাপনা', 
          labelEn: 'Officer Management', 
          icon: Users 
        },
        { 
          id: 'red-flags', 
          labelBn: 'শৃঙ্খলা ও লাল পতাকা মনিটরিং', 
          labelEn: 'Red Flag Monitoring', 
          icon: AlertTriangle 
        },
        { 
          id: 'reports', 
          labelBn: 'সমন্বিত কেন্দ্রীয় প্রতিবেদন', 
          labelEn: 'Central Reports', 
          icon: BarChart3 
        },
      ];
    }
    return [];
  };

  const menuItems = getMenuItems();

  const handleItemClick = (id) => {
    onTabChange(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Main Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 lg:top-24 z-50 lg:z-10
        w-72 shrink-0 h-screen lg:h-[calc(100vh-6rem)]
        bg-[#FAF8F3] dark:bg-stone-950 border-r border-stone-300 dark:border-stone-800
        flex flex-col justify-between select-none transition-transform duration-200
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Top User Block & Menu */}
        <div className="p-4 sm:p-5 space-y-5 overflow-y-auto">
          
          {/* User Block (Name + Pension Holder) */}
          <div className="pb-4 border-b border-stone-300 dark:border-stone-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-[3px] border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-[#0B5D3B] dark:text-emerald-400 font-serif font-bold text-sm flex items-center justify-center shrink-0">
                {user?.name?.charAt(0)?.toUpperCase() || 'P'}
              </div>
              <div className="overflow-hidden">
                <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm truncate">
                  {user?.name || 'Pension Holder'}
                </h3>
                <div className="text-[11px] font-mono text-stone-500 dark:text-stone-400 uppercase tracking-wider mt-0.5">
                  {user?.userType === 'pension_holder' ? (isBengali ? 'পেনশনভোগী নাগরিক' : 'Pension Holder') : (user?.designation || user?.userType?.replace('_', ' '))}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Section */}
          <nav className="space-y-1">
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 px-3 py-1">
              {isBengali ? 'প্রধান মেন্যু' : 'Navigation Menu'}
            </div>

            <ul className="space-y-1 pt-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[2px] text-xs transition-colors text-left ${
                        isActive
                          ? 'border-l-[3px] border-[#0B5D3B] bg-white dark:bg-stone-900 text-[#0B5D3B] dark:text-emerald-400 font-bold shadow-xs'
                          : 'border-l-[3px] border-transparent text-stone-700 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-900/60 font-medium'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#0B5D3B] dark:text-emerald-400' : 'text-stone-500 dark:text-stone-400'}`} />
                        <span className="leading-snug break-words">
                          {isBengali ? item.labelBn : item.labelEn}
                        </span>
                      </div>

                      {/* Badge (Properly visible, no cutoff) */}
                      {item.badge && (
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-[2px] shrink-0 border ${
                          isActive 
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#0B5D3B] dark:text-emerald-300 border-[#0B5D3B]/40' 
                            : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-300 dark:border-stone-700'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

        </div>

        {/* Bottom CGA Helpdesk Box (Simple Bordered Block with Hotline 16122 / 333) */}
        <div className="p-4 border-t border-stone-300 dark:border-stone-800 bg-[#FAF8F3] dark:bg-stone-950">
          <div className="border border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-900 p-3 rounded-[3px] text-xs">
            <div className="font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-1.5 mb-1">
              <PhoneCall className="w-3.5 h-3.5 text-[#0B5D3B] dark:text-emerald-400" />
              <span>{isBengali ? 'সিজিএ হেল্পডেস্ক' : 'CGA Helpdesk'}</span>
            </div>
            <div className="text-[11px] font-mono font-semibold text-[#0B5D3B] dark:text-emerald-400">
              {isBengali ? 'টোল-ফ্রি: ১৬১২২ / ৩৩৩' : 'Hotline: 16122 / 333'}
            </div>
            <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">
              {isBengali ? 'রবি – বৃহস্পতি: ৯টা – ৫টা' : 'Sun – Thu: 9 AM – 5 PM'}
            </div>
          </div>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;
