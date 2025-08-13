import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { signIn as apiSignIn } from "../api/auth";
import { getProfile as apiGetProfile } from "../api/user";
import {
  setAccessToken,
  setRefreshToken,
  clearTokens,
  onLogout,
  broadcastLogout,
} from "../api/tokenStorage";
import API from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let mounted = true;
    const unsub = onLogout(() => {
      if (!mounted) return;
      setUser(null);
    });

    (async () => {
      try {
        const profile = await apiGetProfile();
        if (mounted) setUser(profile);
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setInitializing(false);
      }
    })();

    return () => {
      mounted = false;
      unsub?.();
    };
  }, []);

  const signIn = async ({ email, password }) => {
    clearTokens();

    const res = await apiSignIn({ email, password });
    const vm = res?.data || {};
    const data = vm?.data || {};
    const errorMessage = vm?.errorMessage || "";
    const statusCode = vm?.statusCode;

    if (data?.accessToken) {
      setAccessToken(data.accessToken);
      if (data?.refreshToken) setRefreshToken(data.refreshToken);
      const profile = await apiGetProfile();
      setUser(profile);
      return { status: "ok", user: profile };
    }

    if (errorMessage.includes("User account is not active")) {
      return { status: "inactive", email, message: errorMessage };
    }

    if (errorMessage.includes("User account is deleted")) {
      return { status: "deleted", email, message: errorMessage };
    }

    if (statusCode === 401 || /invalid credentials/i.test(errorMessage)) {
      return { status: "invalid", message: errorMessage || "Invalid credentials" };
    }

    return {
      status: "error",
      message: errorMessage || vm?.responseMessage || "Sign in failed",
    };
  };

  const signOut = async () => {
    try {
      await API.post("/api/auth/signout");
    } catch {
    } finally {
      clearTokens();
      setUser(null);
      broadcastLogout();
    }
  };

  const value = useMemo(
    () => ({
      user,
      authenticated: !!user,
      initializing,
      signIn,
      signOut,
      setUser,
    }),
    [user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}