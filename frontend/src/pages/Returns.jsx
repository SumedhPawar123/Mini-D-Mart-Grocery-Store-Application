// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import api from "../api/axios.js";
// import Loader from "../components/Loader.jsx";
// import EmptyState from "../components/EmptyState.jsx";

// const Returns = () => {
//   const [orders, setOrders] = useState([]);
//   const [returns, setReturns] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [form, setForm] = useState({ orderId: "", productId: "", quantity: 1, type: "return", reason: "" });

//   const loadData = async () => {
//     setLoading(true);
//     const [ordersRes, returnsRes] = await Promise.all([
//       api.get("/orders/my"),
//       api.get("/returns/my"),
//     ]);
//     setOrders(ordersRes.data.filter((o) => o.status === "delivered"));
//     setReturns(returnsRes.data);
//     setLoading(false);
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   const selectedOrder = orders.find((o) => o._id === form.orderId);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post("/returns", form);
//       toast.success("Return/exchange request submitted");
//       setForm({ orderId: "", productId: "", quantity: 1, type: "return", reason: "" });
//       loadData();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Could not submit request");
//     }
//   };

//   if (loading) return <Loader />;

//   return (
//     <div className="max-w-2xl mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">Returns & Exchanges</h1>

//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4 mb-8">
//         <p className="font-medium">Request a Return / Exchange</p>

//         {orders.length === 0 ? (
//           <p className="text-sm text-gray-400">No delivered orders eligible for return yet.</p>
//         ) : (
//           <>
//             <select
//               value={form.orderId}
//               onChange={(e) => setForm({ ...form, orderId: e.target.value, productId: "" })}
//               className="w-full border rounded px-3 py-2"
//             >
//               <option value="">Select Order</option>
//               {orders.map((o) => (
//                 <option key={o._id} value={o._id}>
//                   Order #{o._id.slice(-6).toUpperCase()} — ₹{o.totalAmount}
//                 </option>
//               ))}
//             </select>

//             {selectedOrder && (
//               <select
//                 value={form.productId}
//                 onChange={(e) => setForm({ ...form, productId: e.target.value })}
//                 className="w-full border rounded px-3 py-2"
//               >
//                 <option value="">Select Product</option>
//                 {selectedOrder.items.map((item) => (
//                   <option key={item.product} value={item.product}>{item.name}</option>
//                 ))}
//               </select>
//             )}

//             <div className="flex gap-3">
//               <select
//                 value={form.type}
//                 onChange={(e) => setForm({ ...form, type: e.target.value })}
//                 className="border rounded px-3 py-2"
//               >
//                 <option value="return">Return</option>
//                 <option value="exchange">Exchange</option>
//               </select>
//               <input
//                 type="number"
//                 min="1"
//                 value={form.quantity}
//                 onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
//                 className="w-24 border rounded px-3 py-2"
//               />
//             </div>

//             <textarea
//               placeholder="Reason"
//               value={form.reason}
//               onChange={(e) => setForm({ ...form, reason: e.target.value })}
//               className="w-full border rounded px-3 py-2"
//               rows={2}
//             />

//             <button
//               type="submit"
//               disabled={!form.orderId || !form.productId}
//               className="bg-brand text-white px-4 py-2 rounded hover:bg-brand-dark disabled:opacity-60"
//             >
//               Submit Request
//             </button>
//           </>
//         )}
//       </form>

//       <h2 className="font-semibold mb-3">My Requests</h2>
//       {returns.length === 0 ? (
//         <EmptyState message="No return/exchange requests yet." />
//       ) : (
//         <div className="space-y-3">
//           {returns.map((r) => (
//             <div key={r._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
//               <div>
//                 <p className="font-medium">{r.product?.name} <span className="text-xs text-gray-400">x{r.quantity}</span></p>
//                 <p className="text-xs text-gray-500 capitalize">{r.type} · {r.reason}</p>
//               </div>
//               <span className="text-xs px-2 py-1 rounded-full bg-gray-100 capitalize">{r.status}</span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Returns;

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";

const statusStyles = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
  rejected: "bg-rose-100 text-rose-800 border-rose-200",
};

const Returns = () => {
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState("all");

  const [form, setForm] = useState({
    orderId: "",
    productId: "",
    quantity: 1,
    type: "return",
    reason: "",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersRes, returnsRes] = await Promise.all([
        api.get("/orders/my"),
        api.get("/returns/my"),
      ]);
      setOrders(ordersRes.data.filter((o) => o.status === "delivered"));
      setReturns(returnsRes.data);
    } catch (err) {
      toast.error("Failed to load requests data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectedOrder = orders.find((o) => o._id === form.orderId);
  const selectedItem = selectedOrder?.items?.find(
    (item) => (item.product?._id || item.product) === form.productId
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.orderId || !form.productId) return;

    setSubmitting(true);
    try {
      await api.post("/returns", form);
      toast.success("Return/exchange request submitted!");
      setForm({
        orderId: "",
        productId: "",
        quantity: 1,
        type: "return",
        reason: "",
      });
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not submit request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  const filteredReturns = returns.filter((r) =>
    filter === "all" ? true : r.status === filter
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Returns & Exchanges</h1>
        <p className="text-sm text-gray-500 mt-1">
          Request returns or size/product exchanges for delivered orders.
        </p>
      </div>

      {/* Form Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <h2 className="text-lg font-bold text-gray-900">Submit New Request</h2>

        {orders.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 bg-gray-50 text-center rounded-xl border border-dashed border-gray-200">
            No delivered orders eligible for return yet.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Order Select */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                1. Select Delivered Order
              </label>
              <select
                value={form.orderId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    orderId: e.target.value,
                    productId: "",
                    quantity: 1,
                  })
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
              >
                <option value="">Choose an Order</option>
                {orders.map((o) => (
                  <option key={o._id} value={o._id}>
                    Order #{o._id.slice(-6).toUpperCase()} — ₹{o.totalAmount}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Item Select Cards */}
            {selectedOrder && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  2. Select Item
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedOrder.items.map((item) => {
                    const pId = item.product?._id || item.product;
                    const isSelected = form.productId === pId;

                    return (
                      <div
                        key={pId}
                        onClick={() =>
                          setForm({ ...form, productId: pId, quantity: 1 })
                        }
                        className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                          isSelected
                            ? "border-brand bg-brand/5 ring-2 ring-brand/20"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg bg-gray-50"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            Purchased: Qty {item.quantity}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Type & Quantity */}
            {form.productId && (
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  {/* Type Selector Toggle */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Request Type
                    </label>
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, type: "return" })}
                        className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition ${
                          form.type === "return"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-900"
                        }`}
                      >
                        Return
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, type: "exchange" })}
                        className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition ${
                          form.type === "exchange"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-900"
                        }`}
                      >
                        Exchange
                      </button>
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                      <button
                        type="button"
                        onClick={() =>
                          setForm((f) => ({ ...f, quantity: Math.max(1, f.quantity - 1) }))
                        }
                        disabled={form.quantity <= 1}
                        className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-30 font-bold"
                      >
                        -
                      </button>
                      <span className="px-4 py-1.5 text-xs font-bold text-gray-800">
                        {form.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setForm((f) => ({
                            ...f,
                            quantity: Math.min(selectedItem?.quantity || 1, f.quantity + 1),
                          }))
                        }
                        disabled={form.quantity >= (selectedItem?.quantity || 1)}
                        className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-30 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Reason Input */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Reason
                  </label>
                  <textarea
                    placeholder="Describe why you want to return or exchange this item..."
                    value={form.reason}
                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
                    rows={3}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={!form.orderId || !form.productId || submitting}
                  className="w-full bg-brand text-white py-3 rounded-xl font-semibold shadow-sm hover:opacity-90 active:scale-[0.99] transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  Submit Request
                </button>
              </div>
            )}
          </form>
        )}
      </div>

      {/* History Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Request History</h2>

          {/* Filter Pill Tabs */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            {["all", "pending", "approved", "rejected"].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3 py-1 text-[11px] font-semibold capitalize rounded-md transition ${
                  filter === t
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {filteredReturns.length === 0 ? (
          <EmptyState message="No return/exchange requests found." />
        ) : (
          <div className="space-y-3">
            {filteredReturns.map((r) => (
              <div
                key={r._id}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">
                      {r.product?.name || "Product"}
                    </p>
                    <span className="text-xs text-gray-400 font-medium">
                      x{r.quantity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 capitalize mt-0.5">
                    <span className="font-semibold text-gray-700">{r.type}</span> ·{" "}
                    {r.reason}
                  </p>
                </div>

                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${
                    statusStyles[r.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Returns;