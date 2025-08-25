
import { assets } from "../assets/assets";

const DiscountsSection = () => {
  const products = [
    { id: 1, name: "Summer Dress", price: 50000, oldPrice: 90000, img: assets.dress },
    { id: 2, name: "Casual Sneakers", price: 40000, oldPrice: 25000, img: assets.sneakers },
    { id: 3, name: "Denim Jacket", price: 60000, oldPrice: 120000, img: assets.jacket },
  ];

  return (
    <div className="py-12 px-6 bg-gray-100">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
        Discounts up to <span className="text-red-500">-50%</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl shadow hover:shadow-lg p-4 transition flex flex-col items-center text-center"
          >
            {/* Product Image */}
            <img
              src={p.img}
              alt={p.name}
              className="h-56 w-56 object-contain rounded-xl"
            />

            {/* Product Name */}
            <h3 className="mt-4 font-semibold text-gray-800">{p.name}</h3>

            {/* Price */}
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-lg font-bold text-red-500">₦{p.price.toLocaleString()}</span>
              <span className="text-gray-400 line-through">₦{p.oldPrice.toLocaleString()}</span>
            </div>

            {/* Add to Cart Button */}
            <button className="mt-3 w-full bg-black text-white py-2 rounded-xl hover:bg-gray-800 transition">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscountsSection;
