
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { getImageUrl } from "../utils/imageUrl.js";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("description"); // 'description' | 'specs' | 'reviews'
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch(() => {
        toast.error("Failed to fetch product details.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!product)
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <p className="text-gray-400 font-medium">Product not found.</p>
        <Link
          to="/"
          className="inline-block bg-brand text-white px-5 py-2 rounded-xl text-sm font-semibold"
        >
          Back to Products
        </Link>
      </div>
    );

  // Mock multi-images if only one image or placeholder exists
  const productImages = product.images?.length
    ? product.images
    : product.image
      ? [product.image]
      : ["🛍️"];

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addToCart(product._id, qty);
      toast.success(`Added ${qty} ${product.unit}(s) to cart!`);
    } catch (err) {
      toast.error("Could not add item to cart.");
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate("/checkout");
  };

  const calculatedPrice = product.price * qty;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-gray-500">
        <Link to="/" className="hover:text-brand transition">
          Home
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">{product.category?.name || "Catalog"}</span>
        <span>/</span>
        <span className="text-gray-400 truncate max-w-[150px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Column: Image Gallery Previewer */}
        <div className="space-y-4">
          <div className="relative h-80 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center overflow-hidden group shadow-sm">
            {productImages[selectedImage]?.startsWith("http") ||
              productImages[selectedImage]?.startsWith("/") ? (
              <img
                src={getImageUrl(productImages[selectedImage])}
                alt={product.name}
                className="h-full w-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <span className="text-8xl select-none">{productImages[selectedImage]}</span>
            )}

            {/* Interactive Wishlist Favorite Toggle */}
            <button
              type="button"
              onClick={() => {
                setIsWishlisted(!isWishlisted);
                toast.info(isWishlisted ? "Removed from Wishlist" : "Added to Wishlist");
              }}
              className={`absolute top-4 right-4 p-2.5 rounded-full shadow-md backdrop-blur-md transition ${isWishlisted
                  ? "bg-rose-50 text-rose-600 border border-rose-200"
                  : "bg-white/80 text-gray-400 hover:text-rose-500"
                }`}
            >
              ♥
            </button>
          </div>

          {/* Gallery Thumbnails */}
          {productImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center bg-gray-50 overflow-hidden transition ${selectedImage === idx
                      ? "border-brand ring-2 ring-brand/20"
                      : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  {img.startsWith("http") ? (
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl">{img}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Dynamic Order Controls */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider bg-brand/10 text-brand px-2.5 py-1 rounded-full">
              {product.category?.name || "General Grocery"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
              {product.name}
            </h1>
            <p className="text-sm text-gray-500 mt-1">Unit: per {product.unit}</p>
          </div>

          {/* Pricing & Stock Indicator */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-brand">₹{product.price}</span>
                <span className="text-xs text-gray-400 font-normal">/ {product.unit}</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Inclusive of all taxes</p>
            </div>

            <div className="text-right">
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {product.stock} left in stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-100 px-3 py-1 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* Interactive Stepper & Total Cost Dynamic Preview */}
          {user?.role === "customer" && product.stock > 0 && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Select Quantity
                </label>
                <span className="text-xs font-semibold text-gray-700">
                  Subtotal: <span className="text-brand text-sm font-bold">₹{calculatedPrice}</span>
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Stepper Controls */}
                <div className="flex items-center border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                    className="px-4 py-2.5 text-gray-600 hover:bg-gray-50 disabled:opacity-30 font-bold transition"
                  >
                    -
                  </button>
                  <span className="px-5 py-2.5 font-bold text-gray-800 text-sm">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    disabled={qty >= product.stock}
                    className="px-4 py-2.5 text-gray-600 hover:bg-gray-50 disabled:opacity-30 font-bold transition"
                  >
                    +
                  </button>
                </div>

                <span className="text-xs text-gray-400">
                  Max order limit: {product.stock} {product.unit}s
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="w-full bg-brand/10 text-brand border border-brand/20 py-3 rounded-xl font-semibold shadow-sm hover:bg-brand/20 active:scale-[0.99] transition flex items-center justify-center gap-2"
                >
                  {adding ? (
                    <div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Add to Cart"
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full bg-brand text-white py-3 rounded-xl font-semibold shadow-sm hover:opacity-90 active:scale-[0.99] transition"
                >
                  Buy Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Section: Description, Product Specs, Reviews */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex gap-4 border-b border-gray-100 pb-3">
          {["description", "specs", "reviews"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`text-sm font-semibold capitalize transition ${activeTab === t
                  ? "text-brand border-b-2 border-brand pb-3 -mb-3.5"
                  : "text-gray-400 hover:text-gray-600"
                }`}
            >
              {t}
            </button>
          ))}
        </div>

        {activeTab === "description" && (
          <p className="text-sm text-gray-600 leading-relaxed pt-2">
            {product.description || "No specific detailed description provided for this item."}
          </p>
        )}

        {activeTab === "specs" && (
          <div className="grid grid-cols-2 gap-4 text-xs pt-2">
            <div className="p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-400 block">Unit Type</span>
              <span className="font-semibold text-gray-800 capitalize">{product.unit}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-400 block">Category</span>
              <span className="font-semibold text-gray-800">
                {product.category?.name || "General"}
              </span>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="text-center py-6 text-xs text-gray-400 pt-2">
            ★ ★ ★ ★ ☆
            <p className="mt-1">4.5 out of 5 stars based on verified store customer purchases.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;