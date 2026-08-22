import { createContext, useContext, useState } from "react";
import api from "../api/axios.js";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("dmart_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setUser(data);
    localStorage.setItem("dmart_user", JSON.stringify(data));
    toast.success(`Welcome back, ${data.name}!`);
    return data;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    setUser(data);
    localStorage.setItem("dmart_user", JSON.stringify(data));
    toast.success("Account created successfully!");
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("dmart_user");
    toast.info("Logged out");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
