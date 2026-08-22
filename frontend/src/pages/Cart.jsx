// import { useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useCart } from "../context/CartContext.jsx";
// import EmptyState from "../components/EmptyState.jsx";

// const Cart = () => {
//   const { cart, fetchCart, removeFromCart, cartTotal } = useCart();
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchCart();
//   }, [fetchCart]);

//   if (!cart.items || cart.items.length === 0) {
//     return (
//       <div className="max-w-3xl mx-auto px-4">
//         <EmptyState message="Your cart is empty." />
//         <div className="text-center">
//           <Link to="/" className="text-brand font-medium">Browse products</Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-3xl mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
//       <div className="space-y-3">
//         {cart.items.map((item) => (
//           <div key={item.product._id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
//             <div>
//               <p className="font-medium">{item.product.name}</p>
//               <p className="text-sm text-gray-500">
//                 ₹{item.product.price} x {item.quantity} = ₹{item.product.price * item.quantity}
//               </p>
//             </div>
//             <button
//               onClick={() => removeFromCart(item.product._id)}
//               className="text-red-500 text-sm hover:underline"
//             >
//               Remove
//             </button>
//           </div>
//         ))}
//       </div>

//       <div className="mt-6 flex items-center justify-between border-t pt-4">
//         <span className="text-lg font-bold">Total: ₹{cartTotal}</span>
//         <button
//           onClick={() => navigate("/checkout")}
//           className="bg-brand text-white px-6 py-2 rounded hover:bg-brand-dark"
//         >
//           Proceed to Checkout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Cart;

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import EmptyState from "../components/EmptyState.jsx";

const Cart = () => {
  const { cart, fetchCart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [loadingItemId, setLoadingItemId] = useState(null);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "SAVE10") {
      setDiscount(0.1); // 10% discount
      setPromoError("");
    } else {
      setPromoError("Invalid code. Try 'SAVE10'");
      setDiscount(0);
    }
  };

  const handleQuantityChange = async (productId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    setLoadingItemId(productId);
    try {
      if (updateQuantity) {
        await updateQuantity(productId, newQty);
      }
    } finally {
      setLoadingItemId(null);
    }
  };

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <EmptyState message="Your cart is empty." />
        <div className="mt-4">
          <Link
            to="/"
            className="inline-block bg-brand text-white px-6 py-2 rounded-lg font-medium shadow-sm hover:opacity-90 transition"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const discountAmount = cartTotal * discount;
  const finalTotal = cartTotal - discountAmount;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Item List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => {
            const isLoading = loadingItemId === item.product._id;
            return (
              <div
                key={item.product._id}
                className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 transition hover:shadow-md"
              >
                {/* Product Image */}
                {item.product.image && (
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg bg-gray-50 flex-shrink-0"
                  />
                )}

                {/* Details & Interactive Controls */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    ₹{item.product.price} each
                  </p>

                  <div className="flex items-center gap-3 mt-3">
                    {/* Quantity Buttons */}
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          handleQuantityChange(item.product._id, item.quantity, -1)
                        }
                        disabled={item.quantity <= 1 || isLoading}
                        className="px-3 py-1 bg-gray-50 hover:bg-gray-100 disabled:opacity-40 text-gray-600 font-semibold transition"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 text-sm font-medium text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.product._id, item.quantity, 1)
                        }
                        disabled={isLoading}
                        className="px-3 py-1 bg-gray-50 hover:bg-gray-100 disabled:opacity-40 text-gray-600 font-semibold transition"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove Action */}
                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium transition ml-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="text-right font-semibold text-gray-900">
                  ₹{item.product.price * item.quantity}
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>

          {/* Price Breakdown */}
          <div className="space-y-3 text-sm border-b pb-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium text-gray-800">₹{cartTotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Discount ({(discount * 100)}%)</span>
                <span>-₹{discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
          </div>

          {/* Promo Code Input */}
          <form onSubmit={handleApplyPromo} className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Promo Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition"
              >
                Apply
              </button>
            </div>
            {promoError && <p className="text-xs text-red-500">{promoError}</p>}
            {discount > 0 && (
              <p className="text-xs text-green-600">Promo code applied!</p>
            )}
          </form>

          {/* Total & Checkout */}
          <div className="border-t pt-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-xl font-bold text-gray-900">₹{finalTotal}</span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-brand text-white py-3 rounded-lg font-semibold hover:opacity-90 active:scale-[0.98] transition shadow-md"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
