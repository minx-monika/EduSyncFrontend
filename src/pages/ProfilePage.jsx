import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

const ProfilePage = () => {
  const userId = localStorage.getItem('userId');
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: '' });
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/Users/${userId}`);
        setProfile(res.data);
        setForm({
          name: res.data.name,
          email: res.data.email,
          role: res.data.role
        });
      } catch (err) {
        console.error('Failed to load profile', err);
      }
    };

    if (userId) fetchProfile();
  }, [userId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/Users/${userId}`, {
        userId,
        name: form.name,
        email: form.email,
        role: form.role,
        passwordHash: profile.passwordHash
      });
      setProfile({ ...form, userId, passwordHash: profile.passwordHash });
      setEditMode(false);
      setSuccessMsg('✅ Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile', err);
      alert('Update failed.');
    }
  };

  if (!profile) {
    return <p className="p-6 text-purple-600 dark:text-purple-300">Loading profile...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-100 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl mx-auto bg-white dark:bg-slate-800 shadow-xl rounded-3xl p-8 border border-purple-200 dark:border-slate-700"
      >
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 text-center mb-6">
          My Profile
        </h2>

        {successMsg && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-300 border border-green-300 dark:border-green-700 rounded px-4 py-2 text-sm mb-4"
          >
            {successMsg}
          </motion.p>
        )}

        <AnimatePresence mode="wait">
          {editMode ? (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <form onSubmit={handleUpdate} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                  <input
                    className="w-full px-4 py-2 rounded-lg border border-purple-200 dark:border-slate-600 bg-purple-50 dark:bg-slate-700 text-slate-900 dark:text-white"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 rounded-lg border border-purple-200 dark:border-slate-600 bg-purple-50 dark:bg-slate-700 text-slate-900 dark:text-white"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
                  <input
                    disabled
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                    value={form.role}
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-lg transition shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="static"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4 text-slate-800 dark:text-slate-200"
            >
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Role:</strong> {profile.role}</p>

              <div className="text-center mt-6">
                <button
                  onClick={() => setEditMode(true)}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-lg transition shadow-md"
                >
                  ✏️ Edit Profile
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
