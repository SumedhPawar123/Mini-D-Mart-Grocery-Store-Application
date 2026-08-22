import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Requires user to be logged in
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default PrivateRoute;
