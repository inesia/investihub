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
  city?: string | null;
  scheduleInvestigator?: string | null;
  documents?: CommentAttachment[] | null;
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
  { id: "NEW", title: "New Case", color: "bg-blue-400" },
  { id: "ON_PROGRESS", title: "On Progress", color: "bg-amber-400" },
  { id: "CLOSED", title: "Closed", color: "bg-neutral-400" },
];

export const STATUS_LABELS: Record<CaseStatus, string> = {
  NEW: "New Case",
  ON_PROGRESS: "On Progress",
  CLOSED: "Closed",
};

/** Theme-aware badges — use primary/accent tokens so Allianz blue theme applies */
export const STATUS_BADGE_STYLES: Record<CaseStatus, string> = {
  NEW: "bg-blue-50 text-blue-700 border-blue-200",
  ON_PROGRESS: "bg-amber-50 text-amber-700 border-amber-200",
  CLOSED: "bg-neutral-100 text-neutral-600 border-neutral-300",
};

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Administrator",
  INVESTIGATOR: "Investigator",
  CLIENT: "Klien",
};

/** Roles that may post notes & comments on a case */
export function canPostComments(role?: Role | string | null): boolean {
  return role === "CLIENT" || role === "INVESTIGATOR" || role === "ADMIN";
}

/** Roles that may create new cases */
export function canCreateCases(role?: Role | string | null): boolean {
  return role === "ADMIN" || role === "INVESTIGATOR";
}
