import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';

const StudentResultsPage = () => {
  const [results, setResults] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resResults = await api.get('/Results');
        const userResults = resResults.data.filter(r => r.userId === userId);
        setResults(userResults);

        const resAssessments = await api.get('/Assessments');
        setAssessments(resAssessments.data);
      } catch (err) {
        console.error('Failed to fetch student results', err);
      }
    };

    fetchData();
  }, [userId]);

  const getAssessment = (assessmentId) =>
    assessments.find(a => a.assessmentId === assessmentId);

  return (
    <motion.div
      className="p-6 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-8 text-center">
        My Results
      </h2>

      {results.length === 0 ? (
        <p className="text-center text-slate-600 dark:text-slate-300">No results found.</p>
      ) : (
        <motion.div
          className="space-y-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          {results.map((r, i) => {
            const assessment = getAssessment(r.assessmentId);
            const title = assessment?.title || 'Unknown Assessment';
            const maxScore = assessment?.maxScore || 100;
            const percentage = Math.round((r.score / maxScore) * 100);
            const isPass = percentage >= 40;

            return (
              <motion.div
                key={r.resultId}
                className="bg-white dark:bg-slate-800 border border-purple-100 dark:border-slate-700 rounded-xl shadow-md p-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">
                    {title}
                  </h3>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      isPass
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    }`}
                  >
                    {isPass ? 'Pass' : 'Fail'}
                  </span>
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 mb-1">
                  Score: <strong>{r.score}</strong> / {maxScore}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  Attempted on: {new Date(r.attemptDate).toLocaleString()}
                </p>

                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.7 }}
                    className={`h-3 rounded-full ${
                      isPass ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
};

export default StudentResultsPage;
