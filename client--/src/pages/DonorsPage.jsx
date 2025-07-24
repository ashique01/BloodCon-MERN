import React, { useState, useEffect, useMemo } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import {
  ArrowPathIcon,
  UserCircleIcon,
  HeartIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
  UsersIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';

const DONORS_PER_PAGE = 10;

const DonorsPage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { theme } = useTheme();
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters State
  const [filters, setFilters] = useState({
    bloodGroup: '',
    city: '',
    available: 'all',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const cities = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'];

  useEffect(() => {
    const fetchDonors = async () => {
      if (authLoading) return;
      setLoading(true);
      setError('');
      try {
        const response = await axiosInstance.get('/users/all-donors?limit=1000');
        setDonors(response.data.donors);
      } catch (err) {
        console.error("Error fetching donors:", err);
        setError(err.response?.data?.message || 'Failed to fetch donor list.');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchDonors();
    }
  }, [authLoading]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }

  const filteredDonors = useMemo(() => {
    return donors
      .filter(donor => {
        const searchLower = searchTerm.toLowerCase();
        return (
          donor.name.toLowerCase().includes(searchLower) ||
          donor.email.toLowerCase().includes(searchLower)
        );
      })
      .filter(donor => {
        if (filters.bloodGroup && donor.bloodGroup !== filters.bloodGroup) return false;
        if (filters.city && donor.city !== filters.city) return false;
        if (filters.available === 'true' && !donor.availableToDonate) return false;
        if (filters.available === 'false' && donor.availableToDonate) return false;
        return true;
      });
  }, [donors, filters, searchTerm]);

  const paginatedDonors = useMemo(() => {
    const startIndex = (currentPage - 1) * DONORS_PER_PAGE;
    return filteredDonors.slice(startIndex, startIndex + DONORS_PER_PAGE);
  }, [filteredDonors, currentPage]);

  const totalPages = Math.ceil(filteredDonors.length / DONORS_PER_PAGE);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (authLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <ArrowPathIcon className="h-12 w-12 text-red-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight">Find a Donor</h1>
          <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Browse our community of heroes dedicated to saving lives.</p>
        </header>

        <div className={`p-5 rounded-xl shadow-sm mb-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-1">
              <label htmlFor="search" className="block text-sm font-medium mb-1">Search Name/Email</label>
              <div className="relative">
                <MagnifyingGlassIcon className={`h-5 w-5 absolute top-1/2 left-3 -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}/>
                <input type="text" id="search" placeholder="e.g., John Doe" value={searchTerm} onChange={handleSearchChange} className={`w-full pl-10 pr-4 py-2 border rounded-lg transition-shadow duration-200 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:ring-blue-500' : 'bg-gray-50 border-gray-300 focus:ring-blue-500'}`}/>
              </div>
            </div>
            <div>
              <label htmlFor="bloodGroup" className="block text-sm font-medium mb-1">Blood Group</label>
              <select id="bloodGroup" name="bloodGroup" value={filters.bloodGroup} onChange={handleFilterChange} className={`w-full px-4 py-2 border rounded-lg transition-shadow duration-200 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:ring-blue-500' : 'bg-gray-50 border-gray-300 focus:ring-blue-500'}`}>
                <option value="">All Groups</option>
                {bloodGroups.map(group => <option key={group} value={group}>{group}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
              <select id="city" name="city" value={filters.city} onChange={handleFilterChange} className={`w-full px-4 py-2 border rounded-lg transition-shadow duration-200 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:ring-blue-500' : 'bg-gray-50 border-gray-300 focus:ring-blue-500'}`}>
                <option value="">All Cities</option>
                {cities.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="available" className="block text-sm font-medium mb-1">Availability</label>
              <select id="available" name="available" value={filters.available} onChange={handleFilterChange} className={`w-full px-4 py-2 border rounded-lg transition-shadow duration-200 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:ring-blue-500' : 'bg-gray-50 border-gray-300 focus:ring-blue-500'}`}>
                <option value="all">All</option>
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </select>
            </div>
          </div>
        </div>

        <div className={`rounded-xl shadow-sm overflow-x-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <ArrowPathIcon className="animate-spin h-10 w-10 text-blue-500" />
            </div>
          ) : error ? (
            <div className={`text-center py-20 p-6 rounded-xl ${theme === 'dark' ? 'bg-red-900/20 text-red-500' : 'bg-red-50 text-red-600'}`}>{error}</div>
          ) : filteredDonors.length === 0 ? (
            <div className="text-center py-20">
              <UsersIcon className={`h-24 w-24 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
              <h3 className="text-xl font-semibold">No Donors Found</h3>
              <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Try adjusting your filters to find more results.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Blood Group</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">City</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Availability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedDonors.map(donor => (
                  <tr key={donor._id} className={`transition-colors ${theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <Link to={`/donors/${donor._id}`} className="flex items-center">
                            <UserCircleIcon className={`h-10 w-10 mr-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                            <div>
                                <div className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400">{donor.name}</div>
                                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{donor.email}</div>
                            </div>
                        </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${theme === 'dark' ? 'bg-red-800/50 text-red-200' : 'bg-red-100 text-red-800'}`}>{donor.bloodGroup}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{donor.city}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {donor.availableToDonate ? (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${theme === 'dark' ? 'bg-green-800/50 text-green-200' : 'bg-green-100 text-green-800'}`}>
                          <CheckCircleIcon className="h-4 w-4 mr-1.5" /> Available
                        </span>
                      ) : (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${theme === 'dark' ? 'bg-red-800/50 text-red-200' : 'bg-red-100 text-red-800'}`}>
                          <XCircleIcon className="h-4 w-4 mr-1.5" /> Not Available
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
              Showing <span className="font-medium">{paginatedDonors.length}</span> of <span className="font-medium">{filteredDonors.length}</span> results
            </p>
            <div className="flex items-center space-x-2">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={`p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed ${theme === 'dark' ? 'bg-gray-800 border-gray-600 hover:bg-gray-700' : 'bg-white border-gray-300 hover:bg-gray-100'}`}>
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Page {currentPage} of {totalPages}</span>
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className={`p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed ${theme === 'dark' ? 'bg-gray-800 border-gray-600 hover:bg-gray-700' : 'bg-white border-gray-300 hover:bg-gray-100'}`}>
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorsPage;