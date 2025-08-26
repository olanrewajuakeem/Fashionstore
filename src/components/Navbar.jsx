import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { Heart, ShoppingCart, User, Search, Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/#${id}`);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-white z-20 shadow-md">
      <div className="flex items-center justify-center px-6 h-20 space-x-8">

        <div
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <img src={assets.logo} alt="Logo" className="h-10" />
          <span className="font-bold text-xl text-gray-900">FashionStore</span>
        </div>

        <div className="relative w-72 hidden md:block">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>

        <ul className="hidden md:flex items-center space-x-6 font-semibold text-gray-700">
          <li>
            <button onClick={() => navigate("/")} className="hover:text-gray-900">Home</button>
          </li>
          <li>
            <button onClick={() => scrollToSection("about")} className="hover:text-gray-900">About</button>
          </li>
          <li>
            <button onClick={() => scrollToSection("contact")} className="hover:text-gray-900">Contact</button>
          </li>
          <li>
            <button onClick={() => scrollToSection("blog")} className="hover:text-gray-900">Blog</button>
          </li>
        </ul>

        <div className="flex items-center space-x-4 relative">
          <button onClick={() => navigate("/wishlist")} className="hover:text-gray-600">
            <Heart size={22} />
          </button>
          <button onClick={() => navigate("/cart")} className="hover:text-gray-600">
            <ShoppingCart size={22} />
          </button>

          <div className="relative">
            <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="hover:text-gray-600">
              <User size={22} />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-lg rounded-md">
                <button
                  onClick={() => navigate("/login")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Signup
                </button>
              </div>
            )}
          </div>
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
            <li><button onClick={() => navigate("/")} className="hover:text-gray-900">Home</button></li>
            <li><button onClick={() => scrollToSection("about")} className="hover:text-gray-900">About</button></li>
            <li><button onClick={() => scrollToSection("contact")} className="hover:text-gray-900">Contact</button></li>
            <li><button onClick={() => scrollToSection("blog")} className="hover:text-gray-900">Blog</button></li>
          </ul>

          <div className="flex items-center space-x-4 mt-4">
            <button onClick={() => navigate("/wishlist")} className="hover:text-gray-600">
              <Heart size={22} />
            </button>
            <button onClick={() => navigate("/cart")} className="hover:text-gray-600">
              <ShoppingCart size={22} />
            </button>

            {/* Mobile User Dropdown */}
            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="hover:text-gray-600">
                <User size={22} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-lg rounded-md">
                  <button
                    onClick={() => navigate("/login")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Signup
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
