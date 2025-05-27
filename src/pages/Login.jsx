import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/Auth/login', { Email: email, Password: password });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user.userId);
      localStorage.setItem('name', res.data.user.name);
      localStorage.setItem('email', res.data.user.email);
      localStorage.setItem('role', res.data.user.role);

      window.location.href = '/dashboard';
    } catch {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-indigo-100 to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-slate-800 shadow-xl rounded-2xl overflow-hidden"
      >
        {/* Left - Welcome Illustration */}
        <div className="hidden md:flex items-center justify-center bg-indigo-100 dark:bg-indigo-900 p-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-indigo-800 dark:text-indigo-300">Welcome Back!</h2>
            <p className="mt-2 text-sm text-indigo-600 dark:text-indigo-200">Learn. Grow. Succeed.</p>
            <img
  src="/login-illustration.png"
  alt="Education Illustration"
  className="mt-6 w-full max-w-xs mx-auto drop-shadow-xl"
/>

          </div>
        </div>

        {/* Right - Login Form */}
        <div className="p-8 sm:p-10">
          <h2 className="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            Login to EduSync
          </h2>

          {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-purple-300 dark:border-slate-600 bg-purple-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-purple-300 dark:border-slate-600 bg-purple-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-2 rounded-lg transition shadow-md"
            >
              🔐 Login
            </button>
          </form>

          <p className="text-sm mt-6 text-center text-slate-600 dark:text-slate-300">
            Don’t have an account?{" "}
            <Link to="/register" className="text-purple-500 hover:underline font-medium">Register here</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
