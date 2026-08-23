
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios.js";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Checkout = () => {
  const { cart, cartTotal, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [fulfillmentType, setFulfillmentType] = useState("pickup");
  const [scheduledDate, setScheduledDate] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || "");
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [loading, setLoading] = useState(false);

  const deliveryFee = fulfillmentType === "delivery" ? (cartTotal > 500 ? 0 : 49) : 0;
  const finalTotal = cartTotal + deliveryFee;

  const setQuickSlot = (hoursAhead) => {
    const date = new Date();
    date.setHours(date.getHours() + hoursAhead);
    const formatted = date.toISOString().slice(0, 16);
    setScheduledDate(formatted);
  };

  const handlePlaceOrder = async () => {
    if (!scheduledDate) {
      toast.error("Please select a date and time slot");
      return;
    }
    if (fulfillmentType === "delivery" && !deliveryAddress.trim()) {
      toast.error("Please provide a delivery address");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/orders", {
        fulfillmentType,
        scheduledDate,
        deliveryAddress: fulfillmentType === "delivery" ? deliveryAddress : undefined,
      });
      toast.success("Order placed successfully!");
      fetchCart();
      navigate(`/orders/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        <p className="text-sm text-gray-500 mt-1">Review your items and select fulfillment options.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Details Section */}
        <div className="md:col-span-2 space-y-6">
          {/* Step 1: Fulfillment Selection Cards */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              1. Fulfillment Method
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setFulfillmentType("pickup")}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  fulfillmentType === "pickup"
                    ? "border-brand bg-brand/5 ring-2 ring-brand/20"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div>
                  <p className="font-semibold text-sm text-gray-800">Store Pickup</p>
                  <p className="text-xs text-gray-400 mt-1">Collect from nearest store</p>
                </div>
                <span className="text-xs font-semibold text-emerald-600 mt-3">FREE</span>
              </div>

              <div
                onClick={() => setFulfillmentType("delivery")}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  fulfillmentType === "delivery"
                    ? "border-brand bg-brand/5 ring-2 ring-brand/20"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div>
                  <p className="font-semibold text-sm text-gray-800">Home Delivery</p>
                  <p className="text-xs text-gray-400 mt-1">Delivered to your doorstep</p>
                </div>
                <span className="text-xs font-semibold text-gray-600 mt-3">
                  {cartTotal > 500 ? "FREE" : "₹49"}
                </span>
              </div>
            </div>
          </div>

          {/* Step 2: Time Slot Picker */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              2. Select Slot Timing
            </p>
            
            {/* Quick Preset Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setQuickSlot(2)}
                className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border rounded-lg text-xs font-medium text-gray-700 transition"
              >
                In 2 Hours
              </button>
              <button
                type="button"
                onClick={() => setQuickSlot(24)}
                className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border rounded-lg text-xs font-medium text-gray-700 transition"
              >
                Tomorrow Same Time
              </button>
            </div>

            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
            />
          </div>

          {/* Step 3: Delivery Address (Conditional) */}
          {fulfillmentType === "delivery" && (
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                3. Delivery Address
              </p>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter complete street address..."
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
                rows={3}
              />
            </div>
          )}
        </div>

        {/* Order Summary Drawer Sidebar */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-gray-900">Summary</h2>
              <button
                type="button"
                onClick={() => setShowOrderSummary((prev) => !prev)}
                className="text-xs text-brand font-semibold hover:underline"
              >
                {showOrderSummary ? "Hide Items" : `View Items (${cart.items?.length || 0})`}
              </button>
            </div>

            {/* Expandable Items Drawer */}
            {showOrderSummary && (
              <div className="space-y-2 border-y border-gray-100 py-3 max-h-48 overflow-y-auto">
                {cart.items?.map((item) => (
                  <div key={item._id || item.product._id} className="flex justify-between text-xs text-gray-600">
                    <span className="truncate pr-2">{item.product?.name || "Item"} x{item.quantity}</span>
                    <span className="font-medium">₹{(item.product?.price || 0) * item.quantity}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Price Calculations */}
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-medium text-gray-900">
                  {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between text-base font-bold text-gray-900">
                <span>Total Amount</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={loading || !cart.items?.length}
              className="w-full bg-brand text-white py-3 rounded-xl font-semibold shadow-sm hover:opacity-90 active:scale-[0.99] transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Placing Order...</span>
                </>
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;