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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-center">Create your account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand" />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand" />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand" />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand" />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand" />
        <button type="submit" disabled={loading}
          className="w-full bg-brand text-white py-2 rounded hover:bg-brand-dark disabled:opacity-60">
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>
      <p className="text-sm text-center mt-4 text-gray-500">
        Already have an account? <Link to="/login" className="text-brand font-medium">Login</Link>
      </p>
    </div>
  );
};

export default Register;
