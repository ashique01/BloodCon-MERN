import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowPathIcon, HeartIcon, CalendarDaysIcon, MapPinIcon,
  ClipboardDocumentListIcon, PlusCircleIcon, ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const DonationHistoryPage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  useEffect(() => {
    const fetchDonationHistory = async () => {
      if (!user && !authLoading) {
        setError('User not authenticated.');
        setLoading(false);
        return;
      }
      if (authLoading) return;

      try {
        setLoading(true);
        setError('');
        const { data } = await axiosInstance.get('/donations/my');
        const sortedDonations = data.sort((a, b) => new Date(b.donationDate) - new Date(a.donationDate));
        setDonations(sortedDonations);
      } catch (err) {
        console.error("Error fetching donation history:", err);
        setError(err.response?.data?.message || 'Failed to fetch donation history.');
      } finally {
        setLoading(false);
      }
    };

    fetchDonationHistory();
  }, [user, authLoading]);

  const renderContent = () => {
    if (loading || authLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <ArrowPathIcon className="animate-spin h-10 w-10 text-blue-500" />
          <p className={`mt-4 text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Loading history...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className={`text-center py-20 p-6 rounded-xl ${theme === 'dark' ? 'bg-red-900/20 text-red-500' : 'bg-red-50 text-red-600'}`}>{error}</div>
      );
    }

    if (donations.length === 0) {
      return (
        <div className="text-center py-20">
          <ClipboardDocumentListIcon className={`h-24 w-24 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
          <h3 className="text-xl font-semibold">No Donations Found</h3>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>You haven't recorded any donations yet.</p>
          <Link to="/add-donation" className="mt-6 inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md">
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Add Your First Donation
          </Link>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {donations.map((donation, index) => (
          <div key={donation._id} className="relative flex items-start">
            <div className="absolute left-5 top-5 h-full w-px bg-gray-300 dark:bg-gray-600"></div>
            <div className="flex-shrink-0">
                <div className={`flex items-center justify-center h-10 w-10 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <HeartIcon className={`h-6 w-6 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`} />
                </div>
            </div>
            <div className="ml-6 flex-grow">
                <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">{donation.bloodGroup} Blood Donated</h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{formatDateTime(donation.donationDate)}</p>
                    </div>
                    <div className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        <p>To: {donation.recipientName || 'Unknown Recipient'}</p>
                        <p>At: {donation.location || 'N/A'}</p>
                    </div>
                    {donation.notes && <p className={`mt-3 pt-3 border-t text-sm ${theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-700'}`}>Notes: {donation.notes}</p>}
                </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button onClick={() => navigate(-1)} className={`p-2 rounded-full mr-3 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}>
                <ArrowLeftIcon className="h-6 w-6"/>
            </button>
            <h1 className="text-3xl sm:text-4xl font-extrabold">Donation History</h1>
          </div>
        </header>

        <main>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DonationHistoryPage;
