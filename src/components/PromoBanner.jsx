import React from "react";
import { useNavigate } from "react-router-dom";
import productsData from "../data/product";

const PromoBanner = () => {
  const navigate = useNavigate();

  const allProducts = Object.values(productsData).flat();

const promoProducts = allProducts.filter((p) => p.isPromo);
const promoProduct = promoProducts[Math.floor(Math.random() * promoProducts.length)];


  if (!promoProduct) return null; 

  return (
    <div className="relative my-12 max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-lg bg-gray-800">
      <div className="flex flex-col items-center justify-center text-center text-white p-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          {promoProduct.promoTitle || "Special Promo!"}
        </h2>
        <p className="mb-6 text-sm md:text-base">
          {promoProduct.promoDescription || "Check out this amazing offer!"}
        </p>
        <button
          onClick={() => navigate(`/product/${promoProduct.id}`)}
          className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition"
        >
          Shop Now
        </button>
      </div>
    </div>
  );
};

export default PromoBanner;
