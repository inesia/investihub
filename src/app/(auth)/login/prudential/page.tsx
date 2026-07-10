import { Suspense } from "react";
import type { Metadata } from "next";
import PrudentialLoginForm from "./prudential-login-form";

export const metadata: Metadata = {
  title: "Prudential Client Portal — InvestiHub",
  description: "Exclusive claim investigation portal for PT Prudential Life Assurance",
};

export default function PrudentialLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white text-[#E81828]">
          Loading Prudential Portal...
        </div>
      }
    >
      <PrudentialLoginForm />
    </Suspense>
  );
}
