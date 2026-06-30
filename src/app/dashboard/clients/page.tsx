"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockClients } from "@/lib/search";
import { Building2, Mail, Phone } from "lucide-react";

export default function ClientsPage() {
  return (
    <AppShell title="Client Management">
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Manage insurance company clients and their case portfolios
        </p>
      </div>

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
                {client.activeCases} active cases
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
