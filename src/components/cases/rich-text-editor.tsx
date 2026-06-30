"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Heading2,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { sanitizeHtml } from "@/lib/note-utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

const toolbarItems = [
  { icon: Bold, command: "bold", label: "Bold" },
  { icon: Italic, command: "italic", label: "Italic" },
  { icon: Underline, command: "underline", label: "Underline" },
  { icon: Heading2, command: "formatBlock", value: "h3", label: "Heading" },
  { icon: List, command: "insertUnorderedList", label: "Bullet list" },
  { icon: ListOrdered, command: "insertOrderedList", label: "Numbered list" },
  { icon: Quote, command: "formatBlock", value: "blockquote", label: "Quote" },
] as const;

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your note...",
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalUpdate = useRef(false);

  useEffect(() => {
    if (!editorRef.current || isInternalUpdate.current) return;
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (!editorRef.current) return;
    isInternalUpdate.current = true;
    const sanitized = sanitizeHtml(editorRef.current.innerHTML);
    onChange(sanitized);
    isInternalUpdate.current = false;
  }, [onChange]);

  const exec = (command: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, val);
    handleInput();
  };

  const insertLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) exec("createLink", url);
  };

  return (
    <div className={cn("overflow-hidden rounded-lg border border-neutral-200 bg-white", className)}>
      <div className="flex flex-wrap items-center gap-0.5 border-b border-neutral-200 bg-neutral-50 p-1.5">
        {toolbarItems.map(({ icon: Icon, command, label, ...rest }) => (
          <Button
            key={label}
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title={label}
            onClick={() => exec(command, "value" in rest ? rest.value : undefined)}
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          title="Insert link"
          onClick={insertLink}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        onInput={handleInput}
        className={cn(
          "min-h-[120px] max-h-[300px] overflow-y-auto px-4 py-3 text-sm leading-relaxed outline-none",
          "empty:before:pointer-events-none empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]",
          "[&_h3]:mb-1 [&_h3]:mt-2 [&_h3]:text-base [&_h3]:font-semibold",
          "[&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-muted-foreground",
          "[&_ul]:ml-4 [&_ul]:list-disc [&_ol]:ml-4 [&_ol]:list-decimal",
          "[&_a]:text-primary [&_a]:underline"
        )}
        suppressContentEditableWarning
      />
    </div>
  );
}
