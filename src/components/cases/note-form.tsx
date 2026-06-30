"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Send, Loader2 } from "lucide-react";
import type { CommentAttachment } from "@/types";
import { RichTextEditor } from "@/components/cases/rich-text-editor";
import {
  AttachmentPicker,
  createPendingAttachment,
  pendingToCommentAttachment,
  revokePendingAttachment,
  type PendingAttachment,
} from "@/components/cases/attachment-picker";
import { Button } from "@/components/ui/button";
import { htmlToPlainText, sanitizeHtml, validateFile } from "@/lib/note-utils";

export interface NoteFormData {
  content: string;
  contentHtml: string;
  attachments: CommentAttachment[];
}

interface NoteFormProps {
  onSubmit: (data: NoteFormData) => void;
  placeholder?: string;
  submitLabel?: string;
}

export function NoteForm({
  onSubmit,
  placeholder = "Write your note...",
  submitLabel = "Post Note",
}: NoteFormProps) {
  const [html, setHtml] = useState("");
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const attachmentsRef = useRef<PendingAttachment[]>([]);

  attachmentsRef.current = attachments;

  useEffect(() => {
    return () => {
      attachmentsRef.current.forEach(revokePendingAttachment);
    };
  }, []);

  const plainText = htmlToPlainText(html);
  const canSubmit = plainText.length > 0 || attachments.length > 0;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    setUploadError(null);

    try {
      const sanitized = sanitizeHtml(html);
      const persistedAttachments = await Promise.all(
        attachments.map(pendingToCommentAttachment)
      );

      onSubmit({
        content: htmlToPlainText(sanitized),
        contentHtml: sanitized,
        attachments: persistedAttachments,
      });

      attachments.forEach(revokePendingAttachment);
      setHtml("");
      setAttachments([]);
    } catch {
      setUploadError("Failed to process attachments. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-neutral-200 bg-neutral-50/30 p-4"
    >
      <RichTextEditor
        value={html}
        onChange={setHtml}
        placeholder={placeholder}
      />

      <AttachmentPicker
        attachments={attachments}
        onAdd={handleAddFiles}
        onRemove={handleRemove}
        error={uploadError}
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={!canSubmit || isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
