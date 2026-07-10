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

export default function AllianzLoginForm() {
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

    const result = await login(email, password, { requireTenant: "allianz" });
    if (result.error) setError(result.error);
    setIsLoading(false);
  };

  const fillDemo = () => {
    setEmail("client@allianz.co.id");
    setPassword("password123");
    setError("");
  };

  return (
    <div className="flex min-h-screen">
      {/* Allianz brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-primary p-12 lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 60% at 20% 20%, #0050a8 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 90% 80%, #002456 0%, transparent 50%)",
          }}
        />
        <div className="relative z-10 space-y-3">
          <BrandLogo tenant="allianz" inverted />
          <PoweredByOperator inverted />
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold leading-tight text-white">
            Claim Investigation
            <br />
            <span className="text-white/80">Portal</span>
          </h2>
          <p className="mt-4 max-w-md text-white/65">
            Secure access for PT Allianz Indonesia — track claim progress,
            review reporting timelines, and collaborate with investigators.
          </p>
        </div>
        <p className="relative z-10 text-sm text-white/45">
          &copy; 2026 Allianz · Operated by PT. Global Investigasi
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center bg-background p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 space-y-3">
            <BrandLogo tenant="allianz" className="mb-1" />
            <div className="lg:hidden">
              <PoweredByOperator />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-foreground">
            Allianz Client Sign In
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Exclusive portal for PT Allianz Indonesia clients
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
                placeholder="you@allianz.co.id"
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
                "Sign In to Allianz Portal"
              )}
            </Button>
          </form>

          <div className="mt-6 rounded-lg border border-dashed border-primary/25 bg-accent/50 p-4">
            <p className="mb-2 text-xs font-medium text-primary">
              Demo Allianz client (password: password123)
            </p>
            <button
              type="button"
              onClick={fillDemo}
              className="w-full rounded-md border border-primary/20 bg-background px-3 py-2.5 text-left text-xs transition-colors hover:bg-accent"
            >
              <span className="font-medium text-foreground">Siti Rahayu</span>
              <span className="mt-0.5 block text-muted-foreground">
                client@allianz.co.id
              </span>
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Not an Allianz client?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline"
            >
              InvestiHub Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
