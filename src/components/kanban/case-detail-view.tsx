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
} from "lucide-react";
import type { CaseWithRelations, CommentWithAuthor } from "@/types";
import { STATUS_LABELS, canPostComments } from "@/types";
import { StatusBadge } from "@/components/kanban/status-badge";
import { CommentItem, AttachmentDisplay } from "@/components/cases/comment-item";
import { NoteForm, type NoteFormData } from "@/components/cases/note-form";
import { useAuth } from "@/contexts/auth-context";
import { formatDate, formatDateTime } from "@/lib/utils";

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

const initialComments: CommentWithAuthor[] = [
  {
    id: "c-1",
    caseId: "case-001",
    content: "Please provide additional photos of the damage area.",
    contentHtml: "<p>Please provide <strong>additional photos</strong> of the damage area.</p>",
    createdAt: new Date("2024-06-03T10:00:00"),
    authorId: "inv-001",
    author: { id: "inv-001", name: "Ahmad Rizki", role: "INVESTIGATOR" },
  },
  {
    id: "c-2",
    caseId: "case-001",
    content: "Photos have been uploaded. Please review at your earliest convenience.",
    contentHtml:
      "<p>Photos have been uploaded. Please review at your earliest convenience.</p><ul><li>Front damage</li><li>Rear bumper</li></ul>",
    attachments: [
      {
        id: "att-demo-1",
        name: "damage-front.jpg",
        type: "image",
        url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
        size: 245000,
        mimeType: "image/jpeg",
      },
    ],
    createdAt: new Date("2024-06-04T15:30:00"),
    authorId: "user-client-001",
    author: { id: "user-client-001", name: "Rina Kusuma", role: "CLIENT" },
  },
];

export function CaseDetailView({ caseData }: CaseDetailViewProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentWithAuthor[]>(initialComments);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-4xl space-y-8"
    >
      <div className="border-b border-neutral-200 pb-6">
        <div className="mb-3">
          <StatusBadge status={caseData.status} />
        </div>
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">
          {caseData.insuredName}
        </h2>
        <p className="mt-1 font-mono text-sm text-muted-foreground">
          {caseData.policyNumber}
        </p>
      </div>

      <section>
        <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Detail Kasus
        </h3>
        <div className="grid gap-4 rounded-xl border border-neutral-200 p-5 sm:grid-cols-2 lg:grid-cols-3">
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
              <p className="mb-1 text-xs text-muted-foreground">Deskripsi</p>
              <p className="text-sm leading-relaxed">{caseData.description}</p>
            </div>
          )}
          {caseData.documents && caseData.documents.length > 0 && (
            <div className="col-span-full border-t border-neutral-200 pt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Paperclip className="h-3.5 w-3.5" /> Case Documents
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {caseData.documents.map((doc) => (
                  <AttachmentDisplay key={doc.id} attachment={doc} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section>
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
      </section>

      <section className="pb-8">
        <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <MessageSquare className="h-4 w-4" />
          Catatan &amp; Komentar
        </h3>

        {canComment && (
          <div className="mb-6">
            <NoteForm
              onSubmit={handleSubmitNote}
              placeholder={
                user?.role === "CLIENT"
                  ? "Tulis catatan atau lampirkan bukti..."
                  : "Tambahkan catatan investigasi..."
              }
              submitLabel="Posting Catatan"
            />
          </div>
        )}

        <div className="space-y-3">
          {comments.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Belum ada catatan. Jadilah yang pertama menambahkan.
            </p>
          ) : (
            comments.map((comment, index) => (
              <CommentItem key={comment.id} comment={comment} index={index} />
            ))
          )}
        </div>

        {!canComment && (
          <p className="mt-5 text-center text-sm text-muted-foreground">
            Masuk sebagai Klien atau Investigator untuk menambahkan catatan
          </p>
        )}
      </section>
    </motion.div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
