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
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/orders", {
        fulfillmentType,
        scheduledDate,
        deliveryAddress,
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
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-5">
        <div>
          <p className="font-medium mb-2">Fulfillment Type</p>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={fulfillmentType === "pickup"}
                onChange={() => setFulfillmentType("pickup")}
              />
              Store Pickup
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={fulfillmentType === "delivery"}
                onChange={() => setFulfillmentType("delivery")}
              />
              Home Delivery
            </label>
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">
            {fulfillmentType === "pickup" ? "Pickup Date & Time" : "Delivery Date & Time"}
          </label>
          <input
            type="datetime-local"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {fulfillmentType === "delivery" && (
          <div>
            <label className="block font-medium mb-1">Delivery Address</label>
            <textarea
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="w-full border rounded px-3 py-2"
              rows={3}
            />
          </div>
        )}

        <div className="border-t pt-4 flex items-center justify-between">
          <span className="font-bold text-lg">Total: ₹{cartTotal}</span>
          <button
            onClick={handlePlaceOrder}
            disabled={loading || !cart.items?.length}
            className="bg-brand text-white px-6 py-2 rounded hover:bg-brand-dark disabled:opacity-60"
          >
            {loading ? "Placing order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
