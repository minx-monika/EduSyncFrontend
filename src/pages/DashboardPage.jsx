import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  ClipboardCheck,
  BarChart2,
  Users,
  LayoutGrid,
  UserCircle,
  Layers,
} from 'lucide-react';

const DashboardPage = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    setName(localStorage.getItem('name') || '');
    setRole(localStorage.getItem('role') || '');
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: 'easeOut',
      },
    }),
  };

  const dashboardCards = {
    Instructor: [
      {
        to: '/courses',
        label: 'Manage Courses',
        gradient: 'from-purple-600 via-indigo-500 to-blue-600',
        icon: <BookOpen size={30} />,
      },
      {
        to: '/assessments',
        label: 'Manage Assessments',
        gradient: 'from-pink-500 via-red-500 to-yellow-500',
        icon: <ClipboardCheck size={30} />,
      },
      {
        to: '/results',
        label: 'View Results',
        gradient: 'from-green-400 via-emerald-500 to-teal-500',
        icon: <BarChart2 size={30} />,
      },
    ],
    Student: [
      {
        to: '/student/courses',
        label: 'Browse Courses',
        gradient: 'from-indigo-400 via-blue-500 to-purple-500',
        icon: <LayoutGrid size={30} />,
      },
      {
        to: '/student/results',
        label: 'My Results',
        gradient: 'from-fuchsia-500 via-pink-500 to-rose-500',
        icon: <BarChart2 size={30} />,
      },
      {
        to: '/profile',
        label: 'My Profile',
        gradient: 'from-cyan-500 via-teal-500 to-blue-500',
        icon: <UserCircle size={30} />,
      },
    ],
  };

  return (
    <motion.div
      className="px-4 py-10 sm:px-6 lg:px-12 max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl font-extrabold text-center mb-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-transparent bg-clip-text drop-shadow-md">
        Welcome, {name || 'User'}!
      </h1>
      <p className="text-center text-lg text-slate-600 dark:text-slate-300 mb-12">
        You are logged in as <strong>{role || '...'}</strong>. Let’s get started!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {(dashboardCards[role] || []).map((item, i) => (
          <motion.div
            key={item.to}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.05 }}
            className="rounded-2xl p-[1px] bg-gradient-to-br from-gray-800 to-gray-200 dark:from-gray-600 dark:to-slate-900"
          >
            <Link
              to={item.to}
              className={`block h-full p-6 rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-lg transition-all duration-300 hover:shadow-2xl relative overflow-hidden`}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-full">
                  {item.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{item.label}</h2>
                  <p className="text-sm opacity-90 mt-1">Click to open</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/5 blur-2xl rounded-full"></div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DashboardPage;
