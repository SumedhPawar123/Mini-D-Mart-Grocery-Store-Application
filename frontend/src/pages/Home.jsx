// import { useEffect, useState } from "react";
// import api from "../api/axios.js";
// import ProductCard from "../components/ProductCard.jsx";
// import Loader from "../components/Loader.jsx";
// import EmptyState from "../components/EmptyState.jsx";

// const Home = () => {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api.get("/categories").then((res) => setCategories(res.data)).catch(() => {});
//   }, []);

//   useEffect(() => {
//     setLoading(true);
//     const params = {};
//     if (search) params.search = search;
//     if (category) params.category = category;

//     api
//       .get("/products", { params })
//       .then((res) => setProducts(res.data))
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, [search, category]);

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-6">
//       <div className="flex flex-col sm:flex-row gap-3 mb-6">
//         <input
//           placeholder="Search products..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
//         />
//         <select
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//           className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
//         >
//           <option value="">All Categories</option>
//           {categories.map((c) => (
//             <option key={c._id} value={c._id}>{c.name}</option>
//           ))}
//         </select>
//       </div>

//       {loading ? (
//         <Loader />
//       ) : products.length === 0 ? (
//         <EmptyState message="No products found." />
//       ) : (
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
//           {products.map((p) => (
//             <ProductCard key={p._id} product={p} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;


import { useEffect, useState } from "react";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";
import EmptyState from "../components/EmptyState.jsx";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [loading, setLoading] = useState(true);

  // Fetch Categories
  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  // Fetch Products based on search & category
  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;

    api
      .get("/products", { params })
      .then((res) => setProducts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, category]);

  // Client-side Sort Logic
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  const clearAllFilters = () => {
    setSearch("");
    setCategory("");
    setSortBy("default");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner / Hero */}
      <div className="bg-gradient-to-r from-brand to-brand-dark text-white rounded-2xl p-6 sm:p-8 shadow-sm flex justify-between items-center overflow-hidden relative">
        <div className="space-y-2 z-10 max-w-md">
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
            Daily Essentials
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">
            Fresh Groceries Delivered Fast
          </h1>
          <p className="text-sm opacity-90">
            Explore quality products directly from your local Mini D-Mart store.
          </p>
        </div>
      </div>

      {/* Search Bar & Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input with Clear Button */}
        <div className="relative flex-1">
          <input
            placeholder="Search groceries, beverages, snacks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/50"
        >
          <option value="default">Sort by: Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
        </select>

        {/* View Mode Toggle */}
        <div className="flex border border-gray-200 rounded-xl bg-white p-1 gap-1 self-start sm:self-auto">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              viewMode === "grid" ? "bg-brand text-white" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              viewMode === "list" ? "bg-brand text-white" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* Horizontal Category Pill Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setCategory("")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            category === ""
              ? "bg-gray-900 text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All Items
        </button>
        {categories.map((c) => (
          <button
            key={c._id}
            onClick={() => setCategory(c._id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              category === c._id
                ? "bg-brand text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Active Filter Badges Bar */}
      {(search || category || sortBy !== "default") && (
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-xs text-gray-400 font-medium">Active Filters:</span>
          {category && (
            <span className="inline-flex items-center gap-1 text-xs bg-brand/10 text-brand px-3 py-1 rounded-full font-medium">
              Category Selected
              <button onClick={() => setCategory("")} className="hover:text-brand-dark">✕</button>
            </span>
          )}
          {search && (
            <span className="inline-flex items-center gap-1 text-xs bg-brand/10 text-brand px-3 py-1 rounded-full font-medium">
              "{search}"
              <button onClick={() => setSearch("")} className="hover:text-brand-dark">✕</button>
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-xs font-semibold text-rose-600 hover:underline ml-auto"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Products Display Section */}
      {loading ? (
        /* Shimmer Skeleton Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="bg-white p-4 rounded-2xl border border-gray-100 space-y-3 animate-pulse">
              <div className="w-full h-32 bg-gray-100 rounded-xl" />
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
              <div className="h-8 bg-gray-100 rounded-xl w-full pt-2" />
            </div>
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
        <EmptyState message="No products match your current search or category filter." />
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              : "flex flex-col gap-3"
          }
        >
          {sortedProducts.map((p) => (
            <ProductCard key={p._id} product={p} viewMode={viewMode} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;