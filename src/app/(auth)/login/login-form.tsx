"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { BrandLogo } from "@/components/brand/brand-logo";
import { PoweredByOperator } from "@/components/brand/powered-by-operator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
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
    if (result.error) setError(result.error);
    setIsLoading(false);
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
    setError("");
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
            Insurance Claim
            <br />
            <span className="text-primary">Management</span>
          </h2>
          <p className="mt-4 max-w-md text-white/60">
            Streamline your investigation workflow with our comprehensive case management platform.
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 space-y-3 lg:hidden">
            <BrandLogo tenant="default" />
            <PoweredByOperator />
          </div>

          <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to access your dashboard
          </p>

          {searchParams.get("callbackUrl") && (
            <p className="mt-3 rounded-md bg-accent px-3 py-2 text-xs text-primary">
              Please sign in to continue
            </p>
          )}

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
                  placeholder="Enter your password"
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
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 space-y-3 rounded-lg border border-dashed border-neutral-200 p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Demo accounts (password: password123):
            </p>
            <div className="grid gap-2">
              <button
                type="button"
                onClick={() => fillDemo("investigator@investihub.com")}
                className="rounded-md border border-neutral-200 px-3 py-2 text-left text-xs transition-colors hover:bg-neutral-50"
              >
                <span className="font-medium text-foreground">Investigator</span>
                <span className="mt-0.5 block text-muted-foreground">
                  investigator@investihub.com
                </span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo("client@investihub.com")}
                className="rounded-md border border-neutral-200 px-3 py-2 text-left text-xs transition-colors hover:bg-neutral-50"
              >
                <span className="font-medium text-foreground">Client — Sejahtera</span>
                <span className="mt-0.5 block text-muted-foreground">
                  client@investihub.com
                </span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo("admin@investihub.com")}
                className="rounded-md border border-neutral-200 px-3 py-2 text-left text-xs transition-colors hover:bg-neutral-50"
              >
                <span className="font-medium text-foreground">Admin</span>
                <span className="mt-0.5 block text-muted-foreground">
                  admin@investihub.com
                </span>
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="rounded-lg border border-[#003781]/20 bg-[#003781]/5 p-4">
              <p className="text-xs font-medium text-[#003781]">
                Allianz Indonesia client?
              </p>
              <Link
                href="/login/allianz"
                className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#003781] hover:underline"
              >
                <BrandLogo
                  tenant="allianz"
                  variant="mark"
                  markClassName="h-5 w-auto max-w-[64px]"
                />
                Open Allianz Client Portal →
              </Link>
            </div>

            <div className="rounded-lg border border-[#687078]/25 bg-[#687078]/5 p-4">
              <p className="text-xs font-medium text-[#687078]">
                Prudential Indonesia client?
              </p>
              <Link
                href="/login/prudential"
                className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#E81828] hover:underline"
              >
                <BrandLogo
                  tenant="prudential"
                  variant="mark"
                  markClassName="h-5 w-auto max-w-[72px]"
                />
                Open Prudential Client Portal →
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Register
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
