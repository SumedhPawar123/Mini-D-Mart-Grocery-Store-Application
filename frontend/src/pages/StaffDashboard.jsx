import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";

const TABS = ["Orders", "Returns", "Inventory"];

const orderStatuses = ["pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered", "cancelled"];

const StaffDashboard = () => {
  const [tab, setTab] = useState("Orders");
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    setLoading(true);
    const [ordersRes, returnsRes, productsRes] = await Promise.all([
      api.get("/orders"),
      api.get("/returns"),
      api.get("/products"),
    ]);
    setOrders(ordersRes.data);
    setReturns(returnsRes.data);
    setProducts(productsRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const updateOrderStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success("Order status updated");
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
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
      await api.put(`/products/${id}`, { stock });
      toast.success("Stock updated");
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Staff Dashboard</h1>

      <div className="flex gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              tab === t ? "bg-brand text-white" : "bg-white border text-gray-600"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Orders" && (
        orders.length === 0 ? <EmptyState message="No orders yet." /> : (
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="font-medium">#{o._id.slice(-6).toUpperCase()} — {o.user?.name}</p>
                  <p className="text-xs text-gray-500">
                    {o.fulfillmentType === "pickup" ? "Pickup" : "Delivery"} · ₹{o.totalAmount}
                    {o.scheduledDate && ` · ${new Date(o.scheduledDate).toLocaleString()}`}
                  </p>
                </div>
                <select
                  value={o.status}
                  onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  {orderStatuses.map((s) => (
                    <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )
      )}

      {tab === "Returns" && (
        returns.length === 0 ? <EmptyState message="No return/exchange requests." /> : (
          <div className="space-y-3">
            {returns.map((r) => (
              <div key={r._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{r.product?.name} x{r.quantity} <span className="text-xs text-gray-400 capitalize">({r.type})</span></p>
                  <p className="text-xs text-gray-500">{r.user?.name} · {r.reason}</p>
                </div>
                <select
                  value={r.status}
                  onChange={(e) => updateReturnStatus(r._id, e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="requested">requested</option>
                  <option value="approved">approved</option>
                  <option value="rejected">rejected</option>
                  <option value="completed">completed</option>
                </select>
              </div>
            ))}
          </div>
        )
      )}

      {tab === "Inventory" && (
        <div className="space-y-3">
          {products.map((p) => (
            <div key={p._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-gray-500">₹{p.price} /{p.unit}</p>
              </div>
              <input
                type="number"
                min="0"
                defaultValue={p.stock}
                onBlur={(e) => updateStock(p._id, Number(e.target.value))}
                className="w-24 border rounded px-2 py-1 text-sm"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
