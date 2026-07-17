"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Search,
  Filter,
} from "lucide-react";
import type { CaseWithRelations, CommentWithAuthor, CommentAttachment } from "@/types";
import { STATUS_LABELS, canPostComments } from "@/types";
import { StatusBadge } from "@/components/kanban/status-badge";
import { CommentItem, AttachmentDisplay } from "@/components/cases/comment-item";
import { NoteForm, type NoteFormData } from "@/components/cases/note-form";
import { useAuth } from "@/contexts/auth-context";
import { useCases } from "@/contexts/cases-context";
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
  const { updateCase } = useCases();
  const STORAGE_KEY = `investihub-comments-${caseData.id}`;
  const [comments, setComments] = useState<CommentWithAuthor[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to load comments from local storage", e);
      }
    }
    return initialComments;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
    }
  }, [comments, STORAGE_KEY]);
  const [showDetails, setShowDetails] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

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

    // Automatically trigger status to ON_PROGRESS when the first field note is posted
    if (caseData.status === "NEW") {
      updateCase(caseData.id, { status: "ON_PROGRESS" });
    }
  };

  const router = useRouter();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const handleCompleteCase = () => {
    updateCase(caseData.id, { status: "CLOSED" });
    router.push("/dashboard");
  };

  const handleArchiveCase = () => {
    updateCase(caseData.id, { status: "ARCHIVED" });
    alert("Kasus telah diarsipkan.");
    router.push("/dashboard/archive");
  };

  const handleSaveCancelledCase = () => {
    setCancelModalOpen(false);
    alert("Kasus telah disimpan dengan status 'Dibatalkan'.");
    router.push("/dashboard");
  };

  const handleDeleteCase = () => {
    setCancelModalOpen(false);
    alert("Kasus berhasil dihapus secara permanen.");
    router.push("/dashboard");
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

  const filteredComments = comments.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const contentText = (c.content || "").toLowerCase();
    const authorName = (c.author?.name || "").toLowerCase();
    return contentText.includes(q) || authorName.includes(q);
  });

  const topLevelComments = filteredComments.filter(c => !c.parentId);

  const sortedComments = [...topLevelComments].sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
  });

  const getReplies = (parentId: string) => {
    return filteredComments
      .filter((c) => c.parentId === parentId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };

  const handleReplyComment = (parentId: string, content: string, contentHtml?: string, attachments?: CommentAttachment[]) => {
    if (!user) return;
    const comment: CommentWithAuthor = {
      id: `c-${Date.now()}`,
      caseId: caseData.id,
      parentId,
      content,
      contentHtml,
      attachments: attachments?.length ? attachments : undefined,
      createdAt: new Date(),
      authorId: user.id,
      author: { id: user.id, name: user.name, role: user.role },
    };
    setComments((prev) => [...prev, comment]);
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

        {comments.length > 0 && (
          <div className="mb-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari laporan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all"
              />
            </div>
            <div className="relative w-full sm:w-40 shrink-0">
              <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
                className="w-full appearance-none rounded-md border border-input bg-background pl-8 pr-8 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all cursor-pointer"
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        )}

        <div className="space-y-4">
          {sortedComments.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-200 p-8 text-center bg-neutral-50/50">
              <MessageSquare className="mx-auto h-8 w-8 text-neutral-300 mb-2" />
              {comments.length === 0 ? (
                <>
                  <p className="text-sm font-medium text-neutral-600">Belum ada laporan lapangan</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Investigator dapat memposting temuan harian di atas
                  </p>
                </>
              ) : (
                <p className="text-sm font-medium text-neutral-600">Laporan tidak ditemukan</p>
              )}
            </div>
          ) : (
            sortedComments.map((comment, index) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                index={index}
                onEdit={handleEditComment}
                onDelete={triggerDeleteComment}
                onReply={handleReplyComment}
                canManage={user?.role === "ADMIN" || user?.id === comment.authorId}
                replies={getReplies(comment.id)}
              />
            ))
          )}
        </div>

        {!canComment && (
          <p className="mt-5 text-center text-sm text-muted-foreground">
            Masuk sebagai Klien atau Investigator untuk mengunggah laporan
          </p>
        )}

        {/* Case Actions */}
        {(user?.role === "ADMIN" || user?.role === "INVESTIGATOR") && (
          <div className="mt-8 border-t border-neutral-200 pt-8 flex flex-col items-center">
            <button
              onClick={() => setShowActions(!showActions)}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <span>{showActions ? "Tutup pengaturan" : "Atur Status Kasus"}</span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", showActions && "rotate-180")} />
            </button>
            
            {showActions && (
              <div className="mt-5 flex w-full max-w-sm flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                {user?.role === "ADMIN" && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                    <label className="mb-1.5 block text-xs font-semibold text-red-700">Admin Override Status</label>
                    <select
                      value={caseData.status}
                      onChange={(e) => {
                        updateCase(caseData.id, { status: e.target.value as any });
                        alert("Status berhasil diubah secara manual.");
                        router.push("/dashboard");
                      }}
                      className="w-full rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    >
                      {Object.entries(STATUS_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                    <p className="mt-1.5 text-[10px] text-red-600 leading-tight">Gunakan fitur ini hanya untuk mengembalikan status akibat Human Error.</p>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-3">
                  {caseData.status !== "CLOSED" && caseData.status !== "ARCHIVED" && (
                    <button 
                      onClick={handleCompleteCase}
                      className="flex-1 rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
                    >
                      Tandai Selesai
                    </button>
                  )}
                  {caseData.status === "CLOSED" && (
                    <button 
                      onClick={handleArchiveCase}
                      className="flex-1 rounded-md bg-neutral-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-neutral-700 transition-colors"
                    >
                      Arsipkan Kasus
                    </button>
                  )}
                  <button 
                    onClick={() => setCancelModalOpen(true)}
                    className="flex-1 rounded-md bg-destructive px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-destructive/90 transition-colors"
                  >
                    Batalkan Kasus
                  </button>
                </div>
              </div>
            )}
          </div>
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
      {/* Cancel Case Custom Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-5 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-foreground">Batalkan Kasus</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                Apakah Anda ingin menyimpan riwayat kasus ini dengan status dibatalkan, atau menghapusnya secara permanen dari sistem?
              </p>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSaveCancelledCase}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
              >
                Simpan
              </button>
              <button
                onClick={handleDeleteCase}
                className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-white hover:bg-destructive/90 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
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
