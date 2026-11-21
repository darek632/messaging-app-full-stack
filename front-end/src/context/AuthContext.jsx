import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // on first load, check whether a saved token is still valid
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    apiFetch("/auth/me")
      .then((me) => setUser(me))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  async function login(username, password) {
    const data = await apiFetch("/auth/log-in", {
      method: "POST",
      body: { username, password },
    });
    localStorage.setItem("token", data.token);
    setUser(data.user);
  }

  async function signup(username, password, confirmPassword) {
    await apiFetch("/auth/sign-up", {
      method: "POST",
      body: { username, password, confirmPassword },
    });
    await login(username, password);
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}