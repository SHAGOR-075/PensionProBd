import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home,
  FileText,
  Users,
  MessageSquare,
  Settings,
  BarChart3,
  Shield,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const Sidebar = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const getMenuItems = () => {
    if (user?.userType === 'pension_holder') {
      return [
        { id: 'dashboard', label: t('dashboard'), icon: Home },
        { id: 'application', label: t('pension_application'), icon: FileText },
        { id: 'status', label: t('application_status'), icon: BarChart3 },
        { id: 'complaints', label: t('submit_complaint'), icon: MessageSquare },
        { id: 'documents', label: t('my_documents'), icon: Shield },
      ];
    } else if (user?.userType === 'assistant_accountant') {
      return [
        { id: 'dashboard', label: t('dashboard'), icon: Home },
        { id: 'applications', label: t('pending_applications'), icon: FileText },
        { id: 'reviews', label: t('review_application'), icon: CheckCircle },
        { id: 'reports', label: 'Reports', icon: BarChart3 },
      ];
    } else if (user?.userType === 'head_office') {
      return [
        { id: 'dashboard', label: t('dashboard'), icon: Home },
        { id: 'complaints', label: t('manage_complaints'), icon: MessageSquare },
        { id: 'officers', label: t('manage_officers'), icon: Users },
        { id: 'red-flags', label: t('red_flag_system'), icon: AlertTriangle },
        { id: 'reports', label: 'Reports', icon: BarChart3 },
      ];
    }
    return [];
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-64 bg-white dark:bg-gray-900 shadow-lg h-full border-r border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-bd-green-700 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {user?.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user?.userType?.replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>

      <nav className="mt-6">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-bd-green-700 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

    </div>
  );
};

export default Sidebar;