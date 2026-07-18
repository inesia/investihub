"use client";

import { useState, useMemo } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { CaseCard } from "@/components/kanban/case-card";
import { useCases } from "@/contexts/cases-context";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Calendar, FileSpreadsheet } from "lucide-react";

export default function ArchivePage() {
  const { cases, isLoading } = useCases();
  const { user } = useAuth();

  // Filter States
  const [timeRange, setTimeRange] = useState<"ALL" | "WEEK" | "MONTH" | "YEAR" | "CUSTOM">("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const archivedCases = useMemo(() => {
    let filtered = cases.filter((c) => c.status === "ARCHIVED");
    
    // If the user is a client, only show their archived cases
    if (user?.role === "CLIENT") {
      const clientId = user.clientId ?? "client-001";
      filtered = filtered.filter((c) => c.clientId === clientId);
    }

    // If the user is an investigator, only show their archived cases
    if (user?.role === "INVESTIGATOR") {
      const investigatorId = user.id.replace("user-", "");
      filtered = filtered.filter((c) => c.assigneeId === investigatorId);
    }

    // Time Range Filtering based on createdAt
    const now = new Date();
    if (timeRange === "WEEK") {
      const limit = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter((c) => c.createdAt >= limit);
    } else if (timeRange === "MONTH") {
      const limit = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter((c) => c.createdAt >= limit);
    } else if (timeRange === "YEAR") {
      const limit = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter((c) => c.createdAt >= limit);
    } else if (timeRange === "CUSTOM") {
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        filtered = filtered.filter((c) => c.createdAt >= start);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filtered = filtered.filter((c) => c.createdAt <= end);
      }
    }
    
    return filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }, [cases, user?.role, user?.clientId, user?.id, timeRange, startDate, endDate]);

  // Export to Excel handler
  const handleExportToExcel = () => {
    if (archivedCases.length === 0) return;

    // Prepare headers
    const headers = [
      "ID Kasus",
      "Nomor Polis",
      "Nama Tertanggung",
      "Perusahaan Klien",
      "Investigator",
      "Kota",
      "Tipe Klaim",
      "Diagnosis",
      "Tanggal Dibuat",
      "Status"
    ];
    
    // Map rows
    const rows = archivedCases.map((c) => [
      c.id,
      c.policyNumber,
      c.insuredName,
      c.client.name,
      c.assignee?.name || "-",
      c.city || "-",
      c.claimType || "-",
      c.diagnosis || "-",
      new Date(c.createdAt).toLocaleDateString("id-ID"),
      c.status
    ]);

    // Create CSV content (Excel compatible with UTF-8 BOM)
    const csvContent = "\ufeff" + [
      headers.join(","),
      ...rows.map(row => row.map(val => `"${val.replace(/"/g, '""')}"`).join(","))
    ].join("\n");
    
    // Trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Arsip_Investigasi_Kasus_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppShell title="Arsip Kasus">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted-foreground">
          Daftar kasus yang telah selesai dan diarsipkan.
        </p>

        {/* Export Button */}
        {archivedCases.length > 0 && (
          <Button size="sm" onClick={handleExportToExcel} className="self-start md:self-auto">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Ekspor ke Excel
          </Button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="mb-6 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-2 text-sm font-semibold text-neutral-800 shrink-0">
            <Calendar className="h-4 w-4 text-primary" />
            <span>Filter Tanggal:</span>
          </div>

          <div className="flex flex-wrap gap-2 items-center w-full">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as "ALL" | "WEEK" | "MONTH" | "YEAR" | "CUSTOM")}
              className="flex h-9 w-full md:w-[200px] rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="ALL">Semua Waktu</option>
              <option value="WEEK">Minggu Ini (7 Hari Terakhir)</option>
              <option value="MONTH">Bulan Ini (30 Hari Terakhir)</option>
              <option value="YEAR">Tahun Ini (365 Hari Terakhir)</option>
              <option value="CUSTOM">Rentang Tanggal Kustom</option>
            </select>

            {timeRange === "CUSTOM" && (
              <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0 animate-in fade-in slide-in-from-left-2 duration-200">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="flex h-9 rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  title="Tanggal Mulai"
                />
                <span className="text-xs text-muted-foreground">s/d</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="flex h-9 rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  title="Tanggal Selesai"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Memuat arsip...</p>
      ) : archivedCases.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 py-16 text-center">
          <p className="font-medium">Tidak ada kasus yang sesuai filter</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Coba ubah filter waktu atau periksa daftar kasus Anda.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {archivedCases.map((caseItem) => (
            <CaseCard key={caseItem.id} caseData={caseItem} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
