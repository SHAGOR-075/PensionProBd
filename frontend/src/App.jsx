// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';
// import { AuthProvider } from './contexts/AuthContext';
// import { ThemeProvider } from './contexts/ThemeContext';
// import { DataProvider } from './contexts/DataContext';
// import { useAuth } from './contexts/AuthContext';
// import Layout from './components/Layout/Layout';
// import ProtectedRoute from './components/Common/ProtectedRoute';
// import Homepage from './components/Home/Homepage';
// import LoginForm from './components/Auth/LoginForm';
// import RegisterForm from './components/Auth/RegisterForm';
// import PensionHolderDashboard from './components/PensionHolder/Dashboard';
// import ApplicationForm from './components/PensionHolder/ApplicationForm';
// import AssistantAccountantDashboard from './components/AssistantAccountant/Dashboard';
// import HeadOfficeDashboard from './components/HeadOffice/Dashboard';
// import './i18n';

// // Main App Component
// function AppContent() {
//   const { user } = useAuth();
//   const [activeTab, setActiveTab] = useState('dashboard');

//   if (!user) {
//     return (
//       <Routes>
//         <Route path="/" element={<Homepage />} />
//         <Route path="/pension/login" element={<LoginForm userType="pension_holder" />} />
//         <Route path="/pension/register" element={<RegisterForm />} />
//         <Route path="/admin/login" element={<LoginForm userType="admin" />} />
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     );
//   }

//   const renderContent = () => {
//     if (user.userType === 'assistant_accountant') {
//       return <AssistantAccountantDashboard activeTab={activeTab} />;
//     } else if (user.userType === 'head_office') {
//       return <HeadOfficeDashboard activeTab={activeTab} />;
//     } else {
//       // Pension holder content
//       switch (activeTab) {
//         case 'dashboard':
//           return <PensionHolderDashboard />;
//         case 'application':
//           return <ApplicationForm />;
//         case 'status':
//           return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Application Status - Coming Soon</div>;
//         case 'complaints':
//           return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Complaints - Coming Soon</div>;
//         case 'documents':
//           return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Documents - Coming Soon</div>;
//         default:
//           return <PensionHolderDashboard />;
//       }
//     }
//   };

//   return (
//     <Layout activeTab={activeTab} onTabChange={setActiveTab}>
//       {renderContent()}
//     </Layout>
//   );
// }

// function App() {
//   return (
//     <ThemeProvider>
//       <AuthProvider>
//         <DataProvider>
//           <Router>
//             <div className="App">
//               <AppContent />
//               <Toaster
//                 position="top-right"
//                 toastOptions={{
//                   duration: 4000,
//                   style: {
//                     background: 'var(--toast-bg)',
//                     color: 'var(--toast-color)',
//                   },
//                   success: {
//                     duration: 3000,
//                     theme: {
//                       primary: '#4aed88',
//                     },
//                   },
//                 }}
//               />
//             </div>
//           </Router>
//         </DataProvider>
//       </AuthProvider>
//     </ThemeProvider>
//   );
// }

// export default App;

// Second Update Version
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Homepage from './components/Home/Homepage';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import PensionHolderDashboard from './components/PensionHolder/Dashboard';
import ApplicationForm from './components/PensionHolder/ApplicationForm';
import ApplicationStatus from './components/PensionHolder/ApplicationStatus';
import SubmitComplaint from './components/PensionHolder/SubmitComplaint';
import MyDocuments from './components/PensionHolder/MyDocuments';
import AssistantAccountantDashboard from './components/AssistantAccountant/Dashboard';
import HeadOfficeDashboard from './components/HeadOffice/Dashboard';
import './i18n';

// Main App Component
function AppContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/pension/login" element={<LoginForm userType="pension_holder" />} />
        <Route path="/pension/register" element={<RegisterForm />} />
        <Route path="/admin/login" element={<LoginForm userType="admin" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  const renderContent = () => {
    if (user.userType === 'assistant_accountant') {
      return <AssistantAccountantDashboard activeTab={activeTab} />;
    } else if (user.userType === 'head_office') {
      return <HeadOfficeDashboard activeTab={activeTab} />;
    } else {
      // Pension holder content
      switch (activeTab) {
        case 'dashboard':
          return <PensionHolderDashboard />;
        case 'application':
          return <ApplicationForm />;
        case 'status':
          return <ApplicationStatus />;
        case 'complaints':
          return <SubmitComplaint />;
        case 'documents':
          return <MyDocuments />;
        default:
          return <PensionHolderDashboard />;
      }
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <Router>
            <div className="App">
              <AppContent />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'var(--toast-bg)',
                    color: 'var(--toast-color)',
                  },
                  success: {
                    duration: 3000,
                    theme: {
                      primary: '#4aed88',
                    },
                  },
                }}
              />
            </div>
          </Router>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;