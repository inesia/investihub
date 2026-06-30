"use client";

import { motion } from "framer-motion";
import { Download, FileText } from "lucide-react";
import type { CommentWithAuthor } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDateTime, getInitials } from "@/lib/utils";
import { formatFileSize, sanitizeHtml } from "@/lib/note-utils";

interface CommentItemProps {
  comment: CommentWithAuthor;
  index?: number;
}

export function CommentItem({ comment, index = 0 }: CommentItemProps) {
  const hasHtml = Boolean(comment.contentHtml?.trim());
  const hasAttachments = Boolean(comment.attachments?.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="rounded-xl border border-neutral-200 p-4"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Avatar className="h-7 w-7">
          <AvatarFallback className="bg-red-50 text-[10px] text-primary">
            {getInitials(comment.author.name)}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">{comment.author.name}</span>
        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium uppercase text-neutral-600">
          {comment.author.role}
        </span>
        <span className="text-xs text-muted-foreground sm:ml-auto">
          {formatDateTime(comment.createdAt)}
        </span>
      </div>

      {hasHtml ? (
        <div
          className="prose-note text-sm leading-relaxed [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-3 [&_blockquote]:italic [&_h3]:mb-1 [&_h3]:mt-2 [&_h3]:text-base [&_h3]:font-semibold [&_ol]:ml-4 [&_ol]:list-decimal [&_ul]:ml-4 [&_ul]:list-disc"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(comment.contentHtml!),
          }}
        />
      ) : (
        <p className="text-sm leading-relaxed">{comment.content}</p>
      )}

      {hasAttachments && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {comment.attachments!.map((att) => (
            <AttachmentDisplay key={att.id} attachment={att} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

function AttachmentDisplay({
  attachment,
}: {
  attachment: NonNullable<CommentWithAuthor["attachments"]>[number];
}) {
  if (attachment.type === "image") {
    return (
      <a
        href={attachment.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-hidden rounded-lg border border-neutral-200"
      >
        <img
          src={attachment.url}
          alt={attachment.name}
          className="max-h-48 w-full object-cover transition-opacity hover:opacity-90"
        />
        <p className="truncate px-2 py-1.5 text-xs text-muted-foreground">
          {attachment.name}
        </p>
      </a>
    );
  }

  if (attachment.type === "video") {
    return (
      <div className="overflow-hidden rounded-lg border border-neutral-200">
        <video
          src={attachment.url}
          controls
          className="max-h-48 w-full bg-black"
        />
        <p className="truncate px-2 py-1.5 text-xs text-muted-foreground">
          {attachment.name} · {formatFileSize(attachment.size)}
        </p>
      </div>
    );
  }

  return (
    <a
      href={attachment.url}
      download={attachment.name}
      className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3 transition-colors hover:bg-neutral-100"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white">
        <FileText className="h-5 w-5 text-neutral-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{attachment.name}</p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(attachment.size)}
        </p>
      </div>
      <Download className="h-4 w-4 shrink-0 text-muted-foreground" />
    </a>
  );
}
