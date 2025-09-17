import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const NewsletterSubmissions = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/admin/login');
      return;
    }

    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/newsletter', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setSubscriptions(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch subscriptions');
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [user, isAdmin, navigate]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/newsletter/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete subscription');
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-600">Loading...</div>;
  if (error && !subscriptions.length) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Newsletter Subscriptions</h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr key={sub.id} className="border-b hover:bg-green-50">
                <td className="py-3 px-4">{sub.id}</td>
                <td className="py-3 px-4">{sub.email}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleDelete(sub.id)}
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

export default NewsletterSubmissions;