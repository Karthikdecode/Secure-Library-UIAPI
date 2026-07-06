import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type User = {
  id: string;
  username?: string;
  name?: string;
  email: string;
  token: string;
};

type AuthCtx = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);
const KEY = "lms_user";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Login failed");

    const nextUser: User = {
      id: data.user?.id?.toString() || "",
      username: data.user?.username || data.user?.name || email.split("@")[0],
      name: data.user?.name || data.user?.username || email.split("@")[0],
      email: data.user?.email || email,
      token: data.accessToken,
    };

    localStorage.setItem(KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const register = async (username: string, email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Registration failed");

    const nextUser: User = {
      id: data.user?.id?.toString() || "",
      username: data.user?.username || data.user?.name || username,
      name: data.user?.name || data.user?.username || username,
      email: data.user?.email || email,
      token: data.accessToken,
    };

    localStorage.setItem(KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem(KEY);
    setUser(null);
  };

  return <Ctx.Provider value={{ user, login, register, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
}