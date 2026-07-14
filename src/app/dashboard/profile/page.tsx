"use client";

import { motion } from "framer-motion";
import { Building2, Mail, Shield, User, Palette } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { BrandLogo } from "@/components/brand/brand-logo";
import { useTenantBrand } from "@/components/brand/use-tenant-brand";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { isBrandedTenant } from "@/lib/branding";
import { ROLE_LABELS } from "@/types";
import { getInitials, cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user } = useAuth();
  const brand = useTenantBrand();

  if (!user) return null;

  const roleColor = isBrandedTenant(brand.slug)
    ? "bg-accent text-primary border-primary/20"
    : user.role === "INVESTIGATOR"
      ? "bg-red-100 text-red-800 border-red-200"
      : user.role === "CLIENT"
        ? "bg-neutral-100 text-neutral-800 border-neutral-300"
        : "bg-red-50 text-red-900 border-red-300";

  return (
    <AppShell title="Profil Saya">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mx-auto max-w-2xl"
      >
        <Card className="overflow-hidden border-border">
          <div
            className={cn(
              "h-24",
              isBrandedTenant(brand.slug) ? "bg-primary" : "bg-black"
            )}
          />
          <CardHeader className="relative -mt-12 pb-4">
            <Avatar className="h-20 w-20 border-4 border-white">
              <AvatarFallback className="bg-primary text-xl text-white">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="mt-3">
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={roleColor}>
                  <Shield className="mr-1 h-3 w-3" />
                  {ROLE_LABELS[user.role]}
                </Badge>
                {isBrandedTenant(brand.slug) && (
                  <Badge
                    variant="outline"
                    className="border-primary/20 bg-accent text-primary"
                  >
                    <BrandLogo
                      tenant={brand.slug}
                      variant="mark"
                      markClassName="mr-1.5 h-4 w-auto max-w-[48px]"
                    />
                    {brand.name} Portal
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoItem icon={Mail} label="Email" value={user.email} />
              <InfoItem icon={User} label="Peran" value={ROLE_LABELS[user.role]} />
              {user.companyName && (
                <InfoItem
                  icon={Building2}
                  label="Perusahaan"
                  value={user.companyName}
                />
              )}
              <InfoItem icon={Shield} label="ID Pengguna" value={user.id} />
              {brand.slug !== "default" && (
                <InfoItem
                  icon={Palette}
                  label="Tema Portal"
                  value={`${brand.name} Corporate`}
                />
              )}
            </div>

            <div className="rounded-lg border border-dashed border-border bg-muted/50 p-4">
              <p className="text-sm font-medium text-foreground">
                {user.role === "INVESTIGATOR"
                  ? "Sebagai Investigator, Anda dapat mengelola kasus, memperbarui status, dan memposting catatan investigasi."
                  : user.role === "CLIENT" && isBrandedTenant(brand.slug)
                    ? `${brand.name} Portal Investigasi Klaim — lihat kasus Anda, ikuti timeline pelaporan, dan tinggalkan komentar. Pembuatan kasus baru ditangani oleh InvestiHub.`
                    : user.role === "CLIENT"
                      ? "Sebagai Klien, Anda dapat melihat kasus Anda, mengikuti timeline pelaporan, dan meninggalkan komentar. Membuat kasus baru tidak tersedia untuk peran ini."
                      : "Sebagai Administrator, Anda memiliki akses penuh untuk mengelola klien, kasus, dan pengguna."}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AppShell>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
