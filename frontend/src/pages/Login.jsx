import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon, AcademicCapIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function StudentLogin() {
  const { login, user } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    loginId: '', // This can be email or student ID
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginType, setLoginType] = useState('studentId'); // 'studentId' or 'email'

  if (user) navigate('/');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Login ID validation based on type
    if (!formData.loginId.trim()) {
      newErrors.loginId = loginType === 'studentId' 
        ? 'Student ID is required' 
        : 'Email is required';
    } else if (loginType === 'studentId' && !/^GUL\d{6}$/.test(formData.loginId.toUpperCase())) {
      newErrors.loginId = 'Student ID must be in format: GUL123456';
    } else if (loginType === 'email') {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.loginId)) {
        newErrors.loginId = 'Please enter a valid email address';
      }
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);

      try {
        // Prepare login data based on login type
        const loginData = {
          password: formData.password
        };

        // Add the correct identifier field based on login type
        if (loginType === 'studentId') {
          loginData.studentId = formData.loginId.toUpperCase();
        } else {
          loginData.email = formData.loginId.toLowerCase();
        }
 
        const response = await axios.post('/api/auth/login', loginData);
        
        login(response.data.user, response.data.expiresIn);
        
        
        toast.success(response.data.message || 'Login successful!');
        navigate('/voting');
        
        // Reset form
        setFormData({ loginId: '', password: '' });
        setErrors({});
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Login failed';
        toast.error(errorMessage);
        setErrors({ submit: errorMessage });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(formErrors);
    }
  };

  const toggleLoginType = () => {
    const newType = loginType === 'studentId' ? 'email' : 'studentId';
    setLoginType(newType);
    setFormData({ ...formData, loginId: '' });
    setErrors({});
  };

  const getLoginPlaceholder = () => {
    return loginType === 'studentId' ? 'e.g. GUL123456' : 'e.g. user@example.com';
  };

  const getLoginLabel = () => {
    return loginType === 'studentId' ? 'Student ID' : 'Email Address';
  };

  const getLoginIcon = () => {
    return loginType === 'studentId' ? 
      <AcademicCapIcon className="h-5 w-5 text-gray-400" /> : 
      <EnvelopeIcon className="h-5 w-5 text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <AcademicCapIcon className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">
            {loginType === 'studentId' ? 'Student Portal' : 'Admin Portal'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {loginType === 'studentId' 
              ? 'Sign in with your Student ID' 
              : 'Sign in with your Email'
            }
          </p>
        </div>

        {/* Login Type Toggle */}
        <div className="flex items-center justify-center">
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button
              type="button"
              onClick={() => loginType !== 'studentId' && toggleLoginType()}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                loginType === 'studentId'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Student Login
            </button>
            <button
              type="button"
              onClick={() => loginType !== 'email' && toggleLoginType()}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                loginType === 'email'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Admin Login
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Dynamic Login ID Field */}
            <div>
              <label htmlFor="loginId" className="block text-sm font-medium text-gray-700">
                {getLoginLabel()}
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {getLoginIcon()}
                </div>
                <input
                  id="loginId"
                  name="loginId"
                  type="text"
                  placeholder={getLoginPlaceholder()}
                  value={formData.loginId}
                  onChange={handleChange}
                  className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                    errors.loginId ? 'border-red-300' : 'border-gray-300'
                  } rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.loginId && (
                  <p className="mt-1 text-sm text-red-600">{errors.loginId}</p>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none block w-full pl-10 pr-10 py-3 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </div>
          </div>

          {errors.submit && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{errors.submit}</p>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isSubmitting 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                `Sign in as ${loginType === 'studentId' ? 'Student' : 'Admin'}`
              )}
            </button>
          </div>
        </form>

        {/* Additional Links */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/contact-us" className="font-medium text-blue-600 hover:text-blue-500">
              Contact administration
            </Link>
          </p>
        </div>

        {/* Demo Credentials Hint */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 text-center">
            {loginType === 'studentId' 
              ? 'Demo Student: Student ID: GUL123456, Password: [Auto-generated]' 
              : 'Demo Admin: Use registered email and password'
            }
          </p>
        </div>
      </div>
    </div>
  );
}