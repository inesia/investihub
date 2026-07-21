"use client";

import { useState, useEffect, useMemo } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/contexts/auth-context";
import { getClients } from "@/lib/client-store";
import {
  getFinalReports,
  addFinalReport,
  deleteFinalReport,
  type FinalReport,
} from "@/lib/final-report-store";
import {
  FileText,
  Search,
  Upload,
  Trash2,
  Download,
  Plus,
  X,
  FileUp,
  AlertCircle,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FinalReportsPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState<FinalReport[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClientFilter, setSelectedClientFilter] = useState("ALL");

  // Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [formData, setFormData] = useState({
    fileName: "",
    insuredName: "",
    clientId: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    setReports(getFinalReports());
    setClients(getClients());
  }, []);

  // Filtered reports
  const filteredReports = useMemo(() => {
    let list = reports;

    // Client role is restricted to their own clientId
    if (user?.role === "CLIENT") {
      const userClientId = user.clientId ?? "client-002"; // default to Allianz if missing
      list = list.filter((r) => r.clientId === userClientId);
    } else {
      // Admin/Investigator can filter by client
      if (selectedClientFilter !== "ALL") {
        list = list.filter((r) => r.clientId === selectedClientFilter);
      }
    }

    // Search query filter (matches fileName or insuredName)
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.fileName.toLowerCase().includes(q) ||
          r.insuredName.toLowerCase().includes(q)
      );
    }

    return list;
  }, [reports, user, searchQuery, selectedClientFilter]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Auto-fill file name if empty
      if (!formData.fileName) {
        setFormData((prev) => ({ ...prev, fileName: file.name }));
      }
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError("");

    if (!formData.fileName.trim()) {
      setUploadError("Nama file wajib diisi.");
      return;
    }
    if (!formData.insuredName.trim()) {
      setUploadError("Nama tertanggung wajib diisi.");
      return;
    }
    if (!formData.clientId) {
      setUploadError("Pilih klien asuransi.");
      return;
    }

    const selectedClient = clients.find((c) => c.id === formData.clientId);
    const clientName = selectedClient ? selectedClient.name : "Klien Asuransi";

    // Set mock path or file path
    const mockPath = "/laporan-final/ARU -KIKI  MEIVIRA  -  ALLIANZ - MAKASAR - CI.pdf";
    const fileSize = selectedFile 
      ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` 
      : "3.5 MB";

    try {
      addFinalReport(
        {
          fileName: formData.fileName,
          filePath: mockPath,
          insuredName: formData.insuredName,
          clientName: clientName,
          clientId: formData.clientId,
        },
        fileSize
      );

      // Refresh list & reset form
      setReports(getFinalReports());
      setIsUploadOpen(false);
      setFormData({ fileName: "", insuredName: "", clientId: "" });
      setSelectedFile(null);
    } catch (err) {
      setUploadError("Gagal mengunggah laporan final.");
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus laporan final ini?")) {
      deleteFinalReport(id);
      setReports(getFinalReports());
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  const isAdmin = user?.role === "ADMIN";

  return (
    <AppShell>
      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">
              Laporan Final
            </h1>
            <p className="text-sm text-neutral-500">
              {isAdmin 
                ? "Kelola dan unduh dokumen laporan penyelidikan final klien." 
                : "Lihat dan unduh laporan hasil akhir investigasi klaim."}
            </p>
          </div>
          {isAdmin && (
            <Button
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-white hover:bg-violet-700 shadow-sm transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              Upload Laporan
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama file atau tertanggung..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-xl border border-neutral-200 pl-10 pr-4 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>
          {user?.role !== "CLIENT" && (
            <div className="w-full sm:w-64">
              <select
                value={selectedClientFilter}
                onChange={(e) => setSelectedClientFilter(e.target.value)}
                className="h-10 w-full rounded-xl border border-neutral-200 px-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 bg-white"
              >
                <option value="ALL">Semua Perusahaan</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* List of Reports */}
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-neutral-50 text-neutral-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Nama File</th>
                  <th className="px-6 py-4">Klien Asuransi</th>
                  <th className="px-6 py-4">Tertanggung</th>
                  <th className="px-6 py-4">Ukuran</th>
                  <th className="px-6 py-4">Tanggal Diunggah</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="h-10 w-10 text-neutral-300" />
                        <p className="font-medium">Tidak ada laporan final ditemukan</p>
                        <p className="text-xs text-neutral-400">Silakan ubah kata kunci pencarian Anda.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-neutral-900">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-red-50 p-2 text-red-600">
                            <FileText className="h-5 w-5" />
                          </div>
                          <span className="line-clamp-1">{report.fileName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-neutral-600">{report.clientName}</td>
                      <td className="px-6 py-4 text-neutral-600">{report.insuredName}</td>
                      <td className="px-6 py-4 text-neutral-500">{report.size}</td>
                      <td className="px-6 py-4 text-neutral-500">{formatDate(report.uploadedAt)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <a
                            href={report.filePath}
                            download
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                            title="Unduh Laporan"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                          {isAdmin && (
                            <button
                              onClick={() => handleDelete(report.id)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-red-50/50 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                              title="Hapus Laporan"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upload Modal */}
        {isUploadOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-neutral-100 animate-scale-up">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-5">
                <h3 className="text-xl font-bold text-neutral-900">Upload Laporan Final</h3>
                <button
                  onClick={() => setIsUploadOpen(false)}
                  className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {uploadError && (
                <div className="mb-4 flex items-start gap-2.5 rounded-xl bg-red-50 p-3.5 text-sm text-red-700 border border-red-100">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <p>{uploadError}</p>
                </div>
              )}

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                {/* File Dropzone */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-700">Pilih Dokumen PDF *</label>
                  <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50/50 p-6 hover:bg-neutral-50 transition-colors">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                    <FileUp className="h-8 w-8 text-neutral-400 mb-2" />
                    <p className="text-sm font-medium text-neutral-600">
                      {selectedFile ? selectedFile.name : "Klik atau seret file PDF ke sini"}
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : "Hanya mendukung format PDF hingga 15MB"}
                    </p>
                  </div>
                </div>

                {/* File Name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Nama Laporan / File *</label>
                  <input
                    type="text"
                    value={formData.fileName}
                    onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
                    placeholder="Contoh: ARU - KIKI MEIVIRA - ALLIANZ - MAKASAR - CI.pdf"
                    className="flex h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
                    required
                  />
                </div>

                {/* Insured Name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Nama Tertanggung *</label>
                  <input
                    type="text"
                    value={formData.insuredName}
                    onChange={(e) => setFormData({ ...formData, insuredName: e.target.value })}
                    placeholder="Masukkan nama tertanggung / pemegang polis"
                    className="flex h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
                    required
                  />
                </div>

                {/* Client Company */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Klien Asuransi *</label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                    className="flex h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
                    required
                  >
                    <option value="">Pilih Klien</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsUploadOpen(false)}
                    className="rounded-xl border-neutral-200 px-4 py-2 hover:bg-neutral-50 text-neutral-700 text-sm font-medium"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-xl bg-violet-600 px-4 py-2 text-white hover:bg-violet-700 text-sm font-medium"
                  >
                    Upload & Simpan
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
