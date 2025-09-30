import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  const refreshCart = async () => {
    if (!user || !user.token) {
      console.log("No user or token, skipping cart refresh");
      setCart([]);
      return;
    }
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/cart", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log("Refreshed cart from backend:", JSON.stringify(response.data, null, 2)); // Debug log
      setCart(
        response.data.map((item) => ({
          id: item.id,
          product_id: parseInt(item.product_id) || null, // Ensure integer or null
          name: item.product?.name || "Unknown",
          price: item.price || 0,
          discounted_price: item.product?.discounted_price || item.price || 0,
          qty: item.quantity || 1,
          image_url: item.product?.image_url || null,
          category: item.product?.category || "Unknown",
        }))
      );
    } catch (err) {
      console.error("Failed to refresh cart:", err.response?.data || err.message);
      toast.error(`Failed to refresh cart: ${err.response?.data?.message || err.message}`);
      setCart([]);
    }
  };

  useEffect(() => {
    if (user && user.token) {
      console.log("User logged in, refreshing cart:", JSON.stringify(user, null, 2)); // Debug log
      refreshCart();
    } else {
      console.log("No user, loading cart from localStorage");
      const storedCart = localStorage.getItem("cart");
      console.log("Stored cart from localStorage:", storedCart); // Debug log
      setCart(storedCart ? JSON.parse(storedCart) : []);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      console.log("Saving cart to localStorage:", JSON.stringify(cart, null, 2)); // Debug log
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = async (product) => {
    if (!product || !product.id || isNaN(parseInt(product.id))) {
      console.error("Invalid product:", JSON.stringify(product, null, 2)); // Debug log
      toast.error("Invalid product data");
      return;
    }
    if (user && user.token) {
      try {
        console.log("Adding to cart (user):", JSON.stringify(product, null, 2)); // Debug log
        const productId = parseInt(product.id);
        if (isNaN(productId)) {
          console.error("Invalid product ID:", product.id);
          toast.error("Invalid product ID");
          return;
        }
        const payload = { product_id: productId, quantity: product.qty || 1 };
        console.log("Sending addToCart payload:", JSON.stringify(payload, null, 2)); // Debug log
        await axios.post(
          "http://127.0.0.1:5000/api/cart",
          payload,
          { headers: { Authorization: `Bearer ${user.token}`, "Content-Type": "application/json" } }
        );
        await refreshCart();
        toast.success(`${product.name || "Item"} added to cart 🛒`);
      } catch (err) {
        console.error("Failed to add to cart:", err.response?.data || err.message);
        console.log("Error response:", JSON.stringify(err.response?.data, null, 2)); // Debug log
        toast.error(`Failed to add to cart: ${err.response?.data?.message || err.message}`);
      }
    } else {
      console.log("Adding to cart (no user):", JSON.stringify(product, null, 2)); // Debug log
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
              id: product.id,
              product_id: parseInt(product.id) || null, // Ensure integer
              qty: product.qty || 1,
              image_url: product.image_url || product.img || null,
              discounted_price: product.discounted_price || product.price || 0,
            },
          ];
      setCart(updatedCart);
      toast.success(`${product.name || "Item"} added to cart 🛒`);
    }
  };

  const removeFromCart = async (cartItemId) => {
    if (user && user.token) {
      try {
        const cartItem = cart.find((item) => item.id === cartItemId);
        if (!cartItem) {
          console.error("Cart item not found:", cartItemId);
          toast.error("Cart item not found");
          return;
        }
        console.log("Removing cart item:", JSON.stringify(cartItem, null, 2)); // Debug log
        const productId = parseInt(cartItem.product_id);
        if (isNaN(productId)) {
          console.error("Invalid product ID for removal:", cartItem.product_id);
          toast.error("Invalid product ID");
          await refreshCart();
          return;
        }
        const payload = { product_id: productId };
        console.log("Sending removeFromCart payload:", JSON.stringify(payload, null, 2)); // Debug log
        await axios.delete("http://127.0.0.1:5000/api/cart", {
          headers: { Authorization: `Bearer ${user.token}`, "Content-Type": "application/json" },
          data: payload,
        });
        setCart(cart.filter((item) => item.id !== cartItemId));
        toast.error(`${cartItem.name || "Item"} removed from cart`);
      } catch (err) {
        console.error("Failed to remove from cart:", err.response?.data || err.message);
        console.log("Error response:", JSON.stringify(err.response?.data, null, 2)); // Debug log
        toast.error(`Failed to remove from cart: ${err.response?.data?.message || err.message}`);
      }
    } else {
      const removed = cart.find((item) => item.id === cartItemId);
      setCart(cart.filter((item) => item.id !== cartItemId));
      if (removed) toast.error(`${removed.name || "Item"} removed from cart`);
    }
  };

  const updateQty = async (cartItemId, qty) => {
    if (user && user.token) {
      try {
        await refreshCart();
        const cartItem = cart.find((item) => item.id === cartItemId);
        if (!cartItem) {
          console.error("Cart item not found:", cartItemId);
          toast.error("Cart item not found");
          return;
        }
        console.log("Updating cart item:", JSON.stringify(cartItem, null, 2)); // Debug log
        console.log("Product ID:", cartItem.product_id, "Quantity:", qty); // Debug log
        if (qty < 1) {
          toast.warn("Minimum quantity is 1");
          return;
        }
        if (qty > 10) {
          toast.warn("Maximum quantity is 10");
          return;
        }
        const productId = parseInt(cartItem.product_id);
        if (isNaN(productId)) {
          console.error("Invalid product ID:", cartItem.product_id);
          toast.error("Invalid product ID");
          await refreshCart();
          return;
        }
        const payload = {
          product_id: productId,
          quantity: qty,
          absolute: true,
        };
        console.log("Sending updateQty payload:", JSON.stringify(payload, null, 2)); // Debug log
        await axios.post(
          "http://127.0.0.1:5000/api/cart",
          payload,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "application/json",
            },
          }
        );
        await refreshCart();
        toast.success(`Updated quantity for ${cartItem.name || "Item"}`);
      } catch (err) {
        console.error("Failed to update cart:", err.response?.data || err.message);
        console.log("Error response:", JSON.stringify(err.response?.data, null, 2)); // Debug log
        toast.error(`Failed to update quantity: ${err.response?.data?.message || err.message}`);
      }
    } else {
      const updatedCart = cart.map((item) =>
        item.id === cartItemId ? { ...item, qty: Math.max(1, Math.min(10, qty)) } : item
      );
      setCart(updatedCart);
      const updatedItem = updatedCart.find((item) => item.id === cartItemId);
      if (updatedItem) {
        toast.success(`Updated quantity for ${updatedItem.name || "Item"}`);
      }
    }
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
    toast.success("Cart cleared");
  };

  const cartCount = cart.reduce((sum, item) => sum + (item.qty || 0), 0);
  const total = cart.reduce(
    (sum, item) =>
      sum + ((item.discounted_price || item.price || 0) * (item.qty || 0)),
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