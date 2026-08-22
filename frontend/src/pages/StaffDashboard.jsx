// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import api from "../api/axios.js";
// import Loader from "../components/Loader.jsx";
// import EmptyState from "../components/EmptyState.jsx";

// const TABS = ["Orders", "Returns", "Inventory"];

// const orderStatuses = ["pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered", "cancelled"];

// const StaffDashboard = () => {
//   const [tab, setTab] = useState("Orders");
//   const [orders, setOrders] = useState([]);
//   const [returns, setReturns] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const loadAll = async () => {
//     setLoading(true);
//     const [ordersRes, returnsRes, productsRes] = await Promise.all([
//       api.get("/orders"),
//       api.get("/returns"),
//       api.get("/products"),
//     ]);
//     setOrders(ordersRes.data);
//     setReturns(returnsRes.data);
//     setProducts(productsRes.data);
//     setLoading(false);
//   };

//   useEffect(() => {
//     loadAll();
//   }, []);

//   const updateOrderStatus = async (id, status) => {
//     try {
//       await api.put(`/orders/${id}/status`, { status });
//       toast.success("Order status updated");
//       loadAll();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Update failed");
//     }
//   };

//   const updateReturnStatus = async (id, status) => {
//     try {
//       await api.put(`/returns/${id}/status`, { status });
//       toast.success("Return status updated");
//       loadAll();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Update failed");
//     }
//   };

//   const updateStock = async (id, stock) => {
//     try {
//       await api.put(`/products/${id}`, { stock });
//       toast.success("Stock updated");
//       loadAll();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Update failed");
//     }
//   };

//   if (loading) return <Loader />;

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">Staff Dashboard</h1>

//       <div className="flex gap-2 mb-6">
//         {TABS.map((t) => (
//           <button
//             key={t}
//             onClick={() => setTab(t)}
//             className={`px-4 py-1.5 rounded-full text-sm font-medium ${
//               tab === t ? "bg-brand text-white" : "bg-white border text-gray-600"
//             }`}
//           >
//             {t}
//           </button>
//         ))}
//       </div>

//       {tab === "Orders" && (
//         orders.length === 0 ? <EmptyState message="No orders yet." /> : (
//           <div className="space-y-3">
//             {orders.map((o) => (
//               <div key={o._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
//                 <div>
//                   <p className="font-medium">#{o._id.slice(-6).toUpperCase()} — {o.user?.name}</p>
//                   <p className="text-xs text-gray-500">
//                     {o.fulfillmentType === "pickup" ? "Pickup" : "Delivery"} · ₹{o.totalAmount}
//                     {o.scheduledDate && ` · ${new Date(o.scheduledDate).toLocaleString()}`}
//                   </p>
//                 </div>
//                 <select
//                   value={o.status}
//                   onChange={(e) => updateOrderStatus(o._id, e.target.value)}
//                   className="border rounded px-2 py-1 text-sm"
//                 >
//                   {orderStatuses.map((s) => (
//                     <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
//                   ))}
//                 </select>
//               </div>
//             ))}
//           </div>
//         )
//       )}

//       {tab === "Returns" && (
//         returns.length === 0 ? <EmptyState message="No return/exchange requests." /> : (
//           <div className="space-y-3">
//             {returns.map((r) => (
//               <div key={r._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
//                 <div>
//                   <p className="font-medium">{r.product?.name} x{r.quantity} <span className="text-xs text-gray-400 capitalize">({r.type})</span></p>
//                   <p className="text-xs text-gray-500">{r.user?.name} · {r.reason}</p>
//                 </div>
//                 <select
//                   value={r.status}
//                   onChange={(e) => updateReturnStatus(r._id, e.target.value)}
//                   className="border rounded px-2 py-1 text-sm"
//                 >
//                   <option value="requested">requested</option>
//                   <option value="approved">approved</option>
//                   <option value="rejected">rejected</option>
//                   <option value="completed">completed</option>
//                 </select>
//               </div>
//             ))}
//           </div>
//         )
//       )}

//       {tab === "Inventory" && (
//         <div className="space-y-3">
//           {products.map((p) => (
//             <div key={p._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
//               <div>
//                 <p className="font-medium">{p.name}</p>
//                 <p className="text-xs text-gray-500">₹{p.price} /{p.unit}</p>
//               </div>
//               <input
//                 type="number"
//                 min="0"
//                 defaultValue={p.stock}
//                 onBlur={(e) => updateStock(p._id, Number(e.target.value))}
//                 className="w-24 border rounded px-2 py-1 text-sm"
//               />
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default StaffDashboard;


import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";

const TABS = ["Orders", "Returns", "Inventory"];
const ORDER_STATUSES = ["pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered", "cancelled"];
const RETURN_STATUSES = ["requested", "approved", "rejected", "completed"];

const StaffDashboard = () => {
  const [tab, setTab] = useState("Orders");
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadAll = async () => {
    setLoading(true);
    try {
      const [ordersRes, returnsRes, productsRes] = await Promise.all([
        api.get("/orders"),
        api.get("/returns"),
        api.get("/products"),
      ]);
      setOrders(ordersRes.data || []);
      setReturns(returnsRes.data || []);
      setProducts(productsRes.data || []);
    } catch (err) {
      toast.error("Failed to sync dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const updateOrderStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success(`Order #${id.slice(-6).toUpperCase()} marked as ${status.replace(/_/g, " ")}`);
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Status update failed");
    }
  };

  const updateReturnStatus = async (id, status) => {
    try {
      await api.put(`/returns/${id}/status`, { status });
      toast.success("Return status updated");
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const updateStock = async (id, stock) => {
    try {
      await api.put(`/products/${id}`, { stock: Math.max(0, stock) });
      toast.success("Stock updated");
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Stock update failed");
    }
  };

  if (loading) return <Loader />;

  // Quick stats summary
  const pendingOrdersCount = orders.filter((o) => o.status === "pending").length;
  const pendingReturnsCount = returns.filter((r) => r.status === "requested").length;
  const lowStockCount = products.filter((p) => p.stock < 10).length;

  // Filtered lists based on search and status
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
          <p className="text-xs text-gray-500 mt-1">Manage orders, handle returns, and adjust inventory stock.</p>
        </div>
        <button
          onClick={loadAll}
          className="text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-2 rounded-xl transition"
        >
          🔄 Refresh Data
        </button>
      </div>

      {/* Metric Cards Bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 bg-amber-50/60 border border-amber-100 rounded-2xl">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Pending Orders</p>
          <p className="text-2xl font-extrabold text-amber-900 mt-1">{pendingOrdersCount}</p>
        </div>
        <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-2xl">
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Return Requests</p>
          <p className="text-2xl font-extrabold text-blue-900 mt-1">{pendingReturnsCount}</p>
        </div>
        <div className="p-4 bg-rose-50/60 border border-rose-100 rounded-2xl">
          <p className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Low Stock Items</p>
          <p className="text-2xl font-extrabold text-rose-900 mt-1">{lowStockCount}</p>
        </div>
      </div>

      {/* Tabs & Search Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
        <div className="flex gap-2">
          {TABS.map((t) => {
            const count =
              t === "Orders" ? orders.length : t === "Returns" ? returns.length : products.length;
            return (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setStatusFilter("all");
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  tab === t
                    ? "bg-brand text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{t}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    tab === t ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Global Search inside Tab */}
        <input
          placeholder={`Search ${tab.toLowerCase()}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-200 rounded-xl px-3.5 py-2 text-xs w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-brand/50"
        />
      </div>

      {/* Orders Tab View */}
      {tab === "Orders" && (
        <div className="space-y-4">
          {/* Status Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-medium ${
                statusFilter === "all" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              All Statuses
            </button>
            {ORDER_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-lg text-xs font-medium capitalize whitespace-nowrap ${
                  statusFilter === s ? "bg-brand text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {s.replace(/_/g, " ")}
              </button>
            ))}
          </div>

          {filteredOrders.length === 0 ? (
            <EmptyState message="No matching orders found." />
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((o) => (
                <div
                  key={o._id}
                  className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900">
                        #{o._id.slice(-6).toUpperCase()}
                      </span>
                      <span className="text-xs font-medium text-gray-500">— {o.user?.name || "Guest Customer"}</span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          o.fulfillmentType === "pickup"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {o.fulfillmentType}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Total: <span className="font-semibold text-gray-700">₹{o.totalAmount}</span>
                      {o.scheduledDate && ` · Scheduled: ${new Date(o.scheduledDate).toLocaleString()}`}
                    </p>
                  </div>

                  <select
                    value={o.status}
                    onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand/50 capitalize"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Returns Tab View */}
      {tab === "Returns" && (
        returns.length === 0 ? (
          <EmptyState message="No return/exchange requests." />
        ) : (
          <div className="space-y-3">
            {returns.map((r) => (
              <div
                key={r._id}
                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <p className="font-bold text-sm text-gray-900">
                    {r.product?.name || "Product"} <span className="text-brand font-medium">x{r.quantity}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Requested by: <span className="font-medium text-gray-700">{r.user?.name}</span> · Reason: "{r.reason}"
                  </p>
                </div>

                <select
                  value={r.status}
                  onChange={(e) => updateReturnStatus(r._id, e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand/50 capitalize"
                >
                  {RETURN_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )
      )}

      {/* Inventory Tab View with Interactive Steppers */}
      {tab === "Inventory" && (
        <div className="space-y-3">
          {filteredProducts.map((p) => (
            <div
              key={p._id}
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm text-gray-900">{p.name}</p>
                  {p.stock < 10 && (
                    <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                      Low Stock
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400">
                  ₹{p.price} / {p.unit}
                </p>
              </div>

              {/* Interactive Quantity Quick Stepper */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateStock(p._id, p.stock - 1)}
                  className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-100 flex items-center justify-center font-bold text-gray-600 transition"
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  value={p.stock}
                  onChange={(e) => {
                    const newStock = Number(e.target.value);
                    setProducts((prev) =>
                      prev.map((item) => (item._id === p._id ? { ...item, stock: newStock } : item))
                    );
                  }}
                  onBlur={(e) => updateStock(p._id, Number(e.target.value))}
                  className="w-16 text-center border border-gray-200 rounded-lg py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand/50"
                />
                <button
                  onClick={() => updateStock(p._id, p.stock + 1)}
                  className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-100 flex items-center justify-center font-bold text-gray-600 transition"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;