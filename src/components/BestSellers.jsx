
import React from "react";
import { useNavigate } from "react-router-dom";
import productsData from "../data/product";

const BestSellers = () => {
  const navigate = useNavigate();

  const allProducts = Object.values(productsData).flat();

  const bestSellers = allProducts.filter((p) => p.isBestSeller);

  return (
    <div className="py-12 px-6 bg-gray-50">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
        Best Sellers
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {bestSellers.map((product) => (
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
            <p className="text-lg font-bold text-black mt-2">  ₦{Number(product.price).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSellers;
