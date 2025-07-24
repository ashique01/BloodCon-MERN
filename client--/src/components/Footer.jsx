import React from 'react';
import { HeartIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import {
  EnvelopeIcon, PhoneIcon, MapPinIcon, GlobeAltIcon // Added for contact info
} from '@heroicons/react/24/outline';

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className={`${theme === 'dark' ? 'bg-gray-900 text-gray-300 border-gray-700' : 'bg-white text-gray-600 border-gray-100'} py-12 border-t shadow-sm`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">

        {/* Section 1: Brand & Mission */}
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <Link to="/" className="flex items-center text-red-600 text-2xl font-bold tracking-tight mb-4">
            <HeartIcon className="h-8 w-8 mr-2" />BloodCon
          </Link>
          <p className="text-sm leading-relaxed">
            Connecting compassionate donors with patients in urgent need. We believe in a healthier Bangladesh, one donation at a time.
          </p>
          <p className={`mt-4 text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            &copy; {new Date().getFullYear()} BloodLink. All rights reserved.
          </p>
        </div>

        {/* Section 2: Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-red-600 transition-colors">Home</Link></li>
            <li><Link to="/donors" className="hover:text-red-600 transition-colors">Find Donors</Link></li>
            <li><Link to="/recent-requests" className="hover:text-red-600 transition-colors">Recent Requests</Link></li>
            <li><Link to="/about" className="hover:text-red-600 transition-colors">About Us</Link></li>
            <li><Link to="/faq" className="hover:text-red-600 transition-colors">FAQ</Link></li>
          </ul>
        </div>

        {/* Section 3: Contact Us */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center"><EnvelopeIcon className="h-5 w-5 mr-2 text-red-500"/> ashiquemurad@gmail.com</li>
            <li className="flex items-center"><PhoneIcon className="h-5 w-5 mr-2 text-red-500"/> +880 123 456789</li>
            <li className="flex items-start"><MapPinIcon className="h-5 w-5 mr-2 text-red-500 flex-shrink-0"/> 123 Blood Donor St, Dhaka, Bangladesh</li>
          </ul>
        </div>

        {/* Section 4: Social Media (Placeholder) */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="text-red-600 hover:text-red-700 transition-colors" aria-label="Facebook"><GlobeAltIcon className="h-7 w-7"/></a>
            <a href="#" className="text-red-600 hover:text-red-700 transition-colors" aria-label="Twitter"><GlobeAltIcon className="h-7 w-7"/></a>
            <a href="#" className="text-red-600 hover:text-red-700 transition-colors" aria-label="Instagram"><GlobeAltIcon className="h-7 w-7"/></a>
          </div>
        </div>

      </div>
      <div className={`mt-12 text-center text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
        <p className="flex items-center justify-center">
          Built with <HeartIcon className="h-4 w-4 text-red-500 mx-1 animate-pulse" /> for a healthier Bangladesh.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
