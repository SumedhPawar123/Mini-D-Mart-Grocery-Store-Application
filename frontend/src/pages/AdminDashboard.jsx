
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";

const TABS = ["Products", "Categories", "Users"];
const roles = ["customer", "staff", "admin"];

const emptyProduct = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  unit: "pcs",
  category: "",
  image: null,
};

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getImageUrl = (image) => {
  if (!image) return null;

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  const serverUrl = API_BASE_URL.replace(/\/api\/?$/, "");

  return `${serverUrl}/${image.replace(/^\/+/, "")}`;
};

const AdminDashboard = () => {
  const [tab, setTab] = useState("Products");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [newProduct, setNewProduct] = useState(emptyProduct);
  const [newImagePreview, setNewImagePreview] = useState(null);

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });

  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);



  const [deleteModal, setDeleteModal] = useState({
    open: false,
    id: null,
    title: "",
  });

  // =====================================================
  // LOAD ALL DATA
  // =====================================================

  const loadAll = async () => {
    setLoading(true);

    try {
      const [productsRes, categoriesRes, usersRes] =
        await Promise.all([
          api.get("/products"),
          api.get("/categories"),
          api.get("/users"),
        ]);

      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // =====================================================
  // NEW PRODUCT INPUT
  // =====================================================

  const handleNewProductChange = (e) => {
    const { name, value } = e.target;

    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // NEW PRODUCT IMAGE
  // =====================================================

  const handleNewProductImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, JPEG, PNG and WEBP images are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    setNewProduct((prev) => ({
      ...prev,
      image: file,
    }));

    setNewImagePreview(URL.createObjectURL(file));
  };

  // =====================================================
  // CREATE PRODUCT
  // =====================================================

  const addProduct = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", newProduct.name);
      formData.append("description", newProduct.description);
      formData.append("price", newProduct.price);
      formData.append("stock", newProduct.stock);
      formData.append("unit", newProduct.unit);
      formData.append("category", newProduct.category);

      if (newProduct.image) {
        formData.append("image", newProduct.image);
      }

      await api.post("/products", formData);

      toast.success("Product added successfully");

      setNewProduct(emptyProduct);

      setNewImagePreview(null);

      // Reset file input
      const fileInput = document.getElementById(
        "product-image-input"
      );

      if (fileInput) {
        fileInput.value = "";
      }

      loadAll();
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
        "Could not add product"
      );
    }
  };

  // =====================================================
  // START EDITING PRODUCT
  // =====================================================

  const startEditing = (product) => {
    setEditingProduct({
      ...product,
      category:
        typeof product.category === "object"
          ? product.category?._id
          : product.category,
      imageFile: null,
    });

    setEditImagePreview(
      product.image ? getImageUrl(product.image) : null
    );
  };

  // =====================================================
  // EDIT PRODUCT IMAGE
  // =====================================================

  const handleEditImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    setEditingProduct((prev) => ({
      ...prev,
      imageFile: file,
    }));

    setEditImagePreview(URL.createObjectURL(file));
  };

  // =====================================================
  // UPDATE PRODUCT
  // =====================================================

  const handleUpdateProduct = async (product) => {
    try {
      const formData = new FormData();

      formData.append("name", product.name);
      formData.append(
        "description",
        product.description || ""
      );
      formData.append("price", product.price);
      formData.append("stock", product.stock);
      formData.append("unit", product.unit || "pcs");

      if (product.category) {
        formData.append("category", product.category);
      }

      if (product.imageFile) {
        formData.append("image", product.imageFile);
      }

      await api.put(
        `/products/${product._id}`,
        formData
      );

      toast.success("Product updated successfully");

      setEditingProduct(null);
      setEditImagePreview(null);

      loadAll();
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
        "Could not update product"
      );
    }
  };

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const confirmDeleteProduct = async () => {
    if (!deleteModal.id) return;

    try {
      await api.delete(
        `/products/${deleteModal.id}`
      );

      toast.success("Product deleted");

      setDeleteModal({
        open: false,
        id: null,
        title: "",
      });

      loadAll();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Could not delete product"
      );
    }
  };

  // =====================================================
  // ADD CATEGORY
  // =====================================================

  const addCategory = async (e) => {
    e.preventDefault();

    if (!newCategory.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      await api.post("/categories", {
        name: newCategory.name.trim(),
        description: newCategory.description.trim(),
      });

      toast.success("Category added successfully");

      setNewCategory({
        name: "",
        description: "",
      });

      setShowCategoryModal(false);

      loadAll();
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
        "Could not add category"
      );
    }
  };

  // =====================================================
  // CHANGE USER ROLE
  // =====================================================

  const changeUserRole = async (id, role) => {
    try {
      await api.put(`/users/${id}/role`, {
        role,
      });

      toast.success("User role updated");

      loadAll();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Could not update role"
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) return <Loader />;

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredProducts = products.filter((p) =>
    p.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredCategories = categories.filter((c) =>
    c.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      u.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      u.email
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  // =====================================================
  // JSX
  // =====================================================

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Admin Control Panel
          </h1>

          <p className="text-sm text-gray-500">
            Manage catalog items, taxonomy, and system
            user roles.
          </p>
        </div>

        <input
          type="text"
          placeholder={`Search ${tab.toLowerCase()}...`}
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 w-full md:w-64"
        />
      </div>

      {/* TABS */}

      <div className="flex gap-2 border-b border-gray-100 pb-3">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setSearch("");
            }}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t
                ? "bg-brand text-white shadow-sm"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      {tab === "Products" && (
        <div className="space-y-6">

          {/* CREATE PRODUCT */}

          <form
            onSubmit={addProduct}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4"
          >
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Add New Product
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

              {/* NAME */}

              <input
                name="name"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={handleNewProductChange}
                required
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
              />

              {/* PRICE */}

              <input
                name="price"
                placeholder="Price (₹)"
                type="number"
                min="0"
                value={newProduct.price || ""}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    price: Number(e.target.value),
                  })
                }
                required
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
              />

              {/* STOCK */}

              <input
                name="stock"
                placeholder="Initial Stock"
                type="number"
                min="0"
                value={newProduct.stock || ""}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    stock: Number(e.target.value),
                  })
                }
                required
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
              />

              {/* UNIT */}

              <input
                name="unit"
                placeholder="Unit (kg / pcs / ltr)"
                value={newProduct.unit}
                onChange={handleNewProductChange}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
              />

              {/* CATEGORY */}

              <select
                name="category"
                value={newProduct.category}
                onChange={handleNewProductChange}
                required
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
              >
                <option value="">
                  Select Category
                </option>

                {categories.map((c) => (
                  <option
                    key={c._id}
                    value={c._id}
                  >
                    {c.name}
                  </option>
                ))}
              </select>

              {/* DESCRIPTION */}

              <input
                name="description"
                placeholder="Short Description"
                value={newProduct.description}
                onChange={handleNewProductChange}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
              />

            </div>

            {/* IMAGE UPLOAD */}

            <div className="border border-dashed border-gray-300 rounded-xl p-4">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Image
              </label>

              <input
                id="product-image-input"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleNewProductImage}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand file:text-white hover:file:opacity-90"
              />

              <p className="text-xs text-gray-400 mt-2">
                JPG, JPEG, PNG or WEBP. Maximum 5MB.
              </p>

              {/* IMAGE PREVIEW */}

              {newImagePreview && (
                <div className="mt-4 relative w-32 h-32">
                  <img
                    src={newImagePreview}
                    alt="Product preview"
                    className="w-full h-full object-contain rounded-xl border border-gray-200 bg-gray-50"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setNewImagePreview(null);

                      setNewProduct((prev) => ({
                        ...prev,
                        image: null,
                      }));

                      const input =
                        document.getElementById(
                          "product-image-input"
                        );

                      if (input) input.value = "";
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              )}

            </div>

            <button
              type="submit"
              className="bg-brand text-white font-semibold px-5 py-2 rounded-xl text-sm hover:opacity-90 transition active:scale-95"
            >
              + Create Product
            </button>

          </form>

          {/* PRODUCTS LIST */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            <div className="divide-y divide-gray-100">

              {filteredProducts.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-400">
                  No products found.
                </div>
              ) : (
                filteredProducts.map((p) => {

                  const isEditing =
                    editingProduct?._id === p._id;

                  return (
                    <div
                      key={p._id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition"
                    >

                      {/* EDIT MODE */}

                      {isEditing ? (

                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-3">

                          {/* IMAGE */}

                          <div className="sm:row-span-2">

                            <div className="w-24 h-24 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">

                              {editImagePreview ? (
                                <img
                                  src={editImagePreview}
                                  alt={editingProduct.name}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <span className="text-3xl">
                                  🛍️
                                </span>
                              )}

                            </div>

                            <label className="block mt-2">

                              <span className="text-xs text-brand font-semibold cursor-pointer hover:underline">
                                Change Image
                              </span>

                              <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleEditImage}
                                className="hidden"
                              />

                            </label>

                          </div>

                          {/* NAME */}

                          <input
                            value={editingProduct.name}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                name: e.target.value,
                              })
                            }
                            placeholder="Product Name"
                            className="border rounded-lg px-2 py-1 text-sm"
                          />

                          {/* PRICE */}

                          <input
                            type="number"
                            value={editingProduct.price}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                price: Number(
                                  e.target.value
                                ),
                              })
                            }
                            placeholder="Price"
                            className="border rounded-lg px-2 py-1 text-sm"
                          />

                          {/* STOCK */}

                          <input
                            type="number"
                            value={editingProduct.stock}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                stock: Number(
                                  e.target.value
                                ),
                              })
                            }
                            placeholder="Stock"
                            className="border rounded-lg px-2 py-1 text-sm"
                          />

                          {/* UNIT */}

                          <input
                            value={editingProduct.unit || ""}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                unit: e.target.value,
                              })
                            }
                            placeholder="Unit"
                            className="border rounded-lg px-2 py-1 text-sm"
                          />

                          {/* CATEGORY */}

                          <select
                            value={
                              editingProduct.category || ""
                            }
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                category: e.target.value,
                              })
                            }
                            className="border rounded-lg px-2 py-1 text-sm"
                          >
                            <option value="">
                              Select Category
                            </option>

                            {categories.map((c) => (
                              <option
                                key={c._id}
                                value={c._id}
                              >
                                {c.name}
                              </option>
                            ))}
                          </select>

                          {/* DESCRIPTION */}

                          <input
                            value={
                              editingProduct.description ||
                              ""
                            }
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                description:
                                  e.target.value,
                              })
                            }
                            placeholder="Description"
                            className="border rounded-lg px-2 py-1 text-sm sm:col-span-2"
                          />

                        </div>

                      ) : (

                        /* NORMAL MODE */

                        <div className="flex-1 flex items-center gap-4">

                          {/* PRODUCT IMAGE */}

                          <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">

                            {p.image ? (
                              <img
                                src={getImageUrl(p.image)}
                                alt={p.name}
                                className="w-full h-full object-contain p-1"
                              />
                            ) : (
                              <span className="text-2xl">
                                🛍️
                              </span>
                            )}

                          </div>

                          {/* PRODUCT INFO */}

                          <div className="min-w-0">

                            <div className="flex items-center gap-2 flex-wrap">

                              <p className="font-semibold text-gray-900">
                                {p.name}
                              </p>

                              {p.stock <= 5 && (
                                <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                  Low Stock: {p.stock}
                                </span>
                              )}

                            </div>

                            <p className="text-xs text-gray-400 mt-0.5">
                              ₹{p.price} / {p.unit} ·
                              Stock: {p.stock} units
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                              {p.category?.name ||
                                "General"}
                            </p>

                          </div>

                        </div>
                      )}

                      {/* ACTION BUTTONS */}

                      <div className="flex items-center gap-2">

                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateProduct(
                                  editingProduct
                                )
                              }
                              className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
                            >
                              Save
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setEditingProduct(null);
                                setEditImagePreview(null);
                              }}
                              className="bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                startEditing(p)
                              }
                              className="text-xs font-semibold text-gray-600 hover:text-brand bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setDeleteModal({
                                  open: true,
                                  id: p._id,
                                  title: p.name,
                                })
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
                })
              )}

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          CATEGORIES
      ===================================================== */}

      {/* =====================================================
    CATEGORIES
===================================================== */}

      {tab === "Categories" && (
        <div className="space-y-6">

          {/* HEADER */}

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Categories
              </h2>

              <p className="text-sm text-gray-500">
                Manage your grocery categories.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowCategoryModal(true)}
              className="bg-brand text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 active:scale-95 transition"
            >
              + Add Category
            </button>

          </div>

          {/* CATEGORY LIST */}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">

            {filteredCategories.length === 0 ? (

              <div className="col-span-full bg-white p-8 rounded-xl border border-gray-100 text-center">

                <p className="text-sm text-gray-400">
                  No categories found.
                </p>

              </div>

            ) : (

              filteredCategories.map((c) => (

                <div
                  key={c._id}
                  className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
                >

                  <div className="flex items-center justify-between gap-3">

                    <span className="font-semibold text-gray-800">
                      {c.name}
                    </span>

                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-md font-medium">
                      ID: #{c._id.slice(-4)}
                    </span>

                  </div>

                  {c.description && (
                    <p className="text-xs text-gray-500 mt-2">
                      {c.description}
                    </p>
                  )}

                </div>

              ))

            )}

          </div>

          {/* =====================================================
        ADD CATEGORY MODAL
    ===================================================== */}

          {showCategoryModal && (

            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setShowCategoryModal(false)}
            >

              <div
                className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >

                {/* MODAL HEADER */}

                <div className="flex items-center justify-between mb-5">

                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Add Category
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      Create a new grocery category.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(false)}
                    className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
                  >
                    ×
                  </button>

                </div>

                {/* FORM */}

                <form
                  onSubmit={addCategory}
                  className="space-y-4"
                >

                  {/* CATEGORY NAME */}

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Category Name
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Fruits"
                      value={newCategory.name}
                      onChange={(e) =>
                        setNewCategory((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      autoFocus
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
                    />

                  </div>

                  {/* DESCRIPTION */}

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Description
                    </label>

                    <textarea
                      placeholder="e.g. Fresh and seasonal fruits"
                      rows={4}
                      value={newCategory.description}
                      onChange={(e) =>
                        setNewCategory((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand/50"
                    />

                  </div>

                  {/* BUTTONS */}

                  <div className="flex justify-end gap-3 pt-2">

                    <button
                      type="button"
                      onClick={() => {
                        setShowCategoryModal(false);

                        setNewCategory({
                          name: "",
                          description: "",
                        });
                      }}
                      className="px-4 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="px-5 py-2.5 text-sm font-semibold text-white bg-brand rounded-xl hover:opacity-90 transition active:scale-95"
                    >
                      Add Category
                    </button>

                  </div>

                </form>

              </div>

            </div>

          )}

        </div>
      )}

      {/* =====================================================
          USERS
      ===================================================== */}

      {tab === "Users" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100">

          {filteredUsers.map((u) => (
            <div
              key={u._id}
              className="p-4 flex items-center justify-between"
            >

              <div>
                <p className="font-semibold text-gray-900">
                  {u.name}
                </p>

                <p className="text-xs text-gray-400">
                  {u.email}
                </p>
              </div>

              <select
                value={u.role}
                onChange={(e) =>
                  changeUserRole(
                    u._id,
                    e.target.value
                  )
                }
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

      {/* =====================================================
          DELETE MODAL
      ===================================================== */}

      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">

            <h3 className="text-lg font-bold text-gray-900">
              Confirm Deletion
            </h3>

            <p className="text-sm text-gray-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                "{deleteModal.title}"
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 pt-2">

              <button
                type="button"
                onClick={() =>
                  setDeleteModal({
                    open: false,
                    id: null,
                    title: "",
                  })
                }
                className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200"
              >
                Cancel
              </button>

              <button
                type="button"
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