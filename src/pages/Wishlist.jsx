import React from 'react'
import { FaHeart } from 'react-icons/fa'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Wishlist = () => {
  const { wishlistItems, toggleWishlist } = useWishlist()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

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
      console.error('Failed to add to cart:', err.response?.data?.message)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-20 md:pt-20">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
          My Wishlist
        </h2>

        {wishlistItems.length === 0 && (
          <div className="text-center mb-8">
            <p className="text-gray-600 text-lg">Your wishlist is empty.</p>
          </div>
        )}

        {wishlistItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {wishlistItems.map((product) => (
              <div
                key={product.id}
                className="relative bg-white rounded-2xl shadow p-4 flex flex-col items-center text-center"
              >
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`absolute top-3 right-3 text-xl ${
                    wishlistItems.some((item) => item.id === product.id)
                      ? 'text-red-500'
                      : 'text-gray-400'
                  }`}
                >
                  <FaHeart />
                </button>

                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-56 w-56 object-contain rounded-xl mb-4"
                />
                <h3 className="font-semibold text-gray-800">{product.name}</h3>
                <p className="text-red-500 font-bold mt-1">
                  ₦{Number(product.price).toLocaleString()}
                </p>
                <p className="text-gray-600 text-sm">Category: {product.category}</p>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-3 w-full bg-green-500 text-white py-2 rounded-xl hover:bg-green-600 transition"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Wishlist