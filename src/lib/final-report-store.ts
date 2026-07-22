export interface FinalReport {
  id: string;
  fileName: string;
  filePath: string;
  insuredName: string;
  clientName: string;
  clientId: string;
  size: string;
  uploadedAt: string;
}

const STORAGE_KEY = "investihub-final-reports-v1";

const defaultReports: FinalReport[] = [
  {
    id: "fr-001",
    fileName: "ARU - KIKI MEIVIRA - ALLIANZ - MAKASAR - CI.pdf",
    filePath: "/laporan-final/ARU -KIKI  MEIVIRA  -  ALLIANZ - MAKASAR - CI.pdf",
    insuredName: "Kiki Meivira",
    clientName: "PT Asuransi Jiwa Manulife Indonesia",
    clientId: "client-002",
    size: "8.0 MB",
    uploadedAt: "2026-03-20T14:30:00.000Z",
  },
];

export function getFinalReports(): FinalReport[] {
  if (typeof window === "undefined") return defaultReports;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultReports));
      return defaultReports;
    }
    return JSON.parse(raw);
  } catch {
    return defaultReports;
  }
}

export function saveFinalReports(reports: FinalReport[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

export function addFinalReport(report: Omit<FinalReport, "id" | "uploadedAt" | "size">, fileSize: string): FinalReport {
  const reports = getFinalReports();
  const newReport: FinalReport = {
    ...report,
    id: `fr-${Date.now()}`,
    size: fileSize,
    uploadedAt: new Date().toISOString(),
  };
  reports.push(newReport);
  saveFinalReports(reports);
  return newReport;
}

export function deleteFinalReport(id: string): void {
  const reports = getFinalReports();
  const filtered = reports.filter((r) => r.id !== id);
  saveFinalReports(filtered);
}
