import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';

const EditAssessmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    maxScore: 100,
    questions: '',
    courseId: ''
  });

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [assessmentRes, courseRes] = await Promise.all([
          api.get(`/Assessments/${id}`),
          api.get('/Courses')
        ]);
        setCourses(courseRes.data);
        const a = assessmentRes.data;
        setForm({
          title: a.title,
          maxScore: a.maxScore,
          questions: a.questions,
          courseId: a.courseId
        });
      } catch (err) {
        console.error('Failed to load assessment or courses', err);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      JSON.parse(form.questions); // Validate JSON
      await api.put(`/Assessments/${id}`, form);
      navigate('/assessments');
    } catch (err) {
      alert('❗ Failed to update. Please ensure Questions field is valid JSON.');
      console.error(err);
    }
  };

  return (
    <motion.div
      className="p-6 max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-purple-800 dark:text-white">Edit Assessment</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-purple-700 dark:text-slate-300 mb-1">Title</label>
          <input
            className="w-full px-4 py-2 border border-purple-200 dark:border-slate-600 rounded bg-purple-50 dark:bg-slate-700 dark:text-white"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-700 dark:text-slate-300 mb-1">Questions (JSON)</label>
          <textarea
            className="w-full px-4 py-2 border border-purple-200 dark:border-slate-600 rounded bg-purple-50 dark:bg-slate-700 dark:text-white"
            value={form.questions}
            onChange={(e) => setForm({ ...form, questions: e.target.value })}
            rows={6}
            placeholder="Questions JSON"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-700 dark:text-slate-300 mb-1">Max Score</label>
          <input
            type="number"
            className="w-full px-4 py-2 border border-purple-200 dark:border-slate-600 rounded bg-purple-50 dark:bg-slate-700 dark:text-white"
            value={form.maxScore}
            onChange={(e) => setForm({ ...form, maxScore: e.target.value })}
            placeholder="Max Score"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-700 dark:text-slate-300 mb-1">Course</label>
          <select
            value={form.courseId}
            onChange={(e) => setForm({ ...form, courseId: e.target.value })}
            className="w-full px-4 py-2 border border-purple-200 dark:border-slate-600 rounded bg-purple-50 dark:bg-slate-700 dark:text-white"
            required
          >
            <option value="">-- Select Course --</option>
            {courses.map(c => (
              <option key={c.courseId} value={c.courseId}>{c.title}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded transition font-semibold"
        >
          💾 Save Changes
        </button>
      </form>
    </motion.div>
  );
};

export default EditAssessmentPage;
