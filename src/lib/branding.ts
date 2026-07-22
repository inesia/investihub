export type TenantSlug = "default" | "allianz" | "prudential" | "investigator" | "manulife";

export interface TenantBrand {
  slug: TenantSlug;
  name: string;
  shortName: string;
  tagline: string;
  logoSrc: string | null;
  invertedLogoSrc?: string | null;
  clientId: string | null;
}

/** Parent company that operates InvestiHub — shown on every portal */
export const OPERATOR = {
  name: "PT. Global Investigasi",
  shortName: "Global Investigasi",
  logoSrc: "/global_investigasi.png",
  credit: "Operated by",
} as const;

export const TENANT_BRANDS: Record<TenantSlug, TenantBrand> = {
  default: {
    slug: "default",
    name: "InvestiHub",
    shortName: "InvestiHub",
    tagline: "Insurance Claim Management",
    logoSrc: "/global_investigasi.png",
    clientId: null,
  },
  allianz: {
    slug: "allianz",
    name: "Allianz",
    shortName: "Allianz",
    tagline: "Claim Investigation Portal",
    logoSrc: "/brands/allianz/Allianz.svg.webp",
    clientId: "client-002",
  },
  prudential: {
    slug: "prudential",
    name: "Prudential",
    shortName: "Prudential",
    tagline: "Claim Investigation Portal",
    logoSrc: "/brands/prudential/Prudential_plc_logo.svg.webp",
    clientId: "client-003",
  },
  investigator: {
    slug: "investigator",
    name: "InvestiHub Investigator",
    shortName: "Investigator",
    tagline: "Field Investigation Portal",
    logoSrc: "/global_investigasi.png",
    clientId: null,
  },
  manulife: {
    slug: "manulife",
    name: "PT Asuransi Jiwa Manulife Indonesia",
    shortName: "Manulife",
    tagline: "Claim Investigation Portal",
    logoSrc: "/brands/manulife/manulife-logo.png",
    invertedLogoSrc: "/brands/manulife/logo-manulife-white.png",
    clientId: "client-002",
  },
};

/** Map mock client company IDs to tenant branding */
const CLIENT_ID_TO_TENANT: Record<string, TenantSlug> = {
  "client-002": "manulife",
  "client-003": "manulife",
};

export function isBrandedTenant(slug?: TenantSlug | null): boolean {
  return Boolean(slug && slug !== "default");
}

export function getTenantFromClientId(
  clientId?: string | null
): TenantSlug {
  if (!clientId) return "default";
  return CLIENT_ID_TO_TENANT[clientId] ?? "default";
}

export function getBrand(slug?: TenantSlug | null): TenantBrand {
  return TENANT_BRANDS[slug ?? "default"] ?? TENANT_BRANDS.default;
}

export function resolveTenantSlug(options: {
  clientId?: string | null;
  companyName?: string | null;
  tenantSlug?: string | null;
}): TenantSlug {
  if (options.tenantSlug === "allianz") return "allianz";
  if (options.tenantSlug === "manulife") return "manulife";
  if (options.tenantSlug === "prudential") return "prudential";
  if (options.clientId) return getTenantFromClientId(options.clientId);
  const company = options.companyName?.toLowerCase() ?? "";
  if (company.includes("allianz")) return "allianz";
  if (company.includes("manulife")) return "manulife";
  if (company.includes("prudential")) return "prudential";
  return "default";
}
