import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Wishlist from './pages/Wishlist'
import Cart from './pages/Cart'
import ProductDetails from './pages/ProductDetails'
import Signup from './pages/Signup'
import Login from './pages/Login'

// Admin imports
import AdminApp from './admin/AdminApp'

const AppRoutes = () => {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* User routes */}
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/wishlist" element={<Layout><Wishlist /></Layout>} />
              <Route path="/cart" element={<Layout><Cart /></Layout>} />
              <Route path="/product/:id" element={<Layout><ProductDetails /></Layout>} />
              <Route path="/signup" element={<Layout><Signup /></Layout>} />
              <Route path="/login" element={<Layout><Login /></Layout>} />

              {/* Admin routes */}
              <Route path="/admin/*" element={<AdminApp />} />
            </Routes>
          </Router>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  )
}

export default AppRoutes
