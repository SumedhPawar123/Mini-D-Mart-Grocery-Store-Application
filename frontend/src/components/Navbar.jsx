// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext.jsx";
// import { useCart } from "../context/CartContext.jsx";

// const Navbar = () => {
//   const { user, logout } = useAuth();
//   const { cartCount } = useCart();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <nav className="bg-brand text-white shadow sticky top-0 z-10">
//       <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
//         <Link to="/" className="text-xl font-bold">
//           🛒 Mini D-Mart
//         </Link>

//         <div className="flex items-center gap-4 text-sm">
//           <Link to="/" className="hover:underline">Products</Link>

//           {user?.role === "customer" && (
//             <>
//               <Link to="/cart" className="hover:underline relative">
//                 Cart
//                 {cartCount > 0 && (
//                   <span className="absolute -top-2 -right-3 bg-white text-brand text-xs font-bold rounded-full px-1.5">
//                     {cartCount}
//                   </span>
//                 )}
//               </Link>
//               <Link to="/orders" className="hover:underline">My Orders</Link>
//               <Link to="/returns" className="hover:underline">Returns</Link>
//             </>
//           )}

//           {(user?.role === "staff" || user?.role === "admin") && (
//             <Link to="/staff" className="hover:underline">Staff Dashboard</Link>
//           )}

//           {user?.role === "admin" && (
//             <Link to="/admin" className="hover:underline">Admin</Link>
//           )}

//           {user ? (
//             <div className="flex items-center gap-3">
//               <span className="hidden sm:inline">Hi, {user.name}</span>
//               <button
//                 onClick={handleLogout}
//                 className="bg-white text-brand px-3 py-1 rounded hover:bg-gray-100"
//               >
//                 Logout
//               </button>
//             </div>
//           ) : (
//             <div className="flex items-center gap-3">
//               <Link to="/login" className="hover:underline">Login</Link>
//               <Link to="/register" className="bg-white text-brand px-3 py-1 rounded hover:bg-gray-100">
//                 Sign Up
//               </Link>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-brand text-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="text-xl font-extrabold tracking-tight flex items-center gap-2">
          <span>🛒</span> Mini D-Mart
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            to="/"
            className={`transition hover:opacity-80 ${
              isActive("/") ? "border-b-2 border-white pb-0.5 font-bold" : ""
            }`}
          >
            Products
          </Link>

          {user?.role === "customer" && (
            <>
              <Link
                to="/orders"
                className={`transition hover:opacity-80 ${
                  isActive("/orders") ? "border-b-2 border-white pb-0.5 font-bold" : ""
                }`}
              >
                My Orders
              </Link>
              <Link
                to="/returns"
                className={`transition hover:opacity-80 ${
                  isActive("/returns") ? "border-b-2 border-white pb-0.5 font-bold" : ""
                }`}
              >
                Returns
              </Link>
            </>
          )}

          {(user?.role === "staff" || user?.role === "admin") && (
            <Link
              to="/staff"
              className={`transition hover:opacity-80 ${
                isActive("/staff") ? "border-b-2 border-white pb-0.5 font-bold" : ""
              }`}
            >
              Staff Dashboard
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              to="/admin"
              className={`transition hover:opacity-80 ${
                isActive("/admin") ? "border-b-2 border-white pb-0.5 font-bold" : ""
              }`}
            >
              Admin
            </Link>
          )}
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-4">
          {/* Cart Icon Button */}
          {(!user || user?.role === "customer") && (
            <Link
              to="/cart"
              className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 transition flex items-center justify-center"
              aria-label="Cart"
            >
              <span className="text-lg">🛍️</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-brand text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-sm animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {/* User Profile Dropdown or Auth Buttons */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition text-sm font-semibold"
              >
                <div className="w-7 h-7 bg-white text-brand rounded-full flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                  {user.name?.[0] || "U"}
                </div>
                <span className="hidden sm:inline">Hi, {user.name?.split(" ")[0]}</span>
                <span className="text-xs">▼</span>
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/orders"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="block px-4 py-2 text-xs font-medium hover:bg-gray-50 text-gray-700"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/returns"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="block px-4 py-2 text-xs font-medium hover:bg-gray-50 text-gray-700"
                  >
                    Returns & Exchanges
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 border-t border-gray-100 mt-1"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 text-sm font-semibold">
              <Link to="/login" className="px-3 py-1.5 hover:opacity-80 transition">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-brand px-4 py-1.5 rounded-xl shadow-sm hover:bg-gray-50 active:scale-[0.98] transition"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-lg"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-brand border-t border-white/10 px-4 py-4 space-y-3 shadow-inner">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium py-1.5 hover:opacity-80"
          >
            Products Catalog
          </Link>

          {user?.role === "customer" && (
            <>
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium py-1.5 hover:opacity-80"
              >
                My Orders
              </Link>
              <Link
                to="/returns"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium py-1.5 hover:opacity-80"
              >
                Returns
              </Link>
            </>
          )}

          {(user?.role === "staff" || user?.role === "admin") && (
            <Link
              to="/staff"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium py-1.5 hover:opacity-80"
            >
              Staff Dashboard
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium py-1.5 hover:opacity-80"
            >
              Admin Control Panel
            </Link>
          )}

          {!user && (
            <div className="pt-2 border-t border-white/10 flex gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 bg-white/10 rounded-xl text-xs font-semibold"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 bg-white text-brand rounded-xl text-xs font-bold"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;