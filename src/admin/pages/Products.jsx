import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const categories = ['Clothing', 'Accessories', 'Shoes', 'Bags', 'Jewelry'];

const Products = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    discount_percentage: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/admin/login');
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/products', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user, isAdmin, navigate]);

  const openModal = (product = null) => {
    setEditingProduct(product);
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
        discount_percentage: product.discount_percentage,
        image: null,
      });
      setImagePreview(product.image_url || '');
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        discount_percentage: '',
        image: null,
      });
      setImagePreview('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      discount_percentage: '',
      image: null,
    });
    setImagePreview('');
    setIsModalOpen(false);
    setError('');
    setMessage('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', formData.name);
    form.append('description', formData.description);
    form.append('price', formData.price);
    form.append('stock', formData.stock);
    form.append('category', formData.category);
    form.append('discount_percentage', formData.discount_percentage || 0);
    if (formData.image) {
      form.append('image', formData.image);
    }

    try {
      if (editingProduct) {
        await axios.put(`http://127.0.0.1:5000/api/admin/products/${editingProduct.id}`, form, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        setMessage('Product updated successfully');
      } else {
        await axios.post('http://127.0.0.1:5000/api/admin/products', form, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        setMessage('Product created successfully');
      }

      const response = await axios.get('http://127.0.0.1:5000/api/products', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProducts(response.data);
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
      setMessage('');
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-600">Loading...</div>;
  if (error && !message) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <button
          onClick={() => openModal()}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          + Add Product
        </button>
      </div>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {message && <p className="text-green-500 mb-4 text-center">{message}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Image</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Category</th>
              <th className="py-3 px-4 text-left">Price (₦)</th>
              <th className="py-3 px-4 text-left">Discount (%)</th>
              <th className="py-3 px-4 text-left">Stock</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id} className="border-b hover:bg-green-50">
                <td className="py-3 px-4">{prod.id}</td>
                <td className="py-3 px-4">
                  {prod.image_url ? (
                    <img src={prod.image_url} alt={prod.name} className="w-12 h-12 rounded object-cover" />
                  ) : (
                    <span className="text-gray-400 italic">No image</span>
                  )}
                </td>
                <td className="py-3 px-4">{prod.name}</td>
                <td className="py-3 px-4">{prod.category}</td>
                <td className="py-3 px-4">₦{Number(prod.price).toLocaleString()}</td>
                <td className="py-3 px-4">{prod.discount_percentage}%</td>
                <td className="py-3 px-4">{prod.stock}</td>
                <td className="py-3 px-4 flex gap-2">
                  <button
                    onClick={() => openModal(prod)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(prod.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSave} className="flex flex-col gap-3">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Product Name"
                className="border p-2 rounded focus:ring-2 focus:ring-green-500"
                required
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Product Description"
                rows="4"
                className="border p-2 rounded focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
                step="0.01"
                className="border p-2 rounded focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                type="number"
                name="discount_percentage"
                value={formData.discount_percentage}
                onChange={handleChange}
                placeholder="Discount Percentage (0-100)"
                step="0.1"
                className="border p-2 rounded focus:ring-2 focus:ring-green-500"
              />
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Stock"
                className="border p-2 rounded focus:ring-2 focus:ring-green-500"
                required
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="border p-2 rounded focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div>
                <label className="block mb-1 font-medium">Product Image</label>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/gif"
                  onChange={handleImageChange}
                  className="border p-2 rounded w-full"
                  required={!editingProduct}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-2 w-24 h-24 object-cover rounded border"
                  />
                )}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;