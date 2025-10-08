import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import allProductsImg from "../assets/all-products.jpeg";
import tshirtImg from "../assets/tshirt.jpeg";
import bagImg from "../assets/bag.jpeg";
import accessoriesImg from "../assets/accessories.jpeg";
import jacketImg from "../assets/jacket .jpeg";

const categories = [
  { name: "All Products", image: allProductsImg },
  { name: "T-Shirts", image: tshirtImg },
  { name: "Bags", image: bagImg },
  { name: "Accessories", image: accessoriesImg },
  { name: "Jackets", image: jacketImg },
];

const BrowseCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          selectedCategory === "All Products"
            ? "/api/products"
            : `/api/products?category=${selectedCategory}`
        );
        const productsArray = Array.isArray(response.data)
          ? response.data
          : response.data.products || [];
        setProducts(productsArray);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products");
        setProducts([]);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  const isInWishlist = (productId) =>
    wishlistItems.some((item) => item.id === productId);

  const handleAddToCart = async (product) => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        "/api/cart",
        { product_id: product.id, quantity: 1 },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      addToCart({ ...product, qty: 1 });
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add to cart");
      toast.error("Failed to add to cart");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, duration: 0.6 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full bg-gray-50 py-16 px-6 sm:px-10 lg:px-20"
    >
      {error && <div className="text-red-500 text-center mb-6">{error}</div>}

      <motion.div
        variants={itemVariants}
        className="flex overflow-x-auto space-x-10 pb-10 scrollbar-hide mb-14 px-4 justify-center"
      >
        {categories.map((cat, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.1, y: -6 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedCategory(cat.name)}
            className={`flex-shrink-0 w-56 h-64 rounded-3xl shadow-md cursor-pointer transition-all duration-300 transform ${
              selectedCategory === cat.name
                ? "bg-green-700 text-white"
                : "bg-white text-gray-900 hover:bg-gray-100"
            }`}
          >
            <div className="w-full h-44 rounded-t-3xl overflow-hidden">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
            <p className="text-center font-semibold mt-4 text-base md:text-lg">
              {cat.name}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {products.length === 0 ? (
        <div className="text-center text-gray-500 mt-20 text-lg">
          No products found in this category.
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 justify-items-center"
        >
          {products.map((product) => (
            <motion.div
              variants={itemVariants}
              key={product.id}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition duration-300 flex flex-col items-center text-center p-6 cursor-pointer group w-80 h-[460px]"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <button
                className={`absolute top-4 right-4 text-2xl z-10 transition ${
                  isInWishlist(product.id)
                    ? "text-red-500"
                    : "text-gray-400 hover:text-red-400"
                } hover:scale-110`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product);
                  toast.success(
                    isInWishlist(product.id)
                      ? "Removed from wishlist"
                      : "Added to wishlist"
                  );
                }}
              >
                <FaHeart />
              </button>

              <div className="w-full h-60 flex items-center justify-center overflow-hidden mb-5 rounded-xl">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              <h4 className="text-lg font-semibold text-gray-800 line-clamp-1">
                {product.name}
              </h4>
              <p className="text-red-500 font-bold mt-2 text-base">
                ₦{Number(product.price).toLocaleString()}
              </p>
              <p className="text-gray-500 text-sm">{product.category}</p>

              <motion.button
                whileTap={{ scale: 0.95 }}
                className="mt-5 bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
              >
                Add to Cart
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default BrowseCategories;
