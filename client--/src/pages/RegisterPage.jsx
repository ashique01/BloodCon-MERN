import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import {
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', bloodGroup: '', dob: '', city: '', address: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const cities = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = ['name', 'email', 'password', 'phone', 'bloodGroup', 'dob', 'city'];
    if (requiredFields.some(field => !formData[field])) {
        return toast.error('Please fill all required fields.');
    }
    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/users/register', formData);
      login(data, data.token);
      toast.success('Registration successful! Redirecting...');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
        <div className="max-w-lg w-full">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Become a Lifesaver</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">Create your account to start donating and requesting blood.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Full Name <span className="text-red-500 dark:text-red-400">*</span></label><input type="text" name="name" onChange={handleChange} className="mt-1 w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white" required/></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email Address <span className="text-red-500 dark:text-red-400">*</span></label><input type="email" name="email" onChange={handleChange} className="mt-1 w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white" required/></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Password <span className="text-red-500 dark:text-red-400">*</span></label><input type="password" name="password" onChange={handleChange} className="mt-1 w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white" required/></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Phone <span className="text-red-500 dark:text-red-400">*</span></label><input type="tel" name="phone" onChange={handleChange} className="mt-1 w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white" required/></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Blood Group <span className="text-red-500 dark:text-red-400">*</span></label><select name="bloodGroup" onChange={handleChange} className="mt-1 w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white" required><option value="">Select...</option>{bloodGroups.map(g => <option key={g} value={g}>{g}</option>)}</select></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Date of Birth <span className="text-red-500 dark:text-red-400">*</span></label><input type="date" name="dob" onChange={handleChange} className="mt-1 w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white" required/></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-200">City <span className="text-red-500 dark:text-red-400">*</span></label><select name="city" onChange={handleChange} className="mt-1 w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white" required><option value="">Select...</option>{cities.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Address</label><input type="text" name="address" onChange={handleChange} className="mt-1 w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"/></div>
                    <div className="md:col-span-2">
                        <button type="submit" disabled={loading} className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition disabled:bg-red-400">
                            {loading && <ArrowPathIcon className="animate-spin h-5 w-5 mr-2"/>}
                            {loading ? 'Registering...' : 'Create Account'}
                        </button>
                    </div>
                </form>
            </div>
            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
                Already have an account? <Link to="/login" className="font-medium text-red-600 hover:text-red-500">Log in here</Link>
            </p>
        </div>
    </div>
  );
};

export default RegisterPage;