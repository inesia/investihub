const ALLOWED_TAGS = new Set([
  "p", "br", "strong", "b", "em", "i", "u", "s",
  "ul", "ol", "li", "a", "h1", "h2", "h3", "blockquote",
]);

const IMAGE_EXTENSIONS = new Set([
  "jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "heic", "heif",
]);

const VIDEO_EXTENSIONS = new Set([
  "mp4", "webm", "mov", "avi", "mkv", "m4v",
]);

export function getFileExtension(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

export function getAttachmentType(
  mimeType: string,
  fileName?: string
): "image" | "video" | "file" {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";

  const ext = fileName ? getFileExtension(fileName) : "";
  if (IMAGE_EXTENSIONS.has(ext)) return "image";
  if (VIDEO_EXTENSIONS.has(ext)) return "video";

  return "file";
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export function sanitizeHtml(html: string): string {
  if (typeof window === "undefined") return html;

  const doc = new DOMParser().parseFromString(html, "text/html");

  const clean = (node: Node): void => {
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as Element;
        if (!ALLOWED_TAGS.has(el.tagName.toLowerCase())) {
          el.replaceWith(...Array.from(el.childNodes));
          return;
        }
        Array.from(el.attributes).forEach((attr) => {
          if (el.tagName.toLowerCase() === "a" && attr.name === "href") {
            if (!attr.value.startsWith("http")) el.removeAttribute("href");
          } else {
            el.removeAttribute(attr.name);
          }
        });
      }
      clean(child);
    });
  };

  clean(doc.body);
  return doc.body.innerHTML;
}

export function htmlToPlainText(html: string): string {
  if (typeof window === "undefined") return html.replace(/<[^>]*>/g, "");
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent?.trim() ?? "";
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024; // 10 MB

export function validateFile(file: File): string | null {
  if (file.size === 0) return `"${file.name}" is empty`;
  if (file.size > MAX_ATTACHMENT_SIZE) {
    return `"${file.name}" exceeds ${formatFileSize(MAX_ATTACHMENT_SIZE)} limit`;
  }
  return null;
}
