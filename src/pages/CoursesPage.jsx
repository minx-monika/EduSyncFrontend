import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    mediaUrl: '',
  });

  const fetchCourses = async () => {
    try {
      const res = await api.get('/Courses');
      setCourses(res.data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        instructorId: localStorage.getItem('userId'),
      };

      await api.post('/Courses', payload);
      setForm({ title: '', description: '', mediaUrl: '' });
      fetchCourses();
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course. Check console.');
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <motion.div
      className="p-6 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 text-center">
        Manage Courses
      </h2>

      {/* Create Course Form */}
      <motion.form
        onSubmit={handleCreateCourse}
        className="space-y-4 mb-12 bg-gradient-to-br from-white via-purple-50 to-indigo-100 dark:from-slate-800 dark:to-slate-700 p-6 rounded-xl shadow-lg border dark:border-slate-700"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h3 className="text-xl font-semibold mb-2 text-purple-700 dark:text-purple-300">Create New Course</h3>
        <input
          type="text"
          placeholder="Title"
          className="w-full px-4 py-2 rounded border border-purple-200 dark:border-slate-600 dark:bg-slate-700 text-slate-900 dark:text-white"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          className="w-full px-4 py-2 rounded border border-purple-200 dark:border-slate-600 dark:bg-slate-700 text-slate-900 dark:text-white"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Media URL"
          className="w-full px-4 py-2 rounded border border-purple-200 dark:border-slate-600 dark:bg-slate-700 text-slate-900 dark:text-white"
          value={form.mediaUrl}
          onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })}
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-5 py-2.5 rounded-md font-semibold transition shadow-md"
        >
          ➕ Create Course
        </button>
      </motion.form>

      {/* Course Cards */}
      {courses.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-slate-300">No courses found.</p>
      ) : (
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {courses.map((course) => (
            <motion.div
              key={course.courseId}
              className="bg-white dark:bg-slate-800 p-5 border border-purple-100 dark:border-slate-700 rounded-2xl shadow-lg hover:shadow-xl transition-all"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h4 className="text-lg font-semibold text-purple-700 dark:text-purple-300">{course.title}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                {course.description || 'No description'}
              </p>
              {course.mediaUrl && (
                <a
                  href={course.mediaUrl}
                  className="text-sm text-purple-500 hover:underline transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📺 View Media
                </a>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default CoursesPage;
