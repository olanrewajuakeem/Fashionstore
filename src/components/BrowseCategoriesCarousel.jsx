import React, { useState, useRef } from "react";
import {
  FaTshirt,
  FaShoePrints,
  FaShoppingBag,
  FaHatCowboy,
  FaStar,
  FaHeart,
} from "react-icons/fa";

const categories = [
  { name: "All Products", icon: <FaStar size={24} /> }, 
  { name: "T-Shirts", icon: <FaTshirt size={24} /> },
  { name: "Shoes", icon: <FaShoePrints size={24} /> },
  { name: "Bags", icon: <FaShoppingBag size={24} /> },
  { name: "Hats", icon: <FaHatCowboy size={24} /> },
  { name: "Accessories", icon: <FaStar size={24} /> },
];


const productsData = {
  "T-Shirts": [
    { id: 1, name: "Classic Tee", price: "\u20A6 5,000", img: "#" },
    { id: 2, name: "Graphic Tee", price: "\u20A6 5,500", img: "#" },
  ],
  Shoes: [
    { id: 3, name: "Sneakers", price: "\u20A6 6,000", img: "#" },
    { id: 4, name: "Loafers", price: "\u20A6 7,000", img: "#" },
  ],
  Bags: [
    { id: 5, name: "Backpack", price: "\u20A6 5,000", img: "#" },
    { id: 6, name: "Handbag", price: "\u20A6 7,500", img: "#" },
  ],
  Hats: [
    { id: 7, name: "Baseball Cap", price: "\u20A6 15,000", img: "#" },
    { id: 8, name: "Cowboy Hat", price: "\u20A6 5,000", img: "#" },
  ],
  Accessories: [
    { id: 9, name: "Sunglasses", price: "\u20A6 2,000", img: "#" },
    { id: 10, name: "Wristwatch", price: "\u20A6 5,000", img: "#" },
  ],
};

const allProducts = Object.values(productsData).flat();

const BrowseCategoriesCarousel = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const containerRef = useRef(null);

  const scroll = (dir) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: dir === "left" ? -150 : 150,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full bg-gray-50 py-6 px-6 md:px-20">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
        Browse by Category
      </h2>

      {/* Categories */}
      <div className="relative flex items-center">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 z-10 bg-white rounded-full shadow-md p-1 hover:bg-gray-100"
        >
          &lt;
        </button>

        <div
          ref={containerRef}
          className="flex space-x-4 overflow-x-auto px-8"
        >
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

      {/* Products Grid */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          {selectedCategory}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(selectedCategory === "All Products"
            ? allProducts
            : productsData[selectedCategory]
          )?.map((product) => (
            <div
              key={product.id}
              className="relative bg-white rounded-lg shadow p-3 flex flex-col items-center text-center hover:shadow-md transition"
            >
              {/* Wishlist Icon */}
              <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                <FaHeart />
              </button>

              <img
                src={product.img}
                alt={product.name}
                className="w-24 h-24 object-cover mb-2 rounded"
              />
              <h4 className="text-sm font-medium">{product.name}</h4>
              <p className="text-gray-600 text-sm">{product.price}</p>
              <button className="mt-2 bg-black text-white px-3 py-1 rounded-full text-xs hover:bg-gray-800 transition">
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
