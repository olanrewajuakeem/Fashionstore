import React from "react";
import { useNavigate } from "react-router-dom";
import productsData from "../data/product";
import { useCart } from "../context/CartContext"; 

const DiscountsSection = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart(); 

  const allProducts = Object.values(productsData).flat();
  const discountedProducts = allProducts.filter((p) => p.isDiscounted);

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
              src={product.img}
              alt={product.name}
              className="h-56 w-56 object-contain rounded-xl"
            />

            <h3 className="mt-4 font-semibold text-gray-800">{product.name}</h3>

            <div className="flex items-center space-x-2 mt-2">
              <span className="text-lg font-bold text-red-500">
                ₦{Number(product.price).toLocaleString()}
              </span>
              {product.oldPrice && (
                <span className="text-gray-400 line-through">
                  ₦{Number(product.oldPrice).toLocaleString()}
                </span>
              )}
            </div>

            <button
              className="mt-3 w-full bg-black text-white py-2 rounded-xl hover:bg-gray-800 transition"
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
