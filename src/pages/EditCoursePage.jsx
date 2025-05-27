import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';

const EditCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const instructorId = localStorage.getItem('userId');

  const [form, setForm] = useState({
    title: '',
    description: '',
    mediaUrl: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/Courses/${id}`);
        const { title, description, mediaUrl } = res.data;
        setForm({ title, description, mediaUrl });
      } catch (err) {
        console.error('Failed to load course', err);
        setError('Failed to load course. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/Courses/${id}`, { ...form, instructorId });
      navigate('/courses');
    } catch (err) {
      console.error('Failed to update course', err);
      setError('Update failed. Please try again.');
    }
  };

  if (loading) {
    return <p className="p-6 text-slate-600 dark:text-slate-300">Loading...</p>;
  }

  return (
    <motion.div
      className="bg-white dark:bg-slate-800 shadow-lg p-6 rounded-2xl max-w-xl mx-auto mt-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
        Edit Course
      </h2>

      {error && (
        <p className="mb-4 text-red-600 dark:text-red-400 text-sm">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
          <input
            name="title"
            className="w-full px-4 py-2 border border-purple-200 dark:border-slate-600 rounded bg-purple-50 dark:bg-slate-700 dark:text-white"
            required
            value={form.title}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
          <textarea
            name="description"
            rows={4}
            className="w-full px-4 py-2 border border-purple-200 dark:border-slate-600 rounded bg-purple-50 dark:bg-slate-700 dark:text-white"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Media URL</label>
          <input
            name="mediaUrl"
            className="w-full px-4 py-2 border border-purple-200 dark:border-slate-600 rounded bg-purple-50 dark:bg-slate-700 dark:text-white"
            value={form.mediaUrl}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white py-2 rounded-lg transition"
        >
          Save Changes
        </button>
      </form>
    </motion.div>
  );
};

export default EditCoursePage;
