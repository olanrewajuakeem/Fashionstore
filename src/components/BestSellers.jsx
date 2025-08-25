
import { assets } from "../assets/assets";

const BestSellers = () => {
  const bestSellers = [
    { id: 1, name: "Leather Bag", price: 9000, img: assets.bag },
    { id: 2, name: "Sunglasses", price: 2500, img: assets.sunglasses },
    { id: 3, name: "White T-Shirt", price: 2000, img: assets.tshirt },
  ];

  return (
    <div className="py-12 px-6 bg-gray-50">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Best Sellers</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {bestSellers.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow hover:shadow-lg p-4 transition flex flex-col items-center text-center"
          >
            {/* Product Image */}
            <img
              src={item.img}
              alt={item.name}
              className="h-56 w-56 object-contain rounded-xl"
            />

            {/* Product Name */}
            <h3 className="mt-4 font-semibold text-gray-800">{item.name}</h3>

            {/* Price */}
            <p className="text-lg font-bold text-black-500 mt-2">₦{item.price.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSellers;
