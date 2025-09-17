import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/admin/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/orders', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, isAdmin, navigate]);

  if (loading) return <div className="text-center py-12 text-gray-600">Loading...</div>;
  if (error && !orders.length) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Orders</h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Order ID</th>
              <th className="py-3 px-4 text-left">User</th>
              <th className="py-3 px-4 text-left">Total (₦)</th>
              <th className="py-3 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-green-50">
                <td className="py-3 px-4">{order.id}</td>
                <td className="py-3 px-4">{order.user_email}</td>
                <td className="py-3 px-4">₦{Number(order.total).toLocaleString()}</td>
                <td className="py-3 px-4">
                  <span
                    className={`${
                      order.status === 'Completed'
                        ? 'bg-green-500'
                        : order.status === 'Pending'
                        ? 'bg-yellow-400'
                        : 'bg-red-500'
                    } text-white px-2 py-1 rounded text-sm`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;