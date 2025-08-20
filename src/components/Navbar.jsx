import React, { useState } from "react";
import { assets } from "../assets/assets";
import { Heart, ShoppingCart, User, Search, Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 w-full bg-white z-20 shadow-md">
      <div className="flex items-center justify-center px-6 h-20 space-x-8">
        
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src={assets.logo} alt="Logo" className="h-10" />
          <span className="font-bold text-xl text-gray-900">FashionStore</span>
        </div>

        {/* Search bar */}
        <div className="relative w-72">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>

        {/* Links */}
        <ul className="hidden md:flex items-center space-x-6 font-semibold text-gray-700">
          <li><a href="#Header" className="hover:text-gray-900">Home</a></li>
          <li><a href="#About" className="hover:text-gray-900">About</a></li>
          <li><a href="#Contact" className="hover:text-gray-900">Contact</a></li>
          <li><a href="#Blog" className="hover:text-gray-900">Blog</a></li>
        </ul>

        {/* Icons */}
        <div className="flex items-center space-x-4">
          <button className="hover:text-gray-600"><Heart size={22} /></button>
          <button className="hover:text-gray-600"><ShoppingCart size={22} /></button>
          <button className="hover:text-gray-600"><User size={22} /></button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white w-full shadow-md px-6 py-4">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>

          <ul className="flex flex-col space-y-3 font-semibold text-gray-700">
            <li><a href="#Header" className="hover:text-gray-900">Home</a></li>
            <li><a href="#About" className="hover:text-gray-900">About</a></li>
            <li><a href="#Contact" className="hover:text-gray-900">Contact</a></li>
            <li><a href="#Blog" className="hover:text-gray-900">Blog</a></li>
          </ul>

          <div className="flex items-center space-x-4 mt-4">
            <button className="hover:text-gray-600"><Heart size={22} /></button>
            <button className="hover:text-gray-600"><ShoppingCart size={22} /></button>
            <button className="hover:text-gray-600"><User size={22} /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
