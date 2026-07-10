"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CreateCaseForm } from "@/components/cases/create-case-form";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { canCreateCases } from "@/types";

export default function NewCasePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const blocked = !canCreateCases(user?.role);

  useEffect(() => {
    if (!isLoading && blocked) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router, blocked]);

  if (isLoading || blocked) {
    return (
      <AppShell title="Create Case">
        <p className="text-sm text-muted-foreground">Redirecting...</p>
      </AppShell>
    );
  }

  return (
    <AppShell title="Create Case">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="-ml-2 gap-2">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Back to Board
          </Link>
        </Button>
        <p className="mt-2 text-sm text-muted-foreground">
          Register a new insurance claim case
        </p>
      </div>
      <CreateCaseForm />
    </AppShell>
  );
}
