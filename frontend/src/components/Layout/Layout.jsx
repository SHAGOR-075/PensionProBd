import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children, activeTab, onTabChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF8F3] dark:bg-stone-950 text-[#1A1A1A] dark:text-stone-100 flex flex-col font-sans transition-colors duration-200">
      <Header 
        onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} 
        mobileMenuOpen={mobileMenuOpen} 
      />
      
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={onTabChange} 
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
