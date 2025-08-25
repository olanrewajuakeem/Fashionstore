import React, { useState } from "react";
import { assets } from "../assets/assets";
import { FaHeart } from "react-icons/fa";

const allProducts = [
  { id: 1, name: "Classic Tee", price: 5000, img: assets.tshirt },
  { id: 2, name: "Sneakers", price: 6000, img: assets.sneakers },
  { id: 3, name: "Backpack", price: 7000, img: assets.bag },
];

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const wishlistProducts = allProducts.filter((p) => wishlist.includes(p.id));

  return (
    <div className="bg-gray-50 min-h-screen pt-20 md:pt-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
          My Wishlist
        </h2>

        {/* Empty message */}
        {wishlistProducts.length === 0 && (
          <div className="text-center mb-8">
            <p className="text-gray-600 text-lg">
              Your wishlist is empty.
            </p>
          </div>
        )}

        {/* Wishlist items */}
        {wishlistProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {wishlistProducts.map((p) => (
              <div
                key={p.id}
                className="relative bg-white rounded-2xl shadow p-4 flex flex-col items-center text-center"
              >
                <button
                  onClick={() => toggleWishlist(p.id)}
                  className={`absolute top-3 right-3 text-xl ${
                    wishlist.includes(p.id)
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}
                >
                  <FaHeart />
                </button>
                <img
                  src={p.img}
                  alt={p.name}
                  className="h-56 w-56 object-contain rounded-xl mb-4"
                />
                <h3 className="font-semibold text-gray-800">{p.name}</h3>
                <p className="text-red-500 font-bold mt-1">
                  ₦{p.price.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
