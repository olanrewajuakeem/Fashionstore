import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

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

const BrowseCategoriesCarousel = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const containerRef = useRef(null);
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

  const scroll = (dir) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: dir === "left" ? -250 : 250,
        behavior: "smooth",
      });
    }
  };

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

  return (
    <div className="w-full bg-gray-50 py-10 px-6 md:px-20">
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
        Browse by Category
      </h2>

      <div className="relative flex items-center">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 z-10 bg-white rounded-full shadow-md p-2 hover:bg-gray-100 transition hidden md:block"
        >
          &lt;
        </button>

        <div
          ref={containerRef}
          className="flex space-x-4 overflow-x-auto px-4 scrollbar-hide"
        >
          {categories.map((cat, i) => (
            <div
              key={i}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex flex-col items-center justify-center min-w-[100px] md:min-w-[130px] p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedCategory === cat.name
                  ? "bg-green-700 text-white shadow-md"
                  : "bg-white text-gray-900 hover:bg-gray-100 shadow-sm"
              }`}
            >
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-lg overflow-hidden flex items-center justify-center border">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm md:text-base text-center mt-2 font-medium">
                {cat.name}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 z-10 bg-white rounded-full shadow-md p-2 hover:bg-gray-100 transition hidden md:block"
        >
          &gt;
        </button>
      </div>

      <div className="mt-10">
        <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
          {selectedCategory}
        </h3>

        {products.length === 0 ? (
          <div className="text-center text-gray-500 mt-12 text-lg">
            No products found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="relative bg-white rounded-xl shadow-sm hover:shadow-xl transition duration-300 flex flex-col items-center text-center p-4 cursor-pointer group"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <button
                  className={`absolute top-3 right-3 text-xl z-10 transition ${
                    isInWishlist(product.id) ? "text-red-500" : "text-gray-400"
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

                <div className="w-full h-44 md:h-52 flex items-center justify-center overflow-hidden mb-3 rounded-lg">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <h4 className="text-sm md:text-base font-medium text-gray-800">
                  {product.name}
                </h4>
                <p className="text-red-500 font-bold mt-1 text-sm md:text-base">
                  ₦{Number(product.price).toLocaleString()}
                </p>
                <p className="text-gray-500 text-xs md:text-sm">
                  {product.category}
                </p>

                <button
                  className="mt-4 bg-green-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-green-700 transition-all w-full md:w-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseCategoriesCarousel;
