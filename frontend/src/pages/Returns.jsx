import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";

const Returns = () => {
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ orderId: "", productId: "", quantity: 1, type: "return", reason: "" });

  const loadData = async () => {
    setLoading(true);
    const [ordersRes, returnsRes] = await Promise.all([
      api.get("/orders/my"),
      api.get("/returns/my"),
    ]);
    setOrders(ordersRes.data.filter((o) => o.status === "delivered"));
    setReturns(returnsRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectedOrder = orders.find((o) => o._id === form.orderId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/returns", form);
      toast.success("Return/exchange request submitted");
      setForm({ orderId: "", productId: "", quantity: 1, type: "return", reason: "" });
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not submit request");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Returns & Exchanges</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4 mb-8">
        <p className="font-medium">Request a Return / Exchange</p>

        {orders.length === 0 ? (
          <p className="text-sm text-gray-400">No delivered orders eligible for return yet.</p>
        ) : (
          <>
            <select
              value={form.orderId}
              onChange={(e) => setForm({ ...form, orderId: e.target.value, productId: "" })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select Order</option>
              {orders.map((o) => (
                <option key={o._id} value={o._id}>
                  Order #{o._id.slice(-6).toUpperCase()} — ₹{o.totalAmount}
                </option>
              ))}
            </select>

            {selectedOrder && (
              <select
                value={form.productId}
                onChange={(e) => setForm({ ...form, productId: e.target.value })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Product</option>
                {selectedOrder.items.map((item) => (
                  <option key={item.product} value={item.product}>{item.name}</option>
                ))}
              </select>
            )}

            <div className="flex gap-3">
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="border rounded px-3 py-2"
              >
                <option value="return">Return</option>
                <option value="exchange">Exchange</option>
              </select>
              <input
                type="number"
                min="1"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                className="w-24 border rounded px-3 py-2"
              />
            </div>

            <textarea
              placeholder="Reason"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="w-full border rounded px-3 py-2"
              rows={2}
            />

            <button
              type="submit"
              disabled={!form.orderId || !form.productId}
              className="bg-brand text-white px-4 py-2 rounded hover:bg-brand-dark disabled:opacity-60"
            >
              Submit Request
            </button>
          </>
        )}
      </form>

      <h2 className="font-semibold mb-3">My Requests</h2>
      {returns.length === 0 ? (
        <EmptyState message="No return/exchange requests yet." />
      ) : (
        <div className="space-y-3">
          {returns.map((r) => (
            <div key={r._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
              <div>
                <p className="font-medium">{r.product?.name} <span className="text-xs text-gray-400">x{r.quantity}</span></p>
                <p className="text-xs text-gray-500 capitalize">{r.type} · {r.reason}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 capitalize">{r.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Returns;
