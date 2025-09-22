import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaUser, FaHeart, FaShoppingCart, FaLock, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';

const MyProfile = () => {
  const { user, logout, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [password, setPassword] = useState({ current_password: '', new_password: '' });
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    address: '',
    city: '',
    state: '',
    postal_code: '',
    phone_number: '',
    is_default: false,
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState([]);

  useEffect(() => {
    if (!user || !user.token || !setUser) {
      setError('You must be logged in to view your profile.');
      navigate('/login');
      return;
    }

    // Fetch profile
    axios
      .get('http://127.0.0.1:5000/api/profile', {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((response) => {
        console.log('Profile fetched:', response.data);
        setProfile({
          username: response.data.username,
          email: response.data.email,
          phone: response.data.phone || '',
        });
        setUser({ ...user, ...response.data });
        localStorage.setItem('user', JSON.stringify({ ...user, ...response.data }));
        setError(''); 
      })
      .catch((err) => {
        console.error('Failed to fetch profile:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        if (err.response?.status === 401) {
          setError('Session expired. Please log in again.');
          logout();
        } else {
          setError('Failed to fetch profile data. Please try again.');
        }
      });

   
    axios
      .get('http://127.0.0.1:5000/api/addresses', {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((response) => {
        console.log('Addresses fetched:', response.data);
        setAddresses(response.data);
      })
      .catch((err) => {
        console.error('Failed to fetch addresses:', err.response?.data || err.message);
        setError('Failed to fetch addresses. Please try again.');
      });

    // Check newsletter subscription
    axios
      .get('http://127.0.0.1:5000/api/newsletter', {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((response) => {
        console.log('Newsletter status:', response.data);
        setIsSubscribed(response.data.is_subscribed);
        setError(''); 
      })
      .catch((err) => {
        console.error('Failed to check newsletter subscription:', err.response?.data || err.message);
        setError('Failed to check newsletter subscription.');
      });
  }, [user, setUser, logout, navigate]);

  const handleProfileUpdate = async () => {
    if (!profile.username || !profile.email) {
      setError('Username and email are required.');
      return;
    }
    try {
      console.log('Updating profile with:', profile);
      const response = await axios.put(
        'http://127.0.0.1:5000/api/profile',
        { username: profile.username, email: profile.email, phone: profile.phone || null },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      console.log('Profile update response:', response.data);
      await axios.get('http://127.0.0.1:5000/api/profile', {
        headers: { Authorization: `Bearer ${user.token}` },
      }).then((getResponse) => {
        setUser({ ...user, ...getResponse.data });
        localStorage.setItem('user', JSON.stringify({ ...user, ...getResponse.data }));
      });
      setMessage(response.data.message || 'Profile updated successfully');
      setError('');
    } catch (err) {
      console.error('Profile update error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
      setMessage('');
    }
  };

  const handlePasswordChange = async () => {
    if (!password.current_password || !password.new_password) {
      setError('Both current and new passwords are required.');
      return;
    }
    try {
      const response = await axios.put(
        'http://127.0.0.1:5000/api/password',
        password,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setMessage('Password changed successfully');
      setError('');
      setPassword({ current_password: '', new_password: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password. Please try again.');
      setMessage('');
    }
  };

  const handleAddressSubmit = async () => {
    const { address, city, state, postal_code, phone_number } = newAddress;
    if (!address || !city || !state || !postal_code || !phone_number) {
      setError('All address fields are required.');
      return;
    }
    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/api/addresses',
        newAddress,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setAddresses([...addresses, { id: response.data.address_id, ...newAddress }]);
      setNewAddress({ address: '', city: '', state: '', postal_code: '', phone_number: '', is_default: false });
      setMessage('Address added successfully');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add address. Please try again.');
      setMessage('');
    }
  };

  const handleAddressDelete = async (addressId) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/addresses/${addressId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setAddresses(addresses.filter((addr) => addr.id !== addressId));
      setMessage('Address deleted successfully');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete address. Please try again.');
      setMessage('');
    }
  };

  const handleNewsletterToggle = async () => {
    try {
      if (isSubscribed) {
        await axios.delete('http://127.0.0.1:5000/api/newsletter', {
          headers: { Authorization: `Bearer ${user.token}` },
          data: { email: user.email },
        });
        setIsSubscribed(false);
        setMessage('Unsubscribed from newsletter');
      } else {
        await axios.post(
          'http://127.0.0.1:5000/api/newsletter',
          { email: user.email },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setIsSubscribed(true);
        setMessage('Subscribed to newsletter');
      }
      setError('');
    } catch (err) {
      if (err.response?.status === 409 && err.response?.data?.message === 'Email already subscribed') {
        setIsSubscribed(true);
        setMessage('Already subscribed to newsletter');
        setError('');
      } else {
        console.error('Newsletter toggle error:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to update newsletter subscription. Please try again.');
        setMessage('');
      }
    }
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
      console.error('Failed to fetch address suggestions:', err);
      setError('Failed to fetch address suggestions.');
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    setNewAddress({
      ...newAddress,
      address: suggestion.address?.road || suggestion.display_name.split(',')[0] || '',
      city: suggestion.address?.city || suggestion.address?.town || suggestion.address?.village || '',
      state: suggestion.address?.state || '',
      postal_code: suggestion.address?.postcode || '',
    });
    setAddressSuggestions([]);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[80vh] bg-gray-50">
        <p className="text-lg text-gray-600">You must be logged in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto bg-gray-50 min-h-[90vh] rounded-lg shadow-xl overflow-hidden">
      <div className="w-full md:w-1/4 bg-white p-6 flex flex-col items-center space-y-6 shadow-md mt-12 md:mt-24">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-400">
          <FaUserCircle size={80} />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">{user.name || user.username}</h2>
        <p className="text-sm text-gray-500">{user.email}</p>
        <p className="text-sm text-gray-500">{user.phone || 'No phone number'}</p>
        <div className="mt-6 w-full space-y-2">
          <button
            onClick={() => navigate('/my-profile')}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-green-100 transition text-green-600 font-medium"
          >
            <FaUser /> <span>Profile</span>
          </button>
          <button
            onClick={() => navigate('/wishlist')}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-green-100 transition text-green-600 font-medium"
          >
            <FaHeart /> <span>Wishlist</span>
          </button>
          <button
            onClick={() => navigate('/cart')}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-green-100 transition text-green-600 font-medium"
          >
            <FaShoppingCart /> <span>Cart</span>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center px-3 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition mt-4"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex-1 p-8 space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Overview</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {message && <p className="text-green-500 text-center">{message}</p>}
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-500 text-sm">Full Name</p>
              <input
                type="text"
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                placeholder="Full Name"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="Email"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Phone Number</p>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="Phone Number"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <button
              onClick={handleProfileUpdate}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              disabled={!profile.username || !profile.email}
            >
              Update Profile
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Change Password</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Current Password</p>
              <input
                type="password"
                value={password.current_password}
                onChange={(e) => setPassword({ ...password, current_password: e.target.value })}
                placeholder="Current Password"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <p className="text-gray-500 text-sm">New Password</p>
              <input
                type="password"
                value={password.new_password}
                onChange={(e) => setPassword({ ...password, new_password: e.target.value })}
                placeholder="New Password"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <button
              onClick={handlePasswordChange}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              disabled={!password.current_password || !password.new_password}
            >
              Change Password
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Manage Addresses</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="text"
                  value={newAddress.address}
                  onChange={(e) => {
                    setNewAddress({ ...newAddress, address: e.target.value });
                    handleAddressSearch(e.target.value);
                  }}
                  placeholder="Search Address"
                  className="w-full p-2 border rounded-lg"
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
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                placeholder="City"
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="text"
                value={newAddress.state}
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                placeholder="State"
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="text"
                value={newAddress.postal_code}
                onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                placeholder="Postal Code"
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="text"
                value={newAddress.phone_number}
                onChange={(e) => setNewAddress({ ...newAddress, phone_number: e.target.value })}
                placeholder="Phone Number"
                className="w-full p-2 border rounded-lg"
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newAddress.is_default}
                  onChange={(e) => setNewAddress({ ...newAddress, is_default: e.target.checked })}
                  className="h-4 w-4"
                />
                <span className="text-sm text-gray-700">Set as default</span>
              </label>
            </div>
            <button
              onClick={handleAddressSubmit}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              disabled={
                !newAddress.address ||
                !newAddress.city ||
                !newAddress.state ||
                !newAddress.postal_code ||
                !newAddress.phone_number
              }
            >
              Add Address
            </button>
            {addresses.length > 0 ? (
              addresses.map((addr) => (
                <div key={addr.id} className="border p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <p>
                      {addr.address}, {addr.city}, {addr.state} {addr.postal_code}, Phone: {addr.phone_number}
                    </p>
                    <p className="text-sm text-gray-500">{addr.is_default ? 'Default' : ''}</p>
                  </div>
                  <button
                    onClick={() => handleAddressDelete(addr.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No addresses saved.</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">Orders</h2>
            <p className="text-sm text-gray-500">
              View all your orders and track status (Pending, Completed, Cancelled)
            </p>
            <button
              onClick={() => navigate('/orders')}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              View Orders
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">Wishlist</h2>
            <p className="text-sm text-gray-500">Access items you saved for later.</p>
            <button
              onClick={() => navigate('/wishlist')}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              View Wishlist
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 space-y-2">
          <h2 className="text-xl font-semibold text-gray-800">Newsletter / Notifications</h2>
          <label className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              checked={isSubscribed}
              onChange={handleNewsletterToggle}
              className="h-4 w-4"
            />
            <span className="text-sm text-gray-700">Subscribe to newsletter / notifications</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;