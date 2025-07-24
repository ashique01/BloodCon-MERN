import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import axiosInstance from '../api/axiosInstance';
import EditProfileModal from '../components/modals/EditProfileModal';
import ChangePasswordModal from '../components/modals/ChangePasswordModal';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  HeartIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon,
  ShieldCheckIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  PencilSquareIcon,
  KeyIcon,
  ClockIcon,
  ExclamationCircleIcon,
  PlusCircleIcon,
  ListBulletIcon,
  ArrowPathIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const DashboardPage = () => {
  const { user, isLoading, logout, login, token } = useAuth();
  const navigate = useNavigate();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const cities = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'];

  const [userDonations, setUserDonations] = useState([]);
  const [loadingUserDonations, setLoadingUserDonations] = useState(true);
  const [userDonationsError, setUserDonationsError] = useState('');

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getDonationEligibility = (latestDonationDate) => {
    if (!latestDonationDate) {
      return { canDonate: true, message: "You are eligible to donate blood anytime!" };
    }

    const lastDonation = new Date(latestDonationDate);
    const threeMonthsLater = new Date(lastDonation);
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

    const now = new Date();

    if (now >= threeMonthsLater) {
      return { canDonate: true, message: "You are eligible to donate blood again!" };
    } else {
      const diffTime = threeMonthsLater.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { canDonate: false, message: `You can donate again in approximately ${diffDays} days.` };
    }
  };

  useEffect(() => {
    const fetchUserDonations = async () => {
      if (!user) {
        setLoadingUserDonations(false);
        return;
      }
      try {
        setLoadingUserDonations(true);
        setUserDonationsError('');
        const { data } = await axiosInstance.get('/donations/my');
        const sortedDonations = data.sort((a, b) => new Date(b.donationDate) - new Date(a.donationDate));
        setUserDonations(sortedDonations);
      } catch (err) {
        console.error("Error fetching user donations:", err);
        setUserDonationsError(err.response?.data?.message || 'Failed to load your donation history.');
      } finally {
        setLoadingUserDonations(false);
      }
    };

    fetchUserDonations();
  }, [user]);

  const latestDonationDate = userDonations.length > 0 ? userDonations[0].donationDate : null;
  const donationEligibility = getDonationEligibility(latestDonationDate);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const openEditModal = () => setShowEditModal(true);
  const closeEditModal = () => setShowEditModal(false);

  const openChangePasswordModal = () => setShowChangePasswordModal(true);
  const closeChangePasswordModal = () => setShowChangePasswordModal(false);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center animate-pulse">
          <HeartIcon className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Welcome, {user.name}!</h1>
            <p className="text-md text-gray-500 dark:text-gray-400 mt-1">Here's your blood donation dashboard.</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${user.isAdmin ? 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100' : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'}`}>
              {user.isAdmin ? <ShieldCheckIcon className="h-5 w-5 mr-1.5" /> : <UserIcon className="h-5 w-5 mr-1.5" />}
              {user.isAdmin ? 'Administrator' : 'Donor'}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile & Actions */}
          <div className="lg:col-span-1 space-y-8">
            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
              <div className="flex items-center mb-6">
                <UserCircleIcon className="h-16 w-16 text-blue-500 mr-4" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{user.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3" />
                  <span>{user.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3" />
                  <span>{user.city}, {user.address || 'N/A'}</span>
                </div>
                <div className="flex items-center">
                  <HeartIcon className="h-5 w-5 text-red-500 mr-3" />
                  <span className="font-bold text-red-500 text-md">{user.bloodGroup}</span>
                </div>
              </div>
              <div className="mt-6 flex space-x-2">
                <button onClick={openEditModal} className="flex-1 text-sm flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                  <PencilSquareIcon className="h-4 w-4 mr-2"/> Edit Profile
                </button>
                <button onClick={openChangePasswordModal} className="flex-1 text-sm flex items-center justify-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                  <KeyIcon className="h-4 w-4 mr-2"/> Password
                </button>
              </div>
            </div>

            {/* Donation Status Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Donation Status</h3>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg flex items-center ${user.availableToDonate ? 'bg-green-50 dark:bg-green-800/50' : 'bg-red-50 dark:bg-red-800/50'}`}>
                  {user.availableToDonate ? <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" /> : <XCircleIcon className="h-6 w-6 text-red-500 mr-3" />}
                  <div>
                    <p className={`font-semibold ${user.availableToDonate ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                      {user.availableToDonate ? 'Available to Donate' : 'Not Available'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Your current status</p>
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${donationEligibility.canDonate ? 'bg-blue-50 dark:bg-blue-800/50' : 'bg-yellow-50 dark:bg-yellow-800/50'}`}>
                  <div className="flex items-center">
                    {donationEligibility.canDonate ? <CheckCircleIcon className="h-6 w-6 text-blue-500 mr-3" /> : <ExclamationCircleIcon className="h-6 w-6 text-yellow-500 mr-3" />}
                    <div>
                      <p className={`font-semibold ${donationEligibility.canDonate ? 'text-blue-800 dark:text-blue-200' : 'text-yellow-800 dark:text-yellow-200'}`}>
                        Eligibility Check
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{donationEligibility.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: History & Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/request-blood" className="p-6 bg-red-500 text-white rounded-2xl shadow-sm hover:bg-red-600 transition-colors flex items-center">
                <HeartIcon className="h-8 w-8 mr-4"/>
                <div>
                  <h3 className="font-bold text-lg">Request Blood</h3>
                  <p className="text-sm opacity-80">Need blood for yourself or others.</p>
                </div>
              </Link>
              <Link to="/recent-requests" className="p-6 bg-blue-500 text-white rounded-2xl shadow-sm hover:bg-blue-600 transition-colors flex items-center">
                <ListBulletIcon className="h-8 w-8 mr-4"/>
                <div>
                  <h3 className="font-bold text-lg">View Requests</h3>
                  <p className="text-sm opacity-80">See recent blood requests.</p>
                </div>
              </Link>
            </div>

            {/* Donation History */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Your Donation History</h3>
                <Link to="/add-donation" className="flex items-center text-sm font-semibold text-blue-600 hover:underline">
                  <PlusCircleIcon className="h-5 w-5 mr-1"/> Add Donation
                </Link>
              </div>
              {loadingUserDonations ? (
                <div className="flex justify-center items-center py-8">
                  <ArrowPathIcon className="animate-spin h-6 w-6 text-blue-500 mr-3" />
                  <p>Loading donations...</p>
                </div>
              ) : userDonationsError ? (
                <div className="text-center py-8 text-red-500">{userDonationsError}</div>
              ) : userDonations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No donations recorded yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userDonations.slice(0, 4).map(donation => (
                    <div key={donation._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center">
                        <div className="p-2 bg-red-100 dark:bg-red-800/50 rounded-full mr-4">
                          <HeartIcon className="h-5 w-5 text-red-500"/>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-white">{donation.bloodGroup} Donation</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{donation.location || 'N/A'}</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{formatDate(donation.donationDate)}</p>
                    </div>
                  ))}
                </div>
              )}
              {userDonations.length > 4 && (
                <div className="text-center mt-4">
                  <Link to="/donation-history" className="text-sm font-semibold text-blue-600 hover:underline">
                    View All Donations
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showEditModal && <EditProfileModal
        user={user}
        onClose={closeEditModal}
        onSuccess={(updatedUser) => {
          login(updatedUser, token); // Update the user in AuthContext with the current token
          closeEditModal();
        }}
        bloodGroups={bloodGroups}
        cities={cities}
      />}
      {showChangePasswordModal && <ChangePasswordModal onClose={closeChangePasswordModal} />}
    </div>
  );
};

export default DashboardPage;