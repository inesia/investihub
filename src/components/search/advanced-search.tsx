"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Calendar,
  FileText,
  RotateCcw,
  Search,
  SlidersHorizontal,
  User,
  X,
} from "lucide-react";
import type { CaseStatus } from "@/types";
import { CASE_STATUS_COLUMNS } from "@/types";
import { StatusBadge } from "@/components/kanban/status-badge";
import { useAuth } from "@/contexts/auth-context";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DEFAULT_SEARCH_FILTERS,
  filterCases,
  filtersToParams,
  hasActiveFilters,
  searchAll,
  type SearchFilters,
  type SearchResultItem,
} from "@/lib/search";
import { useCases } from "@/contexts/cases-context";
import { cn } from "@/lib/utils";

interface AdvancedSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdvancedSearch({ open, onOpenChange }: AdvancedSearchProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { cases } = useCases();
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_SEARCH_FILTERS);
  const [showFilters, setShowFilters] = useState(true);

  const baseCases =
    user?.role === "CLIENT"
      ? cases.filter((c) => c.clientId === (user.clientId ?? "client-001"))
      : cases;

  const results = useMemo(
    () =>
      searchAll(baseCases, filters, {
        includeClients: user?.role === "ADMIN",
      }),
    [baseCases, filters, user?.role]
  );

  const caseCount = useMemo(
    () => filterCases(baseCases, filters).length,
    [baseCases, filters]
  );

  useEffect(() => {
    if (!open) {
      setFilters(DEFAULT_SEARCH_FILTERS);
    }
  }, [open]);

  const updateFilter = <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => setFilters(DEFAULT_SEARCH_FILTERS);

  const handleApplyToBoard = () => {
    const params = filtersToParams(filters);
    const qs = params.toString();
    router.push(qs ? `/dashboard?${qs}` : "/dashboard");
    onOpenChange(false);
  };

  const handleSelectResult = (item: SearchResultItem) => {
    router.push(item.href);
    onOpenChange(false);
  };

  const grouped = useMemo(() => {
    const cases = results.filter((r) => r.type === "case");
    const clients = results.filter((r) => r.type === "client");
    return { cases, clients };
  }, [results]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl gap-0 overflow-hidden p-0 sm:rounded-2xl [&>button:last-child]:hidden">
        <DialogTitle className="sr-only">Advanced Search</DialogTitle>

        {/* Search header */}
        <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              value={filters.query}
              onChange={(e) => updateFilter("query", e.target.value)}
              placeholder="Search policy, insured name, case ID, company, assignee..."
              className="h-12 border-neutral-200 bg-white pl-10 pr-10 text-base shadow-sm"
            />
            {filters.query && (
              <button
                type="button"
                onClick={() => updateFilter("query", "")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters
            </Button>
            {hasActiveFilters(filters) && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-xs text-muted-foreground"
                onClick={handleReset}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </Button>
            )}
            <span className="ml-auto text-xs text-muted-foreground">
              {caseCount} case{caseCount !== 1 ? "s" : ""} found
            </span>
          </div>
        </div>

        {/* Advanced filters — single form */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-b border-neutral-200 bg-white"
            >
              <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
                <FilterField label="Status" icon={FileText}>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      updateFilter("status", e.target.value as CaseStatus | "ALL")
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="ALL">All Status</option>
                    {CASE_STATUS_COLUMNS.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.title}
                      </option>
                    ))}
                  </select>
                </FilterField>

                <FilterField label="Assignee" icon={User}>
                  <Input
                    value={filters.assignee}
                    onChange={(e) => updateFilter("assignee", e.target.value)}
                    placeholder="Investigator name"
                    className="h-9"
                  />
                </FilterField>

                <FilterField label="Client / Company" icon={Building2}>
                  <Input
                    value={filters.client}
                    onChange={(e) => updateFilter("client", e.target.value)}
                    placeholder="Insurance company"
                    className="h-9"
                  />
                </FilterField>

                <FilterField label="Date From" icon={Calendar}>
                  <Input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => updateFilter("dateFrom", e.target.value)}
                    className="h-9"
                  />
                </FilterField>

                <FilterField label="Date To" icon={Calendar}>
                  <Input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => updateFilter("dateTo", e.target.value)}
                    className="h-9"
                  />
                </FilterField>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <div className="max-h-[340px] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="mb-3 h-10 w-10 text-neutral-300" />
              <p className="text-sm font-medium">No results found</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try different keywords or adjust filters
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {grouped.cases.length > 0 && (
                <ResultGroup title="Cases" items={grouped.cases} onSelect={handleSelectResult} />
              )}
              {grouped.clients.length > 0 && (
                <ResultGroup
                  title="Clients"
                  items={grouped.clients}
                  onSelect={handleSelectResult}
                />
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between border-t border-neutral-200 bg-neutral-50 px-4 py-3">
          <p className="hidden text-xs text-muted-foreground sm:block">
            Press{" "}
            <kbd className="rounded border bg-white px-1.5 py-0.5 font-mono text-[10px]">
              Esc
            </kbd>{" "}
            to close
          </p>
          <div className="ml-auto flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={handleApplyToBoard}>
              Apply to Board
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FilterField({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </Label>
      {children}
    </div>
  );
}

function ResultGroup({
  title,
  items,
  onSelect,
}: {
  title: string;
  items: SearchResultItem[];
  onSelect: (item: SearchResultItem) => void;
}) {
  return (
    <div>
      <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {title}
      </p>
      <div className="space-y-0.5">
        {items.map((item) => (
          <button
            key={`${item.type}-${item.id}`}
            type="button"
            onClick={() => onSelect(item)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
              "hover:bg-red-50 focus-visible:bg-red-50 focus-visible:outline-none"
            )}
          >
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                item.type === "case" ? "bg-red-50" : "bg-neutral-100"
              )}
            >
              {item.type === "case" ? (
                <FileText className="h-4 w-4 text-primary" />
              ) : (
                <Building2 className="h-4 w-4 text-neutral-600" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium">{item.title}</p>
                {item.status && <StatusBadge status={item.status} className="shrink-0" />}
              </div>
              <p className="truncate text-xs text-muted-foreground">{item.subtitle}</p>
              <p className="truncate text-[10px] text-muted-foreground">{item.meta}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function SearchTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex h-9 flex-1 max-w-md items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-sm text-muted-foreground transition-colors hover:border-neutral-300 hover:bg-white"
    >
      <Search className="h-4 w-4 shrink-0" />
      <span className="truncate">Search anything...</span>
      <kbd className="ml-auto hidden rounded border bg-white px-1.5 py-0.5 font-mono text-[10px] text-neutral-400 group-hover:text-neutral-600 sm:inline">
        Ctrl K
      </kbd>
    </button>
  );
}

export function useSearchShortcut(onOpen: () => void) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpen();
      }
    },
    [onOpen]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
