import React, { useState } from 'react';
import Input from '../../components/Input.jsx';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  let toastId = null;

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const { email, password } = formData;

    toast.dismiss();

    if (!email || !password) {
      toast.error('All fields are required.', { duration: 2000 });
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Invalid email format.', { duration: 2000 });
      return false;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.', { duration: 2000 });
      return false;
    }
    return true;
  };

  const formSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    toast.dismiss();

    if (!toastId) {
      toastId = toast.loading('Logging in...', { duration: 2000 });
    }

    try {
      const response = await api.post('/auth/login', formData);
      console.log(response,"response");
      if (response.data.success) {
        const { token, userResponse } = response.data;
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(userResponse));
        console.log(token, user);

        toast.dismiss(toastId);
        toast.success('Login successful! 🎉', { duration: 2000 });

        setFormData({ email: '', password: '' });

        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        toast.dismiss(toastId);
        toast.error(response.data.message || 'Login failed.', { duration: 2000 });
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(error.response?.data?.message || 'An error occurred. Please try again.', {
        duration: 2000,
      });
    } finally {
      toastId = null;
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-emerald-900 via-teal-700 to-emerald-900">
      <Toaster position="top-center" reverseOrder={false} />

      <form onSubmit={formSubmit} className="bg-white shadow-md rounded-lg p-8 w-[400px]">
        <h1 className="text-4xl font-bold text-center text-gray-700 mb-6">Login</h1>
        <Input
          label="Email"
          placeholder="Enter your email"
          name="email"
          type="email"
          value={formData.email}
          onChange={inputChange}
          autoComplete="username"


        />
        <Input
          label="Password"
          placeholder="Enter your password"
          name="password"
          type="password"
          value={formData.password}
          onChange={inputChange}
          autoComplete="current-password"
        />
        <button
          type="submit"
          className="w-full bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
        >
          Log In
        </button>
        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-800 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
