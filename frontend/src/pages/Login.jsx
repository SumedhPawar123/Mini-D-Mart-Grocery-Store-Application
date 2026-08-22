// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext.jsx";
// import { toast } from "react-toastify";

// const Login = () => {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await login(form.email, form.password);
//       navigate("/");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
//       <h1 className="text-2xl font-bold mb-6 text-center">Login to Mini D-Mart</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={form.email}
//           onChange={handleChange}
//           className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={form.password}
//           onChange={handleChange}
//           className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
//         />
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-brand text-white py-2 rounded hover:bg-brand-dark disabled:opacity-60"
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>
//       <p className="text-sm text-center mt-4 text-gray-500">
//         Don't have an account? <Link to="/register" className="text-brand font-medium">Sign up</Link>
//       </p>
//       <div className="mt-6 text-xs text-gray-400 bg-gray-50 p-3 rounded">
//         <p className="font-semibold mb-1">Test credentials (after seeding):</p>
//         <p>admin@dmart.com / password123</p>
//         <p>staff@dmart.com / password123</p>
//         <p>customer@dmart.com / password123</p>
//       </div>
//     </div>
//   );
// };

// export default Login;


import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await login(form.email, form.password);
      // toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Quick-fill helper for test credentials
  const fillCredentials = (email, password) => {
    setForm({ email, password });
    toast.info(`Filled credentials for ${email.split("@")[0]}`);
  };

  return (
    <div className="max-w-md mx-auto mt-16 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mini D-Mart</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all"
            />
          </div>

          {/* Password Input with Eye Toggle */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 text-xs font-semibold"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand text-white py-3 rounded-xl font-semibold shadow-sm hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-brand font-semibold hover:underline">
            Sign up
          </Link>
        </p>

        {/* 1-Click Interactive Test Credentials */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 text-center">
            Click to Auto-Fill Test Account
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials("customer@dmart.com", "password123")}
              className="py-1.5 px-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 transition active:scale-95"
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => fillCredentials("staff@dmart.com", "password123")}
              className="py-1.5 px-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 transition active:scale-95"
            >
              Staff
            </button>
            <button
              type="button"
              onClick={() => fillCredentials("admin@dmart.com", "password123")}
              className="py-1.5 px-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 transition active:scale-95"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;