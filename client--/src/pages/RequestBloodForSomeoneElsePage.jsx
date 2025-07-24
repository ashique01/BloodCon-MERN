import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
import {
  ArrowPathIcon, ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';

const RequestBloodForSomeoneElsePage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({ recipientName: '', recipientBloodGroup: '', quantityMl: '', location: '', hospitalName: '', contactPerson: '', contactPhone: '', notes: '' });
  const [loading, setLoading] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const cities = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.recipientName || !formData.recipientBloodGroup || !formData.location || !formData.contactPhone) {
        return toast.error('Please fill all required fields.');
    }
    setLoading(true);
    try {
      await axiosInstance.post('/requests/for-others', formData);
      toast.success('Request submitted successfully!');
      setTimeout(() => navigate('/recent-requests'), 2000);
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
                <h1 className="text-3xl sm:text-4xl font-extrabold">Request Blood For Others</h1>
            </div>
        </header>

        <main className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 sm:p-8 rounded-xl shadow-md`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="recipientName" className="block text-sm font-medium mb-1">Recipient's Name <span className="text-red-500">*</span></label>
                  <input type="text" id="recipientName" name="recipientName" value={formData.recipientName} onChange={handleChange} className={`w-full p-3 border rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`} required/>
                </div>
                <div>
                  <label htmlFor="recipientBloodGroup" className="block text-sm font-medium mb-1">Blood Group <span className="text-red-500">*</span></label>
                  <select id="recipientBloodGroup" name="recipientBloodGroup" value={formData.recipientBloodGroup} onChange={handleChange} className={`w-full p-3 border rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`} required>
                    <option value="">Select...</option>{bloodGroups.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="quantityMl" className="block text-sm font-medium mb-1">Quantity (ml)</label>
                  <input type="number" id="quantityMl" name="quantityMl" value={formData.quantityMl} onChange={handleChange} placeholder="e.g., 450" className={`w-full p-3 border rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}/>
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium mb-1">Location <span className="text-red-500">*</span></label>
                  <select id="location" name="location" value={formData.location} onChange={handleChange} className={`w-full p-3 border rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`} required>
                    <option value="">Select...</option>{cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="hospitalName" className="block text-sm font-medium mb-1">Hospital Name</label>
                  <input type="text" id="hospitalName" name="hospitalName" value={formData.hospitalName} onChange={handleChange} className={`w-full p-3 border rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}/>
                </div>
                <div>
                  <label htmlFor="contactPerson" className="block text-sm font-medium mb-1">Contact Person</label>
                  <input type="text" id="contactPerson" name="contactPerson" value={formData.contactPerson} onChange={handleChange} className={`w-full p-3 border rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}/>
                </div>
                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium mb-1">Contact Phone <span className="text-red-500">*</span></label>
                  <input type="tel" id="contactPhone" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className={`w-full p-3 border rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`} required/>
                </div>
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium mb-1">Notes</label>
              <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows="4" placeholder="(Optional) Add any details..." className={`w-full p-3 border rounded-lg resize-y ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}></textarea>
            </div>
            <div className="flex justify-end pt-4">
              <button type="submit" disabled={loading} className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                {loading && <ArrowPathIcon className="animate-spin h-5 w-5 mr-3"/>}
                {loading ? 'Submitting...' : 'Submit Blood Request'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default RequestBloodForSomeoneElsePage;
