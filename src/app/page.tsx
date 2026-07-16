import Link from "next/link";
import { Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6">
      <div className="mx-auto max-w-lg text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-black shadow-lg">
            <Shield className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground">
          InvestiHub
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Insurance Claim Case Management System
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center relative z-50">
          <Link
            href="/login"
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
