import React from 'react';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex justify-between items-center bg-white p-4 shadow rounded mb-6">
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-green-100 transition">
          <FaBell className="text-green-700 text-lg" />
          <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-2 cursor-pointer">
          <FaUserCircle className="text-green-700 text-2xl" />
          <span className="font-medium text-gray-700">Admin</span>
        </div>
        <button
          onClick={handleLogout}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;