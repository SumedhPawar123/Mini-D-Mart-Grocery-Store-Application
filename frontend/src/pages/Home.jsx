

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";
import EmptyState from "../components/EmptyState.jsx";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);

  // Fetch Categories
  useEffect(() => {
    api
      .get("/categories")
      .then((res) => setCategories(res.data))
      .catch(() => {});
  }, []);

  // Fetch Products
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

  // Sorting
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

  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 25,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

      {/* ================= HERO ================= */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
        className="bg-gradient-to-r from-brand to-brand-dark text-white rounded-2xl p-6 sm:p-8 shadow-sm flex justify-between items-center overflow-hidden relative"
      >
        {/* Decorative circles */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            type: "spring",
          }}
          className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full"
        />

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.15,
          }}
          className="space-y-2 z-10 max-w-md"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-block text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm"
          >
            Daily Essentials
          </motion.span>

          <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">
            Fresh Groceries Delivered Fast
          </h1>

          <p className="text-sm opacity-90">
            Explore quality products directly from your local Mini D-Mart store.
          </p>
        </motion.div>
      </motion.div>

      {/* ================= SEARCH + CONTROLS ================= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.2,
        }}
        className="flex flex-col sm:flex-row gap-3"
      >
        {/* Search */}
        <div className="relative flex-1">
          <input
            placeholder="Search groceries, beverages, snacks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 transition"
          />

          <AnimatePresence>
            {search && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center"
              >
                ✕
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Sort */}
        <motion.select
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/50"
        >
          <option value="default">Sort by: Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
        </motion.select>

        {/* View Toggle */}
        <div className="flex border border-gray-200 rounded-xl bg-white p-1 gap-1 self-start sm:self-auto">

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setViewMode("grid")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              viewMode === "grid"
                ? "bg-brand text-white"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Grid
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setViewMode("list")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              viewMode === "list"
                ? "bg-brand text-white"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            List
          </motion.button>

        </div>
      </motion.div>

      {/* ================= CATEGORIES ================= */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.3,
        }}
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-none"
      >

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCategory("")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            category === ""
              ? "bg-gray-900 text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All Items
        </motion.button>

        {categories.map((c) => (
          <motion.button
            key={c._id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCategory(c._id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              category === c._id
                ? "bg-brand text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {c.name}
          </motion.button>
        ))}

      </motion.div>

      {/* ================= FILTER BADGES ================= */}
      <AnimatePresence>
        {(search || category || sortBy !== "default") && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="flex items-center gap-2 flex-wrap pt-1 overflow-hidden"
          >
            <span className="text-xs text-gray-400 font-medium">
              Active Filters:
            </span>

            {category && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1 text-xs bg-brand/10 text-brand px-3 py-1 rounded-full font-medium"
              >
                Category Selected

                <button onClick={() => setCategory("")}>
                  ✕
                </button>
              </motion.span>
            )}

            {search && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1 text-xs bg-brand/10 text-brand px-3 py-1 rounded-full font-medium"
              >
                "{search}"

                <button onClick={() => setSearch("")}>
                  ✕
                </button>
              </motion.span>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearAllFilters}
              className="text-xs font-semibold text-rose-600 hover:underline ml-auto"
            >
              Reset All Filters
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= PRODUCTS ================= */}
      {loading ? (

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <motion.div
              key={n}
              variants={itemVariants}
              className="bg-white p-4 rounded-2xl border border-gray-100 space-y-3 animate-pulse"
            >
              <div className="w-full h-32 bg-gray-100 rounded-xl" />
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
              <div className="h-8 bg-gray-100 rounded-xl w-full" />
            </motion.div>
          ))}
        </motion.div>

      ) : sortedProducts.length === 0 ? (

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <EmptyState message="No products match your current search or category filter." />
        </motion.div>

      ) : (

        <motion.div
          key={viewMode}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              : "flex flex-col gap-3"
          }
        >
          {sortedProducts.map((p) => (
            <motion.div key={p._id} variants={itemVariants} layout>
              <ProductCard
                product={p}
                viewMode={viewMode}
              />
            </motion.div>
          ))}
        </motion.div>

      )}

    </div>
  );
};

export default Home;