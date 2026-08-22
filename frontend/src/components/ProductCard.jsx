// import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext.jsx";
// import { useCart } from "../context/CartContext.jsx";

// const ProductCard = ({ product }) => {
//   const { user } = useAuth();
//   const { addToCart } = useCart();

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col hover:shadow-md transition-shadow">
//       <Link to={`/products/${product._id}`}>
//         <div className="h-32 bg-gray-100 rounded flex items-center justify-center text-4xl mb-3">
//           {product.image ? (
//             <img src={product.image} alt={product.name} className="h-full object-contain" />
//           ) : (
//             "🛍️"
//           )}
//         </div>
//         <h3 className="font-semibold text-gray-800">{product.name}</h3>
//         <p className="text-xs text-gray-500">{product.category?.name}</p>
//       </Link>

//       <div className="flex items-center justify-between mt-3">
//         <span className="text-brand font-bold">₹{product.price} <span className="text-xs text-gray-400 font-normal">/{product.unit}</span></span>
//         <span className={`text-xs ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
//           {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
//         </span>
//       </div>

//       {user?.role === "customer" && (
//         <button
//           disabled={product.stock === 0}
//           onClick={() => addToCart(product._id, 1)}
//           className="mt-3 bg-brand text-white text-sm py-1.5 rounded hover:bg-brand-dark disabled:bg-gray-300 disabled:cursor-not-allowed"
//         >
//           Add to Cart
//         </button>
//       )}
//     </div>
//   );
// };

// export default ProductCard;

import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = async () => {
    if (product.stock === 0 || isAdding) return;

    setIsAdding(true);
    try {
      await addToCart(product._id, quantity);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1800); // Reset feedback after 1.8s
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="group relative bg-white rounded-xl border border-gray-100 p-4 flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
      
      {/* Wishlist Button */}
      <button
        onClick={() => setIsWishlisted(!isWishlisted)}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-sm text-gray-400 hover:text-red-500 hover:bg-white transition"
        aria-label="Add to Wishlist"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={isWishlisted ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className={`w-5 h-5 transition-colors ${
            isWishlisted ? "text-red-500" : "text-gray-400"
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      </button>

      {/* Clickable Image & Details Container */}
      <Link to={`/products/${product._id}`} className="block overflow-hidden rounded-lg mb-3">
        <div className="h-40 bg-gray-50 rounded-lg flex items-center justify-center relative overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <span className="text-4xl select-none group-hover:scale-110 transition-transform">
              🛍️
            </span>
          )}

          {/* Badges */}
          {product.stock === 0 && (
            <span className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center text-xs font-bold text-white uppercase tracking-wider">
              Out of Stock
            </span>
          )}
          {isLowStock && (
            <span className="absolute bottom-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              Low Stock
            </span>
          )}
        </div>

        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
          {product.category?.name || "General"}
        </p>
        <h3 className="font-semibold text-gray-800 line-clamp-1 group-hover:text-brand transition-colors">
          {product.name}
        </h3>
      </Link>

      {/* Pricing & Availability */}
      <div>
        <div className="flex items-baseline justify-between mt-1 mb-3">
          <span className="text-lg font-bold text-gray-900">
            ₹{product.price}{" "}
            <span className="text-xs text-gray-400 font-normal">
              /{product.unit || "unit"}
            </span>
          </span>
          <span
            className={`text-xs font-medium ${
              product.stock > 0 ? "text-emerald-600" : "text-rose-500"
            }`}
          >
            {product.stock > 0 ? `${product.stock} available` : "Unavailable"}
          </span>
        </div>

        {/* Customer Controls */}
        {user?.role === "customer" && (
          <div className="space-y-2">
            {/* Quantity Control (only when in stock) */}
            {product.stock > 0 && (
              <div className="flex items-center justify-between border border-gray-200 rounded-lg p-1 bg-gray-50/50">
                <span className="text-xs font-semibold text-gray-500 px-2">
                  Qty
                </span>
                <div className="flex items-center gap-1 bg-white rounded-md border border-gray-100 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isAdding}
                    className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="text-xs font-semibold px-2">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock || isAdding}
                    className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Button */}
            <button
              disabled={product.stock === 0 || isAdding}
              onClick={handleAddToCart}
              className={`w-full py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                isAdded
                  ? "bg-emerald-600 text-white"
                  : "bg-brand text-white hover:bg-brand-dark active:scale-[0.98]"
              } disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed`}
            >
              {isAdding ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isAdded ? (
                <>
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                  </svg>
                  Added!
                </>
              ) : (
                "Add to Cart"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;