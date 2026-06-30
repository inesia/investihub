"use client";

import { useId } from "react";
import { FileText, Image as ImageIcon, Paperclip, Video, X } from "lucide-react";
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
}

interface AttachmentPickerProps {
  attachments: PendingAttachment[];
  onAdd: (files: FileList | File[]) => void;
  onRemove: (id: string) => void;
  error?: string | null;
  className?: string;
}

export function AttachmentPicker({
  attachments,
  onAdd,
  onRemove,
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
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AttachmentPreviewCard({
  attachment,
  onRemove,
}: {
  attachment: PendingAttachment;
  onRemove: () => void;
}) {
  return (
    <div className="relative flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-2">
      <button
        type="button"
        onClick={onRemove}
        className="absolute -right-2 -top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white shadow-sm hover:bg-primary/90"
      >
        <X className="h-3 w-3" />
      </button>

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
        <p className="text-[10px] capitalize text-muted-foreground">
          {attachment.type} · {formatFileSize(attachment.file.size)}
        </p>
      </div>
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
  };
}

export function revokePendingAttachment(att: PendingAttachment) {
  URL.revokeObjectURL(att.previewUrl);
}
