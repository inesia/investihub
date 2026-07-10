"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import type { AuthUser } from "@/types";
import {
  getBrand,
  isBrandedTenant,
  resolveTenantSlug,
  type TenantSlug,
} from "@/lib/branding";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    options?: LoginOptions
  ) => Promise<{ error?: string }>;
  register: (data: RegisterData) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

interface LoginOptions {
  /** Where to go after success (default: /dashboard) */
  redirectTo?: string;
  /** Restrict login to a specific tenant portal */
  requireTenant?: TenantSlug;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
  companyName?: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setUser(data.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (
    email: string,
    password: string,
    options?: LoginOptions
  ) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error ?? "Login failed" };

    const loggedIn = data.user as AuthUser;
    if (options?.requireTenant) {
      const tenant = resolveTenantSlug({
        clientId: loggedIn.clientId,
        companyName: loggedIn.companyName,
        tenantSlug: loggedIn.tenantSlug,
      });
      if (tenant !== options.requireTenant) {
        await fetch("/api/auth/logout", { method: "POST" });
        const portalName = getBrand(options.requireTenant).name;
        return {
          error: `This portal is for ${portalName} clients only. Use InvestiHub Sign In instead.`,
        };
      }
    }

    setUser(loggedIn);
    router.push(options?.redirectTo ?? "/dashboard");
    router.refresh();
    return {};
  };

  const register = async (data: RegisterData) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) return { error: result.error ?? "Registration failed" };
    setUser(result.user);
    router.push("/dashboard");
    router.refresh();
    return {};
  };

  const logout = async () => {
    const tenant = resolveTenantSlug({
      clientId: user?.clientId,
      companyName: user?.companyName,
      tenantSlug: user?.tenantSlug,
    });
    const loginPath = isBrandedTenant(tenant) ? `/login/${tenant}` : "/login";
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push(loginPath);
    router.refresh();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
