"use client";

import { X, Download, FileText } from "lucide-react";
import { formatFileSize } from "@/lib/note-utils";
import type { CommentAttachment } from "@/types";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  attachment: CommentAttachment;
}

export function PreviewModal({ isOpen, onClose, attachment }: PreviewModalProps) {
  if (!isOpen) return null;

  const isImage = attachment.type === "image";
  const isVideo = attachment.type === "video";
  const isPdf = attachment.mimeType === "application/pdf" || attachment.name.endsWith(".pdf");

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in duration-200">
      {/* Top action bar */}
      <div className="absolute top-4 right-4 z-[110] flex items-center gap-3">
        <a
          href={attachment.url}
          download={attachment.name}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          title="Unduh Lampiran"
        >
          <Download className="h-5 w-5" />
        </a>
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          title="Tutup"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl max-h-[80vh] mt-12 mb-6">
        {isImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={attachment.url}
            alt={attachment.name}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200"
          />
        )}

        {isVideo && (
          <video
            src={attachment.url}
            controls
            autoPlay
            className="max-w-full max-h-full rounded-lg shadow-2xl bg-black animate-in zoom-in-95 duration-200"
          />
        )}

        {!isImage && !isVideo && (
          <div className="flex flex-col items-center justify-center rounded-xl bg-white/5 border border-white/10 p-10 text-center max-w-md w-full animate-in zoom-in-95 duration-200">
            {isPdf ? (
              <iframe
                src={attachment.url}
                className="w-full h-[60vh] rounded border border-white/10 bg-white mb-4"
                title={attachment.name}
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-white mb-4">
                <FileText className="h-8 w-8" />
              </div>
            )}
            <p className="font-semibold text-white text-base truncate w-full">
              {attachment.caption || attachment.name}
            </p>
            {attachment.caption && (
              <p className="text-xs text-white/50 truncate w-full mt-1">
                {attachment.name}
              </p>
            )}
            <p className="text-xs text-white/40 mt-1 capitalize">
              {attachment.type} · {formatFileSize(attachment.size)}
            </p>
            {!isPdf && (
              <a
                href={attachment.url}
                download={attachment.name}
                className="mt-6 inline-flex h-9 items-center justify-center rounded-lg bg-white px-5 text-xs font-bold text-black hover:bg-neutral-100 transition-colors shadow-lg"
              >
                Unduh Dokumen
              </a>
            )}
          </div>
        )}
      </div>

      {/* Footer Info (Caption & Name) */}
      {(isImage || isVideo) && (
        <div className="w-full max-w-xl text-center px-4">
          <h4 className="text-sm font-semibold text-white truncate">
            {attachment.caption || attachment.name}
          </h4>
          {attachment.caption && (
            <p className="text-xs text-white/60 truncate mt-1">
              {attachment.name}
            </p>
          )}
          <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">
            {formatFileSize(attachment.size)}
          </p>
        </div>
      )}
    </div>
  );
}
