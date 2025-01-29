import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Signup from './views/signup/signup.jsx';
import Login from './views/login/login.jsx';
import ForgotPassword from './views/forgot/forgot.jsx';
import ResetPassword from './views/reset/reset.jsx';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/ForgotPassword" element={<ForgotPassword />} />
      <Route path="/ResetPassword" element={<ResetPassword />} />
      <Route path="/*" element={<p>404</p>} />
    </Routes>
  </Router>
);
