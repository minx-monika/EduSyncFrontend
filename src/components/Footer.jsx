import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-t border-purple-200 dark:border-slate-700 mt-10 shadow-inner"
    >
      <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-slate-700 dark:text-slate-400">
        <motion.span
          whileHover={{ scale: 1.05 }}
          className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-indigo-400 dark:to-purple-400"
        >
          © {new Date().getFullYear()} EduSync LMS
        </motion.span>{' '}
        — All rights reserved.
      </div>
    </motion.footer>
  );
};

export default Footer;
