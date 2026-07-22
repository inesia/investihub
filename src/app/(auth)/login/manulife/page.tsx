import { Suspense } from "react";
import type { Metadata } from "next";
import ManulifeLoginForm from "./manulife-login-form";

export const metadata: Metadata = {
  title: "Manulife Client Portal — InvestiHub",
  description: "Exclusive claim investigation portal for PT Asuransi Jiwa Manulife Indonesia",
};

export default function ManulifeLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white text-[#00A758]">
          Loading Manulife Portal...
        </div>
      }
    >
      <ManulifeLoginForm />
    </Suspense>
  );
}
