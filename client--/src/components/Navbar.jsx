import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  Bars3Icon, XMarkIcon, HomeIcon, UserCircleIcon, ArrowRightOnRectangleIcon,
  Cog6ToothIcon, PlusCircleIcon, ShieldCheckIcon, ChevronDownIcon, ChevronUpIcon,
  ClockIcon, ClipboardDocumentCheckIcon, UsersIcon, UserGroupIcon,
  SunIcon, MoonIcon, HeartIcon // Ensure HeartIcon is imported
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 border-b border-gray-100 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-red-600 hover:text-red-700 transition group" onClick={closeMobileMenu}>
              <HeartIcon className="h-8 w-8 mr-2 text-red-600 group-hover:text-red-700 transition-all duration-300 transform group-hover:scale-110" />
              <span className="text-2xl font-bold tracking-tight">
                BloodCon
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center text-gray-600 dark:text-gray-300">
            <Link to="/" className="hover:text-red-600 flex items-center transition"><HomeIcon className="h-5 w-5 mr-1"/>Home</Link>
            <Link to="/donors" className="hover:text-red-600 flex items-center transition"><UsersIcon className="h-5 w-5 mr-1"/>Donors</Link>
            {user && (
              <Link to="/request-blood" className="hover:text-red-600 flex items-center transition"><PlusCircleIcon className="h-5 w-5 mr-1"/>Request Blood</Link>
            )}
            {user && user.isAdmin && (
              <Link to="/admin" className="hover:text-red-600 flex items-center transition"><ShieldCheckIcon className="h-5 w-5 mr-1"/>Admin Panel</Link>
            )}

            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none">
              {theme === 'light' ? (
                <MoonIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              ) : (
                <SunIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              )}
            </button>

            {/* Desktop Profile Dropdown */}
            <div className="relative group">
              <button onClick={toggleProfileMenu} className="flex items-center text-gray-600 dark:text-gray-300 hover:text-red-600 transition focus:outline-none">
                <UserCircleIcon className="h-8 w-8 mr-2 text-red-500"/>
                <span className="font-semibold">{user ? user.name : 'Account'}</span>
                {isProfileMenuOpen ? <ChevronUpIcon className="h-4 w-4 ml-1"/> : <ChevronDownIcon className="h-4 w-4 ml-1"/>}
              </button>
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 z-50 border border-gray-100 dark:border-gray-700">
                  {user ? (
                    <>
                      <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700"><p className="font-bold truncate">{user.name}</p><p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p></div>
                      <Link to="/dashboard" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"><Cog6ToothIcon className="h-4 w-4 mr-2"/>My Dashboard</Link>
                      <Link to="/donation-history" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"><ClockIcon className="h-4 w-4 mr-2"/>View Donation History</Link>
                      <Link to="/recent-requests" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"><ClipboardDocumentCheckIcon className="h-4 w-4 mr-2"/>View Blood Requests</Link>
                      <Link to="/add-donation" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"><ClipboardDocumentCheckIcon className="h-4 w-4 mr-2"/>Add Donation</Link>
                      <Link to="/request-blood-for-someone-else" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"><UserGroupIcon className="h-4 w-4 mr-2"/>Request for Others</Link>
                      {user.isAdmin && <Link to="/admin" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"><ShieldCheckIcon className="h-4 w-4 mr-2"/>Admin Panel</Link>}
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-gray-700"><ArrowRightOnRectangleIcon className="h-4 w-4 mr-2 inline"/>Logout</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"><ArrowRightOnRectangleIcon className="h-4 w-4 mr-2"/>Login</Link>
                      <Link to="/register" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Register</Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button onClick={toggleMobileMenu} className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none">
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <XMarkIcon className="block h-6 w-6"/> : <Bars3Icon className="block h-6 w-6"/>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Panel */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-25 z-30 md:hidden" onClick={closeMobileMenu}></div>
      )}
      <div className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl z-40 transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
          <span className="text-red-600 text-lg font-bold">Menu</span>
          <button onClick={closeMobileMenu} className="text-gray-600 dark:text-gray-300 hover:text-red-600 focus:outline-none"><XMarkIcon className="h-6 w-6"/></button>
        </div>
        <div className="px-2 pt-2 pb-3 space-y-1 text-gray-700 dark:text-gray-300">
          {/* Theme Toggle in Mobile Menu */}
          <button onClick={toggleTheme} className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center">
            {theme === 'light' ? (
              <MoonIcon className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-300" />
            ) : (
              <SunIcon className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-300" />
            )}
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>

          {user && (
            <div className="pb-3 mb-2 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center px-3 py-2 space-x-3"><UserCircleIcon className="h-10 w-10 text-red-500"/><div><div className="font-bold">{user.name}</div><div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div></div></div>
              <Link to="/dashboard" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center"><Cog6ToothIcon className="h-5 w-5 mr-2"/>Dashboard</Link>
              <Link to="/donation-history" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center"><ClockIcon className="h-5 w-5 mr-2"/>Donation History</Link>
              <Link to="/recent-requests" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center"><ClipboardDocumentCheckIcon className="h-5 w-5 mr-2"/>View Blood Requests</Link>
              <Link to="/add-donation" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center"><ClipboardDocumentCheckIcon className="h-5 w-5 mr-2"/>Add Donation</Link>
              <Link to="/request-blood-for-someone-else" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center"><UserGroupIcon className="h-5 w-5 mr-2"/>Request for Others</Link>
              {user.isAdmin && <Link to="/admin" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center"><ShieldCheckIcon className="h-5 w-5 mr-2"/>Admin Panel</Link>}
              <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-gray-800 flex items-center"><ArrowRightOnRectangleIcon className="h-5 w-5 mr-2"/>Logout</button>
            </div>
          )}
          <Link to="/" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center"><HomeIcon className="h-5 w-5 mr-2"/>Home</Link>
          <Link to="/donors" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center"><UsersIcon className="h-5 w-5 mr-2"/>Donors</Link>
          {!user && (
            <>
              <Link to="/login" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center"><ArrowRightOnRectangleIcon className="h-5 w-5 mr-2"/>Login</Link>
              <Link to="/register" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center">Register</Link>
            </>
          )}
          {user && (
            <Link to="/request-blood" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center"><PlusCircleIcon className="h-5 w-5 mr-2"/>Request Blood</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;