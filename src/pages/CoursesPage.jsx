import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', mediaUrl: '' });
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [relatedAssessments, setRelatedAssessments] = useState([]);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const res = await api.get('/Courses');
      setCourses(res.data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const fetchAssessmentsForCourse = async (courseId) => {
    try {
      const res = await api.get('/Assessments');
      const filtered = res.data.filter(a => a.courseId === courseId);
      setRelatedAssessments(filtered);
    } catch (err) {
      console.error('Failed to fetch assessments for course', err);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, instructorId: localStorage.getItem('userId') };
      await api.post('/Courses', payload);
      setForm({ title: '', description: '', mediaUrl: '' });
      fetchCourses();
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course. Check console.');
    }
  };

  const handleOpenDeleteDialog = async (course) => {
    setSelectedCourse(course);
    await fetchAssessmentsForCourse(course.courseId);
    setShowModal(true);
  };

  const handleDeleteAssessment = async (assessmentId) => {
    try {
      const results = await api.get('/Results');
      const linkedResults = results.data.filter(r => r.assessmentId === assessmentId);

      if (linkedResults.length > 0) {
        alert('❌ This assessment has student results and cannot be deleted.\nPlease remove related results first.');
        return;
      }

      await api.delete(`/Assessments/${assessmentId}`);
      const updated = relatedAssessments.filter(a => a.assessmentId !== assessmentId);
      setRelatedAssessments(updated);
    } catch (err) {
      console.error('Failed to delete assessment', err);
      alert('Server error. Could not delete assessment.');
    }
  };

  const handleDeleteCourse = async () => {
    try {
      await api.delete(`/Courses/${selectedCourse.courseId}`);
      setShowModal(false);
      setSelectedCourse(null);
      fetchCourses();
    } catch (err) {
      console.error('Failed to delete course', err);
      alert('Error deleting course. See console.');
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <motion.div className="p-6 max-w-6xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
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
        <input type="text" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full px-4 py-2 rounded border border-purple-200 dark:border-slate-600 dark:bg-slate-700 text-slate-900 dark:text-white" required />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-4 py-2 rounded border border-purple-200 dark:border-slate-600 dark:bg-slate-700 text-slate-900 dark:text-white" />
        <input type="text" placeholder="Media URL" value={form.mediaUrl} onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })}
          className="w-full px-4 py-2 rounded border border-purple-200 dark:border-slate-600 dark:bg-slate-700 text-slate-900 dark:text-white" />
        <button type="submit" className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-5 py-2.5 rounded-md font-semibold transition shadow-md">
          ➕ Create Course
        </button>
      </motion.form>

      {/* Course Cards */}
      {courses.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-slate-300">No courses found.</p>
      ) : (
        <motion.div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
          {courses.map((course) => (
            <motion.div key={course.courseId} className="bg-white dark:bg-slate-800 p-5 border border-purple-100 dark:border-slate-700 rounded-2xl shadow-lg hover:shadow-xl transition-all" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <h4 className="text-lg font-semibold text-purple-700 dark:text-purple-300">{course.title}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{course.description || 'No description'}</p>
              {course.mediaUrl && (
                <a href={course.mediaUrl} className="text-sm text-purple-500 hover:underline transition" target="_blank" rel="noopener noreferrer">📺 View Media</a>
              )}
              <div className="mt-4 flex justify-between">
                <button onClick={() => navigate(`/courses/edit/${course.courseId}`)}
                  className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded shadow transition">
                  ✏️ Edit
                </button>
                <button onClick={() => handleOpenDeleteDialog(course)}
                  className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow transition">
                  🗑 Delete
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Delete Modal */}
      {showModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-full max-w-lg shadow-xl border border-purple-200 dark:border-slate-700">
            <h3 className="text-xl font-bold mb-4 text-purple-800 dark:text-white">
              Delete Course: {selectedCourse.title}
            </h3>
            {relatedAssessments.length > 0 ? (
              <>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                  Please delete the following assessments before removing this course:
                </p>
                <ul className="space-y-2">
                  {relatedAssessments.map((a) => (
                    <li key={a.assessmentId} className="flex justify-between items-center text-slate-800 dark:text-white bg-purple-50 dark:bg-slate-700 p-2 rounded">
                      {a.title}
                      <button onClick={() => handleDeleteAssessment(a.assessmentId)} className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition">
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <p className="text-green-600 dark:text-green-300 mb-4">✅ All assessments deleted. You can now delete the course.</p>
                <button onClick={handleDeleteCourse} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition font-medium">
                  Confirm Delete Course
                </button>
              </>
            )}
            <div className="text-right mt-6">
              <button onClick={() => setShowModal(false)} className="text-sm text-slate-600 hover:text-red-600">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CoursesPage;
