"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, ArrowLeft, Shield, Search } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { BrandLogo } from "@/components/brand/brand-logo";
import { PoweredByOperator } from "@/components/brand/powered-by-operator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<"role" | "login">("role");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login(email, password);
    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    }
  };

  const selectRole = (role: string, demoEmail: string) => {
    setSelectedRole(role);
    setEmail(demoEmail);
    setPassword("password123");
    setError("");
    setStep("login");
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-black p-12 lg:flex">
        <div>
          <BrandLogo tenant="default" inverted textClassName="text-white" />
          <p className="mt-3 text-sm text-white/55">
            A product of PT. Global Investigasi
          </p>
        </div>
        <div>
          <h2 className="text-4xl font-bold leading-tight text-white">
            Manajemen Klaim
            <br />
            <span className="text-primary">Asuransi</span>
          </h2>
          <p className="mt-4 max-w-md text-white/60">
            Sederhanakan alur investigasi Anda dengan platform manajemen kasus kami yang komprehensif.
          </p>
        </div>
        <div className="space-y-3">
          <PoweredByOperator inverted />
          <p className="text-sm text-white/40">
            &copy; 2026 InvestiHub · PT. Global Investigasi
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-white p-6">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 space-y-3 lg:hidden">
            <BrandLogo tenant="default" />
            <PoweredByOperator />
          </div>

          {step === "role" ? (
            <>
              <h1 className="text-2xl font-bold text-foreground">Pilih Peran Anda</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Silakan pilih bagaimana Anda ingin masuk
              </p>

              {searchParams.get("callbackUrl") && (
                <p className="mt-3 rounded-md bg-accent px-3 py-2 text-xs text-primary">
                  Silakan masuk untuk melanjutkan
                </p>
              )}

              <div className="mt-8 space-y-4">
                <button
                  type="button"
                  onClick={() => selectRole("Administrator", "admin@investihub.com")}
                  className="flex w-full items-center gap-4 rounded-xl border border-neutral-200 p-4 text-left transition-all hover:border-primary hover:bg-neutral-50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Administrator</h3>
                    <p className="text-sm text-muted-foreground">Masuk sebagai admin sistem</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => selectRole("Investigator", "investigator@investihub.com")}
                  className="flex w-full items-center gap-4 rounded-xl border border-[#7c3aed]/20 bg-[#7c3aed]/5 p-4 text-left transition-all hover:bg-[#7c3aed]/10"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm text-[#7c3aed]">
                    <Search className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#7c3aed]">Investigator</h3>
                    <p className="text-sm text-[#7c3aed]/70">Masuk untuk mengelola kasus</p>
                  </div>
                </button>

                <Link
                  href="/login/allianz"
                  className="flex w-full items-center gap-4 rounded-xl border border-[#003781]/20 bg-[#003781]/5 p-4 text-left transition-all hover:bg-[#003781]/10"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm">
                    <BrandLogo tenant="allianz" variant="mark" markClassName="h-6 w-auto max-w-[40px]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#003781]">Klien Allianz</h3>
                    <p className="text-sm text-[#003781]/70">Portal khusus klien Allianz</p>
                  </div>
                </Link>

                <Link
                  href="/login/prudential"
                  className="flex w-full items-center gap-4 rounded-xl border border-[#E81828]/20 bg-[#E81828]/5 p-4 text-left transition-all hover:bg-[#E81828]/10"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm">
                    <BrandLogo tenant="prudential" variant="mark" markClassName="h-6 w-auto max-w-[40px]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#E81828]">Klien Prudential</h3>
                    <p className="text-sm text-[#E81828]/70">Portal khusus klien Prudential</p>
                  </div>
                </Link>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep("role")}
                className="mb-6 flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </button>

              <h1 className="text-2xl font-bold text-foreground">Masuk sebagai {selectedRole}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Gunakan kredensial demo untuk melanjutkan
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan kata sandi Anda"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="rounded-md bg-accent px-3 py-2 text-sm text-primary">
                    {error}
                  </p>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Masuk"
                  )}
                </Button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
