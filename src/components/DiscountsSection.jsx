import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";

const DiscountsSection = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiscountedProducts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/discounted-products");
        setDiscountedProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load discounted products");
        setLoading(false);
      }
    };

    fetchDiscountedProducts();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <div className="py-12 px-6 bg-gray-100">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
        Discounts up to <span className="text-red-500">-50%</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {discountedProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => navigate(`/product/${product.id}`)}
            className="bg-white rounded-2xl shadow hover:shadow-lg p-4 transition flex flex-col items-center text-center cursor-pointer"
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="h-56 w-56 object-contain rounded-xl"
            />

            <h3 className="mt-4 font-semibold text-gray-800">{product.name}</h3>

            <div className="flex items-center space-x-2 mt-2">
              <span className="text-lg font-bold text-red-500">
                ₦{Number(product.discounted_price).toLocaleString()}
              </span>
              {product.discount_percentage > 0 && (
                <span className="text-gray-400 line-through">
                  ₦{Number(product.price).toLocaleString()}
                </span>
              )}
            </div>

            <button
              className="mt-3 w-full bg-green-500 text-white py-2 rounded-xl hover:bg-green-600 transition"
              onClick={(e) => {
                e.stopPropagation();
                addToCart({ ...product, qty: 1 });
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscountsSection;