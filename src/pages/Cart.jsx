import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cart, removeFromCart, updateQty, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/checkout'); // Redirect to Checkout page
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-16 sm:pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 text-gray-800">
          My Cart
        </h2>

        {cart.length === 0 ? (
          <p className="text-center text-gray-600 text-base sm:text-lg">Your cart is empty.</p>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4"
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="h-20 w-20 sm:h-24 sm:w-24 object-contain rounded-lg"
                />
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-semibold text-gray-800 text-base sm:text-lg">{item.name}</h3>
                  <p className="text-red-500 font-bold mt-1 text-sm sm:text-base">
                    ₦{Number(item.discounted_price || item.price).toLocaleString()}
                  </p>
                  <p className="text-gray-600 text-xs sm:text-sm">Category: {item.category}</p>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) => updateQty(item.id, parseInt(e.target.value))}
                    className="w-16 text-center border rounded-lg px-2 py-1 text-sm"
                    min={1}
                  />
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-600 hover:text-red-500 font-medium text-sm sm:text-base"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="text-right font-bold text-lg sm:text-xl text-gray-800">
              Total: ₦{Number(total).toLocaleString()}
            </div>
            <div className="text-right mt-4">
              <button
                onClick={handleCheckout}
                className="bg-green-500 text-white px-4 sm:px-6 py-2 rounded-full font-semibold hover:bg-green-600 transition text-sm sm:text-base"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;