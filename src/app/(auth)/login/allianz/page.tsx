import { Suspense } from "react";
import type { Metadata } from "next";
import AllianzLoginForm from "./allianz-login-form";

export const metadata: Metadata = {
  title: "Allianz Client Portal — InvestiHub",
  description: "Exclusive claim investigation portal for PT Asuransi Allianz Life Indonesia",
};

export default function AllianzLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white text-[#003781]">
          Loading Allianz Portal...
        </div>
      }
    >
      <AllianzLoginForm />
    </Suspense>
  );
}
