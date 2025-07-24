import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from 'react-toastify';
import { ArrowPathIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return toast.error('Please enter both email and password.');
    
    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/users/login", formData);
      login(data, data.token);
      toast.success('Login successful! Redirecting...');
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">Log in to continue your life-saving journey.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email Address</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"/>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required className="mt-1 w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"/>
                    </div>
                    <button type="submit" disabled={loading} className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition disabled:bg-red-400">
                        {loading && <ArrowPathIcon className="animate-spin h-5 w-5 mr-2"/>}
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
                Don't have an account? <Link to="/register" className="font-medium text-red-600 hover:text-red-500">Register here</Link>
            </p>
        </div>
    </div>
  );
};

export default LoginPage;