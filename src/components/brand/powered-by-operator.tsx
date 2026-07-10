"use client";

import { cn } from "@/lib/utils";
import { OPERATOR } from "@/lib/branding";

interface PoweredByOperatorProps {
  /** Dark panel (sidebar / login hero) vs light form panel */
  inverted?: boolean;
  collapsed?: boolean;
  className?: string;
}

/**
 * Parent company mark — visible on every portal (InvestiHub, Allianz, Prudential).
 */
export function PoweredByOperator({
  inverted = false,
  collapsed = false,
  className,
}: PoweredByOperatorProps) {
  if (collapsed) {
    return (
      <div className={cn("flex justify-center py-1", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={OPERATOR.logoSrc}
          alt={OPERATOR.name}
          width={36}
          height={36}
          className="h-9 w-9 rounded-full object-cover ring-1 ring-white/20"
          title={`${OPERATOR.credit} ${OPERATOR.name}`}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-2.5 py-2",
        inverted ? "bg-white/10" : "border border-border bg-muted/40",
        className
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={OPERATOR.logoSrc}
        alt={OPERATOR.name}
        width={40}
        height={40}
        className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-black/10"
      />
      <div className="min-w-0 leading-tight">
        <p
          className={cn(
            "text-[10px] font-medium uppercase tracking-wider",
            inverted ? "text-white/55" : "text-muted-foreground"
          )}
        >
          {OPERATOR.credit}
        </p>
        <p
          className={cn(
            "truncate text-xs font-semibold",
            inverted ? "text-white/90" : "text-foreground"
          )}
        >
          {OPERATOR.shortName}
        </p>
      </div>
    </div>
  );
}
