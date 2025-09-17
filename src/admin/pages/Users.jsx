import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/admin/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/users', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, isAdmin, navigate]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(users.filter((u) => u.id !== id));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-600">Loading...</div>;
  if (error && !users.length) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Users</h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-green-50">
                <td className="py-3 px-4">{user.id}</td>
                <td className="py-3 px-4">{user.username}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;