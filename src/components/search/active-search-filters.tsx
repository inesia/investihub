"use client";

import { X } from "lucide-react";
import type { SearchFilters } from "@/lib/search";
import { STATUS_LABELS } from "@/types";
import { Button } from "@/components/ui/button";

interface ActiveSearchFiltersProps {
  filters: SearchFilters;
  onClear: () => void;
  onClearField: (key: keyof SearchFilters) => void;
}

export function ActiveSearchFilters({
  filters,
  onClear,
  onClearField,
}: ActiveSearchFiltersProps) {
  const chips: { key: keyof SearchFilters; label: string }[] = [];

  if (filters.query.trim()) {
    chips.push({ key: "query", label: `"${filters.query}"` });
  }
  if (filters.status !== "ALL") {
    chips.push({
      key: "status",
      label: STATUS_LABELS[filters.status],
    });
  }
  if (filters.assignee.trim()) {
    chips.push({ key: "assignee", label: `Assignee: ${filters.assignee}` });
  }
  if (filters.client.trim()) {
    chips.push({ key: "client", label: `Client: ${filters.client}` });
  }
  if (filters.dateFrom) {
    chips.push({ key: "dateFrom", label: `From: ${filters.dateFrom}` });
  }
  if (filters.dateTo) {
    chips.push({ key: "dateTo", label: `To: ${filters.dateTo}` });
  }

  if (chips.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground">Active filters:</span>
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-800"
        >
          {chip.label}
          <button
            type="button"
            onClick={() =>
              onClearField(
                chip.key === "status" ? "status" : chip.key
              )
            }
            className="rounded-full hover:bg-red-100"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onClear}>
        Clear all
      </Button>
    </div>
  );
}
