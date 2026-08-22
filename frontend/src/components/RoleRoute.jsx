import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Requires user to be logged in AND have one of the allowed roles
const RoleRoute = ({ roles, children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

export default RoleRoute;
