import { useParams } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { useState } from "react";
import productsData from "../data/product";

const ProductDetails = () => {
  const { id } = useParams();
  const allProducts = Object.values(productsData).flat();
  const product = allProducts.find((p) => p.id === parseInt(id));
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <h2 className="text-center mt-40 text-xl font-semibold">
        Product not found
      </h2>
    );
  }

  return (
    <div className="container mx-auto px-6 mt-32">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex-1 flex items-center justify-center">
          <img
            src={product.img}
            alt={product.name}
            className="w-full max-w-md h-[400px] object-contain rounded-xl shadow-md"
            loading="lazy"
          />
        </div>

        <div className="flex-1 flex flex-col justify-start">
          <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
          <p className="text-2xl text-black font-semibold mt-3">{product.price}</p>
          <p className="mt-4 text-gray-600 text-sm md:text-base">
            {product.description || "This is a premium quality product you'll love."}
          </p>

          <div className="flex items-center mt-6 gap-4">
            <span className="font-medium">Quantity:</span>
            <div className="flex items-center border rounded-xl overflow-hidden">
              <button
                className="px-3 py-1 text-lg hover:bg-gray-100"
                onClick={() => setQuantity(q => (q > 1 ? q - 1 : 1))}
              >
                -
              </button>
              <span className="px-4 py-1">{quantity}</span>
              <button
                className="px-3 py-1 text-lg hover:bg-gray-100"
                onClick={() => setQuantity(q => q + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-6">
            <button className="bg-black text-white px-6 py-2 rounded-xl hover:bg-gray-800 transition">
              Add to Cart
            </button>

            <button className="flex items-center gap-2 border px-6 py-2 rounded-xl hover:bg-gray-100 transition">
              <FaHeart className="text-red-500" /> Wishlist
            </button>
          </div>

          <div className="mt-6 text-gray-500 text-sm">
            <p>Category: {product.category}</p>
            <p>Availability: In Stock</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
