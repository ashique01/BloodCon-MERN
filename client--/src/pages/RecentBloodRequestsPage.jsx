import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPinIcon, HeartIcon, BuildingOfficeIcon, PhoneIcon, 
  ArrowPathIcon, ChevronLeftIcon, ChevronRightIcon, ClockIcon, FunnelIcon, 
  XCircleIcon, ArrowLeftIcon, CheckCircleIcon, ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';

const RecentBloodRequestsPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [allRequests, setAllRequests] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ city: '', bloodGroup: '', status: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 10;

  const timeAgo = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    let interval = seconds / 3600;
    if (interval > 24) return `${Math.floor(interval / 24)} days ago`;
    if (interval > 1) return `${Math.floor(interval)} hours ago`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)} minutes ago`;
    return `${Math.floor(seconds)} seconds ago`;
  };

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get('/requests');
        setAllRequests(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch requests.');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  useEffect(() => {
    let filtered = allRequests;
    if (filters.city) filtered = filtered.filter(req => req.city === filters.city);
    if (filters.bloodGroup) filtered = filtered.filter(req => req.bloodGroupNeeded === filters.bloodGroup);
    if (filters.status) filtered = filtered.filter(req => (req.status || 'Pending') === filters.status);
    
    const paginated = filtered.slice((currentPage - 1) * requestsPerPage, currentPage * requestsPerPage);
    setRequests(paginated);
  }, [allRequests, currentPage, filters]);

  const totalPages = Math.ceil(allRequests.filter(req => 
    (!filters.city || req.city === filters.city) && 
    (!filters.bloodGroup || req.bloodGroupNeeded === filters.bloodGroup) && 
    (!filters.status || (req.status || 'Pending') === filters.status)
  ).length / requestsPerPage);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ city: '', bloodGroup: '', status: '' });
    setCurrentPage(1);
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const cities = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'];
  const statuses = ['Pending', 'Accepted', 'Completed'];

  const getStatusClasses = (status) => {
    switch (status) {
      case 'Accepted':
        return theme === 'dark' ? 'bg-green-800/50 text-green-300' : 'bg-green-100 text-green-800';
      case 'Completed':
        return theme === 'dark' ? 'bg-blue-800/50 text-blue-300' : 'bg-blue-100 text-blue-800';
      default: // Pending
        return theme === 'dark' ? 'bg-yellow-800/50 text-yellow-300' : 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8">
            <div className="flex items-center">
                <button onClick={() => navigate(-1)} className={`p-2 rounded-full mr-3 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}>
                    <ArrowLeftIcon className="h-6 w-6"/>
                </button>
                <h1 className="text-3xl sm:text-4xl font-extrabold">Recent Blood Requests</h1>
            </div>
        </header>

        <main className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 sm:p-6 rounded-xl shadow-md`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 items-end">
            <div className="md:col-span-1">
              <h2 className={`text-xl font-semibold flex items-center ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                <FunnelIcon className={`h-5 w-5 mr-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}/>Filters
              </h2>
            </div>
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <select name="city" value={filters.city} onChange={handleFilterChange} className={`w-full p-2 border rounded-md text-sm focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
                <option value="">All Cities</option>{cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select name="bloodGroup" value={filters.bloodGroup} onChange={handleFilterChange} className={`w-full p-2 border rounded-md text-sm focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
                <option value="">All Groups</option>{bloodGroups.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <select name="status" value={filters.status} onChange={handleFilterChange} className={`w-full p-2 border rounded-md text-sm focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
                <option value="">All Statuses</option>{statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {(filters.city || filters.bloodGroup || filters.status) && 
              <div className="md:col-start-2 md:col-span-3 flex justify-end">
                <button onClick={clearFilters} className={`text-sm flex items-center ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:underline'}`}>
                  <XCircleIcon className="h-4 w-4 mr-1"/>Clear Filters
                </button>
              </div>
            }
          </div>

          {loading ? 
            <div className="flex flex-col items-center justify-center py-20">
              <ArrowPathIcon className="animate-spin h-10 w-10 text-blue-500 mb-4" />
              <p className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Loading blood requests...</p>
            </div>
           : error ? 
            <div className={`text-center py-20 p-6 rounded-xl ${theme === 'dark' ? 'bg-red-900/20 text-red-500' : 'bg-red-50 text-red-600'}`}>
              <span className="block sm:inline">{error}</span>
            </div>
           : requests.length === 0 ? 
            <div className="text-center py-16">
              <HeartIcon className={`h-16 w-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
              <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>No Requests Found</h3>
              <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Try adjusting your filters or check back later.</p>
            </div>
           : 
            <div className="space-y-4">
              {requests.map(req => (
                <div key={req._id} className={`${theme === 'dark' ? 'bg-gray-700/50 border-gray-700' : 'bg-gray-50 border-gray-200'} p-4 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md`}>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                    <div className="flex items-center mb-2 sm:mb-0">
                      <HeartIcon className="h-7 w-7 text-red-500 mr-3 flex-shrink-0"/>
                      <div>
                        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>{req.bloodGroupNeeded} Blood Needed</h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>by {req.requesterName}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(req.status || 'Pending')}`}>
                        {req.status || 'Pending'}
                      </span>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-left sm:text-right mt-2`}>
                        <span className="flex items-center justify-start sm:justify-end"><MapPinIcon className={`h-4 w-4 mr-1.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}/>{req.city}</span>
                        <span className="flex items-center justify-start sm:justify-end mt-1"><ClockIcon className={`h-4 w-4 mr-1.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}/>{timeAgo(req.createdAt)}</span>
                      </p>
                    </div>
                  </div>
                  <div className={`mt-4 pt-4 border-t text-sm space-y-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                    {req.hospitalName && <p className="flex items-center"><BuildingOfficeIcon className={`h-4 w-4 mr-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}/>{req.hospitalName}</p>}
                    <p className="flex items-center"><PhoneIcon className={`h-4 w-4 mr-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}/><a href={`tel:${req.phone}`} className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} hover:underline`}>{req.phone}</a></p>
                  </div>
                </div>
              ))}
              {totalPages > 1 && 
                <nav aria-label="Pagination" className="mt-8 flex justify-center items-center space-x-2">
                  <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className={`px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                    <ChevronLeftIcon className="h-4 w-4 mr-1" /> Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-md font-semibold transition-colors duration-200 ${currentPage === page ? 'bg-blue-600 text-white shadow-md' : (theme === 'dark' ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')}`}
                    >
                      {page}
                    </button>
                  ))}
                  <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className={`px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                    Next <ChevronRightIcon className="h-4 w-4 ml-1" />
                  </button>
                </nav>
              }
            </div>
          }
        </main>
      </div>
    </div>
  );
};

export default RecentBloodRequestsPage;