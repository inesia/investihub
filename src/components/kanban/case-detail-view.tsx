"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  User,
  MapPin,
  CalendarDays,
  Paperclip,
  ChevronDown,
} from "lucide-react";
import type { CaseWithRelations, CommentWithAuthor } from "@/types";
import { STATUS_LABELS, canPostComments } from "@/types";
import { StatusBadge } from "@/components/kanban/status-badge";
import { CommentItem, AttachmentDisplay } from "@/components/cases/comment-item";
import { NoteForm, type NoteFormData } from "@/components/cases/note-form";
import { useAuth } from "@/contexts/auth-context";
import { formatDate, formatDateTime, cn } from "@/lib/utils";
import { ConfirmModal } from "@/components/ui/confirm-modal";

interface CaseDetailViewProps {
  caseData: CaseWithRelations;
}

const mockTimeline = [
  {
    id: "tl-1",
    title: "Case Created",
    description: "New claim submitted to the system",
    timestamp: new Date("2024-06-01T09:00:00"),
    author: "System",
  },
  {
    id: "tl-2",
    title: "Documents Uploaded",
    description: "Client uploaded supporting documents and photos",
    timestamp: new Date("2024-06-02T14:30:00"),
    author: "Rina Kusuma",
  },
  {
    id: "tl-3",
    title: "Assigned to Investigator",
    description: "Case assigned to Ahmad Rizki for verification",
    timestamp: new Date("2024-06-03T08:15:00"),
    author: "Admin",
  },
  {
    id: "tl-4",
    title: "Field Visit Scheduled",
    description: "On-site inspection scheduled for next week",
    timestamp: new Date("2024-06-05T11:00:00"),
    author: "Ahmad Rizki",
  },
];

const initialComments: CommentWithAuthor[] = [];

export function CaseDetailView({ caseData }: CaseDetailViewProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentWithAuthor[]>(initialComments);
  const [showDetails, setShowDetails] = useState(false);

  const canComment = canPostComments(user?.role);

  const handleSubmitNote = (data: NoteFormData) => {
    if (!user) return;

    const comment: CommentWithAuthor = {
      id: `c-${Date.now()}`,
      caseId: caseData.id,
      content: data.content,
      contentHtml: data.contentHtml,
      attachments: data.attachments.length > 0 ? data.attachments : undefined,
      createdAt: new Date(),
      authorId: user.id,
      author: { id: user.id, name: user.name, role: user.role },
    };

    setComments((prev) => [...prev, comment]);
  };

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  const handleEditComment = (id: string, content: string, contentHtml?: string, attachments?: CommentAttachment[]) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, content, contentHtml, attachments } : c
      )
    );
  };

  const triggerDeleteComment = (id: string) => {
    setCommentToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const executeDeleteComment = () => {
    if (commentToDelete) {
      setComments((prev) => prev.filter((c) => c.id !== commentToDelete));
      setCommentToDelete(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-4xl space-y-6"
    >
      {/* Header Info */}
      <div className="border-b border-neutral-200 pb-5">
        <div className="mb-3 flex items-center justify-between">
          <StatusBadge status={caseData.status} />
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1.5 rounded-lg border border-primary bg-primary px-2.5 py-1 text-[11px] font-bold text-white shadow-sm hover:bg-primary/95 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <span>{showDetails ? "Sembunyikan Informasi Kasus" : "Lihat Detail Informasi Kasus"}</span>
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200 text-white", showDetails && "rotate-180")} />
          </button>
        </div>
        <h2 className="text-xl font-bold text-foreground md:text-2xl">
          {caseData.insuredName}
        </h2>
        <p className="mt-1 font-mono text-sm text-muted-foreground">
          {caseData.policyNumber}
        </p>
      </div>

      {/* COLLAPSIBLE CASE DETAILS & TIMELINE */}
      {showDetails && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-6 rounded-xl bg-neutral-50/70 p-5 border border-neutral-200 animate-in slide-in-from-top duration-200"
        >
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Detail Kasus &amp; Polis
            </h3>
            <div className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-3">
              <DetailRow icon={User} label="Nama Tertanggung" value={caseData.insuredName} />
              <DetailRow
                icon={Building2}
                label="Perusahaan Asuransi"
                value={caseData.client.companyName ?? caseData.client.name}
              />
              <DetailRow
                icon={User}
                label="Investigator"
                value={caseData.assignee?.name ?? "Belum ditugaskan"}
              />
              <DetailRow
                icon={MapPin}
                label="Kota / Kabupaten"
                value={caseData.city ?? "Tidak ditentukan"}
              />
              <DetailRow
                icon={CalendarDays}
                label="Jadwal Keberangkatan"
                value={
                  caseData.scheduleInvestigator
                    ? formatDateTime(caseData.scheduleInvestigator)
                    : "Belum dijadwalkan"
                }
              />
              <DetailRow
                icon={FileText}
                label="Status"
                value={STATUS_LABELS[caseData.status]}
              />
              <DetailRow
                icon={Calendar}
                label="Dibuat"
                value={formatDate(caseData.createdAt)}
              />
              <DetailRow
                icon={Clock}
                label="Terakhir Diperbarui"
                value={formatDate(caseData.updatedAt)}
              />
              {caseData.description && (
                <div className="col-span-full border-t border-neutral-200 pt-4">
                  <p className="mb-1 text-xs text-muted-foreground">Deskripsi Umum</p>
                  <p className="text-sm leading-relaxed">{caseData.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* SECTION I: Latar Belakang Data Polis */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              I. Latar Belakang Data Polis
            </h3>
            <div className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-3">
              <DetailRow icon={FileText} label="Jenis Klaim" value={caseData.claimType ?? "-"} />
              <DetailRow icon={User} label="Pemegang Polis" value={caseData.policyHolder ?? "-"} />
              <DetailRow icon={CalendarDays} label="Tanggal Aplikasi Polis" value={caseData.applicationDate ?? "-"} />
              <DetailRow icon={CalendarDays} label="Tanggal Aktif Polis" value={caseData.activeDate ?? "-"} />
              <DetailRow icon={User} label="Beneficiary (Penerima Manfaat)" value={caseData.beneficiary ?? "-"} />
              <DetailRow icon={Clock} label="Usia Polis" value={caseData.policyAge ?? "-"} />
              <DetailRow icon={User} label="Nama Agen" value={caseData.agentName ?? "-"} />
            </div>
          </div>

          {/* SECTION II: Nilai Pertanggungan & Premi */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              II. Nilai Pertanggungan &amp; Premi
            </h3>
            <div className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-3">
              <DetailRow icon={FileText} label="Pertanggungan Dasar (Rp)" value={caseData.basicCoverage ?? "-"} />
              <DetailRow icon={FileText} label="WOP Benefit" value={caseData.wop ?? "-"} />
              <DetailRow icon={FileText} label="Flexi CI" value={caseData.flexiCi ?? "-"} />
              <DetailRow icon={FileText} label="ADDB Benefit" value={caseData.addb ?? "-"} />
              <DetailRow icon={FileText} label="Premi Bulanan/Tahunan (Rp)" value={caseData.premium ?? "-"} />
            </div>
          </div>

          {/* SECTION III: Riwayat Medis & Perawatan */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              III. Riwayat Medis &amp; Perawatan
            </h3>
            <div className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-5 sm:grid-cols-2">
              <DetailRow icon={CalendarDays} label="Tanggal Perawatan" value={caseData.treatmentDate ?? "-"} />
              <DetailRow icon={MapPin} label="Tempat & Dokter Perawatan" value={caseData.treatmentPlace ?? "-"} />
              {caseData.diagnosis && (
                <div className="col-span-full border-t border-neutral-200 pt-3">
                  <p className="mb-1 text-xs text-muted-foreground">Diagnosa Penyakit</p>
                  <p className="text-sm leading-relaxed">{caseData.diagnosis}</p>
                </div>
              )}
            </div>
          </div>

          {/* SECTION IV: Informasi Alamat Tertanggung */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              IV. Informasi Alamat Tertanggung
            </h3>
            <div className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-5">
              <div>
                <p className="mb-1 text-xs text-muted-foreground">Alamat KTP</p>
                <p className="text-sm leading-relaxed">{caseData.addressKtp ?? "-"}</p>
              </div>
              {caseData.addressSpaj && (
                <div className="border-t border-neutral-200 pt-3">
                  <p className="mb-1 text-xs text-muted-foreground">Alamat SPAJ / Tempat Usaha</p>
                  <p className="text-sm leading-relaxed">{caseData.addressSpaj}</p>
                </div>
              )}
            </div>
          </div>

          {/* SECTION V: Target Investigasi & Checklist Dokumen */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              V. Target Investigasi &amp; Checklist Dokumen
            </h3>
            <div className="grid gap-6 rounded-xl border border-neutral-200 bg-white p-5 sm:grid-cols-2">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Target Utama Investigasi</p>
                {caseData.investigationTargets && caseData.investigationTargets.length > 0 ? (
                  <ul className="list-disc pl-5 text-sm space-y-1.5 text-neutral-700">
                    {caseData.investigationTargets.map((target, idx) => (
                      <li key={idx}>{target}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Tidak ada target yang ditentukan</p>
                )}
              </div>

              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Checklist Dokumen Pendukung</p>
                {caseData.documentChecklist && caseData.documentChecklist.length > 0 ? (
                  <div className="grid grid-cols-1 gap-1.5">
                    {caseData.documentChecklist.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-neutral-700">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Tidak ada dokumen yang dicentang</p>
                )}
              </div>
            </div>
          </div>

          {/* Case Uploaded Documents */}
          {caseData.documents && caseData.documents.length > 0 && (
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Dokumen &amp; Lampiran Hasil Lapangan
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {caseData.documents.map((doc) => (
                  <AttachmentDisplay key={doc.id} attachment={doc} />
                ))}
              </div>
            </div>
          )}

          {/* Riwayat Timeline */}
          <div className="border-t border-neutral-200 pt-6">
            <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Riwayat Timeline
            </h3>
            <div className="space-y-0">
              {mockTimeline.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="relative flex gap-4 pb-8 last:pb-0"
                >
                  {index < mockTimeline.length - 1 && (
                    <div className="absolute left-[11px] top-7 h-[calc(100%-12px)] w-px bg-red-200" />
                  )}
                  <div className="relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-white">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div className="flex-1 rounded-xl border border-neutral-200 bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold">{event.title}</p>
                      <span className="text-xs text-muted-foreground">
                        {formatDateTime(event.timestamp)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {event.description}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      by {event.author}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* MAIN REPORT SECTION */}
      <section className="pb-8">
        <div className="mb-4 flex items-center justify-between border-b border-neutral-100 pb-3">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
            <MessageSquare className="h-4.5 w-4.5 text-primary" />
            Laporan Investigasi &amp; Catatan Lapangan
          </h3>
          <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
            {comments.length} Laporan
          </span>
        </div>

        {canComment && (
          <div className="mb-6">
            <NoteForm
              onSubmit={handleSubmitNote}
              placeholder={
                user?.role === "CLIENT"
                  ? "Tulis catatan atau respon di sini..."
                  : "Tulis laporan investigasi harian / laporan temuan lapangan di sini..."
              }
              submitLabel="Posting Laporan"
            />
          </div>
        )}

        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-200 p-8 text-center bg-neutral-50/50">
              <MessageSquare className="mx-auto h-8 w-8 text-neutral-300 mb-2" />
              <p className="text-sm font-medium text-neutral-600">Belum ada laporan lapangan</p>
              <p className="text-xs text-muted-foreground mt-1">
                Investigator dapat memposting temuan harian di atas
              </p>
            </div>
          ) : (
            comments.map((comment, index) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                index={index}
                onEdit={(content, html, attachments) => handleEditComment(comment.id, content, html, attachments)}
                onDelete={() => triggerDeleteComment(comment.id)}
                canManage={user?.role === "ADMIN" || user?.id === comment.authorId}
              />
            ))
          )}
        </div>

        {!canComment && (
          <p className="mt-5 text-center text-sm text-muted-foreground">
            Masuk sebagai Klien atau Investigator untuk mengunggah laporan
          </p>
        )}
      </section>

      {/* Reusable Confirm Modal for Deletion */}
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={executeDeleteComment}
        title="Hapus Laporan Lapangan"
        message="Apakah Anda yakin ingin menghapus laporan investigasi / catatan lapangan ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        cancelText="Batal"
        isDestructive={true}
      />
    </motion.div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
