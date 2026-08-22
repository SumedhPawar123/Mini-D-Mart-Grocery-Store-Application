// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext.jsx";
// import { toast } from "react-toastify";

// const Register = () => {
//   const { register } = useAuth();
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     phone: "",
//     address: "",
//   });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await register(form);
//       navigate("/");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Registration failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
//       <h1 className="text-2xl font-bold mb-6 text-center">Create your account</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange}
//           className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand" />
//         <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange}
//           className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand" />
//         <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange}
//           className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand" />
//         <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange}
//           className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand" />
//         <input name="address" placeholder="Address" value={form.address} onChange={handleChange}
//           className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand" />
//         <button type="submit" disabled={loading}
//           className="w-full bg-brand text-white py-2 rounded hover:bg-brand-dark disabled:opacity-60">
//           {loading ? "Creating account..." : "Sign Up"}
//         </button>
//       </form>
//       <p className="text-sm text-center mt-4 text-gray-500">
//         Already have an account? <Link to="/login" className="text-brand font-medium">Login</Link>
//       </p>
//     </div>
//   );
// };

// export default Register;


import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Calculate live form completion percentage
  const filledFields = Object.values(form).filter((val) => val.trim() !== "").length;
  const progressPercent = (filledFields / 5) * 100;

  // Simple password strength calculator
  const getPasswordStrength = () => {
    const p = form.password;
    if (!p) return { label: "", score: 0, color: "bg-gray-200" };
    if (p.length < 6) return { label: "Weak", score: 33, color: "bg-rose-500" };
    if (p.length >= 6 && /[A-Z]/.test(p) && /[0-9]/.test(p)) {
      return { label: "Strong", score: 100, color: "bg-emerald-500" };
    }
    return { label: "Fair", score: 66, color: "bg-amber-500" };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      toast.error("Please accept the Terms and Conditions to proceed");
      return;
    }

    setLoading(true);
    try {
      await register(form);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 text-center">Create your account</h1>
        <p className="text-xs text-gray-500 text-center mt-1">Join us to manage orders and track deliveries.</p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
          <span>Form Progress</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
          <input
            name="name"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 transition"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="john@example.com"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 transition"
          />
        </div>

        {/* Password with Strength Indicator & Toggle */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-xl pl-3.5 pr-12 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-gray-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Password Strength Meter */}
          {form.password && (
            <div className="mt-2 space-y-1">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-gray-400 font-medium">Strength:</span>
                <span className="font-semibold text-gray-700">{strength.label}</span>
              </div>
              <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${strength.color} transition-all duration-300`}
                  style={{ width: `${strength.score}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
          <input
            name="phone"
            placeholder="+91 98765 43210"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 transition"
          />
        </div>

        {/* Delivery Address */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Address</label>
          <textarea
            name="address"
            placeholder="Flat, Building, Street Name..."
            value={form.address}
            onChange={handleChange}
            rows={2}
            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 transition resize-none"
          />
        </div>

        {/* Terms Checkbox */}
        <label className="flex items-center gap-2 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="rounded border-gray-300 text-brand focus:ring-brand rounded-md w-4 h-4"
          />
          <span className="text-xs text-gray-500">
            I agree to the <span className="text-brand underline">Terms & Conditions</span>
          </span>
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !agreeTerms}
          className="w-full bg-brand text-white py-3 rounded-xl font-semibold shadow-sm hover:opacity-90 active:scale-[0.99] transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>

      <p className="text-xs text-center text-gray-500">
        Already have an account?{" "}
        <Link to="/login" className="text-brand font-semibold hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Register;