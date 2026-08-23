
// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext.jsx";
// import { useCart } from "../context/CartContext.jsx";
// import { getImageUrl } from "../utils/imageUrl.js";

// const ProductCard = ({ product }) => {
//   const { user } = useAuth();
//   const { addToCart } = useCart();

//   const [quantity, setQuantity] = useState(1);
//   const [isAdding, setIsAdding] = useState(false);
//   const [isAdded, setIsAdded] = useState(false);
//   const [isWishlisted, setIsWishlisted] = useState(false);

//   const handleAddToCart = async () => {
//     if (product.stock === 0 || isAdding) return;

//     setIsAdding(true);
//     try {
//       await addToCart(product._id, quantity);
//       setIsAdded(true);
//       setTimeout(() => setIsAdded(false), 1800); // Reset feedback after 1.8s
//     } catch (error) {
//       console.error("Failed to add product to cart:", error);
//     } finally {
//       setIsAdding(false);
//     }
//   };

//   const isLowStock = product.stock > 0 && product.stock <= 5;

//   return (
//     <div className="group relative bg-white rounded-xl border border-gray-100 p-4 flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">

//       {/* Wishlist Button */}
//       <button
//         onClick={() => setIsWishlisted(!isWishlisted)}
//         className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-sm text-gray-400 hover:text-red-500 hover:bg-white transition"
//         aria-label="Add to Wishlist"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           fill={isWishlisted ? "currentColor" : "none"}
//           viewBox="0 0 24 24"
//           strokeWidth="1.5"
//           stroke="currentColor"
//           className={`w-5 h-5 transition-colors ${isWishlisted ? "text-red-500" : "text-gray-400"
//             }`}
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
//           />
//         </svg>
//       </button>

//       {/* Clickable Image & Details Container */}
//       <Link to={`/products/${product._id}`} className="block overflow-hidden rounded-lg mb-3">
//         <div className="h-40 bg-gray-50 rounded-lg flex items-center justify-center relative overflow-hidden">
//           {product.image ? (
//             <img
//               src={getImageUrl(product.image)}
//               alt={product.name}
//               className="h-full w-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
//               onError={(e) => {
//                 e.currentTarget.style.display = "none";
//               }}
//             />
//           ) : (
//             <span className="text-4xl select-none group-hover:scale-110 transition-transform">
//               🛍️
//             </span>
//           )}

//           {/* Badges */}
//           {product.stock === 0 && (
//             <span className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center text-xs font-bold text-white uppercase tracking-wider">
//               Out of Stock
//             </span>
//           )}
//           {isLowStock && (
//             <span className="absolute bottom-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
//               Low Stock
//             </span>
//           )}
//         </div>

//         <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
//           {product.category?.name || "General"}
//         </p>
//         <h3 className="font-semibold text-gray-800 line-clamp-1 group-hover:text-brand transition-colors">
//           {product.name}
//         </h3>
//       </Link>

//       {/* Pricing & Availability */}
//       <div>
//         <div className="flex items-baseline justify-between mt-1 mb-3">
//           <span className="text-lg font-bold text-gray-900">
//             ₹{product.price}{" "}
//             <span className="text-xs text-gray-400 font-normal">
//               /{product.unit || "unit"}
//             </span>
//           </span>
//           <span
//             className={`text-xs font-medium ${product.stock > 0 ? "text-emerald-600" : "text-rose-500"
//               }`}
//           >
//             {product.stock > 0 ? `${product.stock} available` : "Unavailable"}
//           </span>
//         </div>

//         {/* Customer Controls */}
//         {user?.role === "customer" && (
//           <div className="space-y-2">
//             {/* Quantity Control (only when in stock) */}
//             {product.stock > 0 && (
//               <div className="flex items-center justify-between border border-gray-200 rounded-lg p-1 bg-gray-50/50">
//                 <span className="text-xs font-semibold text-gray-500 px-2">
//                   Qty
//                 </span>
//                 <div className="flex items-center gap-1 bg-white rounded-md border border-gray-100 shadow-sm">
//                   <button
//                     type="button"
//                     onClick={() => setQuantity((q) => Math.max(1, q - 1))}
//                     disabled={quantity <= 1 || isAdding}
//                     className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30"
//                   >
//                     -
//                   </button>
//                   <span className="text-xs font-semibold px-2">{quantity}</span>
//                   <button
//                     type="button"
//                     onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
//                     disabled={quantity >= product.stock || isAdding}
//                     className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30"
//                   >
//                     +
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Action Button */}
//             <button
//               disabled={product.stock === 0 || isAdding}
//               onClick={handleAddToCart}
//               className={`w-full py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${isAdded
//                   ? "bg-emerald-600 text-white"
//                   : "bg-brand text-white hover:bg-brand-dark active:scale-[0.98]"
//                 } disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed`}
//             >
//               {isAdding ? (
//                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//               ) : isAdded ? (
//                 <>
//                   <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
//                     <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
//                   </svg>
//                   Added!
//                 </>
//               ) : (
//                 "Add to Cart"
//               )}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductCard;

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { getImageUrl } from "../utils/imageUrl.js";

const ProductCard = ({ product, viewMode }) => {
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

      setTimeout(() => {
        setIsAdded(false);
      }, 1800);

    } catch (error) {
      console.error("Failed to add product to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const isLowStock =
    product.stock > 0 && product.stock <= 5;

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: 20,
        scale: 0.97,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      whileHover={{
        y: -6,
        scale: 1.015,
      }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
      className="group relative bg-white rounded-xl border border-gray-100 p-4 flex flex-col justify-between shadow-sm hover:shadow-xl transition-shadow duration-200"
    >

      {/* ================= WISHLIST ================= */}
      <motion.button
        whileHover={{
          scale: 1.15,
        }}
        whileTap={{
          scale: 0.8,
        }}
        onClick={() => setIsWishlisted(!isWishlisted)}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition"
        aria-label="Add to Wishlist"
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          animate={{
            scale: isWishlisted ? [1, 1.3, 1] : 1,
          }}
          transition={{
            duration: 0.3,
          }}
          className={`w-5 h-5 ${
            isWishlisted
              ? "text-red-500 fill-current"
              : "text-gray-400"
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </motion.svg>
      </motion.button>

      {/* ================= PRODUCT IMAGE ================= */}
      <Link
        to={`/products/${product._id}`}
        className="block overflow-hidden rounded-lg mb-3"
      >
        <motion.div
          whileHover="hover"
          className="h-40 bg-gray-50 rounded-lg flex items-center justify-center relative overflow-hidden"
        >

          {product.image ? (

            <motion.img
              src={getImageUrl(product.image)}
              alt={product.name}
              variants={{
                hover: {
                  scale: 1.1,
                },
              }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
              }}
              className="h-full w-full object-contain p-2"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />

          ) : (

            <motion.span
              animate={{
                y: [0, -4, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-4xl select-none"
            >
              🛍️
            </motion.span>

          )}

          {/* Out of Stock */}
          <AnimatePresence>
            {product.stock === 0 && (
              <motion.span
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center text-xs font-bold text-white uppercase tracking-wider"
              >
                Out of Stock
              </motion.span>
            )}
          </AnimatePresence>

          {/* Low Stock */}
          {isLowStock && (
            <motion.span
              initial={{
                opacity: 0,
                x: -10,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.15,
              }}
              className="absolute bottom-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
            >
              Low Stock
            </motion.span>
          )}

        </motion.div>

        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-2">
          {product.category?.name || "General"}
        </p>

        <h3 className="font-semibold text-gray-800 line-clamp-1 group-hover:text-brand transition-colors">
          {product.name}
        </h3>
      </Link>

      {/* ================= PRICE ================= */}
      <div>

        <div className="flex items-baseline justify-between mt-1 mb-3">

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg font-bold text-gray-900"
          >
            ₹{product.price}

            <span className="text-xs text-gray-400 font-normal">
              /{product.unit || "unit"}
            </span>
          </motion.span>

          <span
            className={`text-xs font-medium ${
              product.stock > 0
                ? "text-emerald-600"
                : "text-rose-500"
            }`}
          >
            {product.stock > 0
              ? `${product.stock} available`
              : "Unavailable"}
          </span>

        </div>

        {/* ================= CUSTOMER CONTROLS ================= */}
        {user?.role === "customer" && (
          <div className="space-y-2">

            {/* Quantity */}
            {product.stock > 0 && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="flex items-center justify-between border border-gray-200 rounded-lg p-1 bg-gray-50/50"
              >
                <span className="text-xs font-semibold text-gray-500 px-2">
                  Qty
                </span>

                <div className="flex items-center gap-1 bg-white rounded-md border border-gray-100 shadow-sm">

                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    type="button"
                    onClick={() =>
                      setQuantity((q) => Math.max(1, q - 1))
                    }
                    disabled={quantity <= 1 || isAdding}
                    className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30"
                  >
                    -
                  </motion.button>

                  <motion.span
                    key={quantity}
                    initial={{
                      opacity: 0,
                      y: -5,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="text-xs font-semibold px-2"
                  >
                    {quantity}
                  </motion.span>

                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    type="button"
                    onClick={() =>
                      setQuantity((q) =>
                        Math.min(product.stock, q + 1)
                      )
                    }
                    disabled={
                      quantity >= product.stock || isAdding
                    }
                    className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30"
                  >
                    +
                  </motion.button>

                </div>
              </motion.div>
            )}

            {/* ================= ADD TO CART ================= */}
            <motion.button
              whileHover={{
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.96,
              }}
              disabled={
                product.stock === 0 || isAdding
              }
              onClick={handleAddToCart}
              className={`w-full py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                isAdded
                  ? "bg-emerald-600 text-white"
                  : "bg-brand text-white hover:bg-brand-dark"
              } disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed`}
            >

              <AnimatePresence mode="wait">

                {isAdding ? (

                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                  />

                ) : isAdded ? (

                  <motion.div
                    key="added"
                    initial={{
                      opacity: 0,
                      scale: 0.7,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    className="flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                    </svg>

                    Added!
                  </motion.div>

                ) : (

                  <motion.span
                    key="add"
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                  >
                    Add to Cart
                  </motion.span>

                )}

              </AnimatePresence>

            </motion.button>

          </div>
        )}

      </div>

    </motion.div>
  );
};

export default ProductCard;