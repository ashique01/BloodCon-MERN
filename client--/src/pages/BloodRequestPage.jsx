import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
import {
  ArrowPathIcon, ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const BloodRequestPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({ bloodGroupNeeded: '', city: '', hospitalName: '', message: '' });
  const [loading, setLoading] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const cities = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('You must be logged in to submit a request.');
    if (!formData.bloodGroupNeeded || !formData.city) return toast.error('Please fill all required fields.');

    setLoading(true);
    try {
      await axiosInstance.post('/requests', formData);
      toast.success('Blood request submitted successfully!');
      setTimeout(() => navigate('/recent-requests'), 2000);
      setFormData({ bloodGroupNeeded: '', city: '', hospitalName: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-8">
            <div className="flex items-center">
                <button onClick={() => navigate(-1)} className={`p-2 rounded-full mr-3 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}>
                    <ArrowLeftIcon className="h-6 w-6"/>
                </button>
                <h1 className="text-3xl sm:text-4xl font-extrabold">Request Blood</h1>
            </div>
        </header>

        <main className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 sm:p-8 rounded-xl shadow-md`}>
          {!user ? (
            <div className={`text-center p-8 rounded-lg border ${theme === 'dark' ? 'bg-gray-700/50 border-blue-400' : 'bg-blue-50 border-blue-200'}`}>
              <h3 className={`font-bold text-xl mb-3 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-800'}`}>Please Log In to Request Blood</h3>
              <p className="mb-6">You need to be logged in to submit a blood request. Join our community to help save lives!</p>
              <div className="flex justify-center space-x-4">
                <Link to="/login" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md">Login</Link>
                <Link to="/register" className={`px-6 py-3 rounded-lg font-semibold transition-colors shadow-md ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}>Register</Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <p className="font-semibold">Requesting as: {user.name}</p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Your contact information will be shared with potential donors.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="bloodGroupNeeded" className="block text-sm font-medium mb-1">Blood Group Needed <span className="text-red-500">*</span></label>
                        <select id="bloodGroupNeeded" name="bloodGroupNeeded" value={formData.bloodGroupNeeded} onChange={handleChange} className={`w-full p-3 border rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`} required>
                        <option value="">Select...</option>{bloodGroups.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium mb-1">City <span className="text-red-500">*</span></label>
                        <select id="city" name="city" value={formData.city} onChange={handleChange} className={`w-full p-3 border rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`} required>
                        <option value="">Select...</option>{cities.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label htmlFor="hospitalName" className="block text-sm font-medium mb-1">Hospital Name</label>
                    <input type="text" id="hospitalName" name="hospitalName" value={formData.hospitalName} onChange={handleChange} placeholder="e.g., Dhaka Medical College" className={`w-full p-3 border rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}/>
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                    <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows="4" placeholder="Add any additional details..." className={`w-full p-3 border rounded-lg resize-y ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}></textarea>
                </div>
              
              <div className="flex justify-end pt-4">
                <button type="submit" disabled={loading} className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading && <ArrowPathIcon className="animate-spin h-5 w-5 mr-3"/>}
                  {loading ? 'Submitting...' : 'Submit Blood Request'}
                </button>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
};

export default BloodRequestPage;