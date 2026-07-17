"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileText, Loader2, User, Building2, Info } from "lucide-react";
import type { CaseStatus } from "@/types";
import { CASE_STATUS_COLUMNS } from "@/types";
import { useAuth } from "@/contexts/auth-context";
import { useCases } from "@/contexts/cases-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { mockInvestigators } from "@/lib/case-store";
import { getClients, type MockClient } from "@/lib/client-store";
import { createCaseSchema, type CreateCaseInput } from "@/lib/validations/case";
import {
  AttachmentPicker,
  createPendingAttachment,
  pendingToCommentAttachment,
  revokePendingAttachment,
  type PendingAttachment,
} from "@/components/cases/attachment-picker";
import { validateFile } from "@/lib/note-utils";
import { REGIONS_BY_PROVINCE } from "@/lib/indonesia-regions";

export function CreateCaseForm() {
  const router = useRouter();
  const { user } = useAuth();
  const { addCase } = useCases();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [clients, setClients] = useState<MockClient[]>([]);

  useEffect(() => {
    setClients(getClients());
  }, []);

  const defaultClientId =
    user?.role === "CLIENT"
      ? (user.clientId ?? "client-001")
      : clients[0]?.id ?? "";

  const [form, setForm] = useState<CreateCaseInput>({
    policyNumber: "",
    insuredName: "",
    description: "",
    clientId: defaultClientId,
    assigneeId: "",
    status: "NEW",
    city: "",
    scheduleInvestigator: "",
    documents: [],
    
    // Custom Claim Form Fields
    claimType: "Critical Illness",
    policyHolder: "",
    applicationDate: "",
    activeDate: "",
    basicCoverage: "",
    wop: "",
    flexiCi: "",
    addb: "",
    premium: "",
    policyAge: "",
    beneficiary: "",
    treatmentDate: "",
    treatmentPlace: "",
    diagnosis: "",
    agentName: "",
    addressKtp: "",
    addressSpaj: "",
    investigationTargets: [
      "Memastikan kebenaran data Identitas Tertanggung dan data Polis",
      "Memastikan kebenaran Pengajuan data klaim Critical Illness",
      "Melakukan penelusuran riwayat medis Tertanggung sebelumnya"
    ],
    documentChecklist: [
      "SPAJ",
      "Formulir pengajuan Klaim Penyakit Kritis",
      "Surat Keterangan asli dari dokter Spesialis",
      "KTP Tertanggung",
      "Foto Copy Surat Kuasa Pelepasan Medis",
      "Surat kuasa pendebatan",
      "Pernyataan Agent",
      "Hasil Laboratorium"
    ],
  });

  // Attachments Handling
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const attachmentsRef = useRef<PendingAttachment[]>([]);
  attachmentsRef.current = attachments;

  useEffect(() => {
    return () => {
      attachmentsRef.current.forEach(revokePendingAttachment);
    };
  }, []);

  const handleAddFiles = useCallback((files: FileList | File[]) => {
    setUploadError(null);

    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      setUploadError(errors.join(". "));
    }

    if (validFiles.length === 0) return;

    const newAttachments = validFiles.map(createPendingAttachment);
    setAttachments((prev) => [...prev, ...newAttachments]);
  }, []);

  const handleRemove = useCallback((id: string) => {
    setAttachments((prev) => {
      const removed = prev.find((a) => a.id === id);
      if (removed) revokePendingAttachment(removed);
      return prev.filter((a) => a.id !== id);
    });
    setUploadError(null);
  }, []);

  const updateField = <K extends keyof CreateCaseInput>(
    key: K,
    value: CreateCaseInput[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const toggleChecklist = (field: "investigationTargets" | "documentChecklist", item: string) => {
    const current = (form[field] as string[]) || [];
    const next = current.includes(item)
      ? current.filter((x) => x !== item)
      : [...current, item];
    updateField(field, next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);
    setUploadError(null);

    try {
      const persistedAttachments = await Promise.all(
        attachments.map(pendingToCommentAttachment)
      );

      const payload: CreateCaseInput = {
        ...form,
        clientId:
          user?.role === "CLIENT" ? (user.clientId ?? "client-001") : form.clientId,
        assigneeId: form.assigneeId || undefined,
        description: form.description || undefined,
        city: form.city || undefined,
        scheduleInvestigator: form.scheduleInvestigator || undefined,
        documents: persistedAttachments,
        
        // Custom Claim Form Fields
        claimType: form.claimType || undefined,
        policyHolder: form.policyHolder || undefined,
        applicationDate: form.applicationDate || undefined,
        activeDate: form.activeDate || undefined,
        basicCoverage: form.basicCoverage || undefined,
        wop: form.wop || undefined,
        flexiCi: form.flexiCi || undefined,
        addb: form.addb || undefined,
        premium: form.premium || undefined,
        policyAge: form.policyAge || undefined,
        beneficiary: form.beneficiary || undefined,
        treatmentDate: form.treatmentDate || undefined,
        treatmentPlace: form.treatmentPlace || undefined,
        diagnosis: form.diagnosis || undefined,
        agentName: form.agentName || undefined,
        addressKtp: form.addressKtp || undefined,
        addressSpaj: form.addressSpaj || undefined,
        investigationTargets: form.investigationTargets || [],
        documentChecklist: form.documentChecklist || [],
      };

      const result = createCaseSchema.safeParse(payload);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          const key = issue.path[0]?.toString();
          if (key) fieldErrors[key] = issue.message;
        });
        setErrors(fieldErrors);
        setIsSubmitting(false);
        return;
      }

      const newCase = addCase(result.data);
      attachments.forEach(revokePendingAttachment);
      router.push(`/dashboard/cases/${newCase.id}`);
    } catch {
      setErrors({ form: "Failed to create case. Please try again." });
      setIsSubmitting(false);
    }
  };

  const canSelectClient = user?.role === "ADMIN" || user?.role === "INVESTIGATOR";
  const canSelectAssignee = user?.role === "ADMIN" || user?.role === "INVESTIGATOR";

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="mx-auto max-w-2xl space-y-6"
    >
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3 border-b border-neutral-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Informasi Kasus</h2>
            <p className="text-sm text-muted-foreground">
              Isi detail klaim di bawah ini
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label="Nomor Polis"
            required
            error={errors.policyNumber}
            className="sm:col-span-2"
          >
            <Input
              value={form.policyNumber}
              onChange={(e) => updateField("policyNumber", e.target.value)}
              placeholder="POL-2024-001234"
            />
          </FormField>

          <FormField
            label="Nama Tertanggung"
            required
            error={errors.insuredName}
            className="sm:col-span-2"
          >
            <Input
              value={form.insuredName}
              onChange={(e) => updateField("insuredName", e.target.value)}
              placeholder="Nama lengkap tertanggung"
            />
          </FormField>

          {canSelectClient ? (
            <FormField
              label="Klien Asuransi"
              required
              error={errors.clientId}
              className="sm:col-span-2"
            >
              <select
                value={form.clientId}
                onChange={(e) => updateField("clientId", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </FormField>
          ) : (
            <FormField label="Klien Asuransi" className="sm:col-span-2">
              <Input
                value={user?.companyName ?? "PT Asuransi Sejahtera"}
                disabled
                className="bg-neutral-50"
              />
            </FormField>
          )}

          {canSelectAssignee && (
            <FormField label="Petugas Investigator" error={errors.assigneeId}>
              <select
                value={form.assigneeId ?? ""}
                onChange={(e) => updateField("assigneeId", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Belum ditugaskan</option>
                {mockInvestigators.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.name}
                  </option>
                ))}
              </select>
            </FormField>
          )}

          <FormField
            label="Kota / Kabupaten"
            required
            error={errors.city}
            className="sm:col-span-2"
          >
            <select
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Pilih Kota / Kabupaten...</option>
              {Object.entries(REGIONS_BY_PROVINCE).map(([province, regions]) => (
                <optgroup key={province} label={province}>
                  {regions.map((reg) => (
                    <option key={`${province}-${reg.name}`} value={`${reg.name}, ${province}`}>
                      {reg.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </FormField>

          <FormField
            label="Jadwal Keberangkatan Investigator"
            error={errors.scheduleInvestigator}
            className="sm:col-span-2"
          >
            <Input
              type="datetime-local"
              value={form.scheduleInvestigator}
              onChange={(e) => updateField("scheduleInvestigator", e.target.value)}
            />
          </FormField>

          <FormField
            label="Deskripsi Umum Kasus"
            error={errors.description}
            className="sm:col-span-2"
          >
            <textarea
              value={form.description ?? ""}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Deskripsikan klaim secara garis besar..."
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </FormField>
        </div>
      </div>

      {/* SECTION I: Latar Belakang Data Polis */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3 border-b border-neutral-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-primary">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">I. Latar Belakang Data Polis</h2>
            <p className="text-sm text-muted-foreground">Detail kontrak dan pemegang polis asuransi</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Jenis Klaim">
            <Input
              value={form.claimType ?? ""}
              onChange={(e) => updateField("claimType", e.target.value)}
              placeholder="e.g. Critical Illness"
            />
          </FormField>

          <FormField label="Pemegang Polis">
            <Input
              value={form.policyHolder ?? ""}
              onChange={(e) => updateField("policyHolder", e.target.value)}
              placeholder="e.g. Kiki Meivira"
            />
          </FormField>

          <FormField label="Tanggal Aplikasi Polis">
            <Input
              type="text"
              value={form.applicationDate ?? ""}
              onChange={(e) => updateField("applicationDate", e.target.value)}
              placeholder="e.g. 13 -July 2024"
            />
          </FormField>

          <FormField label="Tanggal Aktif Polis">
            <Input
              type="text"
              value={form.activeDate ?? ""}
              onChange={(e) => updateField("activeDate", e.target.value)}
              placeholder="e.g. 15 -July 2024"
            />
          </FormField>

          <FormField label="Beneficiary (Penerima Manfaat)">
            <Input
              value={form.beneficiary ?? ""}
              onChange={(e) => updateField("beneficiary", e.target.value)}
              placeholder="e.g. RAY TOMMY - Adik"
            />
          </FormField>

          <FormField label="Usia Polis">
            <Input
              value={form.policyAge ?? ""}
              onChange={(e) => updateField("policyAge", e.target.value)}
              placeholder="e.g. ± 7 Bulan 1 hari"
            />
          </FormField>

          <FormField label="Nama Agen">
            <Input
              value={form.agentName ?? ""}
              onChange={(e) => updateField("agentName", e.target.value)}
              placeholder="e.g. DESTY"
            />
          </FormField>
        </div>
      </div>

      {/* SECTION II: Rincian Pertanggungan */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3 border-b border-neutral-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-primary">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">II. Nilai Pertanggungan & Premi</h2>
            <p className="text-sm text-muted-foreground">Detail nilai tanggungan manfaat asuransi</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Pertanggungan Dasar (Rp)" tooltip="Jumlah uang pertanggungan utama sesuai polis">
            <Input
              value={form.basicCoverage ?? ""}
              onChange={(e) => updateField("basicCoverage", e.target.value)}
              placeholder="e.g. Rp 2.000.000.000.-"
            />
          </FormField>

          <FormField label="WOP Benefit" tooltip="Waiver of Premium: Pembebasan premi jika tertanggung mengalami risiko tertentu">
            <Input
              value={form.wop ?? ""}
              onChange={(e) => updateField("wop", e.target.value)}
              placeholder="e.g. Rp 34.300.000.-"
            />
          </FormField>

          <FormField label="Flexi CI" tooltip="Flexi Critical Illness: Manfaat tambahan perlindungan penyakit kritis">
            <Input
              value={form.flexiCi ?? ""}
              onChange={(e) => updateField("flexiCi", e.target.value)}
              placeholder="Nominal Flexi CI benefit"
            />
          </FormField>

          <FormField label="ADDB Benefit" tooltip="Accidental Death & Dismemberment Benefit: Santunan meninggal atau cacat akibat kecelakaan">
            <Input
              value={form.addb ?? ""}
              onChange={(e) => updateField("addb", e.target.value)}
              placeholder="Nominal ADDB benefit"
            />
          </FormField>

          <FormField label="Premi Bulanan/Tahunan (Rp)">
            <Input
              value={form.premium ?? ""}
              onChange={(e) => updateField("premium", e.target.value)}
              placeholder="e.g. Rp 34.300.000.-"
            />
          </FormField>
        </div>
      </div>

      {/* SECTION III: Data Medis & Perawatan */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3 border-b border-neutral-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-primary">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">III. Riwayat Medis & Perawatan</h2>
            <p className="text-sm text-muted-foreground">Detail tempat berobat dan diagnosa awal</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Tanggal Perawatan">
            <Input
              value={form.treatmentDate ?? ""}
              onChange={(e) => updateField("treatmentDate", e.target.value)}
              placeholder="e.g. 09 -02 - 2026"
            />
          </FormField>

          <FormField label="Tempat & Dokter Perawatan">
            <Input
              value={form.treatmentPlace ?? ""}
              onChange={(e) => updateField("treatmentPlace", e.target.value)}
              placeholder="e.g. Hospital Picasso - Dr Yi Cheng Har"
            />
          </FormField>

          <FormField label="Diagnosa Penyakit" className="sm:col-span-2">
            <textarea
              value={form.diagnosis ?? ""}
              onChange={(e) => updateField("diagnosis", e.target.value)}
              placeholder="e.g. Benjolan payudara 1week, Kanker Payudara kiri stg I"
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </FormField>
        </div>
      </div>

      {/* SECTION IV: Alamat Tempat Tinggal */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3 border-b border-neutral-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-primary">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">IV. Informasi Alamat Tertanggung</h2>
            <p className="text-sm text-muted-foreground">Alamat resmi berdasarkan dokumen identitas & berkas pengajuan</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Alamat KTP" className="sm:col-span-2">
            <textarea
              value={form.addressKtp ?? ""}
              onChange={(e) => updateField("addressKtp", e.target.value)}
              placeholder="Masukkan alamat lengkap sesuai KTP..."
              rows={2}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </FormField>

          <FormField label="Alamat SPAJ / Tempat Usaha" className="sm:col-span-2">
            <textarea
              value={form.addressSpaj ?? ""}
              onChange={(e) => updateField("addressSpaj", e.target.value)}
              placeholder="Masukkan alamat tempat tinggal lain / tempat usaha sesuai SPAJ..."
              rows={2}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </FormField>
        </div>
      </div>

      {/* SECTION V: Target Investigasi & Checklist Dokumen */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3 border-b border-neutral-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-primary">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">V. Target Investigasi & Lampiran Berkas</h2>
            <p className="text-sm text-muted-foreground">Cakupan kerja investigasi lapangan dan berkas pendukung</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <Label className="mb-3 block text-sm font-semibold text-neutral-800">Checklist Dokumen Pendukung</Label>
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                "SPAJ",
                "Formulir pengajuan Klaim Penyakit Kritis",
                "Surat Keterangan asli dari dokter Spesialis",
                "KTP Tertanggung",
                "Foto Copy Surat Kuasa Pelepasan Medis",
                "Surat kuasa pendebatan",
                "Pernyataan Agent",
                "Hasil Laboratorium"
              ].map((doc) => {
                const checked = (form.documentChecklist as string[])?.includes(doc);
                return (
                  <label key={doc} className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleChecklist("documentChecklist", doc)}
                      className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
                    />
                    <span>{doc}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="border-t border-neutral-100 pt-4">
            <Label className="mb-3 block text-sm font-semibold text-neutral-800">Target Utama Investigasi</Label>
            <div className="space-y-2">
              {[
                "Memastikan kebenaran data Identitas Tertanggung dan data Polis",
                "Memastikan kebenaran Pengajuan data klaim Critical Illness",
                "Melakukan penelusuran riwayat medis Tertanggung sebelumnya"
              ].map((target) => {
                const checked = (form.investigationTargets as string[])?.includes(target);
                return (
                  <label key={target} className="flex items-start gap-2 text-sm text-neutral-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleChecklist("investigationTargets", target)}
                      className="mt-1 h-4 w-4 shrink-0 rounded border-neutral-300 text-primary focus:ring-primary"
                    />
                    <span>{target}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="border-t border-neutral-100 pt-4">
            <Label className="mb-2 block text-sm font-semibold text-neutral-800">
              Upload File Hasil Foto & Dokumen Digital
            </Label>
            <AttachmentPicker
              attachments={attachments}
              onAdd={handleAddFiles}
              onRemove={handleRemove}
              error={uploadError}
            />
          </div>
        </div>
      </div>

      {errors.form && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-primary">
          {errors.form}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard")}
          disabled={isSubmitting}
        >
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <User className="mr-2 h-4 w-4" />
          )}
          Buat Kasus
        </Button>
      </div>
    </motion.form>
  );
}

function FormField({
  label,
  required,
  error,
  className,
  tooltip,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  tooltip?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center gap-1.5">
        <Label className="block text-sm font-medium">
          {label}
          {required && <span className="ml-0.5 text-primary">*</span>}
        </Label>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-primary transition-colors cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-[250px] text-center text-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {children}
      {error && <p className="mt-1 text-xs text-primary">{error}</p>}
    </div>
  );
}
