import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type User = {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
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

function fakeJwt(email: string) {
  const payload = btoa(JSON.stringify({ email, iat: Date.now() }));
  return `demo.${payload}.sig`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const login = async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 600));
    if (!email || password.length < 4) throw new Error("Invalid credentials");
    const u: User = {
      id: "u_1",
      username: email.split("@")[0] || "admin",
      email,
      role: "admin",
      createdAt: new Date().toISOString(),
      token: fakeJwt(email),
    };
    localStorage.setItem(KEY, JSON.stringify(u));
    setUser(u);
  };

  const register = async (username: string, email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 600));
    if (!username || !email || password.length < 6) throw new Error("Invalid input");
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