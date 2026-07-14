"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { CaseWithRelations } from "@/types";
import { CASE_STATUS_COLUMNS } from "@/types";
import {
  KanbanColumn,
  groupCasesByStatus,
} from "@/components/kanban/kanban-column";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface KanbanBoardProps {
  cases: CaseWithRelations[];
}

export function KanbanBoard({ cases }: KanbanBoardProps) {
  const groupedCases = useMemo(() => groupCasesByStatus(cases), [cases]);

  return (
    <ScrollArea className="w-full whitespace-nowrap pb-4 md:whitespace-normal">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="inline-flex min-w-full gap-3 p-1 md:grid md:grid-cols-3 md:gap-4"
      >
        {CASE_STATUS_COLUMNS.map((column, index) => (
          <motion.div
            key={column.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="w-[280px] shrink-0 md:w-auto md:shrink"
          >
            <KanbanColumn column={column} cases={groupedCases[column.id]} />
          </motion.div>
        ))}
      </motion.div>
      <ScrollBar orientation="horizontal" className="md:hidden" />
    </ScrollArea>
  );
}
