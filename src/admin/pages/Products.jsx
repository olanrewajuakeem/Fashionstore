import React, { useState } from "react";

const Products = () => {
  const [products, setProducts] = useState([
    { id: 1, name: "T-Shirt", price: "8000", stock: 50, category: "Clothing", image: "" },
    { id: 2, name: "Jeans", price: "16000", stock: 30, category: "Clothing", image: "" },
    { id: 3, name: "Hat", price: "6000", stock: 100, category: "Accessories", image: "" },
  ]);

  const categories = ["Clothing", "Accessories", "Shoes", "Bags", "Jewelry"];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState("");

  const openModal = (product = null) => {
    setEditingProduct(product);
    if (product) {
      setFormData(product);
      setImagePreview(product.image || "");
    } else {
      setFormData({ name: "", price: "", stock: "", category: "", image: "" });
      setImagePreview("");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingProduct(null);
    setFormData({ name: "", price: "", stock: "", category: "", image: "" });
    setImagePreview("");
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...editingProduct, ...formData } : p));
    } else {
      setProducts([...products, { id: products.length + 1, ...formData }]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <button
          onClick={() => openModal()}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          + Add Product
        </button>
      </div>

      <table className="min-w-full bg-white rounded shadow overflow-hidden">
        <thead className="bg-green-700 text-white">
          <tr>
            <th className="py-3 px-4">ID</th>
            <th className="py-3 px-4">Image</th>
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Category</th>
            <th className="py-3 px-4">Price (₦)</th>
            <th className="py-3 px-4">Stock</th>
            <th className="py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(prod => (
            <tr key={prod.id} className="border-b hover:bg-green-50">
              <td className="py-2 px-4">{prod.id}</td>
              <td className="py-2 px-4">
                {prod.image ? (
                  <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded object-cover" />
                ) : (
                  <span className="text-gray-400 italic">No image</span>
                )}
              </td>
              <td className="py-2 px-4">{prod.name}</td>
              <td className="py-2 px-4">{prod.category}</td>
              <td className="py-2 px-4">₦{prod.price}</td>
              <td className="py-2 px-4">{prod.stock}</td>
              <td className="py-2 px-4 flex gap-2">
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-96 p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h2>
            <form className="flex flex-col gap-3">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Product Name"
                className="border p-2 rounded"
              />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
                className="border p-2 rounded"
              />
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Stock"
                className="border p-2 rounded"
              />

              {/* Category Dropdown */}
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Image Upload */}
              <div>
                <label className="block mb-1 font-medium">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="border p-2 rounded w-full"
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
                  type="button"
                  onClick={handleSave}
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
