// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import api from "../api/axios.js";
// import Loader from "../components/Loader.jsx";

// const TABS = ["Products", "Categories", "Users"];
// const roles = ["customer", "staff", "admin"];

// const emptyProduct = { name: "", description: "", price: 0, stock: 0, unit: "pcs", category: "" };

// const AdminDashboard = () => {
//   const [tab, setTab] = useState("Products");
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [newProduct, setNewProduct] = useState(emptyProduct);
//   const [newCategory, setNewCategory] = useState("");

//   const loadAll = async () => {
//     setLoading(true);
//     const [productsRes, categoriesRes, usersRes] = await Promise.all([
//       api.get("/products"),
//       api.get("/categories"),
//       api.get("/users"),
//     ]);
//     setProducts(productsRes.data);
//     setCategories(categoriesRes.data);
//     setUsers(usersRes.data);
//     setLoading(false);
//   };

//   useEffect(() => {
//     loadAll();
//   }, []);

//   const addProduct = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post("/products", newProduct);
//       toast.success("Product added");
//       setNewProduct(emptyProduct);
//       loadAll();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Could not add product");
//     }
//   };

//   const deleteProduct = async (id) => {
//     try {
//       await api.delete(`/products/${id}`);
//       toast.success("Product deleted");
//       loadAll();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Could not delete product");
//     }
//   };

//   const addCategory = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post("/categories", { name: newCategory });
//       toast.success("Category added");
//       setNewCategory("");
//       loadAll();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Could not add category");
//     }
//   };

//   const changeUserRole = async (id, role) => {
//     try {
//       await api.put(`/users/${id}/role`, { role });
//       toast.success("Role updated");
//       loadAll();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Could not update role");
//     }
//   };

//   if (loading) return <Loader />;

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

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

//       {tab === "Products" && (
//         <div>
//           <form onSubmit={addProduct} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 grid sm:grid-cols-3 gap-3 mb-6">
//             <input placeholder="Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="border rounded px-2 py-1.5" />
//             <input placeholder="Price" type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })} className="border rounded px-2 py-1.5" />
//             <input placeholder="Stock" type="number" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })} className="border rounded px-2 py-1.5" />
//             <input placeholder="Unit (kg/pcs/ltr)" value={newProduct.unit} onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })} className="border rounded px-2 py-1.5" />
//             <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="border rounded px-2 py-1.5">
//               <option value="">Category</option>
//               {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
//             </select>
//             <input placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} className="border rounded px-2 py-1.5 sm:col-span-2" />
//             <button type="submit" className="bg-brand text-white rounded py-1.5 hover:bg-brand-dark">Add Product</button>
//           </form>

//           <div className="space-y-2">
//             {products.map((p) => (
//               <div key={p._id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
//                 <span>{p.name} — ₹{p.price} · stock {p.stock}</span>
//                 <button onClick={() => deleteProduct(p._id)} className="text-red-500 text-sm hover:underline">Delete</button>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {tab === "Categories" && (
//         <div>
//           <form onSubmit={addCategory} className="flex gap-3 mb-6">
//             <input placeholder="Category name" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="border rounded px-3 py-2 flex-1" />
//             <button type="submit" className="bg-brand text-white px-4 rounded hover:bg-brand-dark">Add</button>
//           </form>
//           <div className="space-y-2">
//             {categories.map((c) => (
//               <div key={c._id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">{c.name}</div>
//             ))}
//           </div>
//         </div>
//       )}

//       {tab === "Users" && (
//         <div className="space-y-2">
//           {users.map((u) => (
//             <div key={u._id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
//               <div>
//                 <p className="font-medium">{u.name}</p>
//                 <p className="text-xs text-gray-500">{u.email}</p>
//               </div>
//               <select value={u.role} onChange={(e) => changeUserRole(u._id, e.target.value)} className="border rounded px-2 py-1 text-sm">
//                 {roles.map((r) => <option key={r} value={r}>{r}</option>)}
//               </select>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;


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
  const [search, setSearch] = useState("");

  const [newProduct, setNewProduct] = useState(emptyProduct);
  const [newCategory, setNewCategory] = useState("");
  
  // Interactive UI States
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: "" });

  const loadAll = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes, usersRes] = await Promise.all([
        api.get("/products"),
        api.get("/categories"),
        api.get("/users"),
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Handlers
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

  const handleUpdateProduct = async (p) => {
    try {
      await api.put(`/products/${p._id}`, p);
      toast.success("Product updated");
      setEditingProduct(null);
      loadAll();
    } catch (err) {
      toast.error("Could not update product");
    }
  };

  const confirmDeleteProduct = async () => {
    if (!deleteModal.id) return;
    try {
      await api.delete(`/products/${deleteModal.id}`);
      toast.success("Product deleted");
      setDeleteModal({ open: false, id: null, title: "" });
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete product");
    }
  };

  const addCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
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
      toast.success("User role updated");
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update role");
    }
  };

  if (loading) return <Loader />;

  // Search Filter Logics
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Control Panel</h1>
          <p className="text-sm text-gray-500">Manage catalog items, taxonomy, and system user roles.</p>
        </div>

        {/* Dynamic Search Input */}
        <input
          type="text"
          placeholder={`Search ${tab.toLowerCase()}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 w-full md:w-64"
        />
      </div>

      {/* Interactive Tabs */}
      <div className="flex gap-2 border-b border-gray-100 pb-3">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setSearch("");
            }}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
              tab === t
                ? "bg-brand text-white shadow-sm"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* PRODUCTS TAB */}
      {tab === "Products" && (
        <div className="space-y-6">
          {/* Quick Create Form */}
          <form
            onSubmit={addProduct}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3"
          >
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Add New Product
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                required
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
              />
              <input
                placeholder="Price (₹)"
                type="number"
                value={newProduct.price || ""}
                onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                required
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
              />
              <input
                placeholder="Initial Stock"
                type="number"
                value={newProduct.stock || ""}
                onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                required
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
              />
              <input
                placeholder="Unit (kg / pcs / ltr)"
                value={newProduct.unit}
                onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
              />
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input
                placeholder="Short Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              className="bg-brand text-white font-semibold px-5 py-2 rounded-xl text-sm hover:opacity-90 transition active:scale-95"
            >
              + Create Product
            </button>
          </form>

          {/* Interactive Products Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-100">
              {filteredProducts.map((p) => {
                const isEditing = editingProduct?._id === p._id;

                return (
                  <div
                    key={p._id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition"
                  >
                    {isEditing ? (
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        <input
                          value={editingProduct.name}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, name: e.target.value })
                          }
                          className="border rounded-lg px-2 py-1 text-sm"
                        />
                        <input
                          type="number"
                          value={editingProduct.price}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              price: Number(e.target.value),
                            })
                          }
                          className="border rounded-lg px-2 py-1 text-sm"
                        />
                        <input
                          type="number"
                          value={editingProduct.stock}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              stock: Number(e.target.value),
                            })
                          }
                          className="border rounded-lg px-2 py-1 text-sm"
                        />
                      </div>
                    ) : (
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900">{p.name}</p>
                          {p.stock <= 5 && (
                            <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Low Stock: {p.stock}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                          ₹{p.price} / {p.unit} · Stock: {p.stock} units
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleUpdateProduct(editingProduct)}
                            className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingProduct(null)}
                            className="bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingProduct(p)}
                            className="text-xs font-semibold text-gray-600 hover:text-brand bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              setDeleteModal({ open: true, id: p._id, title: p.name })
                            }
                            className="text-xs font-semibold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CATEGORIES TAB */}
      {tab === "Categories" && (
        <div className="space-y-6">
          <form onSubmit={addCategory} className="flex gap-3">
            <input
              placeholder="Enter category name..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-brand/50"
            />
            <button
              type="submit"
              className="bg-brand text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 active:scale-95 transition"
            >
              Add Category
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredCategories.map((c) => (
              <div
                key={c._id}
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between"
              >
                <span className="font-semibold text-gray-800">{c.name}</span>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-md font-medium">
                  ID: #{c._id.slice(-4)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {tab === "Users" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100">
          {filteredUsers.map((u) => (
            <div key={u._id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{u.name}</p>
                <p className="text-xs text-gray-400">{u.email}</p>
              </div>

              <select
                value={u.role}
                onChange={(e) => changeUserRole(u._id, e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand/50"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">Confirm Deletion</h3>
            <p className="text-sm text-gray-500">
              Are you sure you want to delete <span className="font-semibold text-gray-900">"{deleteModal.title}"</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteModal({ open: false, id: null, title: "" })}
                className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteProduct}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 rounded-xl hover:bg-rose-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;