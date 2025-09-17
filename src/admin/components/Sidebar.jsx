import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaBoxOpen, FaShoppingCart, FaCog, FaEnvelope, FaNewspaper } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: <FaTachometerAlt />, path: '/admin' },
    { name: 'Users', icon: <FaUsers />, path: '/admin/users' },
    { name: 'Products', icon: <FaBoxOpen />, path: '/admin/products' },
    { name: 'Orders', icon: <FaShoppingCart />, path: '/admin/orders' },
    { name: 'Contact', icon: <FaEnvelope />, path: '/admin/contact-submissions' },
    { name: 'Newsletter', icon: <FaNewspaper />, path: '/admin/newsletter-submissions' },
    { name: 'Settings', icon: <FaCog />, path: '/admin/settings' },
  ];

  return (
    <div className="w-64 min-h-screen p-6 flex flex-col bg-gradient-to-b from-green-900 to-green-700 text-white shadow-lg sm:w-16">
      <h2 className="text-2xl font-bold mb-8 sm:hidden">Fashion Admin</h2>
      <nav className="flex flex-col gap-3">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              location.pathname === item.path ? 'bg-green-600 shadow-lg' : 'hover:bg-green-600'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="sm:hidden">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;