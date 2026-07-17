import type { CaseWithRelations } from "@/types";
import type { CreateCaseInput } from "@/lib/validations/case";
import { mockClients } from "@/lib/search";

const STORAGE_KEY = "investihub-created-cases";

export const mockInvestigators = [
  { id: "inv-001", name: "Sigit Sartono" },
  { id: "inv-002", name: "Rudy Aru Rachman" },
  { id: "inv-003", name: "Triyani Firdaus" },
  { id: "inv-004", name: "Wahyu Noviansyah" },
  { id: "inv-005", name: "Akbar Ramadhan" },
  { id: "inv-006", name: "Encep Supriadi" },
  { id: "inv-007", name: "Prana Ramadhan" },
  { id: "inv-008", name: "Anwim Yanma Aji" },
  { id: "inv-009", name: "Heru Adelisbowo" },
  { id: "inv-010", name: "Rd. Teja Bagjasumirat Natakusumah" },
  { id: "inv-011", name: "Rizky Adhyatma" },
  { id: "inv-012", name: "Rahmad Fadhil" },
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
    if (!raw) {
      const now = new Date();
      const defaultCI: CaseWithRelations = {
        id: "case-ci-001",
        policyNumber: "POL-000099887766",
        insuredName: "Desi Ratnasari",
        status: "NEW",
        description: "Investigasi klaim penyakit kritis (Critical Illness - Kanker Payudara) tertanggung di wilayah Kota Makassar dan sekitarnya.",
        createdAt: now,
        updatedAt: now,
        clientId: "client-002", // Allianz
        assigneeId: "inv-001", // Sigit Sartono
        client: {
          id: "client-002",
          name: "PT Allianz Indonesia",
          companyName: "PT Allianz Indonesia",
        },
        assignee: {
          id: "inv-001",
          name: "Sigit Sartono",
        },
        city: "Makassar, Sulawesi Selatan",
        scheduleInvestigator: "2026-03-15T09:00",
        documents: [
          {
            id: "doc-spaj-demo",
            name: "SPAJ_ANONYMIZED.pdf",
            type: "file",
            url: "#",
            size: 154000,
            mimeType: "application/pdf"
          }
        ],
        claimType: "Critical Illness",
        policyHolder: "Desi Ratnasari",
        applicationDate: "12 -Oktober 2024",
        activeDate: "15 -Oktober 2024",
        basicCoverage: "Rp 1.500.000.000.-",
        wop: "Rp 25.000.000,-",
        flexiCi: "Rp 0",
        addb: "Rp 0",
        premium: "Rp 25.000.000,-",
        policyAge: "± 1 Tahun 2 Bulan",
        beneficiary: "BUDI SANTOSO - Suami",
        treatmentDate: "15 -01 - 2026",
        treatmentPlace: "Hospital Medika Utama / Dr. Herman Susilo",
        diagnosis: "Benjolan payudara kanan, Kanker Payudara Stadium II",
        agentName: "SANTI",
        addressKtp: "Jl. Sudirman No. 45, RT 002 / RW 004, Mariso, Makassar, Sulawesi Selatan (KTP)",
        addressSpaj: "Jl. H. Bau No. 12, Makassar (SPAJ Alamat Tinggal)",
        investigationTargets: [
          "Memastikan kebenaran data Identitas Tertanggung dan data Polis",
          "Memastikan kebenaran Pengajuan data klaim Critical Illness",
          "Melakukan penelusuran riwayat medis Tertanggung sebelumnya"
        ],
        documentChecklist: [
          "SPAJ",
          "Formulir pengajuan Klaim Penyakit Kritis",
          "Surat Keterangan asli dari dokter Spesialis",
          "KTP Tertanggung",
          "Foto Copy Surat Kuasa Pelepasan Medis",
          "Hasil Laboratorium"
        ],
      };
      saveStoredCases([defaultCI]);
      return [defaultCI];
    }
    const parsed = JSON.parse(raw) as StoredCase[];
    const loaded = parsed.map((c) => {
      const migratedStatus = LEGACY_STATUS_MAP[c.status] ?? c.status;
      return reviveCase({ ...c, status: migratedStatus as StoredCase["status"] });
    });
    
    // Check if the default CI case is already in the loaded array, if not, prepend it
    if (!loaded.some((c) => c.id === "case-ci-001")) {
      const now = new Date();
      const defaultCI: CaseWithRelations = {
        id: "case-ci-001",
        policyNumber: "POL-000099887766",
        insuredName: "Desi Ratnasari",
        status: "NEW",
        description: "Investigasi klaim penyakit kritis (Critical Illness - Kanker Payudara) tertanggung di wilayah Kota Makassar.",
        createdAt: now,
        updatedAt: now,
        clientId: "client-002", // Allianz
        assigneeId: "inv-001", // Sigit Sartono
        client: {
          id: "client-002",
          name: "PT Allianz Indonesia",
          companyName: "PT Allianz Indonesia",
        },
        assignee: {
          id: "inv-001",
          name: "Sigit Sartono",
        },
        city: "Makassar, Sulawesi Selatan",
        scheduleInvestigator: "2026-03-15T09:00",
        documents: [
          {
            id: "doc-spaj-demo",
            name: "SPAJ_ANONYMIZED.pdf",
            type: "file",
            url: "#",
            size: 154000,
            mimeType: "application/pdf"
          }
        ],
        claimType: "Critical Illness",
        policyHolder: "Desi Ratnasari",
        applicationDate: "12 -Oktober 2024",
        activeDate: "15 -Oktober 2024",
        basicCoverage: "Rp 1.500.000.000.-",
        wop: "Rp 25.000.000,-",
        flexiCi: "Rp 0",
        addb: "Rp 0",
        premium: "Rp 25.000.000,-",
        policyAge: "± 1 Tahun 2 Bulan",
        beneficiary: "BUDI SANTOSO - Suami",
        treatmentDate: "15 -01 - 2026",
        treatmentPlace: "Hospital Medika Utama / Dr. Herman Susilo",
        diagnosis: "Benjolan payudara kanan, Kanker Payudara Stadium II",
        agentName: "SANTI",
        addressKtp: "Jl. Sudirman No. 45, RT 002 / RW 004, Mariso, Makassar, Sulawesi Selatan (KTP)",
        addressSpaj: "Jl. H. Bau No. 12, Makassar (SPAJ Alamat Tinggal)",
        investigationTargets: [
          "Memastikan kebenaran data Identitas Tertanggung dan data Polis",
          "Memastikan kebenaran Pengajuan data klaim Critical Illness",
          "Melakukan penelusuran riwayat medis Tertanggung sebelumnya"
        ],
        documentChecklist: [
          "SPAJ",
          "Formulir pengajuan Klaim Penyakit Kritis",
          "Surat Keterangan asli dari dokter Spesialis",
          "KTP Tertanggung",
          "Foto Copy Surat Kuasa Pelepasan Medis",
          "Hasil Laboratorium"
        ],
      };
      const updated = [defaultCI, ...loaded];
      saveStoredCases(updated);
      return updated;
    }
    
    return loaded;
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
  return loadStoredCases();
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
    
    // Custom Claim Form Fields
    claimType: input.claimType || null,
    policyHolder: input.policyHolder || null,
    applicationDate: input.applicationDate || null,
    activeDate: input.activeDate || null,
    basicCoverage: input.basicCoverage || null,
    wop: input.wop || null,
    flexiCi: input.flexiCi || null,
    addb: input.addb || null,
    premium: input.premium || null,
    policyAge: input.policyAge || null,
    beneficiary: input.beneficiary || null,
    treatmentDate: input.treatmentDate || null,
    treatmentPlace: input.treatmentPlace || null,
    diagnosis: input.diagnosis || null,
    agentName: input.agentName || null,
    addressKtp: input.addressKtp || null,
    addressSpaj: input.addressSpaj || null,
    investigationTargets: input.investigationTargets || [],
    documentChecklist: input.documentChecklist || [],
  };

  const stored = loadStoredCases();
  stored.push(newCase);
  saveStoredCases(stored);

  return newCase;
}

export function getCreatedCases(): CaseWithRelations[] {
  return loadStoredCases();
}

export function updateCase(id: string, updates: Partial<CaseWithRelations>): CaseWithRelations | undefined {
  const cases = loadStoredCases();
  const caseIndex = cases.findIndex((c) => c.id === id);
  if (caseIndex === -1) return undefined;
  
  const updatedCase = {
    ...cases[caseIndex],
    ...updates,
    updatedAt: new Date(),
  };
  
  cases[caseIndex] = updatedCase;
  saveStoredCases(cases);
  
  return updatedCase;
}
