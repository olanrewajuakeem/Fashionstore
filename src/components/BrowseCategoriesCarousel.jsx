import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { FaTshirt, FaShoePrints, FaShoppingBag, FaHatCowboy, FaStar, FaHeart } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const categories = [
  { name: 'All Products', icon: <FaStar size={24} /> },
  { name: 'T-Shirts', icon: <FaTshirt size={24} /> },
  { name: 'Shoes', icon: <FaShoePrints size={24} /> },
  { name: 'Bags', icon: <FaShoppingBag size={24} /> },
  { name: 'Hats', icon: <FaHatCowboy size={24} /> },
  { name: 'Accessories', icon: <FaStar size={24} /> },
]

const BrowseCategoriesCarousel = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Products')
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')
  const containerRef = useRef(null)
  const navigate = useNavigate()
  const { wishlistItems, toggleWishlist } = useWishlist()
  const { addToCart } = useCart()
  const { user } = useAuth()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          selectedCategory === 'All Products'
            ? '/api/products'
            : `/api/products?category=${selectedCategory}`
        )
        setProducts(response.data)
        setError('')
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch products')
      }
    }
    fetchProducts()
  }, [selectedCategory])

  const scroll = (dir) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: dir === 'left' ? -150 : 150,
        behavior: 'smooth',
      })
    }
  }

  const isInWishlist = (productId) => wishlistItems.some((item) => item.id === productId)

  const handleAddToCart = async (product) => {
    if (!user) {
      navigate('/login')
      return
    }
    try {
      await axios.post(
        '/api/cart',
        { product_id: product.id, quantity: 1 },
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      addToCart({ ...product, qty: 1 })
      alert('Added to cart!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add to cart')
    }
  }

  return (
    <div className="w-full bg-gray-50 py-6 px-6 md:px-20">
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
        Browse by Category
      </h2>

      <div className="relative flex items-center">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 z-10 bg-white rounded-full shadow-md p-1 hover:bg-gray-100"
        >
          &lt;
        </button>

        <div ref={containerRef} className="flex space-x-4 overflow-x-auto px-8">
          {categories.map((cat, i) => (
            <div
              key={i}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex flex-col items-center justify-center min-w-[90px] p-3 rounded-lg cursor-pointer transition-all ${
                selectedCategory === cat.name
                  ? 'bg-green-700 text-white hover:bg-green-800'
                  : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}
            >
              {cat.icon}
              <span className="text-sm text-center mt-1">{cat.name}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 z-10 bg-white rounded-full shadow-md p-1 hover:bg-gray-100"
        >
          &gt;
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">{selectedCategory}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products?.map((product) => (
            <div
              key={product.id}
              className="relative bg-white rounded-xl shadow flex flex-col items-center text-center hover:shadow-lg transition w-full p-4 cursor-pointer"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <button
                className={`absolute top-3 right-3 text-xl z-10 ${
                  isInWishlist(product.id) ? 'text-red-500' : 'text-gray-400'
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleWishlist(product)
                }}
              >
                <FaHeart />
              </button>

              <div className="w-full h-40 md:h-48 flex items-center justify-center overflow-hidden mb-3">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
                />
              </div>

              <h4 className="text-sm md:text-base font-medium">{product.name}</h4>
              <p className="text-red-500 font-bold mt-1">
                ₦{Number(product.price).toLocaleString()}
              </p>
              <p className="text-gray-600 text-sm">Category: {product.category}</p>

              <button
                className="mt-5 bg-green-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-600 transition-all w-max"
                onClick={(e) => {
                  e.stopPropagation()
                  handleAddToCart(product)
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BrowseCategoriesCarousel