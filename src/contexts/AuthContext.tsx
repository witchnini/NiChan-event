import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiClient, ApiException } from "@/services/apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AuthUser = {
  userId: string;
  role: "admin" | "organizer" | "customer";
  displayName: string;
  email: string;
  avatarUrl?: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ role: string }>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
};

type RegisterData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "nichan_token";
const USER_KEY = "nichan_user";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? (JSON.parse(saved) as AuthUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  // Verify token on mount
  useEffect(() => {
    if (!token) return;
    apiClient
      .get<AuthUser>("/auth/me")
      .then((u) => {
        setUser(u);
        localStorage.setItem(USER_KEY, JSON.stringify(u));
      })
      .catch(() => {
        // Token invalid/expired — clear
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const persist = (t: string, u: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, t);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setToken(t);
    setUser(u);
  };

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await apiClient.post<LoginResponse>("/auth/login", { email, password });
      persist(res.accessToken, res.user);
      return { role: res.user.role };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const res = await apiClient.post<LoginResponse>("/auth/register", data);
      persist(res.accessToken, res.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    window.location.href = "/dang-nhap";
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
