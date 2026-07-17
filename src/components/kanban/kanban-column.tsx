"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Info } from "lucide-react";
import type { CaseStatus, CaseWithRelations, KanbanColumn as KanbanColumnType } from "@/types";
import { CaseCard } from "@/components/kanban/case-card";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const STATUS_TOOLTIPS: Record<CaseStatus, string> = {
  NEW: "Kasus baru yang belum diproses oleh Investigator.",
  ON_PROGRESS: "Investigator sedang melakukan investigasi kasus di lapangan.",
  CLOSED: "Kasus telah selesai, laporan akhir sudah diserahkan dan ditutup.",
};

interface KanbanColumnProps {
  column: KanbanColumnType;
  cases: CaseWithRelations[];
  className?: string;
}

export function KanbanColumn({ column, cases, className }: KanbanColumnProps) {
  return (
    <motion.div
      layout
      className={cn(
        "flex min-h-[200px] flex-col rounded-xl border border-neutral-200 bg-neutral-50/50",
        className
      )}
    >
      <div className="sticky top-0 z-10 rounded-t-xl border-b border-neutral-200 bg-white p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn("h-2.5 w-2.5 rounded-full", column.color)} />
            <h3 className="text-sm font-semibold text-foreground">{column.title}</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-primary transition-colors cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-[250px] text-center text-xs">{STATUS_TOOLTIPS[column.id]}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-white">
            {cases.length}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-2">
        <AnimatePresence mode="popLayout">
          {cases.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-8 text-center text-xs text-muted-foreground"
            >
              No cases
            </motion.p>
          ) : (
            cases.map((caseData) => (
              <CaseCard key={caseData.id} caseData={caseData} />
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function groupCasesByStatus(
  cases: CaseWithRelations[]
): Record<CaseStatus, CaseWithRelations[]> {
  const grouped = {} as Record<CaseStatus, CaseWithRelations[]>;

  for (const status of ["NEW", "ON_PROGRESS", "CLOSED"] as CaseStatus[]) {
    grouped[status] = cases.filter((c) => c.status === status);
  }

  return grouped;
}
