import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Settings from "./pages/Settings";
import ContactSubmissions from "./pages/ContactSubmissions";
import NewsletterSubmissions from "./pages/NewsletterSubmissions";

const AdminApp = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
       <div className="flex-1 p-6 overflow-auto">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/settings" element={<Settings />} />
            <Route path="/contact-submissions" element={<ContactSubmissions />} />
  <Route path="/newsletter-submissions" element={<NewsletterSubmissions />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminApp;
