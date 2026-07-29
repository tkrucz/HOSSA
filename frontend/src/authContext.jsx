import { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "./api";

const TOKEN_KEY = "hossa_token";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setUser)
      .catch(() => {
        // Token expired/invalid - drop it and force a fresh login.
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const applySession = (data) => {
    localStorage.setItem(TOKEN_KEY, data.access_token);
    setToken(data.access_token);
    setUser(data.user);
  };

  const login = async (loginValue, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login: loginValue, password }),
    });
    const body = await res.json().catch(() => null);
    if (!res.ok) throw new Error(body?.detail || "Nie udało się zalogować");
    applySession(body);
  };

  const register = async (userName, userSurname, loginValue, password) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_name: userName,
        user_surname: userSurname,
        login: loginValue,
        password,
      }),
    });
    const body = await res.json().catch(() => null);
    if (!res.ok) throw new Error(body?.detail || "Nie udało się założyć konta");
    applySession(body);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// Small helper for other components making authenticated requests, e.g.:
// fetch(url, { headers: authHeaders(token) })
export function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}