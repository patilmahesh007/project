import React, { useState } from 'react';
import axios from 'axios';
import Input from '../../components/Input.jsx';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  let toastId = null;

  const validateForm = () => {
    toast.dismiss();

    if (!email) {
      toast.error('Email is required.', { duration: 2000 });
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Invalid email format.', { duration: 2000 });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    toastId = toast.loading('Sending reset link...', { duration: 2000 });

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/forgot-password`, { email });

      if (response.data.success) {
        toast.dismiss(toastId);
        toast.success('Reset link sent to your email!', { duration: 2000 });
        setEmail('');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        toast.dismiss(toastId);
        toast.error(response.data.message || 'Failed to send reset link', { duration: 2000 });
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(error.response?.data?.message || 'An error occurred. Please try again.', {
        duration: 2000,
      });
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-emerald-900 via-teal-700 to-emerald-900">
      <Toaster position="top-center" reverseOrder={false} />

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 w-[400px]">
        <h1 className="text-4xl font-bold text-center text-gray-700 mb-6">Forgot Password</h1>
        
        <Input
          label="Email"
          placeholder="Enter your registered email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
        >
          Send Reset Link
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Remember your password?{' '}
          <Link to="/login" className="text-emerald-800 hover:underline">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}

export default ForgotPassword;