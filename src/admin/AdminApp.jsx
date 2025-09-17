import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Orders from './pages/Orders';
import Products from './pages/Products';
import ContactSubmissions from './pages/ContactSubmissions';
import NewsletterSubmissions from './pages/NewsletterSubmissions';
import Settings from './pages/Settings';

const AdminApp = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/products" element={<Products />} />
        <Route path="/contact-submissions" element={<ContactSubmissions />} />
        <Route path="/newsletter-submissions" element={<NewsletterSubmissions />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminApp;