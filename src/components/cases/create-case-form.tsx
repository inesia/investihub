"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileText, Loader2, User } from "lucide-react";
import type { CaseStatus } from "@/types";
import { CASE_STATUS_COLUMNS } from "@/types";
import { useAuth } from "@/contexts/auth-context";
import { useCases } from "@/contexts/cases-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockInvestigators } from "@/lib/case-store";
import { mockClients } from "@/lib/search";
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

  const defaultClientId =
    user?.role === "CLIENT"
      ? (user.clientId ?? "client-001")
      : mockClients[0]?.id ?? "";

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
                {mockClients.map((client) => (
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
            label="Deskripsi"
            error={errors.description}
            className="sm:col-span-2"
          >
            <textarea
              value={form.description ?? ""}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Deskripsikan klaim (detail kejadian, jenis kerusakan, dll.)"
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </FormField>

          <div className="sm:col-span-2 border-t border-neutral-100 pt-4 mt-2">
            <Label className="mb-2 block text-sm font-semibold text-neutral-800">
              Upload Dokumen (Lampiran berkas klaim / foto)
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
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block text-sm font-medium">
        {label}
        {required && <span className="ml-0.5 text-primary">*</span>}
      </Label>
      {children}
      {error && <p className="mt-1 text-xs text-primary">{error}</p>}
    </div>
  );
}
