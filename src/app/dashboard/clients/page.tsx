"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockClients } from "@/lib/search";
import { useAuth } from "@/contexts/auth-context";
import { Building2, Mail, Phone, Plus, User, Shield } from "lucide-react";

const mockUsers = [
  ...Array.from({ length: 12 }).map((_, i) => ({
    id: `inv-${i + 1}`,
    name: `Investigator ${i + 1}`,
    email: `investigator${i + 1}@investihub.com`,
    role: "INVESTIGATOR",
    company: "PT. Global Investigasi",
  })),
  {
    id: "client-allianz",
    name: "Admin Allianz",
    email: "admin@allianz.co.id",
    role: "CLIENT",
    company: "PT Allianz Indonesia",
  },
  {
    id: "client-pru",
    name: "Admin Prudential",
    email: "admin@prudential.co.id",
    role: "CLIENT",
    company: "PT Prudential Life Assurance",
  },
];

export default function ClientsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [activeTab, setActiveTab] = useState<"clients" | "users">("clients");

  return (
    <AppShell title="Manajemen Klien & Pengguna">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Kelola klien perusahaan asuransi dan daftar pengguna sistem
        </p>
        
        {isAdmin && (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => alert("Form Tambah Perusahaan Asuransi")}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Perusahaan
            </Button>
            <Button size="sm" variant="outline" onClick={() => alert("Form Tambah Pengguna")}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Pengguna
            </Button>
          </div>
        )}
      </div>

      <div className="mb-6 flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("clients")}
          className={`pb-2 px-1 text-sm font-medium transition-colors ${
            activeTab === "clients"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Perusahaan Asuransi
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-2 px-1 ml-4 text-sm font-medium transition-colors ${
            activeTab === "users"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Daftar Pengguna
        </button>
      </div>

      {activeTab === "clients" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockClients.map((client) => (
            <Card key={client.id} className="border-neutral-200">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{client.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{client.phone}</span>
                </div>
                <p className="pt-2 font-medium text-foreground">
                  {client.activeCases} kasus aktif
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "users" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mockUsers.map((u) => (
            <Card key={u.id} className="border-neutral-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      u.role === "INVESTIGATOR" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {u.role === "INVESTIGATOR" ? <Shield className="h-5 w-5" /> : <User className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.role}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{u.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{u.company}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}
