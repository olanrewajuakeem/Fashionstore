import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      axios
        .get('http://127.0.0.1:5000/api/cart', {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((response) => {
          console.log('Fetched cart:', JSON.stringify(response.data, null, 2));
          setCart(
            response.data.map((item) => ({
              id: item.id,
              product_id: item.product_id,
              name: item.product.name,
              price: item.price,
              discounted_price: item.product.discounted_price,
              qty: item.quantity,
              image_url: item.product.image_url,
              category: item.product.category,
            }))
          );
        })
        .catch((err) => {
          console.error('Failed to fetch cart:', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
          });
        });
    } else {
      const storedCart = localStorage.getItem('cart');
      setCart(storedCart ? JSON.parse(storedCart) : []);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = async (product) => {
    if (user) {
      try {
        await axios.post(
          'http://127.0.0.1:5000/api/cart',
          { product_id: product.id, quantity: product.qty || 1 },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        const response = await axios.get('http://127.0.0.1:5000/api/cart', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        console.log('Updated cart after add:', JSON.stringify(response.data, null, 2));
        setCart(
          response.data.map((item) => ({
            id: item.id,
            product_id: item.product_id,
            name: item.product.name,
            price: item.price,
            discounted_price: item.product.discounted_price,
            qty: item.quantity,
            image_url: item.product.image_url,
            category: item.product.category,
          }))
        );
      } catch (err) {
        console.error('Failed to add to cart:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
      }
    } else {
      const exists = cart.find((item) => item.id === product.id);
      let updatedCart;
      if (exists) {
        updatedCart = cart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + (product.qty || 1) } : item
        );
      } else {
        updatedCart = [
          ...cart,
          {
            ...product,
            qty: product.qty || 1,
            image_url: product.image_url || product.img,
            discounted_price: product.discounted_price || product.price,
          },
        ];
      }
      setCart(updatedCart);
    }
  };

  const removeFromCart = async (cartItemId) => {
    if (user) {
      try {
        const cartItem = cart.find((item) => item.id === cartItemId);
        if (!cartItem) return;
        await axios.delete('http://127.0.0.1:5000/api/cart', {
          headers: { Authorization: `Bearer ${user.token}` },
          data: { product_id: cartItem.product_id },
        });
        console.log('Removed cart item:', cartItemId);
        setCart(cart.filter((item) => item.id !== cartItemId));
      } catch (err) {
        console.error('Failed to remove from cart:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
      }
    } else {
      setCart(cart.filter((item) => item.id !== cartItemId));
    }
  };

  const updateQty = async (cartItemId, qty) => {
    if (user) {
      try {
        const cartItem = cart.find((item) => item.id === cartItemId);
        if (!cartItem) return;
        await axios.post(
          'http://127.0.0.1:5000/api/cart',
          { product_id: cartItem.product_id, quantity: Math.max(1, qty) },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        const response = await axios.get('http://127.0.0.1:5000/api/cart', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        console.log('Updated cart after qty change:', JSON.stringify(response.data, null, 2));
        setCart(
          response.data.map((item) => ({
            id: item.id,
            product_id: item.product_id,
            name: item.product.name,
            price: item.price,
            discounted_price: item.product.discounted_price,
            qty: item.quantity,
            image_url: item.product.image_url,
            category: item.product.category,
          }))
        );
      } catch (err) {
        console.error('Failed to update cart:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
      }
    } else {
      setCart(
        cart.map((item) =>
          item.id === cartItemId ? { ...item, qty: Math.max(1, qty) } : item
        )
      );
    }
  };

  const clearCart = () => {
    console.log('clearCart called');
    if (user) {
      setCart([]);
    } else {
  
      localStorage.removeItem('cart');
      setCart([]);
    }
  };

  const total = cart.reduce((sum, item) => {
    const price = item.discounted_price || item.price;
    return sum + price * item.qty;
  }, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQty, total, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};