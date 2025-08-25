import React, { useState } from "react";
import { assets } from "../assets/assets";

const allProducts = [
  { id: 1, name: "Classic Tee", price: 5000, img: assets.tshirt },
  { id: 2, name: "Sneakers", price: 6000, img: assets.sneakers },
  { id: 3, name: "Backpack", price: 7000, img: assets.bag },
];

const Cart = () => {
  const [cart, setCart] = useState([]);

  const addToCart = (productId) => {
    const exists = cart.find((item) => item.id === productId);
    if (exists) {
      setCart(
        cart.map((item) =>
          item.id === productId ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      const product = allProducts.find((p) => p.id === productId);
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateQty = (productId, qty) => {
    setCart(
      cart.map((item) =>
        item.id === productId ? { ...item, qty: Math.max(1, qty) } : item
      )
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="bg-gray-50 min-h-screen pt-20 md:pt-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
          My Cart
        </h2>

        {/* Empty cart message */}
        {cart.length === 0 && (
          <div className="text-center mb-8">
            <p className="text-gray-600 text-lg">Your cart is empty.</p>
          </div>
        )}

        {/* Cart items */}
        {cart.length > 0 && (
          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow p-4 flex items-center justify-between space-x-4"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="h-24 w-24 object-contain rounded-xl"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-red-500 font-bold mt-1">
                    ₦{item.price.toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) =>
                      updateQty(item.id, parseInt(e.target.value))
                    }
                    className="w-16 text-center border rounded-lg px-2 py-1"
                    min={1}
                  />
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-600 hover:text-red-500 font-bold"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Total and checkout */}
            <div className="text-right font-bold text-xl text-gray-800">
              Total: ₦{total.toLocaleString()}
            </div>

            <div className="text-right">
              <button className="bg-black text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-800 transition">
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
