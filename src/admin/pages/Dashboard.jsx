import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.jsx';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !isAdmin) {
      setError('Admin access required.');
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/admin/stats', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard.');
        setLoading(false);
      }
    };
    fetchStats();
  }, [user, isAdmin]);

  if (loading) return <div className="text-center py-12 text-gray-600">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-green-700">Total Users</h2>
          <p className="text-2xl">{stats.total_users}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-green-700">Total Orders</h2>
          <p className="text-2xl">{stats.total_orders}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-green-700">Total Products</h2>
          <p className="text-2xl">{stats.total_products}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-green-700">Total Revenue</h2>
          <p className="text-2xl">₦{stats.total_revenue.toFixed(2)}</p>
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Orders</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {stats.recent_orders.map((order) => (
          <div key={order.id} className="border-b last:border-b-0 p-4">
            <p className="text-gray-700">
              Order #{order.id} by {order.user_email}: ₦{order.total.toFixed(2)} (
              <span
                className={`${
                  order.status === 'Completed'
                    ? 'text-green-600'
                    : order.status === 'Pending'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}
              >
                {order.status}
              </span>
              )
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;