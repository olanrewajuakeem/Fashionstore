import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { FaUserCircle, FaUser, FaHeart, FaShoppingCart, FaLock, FaEnvelope } from 'react-icons/fa'

const MyProfile = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[80vh] bg-gray-50">
        <p className="text-lg text-gray-600">You must be logged in to view your profile.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto bg-gray-50 min-h-[90vh] rounded-lg shadow-xl overflow-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-white p-6 flex flex-col items-center space-y-6 shadow-md mt-12 md:mt-24">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-400">
          {user.avatar ? (
            <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <FaUserCircle size={80} />
          )}
        </div>
        <h2 className="text-xl font-semibold text-gray-900">{user.name || user.username}</h2>
        <p className="text-sm text-gray-500">{user.email}</p>

        {/* Sidebar Buttons */}
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

      {/* Main Content */}
      <div className="flex-1 p-8 space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Overview</h1>

        {/* Basic Info Card */}
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-500 text-sm">Full Name</p>
              <p className="text-gray-900 font-medium">{user.name || user.username}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="text-gray-900 font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Phone Number</p>
              <p className="text-gray-900 font-medium">{user.phone || 'Not Provided'}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Profile Picture</p>
              <div className="mt-2 flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <FaUserCircle size={32} />
                  )}
                </div>
                <button className="px-4 py-2 bg-green-500 text-white font-medium rounded hover:bg-green-600 transition">
                  Upload / Change
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Account Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="w-full px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition flex items-center justify-center space-x-2">
              <FaLock /> <span>Change Password</span>
            </button>
            <button className="w-full px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition flex items-center justify-center space-x-2">
              <FaEnvelope /> <span>Update Email / Phone</span>
            </button>
            <button className="w-full px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition">
              Manage Addresses
            </button>
          </div>
        </div>

        {/* Orders & Wishlist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">Orders</h2>
            <p className="text-sm text-gray-500">
              View all your orders and track status (Pending, Completed, Cancelled)
            </p>
            <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
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

        {/* Payment & Notifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">Payment Methods</h2>
            <p className="text-sm text-gray-500">Saved cards or payment preferences (optional)</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">Newsletter / Notifications</h2>
            <label className="flex items-center space-x-2 mt-2">
              <input type="checkbox" className="h-4 w-4" />
              <span className="text-sm text-gray-700">Subscribe to newsletter / notifications</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyProfile
