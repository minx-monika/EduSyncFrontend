import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const syncRole = () => {
      setRole(localStorage.getItem('role') || '');
      setName(localStorage.getItem('name') || '');
    };

    syncRole(); // run initially
    window.addEventListener('storage', syncRole); // multi-tab safety

    return () => window.removeEventListener('storage', syncRole);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-purple-50 dark:bg-slate-800 text-purple-800 dark:text-white shadow px-6 py-3 flex justify-between items-center"
    >
      <div className="text-xl font-bold text-purple-700 dark:text-indigo-300">
        <Link to="/dashboard" className="hover:text-purple-500 transition duration-300">EduSync</Link>
      </div>

      <div className="space-x-4 flex items-center text-sm font-medium">
        {role === 'Instructor' && (
          <>
            <Link to="/dashboard" className="hover:text-purple-500 transition">Dashboard</Link>
            <Link to="/courses" className="hover:text-purple-500 transition">Courses</Link>
            <Link to="/assessments" className="hover:text-purple-500 transition">Assessments</Link>
            <Link to="/results" className="hover:text-purple-500 transition">Results</Link>
          </>
        )}

        {role === 'Student' && (
          <>
            <Link to="/dashboard" className="hover:text-purple-500 transition">Dashboard</Link>
            <Link to="/student/courses" className="hover:text-purple-500 transition">Courses</Link>
            <Link to="/student/results" className="hover:text-purple-500 transition">My Results</Link>
          </>
        )}

        <Link to="/profile" className="hover:text-purple-500 transition">Profile</Link>

        {name && (
          <button
            onClick={handleLogout}
            className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
          >
            Logout
          </button>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
