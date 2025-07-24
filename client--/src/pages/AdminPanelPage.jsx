import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import DashboardOverview from './AdminPages/DashboardOverview';
import UserManagement from './AdminPages/UserManagement';
import BloodRequestManagement from './AdminPages/BloodRequestManagement';
import DonationManagement from './AdminPages/DonationManagement';
import { ArrowPathIcon, Bars3Icon } from '@heroicons/react/24/outline';

const AdminPanelPage = () => {
  const { user, logout, isLoading: authLoading } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview theme={theme} />;
      case 'users':
        return <UserManagement theme={theme} />;
      case 'requests':
        return <BloodRequestManagement theme={theme} />;
      case 'donations':
        return <DonationManagement theme={theme} />;
      default:
        return <DashboardOverview theme={theme} />;
    }
  };

  if (authLoading || !user || !user.isAdmin) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <ArrowPathIcon className="h-12 w-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar for large screens */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="w-64 p-4">
          <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className={`lg:hidden flex items-center justify-between p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Bars3Icon className={`h-6 w-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`} />
          </button>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Admin Panel</h1>
        </div>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="lg:hidden">
            <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} />
          </div>
        )}

        <div className="flex-1 p-4 md:p-8">
          <h1 className={`hidden lg:block text-4xl font-extrabold mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Admin Dashboard</h1>
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-md`}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage;
