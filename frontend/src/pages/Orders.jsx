// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import api from "../api/axios.js";
// import Loader from "../components/Loader.jsx";
// import EmptyState from "../components/EmptyState.jsx";

// const statusColors = {
//   pending: "bg-yellow-100 text-yellow-700",
//   confirmed: "bg-blue-100 text-blue-700",
//   preparing: "bg-indigo-100 text-indigo-700",
//   ready: "bg-purple-100 text-purple-700",
//   out_for_delivery: "bg-orange-100 text-orange-700",
//   delivered: "bg-green-100 text-green-700",
//   cancelled: "bg-red-100 text-red-700",
// };

// const Orders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api.get("/orders/my").then((res) => setOrders(res.data)).finally(() => setLoading(false));
//   }, []);

//   if (loading) return <Loader />;
//   if (orders.length === 0) return <EmptyState message="You haven't placed any orders yet." />;

//   return (
//     <div className="max-w-3xl mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">My Orders</h1>
//       <div className="space-y-3">
//         {orders.map((o) => (
//           <Link
//             key={o._id}
//             to={`/orders/${o._id}`}
//             className="block bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md"
//           >
//             <div className="flex justify-between items-center">
//               <div>
//                 <p className="font-medium">Order #{o._id.slice(-6).toUpperCase()}</p>
//                 <p className="text-sm text-gray-500">
//                   {o.fulfillmentType === "pickup" ? "Store Pickup" : "Home Delivery"} · ₹{o.totalAmount}
//                 </p>
//               </div>
//               <span className={`text-xs px-2 py-1 rounded-full ${statusColors[o.status] || "bg-gray-100 text-gray-700"}`}>
//                 {o.status.replace(/_/g, " ")}
//               </span>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Orders;


import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";

const statusColors = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  preparing: "bg-indigo-100 text-indigo-800 border-indigo-200",
  ready: "bg-purple-100 text-purple-800 border-purple-200",
  out_for_delivery: "bg-orange-100 text-orange-800 border-orange-200",
  delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelled: "bg-rose-100 text-rose-800 border-rose-200",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    api
      .get("/orders/my")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error fetching orders:", err))
      .finally(() => setLoading(false));
  }, []);

  const toggleExpand = (id, e) => {
    // Prevent toggle when clicking specific action buttons
    if (e.target.closest(".no-expand")) return;
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  if (loading) return <Loader />;
  if (!orders || orders.length === 0)
    return <EmptyState message="You haven't placed any orders yet." />;

  // Filtering Logic
  const filteredOrders = orders.filter((o) => {
    const matchesFilter =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? !["delivered", "cancelled"].includes(o.status)
        : o.status === statusFilter;

    const shortId = o._id.slice(-6).toLowerCase();
    const matchesSearch =
      shortId.includes(searchQuery.toLowerCase()) ||
      o.items?.some((i) =>
        i.product?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>

        {/* Search Bar */}
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            placeholder="Search by Order ID or item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <svg
            className="w-4 h-4 text-gray-400 absolute left-3 top-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
        {["all", "active", "delivered", "cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition ${
              statusFilter === tab
                ? "bg-gray-900 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-500 text-sm">
          No orders found matching your search or filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((o) => {
            const isExpanded = expandedOrderId === o._id;
            const orderDate = new Date(o.createdAt || Date.now()).toLocaleDateString(
              "en-IN",
              { month: "short", day: "numeric", year: "numeric" }
            );

            return (
              <div
                key={o._id}
                onClick={(e) => toggleExpand(o._id, e)}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:border-gray-300 transition-all cursor-pointer overflow-hidden"
              >
                {/* Header Summary Row */}
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-sm">
                      📦
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          Order #{o._id.slice(-6).toUpperCase()}
                        </span>
                        <span
                          className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${
                            statusColors[o.status] || "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {o.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {orderDate} · {o.fulfillmentType === "pickup" ? "Store Pickup" : "Home Delivery"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-50">
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-gray-400">Total Amount</p>
                      <p className="font-bold text-gray-900">₹{o.totalAmount}</p>
                    </div>

                    <div className="flex items-center gap-2 no-expand">
                      <Link
                        to={`/orders/${o._id}`}
                        className="px-3 py-1.5 text-xs font-medium text-brand bg-brand/10 hover:bg-brand hover:text-white rounded-lg transition"
                      >
                        Details
                      </Link>
                      <button
                        type="button"
                        className="p-1.5 text-gray-400 hover:text-gray-600 transition"
                        aria-label="Expand order"
                      >
                        <svg
                          className={`w-4 h-4 transform transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Inline Collapsible Items Preview */}
                {isExpanded && (
                  <div className="bg-gray-50/70 border-t border-gray-100 p-4 space-y-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Order Items
                    </p>
                    <div className="space-y-2">
                      {o.items?.map((item, idx) => (
                        <div
                          key={item.product?._id || idx}
                          className="flex items-center justify-between text-sm bg-white p-2.5 rounded-lg border border-gray-100"
                        >
                          <div className="flex items-center gap-3">
                            {item.product?.image && (
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-8 h-8 object-cover rounded"
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-800">
                                {item.product?.name || "Product"}
                              </p>
                              <p className="text-xs text-gray-500">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <span className="font-semibold text-gray-700">
                            ₹{(item.product?.price || 0) * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;