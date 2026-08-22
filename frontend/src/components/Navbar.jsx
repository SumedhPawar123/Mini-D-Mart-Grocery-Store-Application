import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-brand text-white shadow sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          🛒 Mini D-Mart
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link to="/" className="hover:underline">Products</Link>

          {user?.role === "customer" && (
            <>
              <Link to="/cart" className="hover:underline relative">
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-white text-brand text-xs font-bold rounded-full px-1.5">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link to="/orders" className="hover:underline">My Orders</Link>
              <Link to="/returns" className="hover:underline">Returns</Link>
            </>
          )}

          {(user?.role === "staff" || user?.role === "admin") && (
            <Link to="/staff" className="hover:underline">Staff Dashboard</Link>
          )}

          {user?.role === "admin" && (
            <Link to="/admin" className="hover:underline">Admin</Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-white text-brand px-3 py-1 rounded hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="bg-white text-brand px-3 py-1 rounded hover:bg-gray-100">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
