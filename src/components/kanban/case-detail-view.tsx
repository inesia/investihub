"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Building2,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  User,
  MapPin,
  CalendarDays,
  ChevronDown,
  Search,
  Filter,
  Download,
} from "lucide-react";
import { type User as PrismaUser } from "@prisma/client";

type User = PrismaUser & { photo?: string };
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { CaseWithRelations, CommentWithAuthor, CommentAttachment, CaseStatus } from "@/types";
import { STATUS_LABELS, canPostComments } from "@/types";
import { StatusBadge } from "@/components/kanban/status-badge";
import { CommentItem, AttachmentDisplay } from "@/components/cases/comment-item";
import { NoteForm, type NoteFormData } from "@/components/cases/note-form";
import { useAuth } from "@/contexts/auth-context";
import { useCases } from "@/contexts/cases-context";
import { formatDate, formatDateTime, cn } from "@/lib/utils";
import { generateDocxReport } from "@/lib/report-generator";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { CreateCaseForm } from "@/components/cases/create-case-form";

interface CaseDetailViewProps {
  caseData: CaseWithRelations;
}

const COMPANY_LOGOS: Record<string, string> = {
  "PT Allianz Indonesia": "/brands/allianz/logo.svg",
  "PT Prudential Life Assurance": "/brands/prudential/Prudential_plc_logo.svg.webp",
};

const getInitialCommentsForCase = (caseId: string): CommentWithAuthor[] => {
  const baseDate = new Date("2026-03-15T10:00:00");
  
  if (caseId === "case-ci-001") {
    return [
      {
        id: "comment-inv-1",
        caseId: "case-ci-001",
        content: `### 1. VERIFIKASI IDENTITAS TERTANGGUNG PADA LINK DUKCAPIL

* Berdasarkan database (Nasional) Dukcapil bahwa NIK KTP dengan No **737103700580xxxx** terdaftar a.n **Desi Ratnasari** yang lahir di Bandung tanggal **30-05-1980** (Sesuai dengan NIK KTP pada dokumen klaim).
* Berdasarkan database (Nasional) Dukcapil tercatat bahwa Kartu Keluarga No **737103301197xxxx** dengan kepala keluarga **BUDI SANTOSO**, **Desi Ratnasari** (Istri/Tertanggung), **J. SANTOSO** (Anak), **J. SANTOSO** (Anak), **T. SANTOSO** (Anak) dan **ALDI TOMMY** (Adik / Ahli waris).`,
        contentHtml: `<p><strong>1. VERIFIKASI IDENTITAS TERTANGGUNG PADA LINK DUKCAPIL</strong></p><ul><li>Berdasarkan database (Nasional) Dukcapil bahwa NIK KTP dengan No <strong>737103700580xxxx</strong> terdaftar a.n <strong>Desi Ratnasari</strong> yang lahir di Bandung tanggal <strong>30-05-1980</strong> (Sesuai dengan NIK KTP pada dokumen klaim).</li><li>Berdasarkan database (Nasional) Dukcapil tercatat bahwa Kartu Keluarga No <strong>737103301197xxxx</strong> dengan kepala keluarga <strong>BUDI SANTOSO</strong>, <strong>Desi Ratnasari</strong> (Istri/Tertanggung), <strong>J. SANTOSO</strong> (Anak), <strong>J. SANTOSO</strong> (Anak), <strong>T. SANTOSO</strong> (Anak) dan <strong>ALDI TOMMY</strong> (Adik / Ahli waris).</li></ul>`,
        createdAt: new Date(baseDate.getTime() + 1000 * 60 * 30), // 10:30
        authorId: "inv-001",
        author: { id: "inv-001", name: "Sigit Sartono", role: "INVESTIGATOR" },
        isApproved: true,
        approvedAt: new Date(baseDate.getTime() + 1000 * 60 * 35)
      },
      {
        id: "comment-inv-2",
        caseId: "case-ci-001",
        content: `### 2. PENELUSURAN BPJS

* Berdasarkan Dokumen NIK KTP **737103700580xxxx** a.n **Desi Ratnasari** Tanggal lahir **30-05-1980** terdaftar di BPJS No **000133923xxxx** dengan Faskes Klinik **Pratama dr. A. S. Hamdany**. Kondisi BPJS masih **Aktif**.
* Berdasarkan data aplikasi Primary Care, tertanggung tercatat **tidak pernah berobat** menggunakan fasilitas BPJS.`,
        contentHtml: `<p><strong>2. PENELUSURAN BPJS</strong></p><ul><li>Berdasarkan Dokumen NIK KTP <strong>737103700580xxxx</strong> a.n <strong>Desi Ratnasari</strong> Tanggal lahir <strong>30-05-1980</strong> terdaftar di BPJS No <strong>000133923xxxx</strong> dengan Faskes Klinik <strong>Pratama dr. A. S. Hamdany</strong>. Kondisi BPJS masih <strong>Aktif</strong>.</li><li>Berdasarkan data aplikasi Primary Care, tertanggung tercatat <strong>tidak pernah berobat</strong> menggunakan fasilitas BPJS.</li></ul>`,
        createdAt: new Date(baseDate.getTime() + 1000 * 60 * 60 * 2), // 12:00
        authorId: "inv-001",
        author: { id: "inv-001", name: "Sigit Sartono", role: "INVESTIGATOR" },
        isApproved: true,
        approvedAt: new Date(baseDate.getTime() + 1000 * 60 * 60 * 2 + 1000 * 60 * 5)
      },
      {
        id: "comment-inv-3",
        caseId: "case-ci-001",
        content: `### 3. MENDATANGI FASKES BPJS TERTANGGUNG (Klinik Pratama dr. A. S. Hamdany)

* Tim investigator mendatangi langsung Klinik Pratama dr. A. S. Hamdany dengan hasil penelusuran sebagai berikut:
  * Bahwa benar nomor BPJS **000133923xxxx** a.n **Desi Ratnasari** terdaftar di Klinik tersebut dan statusnya aktif.
  * Pihak klinik memvalidasi bahwa faskes tingkat pertama yang bersangkutan memang terdaftar di Klinik Pratama dr. A. S. Hamdany.
  * Hasil penelusuran rekam medis (RM) menunjukkan bahwa **Desi Ratnasari** tidak pernah berobat secara umum maupun menggunakan fasilitas BPJS di klinik tersebut.`,
        contentHtml: `<p><strong>3. MENDATANGI FASKES BPJS TERTANGGUNG (Klinik Pratama dr. A. S. Hamdany)</strong></p><ul><li>Tim investigator mendatangi langsung Klinik Pratama dr. A. S. Hamdany dengan hasil penelusuran sebagai berikut:<ul><li>Bahwa benar nomor BPJS <strong>000133923xxxx</strong> a.n <strong>Desi Ratnasari</strong> terdaftar di Klinik tersebut dan statusnya aktif.</li><li>Pihak klinik memvalidasi bahwa faskes tingkat pertama yang bersangkutan memang terdaftar di Klinik Pratama dr. A. S. Hamdany.</li><li>Hasil penelusuran rekam medis (RM) menunjukkan bahwa <strong>Desi Ratnasari</strong> tidak pernah berobat secara umum maupun menggunakan fasilitas BPJS di klinik tersebut.</li></ul></li></ul>`,
        createdAt: new Date(baseDate.getTime() + 1000 * 60 * 60 * 4), // 14:00
        authorId: "inv-001",
        author: { id: "inv-001", name: "Sigit Sartono", role: "INVESTIGATOR" },
        isApproved: true,
        approvedAt: new Date(baseDate.getTime() + 1000 * 60 * 60 * 4 + 1000 * 60 * 5)
      },
      {
        id: "comment-inv-4",
        caseId: "case-ci-001",
        content: `### 4. PENELUSURAN NOMOR TELEPON TERTANGGUNG

* Investigator melakukan penelusuran terhadap nomor telepon genggam tertanggung yang tertera pada dokumen klaim, yaitu **08510072xxxx**.
* Penelusuran menggunakan aplikasi pencari kontak (Get Contact) menunjukkan bahwa nomor telepon tersebut terdaftar atas nama **Desi** (sesuai dengan nama tertanggung pada dokumen).`,
        contentHtml: `<p><strong>4. PENELUSURAN NOMOR TELEPON TERTANGGUNG</strong></p><ul><li>Investigator melakukan penelusuran terhadap nomor telepon genggam tertanggung yang tertera pada dokumen klaim, yaitu <strong>08510072xxxx</strong>.</li><li>Penelusuran menggunakan aplikasi pencari kontak (Get Contact) menunjukkan bahwa nomor telepon tersebut terdaftar atas nama <strong>Desi</strong> (sesuai dengan nama tertanggung pada dokumen).</li></ul>`,
        createdAt: new Date(baseDate.getTime() + 1000 * 60 * 60 * 5), // 15:00
        authorId: "inv-001",
        author: { id: "inv-001", name: "Sigit Sartono", role: "INVESTIGATOR" },
        isApproved: true,
        approvedAt: new Date(baseDate.getTime() + 1000 * 60 * 60 * 5 + 1000 * 60 * 5)
      }
    ];
  }

  if (caseId === "case-demo-alz-onprogress") {
    return [
      {
        id: "comment-inv-herman-1",
        caseId: "case-demo-alz-onprogress",
        content: `### 1. VERIFIKASI KEPENDUDUKAN (DUKCAPIL)
        
* Berdasarkan pencocokan NIK **647101050982xxxx**, data kependudukan a.n **Herman Yusuf** terverifikasi aktif di Dukcapil Kota Balikpapan.
* Alamat tinggal saat ini sesuai dengan data KTP, yaitu di Jl. Sudirman No. 89, Balikpapan.`,
        contentHtml: `<p><strong>1. VERIFIKASI KEPENDUDUKAN (DUKCAPIL)</strong></p><ul><li>Berdasarkan pencocokan NIK 647101050982xxxx, data kependudukan a.n Herman Yusuf terverifikasi aktif di Dukcapil Kota Balikpapan.</li><li>Alamat tinggal saat ini sesuai dengan data KTP, yaitu di Jl. Sudirman No. 89, Balikpapan.</li></ul>`,
        createdAt: new Date(baseDate.getTime()),
        authorId: "inv-007",
        author: { id: "inv-007", name: "Prana Ramadhan", role: "INVESTIGATOR" },
        isApproved: true,
        approvedAt: new Date(baseDate.getTime() + 1000 * 60 * 10)
      },
      {
        id: "comment-inv-herman-2",
        caseId: "case-demo-alz-onprogress",
        content: `### 2. KUNJUNGAN LAPANGAN (RS SILOAM BALIKPAPAN)
        
* Investigator mendatangi RS Siloam Balikpapan (Cath Lab) untuk memverifikasi rekam medis tindakan Angiografi Koroner.
* Petugas rekam medis telah menerima surat kuasa pelepasan informasi medis dan saat ini sedang memproses pencarian berkas kunjungan pasien sejak 2 tahun terakhir.`,
        contentHtml: `<p><strong>2. KUNJUNGAN LAPANGAN (RS SILOAM BALIKPAPAN)</strong></p><ul><li>Investigator mendatangi RS Siloam Balikpapan (Cath Lab) untuk memverifikasi rekam medis tindakan Angiografi Koroner.</li><li>Petugas rekam medis telah menerima surat kuasa pelepasan informasi medis dan saat ini sedang memproses pencarian berkas kunjungan pasien sejak 2 tahun terakhir.</li></ul>`,
        createdAt: new Date(baseDate.getTime() + 1000 * 60 * 60 * 3),
        authorId: "inv-007",
        author: { id: "inv-007", name: "Prana Ramadhan", role: "INVESTIGATOR" },
        isApproved: true,
        approvedAt: new Date(baseDate.getTime() + 1000 * 60 * 60 * 3 + 1000 * 60 * 15)
      }
    ];
  }

  if (caseId === "case-demo-pru-onprogress") {
    return [
      {
        id: "comment-inv-diana-1",
        caseId: "case-demo-pru-onprogress",
        content: `### 1. VERIFIKASI DUKCAPIL DENPASAR
        
* Berdasarkan data Dukcapil Bali, NIK KTP **517101500388xxxx** a.n **Diana Putri** adalah valid dan terdaftar.
* Suami terdaftar atas nama **Made Arta** selaku Ahli Waris.`,
        contentHtml: `<p><strong>1. VERIFIKASI DUKCAPIL DENPASAR</strong></p><ul><li>Berdasarkan data Dukcapil Bali, NIK KTP 517101500388xxxx a.n Diana Putri adalah valid dan terdaftar.</li><li>Suami terdaftar atas nama Made Arta selaku Ahli Waris.</li></ul>`,
        createdAt: new Date(baseDate.getTime()),
        authorId: "inv-008",
        author: { id: "inv-008", name: "Anwim Yanma Aji", role: "INVESTIGATOR" },
        isApproved: true,
        approvedAt: new Date(baseDate.getTime() + 1000 * 60 * 10)
      },
      {
        id: "comment-inv-diana-2",
        caseId: "case-demo-pru-onprogress",
        content: `### 2. KUNJUNGAN RSUP PROF. NGOERAH DENPASAR
        
* Investigator mendatangi Poli Bedah Saraf RSUP Prof. Ngoerah Denpasar.
* Pengecekan rekam medis menunjukkan diagnosa Meningioma Cerebri (Tumor Otak Jinak) pertama kali ditegakkan pada tanggal **22-02-2026** berdasarkan hasil pemeriksaan MRI kepala. Penelusuran riwayat medis masa lalu sedang diselidiki.`,
        contentHtml: `<p><strong>2. KUNJUNGAN RSUP PROF. NGOERAH DENPASAR</strong></p><ul><li>Investigator mendatangi Poli Bedah Saraf RSUP Prof. Ngoerah Denpasar.</li><li>Pengecekan rekam medis menunjukkan diagnosa Meningioma Cerebri (Tumor Otak Jinak) pertama kali ditegakkan pada tanggal 22-02-2026 berdasarkan hasil pemeriksaan MRI kepala. Penelusuran riwayat medis masa lalu sedang diselidiki.</li></ul>`,
        createdAt: new Date(baseDate.getTime() + 1000 * 60 * 60 * 4),
        authorId: "inv-008",
        author: { id: "inv-008", name: "Anwim Yanma Aji", role: "INVESTIGATOR" },
        isApproved: true,
        approvedAt: new Date(baseDate.getTime() + 1000 * 60 * 60 * 4 + 1000 * 60 * 15)
      }
    ];
  }

  if (caseId === "case-demo-closed") {
    return [
      {
        id: "comment-inv-lilis-1",
        caseId: "case-demo-closed",
        content: `### 1. VERIFIKASI DUKCAPIL & DOMISILI
        
* NIK KTP **357805120680xxxx** a.n **Lilis Kartika** terverifikasi valid di Dukcapil Kota Surabaya.
* Benar bertempat tinggal di Jl. Raya Darmo No. 88, Surabaya bersama suaminya Heri Setiawan.`,
        contentHtml: `<p><strong>1. VERIFIKASI DUKCAPIL &amp; DOMISILI</strong></p><ul><li>NIK KTP 357805120680xxxx a.n Lilis Kartika terverifikasi valid di Dukcapil Kota Surabaya.</li><li>Benar bertempat tinggal di Jl. Raya Darmo No. 88, Surabaya bersama suaminya Heri Setiawan.</li></ul>`,
        createdAt: new Date(baseDate.getTime()),
        authorId: "inv-003",
        author: { id: "inv-003", name: "Triyani Firdaus", role: "INVESTIGATOR" },
        isApproved: true,
        approvedAt: new Date(baseDate.getTime() + 1000 * 60 * 15)
      },
      {
        id: "comment-inv-lilis-2",
        caseId: "case-demo-closed",
        content: `### 2. KUNJUNGAN RS SILOAM SURABAYA (REKAM MEDIS VERIFIED)
        
* Kunjungan ke bagian rekam medis RS Siloam Surabaya mengonfirmasi keaslian hasil MRI kepala pasien tertanggal **20-01-2026**.
* Hasil wawancara dokter spesialis saraf menyatakan bahwa serangan stroke terjadi mendadak dan tidak ada riwayat keluhan medis serupa yang pernah diperiksakan sebelumnya di rumah sakit tersebut. Kasus dinyatakan bersih dari pre-existing condition.`,
        contentHtml: `<p><strong>2. KUNJUNGAN RS SILOAM SURABAYA (REKAM MEDIS VERIFIED)</strong></p><ul><li>Kunjungan ke bagian rekam medis RS Siloam Surabaya mengonfirmasi keaslian hasil MRI kepala pasien tertanggal 20-01-2026.</li><li>Hasil wawancara dokter spesialis saraf menyatakan bahwa serangan stroke terjadi mendadak dan tidak ada riwayat keluhan medis serupa yang pernah diperiksakan sebelumnya di rumah sakit tersebut. Kasus dinyatakan bersih dari pre-existing condition.</li></ul>`,
        createdAt: new Date(baseDate.getTime() + 1000 * 60 * 60 * 5),
        authorId: "inv-003",
        author: { id: "inv-003", name: "Triyani Firdaus", role: "INVESTIGATOR" },
        isApproved: true,
        approvedAt: new Date(baseDate.getTime() + 1000 * 60 * 60 * 5 + 1000 * 60 * 20)
      }
    ];
  }

  if (caseId === "case-demo-pru-closed") {
    return [
      {
        id: "comment-inv-mega-1",
        caseId: "case-demo-pru-closed",
        content: `### 1. VERIFIKASI IDENTITAS TERTANGGUNG
        
* NIK KTP **337402121285xxxx** terdaftar atas nama **Mega Utami** di Dukcapil Kota Semarang.
* Alamat tinggal terverifikasi di Jl. Pemuda No. 102, Semarang.`,
        contentHtml: `<p><strong>1. VERIFIKASI IDENTITAS TERTANGGUNG</strong></p><ul><li>NIK KTP 337402121285xxxx terdaftar atas nama Mega Utami di Dukcapil Kota Semarang.</li><li>Alamat tinggal terverifikasi di Jl. Pemuda No. 102, Semarang.</li></ul>`,
        createdAt: new Date(baseDate.getTime()),
        authorId: "inv-005",
        author: { id: "inv-005", name: "Akbar Ramadhan", role: "INVESTIGATOR" },
        isApproved: true,
        approvedAt: new Date(baseDate.getTime() + 1000 * 60 * 10)
      },
      {
        id: "comment-inv-mega-2",
        caseId: "case-demo-pru-closed",
        content: `### 2. KUNJUNGAN RSUP DR. KARIADI SEMARANG
        
* Investigator memverifikasi laporan hasil biopsi Patologi Anatomi di Poli Onkologi RSUP Dr. Kariadi Semarang.
* Berkas rekam medis mengonfirmasi adanya diagnosa Carcinoma Cervix Stage IIB tertanggal **12-12-2025** yang bersifat baru (acute oncology). Tidak ditemukan rekam jejak pengobatan kanker atau keluhan ginekologi sebelum polis aktif.`,
        contentHtml: `<p><strong>2. KUNJUNGAN RSUP DR. KARIADI SEMARANG</strong></p><ul><li>Investigator memverifikasi laporan hasil biopsi Patologi Anatomi di Poli Onkologi RSUP Dr. Kariadi Semarang.</li><li>Berkas rekam medis mengonfirmasi adanya diagnosa Carcinoma Cervix Stage IIB tertanggal 12-12-2025 yang bersifat baru (acute oncology). Tidak ditemukan rekam jejak pengobatan kanker atau keluhan ginekologi sebelum polis aktif.</li></ul>`,
        createdAt: new Date(baseDate.getTime() + 1000 * 60 * 60 * 6),
        authorId: "inv-005",
        author: { id: "inv-005", name: "Akbar Ramadhan", role: "INVESTIGATOR" },
        isApproved: true,
        approvedAt: new Date(baseDate.getTime() + 1000 * 60 * 60 * 6 + 1000 * 60 * 20)
      }
    ];
  }

  return [];
};



export function CaseDetailView({ caseData }: CaseDetailViewProps) {
  const { user } = useAuth();
  const { updateCase } = useCases();
  const STORAGE_KEY = `investihub-comments-${caseData.id}`;
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [comments, setComments] = useState<CommentWithAuthor[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const seeded = getInitialCommentsForCase(caseData.id);
          const hasSeeded = parsed.some((c: CommentWithAuthor) => c.id.startsWith("comment-inv-"));
          if (seeded.length > 0 && !hasSeeded) {
            return [...seeded, ...parsed];
          }
          return parsed;
        }
      } catch (e) {
        console.error("Failed to load comments from local storage", e);
      }
    }
    return getInitialCommentsForCase(caseData.id);
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
    }
  }, [comments, STORAGE_KEY]);
  const isCompleted = caseData.status === "CLOSED" || caseData.status === "ARCHIVED";
  const [showDetails, setShowDetails] = useState(isCompleted);
  const [showActions, setShowActions] = useState(false);
  const [isEditingCase, setIsEditingCase] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [investigators, setInvestigators] = useState<User[]>([]);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetch("/api/users")
        .then((res) => res.json())
        .then((data) => {
          if (data.users) {
            setInvestigators(data.users.filter((u: User) => u.role === "INVESTIGATOR"));
          }
        })
        .catch((err) => console.error("Failed to fetch investigators", err));
    }
  }, [user?.role]);

  const canComment = canPostComments(user?.role) && !isCompleted;

  const handleSubmitNote = (data: NoteFormData) => {
    if (!user) return;

    const comment: CommentWithAuthor = {
      id: `c-${Date.now()}`,
      caseId: caseData.id,
      content: data.content,
      contentHtml: data.contentHtml,
      attachments: data.attachments.length > 0 ? data.attachments : undefined,
      createdAt: new Date(),
      authorId: user.id,
      author: { id: user.id, name: user.name, role: user.role },
    };

    setComments((prev) => [...prev, comment]);

    // Automatically trigger status to ON_PROGRESS when the first field note is posted
    if (caseData.status === "NEW") {
      updateCase(caseData.id, { status: "ON_PROGRESS" });
    }
  };

  const router = useRouter();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const handleCompleteCase = () => {
    if (user?.role === "INVESTIGATOR") {
      updateCase(caseData.id, { status: "PENDING_APPROVAL" });
      alert("Pengajuan penyelesaian kasus berhasil dikirim ke Admin untuk ditinjau.");
    } else {
      updateCase(caseData.id, { status: "CLOSED" });
      alert("Kasus berhasil diselesaikan.");
    }
    router.push("/dashboard");
  };

  const handleApproveCaseCompletion = () => {
    updateCase(caseData.id, { status: "CLOSED" });
    alert("Kasus disetujui selesai.");
    router.push("/dashboard");
  };

  const handleRejectCaseCompletion = () => {
    updateCase(caseData.id, { status: "ON_PROGRESS" });
    alert("Pengajuan penyelesaian kasus ditolak. Kasus dikembalikan ke Proses Lapangan.");
    router.push("/dashboard");
  };

  const handleArchiveCase = () => {
    updateCase(caseData.id, { status: "ARCHIVED" });
    alert("Kasus telah diarsipkan.");
    router.push("/dashboard/archive");
  };

  const handleSaveCancelledCase = () => {
    setCancelModalOpen(false);
    alert("Kasus telah disimpan dengan status 'Dibatalkan'.");
    router.push("/dashboard");
  };

  const handleDeleteCase = () => {
    setCancelModalOpen(false);
    alert("Kasus berhasil dihapus secara permanen.");
    router.push("/dashboard");
  };

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [overrideStatusOpen, setOverrideStatusOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<CaseStatus | null>(null);

  const handleEditComment = (id: string, content: string, contentHtml?: string, attachments?: CommentAttachment[]) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, content, contentHtml, attachments } : c
      )
    );
  };

  const handleApproveComment = (id: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, isApproved: true, approvedAt: new Date() } : c
      )
    );
  };

  const handleClientAction = (id: string, action: "CONFIRMED" | "HOLD" | null) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, clientStatus: action } : c
      )
    );
  };

  const triggerDeleteComment = (id: string) => {
    setCommentToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const executeDeleteComment = () => {
    if (commentToDelete) {
      setComments((prev) => prev.filter((c) => c.id !== commentToDelete));
      setCommentToDelete(null);
    }
  };

  const filteredComments = comments.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const contentText = (c.content || "").toLowerCase();
    const authorName = (c.author?.name || "").toLowerCase();
    return contentText.includes(q) || authorName.includes(q);
  });

  const topLevelComments = filteredComments.filter(c => !c.parentId);

  const sortedComments = [...topLevelComments].sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
  });

  const getReplies = (parentId: string) => {
    return filteredComments
      .filter((c) => c.parentId === parentId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };

  const handleReplyComment = (parentId: string, content: string, contentHtml?: string, attachments?: CommentAttachment[]) => {
    if (!user) return;
    const comment: CommentWithAuthor = {
      id: `c-${Date.now()}`,
      caseId: caseData.id,
      parentId,
      content,
      contentHtml,
      attachments: attachments?.length ? attachments : undefined,
      createdAt: new Date(),
      authorId: user.id,
      author: { id: user.id, name: user.name, role: user.role },
    };
    setComments((prev) => [...prev, comment]);
  };

  if (isEditingCase) {
    return (
      <div className="mx-auto max-w-4xl pt-4">
        <CreateCaseForm 
          initialData={caseData} 
          caseId={caseData.id} 
          onCancel={() => setIsEditingCase(false)}
          onSuccess={() => setIsEditingCase(false)}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-4xl space-y-6"
    >
      {/* Header Info */}
      <div className="border-b border-neutral-200 pb-5">
        <div className="mb-3 flex flex-wrap gap-2 items-center justify-between">
          <StatusBadge status={caseData.status} />
          <div className="flex flex-wrap items-center gap-2">
            {user?.role === "ADMIN" && !isCompleted && (
              <button
                onClick={() => setIsEditingCase(true)}
                className="flex items-center gap-1.5 rounded-lg border border-primary bg-white px-2.5 py-1 text-[11px] font-bold text-primary shadow-sm hover:bg-neutral-50 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <span>Edit Info Kasus</span>
              </button>
            )}
            {(user?.role === "ADMIN" || user?.role === "INVESTIGATOR") && (
              <button
                onClick={async () => {
                  setIsGeneratingReport(true);
                  try {
                    // Only pass approved or confirmed comments to the report
                    const validComments = comments.filter(c => c.isApproved || c.clientStatus === "CONFIRMED");
                    await generateDocxReport(caseData, validComments);
                  } catch (e) {
                    console.error("Failed to generate report", e);
                  } finally {
                    setIsGeneratingReport(false);
                  }
                }}
                disabled={isGeneratingReport}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-[11px] font-bold text-neutral-700 shadow-sm hover:bg-neutral-50 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-200 disabled:opacity-50"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{isGeneratingReport ? "Menyiapkan..." : "Unduh Laporan (DOCX)"}</span>
              </button>
            )}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-1.5 rounded-lg border border-primary bg-primary px-2.5 py-1 text-[11px] font-bold text-white shadow-sm hover:bg-primary/95 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <span>{showDetails ? "Sembunyikan Informasi Kasus" : "Lihat Detail Informasi Kasus"}</span>
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200 text-white", showDetails && "rotate-180")} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {caseData.client.logo || COMPANY_LOGOS[caseData.client.companyName ?? caseData.client.name] ? (
            <Avatar className="h-10 w-10 shrink-0 rounded-md bg-white border border-neutral-100 shadow-sm">
              <AvatarImage 
                src={caseData.client.logo || COMPANY_LOGOS[caseData.client.companyName ?? caseData.client.name]} 
                alt={caseData.client.companyName ?? caseData.client.name} 
                className="object-contain p-1" 
              />
              <AvatarFallback className="rounded-md"><Building2 className="h-5 w-5" /></AvatarFallback>
            </Avatar>
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-neutral-100 border border-neutral-200">
               <Building2 className="h-5 w-5 text-neutral-500" />
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-foreground md:text-2xl">
              {caseData.insuredName}
            </h2>
            <p className="mt-0.5 font-mono text-sm text-muted-foreground">
              {caseData.policyNumber}
            </p>
          </div>
        </div>
      </div>

      {/* COLLAPSIBLE CASE DETAILS & TIMELINE */}
      {showDetails && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-6 rounded-xl bg-neutral-50/70 p-5 border border-neutral-200 animate-in slide-in-from-top duration-200"
        >
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Detail Kasus &amp; Polis
            </h3>
            <div className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-3">
              <DetailRow icon={User} label="Nama Tertanggung" value={caseData.insuredName} />
              <DetailRow
                icon={Building2}
                label="Perusahaan Asuransi"
                value={caseData.client.companyName ?? caseData.client.name}
              />
              {user?.role === "ADMIN" ? (
                <div className="flex items-start gap-3">
                  <User className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div className="w-full">
                    <p className="text-xs text-muted-foreground">Investigator</p>
                    <select
                      className="mt-1 w-full rounded-md border border-neutral-200 p-1 text-sm bg-neutral-50 focus:ring-primary focus:border-primary"
                      value={caseData.assigneeId || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        const inv = investigators.find((u) => u.id === val);
                        updateCase(caseData.id, {
                          assigneeId: val || null,
                          assignee: inv ? { id: inv.id, name: inv.name } : null,
                        });
                      }}
                    >
                      <option value="">Belum ditugaskan</option>
                      {investigators.map((inv) => (
                        <option key={inv.id} value={inv.id}>
                          {inv.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <DetailRow
                  icon={User}
                  label="Investigator"
                  value={caseData.assignee?.name ?? "Belum ditugaskan"}
                />
              )}
              <DetailRow
                icon={MapPin}
                label="Kota / Kabupaten"
                value={caseData.city ?? "Tidak ditentukan"}
              />
              <DetailRow
                icon={CalendarDays}
                label="Jadwal Keberangkatan"
                value={
                  caseData.scheduleInvestigator
                    ? formatDateTime(caseData.scheduleInvestigator)
                    : "Belum dijadwalkan"
                }
              />
              <DetailRow
                icon={FileText}
                label="Status"
                value={STATUS_LABELS[caseData.status]}
              />
              <DetailRow
                icon={Calendar}
                label="Dibuat"
                value={formatDate(caseData.createdAt)}
              />
              <DetailRow
                icon={Clock}
                label="Terakhir Diperbarui"
                value={formatDate(caseData.updatedAt)}
              />
              {caseData.description && (
                <div className="col-span-full border-t border-neutral-200 pt-4">
                  <p className="mb-1 text-xs text-muted-foreground">Deskripsi Umum</p>
                  <p className="text-sm leading-relaxed">{caseData.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* SECTION I: Latar Belakang Data Polis */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              I. Latar Belakang Data Polis
            </h3>
            <div className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-3">
              <DetailRow icon={FileText} label="Jenis Klaim" value={caseData.claimType ?? "-"} />
              <DetailRow icon={User} label="Pemegang Polis" value={caseData.policyHolder ?? "-"} />
              <DetailRow icon={CalendarDays} label="Tanggal Aplikasi Polis" value={caseData.applicationDate ?? "-"} />
              <DetailRow icon={CalendarDays} label="Tanggal Aktif Polis" value={caseData.activeDate ?? "-"} />
              <DetailRow icon={User} label="Beneficiary (Penerima Manfaat)" value={caseData.beneficiary ?? "-"} />
              <DetailRow icon={Clock} label="Usia Polis" value={caseData.policyAge ?? "-"} />
              <DetailRow icon={User} label="Nama Agen" value={caseData.agentName ?? "-"} />
            </div>
          </div>

          {/* SECTION II: Nilai Pertanggungan & Premi */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              II. Nilai Pertanggungan &amp; Premi
            </h3>
            <div className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-3">
              <DetailRow icon={FileText} label="Pertanggungan Dasar (Rp)" value={caseData.basicCoverage ?? "-"} />
              <DetailRow icon={FileText} label="WOP Benefit" value={caseData.wop ?? "-"} />
              <DetailRow icon={FileText} label="Flexi CI" value={caseData.flexiCi ?? "-"} />
              <DetailRow icon={FileText} label="ADDB Benefit" value={caseData.addb ?? "-"} />
              <DetailRow icon={FileText} label="Premi Bulanan/Tahunan (Rp)" value={caseData.premium ?? "-"} />
            </div>
          </div>

          {/* SECTION III: Riwayat Medis & Perawatan */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              III. Riwayat Medis &amp; Perawatan
            </h3>
            <div className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-5 sm:grid-cols-2">
              <DetailRow icon={CalendarDays} label="Tanggal Perawatan" value={caseData.treatmentDate ?? "-"} />
              <DetailRow icon={MapPin} label="Tempat & Dokter Perawatan" value={caseData.treatmentPlace ?? "-"} />
              {caseData.diagnosis && (
                <div className="col-span-full border-t border-neutral-200 pt-3">
                  <p className="mb-1 text-xs text-muted-foreground">Diagnosa Penyakit</p>
                  <p className="text-sm leading-relaxed">{caseData.diagnosis}</p>
                </div>
              )}
            </div>
          </div>

          {/* SECTION IV: Informasi Alamat Tertanggung */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              IV. Informasi Alamat Tertanggung
            </h3>
            <div className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-5">
              <div>
                <p className="mb-1 text-xs text-muted-foreground">Alamat KTP</p>
                <p className="text-sm leading-relaxed">{caseData.addressKtp ?? "-"}</p>
              </div>
              {caseData.addressSpaj && (
                <div className="border-t border-neutral-200 pt-3">
                  <p className="mb-1 text-xs text-muted-foreground">Alamat SPAJ / Tempat Usaha</p>
                  <p className="text-sm leading-relaxed">{caseData.addressSpaj}</p>
                </div>
              )}
            </div>
          </div>

          {/* SECTION V: Target Investigasi & Checklist Dokumen */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              V. Target Investigasi &amp; Checklist Dokumen
            </h3>
            <div className="grid gap-6 rounded-xl border border-neutral-200 bg-white p-5 sm:grid-cols-2">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Target Utama Investigasi</p>
                {caseData.investigationTargets && caseData.investigationTargets.length > 0 ? (
                  <ul className="list-disc pl-5 text-sm space-y-1.5 text-neutral-700">
                    {caseData.investigationTargets.map((target, idx) => (
                      <li key={idx}>{target}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Tidak ada target yang ditentukan</p>
                )}
              </div>

              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Checklist Dokumen Pendukung</p>
                {caseData.documentChecklist && caseData.documentChecklist.length > 0 ? (
                  <div className="grid grid-cols-1 gap-1.5">
                    {caseData.documentChecklist.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-neutral-700">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Tidak ada dokumen yang dicentang</p>
                )}
              </div>
            </div>
          </div>

          {/* Case Uploaded Documents */}
          {caseData.documents && caseData.documents.length > 0 && (
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Dokumen &amp; Lampiran Hasil Lapangan
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {caseData.documents.map((doc) => (
                  <AttachmentDisplay key={doc.id} attachment={doc} />
                ))}
              </div>
            </div>
          )}

          {/* Collapse Button at the Bottom */}
          <div className="flex justify-end border-t border-neutral-200 pt-4 mt-6">
            <button
              onClick={() => setShowDetails(false)}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3.5 py-2 text-[11px] font-bold text-neutral-600 shadow-sm hover:bg-neutral-50 hover:text-neutral-900 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-200"
            >
              <ChevronDown className="h-3.5 w-3.5 rotate-180" />
              <span>Sembunyikan Informasi Kasus</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* MAIN REPORT SECTION */}
      <section className="pb-8">
        <div className="mb-4 flex items-center justify-between border-b border-neutral-100 pb-3">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
            <MessageSquare className="h-4.5 w-4.5 text-primary" />
            Laporan Investigasi &amp; Catatan Lapangan
          </h3>
          <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
            {comments.length} Laporan
          </span>
        </div>

        {canComment && (
          <div className="mb-6">
            <NoteForm
              onSubmit={handleSubmitNote}
              placeholder={
                user?.role === "CLIENT"
                  ? "Tulis catatan atau respon di sini..."
                  : "Tulis laporan investigasi harian / laporan temuan lapangan di sini..."
              }
              submitLabel="Posting Laporan"
            />
          </div>
        )}

        {comments.length > 0 && (
          <div className="mb-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari laporan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all"
              />
            </div>
            <div className="relative w-full sm:w-40 shrink-0">
              <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
                className="w-full appearance-none rounded-md border border-input bg-background pl-8 pr-8 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all cursor-pointer"
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        )}

        <div className="space-y-4">
          {sortedComments.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-200 p-8 text-center bg-neutral-50/50">
              <MessageSquare className="mx-auto h-8 w-8 text-neutral-300 mb-2" />
              {comments.length === 0 ? (
                <>
                  <p className="text-sm font-medium text-neutral-600">Belum ada laporan lapangan</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Investigator dapat memposting temuan harian di atas
                  </p>
                </>
              ) : (
                <p className="text-sm font-medium text-neutral-600">Laporan tidak ditemukan</p>
              )}
            </div>
          ) : (
            sortedComments.map((comment, index) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                index={index}
                onEdit={handleEditComment}
                onDelete={triggerDeleteComment}
                onReply={!isCompleted ? handleReplyComment : undefined}
                onApprove={handleApproveComment}
                onClientAction={handleClientAction}
                currentUser={user}
                canManage={user?.role === "ADMIN" || user?.id === comment.authorId}
                replies={getReplies(comment.id)}
              />
            ))
          )}
        </div>

        {!canComment && user?.role !== "CLIENT" && (
          <p className="mt-5 text-center text-sm text-muted-foreground">
            {isCompleted ? "Kasus sudah selesai atau diarsipkan." : "Masuk sebagai Investigator atau Admin untuk mengunggah laporan"}
          </p>
        )}

        {/* Case Actions */}
        {(user?.role === "ADMIN" || user?.role === "INVESTIGATOR") && (
          <div className="mt-8 border-t border-neutral-200 pt-8 flex flex-col items-center">
            <button
              onClick={() => setShowActions(!showActions)}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <span>{showActions ? "Tutup pengaturan" : "Atur Status Kasus"}</span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", showActions && "rotate-180")} />
            </button>
            
            {showActions && (
              <div className="mt-5 flex w-full max-w-sm flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                {user?.role === "ADMIN" && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                    <label className="mb-1.5 block text-xs font-semibold text-red-700">Admin Override Status</label>
                    <select
                      value={caseData.status}
                      onChange={(e) => {
                        setPendingStatus(e.target.value as CaseStatus);
                        setOverrideStatusOpen(true);
                      }}
                      className="w-full rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    >
                      {Object.entries(STATUS_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                    <p className="mt-1.5 text-[10px] text-red-600 leading-tight">Gunakan fitur ini hanya untuk mengembalikan status akibat Human Error.</p>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-3">
                  {caseData.status === "PENDING_APPROVAL" ? (
                    user?.role === "ADMIN" ? (
                      <>
                        <button 
                          onClick={handleApproveCaseCompletion}
                          className="flex-1 rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
                        >
                          Setujui Selesai
                        </button>
                        <button 
                          onClick={handleRejectCaseCompletion}
                          className="flex-1 rounded-md bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 transition-colors"
                        >
                          Tolak & Kembalikan
                        </button>
                      </>
                    ) : (
                      <div className="flex-1 text-center py-2 px-4 bg-purple-50 border border-purple-200 rounded-md text-purple-700 text-sm font-semibold">
                        Menunggu Persetujuan Admin
                      </div>
                    )
                  ) : (
                    caseData.status !== "CLOSED" && caseData.status !== "ARCHIVED" && (
                      <button 
                        onClick={handleCompleteCase}
                        className="flex-1 rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
                      >
                        {user?.role === "INVESTIGATOR" ? "Ajukan Penyelesaian" : "Tandai Selesai"}
                      </button>
                    )
                  )}
                  {caseData.status === "CLOSED" && (
                    <button 
                      onClick={handleArchiveCase}
                      className="flex-1 rounded-md bg-neutral-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-neutral-700 transition-colors"
                    >
                      Arsipkan Kasus
                    </button>
                  )}
                  <button 
                    onClick={() => setCancelModalOpen(true)}
                    className="flex-1 rounded-md bg-destructive px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-destructive/90 transition-colors"
                  >
                    Batalkan Kasus
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Reusable Confirm Modal for Deletion */}
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={executeDeleteComment}
        title="Hapus Laporan Lapangan"
        message="Apakah Anda yakin ingin menghapus laporan investigasi / catatan lapangan ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        cancelText="Batal"
        isDestructive={true}
      />
      {/* Cancel Case Custom Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-5 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-foreground">Batalkan Kasus</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                Apakah Anda ingin menyimpan riwayat kasus ini dengan status dibatalkan, atau menghapusnya secara permanen dari sistem?
              </p>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSaveCancelledCase}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
              >
                Simpan
              </button>
              <button
                onClick={handleDeleteCase}
                className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-white hover:bg-destructive/90 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Override Status Modal */}
      <ConfirmModal
        isOpen={overrideStatusOpen}
        onClose={() => {
          setOverrideStatusOpen(false);
          setPendingStatus(null);
        }}
        onConfirm={() => {
          if (pendingStatus) {
            updateCase(caseData.id, { status: pendingStatus });
            setOverrideStatusOpen(false);
            setPendingStatus(null);
            alert("Status berhasil diubah secara manual.");
            router.push("/dashboard");
          }
        }}
        title="Konfirmasi Override Status"
        message={`Apakah Anda yakin ingin memaksa mengubah status kasus ini menjadi "${pendingStatus ? STATUS_LABELS[pendingStatus] : ""}"? Tindakan ini dapat memengaruhi alur kerja kasus.`}
        confirmText="Lanjutkan"
        cancelText="Batalkan"
        isDestructive={false}
      />
    </motion.div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
