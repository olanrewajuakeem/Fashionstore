import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      axios
        .get("http://127.0.0.1:5000/api/cart", {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((response) => {
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
          console.error("Failed to fetch cart:", err);
        });
    } else {
      const storedCart = localStorage.getItem("cart");
      setCart(storedCart ? JSON.parse(storedCart) : []);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = async (product) => {
    if (user) {
      try {
        await axios.post(
          "http://127.0.0.1:5000/api/cart",
          { product_id: product.id, quantity: product.qty || 1 },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        const response = await axios.get("http://127.0.0.1:5000/api/cart", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
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
        toast.success(`${product.name} added to cart 🛒`);
      } catch (err) {
        console.error("Failed to add to cart:", err);
        toast.error("Failed to add to cart");
      }
    } else {
      const exists = cart.find((item) => item.id === product.id);
      const updatedCart = exists
        ? cart.map((item) =>
            item.id === product.id
              ? { ...item, qty: item.qty + (product.qty || 1) }
              : item
          )
        : [
            ...cart,
            {
              ...product,
              qty: product.qty || 1,
              image_url: product.image_url || product.img,
              discounted_price: product.discounted_price || product.price,
            },
          ];
      setCart(updatedCart);
      toast.success(`${product.name} added to cart 🛒`);
    }
  };

  const removeFromCart = async (cartItemId) => {
    if (user) {
      try {
        const cartItem = cart.find((item) => item.id === cartItemId);
        if (!cartItem) return;
        await axios.delete("http://127.0.0.1:5000/api/cart", {
          headers: { Authorization: `Bearer ${user.token}` },
          data: { product_id: cartItem.product_id },
        });
        setCart(cart.filter((item) => item.id !== cartItemId));
        toast.error(`${cartItem.name} removed from cart`);
      } catch (err) {
        console.error("Failed to remove from cart:", err);
      }
    } else {
      const removed = cart.find((item) => item.id === cartItemId);
      setCart(cart.filter((item) => item.id !== cartItemId));
      if (removed) toast.error(`${removed.name} removed from cart`);
    }
  };

  const updateQty = async (cartItemId, qty) => {
    if (user) {
      try {
        const cartItem = cart.find((item) => item.id === cartItemId);
        if (!cartItem) return;
        await axios.post(
          "http://127.0.0.1:5000/api/cart",
          { product_id: cartItem.product_id, quantity: Math.max(1, qty) },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        const response = await axios.get("http://127.0.0.1:5000/api/cart", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
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
        toast.success(`Updated quantity for ${cartItem.name}`);
      } catch (err) {
        console.error("Failed to update cart:", err);
      }
    } else {
      setCart(
        cart.map((item) =>
          item.id === cartItemId ? { ...item, qty: Math.max(1, qty) } : item
        )
      );
      const updated = cart.find((item) => item.id === cartItemId);
      if (updated) toast.success(`Updated quantity for ${updated.name}`);
    }
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
    toast.success("Cart cleared");
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce(
    (sum, item) =>
      sum + (item.discounted_price || item.price) * item.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        total,
        clearCart,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
export { CartContext };
