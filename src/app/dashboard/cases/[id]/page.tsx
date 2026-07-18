"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CaseDetailView } from "@/components/kanban/case-detail-view";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { useCases } from "@/contexts/cases-context";
import { useAuth } from "@/contexts/auth-context";

interface CaseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CaseDetailPage({ params }: CaseDetailPageProps) {
  const { id } = use(params);
  const { getCaseById, isLoading } = useCases();
  const { user } = useAuth();
  const caseData = getCaseById(id);

  if (isLoading) {
    return (
      <AppShell title="Case Detail">
        <p className="text-sm text-muted-foreground">Loading case...</p>
      </AppShell>
    );
  }

  const hasAccess = !caseData || !user ? false : (
    user.role === "ADMIN" ||
    (user.role === "CLIENT" && caseData.clientId === (user.clientId ?? "client-001")) ||
    (user.role === "INVESTIGATOR" && caseData.assigneeId === user.id.replace("user-", ""))
  );

  if (!caseData || !hasAccess) {
    return (
      <AppShell title="Case Detail">
        <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
          <h2 className="text-xl font-bold">Case Not Found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The case you are looking for does not exist or you do not have permission to view it.
          </p>
          <Button asChild className="mt-6">
            <Link href="/dashboard">Back to Board</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Case Detail">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="-ml-2 gap-2">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Back to Board
          </Link>
        </Button>
        <p className="mt-2 text-sm text-muted-foreground">
          {caseData.policyNumber} · {caseData.id}
        </p>
      </div>
      <CaseDetailView caseData={caseData} />
    </AppShell>
  );
}
