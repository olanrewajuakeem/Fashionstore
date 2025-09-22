import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Checkout = () => {
  const { cart, total, error: cartError, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    state: '',
    postal_code: '',
    phone_number: '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState([]);

  useEffect(() => {
    if (user && user.token) {
      axios
        .get('http://127.0.0.1:5000/api/addresses', {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((response) => {
          console.log('Fetched addresses:', JSON.stringify(response.data, null, 2));
          const defaultAddress = response.data.find((addr) => addr.is_default);
          if (defaultAddress) {
            setShippingAddress({
              address: defaultAddress.address || '',
              city: defaultAddress.city || '',
              state: defaultAddress.state || '',
              postal_code: defaultAddress.postal_code || '',
              phone_number: defaultAddress.phone_number || user.phone || '',
            });
            console.log('Set default address:', defaultAddress);
          } else {
            setShippingAddress((prev) => ({
              ...prev,
              phone_number: user.phone || '',
            }));
            console.log('No default address found, using user phone:', user.phone);
          }
        })
        .catch((err) => {
          console.error('Failed to fetch addresses:', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
          });
          setError('Failed to load default address. Please enter manually.');
        });
    }
  }, [user]);

  console.log('Checkout render:', { cart, total, cartError, user, shippingAddress });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleAddressSearch = async (query) => {
    if (!query || query.length < 3) {
      setAddressSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: query,
          format: 'json',
          addressdetails: 1,
          limit: 5,
        },
      });
      setAddressSuggestions(response.data);
    } catch (err) {
      console.error('Failed to fetch address suggestions:', {
        message: err.message,
        response: err.response?.data,
      });
      setError('Failed to fetch address suggestions.');
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    setShippingAddress({
      address: suggestion.address?.road || suggestion.display_name.split(',')[0] || '',
      city: suggestion.address?.city || suggestion.address?.town || suggestion.address?.village || '',
      state: suggestion.address?.state || '',
      postal_code: suggestion.address?.postcode || '',
      phone_number: shippingAddress.phone_number || user.phone || '',
    });
    setAddressSuggestions([]);
  };

  const calculateTotal = () => total || 0;

  const handleCheckout = async () => {
    console.log('handleCheckout called:', { user, cart, shippingAddress });

    if (!user) {
      setError('Please log in to proceed.');
      navigate('/login');
      return;
    }

    if (!cart || !cart.length) {
      setError('Your cart is empty.');
      return;
    }

    const { address, city, state, postal_code, phone_number } = shippingAddress;
    if (!address || !city || !state || !postal_code || !phone_number) {
      console.error('Missing shipping address fields:', { address, city, state, postal_code, phone_number });
      setError('Please fill in all shipping address fields.');
      return;
    }

    try {
      const orderData = {
        items: cart.map((item) => {
          const product_id = item.product_id || item.id;
          const quantity = item.qty;
          const price = item.discounted_price || item.price;
          if (!product_id || !quantity || !price) {
            throw new Error(`Invalid item data: ${JSON.stringify(item)}`);
          }
          return { product_id, quantity, price };
        }),
        total: calculateTotal(),
        shipping_address: {
          address,
          city,
          state,
          postalCode: postal_code,
          phoneNumber: phone_number,
        },
      };

      console.log('Sending order data:', JSON.stringify(orderData, null, 2));
      console.log('User token:', user?.token);

      const response = await axios.post(
        'http://127.0.0.1:5000/api/orders',
        orderData,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      console.log('Raw axios response:', {
        status: response.status,
        data: JSON.stringify(response.data, null, 2),
        headers: response.headers,
      });

      if (response.status === 201) {
        setMessage('Order placed successfully!');
        setError('');
        clearCart();
        localStorage.removeItem('cart');

        const navigationState = {
          orderId: response.data.order_id,
          orderData: {
            items: cart,
            total: calculateTotal(),
            shipping_address: response.data.shipping_address, 
          },
        };

        console.log('Navigating with state:', JSON.stringify(navigationState, null, 2));
        navigate('/order-confirmation', { state: navigationState });
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (err) {
      console.error('Checkout error:', {
        message: err.message,
        response: err.response ? {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers,
        } : null,
        stack: err.stack,
      });

      setError(
        err.response?.status === 404
          ? 'Order service unavailable. Please try again later.'
          : err.response?.status === 401
          ? 'Session expired. Please log in again.'
          : err.response?.data?.message || 'Failed to place order. Please try again.'
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
            <div className="relative">
              <input
                type="text"
                name="address"
                value={shippingAddress.address}
                onChange={(e) => {
                  handleInputChange(e);
                  handleAddressSearch(e.target.value);
                }}
                placeholder="Address"
                className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base"
              />
              {addressSuggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border rounded-lg w-full mt-1 max-h-40 overflow-y-auto">
                  {addressSuggestions.map((suggestion) => (
                    <li
                      key={suggestion.place_id}
                      onClick={() => handleSuggestionSelect(suggestion)}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {suggestion.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
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
              name="postal_code"
              value={shippingAddress.postal_code}
              onChange={handleInputChange}
              placeholder="Postal Code"
              className="w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base"
            />
            <input
              type="text"
              name="phone_number"
              value={shippingAddress.phone_number}
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
                <div
                  key={item.id || item.product_id || Math.random()}
                  className="flex justify-between mb-2 text-sm sm:text-base"
                >
                  <span>{item.name || 'N/A'} (x{item.qty || 0})</span>
                  <span>
                    ₦{Number((item.discounted_price || item.price || 0) * (item.qty || 0)).toLocaleString()}
                  </span>
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