import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: 'Admin', email: user?.email || 'admin@example.com' });
  const [password, setPassword] = useState({ current: '', new: '', confirm: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/admin/login');
      return;
    }
  }, [user, isAdmin, navigate]);

  const handleProfileChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handlePasswordChange = (e) => setPassword({ ...password, [e.target.name]: e.target.value });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        'http://127.0.0.1:5000/api/users/profile',
        { username: profile.name, email: profile.email },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setMessage('Profile updated successfully');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      setMessage('');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      setError('New password and confirm password do not match');
      setMessage('');
      return;
    }
    try {
      await axios.put(
        'http://127.0.0.1:5000/api/users/password',
        { current_password: password.current, new_password: password.new },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setMessage('Password updated successfully');
      setError('');
      setPassword({ current: '', new: '', confirm: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
      setMessage('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Settings</h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {message && <p className="text-green-500 mb-4 text-center">{message}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-green-700 mb-4">Admin Profile</h2>
          <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
              placeholder="Name"
              className="border px-3 py-2 rounded focus:ring-2 focus:ring-green-500"
            />
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
              placeholder="Email"
              className="border px-3 py-2 rounded focus:ring-2 focus:ring-green-500"
            />
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
              Update Profile
            </button>
          </form>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-green-700 mb-4">Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              name="current"
              value={password.current}
              onChange={handlePasswordChange}
              placeholder="Current Password"
              className="border px-3 py-2 rounded focus:ring-2 focus:ring-green-500"
            />
            <input
              type="password"
              name="new"
              value={password.new}
              onChange={handlePasswordChange}
              placeholder="New Password"
              className="border px-3 py-2 rounded focus:ring-2 focus:ring-green-500"
            />
            <input
              type="password"
              name="confirm"
              value={password.confirm}
              onChange={handlePasswordChange}
              placeholder="Confirm New Password"
              className="border px-3 py-2 rounded focus:ring-2 focus:ring-green-500"
            />
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;