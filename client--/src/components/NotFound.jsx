import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const NotFound = () => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center text-center ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <ExclamationTriangleIcon className={`h-24 w-24 mb-4 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'}`} />
      <h1 className="text-6xl font-extrabold mb-2">404</h1>
      <p className="text-2xl font-semibold mb-4">Page Not Found</p>
      <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
          theme === 'dark'
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        Go Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
