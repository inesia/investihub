"use client";

import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { getBrand, type TenantSlug } from "@/lib/branding";

interface BrandLogoProps {
  tenant?: TenantSlug | null;
  variant?: "full" | "mark" | "sidebar";
  inverted?: boolean;
  collapsed?: boolean;
  className?: string;
  markClassName?: string;
  textClassName?: string;
}

export function BrandLogo({
  tenant = "default",
  variant = "full",
  inverted = false,
  collapsed = false,
  className,
  markClassName,
  textClassName,
}: BrandLogoProps) {
  const brand = getBrand(tenant);
  // Corporate wordmarks (Allianz/Prudential) already include the name
  const isWordmark = brand.slug !== "default" && Boolean(brand.logoSrc);
  // Circular operator seal used as InvestiHub mark
  const isSeal = brand.slug === "default" && Boolean(brand.logoSrc);
  const showText = variant !== "mark" && !collapsed && !isWordmark;

  const currentSrc = (inverted && brand.invertedLogoSrc) ? brand.invertedLogoSrc : brand.logoSrc;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {currentSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={currentSrc}
          alt={brand.name}
          width={isWordmark ? 120 : 36}
          height={isWordmark ? 32 : 36}
          className={cn(
            "shrink-0 object-contain",
            isWordmark
              ? collapsed
                ? "h-7 w-7"
                : variant === "mark"
                  ? "h-5 w-auto max-w-[72px]"
                  : "h-8 w-auto max-w-[140px]"
              : isSeal
                ? cn(
                    "rounded-full object-cover",
                    collapsed || variant === "mark" ? "h-8 w-8" : "h-9 w-9"
                  )
                : "h-8 w-8 rounded-lg",
            inverted && isWordmark && !brand.invertedLogoSrc && "brightness-0 invert",
            markClassName
          )}
        />
      ) : (
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary",
            markClassName
          )}
        >
          <Shield className="h-4 w-4 text-white" />
        </div>
      )}
      {showText && (
        <span
          className={cn(
            "text-lg font-bold tracking-tight",
            inverted ? "text-white" : "text-foreground",
            textClassName
          )}
        >
          {brand.shortName}
        </span>
      )}
    </div>
  );
}
