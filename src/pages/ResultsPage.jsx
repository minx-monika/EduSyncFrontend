import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';

const ResultsPage = () => {
  const [assessments, setAssessments] = useState([]);
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState('');
  const [loading, setLoading] = useState(false);
  const instructorId = localStorage.getItem('userId');

  useEffect(() => {
    fetchAssessments();
    fetchStudents();
  }, []);

  const fetchAssessments = async () => {
    try {
      const [coursesRes, assessmentsRes] = await Promise.all([
        api.get('/Courses'),
        api.get('/Assessments'),
      ]);

      const instructorCourses = coursesRes.data
        .filter((course) => course.instructorId === instructorId)
        .map((course) => course.courseId);

      const instructorAssessments = assessmentsRes.data.filter((assessment) =>
        instructorCourses.includes(assessment.courseId)
      );

      setAssessments(instructorAssessments);
    } catch (err) {
      console.error('Failed to load assessments or courses', err);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await api.get('/Users');
      setStudents(res.data);
    } catch (err) {
      console.error('Failed to load students', err);
    }
  };

  const fetchResults = async (assessmentId) => {
    try {
      setLoading(true);
      const res = await api.get('/Results');
      const filtered = res.data.filter((r) => r.assessmentId === assessmentId);
      setResults(filtered);
    } catch (err) {
      console.error('Failed to load results', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssessmentChange = (e) => {
    const id = e.target.value;
    setSelectedAssessmentId(id);
    if (id) fetchResults(id);
    else setResults([]);
  };

  return (
    <motion.div
      className="p-6 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-8 text-center">
        Assessment Results
      </h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Select an assessment:
        </label>
        <select
          className="w-full px-4 py-2 border border-purple-200 dark:border-slate-600 rounded-lg bg-purple-50 dark:bg-slate-700 text-slate-800 dark:text-white"
          value={selectedAssessmentId}
          onChange={handleAssessmentChange}
        >
          <option value="">-- Select Assessment --</option>
          {assessments.map((a) => (
            <option key={a.assessmentId} value={a.assessmentId}>
              {a.title}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-slate-600 dark:text-slate-300">⏳ Loading results...</p>
      ) : selectedAssessmentId && results.length === 0 ? (
        <p className="text-center text-slate-500 dark:text-slate-400">
          No results found for this assessment.
        </p>
      ) : results.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="overflow-x-auto bg-white dark:bg-slate-800 border border-purple-100 dark:border-slate-700 rounded-xl shadow-md"
        >
          <table className="table-auto w-full mt-4">
            <thead className="bg-purple-100 dark:bg-slate-700 text-left text-sm text-slate-800 dark:text-slate-200">
              <tr>
                <th className="p-3 border-b dark:border-slate-600">#</th>
                <th className="p-3 border-b dark:border-slate-600">Student Name</th>
                <th className="p-3 border-b dark:border-slate-600">Email</th>
                <th className="p-3 border-b dark:border-slate-600">Score</th>
                <th className="p-3 border-b dark:border-slate-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => {
                const student = students.find((s) => s.userId === r.userId);
                return (
                  <motion.tr
                    key={r.resultId || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-purple-50 dark:hover:bg-slate-700 transition text-sm text-slate-700 dark:text-slate-300"
                  >
                    <td className="p-3 border-t dark:border-slate-600">{i + 1}</td>
                    <td className="p-3 border-t dark:border-slate-600">{student?.fullName || 'Unknown'}</td>
                    <td className="p-3 border-t dark:border-slate-600">{student?.email || 'N/A'}</td>
                    <td className="p-3 border-t dark:border-slate-600 font-semibold">{r.score}</td>
                    <td className="p-3 border-t dark:border-slate-600">
                      {r.attemptDate ? new Date(r.attemptDate).toLocaleString() : 'N/A'}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>
      ) : null}
    </motion.div>
  );
};

export default ResultsPage;
