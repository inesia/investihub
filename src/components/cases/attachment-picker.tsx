"use client";

import { useId } from "react";
import { FileText, Image as ImageIcon, Paperclip, Video, X, Plus } from "lucide-react";
import type { CommentAttachment } from "@/types";
import { buttonVariants } from "@/components/ui/button";
import {
  formatFileSize,
  getAttachmentType,
  readFileAsDataUrl,
} from "@/lib/note-utils";
import { cn } from "@/lib/utils";

export interface PendingAttachment {
  id: string;
  file: File;
  previewUrl: string;
  type: CommentAttachment["type"];
  caption?: string;
}

interface AttachmentPickerProps {
  attachments: PendingAttachment[];
  onAdd: (files: FileList | File[]) => void;
  onRemove: (id: string) => void;
  onCaptionChange?: (id: string, caption: string) => void;
  onReplace?: (id: string, file: File) => void;
  error?: string | null;
  className?: string;
}

export function AttachmentPicker({
  attachments,
  onAdd,
  onRemove,
  onCaptionChange,
  onReplace,
  error,
  className,
}: AttachmentPickerProps) {
  const imageId = useId();
  const videoId = useId();
  const fileId = useId();

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      onAdd(files);
    }
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files.length) {
      onAdd(e.dataTransfer.files);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={handleDrop}
        className="flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-neutral-300 bg-neutral-50/50 p-3"
      >
        <span className="mr-1 text-xs text-muted-foreground">Attach:</span>

        <label
          htmlFor={imageId}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-8 cursor-pointer gap-1.5 text-xs"
          )}
        >
          <ImageIcon className="h-3.5 w-3.5" />
          Image
        </label>

        <label
          htmlFor={videoId}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-8 cursor-pointer gap-1.5 text-xs"
          )}
        >
          <Video className="h-3.5 w-3.5" />
          Video
        </label>

        <label
          htmlFor={fileId}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-8 cursor-pointer gap-1.5 text-xs"
          )}
        >
          <Paperclip className="h-3.5 w-3.5" />
          File
        </label>

        <span className="hidden text-xs text-muted-foreground sm:inline">
          or drag & drop here
        </span>

        <input
          id={imageId}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp,image/bmp,image/svg+xml,.heic,.heif"
          multiple
          className="sr-only"
          onChange={handleFiles}
        />
        <input
          id={videoId}
          type="file"
          accept="video/mp4,video/webm,video/quicktime,.mov,.avi,.mkv"
          multiple
          className="sr-only"
          onChange={handleFiles}
        />
        <input
          id={fileId}
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,application/pdf"
          multiple
          className="sr-only"
          onChange={handleFiles}
        />
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-primary">
          {error}
        </p>
      )}

      {attachments.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2">
          {attachments.map((att) => (
            <AttachmentPreviewCard
              key={att.id}
              attachment={att}
              onRemove={() => onRemove(att.id)}
              onCaptionChange={onCaptionChange}
              onReplace={onReplace}
            />
          ))}
          {/* Dash Trigger to add more files directly */}
          <label
            htmlFor={imageId}
            className="flex flex-col items-center justify-center border border-dashed border-neutral-300 rounded-lg bg-neutral-50/30 hover:bg-neutral-50/80 p-3 cursor-pointer min-h-[90px] transition-colors"
          >
            <Plus className="h-5 w-5 text-neutral-400 mb-1" />
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Tambah Gambar / File</span>
          </label>
        </div>
      )}
    </div>
  );
}

function AttachmentPreviewCard({
  attachment,
  onRemove,
  onCaptionChange,
  onReplace,
}: {
  attachment: PendingAttachment;
  onRemove: () => void;
  onCaptionChange?: (id: string, caption: string) => void;
  onReplace?: (id: string, file: File) => void;
}) {
  return (
    <div className="relative flex flex-col gap-2 rounded-lg border border-neutral-200 bg-white p-3">
      <button
        type="button"
        onClick={onRemove}
        className="absolute -right-2 -top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white shadow-sm hover:bg-primary/90"
      >
        <X className="h-3 w-3" />
      </button>

      <div className="flex items-center gap-3">
        {attachment.type === "image" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={attachment.previewUrl}
            alt={attachment.file.name}
            className="h-14 w-14 shrink-0 rounded-md object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}
        {attachment.type === "video" && (
          <video
            src={attachment.previewUrl}
            muted
            className="h-14 w-14 shrink-0 rounded-md object-cover"
          />
        )}
        {attachment.type === "file" && (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-neutral-100">
            <FileText className="h-6 w-6 text-neutral-500" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium">{attachment.file.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] capitalize text-muted-foreground">
              {attachment.type} · {formatFileSize(attachment.file.size)}
            </span>
            <span>·</span>
            <label
              htmlFor={`replace-${attachment.id}`}
              className="text-[10px] text-primary font-bold hover:underline cursor-pointer"
            >
              Ganti
            </label>
            <input
              id={`replace-${attachment.id}`}
              type="file"
              accept={
                attachment.type === "image"
                  ? "image/*"
                  : attachment.type === "video"
                  ? "video/*"
                  : "*/*"
              }
              className="sr-only"
              onChange={(e) => {
                const files = e.target.files;
                if (files?.length && onReplace) {
                  onReplace(attachment.id, files[0]);
                }
              }}
            />
          </div>
        </div>
      </div>

      <input
        type="text"
        value={attachment.caption || ""}
        onChange={(e) => onCaptionChange?.(attachment.id, e.target.value)}
        placeholder="Tulis keterangan / caption untuk lampiran ini..."
        className="flex h-8 w-full rounded border border-neutral-200 bg-neutral-50/50 px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all"
      />
    </div>
  );
}

export function createPendingAttachment(file: File): PendingAttachment {
  return {
    id: `att-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    file,
    previewUrl: URL.createObjectURL(file),
    type: getAttachmentType(file.type, file.name),
  };
}

export async function pendingToCommentAttachment(
  att: PendingAttachment
): Promise<CommentAttachment> {
  const dataUrl = await readFileAsDataUrl(att.file);

  return {
    id: att.id,
    name: att.file.name,
    type: att.type,
    url: dataUrl,
    size: att.file.size,
    mimeType: att.file.type || "application/octet-stream",
    caption: att.caption || null,
  };
}

export function revokePendingAttachment(att: PendingAttachment) {
  URL.revokeObjectURL(att.previewUrl);
}
