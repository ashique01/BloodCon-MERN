import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon, UsersIcon, HeartIcon, ClipboardDocumentListIcon, Cog6ToothIcon, ArrowLeftOnRectangleIcon, SunIcon, MoonIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';

const AdminSidebar = ({ activeTab, onTabChange, onLogout }) => {
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: HomeIcon },
    { id: 'users', name: 'Users', icon: UsersIcon },
    { id: 'requests', name: 'Blood Requests', icon: HeartIcon },
    { id: 'donations', name: 'Donations', icon: ClipboardDocumentListIcon },
  ];

  return (
    <div className={`flex flex-col h-full p-4 ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} shadow-lg rounded-xl`}>
      <div className="flex items-center justify-center mb-8">
        <Cog6ToothIcon className={`h-10 w-10 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
        <h2 className="text-2xl font-bold ml-3">Admin Panel</h2>
      </div>

      <nav className="flex-grow space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center p-3 rounded-lg text-left font-medium transition-colors duration-200
              ${
                activeTab === item.id
                  ? (theme === 'dark' ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white')
                  : (theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700')
              }`}
          >
            <item.icon className="h-6 w-6 mr-3" />
            {item.name}
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={toggleTheme}
          className={`w-full flex items-center p-3 rounded-lg text-left font-medium transition-colors duration-200
            ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}
          `}
        >
          {theme === 'dark' ? <SunIcon className="h-6 w-6 mr-3" /> : <MoonIcon className="h-6 w-6 mr-3" />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button
          onClick={onLogout}
          className={`w-full flex items-center p-3 rounded-lg text-left font-medium transition-colors duration-200
            ${theme === 'dark' ? 'hover:bg-red-700 text-red-300' : 'hover:bg-red-100 text-red-600'}
          `}
        >
          <ArrowLeftOnRectangleIcon className="h-6 w-6 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
