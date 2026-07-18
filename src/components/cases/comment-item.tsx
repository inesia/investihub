import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, FileText, MoreVertical, Edit2, Trash2, X, Check, Plus, Image as ImageIcon, Video, Paperclip, MessageCircle, Clock } from "lucide-react";
import type { CommentWithAuthor, CommentAttachment } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDateTime, getInitials } from "@/lib/utils";
import { formatFileSize, sanitizeHtml } from "@/lib/note-utils";
import { PreviewModal } from "@/components/ui/preview-modal";
import { NoteForm } from "@/components/cases/note-form";

interface CommentItemProps {
  comment: CommentWithAuthor;
  index?: number;
  onEdit?: (id: string, content: string, contentHtml?: string, attachments?: CommentAttachment[]) => void;
  onDelete?: (id: string) => void;
  onReply?: (parentId: string, content: string, contentHtml?: string, attachments?: CommentAttachment[]) => void;
  onApprove?: (id: string) => void;
  onClientAction?: (id: string, action: "CONFIRMED" | "HOLD" | null) => void;
  currentUser?: { id: string; role: string; name: string } | null;
  canManage?: boolean;
  replies?: CommentWithAuthor[];
  isReply?: boolean;
}

export function CommentItem({ 
  comment, 
  index = 0, 
  onEdit, 
  onDelete, 
  onReply, 
  onApprove,
  onClientAction,
  currentUser,
  canManage = false, 
  replies = [], 
  isReply = false 
}: CommentItemProps) {
  const hasHtml = Boolean(comment.contentHtml?.trim());
  const hasAttachments = Boolean(comment.attachments?.length);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [editAttachments, setEditAttachments] = useState<CommentAttachment[]>(comment.attachments || []);
  const [showMenu, setShowMenu] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setEditContent(comment.content);
    setEditAttachments(comment.attachments || []);
  }, [comment]);

  const handleSave = () => {
    if (!editContent.trim() && editAttachments.length === 0) return;
    if (onEdit) {
      // Simulate simple HTML generation for edit
      const cleanText = editContent.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const cleanHtml = editContent.trim() ? `<p>${cleanText.replace(/\n/g, "<br />")}</p>` : "";
      onEdit(comment.id, editContent, cleanHtml, editAttachments);
    }
    setIsEditing(false);
  };

  const handleAddAttachments = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newAtts: CommentAttachment[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      
      const type = file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
        ? "video"
        : "file";

      newAtts.push({
        id: `att-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: file.name,
        type,
        url: dataUrl,
        size: file.size,
        mimeType: file.type || "application/octet-stream",
        caption: "",
      });
    }
    setEditAttachments((prev) => [...prev, ...newAtts]);
    e.target.value = "";
  };

  const handleReplaceAttachment = async (id: string, file: File) => {
    const dataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

    const type = file.type.startsWith("image/")
      ? "image"
      : file.type.startsWith("video/")
      ? "video"
      : "file";

    setEditAttachments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              name: file.name,
              type,
              url: dataUrl,
              size: file.size,
              mimeType: file.type || "application/octet-stream",
            }
          : a
      )
    );
  };

  const handleRemoveAttachment = (id: string) => {
    setEditAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAttachmentCaptionChange = (id: string, caption: string) => {
    setEditAttachments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, caption } : a))
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="rounded-xl border border-neutral-200 p-4 relative bg-white"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-red-50 text-[10px] text-primary">
              {getInitials(comment.author.name)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{comment.author.name}</span>
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium uppercase text-neutral-600">
            {comment.author.role}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDateTime(comment.createdAt)}
          </span>
        </div>

        {/* 3-Dots Menu Button */}
        {canManage && !isEditing && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-md hover:bg-neutral-100 text-muted-foreground hover:text-foreground transition-colors"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-36 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg z-20 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit Laporan
                </button>
                <button
                  onClick={() => {
                    if (onDelete) onDelete(comment.id);
                    setShowMenu(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-destructive hover:bg-red-50 transition-colors border-t border-neutral-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Hapus Laporan
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            rows={3}
          />
          
          {/* Edit Attachments List */}
          {editAttachments.length > 0 && (
            <div className="grid gap-2 sm:grid-cols-2">
              {editAttachments.map((att) => (
                <div key={att.id} className="relative flex flex-col gap-2 rounded-lg border border-neutral-200 bg-white p-3">
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(att.id)}
                    className="absolute -right-2 -top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white shadow-sm hover:bg-primary/90"
                  >
                    <X className="h-3 w-3" />
                  </button>

                  <div className="flex items-center gap-3">
                    {att.type === "image" && (
                      <img src={att.url} alt={att.name} className="h-14 w-14 shrink-0 rounded-md object-cover" />
                    )}
                    {att.type === "video" && (
                      <video src={att.url} muted className="h-14 w-14 shrink-0 rounded-md object-cover" />
                    )}
                    {att.type === "file" && (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-neutral-100">
                        <FileText className="h-6 w-6 text-neutral-500" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium">{att.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] capitalize text-muted-foreground">
                          {att.type} · {formatFileSize(att.size)}
                        </span>
                        <span>·</span>
                        <label
                          htmlFor={`edit-replace-${att.id}`}
                          className="text-[10px] text-primary font-bold hover:underline cursor-pointer"
                        >
                          Ganti
                        </label>
                        <input
                          id={`edit-replace-${att.id}`}
                          type="file"
                          accept={
                            att.type === "image"
                              ? "image/*"
                              : att.type === "video"
                              ? "video/*"
                              : "*/*"
                          }
                          className="sr-only"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files?.length) {
                              handleReplaceAttachment(att.id, files[0]);
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={att.caption || ""}
                    onChange={(e) => handleAttachmentCaptionChange(att.id, e.target.value)}
                    placeholder="Tulis keterangan / caption..."
                    className="flex h-8 w-full rounded border border-neutral-200 bg-neutral-50/50 px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Add Attachment Button */}
          <div className="flex items-center gap-2 rounded-lg border border-dashed border-neutral-300 bg-neutral-50/50 p-3">
            <span className="text-xs text-muted-foreground">Tambah Lampiran:</span>
            <label
              htmlFor={`edit-add-files-${comment.id}`}
              className="flex items-center gap-1 cursor-pointer rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-xs font-semibold hover:bg-neutral-50"
            >
              <Plus className="h-3.5 w-3.5" />
              Pilih File
            </label>
            <input
              id={`edit-add-files-${comment.id}`}
              type="file"
              multiple
              className="sr-only"
              onChange={handleAddAttachments}
            />
          </div>

          <div className="flex justify-end gap-1.5 border-t border-neutral-100 pt-3">
            <button
              onClick={() => {
                setEditContent(comment.content);
                setEditAttachments(comment.attachments || []);
                setIsEditing(false);
              }}
              className="flex items-center gap-1 rounded px-2.5 py-1.5 text-xs font-semibold border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            >
              <X className="h-3.5 w-3.5" />
              Batal
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 rounded bg-primary px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-primary/90 shadow-sm"
            >
              <Check className="h-3.5 w-3.5" />
              Simpan
            </button>
          </div>
        </div>
      ) : (
        <>
          {hasHtml ? (
            <div
              className="prose-note text-sm leading-relaxed [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-3 [&_blockquote]:italic [&_h3]:mb-1 [&_h3]:mt-2 [&_h3]:text-base [&_h3]:font-semibold [&_ol]:ml-4 [&_ol]:list-decimal [&_ul]:ml-4 [&_ul]:list-disc"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(comment.contentHtml!),
              }}
            />
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-line">{comment.content}</p>
          )}

          {hasAttachments && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {comment.attachments!.map((att) => (
                <AttachmentDisplay key={att.id} attachment={att} />
              ))}
            </div>
          )}

          {/* Action bar */}
          {!isEditing && !isReply && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-100 pt-3">
              {currentUser?.role !== "CLIENT" && (
                <button
                  onClick={() => setIsReplying(!isReplying)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Balas
                </button>
              )}

              {/* Client action buttons or badges */}
              {currentUser?.role === "CLIENT" && comment.author.role !== "CLIENT" ? (
                <div className="flex items-center gap-2">
                  {comment.clientStatus === "CONFIRMED" ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-200">
                      <Check className="h-3.5 w-3.5" />
                      Dikonfirmasi Klien
                    </div>
                  ) : comment.clientStatus === "HOLD" ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                      <Clock className="h-3.5 w-3.5" />
                      Ditunda Klien
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => onClientAction?.(comment.id, "CONFIRMED")}
                        className="flex items-center gap-1 rounded bg-green-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-green-700 shadow-sm"
                      >
                        <Check className="h-3 w-3 mr-0.5" />
                        Confirm
                      </button>
                      <button
                        onClick={() => onClientAction?.(comment.id, "HOLD")}
                        className="flex items-center gap-1 rounded bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white hover:bg-amber-600 shadow-sm"
                      >
                        <Clock className="h-3 w-3 mr-0.5" />
                        Hold
                      </button>
                    </>
                  )}
                  {comment.clientStatus && (
                    <button
                      onClick={() => onClientAction?.(comment.id, null)}
                      className="text-xs text-primary hover:underline font-medium ml-1"
                    >
                      Ubah
                    </button>
                  )}
                </div>
              ) : (
                /* Approval Badge or Button */
                comment.isApproved ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-200">
                    <Check className="h-3.5 w-3.5" />
                    Telah Dikonfirmasi
                  </div>
                ) : (
                  currentUser?.role === "ADMIN" && comment.author.role !== "ADMIN" && (
                    <button
                      onClick={() => onApprove?.(comment.id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-md shadow-sm transition-colors"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Konfirmasi Laporan
                    </button>
                  )
                )
              )}
            </div>
          )}
        </>
      )}

      {isReplying && (
        <div className="mt-4 border-l-2 border-primary/20 pl-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <NoteForm
            onSubmit={(data) => {
              if (onReply) {
                onReply(comment.id, data.content, data.contentHtml, data.attachments);
              }
              setIsReplying(false);
              setShowReplies(true);
            }}
            placeholder="Tulis balasan..."
            submitLabel="Kirim Balasan"
          />
        </div>
      )}

      {replies.length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-2 text-xs font-semibold text-primary hover:underline transition-all"
          >
            <div className="h-px w-8 bg-neutral-200" />
            {showReplies ? "Sembunyikan balasan" : `Lihat ${replies.length} balasan`}
          </button>
          
          {showReplies && (
            <div className="mt-4 space-y-3 pl-4 sm:pl-8 animate-in fade-in duration-200 border-l-2 border-neutral-100">
              {replies.map((reply, i) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  index={i}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onReply={onReply}
                  onClientAction={onClientAction}
                  currentUser={currentUser}
                  canManage={canManage}
                  isReply={true}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

export function AttachmentDisplay({
  attachment,
}: {
  attachment: CommentAttachment;
}) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const title = attachment.caption || attachment.name;
  const showSubtitle = Boolean(attachment.caption);

  return (
    <>
      {attachment.type === "image" && (
        <button
          type="button"
          onClick={() => setIsPreviewOpen(true)}
          className="block text-left w-full overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm hover:border-neutral-300 transition-all"
        >
          <img
            src={attachment.url}
            alt={attachment.name}
            className="max-h-48 w-full object-cover transition-opacity hover:opacity-95"
          />
          <div className="px-2 py-1.5 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">
              {title}
            </p>
            {showSubtitle && (
              <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                {attachment.name}
              </p>
            )}
          </div>
        </button>
      )}

      {attachment.type === "video" && (
        <button
          type="button"
          onClick={() => setIsPreviewOpen(true)}
          className="block text-left w-full overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm hover:border-neutral-300 transition-all group"
        >
          <div className="relative max-h-48 w-full bg-neutral-950 overflow-hidden flex items-center justify-center">
            <video
              src={attachment.url}
              className="max-h-48 w-full object-cover pointer-events-none"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/35 transition-all flex items-center justify-center">
              <span className="rounded-full bg-white/20 hover:bg-white/40 p-2.5 backdrop-blur-sm text-white text-[10px] font-bold tracking-wider uppercase transition-all shadow">
                Putar Video
              </span>
            </div>
          </div>
          <div className="px-2 py-1.5 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">
              {title}
            </p>
            <p className="text-[10px] text-muted-foreground truncate mt-0.5">
              {showSubtitle ? `${attachment.name} · ` : ""}{formatFileSize(attachment.size)}
            </p>
          </div>
        </button>
      )}

      {attachment.type !== "image" && attachment.type !== "video" && (
        <button
          type="button"
          onClick={() => setIsPreviewOpen(true)}
          className="flex w-full items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-left transition-colors hover:bg-neutral-100"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white border border-neutral-200">
            <FileText className="h-5 w-5 text-neutral-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">{title}</p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {showSubtitle ? `${attachment.name} · ` : ""}{formatFileSize(attachment.size)}
            </p>
          </div>
          <Download className="h-4 w-4 shrink-0 text-muted-foreground hover:text-foreground transition-colors" />
        </button>
      )}

      {/* Render the Overlay Preview Modal */}
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        attachment={attachment}
      />
    </>
  );
}
