import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!product) return <p className="text-center py-16 text-gray-400">Product not found.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 grid sm:grid-cols-2 gap-8">
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-7xl">
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-full object-contain" />
        ) : (
          "🛍️"
        )}
      </div>
      <div>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-gray-500 text-sm mb-2">{product.category?.name}</p>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <p className="text-2xl font-bold text-brand mb-2">₹{product.price} <span className="text-sm text-gray-400 font-normal">/{product.unit}</span></p>
        <p className={`text-sm mb-4 ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </p>

        {user?.role === "customer" && product.stock > 0 && (
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              max={product.stock}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="w-20 border rounded px-2 py-1"
            />
            <button
              onClick={() => addToCart(product._id, qty)}
              className="bg-brand text-white px-4 py-2 rounded hover:bg-brand-dark"
            >
              Add to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
