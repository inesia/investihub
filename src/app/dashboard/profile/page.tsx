"use client";

import { motion } from "framer-motion";
import { Building2, Mail, Shield, User } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { ROLE_LABELS } from "@/types";
import { getInitials } from "@/lib/utils";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  const roleColor =
    user.role === "INVESTIGATOR"
      ? "bg-red-100 text-red-800 border-red-200"
      : user.role === "CLIENT"
        ? "bg-neutral-100 text-neutral-800 border-neutral-300"
        : "bg-red-50 text-red-900 border-red-300";

  return (
    <AppShell title="My Profile">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mx-auto max-w-2xl"
      >
        <Card className="overflow-hidden border-neutral-200">
          <div className="h-24 bg-black" />
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
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoItem icon={Mail} label="Email" value={user.email} />
              <InfoItem icon={User} label="Role" value={ROLE_LABELS[user.role]} />
              {user.companyName && (
                <InfoItem
                  icon={Building2}
                  label="Company"
                  value={user.companyName}
                />
              )}
              <InfoItem icon={Shield} label="User ID" value={user.id} />
            </div>

            <div className="rounded-lg border border-dashed border-neutral-200 bg-neutral-50 p-4">
              <p className="text-sm font-medium text-foreground">
                {user.role === "INVESTIGATOR"
                  ? "As an Investigator, you can manage cases, update statuses, and review client comments."
                  : user.role === "CLIENT"
                    ? "As a Client, you can view your cases, track progress, and leave comments on active claims."
                    : "As an Administrator, you have full access to manage clients, cases, and users."}
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
    <div className="flex items-start gap-3 rounded-lg border border-neutral-200 p-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium break-all">{value}</p>
      </div>
    </div>
  );
}
