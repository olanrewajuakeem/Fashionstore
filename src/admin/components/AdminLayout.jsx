import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 sm:ml-16">
        <Navbar />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;