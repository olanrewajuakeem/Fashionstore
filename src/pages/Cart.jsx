import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const Cart = () => {
  const { cart, removeFromCart, updateQty, total } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (!user) {
      navigate('/login')
      return
    }
    alert('Checkout not implemented yet!')
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-20 md:pt-20">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
          My Cart
        </h2>

        {cart.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">Your cart is empty.</p>
        ) : (
          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow p-4 flex items-center justify-between space-x-4"
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="h-24 w-24 object-contain rounded-xl"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-red-500 font-bold mt-1">
                    ₦{Number(item.price).toLocaleString()}
                  </p>
                  <p className="text-gray-600 text-sm">Category: {item.category}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) => updateQty(item.id, parseInt(e.target.value))}
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

            <div className="text-right font-bold text-xl text-gray-800">
              Total: ₦{Number(total).toLocaleString()}
            </div>

            <div className="text-right">
              <button
                onClick={handleCheckout}
                className="bg-green-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-600 transition"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart