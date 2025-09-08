import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const categories = ['T-Shirts', 'Shoes', 'Bags', 'Hats', 'Accessories']

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    stock: '',
    category: categories[0],
  })
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const { user, isAdmin } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/login')
      return
    }
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/admin/products', {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        setProducts(response.data)
        setError('')
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch products')
      }
    }
    fetchProducts()
  }, [user, isAdmin, navigate])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editId) {
        await axios.put(`/api/admin/products/${editId}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        setMessage('Product updated successfully')
      } else {
        await axios.post('/api/admin/products', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        setMessage('Product created successfully')
      }
      setError('')
      setFormData({ name: '', description: '', price: '', image_url: '', stock: '', category: categories[0] })
      setEditId(null)
      const response = await axios.get('/api/admin/products', {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      setProducts(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product')
      setMessage('')
    }
  }

  const editProduct = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url,
      stock: product.stock,
      category: product.category,
    })
    setEditId(product.id)
  }

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`/api/admin/products/${productId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      setProducts(products.filter((p) => p.id !== productId))
      setMessage('Product deleted successfully')
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product')
    }
  }

  return (
    <div className="py-16 px-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Manage Products</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {message && <p className="text-green-500 mb-4 text-center">{message}</p>}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8 space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Price</label>
            <input
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              type="number"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Image URL</label>
            <input
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="Enter image URL"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Stock</label>
            <input
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="Enter stock quantity"
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-600 transition"
          >
            {editId ? 'Update Product' : 'Add Product'}
          </button>
        </form>
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Product List</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow p-4 flex flex-col items-center"
            >
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-40 object-contain mb-3"
              />
              <h4 className="text-lg font-medium">{product.name}</h4>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-gray-600">Price: ₦{Number(product.price).toLocaleString()}</p>
              <p className="text-gray-600">Stock: {product.stock}</p>
              <p className="text-gray-600">Category: {product.category}</p>
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={() => editProduct(product)}
                  className="bg-green-500 text-white px-4 py-1 rounded-full hover:bg-green-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="bg-red-500 text-white px-4 py-1 rounded-full hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminProducts