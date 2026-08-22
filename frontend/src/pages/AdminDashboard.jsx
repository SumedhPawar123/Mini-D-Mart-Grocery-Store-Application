import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";

const TABS = ["Products", "Categories", "Users"];
const roles = ["customer", "staff", "admin"];

const emptyProduct = { name: "", description: "", price: 0, stock: 0, unit: "pcs", category: "" };

const AdminDashboard = () => {
  const [tab, setTab] = useState("Products");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState(emptyProduct);
  const [newCategory, setNewCategory] = useState("");

  const loadAll = async () => {
    setLoading(true);
    const [productsRes, categoriesRes, usersRes] = await Promise.all([
      api.get("/products"),
      api.get("/categories"),
      api.get("/users"),
    ]);
    setProducts(productsRes.data);
    setCategories(categoriesRes.data);
    setUsers(usersRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post("/products", newProduct);
      toast.success("Product added");
      setNewProduct(emptyProduct);
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add product");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete product");
    }
  };

  const addCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post("/categories", { name: newCategory });
      toast.success("Category added");
      setNewCategory("");
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add category");
    }
  };

  const changeUserRole = async (id, role) => {
    try {
      await api.put(`/users/${id}/role`, { role });
      toast.success("Role updated");
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update role");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

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

      {tab === "Products" && (
        <div>
          <form onSubmit={addProduct} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 grid sm:grid-cols-3 gap-3 mb-6">
            <input placeholder="Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="border rounded px-2 py-1.5" />
            <input placeholder="Price" type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })} className="border rounded px-2 py-1.5" />
            <input placeholder="Stock" type="number" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })} className="border rounded px-2 py-1.5" />
            <input placeholder="Unit (kg/pcs/ltr)" value={newProduct.unit} onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })} className="border rounded px-2 py-1.5" />
            <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="border rounded px-2 py-1.5">
              <option value="">Category</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <input placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} className="border rounded px-2 py-1.5 sm:col-span-2" />
            <button type="submit" className="bg-brand text-white rounded py-1.5 hover:bg-brand-dark">Add Product</button>
          </form>

          <div className="space-y-2">
            {products.map((p) => (
              <div key={p._id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
                <span>{p.name} — ₹{p.price} · stock {p.stock}</span>
                <button onClick={() => deleteProduct(p._id)} className="text-red-500 text-sm hover:underline">Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "Categories" && (
        <div>
          <form onSubmit={addCategory} className="flex gap-3 mb-6">
            <input placeholder="Category name" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="border rounded px-3 py-2 flex-1" />
            <button type="submit" className="bg-brand text-white px-4 rounded hover:bg-brand-dark">Add</button>
          </form>
          <div className="space-y-2">
            {categories.map((c) => (
              <div key={c._id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">{c.name}</div>
            ))}
          </div>
        </div>
      )}

      {tab === "Users" && (
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u._id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-xs text-gray-500">{u.email}</p>
              </div>
              <select value={u.role} onChange={(e) => changeUserRole(u._id, e.target.value)} className="border rounded px-2 py-1 text-sm">
                {roles.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
