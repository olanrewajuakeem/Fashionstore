import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Orders = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/orders', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setOrders(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      }
    };

    fetchOrders();
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[80vh] bg-gray-50">
        <p className="text-lg text-gray-600">You must be logged in to view your orders.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Your Orders</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {orders.length === 0 ? (
        <p className="text-gray-600 text-center">No orders found. Start shopping!</p>
      ) : (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          {orders.map((order) => (
            <div key={order.id} className="border-b py-4 last:border-b-0">
              <h2 className="text-lg font-semibold text-gray-800">Order #{order.id}</h2>
              <p className="text-sm text-gray-600">Placed on: {new Date(order.created_at).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600">Status: {order.status}</p>
              <p className="text-sm text-gray-600">Total: ₦{Number(order.total).toLocaleString()}</p>
              <p className="text-sm text-gray-600">Shipping: {order.shipping_address}</p>
              <div className="mt-2">
                <h3 className="text-sm font-semibold text-gray-700">Items:</h3>
                <ul className="list-disc pl-5 text-sm text-gray-600">
                  {order.items.map((item) => (
                    <li key={item.product_id}>
                      {item.product_name} (x{item.quantity}) - ₦{Number(item.price * item.quantity).toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;