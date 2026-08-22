// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import api from "../api/axios.js";
// import Loader from "../components/Loader.jsx";
// import { useAuth } from "../context/AuthContext.jsx";

// const OrderDetail = () => {
//   const { id } = useParams();
//   const { user } = useAuth();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const loadOrder = () => {
//     api.get(`/orders/${id}`).then((res) => setOrder(res.data)).finally(() => setLoading(false));
//   };

//   useEffect(() => {
//     loadOrder();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   const handleCancel = async () => {
//     try {
//       await api.put(`/orders/${id}/cancel`);
//       toast.success("Order cancelled");
//       loadOrder();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Could not cancel order");
//     }
//   };

//   if (loading) return <Loader />;
//   if (!order) return <p className="text-center py-16 text-gray-400">Order not found.</p>;

//   const canCancel =
//     user?.role === "customer" &&
//     !["out_for_delivery", "delivered", "cancelled"].includes(order.status);

//   return (
//     <div className="max-w-2xl mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-1">Order #{order._id.slice(-6).toUpperCase()}</h1>
//       <p className="text-sm text-gray-500 mb-6">
//         Status: <span className="font-medium capitalize">{order.status.replace(/_/g, " ")}</span>
//       </p>

//       <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
//         <div>
//           <p className="font-medium mb-2">Items</p>
//           {order.items.map((item, idx) => (
//             <div key={idx} className="flex justify-between text-sm py-1 border-b last:border-0">
//               <span>{item.name} x {item.quantity}</span>
//               <span>₹{item.price * item.quantity}</span>
//             </div>
//           ))}
//         </div>

//         <div className="flex justify-between font-bold border-t pt-3">
//           <span>Total</span>
//           <span>₹{order.totalAmount}</span>
//         </div>

//         <div className="text-sm text-gray-600">
//           <p>Fulfillment: {order.fulfillmentType === "pickup" ? "Store Pickup" : "Home Delivery"}</p>
//           {order.scheduledDate && (
//             <p>Scheduled: {new Date(order.scheduledDate).toLocaleString()}</p>
//           )}
//           {order.fulfillmentType === "delivery" && order.deliveryAddress && (
//             <p>Address: {order.deliveryAddress}</p>
//           )}
//         </div>

//         {canCancel && (
//           <button
//             onClick={handleCancel}
//             className="text-red-500 border border-red-300 px-4 py-1.5 rounded hover:bg-red-50 text-sm"
//           >
//             Cancel Order
//           </button>
//         )}

//         {order.status === "delivered" && user?.role === "customer" && (
//           <Link
//             to="/returns"
//             className="inline-block text-brand text-sm font-medium hover:underline"
//           >
//             Request a return / exchange →
//           </Link>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OrderDetail;


import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const ORDER_STEPS = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered"];

const statusColors = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  preparing: "bg-indigo-100 text-indigo-800 border-indigo-200",
  ready: "bg-purple-100 text-purple-800 border-purple-200",
  out_for_delivery: "bg-orange-100 text-orange-800 border-orange-200",
  delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelled: "bg-rose-100 text-rose-800 border-rose-200",
};

const OrderDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const loadOrder = () => {
    api
      .get(`/orders/${id}`)
      .then((res) => setOrder(res.data))
      .catch((err) => console.error("Error loading order:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await api.put(`/orders/${id}/cancel`);
      toast.success("Order cancelled successfully");
      setShowCancelModal(false);
      loadOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not cancel order");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <Loader />;
  if (!order)
    return (
      <div className="text-center py-16">
        <p className="text-gray-400">Order not found.</p>
        <Link to="/orders" className="text-brand text-sm font-medium mt-2 inline-block">
          ← Back to My Orders
        </Link>
      </div>
    );

  const canCancel =
    user?.role === "customer" &&
    !["out_for_delivery", "delivered", "cancelled"].includes(order.status);

  const currentStepIndex = ORDER_STEPS.indexOf(order.status);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/orders"
          className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 transition"
        >
          ← Back to Orders
        </Link>

        <button
          onClick={() => window.print()}
          className="text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition print:hidden"
        >
          🖨️ Print Receipt
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Order Info Bar */}
        <div className="p-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 bg-gray-50/50">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Order #{order._id.slice(-6).toUpperCase()}
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Placed on{" "}
              {new Date(order.createdAt || Date.now()).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>

          <span
            className={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${
              statusColors[order.status] || "bg-gray-100 text-gray-700"
            }`}
          >
            {order.status.replace(/_/g, " ")}
          </span>
        </div>

        {/* Visual Progress Stepper (Hidden if Cancelled) */}
        {order.status !== "cancelled" && (
          <div className="p-6 border-b border-gray-100 bg-white">
            <div className="flex justify-between items-center relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 z-0" />
              <div
                className="absolute top-1/2 left-0 h-1 bg-brand transition-all duration-500 -translate-y-1/2 z-0"
                style={{
                  width: `${
                    currentStepIndex >= 0
                      ? (currentStepIndex / (ORDER_STEPS.length - 1)) * 100
                      : 0
                  }%`,
                }}
              />

              {ORDER_STEPS.map((step, idx) => {
                const isDone = idx <= currentStepIndex;
                return (
                  <div key={step} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                        isDone
                          ? "bg-brand text-white border-brand"
                          : "bg-white text-gray-400 border-gray-200"
                      }`}
                    >
                      {isDone ? "✓" : idx + 1}
                    </div>
                    <span className="text-[10px] font-medium text-gray-500 capitalize mt-2 hidden sm:block">
                      {step.replace(/_/g, " ")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Order Content */}
        <div className="p-6 space-y-6">
          {/* Items List */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Items Ordered
            </h3>
            <div className="divide-y divide-gray-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-lg bg-gray-50"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-400">
                        ₹{item.price} x {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Fulfillment Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl text-sm">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Fulfillment Type
              </p>
              <p className="font-medium text-gray-800">
                {order.fulfillmentType === "pickup" ? "🏬 Store Pickup" : "🚚 Home Delivery"}
              </p>
              {order.scheduledDate && (
                <p className="text-xs text-gray-500 mt-1">
                  Scheduled: {new Date(order.scheduledDate).toLocaleString()}
                </p>
              )}
            </div>

            {order.fulfillmentType === "delivery" && order.deliveryAddress && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Delivery Address
                </p>
                <p className="text-gray-700">{order.deliveryAddress}</p>
              </div>
            )}
          </div>

          {/* Total Breakdown */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-base font-bold text-gray-900">
              <span>Total Amount Paid</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t pt-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
            {canCancel && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-100 transition"
              >
                Cancel Order
              </button>
            )}

            {order.status === "delivered" && user?.role === "customer" && (
              <Link
                to="/returns"
                className="text-xs font-semibold text-brand bg-brand/10 hover:bg-brand hover:text-white px-4 py-2 rounded-lg transition ml-auto"
              >
                Request Return / Exchange →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Cancellation */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">Cancel Order?</h3>
            <p className="text-sm text-gray-500">
              Are you sure you want to cancel Order #{order._id.slice(-6).toUpperCase()}? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={cancelling}
                className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition flex items-center gap-2"
              >
                {cancelling && (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;