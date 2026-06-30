"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CreateCaseForm } from "@/components/cases/create-case-form";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";

export default function NewCasePage() {
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
