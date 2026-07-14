import type { CaseWithRelations } from "@/types";
import type { CreateCaseInput } from "@/lib/validations/case";
import { mockCases } from "@/lib/mock-data";
import { mockClients } from "@/lib/search";

const STORAGE_KEY = "investihub-created-cases";

export const mockInvestigators = [
  { id: "inv-001", name: "Ahmad Rizki" },
  { id: "inv-002", name: "Maria Gunawan" },
];

interface StoredCase extends Omit<CaseWithRelations, "createdAt" | "updatedAt"> {
  createdAt: string;
  updatedAt: string;
}

function reviveCase(stored: StoredCase): CaseWithRelations {
  return {
    ...stored,
    createdAt: new Date(stored.createdAt),
    updatedAt: new Date(stored.updatedAt),
  };
}

const LEGACY_STATUS_MAP: Record<string, "NEW" | "ON_PROGRESS" | "CLOSED"> = {
  VERIFICATION: "ON_PROGRESS",
  FIELD: "ON_PROGRESS",
  REPORTING: "ON_PROGRESS",
  SUBMITTED: "ON_PROGRESS",
};

function loadStoredCases(): CaseWithRelations[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredCase[];
    return parsed.map((c) => {
      // Migrate old statuses to new 3-step system
      const migratedStatus = LEGACY_STATUS_MAP[c.status] ?? c.status;
      return reviveCase({ ...c, status: migratedStatus as StoredCase["status"] });
    });
  } catch {
    return [];
  }
}

function saveStoredCases(cases: CaseWithRelations[]) {
  if (typeof window === "undefined") return;
  const serialized: StoredCase[] = cases.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
}

export function getAllCases(): CaseWithRelations[] {
  return [...mockCases, ...loadStoredCases()];
}

export function getCaseById(id: string): CaseWithRelations | undefined {
  return getAllCases().find((c) => c.id === id);
}

export function createCase(input: CreateCaseInput): CaseWithRelations {
  const client = mockClients.find((c) => c.id === input.clientId);
  const assignee = input.assigneeId
    ? mockInvestigators.find((i) => i.id === input.assigneeId) ?? null
    : null;

  const now = new Date();
  const newCase: CaseWithRelations = {
    id: `case-${Date.now()}`,
    policyNumber: input.policyNumber.trim(),
    insuredName: input.insuredName.trim(),
    status: input.status,
    description: input.description?.trim() || null,
    createdAt: now,
    updatedAt: now,
    clientId: input.clientId,
    assigneeId: assignee?.id ?? null,
    client: {
      id: input.clientId,
      name: client?.name ?? "Unknown Client",
      companyName: client?.name ?? null,
    },
    assignee: assignee,
    city: input.city || null,
    scheduleInvestigator: input.scheduleInvestigator || null,
    documents: input.documents || [],
  };

  const stored = loadStoredCases();
  stored.push(newCase);
  saveStoredCases(stored);

  return newCase;
}

export function getCreatedCases(): CaseWithRelations[] {
  return loadStoredCases();
}
