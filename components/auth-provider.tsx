"use client";

/* Auth context: token storage, current user, login/logout helpers. */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@/types";
import { api, getToken, setToken } from "@/lib/api";

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  refresh: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

async function fetchMe(): Promise<User | null> {
  if (!getToken()) return null;
  try {
    return await api.get<User>("/auth/me");
  } catch {
    setToken(null);
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [booted, setBooted] = useState(false);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (!isLoading) setBooted(true);
  }, [isLoading]);

  const login = useCallback(
    async (email: string, password: string) => {
      const body = await api.post<{ access_token: string; user: User }>("/auth/login", {
        email,
        password,
      });
      setToken(body.access_token);
      queryClient.setQueryData(["me"], body.user);
      return body.user;
    },
    [queryClient]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const body = await api.post<{ access_token: string; user: User }>("/auth/register", {
        name,
        email,
        password,
      });
      setToken(body.access_token);
      queryClient.setQueryData(["me"], body.user);
      return body.user;
    },
    [queryClient]
  );

  const logout = useCallback(() => {
    setToken(null);
    queryClient.setQueryData(["me"], null);
    queryClient.clear();
  }, [queryClient]);

  const value = useMemo<AuthState>(
    () => ({
      user: data ?? null,
      loading: !booted,
      login,
      register,
      logout,
      refresh: () => void refetch(),
    }),
    [data, booted, login, register, logout, refetch]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
