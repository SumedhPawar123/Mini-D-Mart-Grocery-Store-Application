import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import EmptyState from "../components/EmptyState.jsx";

const Cart = () => {
  const { cart, fetchCart, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4">
        <EmptyState message="Your cart is empty." />
        <div className="text-center">
          <Link to="/" className="text-brand font-medium">Browse products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <div className="space-y-3">
        {cart.items.map((item) => (
          <div key={item.product._id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div>
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-gray-500">
                ₹{item.product.price} x {item.quantity} = ₹{item.product.price * item.quantity}
              </p>
            </div>
            <button
              onClick={() => removeFromCart(item.product._id)}
              className="text-red-500 text-sm hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t pt-4">
        <span className="text-lg font-bold">Total: ₹{cartTotal}</span>
        <button
          onClick={() => navigate("/checkout")}
          className="bg-brand text-white px-6 py-2 rounded hover:bg-brand-dark"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
