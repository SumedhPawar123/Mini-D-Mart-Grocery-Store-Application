import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";
import {
  Eye,
  EyeOff,
  ShoppingCart,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const isRegister = location.pathname === "/register";

  // ==============================
  // LOGIN STATE
  // ==============================
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // ==============================
  // REGISTER STATE
  // ==============================
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  // ==============================
  // LOGIN CHANGE
  // ==============================
  const handleLoginChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  // ==============================
  // REGISTER CHANGE
  // ==============================
  const handleRegisterChange = (e) => {
    setRegisterForm({
      ...registerForm,
      [e.target.name]: e.target.value,
    });
  };

  // ==============================
  // LOGIN
  // ==============================
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginForm.email || !loginForm.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoginLoading(true);

    try {
      await login(loginForm.email, loginForm.password);

      toast.success("Welcome back!");

      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      setLoginLoading(false);
    }
  };

  // ==============================
  // REGISTER
  // ==============================
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!agreeTerms) {
      toast.error(
        "Please accept the Terms and Conditions"
      );
      return;
    }

    // Frontend password validation
    const password = registerForm.password;

    if (password.length < 8) {
      toast.error(
        "Password must be at least 8 characters"
      );
      return;
    }

    if (!/[A-Za-z]/.test(password)) {
      toast.error(
        "Password must contain at least one letter"
      );
      return;
    }

    if (!/\d/.test(password)) {
      toast.error(
        "Password must contain at least one number"
      );
      return;
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      toast.error(
        "Password must contain at least one special character"
      );
      return;
    }

    setRegisterLoading(true);

    try {
      await register(registerForm);

      toast.success(
        "Account created successfully!"
      );

      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setRegisterLoading(false);
    }
  };

  // ==============================
  // PASSWORD STRENGTH
  // ==============================
  const getPasswordStrength = () => {
    const password = registerForm.password;

    if (!password) {
      return {
        label: "",
        score: 0,
        className: "bg-gray-200",
      };
    }

    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Za-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) {
      return {
        label: "Weak",
        score: 25,
        className: "bg-rose-500",
      };
    }

    if (score === 2) {
      return {
        label: "Fair",
        score: 50,
        className: "bg-amber-500",
      };
    }

    if (score === 3) {
      return {
        label: "Good",
        score: 75,
        className: "bg-blue-500",
      };
    }

    return {
      label: "Strong",
      score: 100,
      className: "bg-emerald-500",
    };
  };

  const strength = getPasswordStrength();

  // ==============================
  // SWITCH AUTH PAGE
  // ==============================
  const switchToLogin = () => {
    navigate("/login");
  };

  const switchToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4 py-10 bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">

      {/* Main Auth Container */}
      <div
        className="
          relative
          w-full
          max-w-5xl
          min-h-[650px]
          bg-white
          rounded-3xl
          shadow-2xl
          overflow-hidden
          border
          border-gray-100
        "
      >

        {/* ==========================================
            FORMS CONTAINER
        ========================================== */}

        <div
          className={`
            absolute
            top-0
            left-0
            h-full
            w-full
            flex
            transition-transform
            duration-700
            ease-[cubic-bezier(0.77,0,0.175,1)]
            ${
              isRegister
                ? "-translate-x-0"
                : "translate-x-0"
            }
          `}
        >

          {/* ==========================================
              LOGIN FORM
          ========================================== */}

          <div
            className={`
              w-1/2
              min-w-full
              md:min-w-[50%]
              h-full
              flex
              items-center
              justify-center
              p-8
              md:p-12
              transition-all
              duration-700
              ${
                isRegister
                  ? "opacity-0 scale-95 pointer-events-none"
                  : "opacity-100 scale-100"
              }
            `}
          >
            <div className="w-full max-w-md">

              {/* Logo */}
              <div className="flex justify-center mb-5">
                <div className="w-14 h-14 bg-brand text-white rounded-2xl flex items-center justify-center shadow-lg">
                  <ShoppingCart size={28} />
                </div>
              </div>

              <div className="text-center mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">
                  Welcome Back
                </h1>

                <p className="text-sm text-gray-500 mt-2">
                  Sign in to continue shopping
                </p>
              </div>

              <form
                onSubmit={handleLogin}
                className="space-y-5"
              >

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    placeholder="name@example.com"
                    required
                    className="
                      w-full
                      border border-gray-200
                      rounded-xl
                      px-4 py-3
                      text-sm
                      outline-none
                      transition
                      focus:border-brand
                      focus:ring-2
                      focus:ring-brand/20
                    "
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      type={
                        showLoginPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      placeholder="••••••••"
                      required
                      className="
                        w-full
                        border border-gray-200
                        rounded-xl
                        px-4 py-3
                        pr-12
                        text-sm
                        outline-none
                        transition
                        focus:border-brand
                        focus:ring-2
                        focus:ring-brand/20
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowLoginPassword(
                          !showLoginPassword
                        )
                      }
                      className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                        hover:text-gray-700
                      "
                    >
                      {showLoginPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="
                    w-full
                    bg-brand
                    text-white
                    py-3
                    rounded-xl
                    font-bold
                    shadow-lg
                    hover:opacity-90
                    transition
                    disabled:opacity-50
                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >
                  {loginLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* Switch */}
              <div className="text-center mt-7">
                <p className="text-sm text-gray-500">
                  Don't have an account?
                </p>

                <button
                  onClick={switchToRegister}
                  className="mt-1 text-brand font-bold hover:underline"
                >
                  Create an account
                </button>
              </div>
            </div>
          </div>

          {/* ==========================================
              REGISTER FORM
          ========================================== */}

          <div
            className={`
              w-1/2
              min-w-full
              md:min-w-[50%]
              h-full
              flex
              items-center
              justify-center
              p-8
              md:p-12
              transition-all
              duration-700
              ${
                isRegister
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }
            `}
          >
            <div className="w-full max-w-md">

              {/* Logo */}
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-brand text-white rounded-2xl flex items-center justify-center">
                  <ShoppingCart size={24} />
                </div>
              </div>

              <div className="text-center mb-5">
                <h1 className="text-3xl font-extrabold text-gray-900">
                  Create Account
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Join Mini D-Mart today
                </p>
              </div>

              <form
                onSubmit={handleRegister}
                className="space-y-3"
              >

                {/* Name */}
                <input
                  name="name"
                  value={registerForm.name}
                  onChange={handleRegisterChange}
                  placeholder="Full Name"
                  required
                  className="
                    w-full
                    border border-gray-200
                    rounded-xl
                    px-4 py-2.5
                    text-sm
                    outline-none
                    focus:border-brand
                    focus:ring-2
                    focus:ring-brand/20
                  "
                />

                {/* Email */}
                <input
                  type="email"
                  name="email"
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                  placeholder="Email Address"
                  required
                  className="
                    w-full
                    border border-gray-200
                    rounded-xl
                    px-4 py-2.5
                    text-sm
                    outline-none
                    focus:border-brand
                    focus:ring-2
                    focus:ring-brand/20
                  "
                />

                {/* Password */}
                <div>
                  <div className="relative">
                    <input
                      type={
                        showRegisterPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      value={registerForm.password}
                      onChange={handleRegisterChange}
                      placeholder="Password"
                      required
                      className="
                        w-full
                        border border-gray-200
                        rounded-xl
                        px-4 py-2.5
                        pr-12
                        text-sm
                        outline-none
                        focus:border-brand
                        focus:ring-2
                        focus:ring-brand/20
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowRegisterPassword(
                          !showRegisterPassword
                        )
                      }
                      className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                      "
                    >
                      {showRegisterPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>

                  {/* Strength */}
                  {registerForm.password && (
                    <div className="mt-2">
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-gray-400">
                          Password strength
                        </span>

                        <span className="font-bold">
                          {strength.label}
                        </span>
                      </div>

                      <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${strength.className} transition-all duration-300`}
                          style={{
                            width: `${strength.score}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Phone */}
                <input
                  name="phone"
                  value={registerForm.phone}
                  onChange={handleRegisterChange}
                  placeholder="Phone Number"
                  required
                  className="
                    w-full
                    border border-gray-200
                    rounded-xl
                    px-4 py-2.5
                    text-sm
                    outline-none
                    focus:border-brand
                    focus:ring-2
                    focus:ring-brand/20
                  "
                />

                {/* Address */}
                <textarea
                  name="address"
                  value={registerForm.address}
                  onChange={handleRegisterChange}
                  placeholder="Delivery Address"
                  rows={2}
                  className="
                    w-full
                    border border-gray-200
                    rounded-xl
                    px-4 py-2.5
                    text-sm
                    outline-none
                    resize-none
                    focus:border-brand
                    focus:ring-2
                    focus:ring-brand/20
                  "
                />

                {/* Terms */}
                <label className="flex items-center gap-2 text-xs text-gray-500">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) =>
                      setAgreeTerms(
                        e.target.checked
                      )
                    }
                    className="w-4 h-4 accent-brand"
                  />

                  I agree to the
                  <span className="text-brand underline font-semibold">
                    Terms & Conditions
                  </span>
                </label>

                {/* Register */}
                <button
                  type="submit"
                  disabled={
                    registerLoading ||
                    !agreeTerms
                  }
                  className="
                    w-full
                    bg-brand
                    text-white
                    py-3
                    rounded-xl
                    font-bold
                    shadow-lg
                    hover:opacity-90
                    transition
                    disabled:opacity-50
                    flex
                    justify-center
                    items-center
                    gap-2
                  "
                >
                  {registerLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <CheckCircle2 size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* Switch */}
              <div className="text-center mt-5">
                <p className="text-sm text-gray-500">
                  Already have an account?
                </p>

                <button
                  onClick={switchToLogin}
                  className="mt-1 text-brand font-bold hover:underline"
                >
                  Sign in instead
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            ANIMATED OVERLAY
        ========================================== */}

        <div
          className={`
            hidden
            md:flex
            absolute
            top-0
            w-1/2
            h-full
            bg-brand
            text-white
            z-20
            items-center
            justify-center
            p-12
            transition-all
            duration-700
            ease-[cubic-bezier(0.77,0,0.175,1)]
            ${
              isRegister
                ? "left-0 rounded-r-[120px]"
                : "left-1/2 rounded-l-[120px]"
            }
          `}
        >
          <div
            className={`
              text-center
              max-w-sm
              transition-all
              duration-500
              ${
                isRegister
                  ? "opacity-100 translate-x-0"
                  : "opacity-100 translate-x-0"
              }
            `}
          >

            <div className="text-7xl mb-6">
              {isRegister ? "🛒" : "🥦"}
            </div>

            <h2 className="text-4xl font-extrabold mb-4">
              {isRegister
                ? "Already a Member?"
                : "Fresh Groceries Await!"}
            </h2>

            <p className="text-white/80 text-sm leading-6 mb-8">
              {isRegister
                ? "Welcome back! Sign in to access your orders, cart, and personalized shopping experience."
                : "Create your Mini D-Mart account and enjoy easy grocery shopping, scheduled pickup, and home delivery."}
            </p>

            <button
              onClick={
                isRegister
                  ? switchToLogin
                  : switchToRegister
              }
              className="
                border-2
                border-white
                px-8
                py-3
                rounded-xl
                font-bold
                hover:bg-white
                hover:text-brand
                transition-all
              "
            >
              {isRegister
                ? "Sign In"
                : "Create Account"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Auth;