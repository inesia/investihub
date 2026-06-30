import type { CaseStatus, Role } from "@prisma/client";

export type { CaseStatus, Role };

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  companyName?: string;
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

export const STATUS_BADGE_STYLES: Record<CaseStatus, string> = {
  NEW: "bg-red-50 text-red-700 border-red-200",
  VERIFICATION: "bg-red-100 text-red-800 border-red-300",
  FIELD: "bg-red-50 text-red-900 border-red-400",
  REPORTING: "bg-red-100 text-red-600 border-red-200",
  SUBMITTED: "bg-red-200 text-red-900 border-red-400",
  CLOSED: "bg-neutral-100 text-neutral-600 border-neutral-300",
};

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Administrator",
  INVESTIGATOR: "Investigator",
  CLIENT: "Client",
};
