import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-indigo-100 text-indigo-700",
  ready: "bg-purple-100 text-purple-700",
  out_for_delivery: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/my").then((res) => setOrders(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (orders.length === 0) return <EmptyState message="You haven't placed any orders yet." />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className="space-y-3">
        {orders.map((o) => (
          <Link
            key={o._id}
            to={`/orders/${o._id}`}
            className="block bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Order #{o._id.slice(-6).toUpperCase()}</p>
                <p className="text-sm text-gray-500">
                  {o.fulfillmentType === "pickup" ? "Store Pickup" : "Home Delivery"} · ₹{o.totalAmount}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${statusColors[o.status] || "bg-gray-100 text-gray-700"}`}>
                {o.status.replace(/_/g, " ")}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Orders;
