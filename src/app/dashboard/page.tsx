"use client";

import { Suspense, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { KanbanBoard } from "@/components/kanban";
import { AppShell } from "@/components/layout/app-shell";
import { ActiveSearchFilters } from "@/components/search/active-search-filters";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_SEARCH_FILTERS,
  filterCases,
  hasActiveFilters,
  paramsToFilters,
  type SearchFilters,
} from "@/lib/search";
import { useAuth } from "@/contexts/auth-context";
import { useCases } from "@/contexts/cases-context";
import { canCreateCases } from "@/types";

function DashboardContent() {
  const { user } = useAuth();
  const { cases, isLoading } = useCases();
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => paramsToFilters(searchParams),
    [searchParams]
  );

  const baseCases = useMemo(() => {
    if (user?.role === "CLIENT") {
      const clientId = user.clientId ?? "client-001";
      return cases.filter((c) => c.clientId === clientId);
    }
    if (user?.role === "INVESTIGATOR") {
      const investigatorId = user.id.replace("user-", "");
      return cases.filter((c) => c.assigneeId === investigatorId);
    }
    return cases;
  }, [cases, user?.role, user?.clientId, user?.id]);

  const filteredCases = useMemo(
    () => (hasActiveFilters(filters) ? filterCases(baseCases, filters) : baseCases),
    [baseCases, filters]
  );

  const handleClearFilters = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  const handleClearField = useCallback(
    (key: keyof SearchFilters) => {
      const next = { ...filters };
      if (key === "status") next.status = "ALL";
      else next[key] = key === "query" ? "" : (DEFAULT_SEARCH_FILTERS[key] as string);
      const params = new URLSearchParams();
      if (next.query) params.set("q", next.query);
      if (next.status !== "ALL") params.set("status", next.status);
      if (next.assignee) params.set("assignee", next.assignee);
      if (next.client) params.set("client", next.client);
      if (next.dateFrom) params.set("from", next.dateFrom);
      if (next.dateTo) params.set("to", next.dateTo);
      const qs = params.toString();
      router.push(qs ? `/dashboard?${qs}` : "/dashboard");
    },
    [filters, router]
  );

  const allowCreate = canCreateCases(user?.role);

  const subtitle =
    user?.role === "CLIENT"
      ? "Pantau kasus klaim Anda, tinjau progres, dan tinggalkan komentar"
      : "Pantau dan kelola kasus klaim asuransi di semua tahap";

  return (
    <AppShell title="Papan Kasus">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">{subtitle}</p>
        {allowCreate && (
          <Button asChild size="sm" className="shrink-0">
            <Link href="/dashboard/cases/new">
              <Plus className="mr-2 h-4 w-4" />
              Kasus Baru
            </Link>
          </Button>
        )}
      </div>

      <ActiveSearchFilters
        filters={filters}
        onClear={handleClearFilters}
        onClearField={handleClearField}
      />

      {hasActiveFilters(filters) && (
        <p className="mb-4 text-sm text-muted-foreground">
          Menampilkan {filteredCases.length} dari {baseCases.length} kasus
        </p>
      )}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Memuat kasus...</p>
      ) : filteredCases.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 py-16 text-center">
          <p className="font-medium">Tidak ada kasus yang cocok</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {user?.role === "CLIENT"
              ? "Coba sesuaikan filter, atau periksa kembali nanti"
              : "Coba sesuaikan filter atau buat kasus baru"}
          </p>
          {allowCreate && (
            <Button asChild className="mt-4" size="sm">
              <Link href="/dashboard/cases/new">
                <Plus className="mr-2 h-4 w-4" />
                Buat Kasus
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <KanbanBoard cases={filteredCases} />
      )}
    </AppShell>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <AppShell title="Papan Kasus">
          <div className="text-sm text-muted-foreground">Memuat...</div>
        </AppShell>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
