"use client";

import { useMemo } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { CaseCard } from "@/components/kanban/case-card";
import { useCases } from "@/contexts/cases-context";
import { useAuth } from "@/contexts/auth-context";

export default function ArchivePage() {
  const { cases, isLoading } = useCases();
  const { user } = useAuth();

  const archivedCases = useMemo(() => {
    let filtered = cases.filter((c) => c.status === "ARCHIVED");
    
    // If the user is a client, only show their archived cases
    if (user?.role === "CLIENT") {
      const clientId = user.clientId ?? "client-001";
      filtered = filtered.filter((c) => c.clientId === clientId);
    }
    
    return filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }, [cases, user?.role, user?.clientId]);

  return (
    <AppShell title="Arsip Kasus">
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Daftar kasus yang telah selesai dan diarsipkan.
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Memuat arsip...</p>
      ) : archivedCases.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 py-16 text-center">
          <p className="font-medium">Belum ada kasus yang diarsipkan</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Kasus yang sudah selesai akan dipindahkan ke sini.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {archivedCases.map((caseItem) => (
            <CaseCard key={caseItem.id} caseData={caseItem} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
