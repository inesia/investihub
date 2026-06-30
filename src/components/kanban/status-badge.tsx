import type { CaseStatus } from "@/types";
import { STATUS_BADGE_STYLES, STATUS_LABELS } from "@/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: CaseStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        STATUS_BADGE_STYLES[status],
        className
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
