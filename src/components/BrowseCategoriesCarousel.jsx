import React, { useState, useRef } from "react";
import { FaTshirt, FaShoePrints, FaShoppingBag, FaHatCowboy, FaStar, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import productsData from "../data/product";
import { useWishlist } from "../context/WishlistContext"; 

const categories = [
  { name: "All Products", icon: <FaStar size={24} /> },
  { name: "T-Shirts", icon: <FaTshirt size={24} /> },
  { name: "Shoes", icon: <FaShoePrints size={24} /> },
  { name: "Bags", icon: <FaShoppingBag size={24} /> },
  { name: "Hats", icon: <FaHatCowboy size={24} /> },
  { name: "Accessories", icon: <FaStar size={24} /> },
];

const BrowseCategoriesCarousel = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { wishlistItems, toggleWishlist } = useWishlist(); 

  const allProducts = Object.values(productsData).flat();

  const scroll = (dir) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: dir === "left" ? -150 : 150,
        behavior: "smooth",
      });
    }
  };

  const displayedProducts =
    selectedCategory === "All Products"
      ? allProducts
      : productsData[selectedCategory];

  const isInWishlist = (productId) =>
    wishlistItems.some((item) => item.id === productId);

  return (
    <div className="w-full bg-gray-50 py-6 px-6 md:px-20">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
        Browse by Category
      </h2>

      <div className="relative flex items-center">
        <button
          onClick={() => scroll("left")}
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
                  ? "bg-black text-white"
                  : "bg-white text-gray-900 hover:bg-gray-100"
              }`}
            >
              {cat.icon}
              <span className="text-sm text-center mt-1">{cat.name}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 z-10 bg-white rounded-full shadow-md p-1 hover:bg-gray-100"
        >
          &gt;
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          {selectedCategory}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {displayedProducts?.map((product) => (
            <div
              key={product.id}
              className="relative bg-gray-100 rounded-xl shadow flex flex-col items-center text-center hover:shadow-lg transition w-full p-4 cursor-pointer"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <button
                className={`absolute top-3 right-3 text-xl z-10 ${
                  isInWishlist(product.id) ? "text-red-500" : "text-gray-400"
                }`}
                onClick={(e) => {
                  e.stopPropagation(); 
                  toggleWishlist(product); 
                }}
              >
                <FaHeart />
              </button>

              <div className="w-full h-40 md:h-48 flex items-center justify-center overflow-hidden mb-3">
                <img
                  src={product.img}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
                />
              </div>

              <h4 className="text-sm md:text-base font-medium">{product.name}</h4>
              <p className="text-gray-600 text-sm">
                ₦{Number(product.price).toLocaleString()}
              </p>

              <button
                className="mt-2 bg-black text-white px-3 py-1 rounded-full text-xs hover:bg-gray-800 transition"
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrowseCategoriesCarousel;
