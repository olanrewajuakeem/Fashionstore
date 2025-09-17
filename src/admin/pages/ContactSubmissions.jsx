import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const ContactSubmissions = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/admin/login');
      return;
    }

    const fetchSubmissions = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/contact', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setSubmissions(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch submissions');
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [user, isAdmin, navigate]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/contact/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSubmissions(submissions.filter((sub) => sub.id !== id));
      setSelected(null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete submission');
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-600">Loading...</div>;
  if (error && !submissions.length) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Contact & Feedback Submissions</h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Message</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub) => (
              <tr key={sub.id} className="border-b hover:bg-green-50">
                <td className="py-3 px-4">{sub.id}</td>
                <td className="py-3 px-4">{sub.name}</td>
                <td className="py-3 px-4">{sub.email}</td>
                <td className="py-3 px-4 truncate max-w-xs">{sub.message}</td>
                <td className="py-3 px-4 flex gap-2">
                  <button
                    onClick={() => setSelected(sub)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                  >
                    View
                  </button>
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
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Submission Details</h2>
            <p><strong>ID:</strong> {selected.id}</p>
            <p><strong>Name:</strong> {selected.name}</p>
            <p><strong>Email:</strong> {selected.email}</p>
            <p className="mt-2"><strong>Message:</strong></p>
            <p className="bg-gray-100 p-2 rounded mt-1">{selected.message}</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setSelected(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Close
              </button>
              <button
                onClick={() => handleDelete(selected.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactSubmissions;