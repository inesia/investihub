"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { resolveTenantSlug, type TenantSlug } from "@/lib/branding";

/**
 * Applies tenant theme by setting data-tenant on <html>.
 * - Logged-in branded clients → corporate theme
 * - /login/allianz | /login/prudential → theme before auth
 */
export function TenantThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    let slug: TenantSlug = "default";

    if (pathname?.startsWith("/login/allianz")) {
      slug = "allianz";
    } else if (pathname?.startsWith("/login/prudential")) {
      slug = "prudential";
    } else {
      slug = resolveTenantSlug({
        clientId: user?.clientId,
        companyName: user?.companyName,
        tenantSlug: user?.tenantSlug,
      });
    }

    document.documentElement.setAttribute("data-tenant", slug);

    return () => {
      document.documentElement.setAttribute("data-tenant", "default");
    };
  }, [user?.clientId, user?.companyName, user?.tenantSlug, pathname]);

  return <>{children}</>;
}
