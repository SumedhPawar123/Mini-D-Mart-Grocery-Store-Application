import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col hover:shadow-md transition-shadow">
      <Link to={`/products/${product._id}`}>
        <div className="h-32 bg-gray-100 rounded flex items-center justify-center text-4xl mb-3">
          {product.image ? (
            <img src={product.image} alt={product.name} className="h-full object-contain" />
          ) : (
            "🛍️"
          )}
        </div>
        <h3 className="font-semibold text-gray-800">{product.name}</h3>
        <p className="text-xs text-gray-500">{product.category?.name}</p>
      </Link>

      <div className="flex items-center justify-between mt-3">
        <span className="text-brand font-bold">₹{product.price} <span className="text-xs text-gray-400 font-normal">/{product.unit}</span></span>
        <span className={`text-xs ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </span>
      </div>

      {user?.role === "customer" && (
        <button
          disabled={product.stock === 0}
          onClick={() => addToCart(product._id, 1)}
          className="mt-3 bg-brand text-white text-sm py-1.5 rounded hover:bg-brand-dark disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Add to Cart
        </button>
      )}
    </div>
  );
};

export default ProductCard;
