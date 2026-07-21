import type { CaseWithRelations } from "@/types";
import type { CreateCaseInput } from "@/lib/validations/case";
import { getClients } from "@/lib/client-store";

const STORAGE_KEY = "investihub-created-cases-v2";

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
    const now = new Date();
    
    // Define the updated dummy case matching the screenshots (anonymized)
    const defaultCI: CaseWithRelations = {
      id: "case-ci-001",
      policyNumber: "POL-000080509999",
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
        },
        {
          id: "doc-dukcapil-demo",
          name: "Verifikasi_Dukcapil_Anonymized.png",
          type: "image",
          url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="800" height="400"><rect width="100%" height="100%" fill="%23f4f6f8"/><rect width="100%" height="45" fill="%231b5e20"/><text x="20" y="28" font-family="monospace" font-size="16" font-weight="bold" fill="%23ffffff">SISTEM INFORMASI DATA KEPENDUDUKAN (DUKCAPIL)</text><rect x="20" y="65" width="760" height="315" fill="%23ffffff" stroke="%23e0e0e0" stroke-width="1" rx="4"/><rect x="20" y="65" width="760" height="30" fill="%232e7d32" rx="4"/><text x="35" y="85" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23ffffff">DATA KELUARGA &amp; INDIVIDU (TERVERIFIKASI)</text><text x="35" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">No. Kartu Keluarga</text><text x="180" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23111111">: 737103301197xxxx (Disamarkan)</text><text x="420" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">Nama Kepala Keluarga</text><text x="580" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23111111">: BUDI SANTOSO</text><text x="35" y="155" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">Alamat Keluarga</text><text x="180" y="155" font-family="sans-serif" font-size="11" fill="%23111111">: JL. MONGINSIDI NO. 106</text><text x="420" y="155" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">No. RT / RW</text><text x="580" y="155" font-family="sans-serif" font-size="11" fill="%23111111">: 001 / 005</text><line x1="20" y1="185" x2="780" y2="185" stroke="%23e0e0e0" stroke-width="1"/><text x="35" y="215" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">NIK Tertanggung</text><text x="180" y="215" font-family="sans-serif" font-size="11" font-weight="bold" fill="%231b5e20">: 737103700580xxxx (Valid)</text><text x="420" y="215" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">Nama Lengkap</text><text x="580" y="215" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23111111">: DESI RATNASARI</text><text x="35" y="245" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">Jenis Kelamin</text><text x="180" y="245" font-family="sans-serif" font-size="11" fill="%23111111">: PEREMPUAN</text><text x="420" y="245" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">Tempat / Tgl Lahir</text><text x="580" y="245" font-family="sans-serif" font-size="11" fill="%23111111">: BANDUNG, 30-05-1980</text><rect x="35" y="280" width="730" height="50" fill="%23e8f5e9" stroke="%23c8e6c9" stroke-width="1" rx="4"/><circle cx="60" cy="305" r="10" fill="%232e7d32"/><path d="M 55 305 L 59 308 L 65 301" fill="none" stroke="%23ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><text x="85" y="310" font-family="sans-serif" font-size="13" font-weight="bold" fill="%232e7d32">NIK KTP Tertanggung Valid di Data Dukcapil (Terverifikasi)</text></svg>`,
          size: 218000,
          mimeType: "image/png",
          caption: "Hasil Verifikasi Data Dukcapil Tertanggung"
        },
        {
          id: "doc-bpjs-demo",
          name: "Hasil_Penelusuran_BPJS_Anonymized.png",
          type: "image",
          url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="800" height="400"><rect width="100%" height="100%" fill="%23f4f6f8"/><rect width="100%" height="45" fill="%2301579b"/><text x="20" y="28" font-family="sans-serif" font-size="15" font-weight="bold" fill="%23ffffff">BPJS Kesehatan - Primary Care (Pencarian Pasien)</text><rect x="20" y="65" width="760" height="315" fill="%23ffffff" stroke="%23e0e0e0" stroke-width="1" rx="4"/><rect x="20" y="65" width="760" height="30" fill="%230288d1" rx="4"/><text x="35" y="85" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23ffffff">Informasi Kepesertaan &amp; Kunjungan</text><text x="35" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">No. Kartu BPJS</text><text x="180" y="125" font-family="sans-serif" font-size="11" fill="%23111111">: 000133923xxxx</text><text x="420" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">Nama Peserta</text><text x="580" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23111111">: DESI RATNASARI</text><text x="35" y="155" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">Faskes Tingkat I</text><text x="180" y="155" font-family="sans-serif" font-size="11" fill="%23111111">: Klinik Pratama dr. A. S. Hamdany</text><text x="420" y="155" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">Status Kepesertaan</text><text x="580" y="155" font-family="sans-serif" font-size="11" font-weight="bold" fill="%232e7d32">: AKTIF</text><line x1="20" y1="185" x2="780" y2="185" stroke="%23e0e0e0" stroke-width="1"/><rect x="35" y="200" width="730" height="120" fill="%23fff9c4" stroke="%23fff59d" stroke-width="1" rx="4"/><text x="50" y="225" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23f57f17">RIWAYAT PELAYANAN / KUNJUNGAN:</text><text x="50" y="255" font-family="sans-serif" font-size="11" fill="%23333333">Total Kunjungan: 0 Kali</text><text x="50" y="275" font-family="sans-serif" font-size="11" fill="%23333333">Diagnosa Terakhir: -</text><text x="50" y="295" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23f57f17">Kesimpulan: Tertanggung tidak pernah berobat menggunakan fasilitas BPJS</text><rect x="35" y="335" width="730" height="35" fill="%23e8f5e9" stroke="%23c8e6c9" stroke-width="1" rx="4"/><text x="50" y="357" font-family="sans-serif" font-size="11" font-weight="bold" fill="%232e7d32">Status Verifikasi Sistem: Riwayat Bersih (Tidak Ditemukan Indikasi Pre-existing Condition)</text></svg>`,
          size: 185000,
          mimeType: "image/png",
          caption: "Tangkapan Layar Primary Care BPJS - Tidak Pernah Berobat"
        },
        {
          id: "doc-faskes-demo",
          name: "Foto_Klinik_Pratama_Anna_Hamdany.jpg",
          type: "image",
          url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="800" height="400"><rect width="100%" height="100%" fill="%23f4f6f8"/><rect width="100%" height="45" fill="%2337474f"/><text x="20" y="28" font-family="sans-serif" font-size="15" font-weight="bold" fill="%23ffffff">Laporan Foto Kunjungan Faskes BPJS</text><rect x="20" y="65" width="370" height="305" fill="%23ffffff" stroke="%23e0e0e0" stroke-width="1" rx="4"/><rect x="410" y="65" width="370" height="305" fill="%23ffffff" stroke="%23e0e0e0" stroke-width="1" rx="4"/><rect x="30" y="75" width="350" height="180" fill="%23eceff1" rx="4"/><text x="205" y="170" font-family="sans-serif" font-size="12" fill="%2378909c" text-anchor="middle">[ Foto Klinik Pratama dr. A. S. Hamdany ]</text><text x="35" y="280" font-family="sans-serif" font-size="11" font-weight="bold" fill="%2337474f">Fasilitas Kesehatan Tingkat I</text><text x="35" y="300" font-family="sans-serif" font-size="11" fill="%23555555">Klinik Pratama dr. A. S. Hamdany</text><text x="35" y="320" font-family="sans-width" font-size="10" fill="%23777777">Jl. W. R. Monginsidi No. 57B, Makassar</text><rect x="420" y="75" width="350" height="180" fill="%23eceff1" rx="4"/><text x="595" y="170" font-family="sans-serif" font-size="12" fill="%2378909c" text-anchor="middle">[ Foto Pengecekan Rekam Medis (RM) ]</text><text x="425" y="280" font-family="sans-serif" font-size="11" font-weight="bold" fill="%2337474f">Bagian Rekam Medis (RM)</text><text x="425" y="300" font-family="sans-serif" font-size="11" fill="%23555555">Petugas melakukan konfirmasi rekam medis</text><text x="425" y="320" font-family="sans-width" font-size="10" font-weight="bold" fill="%23d32f2f">Hasil: Tertanggung tidak terdaftar dalam catatan berobat umum/BPJS</text></svg>`,
          size: 312000,
          mimeType: "image/jpeg",
          caption: "Foto Kunjungan Lapangan Klinik Pratama dr. A. S. Hamdany"
        },
        {
          id: "doc-getcontact-demo",
          name: "Hasil_Pencarian_GetContact_Anonymized.png",
          type: "image",
          url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="800" height="400"><rect width="100%" height="100%" fill="%23f4f6f8"/><rect width="100%" height="45" fill="%230d47a1"/><text x="20" y="28" font-family="sans-serif" font-size="15" font-weight="bold" fill="%23ffffff">Get Contact - Verifikasi Nomor Telepon</text><rect x="20" y="65" width="760" height="315" fill="%23ffffff" stroke="%23e0e0e0" stroke-width="1" rx="4"/><circle cx="400" cy="140" r="40" fill="%23bbdefb"/><text x="400" y="148" font-family="sans-serif" font-size="24" font-weight="bold" fill="%230d47a1" text-anchor="middle">D</text><text x="400" y="210" font-family="sans-serif" font-size="18" font-weight="bold" fill="%23111111" text-anchor="middle">Desi</text><text x="400" y="235" font-family="sans-serif" font-size="13" fill="%23555555" text-anchor="middle">+62 851-0072-xxxx</text><rect x="250" y="260" width="300" height="40" fill="%23e3f2fd" stroke="%2390caf9" stroke-width="1" rx="20"/><text x="400" y="285" font-family="sans-serif" font-size="12" font-weight="bold" fill="%230d47a1" text-anchor="middle">200+ Tag Terkait (Valid)</text><text x="400" y="330" font-family="sans-serif" font-size="11" fill="%23777777" text-anchor="middle">Penelusuran nomor telepon mengonfirmasi kepemilikan oleh tertanggung.</text></svg>`,
          size: 95000,
          mimeType: "image/png",
          caption: "Pencarian Nomor Telepon Tertanggung di Get Contact"
        }
      ],
      claimType: "Critical Illness",
      policyHolder: "Desi Ratnasari",
      applicationDate: "13 -Juli 2024",
      activeDate: "-",
      basicCoverage: "Rp 2.000.000.000.-",
      wop: "Rp 34.300.000,-",
      flexiCi: "Rp 0",
      addb: "Rp 0",
      premium: "Rp 34.300.000,-",
      policyAge: "± 7 Bulan 1 hari",
      beneficiary: "ALDI TOMMY - Adik",
      treatmentDate: "09 -02 - 2026",
      treatmentPlace: "Hospital Picasso / Dr. Yi Cheng Har",
      diagnosis: "Benjolan payudara 1week, Kanker Payudara kiri stg I",
      agentName: "DESTY",
      addressKtp: "Jl. Monginsidi No. 106, RT 001 / RW 005, Maricaya, Makassar, Sulawesi Selatan (KTP)",
      addressSpaj: "Jl. Gunung Lompobattang No. 21, Makassar (SPAJ Alamat tempat Usaha)",
      investigationTargets: [
        "Memastikan kebenaran data Identitas Tertanggung dan data Polis",
        "Memastikan kebenaran Pengajuan data klaim Critical Illness",
        "Melakukan penelusuran riwayat medis Tertanggung sebelumnya"
      ],
      documentChecklist: [
        "SPAJ 000080509999",
        "Formulir pengajuan Klaim Penyakit Kritis",
        "Surat Keterangan asli dari dokter Spesialis",
        "KTP Tertanggung",
        "Foto Copy Surat Kuasa Pelepasan Medis",
        "Surat kuasa pendebatan",
        "Pernyataan Agent",
        "Hasil Laboratorium dari Hospital Picasso"
      ],
    };

    // 1. New Case (Rian Hidayat)
    const caseNew: CaseWithRelations = {
      id: "case-demo-new",
      policyNumber: "POL-000012345678",
      insuredName: "Rian Hidayat",
      status: "NEW",
      description: "Investigasi klaim penyakit kritis (Kanker Paru-Paru) tertanggung di wilayah Bandung dan sekitarnya.",
      createdAt: now,
      updatedAt: now,
      clientId: "client-003", // Prudential
      assigneeId: "inv-002", // Rudy Aru Rachman
      client: {
        id: "client-003",
        name: "PT Prudential Life Assurance",
        companyName: "PT Prudential Life Assurance",
      },
      assignee: {
        id: "inv-002",
        name: "Rudy Aru Rachman",
      },
      city: "Bandung, Jawa Barat",
      scheduleInvestigator: "2026-04-01T10:00",
      documents: [
        {
          id: "doc-spaj-rian",
          name: "SPAJ_Rian_Hidayat_Anonymized.pdf",
          type: "file",
          url: "#",
          size: 148000,
          mimeType: "application/pdf"
        },
        {
          id: "doc-dukcapil-rian",
          name: "Verifikasi_Dukcapil_Rian.png",
          type: "image",
          url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="800" height="400"><rect width="100%" height="100%" fill="%23f4f6f8"/><rect width="100%" height="45" fill="%231b5e20"/><text x="20" y="28" font-family="monospace" font-size="16" font-weight="bold" fill="%23ffffff">SISTEM INFORMASI DATA KEPENDUDUKAN (DUKCAPIL)</text><rect x="20" y="65" width="760" height="315" fill="%23ffffff" stroke="%23e0e0e0" stroke-width="1" rx="4"/><rect x="20" y="65" width="760" height="30" fill="%232e7d32" rx="4"/><text x="35" y="85" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23ffffff">DATA KELUARGA &amp; INDIVIDU (TERVERIFIKASI)</text><text x="35" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">No. Kartu Keluarga</text><text x="180" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23111111">: 327304220998xxxx (Disamarkan)</text><text x="420" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">Nama Kepala Keluarga</text><text x="580" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23111111">: RIAN HIDAYAT</text><line x1="20" y1="185" x2="780" y2="185" stroke="%23e0e0e0" stroke-width="1"/><text x="35" y="215" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">NIK Tertanggung</text><text x="180" y="215" font-family="sans-serif" font-size="11" font-weight="bold" fill="%231b5e20">: 327304150882xxxx (Valid)</text><text x="420" y="215" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">Nama Lengkap</text><text x="580" y="215" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23111111">: RIAN HIDAYAT</text><rect x="35" y="280" width="730" height="50" fill="%23e8f5e9" stroke="%23c8e6c9" stroke-width="1" rx="4"/><text x="85" y="310" font-family="sans-serif" font-size="13" font-weight="bold" fill="%232e7d32">NIK KTP Rian Hidayat Terverifikasi Valid (Dukcapil Bandung)</text></svg>`,
          size: 205000,
          mimeType: "image/png",
          caption: "Hasil Verifikasi Data Dukcapil Rian Hidayat"
        },
        {
          id: "doc-bpjs-rian",
          name: "Hasil_BPJS_Rian_Anonymized.png",
          type: "image",
          url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="800" height="400"><rect width="100%" height="100%" fill="%23f4f6f8"/><rect width="100%" height="45" fill="%2301579b"/><text x="20" y="28" font-family="sans-serif" font-size="15" font-weight="bold" fill="%23ffffff">BPJS Kesehatan - Primary Care (Rian Hidayat)</text><rect x="20" y="65" width="760" height="315" fill="%23ffffff" stroke="%23e0e0e0" stroke-width="1" rx="4"/><rect x="20" y="65" width="760" height="30" fill="%230288d1" rx="4"/><text x="35" y="85" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23ffffff">Riwayat Kunjungan Faskes</text><text x="35" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">Nama Peserta</text><text x="180" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23111111">: RIAN HIDAYAT</text><line x1="20" y1="185" x2="780" y2="185" stroke="%23e0e0e0" stroke-width="1"/><rect x="35" y="200" width="730" height="120" fill="%23fff9c4" stroke="%23fff59d" stroke-width="1" rx="4"/><text x="50" y="225" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23f57f17">RIWAYAT PELAYANAN:</text><text x="50" y="255" font-family="sans-serif" font-size="11" fill="%23333333">Total Kunjungan: 0 Kali</text><text x="50" y="295" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23f57f17">Kesimpulan: Riwayat BPJS bersih dari indikasi pre-existing condition</text></svg>`,
          size: 175000,
          mimeType: "image/png",
          caption: "BPJS Primary Care Rian Hidayat - Bersih"
        }
      ],
      claimType: "Critical Illness",
      policyHolder: "Rian Hidayat",
      applicationDate: "22 -September 2024",
      activeDate: "-",
      basicCoverage: "Rp 1.500.000.000,-",
      wop: "Rp 25.000.000,-",
      flexiCi: "Rp 0",
      addb: "Rp 0",
      premium: "Rp 25.000.000,-",
      policyAge: "± 6 Bulan 2 hari",
      beneficiary: "SITI AMINAH - Ibu",
      treatmentDate: "15 -03 - 2026",
      treatmentPlace: "Santosa Hospital Bandung / Dr. Haryanto",
      diagnosis: "Massa di paru-paru kiri suspect maligna, Kanker Paru Stadium II",
      agentName: "BUDI",
      addressKtp: "Jl. Pajajaran No. 45, RT 002 / RW 004, Cicendo, Bandung, Jawa Barat (KTP)",
      addressSpaj: "Jl. Dago No. 120, Bandung (SPAJ Alamat tempat Usaha)",
      investigationTargets: [
        "Memastikan kebenaran data Identitas Tertanggung dan data Polis",
        "Memastikan kebenaran Pengajuan data klaim Critical Illness Kanker Paru",
        "Melakukan penelusuran riwayat medis Tertanggung di Rumah Sakit Paru Bandung"
      ],
      documentChecklist: [
        "SPAJ 000012345678",
        "Formulir pengajuan Klaim Penyakit Kritis",
        "Surat Keterangan asli dari Dokter Spesialis Paru",
        "KTP Tertanggung",
        "Foto Copy Surat Kuasa Pelepasan Medis",
        "Hasil Rontgen Thorax dan CT-Scan"
      ],
    };

    // 2. Closed Case (Lilis Kartika)
    const caseClosed: CaseWithRelations = {
      id: "case-demo-closed",
      policyNumber: "POL-000098765432",
      insuredName: "Lilis Kartika",
      status: "CLOSED",
      description: "Investigasi klaim penyakit kritis (Stroke) tertanggung di wilayah Surabaya.",
      createdAt: now,
      updatedAt: now,
      clientId: "client-002", // Allianz
      assigneeId: "inv-003", // Triyani Firdaus
      client: {
        id: "client-002",
        name: "PT Allianz Indonesia",
        companyName: "PT Allianz Indonesia",
      },
      assignee: {
        id: "inv-003",
        name: "Triyani Firdaus",
      },
      city: "Surabaya, Jawa Timur",
      scheduleInvestigator: "2026-02-10T08:30",
      documents: [
        {
          id: "doc-spaj-lilis",
          name: "SPAJ_Lilis_Kartika_Anonymized.pdf",
          type: "file",
          url: "#",
          size: 142000,
          mimeType: "application/pdf"
        },
        {
          id: "doc-dukcapil-lilis",
          name: "Verifikasi_Dukcapil_Lilis.png",
          type: "image",
          url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="800" height="400"><rect width="100%" height="100%" fill="%23f4f6f8"/><rect width="100%" height="45" fill="%231b5e20"/><text x="20" y="28" font-family="monospace" font-size="16" font-weight="bold" fill="%23ffffff">SISTEM INFORMASI DATA KEPENDUDUKAN (DUKCAPIL)</text><rect x="20" y="65" width="760" height="315" fill="%23ffffff" stroke="%23e0e0e0" stroke-width="1" rx="4"/><rect x="20" y="65" width="760" height="30" fill="%232e7d32" rx="4"/><text x="35" y="85" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23ffffff">DATA KELUARGA &amp; INDIVIDU (TERVERIFIKASI)</text><text x="35" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">No. Kartu Keluarga</text><text x="180" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23111111">: 357801041199xxxx (Disamarkan)</text><text x="420" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">Nama Kepala Keluarga</text><text x="580" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23111111">: HERI SETIAWAN</text><line x1="20" y1="185" x2="780" y2="185" stroke="%23e0e0e0" stroke-width="1"/><text x="35" y="215" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">NIK Tertanggung</text><text x="180" y="215" font-family="sans-serif" font-size="11" font-weight="bold" fill="%231b5e20">: 357805120680xxxx (Valid)</text><text x="420" y="215" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">Nama Lengkap</text><text x="580" y="215" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23111111">: LILIS KARTIKA</text><rect x="35" y="280" width="730" height="50" fill="%23e8f5e9" stroke="%23c8e6c9" stroke-width="1" rx="4"/><text x="85" y="310" font-family="sans-serif" font-size="13" font-weight="bold" fill="%232e7d32">NIK KTP Lilis Kartika Valid di Data Dukcapil Surabaya (Terverifikasi)</text></svg>`,
          size: 210000,
          mimeType: "image/png",
          caption: "Hasil Verifikasi Data Dukcapil Lilis Kartika"
        },
        {
          id: "doc-mri-lilis",
          name: "Hasil_MRI_Lilis_Anonymized.png",
          type: "image",
          url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="800" height="400"><rect width="100%" height="100%" fill="%23f4f6f8"/><rect width="100%" height="45" fill="%2301579b"/><text x="20" y="28" font-family="sans-serif" font-size="15" font-weight="bold" fill="%23ffffff">RS Siloam Surabaya - Laporan Hasil MRI Kepala</text><rect x="20" y="65" width="760" height="315" fill="%23ffffff" stroke="%23e0e0e0" stroke-width="1" rx="4"/><rect x="20" y="65" width="760" height="30" fill="%230288d1" rx="4"/><text x="35" y="85" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23ffffff">Hasil Pemeriksaan Radiologi</text><text x="35" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">Nama Pasien</text><text x="180" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23111111">: LILIS KARTIKA (45 Thn)</text><line x1="20" y1="185" x2="780" y2="185" stroke="%23e0e0e0" stroke-width="1"/><rect x="35" y="200" width="730" height="120" fill="%23fff9c4" stroke="%23fff59d" stroke-width="1" rx="4"/><text x="50" y="225" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23f57f17">TEMUAN MRI BRAIN:</text><text x="50" y="255" font-family="sans-serif" font-size="11" fill="%23333333">Tampak lesi hiperintens di daerah lobus temporoparietal kiri.</text><text x="50" y="275" font-family="sans-serif" font-size="11" fill="%23333333">Diagnosa: Infark Serebri Akut (Stroke Iskemik)</text><text x="50" y="295" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23f57f17">Kesimpulan: Penegakan diagnosis Stroke sesuai dengan kriteria klaim polis</text></svg>`,
          size: 195000,
          mimeType: "image/png",
          caption: "Hasil MRI Brain Lilis Kartika - Stroke Iskemik"
        },
        {
          id: "doc-faskes-lilis",
          name: "Foto_Kunjungan_Siloam_Surabaya.jpg",
          type: "image",
          url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="800" height="400"><rect width="100%" height="100%" fill="%23f4f6f8"/><rect width="100%" height="45" fill="%2337474f"/><text x="20" y="28" font-family="sans-serif" font-size="15" font-weight="bold" fill="%23ffffff">Laporan Foto Kunjungan Lapangan - RS Siloam Surabaya</text><rect x="20" y="65" width="370" height="305" fill="%23ffffff" stroke="%23e0e0e0" stroke-width="1" rx="4"/><rect x="410" y="65" width="370" height="305" fill="%23ffffff" stroke="%23e0e0e0" stroke-width="1" rx="4"/><rect x="30" y="75" width="350" height="180" fill="%23eceff1" rx="4"/><text x="205" y="170" font-family="sans-serif" font-size="12" fill="%2378909c" text-anchor="middle">[ Foto RS Siloam Surabaya ]</text><text x="35" y="280" font-family="sans-serif" font-size="11" font-weight="bold" fill="%2337474f">Fasilitas Kesehatan Rujukan</text><text x="35" y="300" font-family="sans-serif" font-size="11" fill="%23555555">RS Siloam Surabaya - Departemen Radiologi</text><text x="35" y="320" font-family="sans-serif" font-size="10" fill="%23777777">Jl. Raya Darmo No. 90, Surabaya</text><rect x="420" y="75" width="350" height="180" fill="%23eceff1" rx="4"/><text x="595" y="170" font-family="sans-serif" font-size="12" fill="%2378909c" text-anchor="middle">[ Konfirmasi Rekam Medis (RM) ]</text><text x="425" y="280" font-family="sans-serif" font-size="11" font-weight="bold" fill="%2337474f">Konfirmasi Data Medis</text><text x="425" y="300" font-family="sans-serif" font-size="11" fill="%23555555">Petugas mengonfirmasi keaslian laporan MRI</text><text x="425" y="320" font-family="sans-serif" font-size="10" font-weight="bold" fill="%232e7d32">Hasil: Diagnosa Stroke valid, bukan kondisi pre-existing</text></svg>`,
          size: 298000,
          mimeType: "image/jpeg",
          caption: "Foto Kunjungan Lapangan & Konfirmasi Rekam Medis di RS Siloam Surabaya"
        }
      ],
      claimType: "Critical Illness",
      policyHolder: "Lilis Kartika",
      applicationDate: "05 -Maret 2023",
      activeDate: "-",
      basicCoverage: "Rp 1.000.000.000,-",
      wop: "Rp 12.500.000,-",
      flexiCi: "Rp 0",
      addb: "Rp 0",
      premium: "Rp 12.500.000,-",
      policyAge: "± 2 Tahun 11 bulan",
      beneficiary: "HERI SETIAWAN - Suami",
      treatmentDate: "20 -01 - 2026",
      treatmentPlace: "RS Siloam Surabaya / Dr. Angela",
      diagnosis: "Stroke Iskemik, Kelemahan ekstremitas kanan",
      agentName: "ANI",
      addressKtp: "Jl. Raya Darmo No. 88, RT 003 / RW 002, Tegalsari, Surabaya, Jawa Timur (KTP)",
      addressSpaj: "Jl. Basuki Rahmat No. 15, Surabaya (SPAJ Alamat tempat Usaha)",
      investigationTargets: [
        "Memastikan kebenaran data Identitas Tertanggung dan data Polis",
        "Memastikan kebenaran Pengajuan data klaim Stroke",
        "Verifikasi riwayat kesehatan di Faskes Surabaya"
      ],
      documentChecklist: [
        "SPAJ 000098765432",
        "Formulir pengajuan Klaim Penyakit Kritis",
        "KTP Tertanggung",
        "Hasil MRI Kepala dari RS Siloam Surabaya"
      ],
    };

    // 3. Archived Case (Agus Subagja)
    const caseArchived: CaseWithRelations = {
      id: "case-demo-archived",
      policyNumber: "POL-000077778888",
      insuredName: "Agus Subagja",
      status: "ARCHIVED",
      description: "Investigasi klaim penyakit kritis (Serangan Jantung) tertanggung di wilayah Medan.",
      createdAt: now,
      updatedAt: now,
      clientId: "client-002", // Allianz
      assigneeId: "inv-004", // Wahyu Noviansyah
      client: {
        id: "client-002",
        name: "PT Allianz Indonesia",
        companyName: "PT Allianz Indonesia",
      },
      assignee: {
        id: "inv-004",
        name: "Wahyu Noviansyah",
      },
      city: "Medan, Sumatera Utara",
      scheduleInvestigator: "2025-11-20T09:00",
      documents: [
        {
          id: "doc-spaj-agus",
          name: "SPAJ_Agus_Subagja_Anonymized.pdf",
          type: "file",
          url: "#",
          size: 155000,
          mimeType: "application/pdf"
        },
        {
          id: "doc-dukcapil-agus",
          name: "Verifikasi_Dukcapil_Agus.png",
          type: "image",
          url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="800" height="400"><rect width="100%" height="100%" fill="%23f4f6f8"/><rect width="100%" height="45" fill="%231b5e20"/><text x="20" y="28" font-family="monospace" font-size="16" font-weight="bold" fill="%23ffffff">SISTEM INFORMASI DATA KEPENDUDUKAN (DUKCAPIL)</text><rect x="20" y="65" width="760" height="315" fill="%23ffffff" stroke="%23e0e0e0" stroke-width="1" rx="4"/><rect x="20" y="65" width="760" height="30" fill="%232e7d32" rx="4"/><text x="35" y="85" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23ffffff">DATA KELUARGA &amp; INDIVIDU (TERVERIFIKASI)</text><text x="35" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">No. Kartu Keluarga</text><text x="180" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23111111">: 127104300405xxxx (Disamarkan)</text><text x="420" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">Nama Kepala Keluarga</text><text x="580" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23111111">: AGUS SUBAGJA</text><line x1="20" y1="185" x2="780" y2="185" stroke="%23e0e0e0" stroke-width="1"/><text x="35" y="215" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">NIK Tertanggung</text><text x="180" y="215" font-family="sans-serif" font-size="11" font-weight="bold" fill="%231b5e20">: 127104250275xxxx (Valid)</text><text x="420" y="215" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">Nama Lengkap</text><text x="580" y="215" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23111111">: AGUS SUBAGJA</text><rect x="35" y="280" width="730" height="50" fill="%23e8f5e9" stroke="%23c8e6c9" stroke-width="1" rx="4"/><text x="85" y="310" font-family="sans-serif" font-size="13" font-weight="bold" fill="%232e7d32">NIK KTP Agus Subagja Valid di Data Dukcapil Medan (Terverifikasi)</text></svg>`,
          size: 202000,
          mimeType: "image/png",
          caption: "Hasil Verifikasi Data Dukcapil Agus Subagja"
        },
        {
          id: "doc-ecg-agus",
          name: "Hasil_EKG_Agus_Subagja_Anonymized.png",
          type: "image",
          url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="800" height="400"><rect width="100%" height="100%" fill="%23f4f6f8"/><rect width="100%" height="45" fill="%23c62828"/><text x="20" y="28" font-family="sans-serif" font-size="15" font-weight="bold" fill="%23ffffff">RS Columbia Asia Medan - Rekaman EKG &amp; Troponin Test</text><rect x="20" y="65" width="760" height="315" fill="%23ffffff" stroke="%23e0e0e0" stroke-width="1" rx="4"/><rect x="20" y="65" width="760" height="30" fill="%23d32f2f" rx="4"/><text x="35" y="85" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23ffffff">Elektrokardiogram (ECG) Laporan Klinis</text><text x="35" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">Nama Pasien</text><text x="180" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23111111">: AGUS SUBAGJA (51 Thn)</text><line x1="20" y1="185" x2="780" y2="185" stroke="%23e0e0e0" stroke-width="1"/><rect x="35" y="200" width="730" height="120" fill="%23ffebee" stroke="%23ffcdd2" stroke-width="1" rx="4"/><text x="50" y="225" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23c62828">TEMUAN EKG &amp; ENZIM JANTUNG:</text><text x="50" y="255" font-family="sans-serif" font-size="11" fill="%23333333">EKG menunjukkan elevasi segmen ST yang signifikan pada lead V1-V4 (STEMI anteroseptal).</text><text x="50" y="275" font-family="sans-serif" font-size="11" fill="%23333333">Kadar Troponin T: 2.5 ng/mL (Meningkat tinggi, normal &lt;0.01 ng/mL).</text><text x="50" y="295" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23c62828">Kesimpulan: Hasil EKG dan Troponin valid mengonfirmasi Serangan Jantung Akut</text></svg>`,
          size: 198000,
          mimeType: "image/png",
          caption: "Grafik EKG & Hasil Troponin Agus Subagja - Positif AMI"
        }
      ],
      claimType: "Critical Illness",
      policyHolder: "Agus Subagja",
      applicationDate: "15 -Mei 2022",
      activeDate: "-",
      basicCoverage: "Rp 3.000.000.000,-",
      wop: "Rp 50.000.000,-",
      flexiCi: "Rp 0",
      addb: "Rp 0",
      premium: "Rp 50.000.000,-",
      policyAge: "± 3 Tahun",
      beneficiary: "DEWI RATNA - Istri",
      treatmentDate: "10 -10 - 2025",
      treatmentPlace: "RS Columbia Asia Medan / Dr. Sitompul",
      diagnosis: "Acute Myocardial Infarction (AMI)",
      agentName: "JONNY",
      addressKtp: "Jl. S. Parman No. 12, Medan, Sumatera Utara (KTP)",
      addressSpaj: "Jl. Gajah Mada No. 44, Medan (SPAJ Alamat Kantor)",
      investigationTargets: [
        "Memastikan kebenaran data Identitas Tertanggung dan data Polis",
        "Verifikasi riwayat Penyakit Jantung Koroner",
        "Pengecekan rekam medis RS Columbia Asia Medan"
      ],
      documentChecklist: [
        "SPAJ 000077778888",
        "Formulir pengajuan Klaim",
        "KTP Tertanggung",
        "Hasil EKG dan Troponin Test"
      ],
    };

    // 4. Prudential Closed Case (Mega Utami)
    const casePruClosed: CaseWithRelations = {
      id: "case-demo-pru-closed",
      policyNumber: "POL-000022334455",
      insuredName: "Mega Utami",
      status: "CLOSED",
      description: "Investigasi klaim penyakit kritis (Kanker Serviks) tertanggung di wilayah Semarang.",
      createdAt: now,
      updatedAt: now,
      clientId: "client-003", // Prudential
      assigneeId: "inv-005", // Akbar Ramadhan
      client: {
        id: "client-003",
        name: "PT Prudential Life Assurance",
        companyName: "PT Prudential Life Assurance",
      },
      assignee: {
        id: "inv-005",
        name: "Akbar Ramadhan",
      },
      city: "Semarang, Jawa Tengah",
      scheduleInvestigator: "2026-01-05T09:00",
      documents: [
        {
          id: "doc-spaj-mega",
          name: "SPAJ_Mega_Utami_Anonymized.pdf",
          type: "file",
          url: "#",
          size: 139000,
          mimeType: "application/pdf"
        },
        {
          id: "doc-dukcapil-mega",
          name: "Verifikasi_Dukcapil_Mega.png",
          type: "image",
          url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="800" height="400"><rect width="100%" height="100%" fill="%23f4f6f8"/><rect width="100%" height="45" fill="%231b5e20"/><text x="20" y="28" font-family="monospace" font-size="16" font-weight="bold" fill="%23ffffff">SISTEM INFORMASI DATA KEPENDUDUKAN (DUKCAPIL)</text><rect x="20" y="65" width="760" height="315" fill="%23ffffff" stroke="%23e0e0e0" stroke-width="1" rx="4"/><rect x="20" y="65" width="760" height="30" fill="%232e7d32" rx="4"/><text x="35" y="85" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23ffffff">DATA KELUARGA &amp; INDIVIDU (TERVERIFIKASI)</text><text x="35" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">No. Kartu Keluarga</text><text x="180" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23111111">: 337401050508xxxx (Disamarkan)</text><text x="420" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">Nama Kepala Keluarga</text><text x="580" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23111111">: SUTRISNO</text><line x1="20" y1="185" x2="780" y2="185" stroke="%23e0e0e0" stroke-width="1"/><text x="35" y="215" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">NIK Tertanggung</text><text x="180" y="215" font-family="sans-serif" font-size="11" font-weight="bold" fill="%231b5e20">: 337402121285xxxx (Valid)</text><text x="420" y="215" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">Nama Lengkap</text><text x="580" y="215" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23111111">: MEGA UTAMI</text><rect x="35" y="280" width="730" height="50" fill="%23e8f5e9" stroke="%23c8e6c9" stroke-width="1" rx="4"/><text x="85" y="310" font-family="sans-serif" font-size="13" font-weight="bold" fill="%232e7d32">NIK KTP Mega Utami Valid di Data Dukcapil Semarang (Terverifikasi)</text></svg>`,
          size: 205000,
          mimeType: "image/png",
          caption: "Hasil Verifikasi Data Dukcapil Mega Utami"
        },
        {
          id: "doc-faskes-mega",
          name: "Foto_Kunjungan_Kariadi_Semarang.jpg",
          type: "image",
          url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="800" height="400"><rect width="100%" height="100%" fill="%23f4f6f8"/><rect width="100%" height="45" fill="%2337474f"/><text x="20" y="28" font-family="sans-serif" font-size="15" font-weight="bold" fill="%23ffffff">Laporan Foto Kunjungan Lapangan - RSUP Dr. Kariadi Semarang</text><rect x="20" y="65" width="370" height="305" fill="%23ffffff" stroke="%23e0e0e0" stroke-width="1" rx="4"/><rect x="410" y="65" width="370" height="305" fill="%23ffffff" stroke="%23e0e0e0" stroke-width="1" rx="4"/><rect x="30" y="75" width="350" height="180" fill="%23eceff1" rx="4"/><text x="205" y="170" font-family="sans-serif" font-size="12" fill="%2378909c" text-anchor="middle">[ Foto RSUP Dr. Kariadi ]</text><text x="35" y="280" font-family="sans-serif" font-size="11" font-weight="bold" fill="%2337474f">Fasilitas Kesehatan Rujukan Utama</text><text x="35" y="300" font-family="sans-serif" font-size="11" fill="%23555555">RSUP Dr. Kariadi Semarang - Poli Onkologi</text><text x="35" y="320" font-family="sans-serif" font-size="10" fill="%23777777">Jl. Dr. Sutomo No. 16, Semarang</text><rect x="420" y="75" width="350" height="180" fill="%23eceff1" rx="4"/><text x="595" y="170" font-family="sans-serif" font-size="12" fill="%2378909c" text-anchor="middle">[ Konfirmasi Rekam Medis (RM) ]</text><text x="425" y="280" font-family="sans-serif" font-size="11" font-weight="bold" fill="%2337474f">Konfirmasi Data Medis</text><text x="425" y="300" font-family="sans-serif" font-size="11" fill="%23555555">Petugas mengonfirmasi keaslian laporan Biopsi PA</text><text x="425" y="320" font-family="sans-serif" font-size="10" font-weight="bold" fill="%232e7d32">Hasil: Diagnosa Kanker Serviks valid, bukan kondisi pre-existing</text></svg>`,
          size: 295000,
          mimeType: "image/jpeg",
          caption: "Foto Kunjungan Lapangan & Konfirmasi Rekam Medis di RSUP Dr. Kariadi Semarang"
        }
      ],
      claimType: "Critical Illness",
      policyHolder: "Mega Utami",
      applicationDate: "11 -November 2023",
      activeDate: "-",
      basicCoverage: "Rp 1.200.000.000,-",
      wop: "Rp 18.000.000,-",
      flexiCi: "Rp 0",
      addb: "Rp 0",
      premium: "Rp 18.000.000,-",
      policyAge: "± 1 Tahun 2 bulan",
      beneficiary: "SUTRISNO - Ayah",
      treatmentDate: "12 -12 - 2025",
      treatmentPlace: "RSUP Dr. Kariadi Semarang / Dr. Wahyudi",
      diagnosis: "Carcinoma Cervix Stage IIB",
      agentName: "RINA",
      addressKtp: "Jl. Pemuda No. 102, RT 001 / RW 003, Sekayu, Semarang, Jawa Tengah (KTP)",
      addressSpaj: "Jl. Pandanaran No. 56, Semarang (SPAJ Alamat tempat Usaha)",
      investigationTargets: [
        "Memastikan kebenaran data Identitas Tertanggung dan data Polis",
        "Pengecekan riwayat medis di RSUP Dr. Kariadi",
        "Melakukan verifikasi di Faskes tingkat I Semarang"
      ],
      documentChecklist: [
        "SPAJ 000022334455",
        "Formulir pengajuan Klaim",
        "KTP Tertanggung",
        "Hasil Biopsi Patologi Anatomi"
      ],
    };

    // 5. Prudential Archived Case (Hendra Wijaya)
    const casePruArchived: CaseWithRelations = {
      id: "case-demo-pru-archived",
      policyNumber: "POL-000055667788",
      insuredName: "Hendra Wijaya",
      status: "ARCHIVED",
      description: "Investigasi klaim penyakit kritis (Gagal Ginjal Kronis) tertanggung di wilayah Yogyakarta.",
      createdAt: now,
      updatedAt: now,
      clientId: "client-003", // Prudential
      assigneeId: "inv-006", // Encep Supriadi
      client: {
        id: "client-003",
        name: "PT Prudential Life Assurance",
        companyName: "PT Prudential Life Assurance",
      },
      assignee: {
        id: "inv-006",
        name: "Encep Supriadi",
      },
      city: "Yogyakarta, DIY",
      scheduleInvestigator: "2025-10-10T10:00",
      documents: [],
      claimType: "Critical Illness",
      policyHolder: "Hendra Wijaya",
      applicationDate: "10 -Oktober 2022",
      activeDate: "-",
      basicCoverage: "Rp 2.500.000.000,-",
      wop: "Rp 40.000.000,-",
      flexiCi: "Rp 0",
      addb: "Rp 0",
      premium: "Rp 40.000.000,-",
      policyAge: "± 3 Tahun",
      beneficiary: "LINDA WATI - Istri",
      treatmentDate: "15 -09 - 2025",
      treatmentPlace: "RSUP Dr. Sardjito Yogyakarta / Dr. Gunawan",
      diagnosis: "Chronic Kidney Disease (CKD) Stage 5 on Hemodialysis",
      agentName: "EDDY",
      addressKtp: "Jl. Kaliurang Km 5.5, Yogyakarta (KTP)",
      addressSpaj: "Jl. Malioboro No. 89, Yogyakarta (SPAJ Alamat Toko)",
      investigationTargets: [
        "Memastikan kebenaran data Identitas Tertanggung dan data Polis",
        "Pengecekan riwayat cuci darah (hemodialisis) pertama kali",
        "Pengecekan rekam medis RSUP Dr. Sardjito"
      ],
      documentChecklist: [
        "SPAJ 000055667788",
        "Formulir pengajuan Klaim Gagal Ginjal",
        "KTP Tertanggung",
        "Laporan Hemodialisa pertama kali"
      ],
    };

    // 6. Allianz On Progress Case (Herman Yusuf)
    const caseAlzOnProgress: CaseWithRelations = {
      id: "case-demo-alz-onprogress",
      policyNumber: "POL-000033445566",
      insuredName: "Herman Yusuf",
      status: "ON_PROGRESS",
      description: "Investigasi klaim penyakit kritis (Serangan Jantung) tertanggung di wilayah Balikpapan.",
      createdAt: now,
      updatedAt: now,
      clientId: "client-002", // Allianz
      assigneeId: "inv-007", // Prana Ramadhan
      client: {
        id: "client-002",
        name: "PT Allianz Indonesia",
        companyName: "PT Allianz Indonesia",
      },
      assignee: {
        id: "inv-007",
        name: "Prana Ramadhan",
      },
      city: "Balikpapan, Kalimantan Timur",
      scheduleInvestigator: "2026-03-20T09:00",
      documents: [
        {
          id: "doc-spaj-herman",
          name: "SPAJ_Herman_Yusuf_Anonymized.pdf",
          type: "file",
          url: "#",
          size: 147000,
          mimeType: "application/pdf"
        },
        {
          id: "doc-dukcapil-herman",
          name: "Verifikasi_Dukcapil_Herman.png",
          type: "image",
          url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="800" height="400"><rect width="100%" height="100%" fill="%23f4f6f8"/><rect width="100%" height="45" fill="%231b5e20"/><text x="20" y="28" font-family="monospace" font-size="16" font-weight="bold" fill="%23ffffff">SISTEM INFORMASI DATA KEPENDUDUKAN (DUKCAPIL)</text><rect x="20" y="65" width="760" height="315" fill="%23ffffff" stroke="%23e0e0e0" stroke-width="1" rx="4"/><rect x="20" y="65" width="760" height="30" fill="%232e7d32" rx="4"/><text x="35" y="85" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23ffffff">DATA KELUARGA &amp; INDIVIDU (TERVERIFIKASI)</text><text x="35" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">No. Kartu Keluarga</text><text x="180" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23111111">: 647101121207xxxx (Disamarkan)</text><text x="420" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">Nama Kepala Keluarga</text><text x="580" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23111111">: HERMAN YUSUF</text><line x1="20" y1="185" x2="780" y2="185" stroke="%23e0e0e0" stroke-width="1"/><text x="35" y="215" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">NIK Tertanggung</text><text x="180" y="215" font-family="sans-serif" font-size="11" font-weight="bold" fill="%231b5e20">: 647101050982xxxx (Valid)</text><text x="420" y="215" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">Nama Lengkap</text><text x="580" y="215" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23111111">: HERMAN YUSUF</text><rect x="35" y="280" width="730" height="50" fill="%23e8f5e9" stroke="%23c8e6c9" stroke-width="1" rx="4"/><text x="85" y="310" font-family="sans-serif" font-size="13" font-weight="bold" fill="%232e7d32">NIK KTP Herman Yusuf Valid di Data Dukcapil Balikpapan (Terverifikasi)</text></svg>`,
          size: 201000,
          mimeType: "image/png",
          caption: "Hasil Verifikasi Data Dukcapil Herman Yusuf"
        },
        {
          id: "doc-faskes-herman",
          name: "Foto_Kunjungan_Siloam_Balikpapan.jpg",
          type: "image",
          url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="800" height="400"><rect width="100%" height="100%" fill="%23f4f6f8"/><rect width="100%" height="45" fill="%2337474f"/><text x="20" y="28" font-family="sans-serif" font-size="15" font-weight="bold" fill="%23ffffff">Laporan Foto Kunjungan Lapangan - RS Siloam Balikpapan</text><rect x="20" y="65" width="370" height="305" fill="%23ffffff" stroke="%23e0e0e0" stroke-width="1" rx="4"/><rect x="410" y="65" width="370" height="305" fill="%23ffffff" stroke="%23e0e0e0" stroke-width="1" rx="4"/><rect x="30" y="75" width="350" height="180" fill="%23eceff1" rx="4"/><text x="205" y="170" font-family="sans-serif" font-size="12" fill="%2378909c" text-anchor="middle">[ Foto RS Siloam Balikpapan ]</text><text x="35" y="280" font-family="sans-serif" font-size="11" font-weight="bold" fill="%2337474f">Fasilitas Kesehatan Rujukan</text><text x="35" y="300" font-family="sans-serif" font-size="11" fill="%23555555">RS Siloam Balikpapan - Cath Lab</text><text x="35" y="320" font-family="sans-serif" font-size="10" fill="%23777777">Jl. MT Haryono No. 23, Balikpapan</text><rect x="420" y="75" width="350" height="180" fill="%23eceff1" rx="4"/><text x="595" y="170" font-family="sans-serif" font-size="12" fill="%2378909c" text-anchor="middle">[ Konfirmasi Hasil Angiografi ]</text><text x="425" y="280" font-family="sans-serif" font-size="11" font-weight="bold" fill="%2337474f">Konfirmasi Data Medis</text><text x="425" y="300" font-family="sans-serif" font-size="11" fill="%23555555">Pengecekan hasil kateterisasi penyumbatan arteri koroner</text><text x="425" y="320" font-family="sans-serif" font-size="10" font-weight="bold" fill="%230288d1">Status: Pemeriksaan on-progress di RS Siloam Balikpapan</text></svg>`,
          size: 292000,
          mimeType: "image/jpeg",
          caption: "Foto Kunjungan Lapangan & Pengecekan Hasil Angiografi di RS Siloam Balikpapan"
        }
      ],
      claimType: "Critical Illness",
      policyHolder: "Herman Yusuf",
      applicationDate: "14 -Februari 2024",
      activeDate: "-",
      basicCoverage: "Rp 1.800.000.000,-",
      wop: "Rp 28.000.000,-",
      flexiCi: "Rp 0",
      addb: "Rp 0",
      premium: "Rp 28.000.000,-",
      policyAge: "± 1 Tahun 1 bulan",
      beneficiary: "SITI NURHALIZA - Istri",
      treatmentDate: "10 -02 - 2026",
      treatmentPlace: "RS Siloam Balikpapan / Dr. Susilo",
      diagnosis: "Coronary Artery Disease, Triple Vessel Disease",
      agentName: "ANDRI",
      addressKtp: "Jl. Sudirman No. 89, Balikpapan, Kalimantan Timur (KTP)",
      addressSpaj: "Jl. Mulawarman No. 12, Balikpapan (SPAJ Alamat Kantor)",
      investigationTargets: [
        "Memastikan kebenaran data Identitas Tertanggung dan data Polis",
        "Pengecekan riwayat medis penyakit jantung koroner di RS Siloam Balikpapan"
      ],
      documentChecklist: [
        "SPAJ 000033445566",
        "Formulir pengajuan Klaim",
        "KTP Tertanggung",
        "Hasil Angiografi Koroner (Kateterisasi)"
      ],
    };

    // 7. Prudential On Progress Case (Diana Putri)
    const casePruOnProgress: CaseWithRelations = {
      id: "case-demo-pru-onprogress",
      policyNumber: "POL-000066778899",
      insuredName: "Diana Putri",
      status: "ON_PROGRESS",
      description: "Investigasi klaim penyakit kritis (Tumor Otak) tertanggung di wilayah Denpasar.",
      createdAt: now,
      updatedAt: now,
      clientId: "client-003", // Prudential
      assigneeId: "inv-008", // Anwim Yanma Aji
      client: {
        id: "client-003",
        name: "PT Prudential Life Assurance",
        companyName: "PT Prudential Life Assurance",
      },
      assignee: {
        id: "inv-008",
        name: "Anwim Yanma Aji",
      },
      city: "Denpasar, Bali",
      scheduleInvestigator: "2026-03-25T10:00",
      documents: [
        {
          id: "doc-spaj-diana",
          name: "SPAJ_Diana_Putri_Anonymized.pdf",
          type: "file",
          url: "#",
          size: 140000,
          mimeType: "application/pdf"
        },
        {
          id: "doc-dukcapil-diana",
          name: "Verifikasi_Dukcapil_Diana.png",
          type: "image",
          url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="800" height="400"><rect width="100%" height="100%" fill="%23f4f6f8"/><rect width="100%" height="45" fill="%231b5e20"/><text x="20" y="28" font-family="monospace" font-size="16" font-weight="bold" fill="%23ffffff">SISTEM INFORMASI DATA KEPENDUDUKAN (DUKCAPIL)</text><rect x="20" y="65" width="760" height="315" fill="%23ffffff" stroke="%23e0e0e0" stroke-width="1" rx="4"/><rect x="20" y="65" width="760" height="30" fill="%232e7d32" rx="4"/><text x="35" y="85" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23ffffff">DATA KELUARGA &amp; INDIVIDU (TERVERIFIKASI)</text><text x="35" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">No. Kartu Keluarga</text><text x="180" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23111111">: 517101150805xxxx (Disamarkan)</text><text x="420" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">Nama Kepala Keluarga</text><text x="580" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23111111">: MADE ARTA</text><line x1="20" y1="185" x2="780" y2="185" stroke="%23e0e0e0" stroke-width="1"/><text x="35" y="215" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">NIK Tertanggung</text><text x="180" y="215" font-family="sans-serif" font-size="11" font-weight="bold" fill="%231b5e20">: 517101500388xxxx (Valid)</text><text x="420" y="215" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">Nama Lengkap</text><text x="580" y="215" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23111111">: DIANA PUTRI</text><rect x="35" y="280" width="730" height="50" fill="%23e8f5e9" stroke="%23c8e6c9" stroke-width="1" rx="4"/><text x="85" y="310" font-family="sans-serif" font-size="13" font-weight="bold" fill="%232e7d32">NIK KTP Diana Putri Valid di Data Dukcapil Denpasar (Terverifikasi)</text></svg>`,
          size: 200000,
          mimeType: "image/png",
          caption: "Hasil Verifikasi Data Dukcapil Diana Putri"
        },
        {
          id: "doc-faskes-diana",
          name: "Foto_Kunjungan_Ngoerah_Denpasar.jpg",
          type: "image",
          url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="800" height="400"><rect width="100%" height="100%" fill="%23f4f6f8"/><rect width="100%" height="45" fill="%2337474f"/><text x="20" y="28" font-family="sans-serif" font-size="15" font-weight="bold" fill="%23ffffff">Laporan Foto Kunjungan Lapangan - RSUP Prof. Ngoerah Denpasar</text><rect x="20" y="65" width="370" height="305" fill="%23ffffff" stroke="%23e0e0e0" stroke-width="1" rx="4"/><rect x="410" y="65" width="370" height="305" fill="%23ffffff" stroke="%23e0e0e0" stroke-width="1" rx="4"/><rect x="30" y="75" width="350" height="180" fill="%23eceff1" rx="4"/><text x="205" y="170" font-family="sans-serif" font-size="12" fill="%2378909c" text-anchor="middle">[ Foto RSUP Prof. Ngoerah ]</text><text x="35" y="280" font-family="sans-serif" font-size="11" font-weight="bold" fill="%2337474f">Fasilitas Kesehatan Rujukan Utama</text><text x="35" y="300" font-family="sans-serif" font-size="11" fill="%23555555">RSUP Prof. Ngoerah Denpasar - Poli Bedah Saraf</text><text x="35" y="320" font-family="sans-serif" font-size="10" fill="%23777777">Jl. Diponegoro, Denpasar, Bali</text><rect x="420" y="75" width="350" height="180" fill="%23eceff1" rx="4"/><text x="595" y="170" font-family="sans-serif" font-size="12" fill="%2378909c" text-anchor="middle">[ Pengecekan Rekam Medis (RM) ]</text><text x="425" y="280" font-family="sans-serif" font-size="11" font-weight="bold" fill="%2337474f">Pemeriksaan Rekam Medis</text><text x="425" y="300" font-family="sans-serif" font-size="11" fill="%23555555">Pengecekan konfirmasi MRI kepala dan hasil PA tumor</text><text x="425" y="320" font-family="sans-serif" font-size="10" font-weight="bold" fill="%230288d1">Status: Pemeriksaan on-progress di RSUP Prof. Ngoerah</text></svg>`,
          size: 294000,
          mimeType: "image/jpeg",
          caption: "Foto Kunjungan Lapangan & Pengecekan Rekam Medis di RSUP Prof. Ngoerah Denpasar"
        }
      ],
      claimType: "Critical Illness",
      policyHolder: "Diana Putri",
      applicationDate: "05 -Agustus 2023",
      activeDate: "-",
      basicCoverage: "Rp 2.000.000.000,-",
      wop: "Rp 32.000.000,-",
      flexiCi: "Rp 0",
      addb: "Rp 0",
      premium: "Rp 32.000.000,-",
      policyAge: "± 2 Tahun 7 bulan",
      beneficiary: "MADE ARTA - Suami",
      treatmentDate: "22 -02 - 2026",
      treatmentPlace: "RSUP Prof. Ngoerah Denpasar / Dr. Dewa",
      diagnosis: "Meningioma Cerebri (Tumor Otak Jinak)",
      agentName: "KETUT",
      addressKtp: "Jl. Teuku Umar No. 120, Denpasar, Bali (KTP)",
      addressSpaj: "Jl. Sunset Road No. 45, Badung (SPAJ Alamat Kantor)",
      investigationTargets: [
        "Memastikan kebenaran data Identitas Tertanggung dan data Polis",
        "Verifikasi hasil MRI Kepala dan rekam medis di RSUP Prof. Ngoerah Denpasar"
      ],
      documentChecklist: [
        "SPAJ 000066778899",
        "Formulir pengajuan Klaim",
        "KTP Tertanggung",
        "Hasil MRI Brain dan Patologi Anatomi"
      ],
    };

    // 8. Allianz New Case (Budi Hermawan)
    const caseAlzNew: CaseWithRelations = {
      id: "case-demo-alz-new",
      policyNumber: "POL-000011112222",
      insuredName: "Budi Hermawan",
      status: "NEW",
      description: "Investigasi klaim penyakit kritis (Gagal Ginjal) tertanggung di wilayah Jakarta.",
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
      city: "Jakarta Selatan, DKI Jakarta",
      scheduleInvestigator: "2026-04-10T11:00",
      documents: [
        {
          id: "doc-spaj-budi",
          name: "SPAJ_Budi_Hermawan_Anonymized.pdf",
          type: "file",
          url: "#",
          size: 135000,
          mimeType: "application/pdf"
        },
        {
          id: "doc-dukcapil-budi",
          name: "Verifikasi_Dukcapil_Budi.png",
          type: "image",
          url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="800" height="400"><rect width="100%" height="100%" fill="%23f4f6f8"/><rect width="100%" height="45" fill="%231b5e20"/><text x="20" y="28" font-family="monospace" font-size="16" font-weight="bold" fill="%23ffffff">SISTEM INFORMASI DATA KEPENDUDUKAN (DUKCAPIL)</text><rect x="20" y="65" width="760" height="315" fill="%23ffffff" stroke="%23e0e0e0" stroke-width="1" rx="4"/><rect x="20" y="65" width="760" height="30" fill="%232e7d32" rx="4"/><text x="35" y="85" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23ffffff">DATA KELUARGA &amp; INDIVIDU (TERVERIFIKASI)</text><text x="35" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">No. Kartu Keluarga</text><text x="180" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23111111">: 317401150802xxxx (Disamarkan)</text><text x="420" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">Nama Kepala Keluarga</text><text x="580" y="125" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23111111">: BUDI HERMAWAN</text><line x1="20" y1="185" x2="780" y2="185" stroke="%23e0e0e0" stroke-width="1"/><text x="35" y="215" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">NIK Tertanggung</text><text x="180" y="215" font-family="sans-serif" font-size="11" font-weight="bold" fill="%231b5e20">: 317402050478xxxx (Valid)</text><text x="420" y="215" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23666666">Nama Lengkap</text><text x="580" y="215" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23111111">: BUDI HERMAWAN</text><rect x="35" y="280" width="730" height="50" fill="%23e8f5e9" stroke="%23c8e6c9" stroke-width="1" rx="4"/><text x="85" y="310" font-family="sans-serif" font-size="13" font-weight="bold" fill="%232e7d32">NIK KTP Budi Hermawan Valid di Data Dukcapil DKI Jakarta (Terverifikasi)</text></svg>`,
          size: 202000,
          mimeType: "image/png",
          caption: "Hasil Verifikasi Data Dukcapil Budi Hermawan"
        }
      ],
      claimType: "Critical Illness",
      policyHolder: "Budi Hermawan",
      applicationDate: "10 -Mei 2024",
      activeDate: "-",
      basicCoverage: "Rp 800.000.000,-",
      wop: "Rp 15.000.000,-",
      flexiCi: "Rp 0",
      addb: "Rp 0",
      premium: "Rp 15.000.000,-",
      policyAge: "± 1 Tahun 10 bulan",
      beneficiary: "SARAH HERMAWAN - Anak",
      treatmentDate: "28 -02 - 2026",
      treatmentPlace: "RS Medistra Jakarta / Dr. Pratama",
      diagnosis: "End-Stage Renal Disease (Gagal Ginjal Kronis)",
      agentName: "DENNY",
      addressKtp: "Jl. Tebet Barat Dalam No. 12, RT 004 / RW 002, Tebet, Jakarta Selatan (KTP)",
      addressSpaj: "Jl. Gatot Subroto Kav. 23, Jakarta (SPAJ Alamat Kantor)",
      investigationTargets: [
        "Memastikan kebenaran data Identitas Tertanggung dan data Polis",
        "Verifikasi riwayat kesehatan di Faskes Jakarta terkait keluhan ginjal",
      ],
      documentChecklist: [
        "SPAJ 000011112222",
        "Formulir pengajuan Klaim",
        "KTP Tertanggung",
        "Laporan Dokter Gagal Ginjal"
      ],
    };

    const defaultCases = [defaultCI, caseNew, caseClosed, caseArchived, casePruClosed, casePruArchived, caseAlzOnProgress, casePruOnProgress, caseAlzNew];

    const clients = getClients();
    const mappedDefaults = defaultCases.map((c) => {
      const clientDetails = clients.find((cl) => cl.id === c.clientId);
      return {
        ...c,
        client: {
          ...c.client,
          logo: clientDetails?.logo || null,
        }
      };
    });

    if (!raw) {
      saveStoredCases(mappedDefaults);
      return mappedDefaults.filter((c) => c.clientId !== "client-003");
    }
    const parsed = JSON.parse(raw) as StoredCase[];
    
    // Auto-merge missing default cases (e.g. caseAlzNew)
    const parsedIds = parsed.map(p => p.id);
    const missingDefaults = mappedDefaults.filter(d => !parsedIds.includes(d.id));
    
    let loaded = parsed.map((c) => {
      const migratedStatus = LEGACY_STATUS_MAP[c.status] ?? c.status;
      const revived = reviveCase({ ...c, status: migratedStatus as StoredCase["status"] });
      const clientDetails = clients.find((cl) => cl.id === revived.clientId);
      return {
        ...revived,
        client: {
          ...revived.client,
          logo: clientDetails?.logo || null,
        }
      };
    });

    if (missingDefaults.length > 0) {
      loaded = [...loaded, ...missingDefaults];
      saveStoredCases(loaded);
    }
    
    // Ensure all default cases exist in the loaded list, and force-refresh their properties
    mappedDefaults.forEach((def) => {
      const index = loaded.findIndex((c) => c.id === def.id);
      if (index >= 0) {
        loaded[index] = {
          ...loaded[index],
          policyNumber: def.policyNumber,
          insuredName: def.insuredName,
          status: loaded[index].status || def.status,
          description: def.description,
          clientId: def.clientId,
          client: def.client,
          city: def.city,
          scheduleInvestigator: def.scheduleInvestigator,
          claimType: def.claimType,
          policyHolder: def.policyHolder,
          applicationDate: def.applicationDate,
          activeDate: def.activeDate,
          basicCoverage: def.basicCoverage,
          wop: def.wop,
          flexiCi: def.flexiCi,
          addb: def.addb,
          premium: def.premium,
          policyAge: def.policyAge,
          beneficiary: def.beneficiary,
          treatmentDate: def.treatmentDate,
          treatmentPlace: def.treatmentPlace,
          diagnosis: def.diagnosis,
          agentName: def.agentName,
          addressKtp: def.addressKtp,
          addressSpaj: def.addressSpaj,
          investigationTargets: def.investigationTargets,
          documentChecklist: def.documentChecklist,
          documents: def.documents,
        };
      } else {
        loaded.push(def);
      }
    });
    saveStoredCases(loaded);
    
    return loaded.filter((c) => c.clientId !== "client-003");
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
  const clients = getClients();
  const client = clients.find((c) => c.id === input.clientId);
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
      logo: client?.logo ?? null,
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
