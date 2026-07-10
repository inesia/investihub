"use client";

import { useMemo } from "react";
import { useAuth } from "@/contexts/auth-context";
import { getBrand, resolveTenantSlug, type TenantBrand } from "@/lib/branding";

export function useTenantBrand(): TenantBrand {
  const { user } = useAuth();

  return useMemo(
    () =>
      getBrand(
        resolveTenantSlug({
          clientId: user?.clientId,
          companyName: user?.companyName,
          tenantSlug: user?.tenantSlug,
        })
      ),
    [user?.clientId, user?.companyName, user?.tenantSlug]
  );
}
