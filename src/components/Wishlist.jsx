import React from "react";
import { FaHeart } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext"; // ✅ we will create this
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const { wishlistItems, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen pt-20 md:pt-20">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
          My Wishlist
        </h2>

        {wishlistItems.length === 0 ? (
          <div className="text-center mb-8">
            <p className="text-gray-600 text-lg">Your wishlist is empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {wishlistItems.map((p) => (
              <div
                key={p.id}
                className="relative bg-white rounded-2xl shadow p-4 flex flex-col items-center text-center cursor-pointer hover:shadow-lg transition"
              >
                {/* Toggle wishlist */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent navigating to product
                    toggleWishlist(p.id);
                  }}
                  className={`absolute top-3 right-3 text-xl ${
                    p.isInWishlist ? "text-red-500" : "text-gray-400"
                  }`}
                >
                  <FaHeart />
                </button>

                {/* Navigate to product details */}
                <div
                  onClick={() => navigate(`/product/${p.id}`)}
                  className="flex flex-col items-center"
                >
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
