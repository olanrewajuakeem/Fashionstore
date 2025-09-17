import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Checkout = () => {
  const { cart, total, error: cartError } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    state: '',
    postalCode: '',
    phoneNumber: '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  console.log('Checkout render:', { cart, total, cartError, user }); // Debug render

  if (!cart) {
    console.log('Cart is undefined or null');
    return <div className="text-center py-12 text-red-500 text-sm sm:text-base">Cart data is unavailable.</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => total || 0;

  const handleCheckout = async () => {
    console.log('handleCheckout called:', { user, cart, shippingAddress }); // Debug checkout

    if (!user) {
      setError('Please log in to proceed.');
      navigate('/login');
      return;
    }
    if (!cart.length) {
      setError('Cart is empty');
      return;
    }

    const { address, city, state, postalCode, phoneNumber } = shippingAddress;
    if (!address || !city || !state || !postalCode || !phoneNumber) {
      setError('Please fill in all shipping address fields');
      return;
    }

    try {
      const orderData = {
        items: cart.map((item) => ({
          product_id: item.product_id || item.id,
          quantity: item.qty,
          price: item.discounted_price || item.price,
        })),
        total: calculateTotal(),
        shipping_address: shippingAddress,
      };

      console.log('Sending order data:', JSON.stringify(orderData, null, 2)); // Debug order data
      console.log('User token:', user?.token); // Debug token

      const response = await axios.post(
        'http://127.0.0.1:5000/api/orders',
        orderData,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      console.log('Order response:', JSON.stringify(response.data, null, 2)); // Debug response

      setMessage('Order placed successfully!');
      setError('');
      localStorage.removeItem('cart');

      const navigationState = {
        orderId: response.data.order_id,
        orderData: {
          items: cart,
          total: calculateTotal(),
          shipping_address: response.data.shipping_address || shippingAddress,
        },
      };

      console.log('Navigating with state:', JSON.stringify(navigationState, null, 2)); // Debug navigation

      navigate('/order-confirmation', { state: navigationState });
    } catch (err) {
      console.error('Checkout error:', err.response?.data || err.message); // Debug error
      setError(
        err.response?.status === 404
          ? 'Order service unavailable. Please try again later.'
          : err.response?.status === 401
          ? 'Session expired. Please log in again.'
          : err.response?.status === 400
          ? err.response.data.message || 'Invalid order data. Please check your cart.'
          : 'Failed to place order. Please try again.'
      );
      if (err.response?.status === 401) {
        setTimeout(() => navigate('/login'), 2000);
      }
      setMessage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Checkout</h1>
      {cartError && <p className="text-red-500 text-center mb-4 text-sm sm:text-base">{cartError}</p>}
      {error && <p className="text-red-500 text-center mb-4 text-sm sm:text-base">{error}</p>}
      {message && <p className="text-green-500 text-center mb-4 text-sm sm:text-base">{message}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">Shipping Address</h2>
          <form className="space-y-4">
            <input
              type="text"
              name="address"
              value={shippingAddress.address}
              onChange={handleInputChange}
              placeholder="Address"
              className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base"
            />
            <input
              type="text"
              name="city"
              value={shippingAddress.city}
              onChange={handleInputChange}
              placeholder="City"
              className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base"
            />
            <input
              type="text"
              name="state"
              value={shippingAddress.state}
              onChange={handleInputChange}
              placeholder="State"
              className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base"
            />
            <input
              type="text"
              name="postalCode"
              value={shippingAddress.postalCode}
              onChange={handleInputChange}
              placeholder="Postal Code"
              className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base"
            />
            <input
              type="text"
              name="phoneNumber"
              value={shippingAddress.phoneNumber}
              onChange={handleInputChange}
              placeholder="Phone Number"
              className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base"
            />
          </form>
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">Order Summary</h2>
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            {cart && cart.length > 0 ? (
              cart.map((item) => (
                <div key={item.id || item.product_id || Math.random()} className="flex justify-between mb-2 text-sm sm:text-base">
                  <span>{item.name || 'N/A'} (x{item.qty || 0})</span>
                  <span>₦{Number((item.discounted_price || item.price || 0) * (item.qty || 0)).toLocaleString()}</span>
                </div>
              ))
            ) : (
              <p className="text-center text-sm sm:text-base">Cart is empty</p>
            )}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold text-sm sm:text-base">
                <span>Total</span>
                <span>₦{Number(total || 0).toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full mt-4 bg-green-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold hover:bg-green-600 transition text-sm sm:text-base"
              disabled={!cart || !cart.length}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;