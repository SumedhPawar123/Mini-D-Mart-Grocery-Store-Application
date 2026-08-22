import { createContext, useContext, useState, useCallback } from "react";
import api from "../api/axios.js";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await api.get("/cart");
      setCart(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const { data } = await api.post("/cart", { productId, quantity });
      setCart(data);
      toast.success("Added to cart");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add to cart");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const { data } = await api.delete(`/cart/${productId}`);
      setCart(data);
      toast.info("Item removed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not remove item");
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/cart");
      setCart({ items: [] });
    } catch (err) {
      console.error(err);
    }
  };

  const cartCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  const cartTotal =
    cart.items?.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{ cart, fetchCart, addToCart, removeFromCart, clearCart, cartCount, cartTotal, loading }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
