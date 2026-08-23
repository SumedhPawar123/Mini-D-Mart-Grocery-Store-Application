import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import RoleRoute from "./components/RoleRoute.jsx";

import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
// import Login from "./pages/Login.jsx";
// import Register from "./pages/Register.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Orders from "./pages/Orders.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import Returns from "./pages/Returns.jsx";
import StaffDashboard from "./pages/StaffDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import NotFound from "./pages/NotFound.jsx";
import Footer from "./components/Footer.jsx";
import Auth from "./pages/Auth.jsx";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ToastContainer position="top-right" autoClose={2500} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />

        <Route path="/cart" element={<RoleRoute roles={["customer"]}><Cart /></RoleRoute>} />
        <Route path="/checkout" element={<RoleRoute roles={["customer"]}><Checkout /></RoleRoute>} />
        <Route path="/orders" element={<RoleRoute roles={["customer"]}><Orders /></RoleRoute>} />
        <Route path="/orders/:id" element={<PrivateRoute><OrderDetail /></PrivateRoute>} />
        <Route path="/returns" element={<RoleRoute roles={["customer"]}><Returns /></RoleRoute>} />

        <Route path="/staff" element={<RoleRoute roles={["staff", "admin"]}><StaffDashboard /></RoleRoute>} />
        <Route path="/admin" element={<RoleRoute roles={["admin"]}><AdminDashboard /></RoleRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer/>
    </div>
  );
}

export default App;
