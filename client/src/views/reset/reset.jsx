import React, { useState } from 'react';
import axios from 'axios';
import Input from '../../components/Input.jsx';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate, useParams, Link } from 'react-router-dom';

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  let toastId = null;

  const validateForm = () => {
    toast.dismiss();

    if (!password) {
      toast.error('Password is required.', { duration: 2000 });
      return false;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.', { duration: 2000 });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    toastId = toast.loading('Resetting password...', { duration: 2000 });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/reset-password/${token}`,
        { newPassword: password }
      );

      if (response.data.success) {
        toast.dismiss(toastId);
        toast.success('Password reset successfully!', { duration: 2000 });
        setTimeout(() => navigate('/login'), 1500);
      } else {
        toast.dismiss(toastId);
        toast.error(response.data.message || 'Password reset failed', { duration: 2000 });
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
        <h1 className="text-4xl font-bold text-center text-gray-700 mb-6">Reset Password</h1>
        
        <Input
          label="New Password"
          placeholder="Enter your new password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
        >
          Reset Password
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Back to{' '}
          <Link to="/login" className="text-emerald-800 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default ResetPassword;