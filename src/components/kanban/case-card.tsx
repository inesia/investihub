"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { User, Building2 } from "lucide-react";
import type { CaseWithRelations } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/kanban/status-badge";
import { cn } from "@/lib/utils";

interface CaseCardProps {
  caseData: CaseWithRelations;
  className?: string;
}

const COMPANY_LOGOS: Record<string, string> = {
  "PT Allianz Indonesia": "/brands/allianz/logo.svg",
  "PT Asuransi Allianz Life Indonesia": "/brands/allianz/logo.svg",
  "PT Asuransi Jiwa Manulife Indonesia": "/brands/manulife/manulife-logo.png",
  "PT Prudential Life Assurance": "/brands/prudential/Prudential_plc_logo.svg.webp",
};

export function CaseCard({ caseData, className }: CaseCardProps) {
  const companyName = caseData.client.companyName ?? caseData.client.name;
  const logoUrl = COMPANY_LOGOS[companyName];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={`/dashboard/cases/${caseData.id}`}
        className={cn(
          "block w-full rounded-lg border border-neutral-200 bg-white p-3 text-left shadow-sm transition-colors",
          "hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          className
        )}
      >
        <div className="mb-2 flex items-start justify-between gap-2">
          <p className="text-xs font-mono font-medium text-neutral-500">
            {caseData.policyNumber}
          </p>
          <StatusBadge status={caseData.status} />
        </div>

        <div className="mb-3 flex items-start gap-2.5">
          {logoUrl ? (
            <Avatar className="h-6 w-6 shrink-0 rounded-sm bg-white border border-neutral-100 shadow-sm">
              <AvatarImage src={logoUrl} alt={companyName} className="object-contain p-0.5" />
              <AvatarFallback className="rounded-sm"><Building2 className="h-3 w-3" /></AvatarFallback>
            </Avatar>
          ) : (
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-neutral-100 border border-neutral-200">
               <Building2 className="h-3 w-3 text-neutral-500" />
            </div>
          )}
          <h4 className="line-clamp-2 text-sm font-semibold text-foreground">
            {caseData.insuredName}
          </h4>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Building2 className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {caseData.client.companyName ?? caseData.client.name}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <User className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {caseData.assignee?.name ?? "Unassigned"}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
