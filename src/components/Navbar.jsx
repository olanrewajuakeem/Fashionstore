import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { assets } from '../assets/assets'
import { Heart, ShoppingCart, User, Search, Menu, X } from 'lucide-react'
import axios from 'axios'
import { useCart } from '../context/CartContext' 

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user, logout } = useContext(AuthContext)
  const { cartCount } = useCart() 
  const navigate = useNavigate()

  const scrollToSection = (id) => {
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate(`/#${id}`)
    }
    setMobileOpen(false)
  }

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    navigate('/')
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    try {
      const response = await axios.get(`/api/products?search=${searchQuery}`)
      navigate('/products', { state: { searchResults: response.data } })
      setSearchQuery('')
    } catch (err) {
      console.error('Search failed:', err.response?.data?.message)
    }
  }

  return (
    <div className="fixed top-0 left-0 w-full bg-white z-20 shadow-md">
      <div className="flex items-center justify-center px-6 h-20 space-x-8">
        <div
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <img src={assets.logo} alt="Logo" className="h-10" />
          <span className="font-bold text-xl text-gray-900">FashionStore</span>
        </div>

        <form onSubmit={handleSearch} className="relative w-72 hidden md:block">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </button>
        </form>

        <ul className="hidden md:flex items-center space-x-6 font-semibold text-gray-700">
          <li><button onClick={() => navigate('/')} className="hover:text-gray-900">Home</button></li>
          <li><button onClick={() => scrollToSection('about')} className="hover:text-gray-900">About</button></li>
          <li><button onClick={() => scrollToSection('contact')} className="hover:text-gray-900">Contact</button></li>
          <li><button onClick={() => scrollToSection('blog')} className="hover:text-gray-900">Blog</button></li>
        </ul>

        <div className="flex items-center space-x-4 relative">
          <button onClick={() => navigate('/wishlist')} className="hover:text-gray-600 relative">
            <Heart size={22} />
          </button>

          <button onClick={() => navigate('/cart')} className="relative hover:text-gray-600">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-2 hover:text-gray-600"
            >
              <User size={22} />
              {user && (
                <span className="hidden md:inline text-sm font-medium text-gray-700">
                  {user.name || user.username || 'Profile'}
                </span>
              )}
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md overflow-hidden">
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        navigate('/my-profile')
                        setUserMenuOpen(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Profile
                    </button>

                    {user?.role === 'admin' && (
                      <button
                        onClick={() => {
                          navigate('/admin/products')
                          setUserMenuOpen(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Admin Dashboard
                      </button>
                    )}

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        navigate('/login')
                        setUserMenuOpen(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        navigate('/signup')
                        setUserMenuOpen(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Signup
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white w-full shadow-md px-6 py-4">
          <form onSubmit={handleSearch} className="relative mb-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </button>
          </form>

          <ul className="flex flex-col space-y-3 font-semibold text-gray-700">
            <li><button onClick={() => navigate('/')} className="hover:text-gray-900">Home</button></li>
            <li><button onClick={() => scrollToSection('about')} className="hover:text-gray-900">About</button></li>
            <li><button onClick={() => scrollToSection('contact')} className="hover:text-gray-900">Contact</button></li>
            <li><button onClick={() => scrollToSection('blog')} className="hover:text-gray-900">Blog</button></li>

            {user && (
              <li>
                <button
                  onClick={() => {
                    navigate('/my-profile')
                    setMobileOpen(false)
                  }}
                  className="hover:text-gray-900"
                >
                  My Profile
                </button>
              </li>
            )}

            {user?.role === 'admin' && (
              <li>
                <button
                  onClick={() => {
                    navigate('/admin/products')
                    setMobileOpen(false)
                  }}
                  className="hover:text-gray-900"
                >
                  Admin Dashboard
                </button>
              </li>
            )}

            {user ? (
              <li>
                <button onClick={handleLogout} className="hover:text-gray-900">Logout</button>
              </li>
            ) : (
              <>
                <li>
                  <button
                    onClick={() => {
                      navigate('/login')
                      setMobileOpen(false)
                    }}
                    className="hover:text-gray-900"
                  >
                    Login
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      navigate('/signup')
                      setMobileOpen(false)
                    }}
                    className="hover:text-gray-900"
                  >
                    Signup
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Navbar
