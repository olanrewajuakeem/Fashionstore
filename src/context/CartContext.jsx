import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      axios
        .get('/api/cart', {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((response) => {
          setCart(
            response.data.map((item) => ({
              id: item.id,
              product_id: item.product_id,
              name: item.name,
              price: item.price,
              qty: item.quantity,
              image_url: item.image_url,
              category: item.category,
            }))
          )
        })
        .catch((err) => {
          console.error('Failed to fetch cart:', err.response?.data?.message)
        })
    } else {
      const storedCart = localStorage.getItem('cart')
      setCart(storedCart ? JSON.parse(storedCart) : [])
    }
  }, [user])

  useEffect(() => {
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }, [cart, user])

  const addToCart = async (product) => {
    if (user) {
      try {
        await axios.post(
          '/api/cart',
          { product_id: product.id, quantity: product.qty || 1 },
          { headers: { Authorization: `Bearer ${user.token}` } }
        )
        const response = await axios.get('/api/cart', {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        setCart(
          response.data.map((item) => ({
            id: item.id,
            product_id: item.product_id,
            name: item.name,
            price: item.price,
            qty: item.quantity,
            image_url: item.image_url,
            category: item.category,
          }))
        )
      } catch (err) {
        console.error('Failed to add to cart:', err.response?.data?.message)
      }
    } else {
      const exists = cart.find((item) => item.id === product.id)
      if (exists) {
        setCart(
          cart.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + (product.qty || 1) } : item
          )
        )
      } else {
        setCart([...cart, { ...product, qty: product.qty || 1, image_url: product.img }])
      }
    }
  }

  const removeFromCart = async (cartItemId) => {
    if (user) {
      try {
        await axios.delete(`/api/cart/${cartItemId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        setCart(cart.filter((item) => item.id !== cartItemId))
      } catch (err) {
        console.error('Failed to remove from cart:', err.response?.data?.message)
      }
    } else {
      setCart(cart.filter((item) => item.id !== cartItemId))
    }
  }

  const updateQty = async (cartItemId, qty) => {
    if (user) {
      try {
        await axios.put(
          `/api/cart/${cartItemId}`,
          { quantity: Math.max(1, qty) },
          { headers: { Authorization: `Bearer ${user.token}` } }
        )
        setCart(
          cart.map((item) =>
            item.id === cartItemId ? { ...item, qty: Math.max(1, qty) } : item
          )
        )
      } catch (err) {
        console.error('Failed to update cart:', err.response?.data?.message)
      }
    } else {
      setCart(
        cart.map((item) =>
          item.id === cartItemId ? { ...item, qty: Math.max(1, qty) } : item
        )
      )
    }
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, total }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)