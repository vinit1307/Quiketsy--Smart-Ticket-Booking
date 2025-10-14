import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiKey, FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi';
import axios from 'axios';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(false);

  // OTP Timer Effect
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (otpTimer === 0 && step === 2) {
      setCanResendOtp(true);
    }
  }, [otpTimer, step]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:9192/api/auth/sendOtp', {
        email: formData.email
      });
      
      toast.success('OTP sent to your email!');
      setStep(2);
      setOtpTimer(300); // 5 minutes timer
      setCanResendOtp(false);
    } catch (error) {
      toast.error(error.response?.data || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Validate OTP
  const handleValidateOtp = async (e) => {
    e.preventDefault();
    
    if (formData.otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:9192/api/auth/validate-otp', {
        email: formData.email,
        otp: formData.otp
      });
      
      toast.success('OTP validated successfully!');
      setStep(3);
    } catch (error) {
      toast.error(error.response?.data || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    // Password validations
    if (formData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    // Check for password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(formData.newPassword)) {
      toast.error('Password must contain uppercase, lowercase, number and special character');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:9192/api/auth/reset-password', {
        email: formData.email,
        newPassword: formData.newPassword
      });
      
      toast.success('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setCanResendOtp(false);
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:9192/api/auth/sendOtp', {
        email: formData.email
      });
      
      toast.success('New OTP sent to your email!');
      setOtpTimer(300); // Reset timer to 5 minutes
      setFormData({ ...formData, otp: '' });
    } catch (error) {
      toast.error(error.response?.data || 'Failed to resend OTP. Please try again.');
      setCanResendOtp(true);
    } finally {
      setLoading(false);
    }
  };

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            {step === 1 && <FiMail className="w-8 h-8 text-blue-600" />}
            {step === 2 && <FiKey className="w-8 h-8 text-blue-600" />}
            {step === 3 && <FiLock className="w-8 h-8 text-blue-600" />}
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            {step === 1 && 'Forgot Password'}
            {step === 2 && 'Enter OTP'}
            {step === 3 && 'Reset Password'}
          </h2>
          <p className="text-gray-600 mt-2">
            {step === 1 && 'Enter your email to receive an OTP'}
            {step === 2 && `We've sent a code to ${formData.email}`}
            {step === 3 && 'Create a strong new password'}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              2
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`} />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              3
            </div>
          </div>
        </div>

        {/* Step 1: Email Form */}
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>

            <div className="mt-6 text-center">
              <Link
                to="/signin"
                className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center"
              >
                <FiArrowLeft className="mr-2" />
                Back to Sign In
              </Link>
            </div>
          </form>
        )}

        {/* Step 2: OTP Form */}
        {step === 2 && (
          <form onSubmit={handleValidateOtp}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Enter 6-digit OTP
              </label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                maxLength="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl font-bold tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="000000"
                required
                disabled={loading}
              />
              
              {/* Timer and Resend */}
              <div className="mt-4 text-center">
                {otpTimer > 0 ? (
                  <p className="text-sm text-gray-600">
                    OTP expires in <span className="font-bold text-blue-600">{formatTime(otpTimer)}</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={!canResendOtp || loading}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium disabled:text-gray-400"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Validating...' : 'Verify OTP'}
            </button>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center"
              >
                <FiArrowLeft className="mr-2" />
                Change Email
              </button>
            </div>
          </form>
        )}

        {/* Step 3: New Password Form */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                New Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm new password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="mb-6 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 font-medium mb-2">Password must contain:</p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li className={formData.newPassword.length >= 8 ? 'text-green-600' : ''}>
                  • At least 8 characters
                </li>
                <li className={/[A-Z]/.test(formData.newPassword) ? 'text-green-600' : ''}>
                  • One uppercase letter
                </li>
                <li className={/[a-z]/.test(formData.newPassword) ? 'text-green-600' : ''}>
                  • One lowercase letter
                </li>
                <li className={/\d/.test(formData.newPassword) ? 'text-green-600' : ''}>
                  • One number
                </li>
                <li className={/[@$!%*?&]/.test(formData.newPassword) ? 'text-green-600' : ''}>
                  • One special character
                </li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;