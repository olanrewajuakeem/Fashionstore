import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaHeart } from 'react-icons/fa'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'

const ProductDetails = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState('')
  const { addToCart } = useCart()
  const { toggleWishlist, wishlistItems } = useWishlist()
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${id}`)
        setProduct(response.data)
        setError('')
      } catch (err) {
        setError(err.response?.data?.message || 'Product not found')
      }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    try {
      await axios.post(
        '/api/cart',
        { product_id: product.id, quantity },
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      addToCart({ ...product, qty: quantity })
      alert('Added to cart!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add to cart')
    }
  }

  if (!product) {
    return (
      <h2 className="text-center mt-40 text-xl font-semibold">
        {error || 'Loading...'}
      </h2>
    )
  }

  const isInWishlist = wishlistItems.some((item) => item.id === product.id)

  return (
    <div className="container mx-auto px-6 mt-32">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex-1 flex items-center justify-center">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full max-w-md h-[400px] object-contain rounded-xl shadow-md"
            loading="lazy"
          />
        </div>

        <div className="flex-1 flex flex-col justify-start">
          <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>

          <div className="mt-3 flex items-center gap-2">
            <p className="text-2xl text-black font-semibold">
              ₦{Number(product.price).toLocaleString()}
            </p>
          </div>

          <p className="mt-4 text-gray-600 text-sm md:text-base">
            {product.description || 'This is a premium quality product you\'ll love.'}
          </p>

          <div className="flex items-center mt-6 gap-4">
            <span className="font-medium">Quantity:</span>
            <div className="flex items-center border rounded-xl overflow-hidden">
              <button
                className="px-3 py-1 text-lg hover:bg-gray-100"
                onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
              >
                -
              </button>
              <span className="px-4 py-1">{quantity}</span>
              <button
                className="px-3 py-1 text-lg hover:bg-gray-100"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-6">
            <button
              className="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 transition"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>

            <button
              className={`flex items-center gap-2 border px-6 py-2 rounded-xl transition ${
                isInWishlist ? 'bg-red-500 text-white' : 'hover:bg-gray-100'
              }`}
              onClick={() => toggleWishlist(product)}
            >
              <FaHeart className={isInWishlist ? 'text-white' : 'text-gray-400'} /> Wishlist
            </button>
          </div>

          <div className="mt-6 text-gray-500 text-sm">
            <p>Category: {product.category}</p>
            <p>Availability: {product.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  )
}

export default ProductDetails