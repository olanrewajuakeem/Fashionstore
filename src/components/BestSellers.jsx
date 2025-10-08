import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FaHeart } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const BestSellers = () => {
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { wishlistItems, toggleWishlist } = useWishlist()
  const { addToCart } = useCart()
  const { user } = useAuth()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products')
        setProducts(response.data.slice(0, 4)) 
        setError('')
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch products')
      }
    }
    fetchProducts()
  }, [])

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

  const isInWishlist = (productId) => wishlistItems.some((item) => item.id === productId)

  return (
   <div className="w-full bg-gray-50 py-10 px-6 md:px-20">
  {error && <div className="text-red-500 text-center mb-4">{error}</div>}

  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
    Best Sellers
  </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
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
            <p className="text-gray-600 text-sm">₦{Number(product.price).toLocaleString()}</p>
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
  )
}

export default BestSellers