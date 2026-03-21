import { getLoginUrl } from "@/const";
import type { User } from "@/types";
import { useEffect, useState } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

async function getCurrentUser() {
  const response = await fetch("/api/auth/me", {
    credentials: "include",
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to load the current user");
  }

  return (await response.json()) as User;
}

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = getLoginUrl() } =
    options ?? {};
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setError(null);
      return currentUser;
    } catch (refreshError) {
      const message =
        refreshError instanceof Error
          ? refreshError.message
          : "Failed to load the current user";
      setUser(null);
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to sign out");
      }

      setUser(null);
      setError(null);
    } catch (logoutError) {
      const message =
        logoutError instanceof Error
          ? logoutError.message
          : "Failed to sign out";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (loading) return;
    if (user) return;
    if (typeof window === "undefined") return;
    if (window.location.pathname === redirectPath) return;

    window.location.href = redirectPath;
  }, [
    redirectOnUnauthenticated,
    redirectPath,
    loading,
    user,
  ]);

  return {
    user,
    loading,
    error,
    isAuthenticated: Boolean(user),
    refresh,
    logout,
  };
}
