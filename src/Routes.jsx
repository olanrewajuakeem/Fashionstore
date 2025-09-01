import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";


const AppRoutes = () => {
  return (
    < WishlistProvider >
        <CartProvider>

    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/wishlist" element={<Layout><Wishlist /></Layout>} />
        <Route path="/cart" element={<Layout><Cart /></Layout> }/>
        <Route path="/product/:id" element={<Layout><ProductDetails /></Layout>} />
        <Route path="/signup" element={<Layout><Signup /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />

      </Routes>
    </Router>
        </CartProvider>
        </WishlistProvider>

  ); 
};

export default AppRoutes;
