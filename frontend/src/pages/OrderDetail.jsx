import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const OrderDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadOrder = () => {
    api.get(`/orders/${id}`).then((res) => setOrder(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCancel = async () => {
    try {
      await api.put(`/orders/${id}/cancel`);
      toast.success("Order cancelled");
      loadOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not cancel order");
    }
  };

  if (loading) return <Loader />;
  if (!order) return <p className="text-center py-16 text-gray-400">Order not found.</p>;

  const canCancel =
    user?.role === "customer" &&
    !["out_for_delivery", "delivered", "cancelled"].includes(order.status);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">Order #{order._id.slice(-6).toUpperCase()}</h1>
      <p className="text-sm text-gray-500 mb-6">
        Status: <span className="font-medium capitalize">{order.status.replace(/_/g, " ")}</span>
      </p>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
        <div>
          <p className="font-medium mb-2">Items</p>
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm py-1 border-b last:border-0">
              <span>{item.name} x {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between font-bold border-t pt-3">
          <span>Total</span>
          <span>₹{order.totalAmount}</span>
        </div>

        <div className="text-sm text-gray-600">
          <p>Fulfillment: {order.fulfillmentType === "pickup" ? "Store Pickup" : "Home Delivery"}</p>
          {order.scheduledDate && (
            <p>Scheduled: {new Date(order.scheduledDate).toLocaleString()}</p>
          )}
          {order.fulfillmentType === "delivery" && order.deliveryAddress && (
            <p>Address: {order.deliveryAddress}</p>
          )}
        </div>

        {canCancel && (
          <button
            onClick={handleCancel}
            className="text-red-500 border border-red-300 px-4 py-1.5 rounded hover:bg-red-50 text-sm"
          >
            Cancel Order
          </button>
        )}

        {order.status === "delivered" && user?.role === "customer" && (
          <Link
            to="/returns"
            className="inline-block text-brand text-sm font-medium hover:underline"
          >
            Request a return / exchange →
          </Link>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
