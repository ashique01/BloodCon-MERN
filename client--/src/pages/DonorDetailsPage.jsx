import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

import {
  UserCircleIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, HeartIcon,
  CalendarDaysIcon, CheckCircleIcon, XCircleIcon, ArrowPathIcon,
  ArrowLeftIcon, ClockIcon
} from "@heroicons/react/24/outline";

const DonorDetailsPage = () => {
  const { id } = useParams();
  const { user, isLoading: authLoading } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [donorDetails, setDonorDetails] = useState(null);
  const [donorDonations, setDonorDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  const getDonationEligibility = (latestDonationDate) => {
    if (!latestDonationDate) return { canDonate: true, message: "Eligible to donate" };
    const last = new Date(latestDonationDate);
    const threeMonthsLater = new Date(last);
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

    const now = new Date();

    if (now >= threeMonthsLater) return { canDonate: true, message: "Eligible to donate" };
    const diffDays = Math.ceil((threeMonthsLater - now) / (1000 * 60 * 60 * 24));
    return { canDonate: false, message: `Eligible in ${diffDays} days` };
  };

  useEffect(() => {
    if (authLoading || !id) return;
    const fetchDonorData = async () => {
      try {
        const [detailsRes, donationsRes] = await Promise.all([
          axiosInstance.get(`/users/${id}`),
          axiosInstance.get(`/donations/donor/${id}`)
        ]);
        setDonorDetails(detailsRes.data);
        setDonorDonations(donationsRes.data.sort((a, b) => new Date(b.donationDate) - new Date(a.donationDate)));
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching donor data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDonorData();
  }, [id, authLoading]);

  const latestDonationDate = donorDonations.length > 0 ? donorDonations[0].donationDate : null;
  const donationEligibility = getDonationEligibility(latestDonationDate);

  if (loading || authLoading) {
    return <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}><ArrowPathIcon className="h-12 w-12 text-blue-500 animate-spin" /></div>;
  }

  if (error) {
    return <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}><div className="bg-red-100 text-red-700 p-4 rounded-md shadow-sm">{error}</div></div>;
  }

  if (!donorDetails) {
    return <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}><p className="text-gray-600 dark:text-gray-300">Donor not found.</p></div>;
  }

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-8">
            <div className="flex items-center">
                <button onClick={() => navigate(-1)} className={`p-2 rounded-full mr-3 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}>
                    <ArrowLeftIcon className="h-6 w-6"/>
                </button>
                <h1 className="text-3xl sm:text-4xl font-extrabold">Donor Profile</h1>
            </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <section className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-md text-center`}>
              <UserCircleIcon className="h-24 w-24 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold">{donorDetails.name}</h2>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4`}>{donorDetails.city}</p>
              <div className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${donationEligibility.canDonate ? (theme === 'dark' ? "bg-green-800/50 text-green-300" : "bg-green-100 text-green-800") : (theme === 'dark' ? "bg-red-800/50 text-red-300" : "bg-red-100 text-red-800")}`}>
                {donationEligibility.canDonate ? <CheckCircleIcon className="h-5 w-5 mr-2"/> : <XCircleIcon className="h-5 w-5 mr-2"/>}
                {donationEligibility.message}
              </div>
            </section>

            <section className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-md`}>
              <h3 className="font-bold text-xl mb-4">Contact Information</h3>
              <div className="space-y-4 text-sm">
                <p className="flex items-center"><EnvelopeIcon className={`h-5 w-5 mr-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}/>{donorDetails.email !== "Private" ? donorDetails.email : <span className="italic">Private</span>}</p>
                <p className="flex items-center"><PhoneIcon className={`h-5 w-5 mr-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}/>{donorDetails.phone !== "Private" ? <a href={`tel:${donorDetails.phone}`} className="text-blue-500 hover:underline">{donorDetails.phone}</a> : <span className="italic">Private</span>}</p>
              </div>
            </section>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <section className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-md`}>
              <h3 className="font-bold text-xl mb-4">Donor Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div className="flex items-center">
                    <HeartIcon className={`h-6 w-6 mr-3 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`}/>
                    <div>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Blood Group</p>
                        <p className="font-semibold text-base">{donorDetails.bloodGroup}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <CalendarDaysIcon className={`h-6 w-6 mr-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}/>
                    <div>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Date of Birth</p>
                        <p className="font-semibold text-base">{formatDate(donorDetails.dob)}</p>
                    </div>
                </div>
                <div className="flex items-start sm:col-span-2 mt-2">
                    <MapPinIcon className={`h-6 w-6 mr-3 mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}/>
                    <div>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Address</p>
                        <p className="font-semibold text-base">{donorDetails.address || 'N/A'}</p>
                    </div>
                </div>
              </div>
            </section>

            <section className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-md`}>
              <h3 className="font-bold text-xl mb-4">Donation History</h3>
              {donorDonations.length > 0 ? (
                <ul className="space-y-3">
                  {donorDonations.slice(0, 5).map(d => (
                    <li key={d._id} className={`flex items-center justify-between p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                      <div className="flex items-center">
                        <ClockIcon className={`h-5 w-5 mr-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}/>
                        <p>Donated <span className="font-semibold">{d.bloodGroup}</span> blood</p>
                      </div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{formatDate(d.donationDate)}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>No donation history available.</p>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DonorDetailsPage;