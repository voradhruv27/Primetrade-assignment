import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check for token and load user profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch profile", err);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Login: call backend /auth/login and store token
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const token = res.data.token;
    localStorage.setItem("token", token);
    // Fetch user profile
    const profile = await api.get("/auth/me");
    setUser(profile.data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
