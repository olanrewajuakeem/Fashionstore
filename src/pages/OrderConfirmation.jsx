import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PaystackPop from '@paystack/inline-js';

const OrderConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [paymentError, setPaymentError] = useState('');

  console.log('OrderConfirmation state:', JSON.stringify(state, null, 2));

  if (!state || !state.orderId || !state.orderData || !state.orderData.items) {
    console.error('Missing state details:', { state });
    return (
      <div className="text-center py-12 text-red-500 text-sm sm:text-base">
        No order details available. Please try placing the order again.
      </div>
    );
  }

  const { orderId, orderData } = state;
  const { items, total, shipping_address } = orderData;

  console.log('Order data:', JSON.stringify({ orderId, items, total, shipping_address }, null, 2));

  const handlePayment = async () => {
    console.log('handlePayment called:', { user, orderId, total });
    if (!user || !user.email || !user.token) {
      setPaymentError('Please log in to proceed with payment.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    try {
      if (!window.PaystackPop) {
        throw new Error('PaystackPop is not available. Ensure the Paystack script is loaded.');
      }
      const paystack = new PaystackPop();
      paystack.newTransaction({
        key: 'pk_test_25956266bc0f94965ca694f7d7dfd6e3de6a9bcc',
        email: user.email,
        amount: Number(total || 0) * 100,
        currency: 'NGN',
        reference: `order_${orderId}_${Date.now()}`,
        metadata: { order_id: orderId },
        onSuccess: async (transaction) => {
          console.log('Paystack payment success:', JSON.stringify(transaction, null, 2));
          try {
            const response = await axios.post(
              'http://127.0.0.1:5000/api/orders/confirm-payment',
              { order_id: orderId, transaction_ref: transaction.reference },
              { headers: { Authorization: `Bearer ${user.token}` } }
            );
            console.log('Payment confirmation response:', JSON.stringify(response.data, null, 2));
            setPaymentStatus('completed');
            setTimeout(() => navigate('/profile'), 2000);
          } catch (err) {
            console.error('Payment verification error:', {
              message: err.message,
              response: err.response?.data,
              status: err.response?.status,
            });
            setPaymentError('Payment verification failed. Please contact support.');
          }
        },
        onCancel: () => {
          setPaymentStatus('cancelled');
          setPaymentError('Payment cancelled. You can try again.');
        },
        onError: (error) => {
          console.error('Paystack error:', error);
          setPaymentError('Payment initiation failed. Please try again.');
        },
      });
    } catch (err) {
      console.error('Paystack initialization error:', {
        message: err.message,
        stack: err.stack,
      });
      setPaymentError('Failed to initiate payment. Please try again.');
    }
  };


  let parsedShippingAddress = {
    address: 'N/A',
    city: 'N/A',
    state: 'N/A',
    postalCode: 'N/A',
    phoneNumber: 'N/A',
  };

  if (shipping_address && typeof shipping_address === 'string') {
    console.log('Parsing shipping_address:', shipping_address);
    const parts = shipping_address.split(', ');
    if (parts.length >= 4) {
      const postalAndPhone = parts[parts.length - 1].split('Phone: ');
      parsedShippingAddress = {
        address: parts[0] || 'N/A',
        city: parts[1] || 'N/A',
        state: parts[2] || 'N/A',
        postalCode: postalAndPhone[0]?.trim() || 'N/A',
        phoneNumber: postalAndPhone[1] || 'N/A',
      };
    } else {
      parsedShippingAddress.address = shipping_address;
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Order Confirmation</h1>
      {paymentError && <p className="text-red-500 text-center mb-4 text-sm sm:text-base">{paymentError}</p>}
      {paymentStatus === 'completed' && (
        <p className="text-green-500 text-center mb-4 text-sm sm:text-base">
          Payment successful! Your order #{orderId} has been processed and will be shipped to{' '}
          {parsedShippingAddress.address}, {parsedShippingAddress.city}. Redirecting to profile...
        </p>
      )}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-green-700 mb-4">Order #{orderId}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Shipping Address</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              {parsedShippingAddress.address}, {parsedShippingAddress.city}, {parsedShippingAddress.state}{' '}
              {parsedShippingAddress.postalCode}
            </p>
            <p className="text-gray-600 text-sm sm:text-base">Phone: {parsedShippingAddress.phoneNumber}</p>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Order Summary</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-green-100 text-gray-800">
                    <th className="py-2 px-3 sm:px-4 text-left text-sm sm:text-base font-semibold">Product</th>
                    <th className="py-2 px-3 sm:px-4 text-left text-sm sm:text-base font-semibold">Price (₦)</th>
                    <th className="py-2 px-3 sm:px-4 text-left text-sm sm:text-base font-semibold">Quantity</th>
                    <th className="py-2 px-3 sm:px-4 text-left text-sm sm:text-base font-semibold">Subtotal (₦)</th>
                  </tr>
                </thead>
                <tbody>
                  {items && Array.isArray(items) && items.length > 0 ? (
                    items.map((item) => {
                      const price = item.discounted_price || item.price || 0;
                      const quantity = item.quantity || item.qty || 0;
                      const itemId = item.id || item.product_id || Math.random();
                      console.log('Item:', { name: item.name, price, quantity, id: itemId });
                      return (
                        <tr key={itemId} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-3 sm:px-4 text-sm sm:text-base">{item.name || 'N/A'}</td>
                          <td className="py-2 px-3 sm:px-4 text-sm sm:text-base">₦{Number(price).toLocaleString()}</td>
                          <td className="py-2 px-3 sm:px-4 text-sm sm:text-base">{quantity}</td>
                          <td className="py-2 px-3 sm:px-4 text-sm sm:text-base">
                            ₦{Number(price * quantity).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-2 px-3 sm:px-4 text-sm sm:text-base text-center">
                        No items available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right">
              <p className="text-lg sm:text-xl font-bold text-gray-800">
                Total: ₦{Number(total || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Payment</h3>
          {paymentStatus === 'pending' ? (
            <button
              onClick={handlePayment}
              className="w-full sm:w-auto bg-green-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold hover:bg-green-600 transition text-sm sm:text-base"
              disabled={!user || !user.email || !user.token}
            >
              Pay with Paystack
            </button>
          ) : paymentStatus === 'completed' ? (
            <p className="text-green-500 text-center text-sm sm:text-base">
              Payment successful! Your order #{orderId} has been processed.
            </p>
          ) : (
            <p className="text-red-500 text-center text-sm sm:text-base">Payment cancelled. Please try again.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;