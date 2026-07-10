import type { CaseStatus, Role } from "@prisma/client";

export type { CaseStatus, Role };

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  companyName?: string;
  /** Links CLIENT users to mock client company (e.g. client-002 = Allianz, client-003 = Prudential) */
  clientId?: string;
  /** Tenant branding slug (e.g. "allianz" | "prudential") */
  tenantSlug?: string;
}

export interface CaseWithRelations {
  id: string;
  policyNumber: string;
  insuredName: string;
  status: CaseStatus;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  clientId: string;
  assigneeId: string | null;
  client: {
    id: string;
    name: string;
    companyName: string | null;
  };
  assignee: {
    id: string;
    name: string;
  } | null;
}

export interface ActivityLogWithAuthor {
  id: string;
  caseId: string;
  description: string;
  timestamp: Date;
  authorId: string;
  author: {
    id: string;
    name: string;
  };
}

export interface CommentAttachment {
  id: string;
  name: string;
  type: "image" | "video" | "file";
  url: string;
  size: number;
  mimeType: string;
}

export interface CommentWithAuthor {
  id: string;
  caseId: string;
  content: string;
  contentHtml?: string;
  attachments?: CommentAttachment[];
  createdAt: Date;
  authorId: string;
  author: {
    id: string;
    name: string;
    role: Role;
  };
}

export interface KanbanColumn {
  id: CaseStatus;
  title: string;
  color: string;
}

export const CASE_STATUS_COLUMNS: KanbanColumn[] = [
  { id: "NEW", title: "New", color: "bg-status-new" },
  { id: "VERIFICATION", title: "Verification", color: "bg-status-verification" },
  { id: "FIELD", title: "Field", color: "bg-status-field" },
  { id: "REPORTING", title: "Reporting", color: "bg-status-reporting" },
  { id: "SUBMITTED", title: "Submitted", color: "bg-status-submitted" },
  { id: "CLOSED", title: "Closed", color: "bg-status-closed" },
];

export const STATUS_LABELS: Record<CaseStatus, string> = {
  NEW: "New",
  VERIFICATION: "Verification",
  FIELD: "Field",
  REPORTING: "Reporting",
  SUBMITTED: "Submitted",
  CLOSED: "Closed",
};

/** Theme-aware badges — use primary/accent tokens so Allianz blue theme applies */
export const STATUS_BADGE_STYLES: Record<CaseStatus, string> = {
  NEW: "bg-accent text-primary border-primary/20",
  VERIFICATION: "bg-primary/10 text-primary border-primary/30",
  FIELD: "bg-accent text-foreground border-primary/40",
  REPORTING: "bg-primary/5 text-primary/80 border-primary/20",
  SUBMITTED: "bg-primary/15 text-primary border-primary/40",
  CLOSED: "bg-neutral-100 text-neutral-600 border-neutral-300",
};

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Administrator",
  INVESTIGATOR: "Investigator",
  CLIENT: "Client",
};

/** Roles that may post notes & comments on a case */
export function canPostComments(role?: Role | string | null): boolean {
  return role === "CLIENT" || role === "INVESTIGATOR" || role === "ADMIN";
}

/** Roles that may create new cases */
export function canCreateCases(role?: Role | string | null): boolean {
  return role === "ADMIN" || role === "INVESTIGATOR";
}
