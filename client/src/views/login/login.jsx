import React, { useState } from 'react';
import axios from 'axios';
import Input from '../../components/Input.jsx';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate ,Link} from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value ,[password]: value });
  };

  const validateForm = () => {
    const { email, password } = formData;
    if (!email || !password) {
      toast.error('All fields are required.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Invalid email format.');
      return false;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return false;
    }
    return true;
  };

  const formSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axios.post('http://localhost:5220/login', formData);

      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('authToken', token); 
        localStorage.setItem('user', JSON.stringify(user));

        toast.success('Login successful! 🎉');
        setFormData({ email: '', password: '' });

        setTimeout(() => {
          navigate('/dashboard'); 
        }, 2000);
      } else {
        toast.error(response.data.message || 'Login failed.');
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'An error occurred. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-emerald-900 via-teal-700 to-emerald-900">
      <Toaster position="top-center" reverseOrder={false} />

      <form onSubmit={formSubmit} className="bg-white shadow-md rounded-lg p-8 w-[400px]">
        <h1 className="text-4xl font-bold text-center text-gray-700 mb-6">
          Login
        </h1>
        <Input
          label="Email"
          placeholder="Enter your email"
          name="email"
          type="email"
          value={formData.email}
          onChange={inputChange}
        />
        <Input
          label="Password"
          placeholder="Enter your password"
          name="password"
          type="password"
          value={formData.password}
          onChange={inputChange}
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
