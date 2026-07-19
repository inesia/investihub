import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pengantar - InvestiHub Docs",
};

export default function DocsIntroduction() {
  return (
    <article className="prose prose-neutral prose-lg max-w-none prose-headings:font-bold prose-a:text-primary">
      <h1>Selamat Datang di InvestiHub</h1>
      
      <p className="lead">
        <strong>InvestiHub</strong> adalah platform manajemen kasus investigasi asuransi komprehensif yang dirancang untuk mempercepat, melacak, dan merapikan proses pelaporan lapangan antara pihak perusahaan asuransi, agensi investigasi, dan investigator lapangan.
      </p>

      <h2>Mengapa InvestiHub?</h2>
      <p>
        Sebelumnya, proses investigasi klaim asuransi seringkali terhambat oleh lambatnya komunikasi melalui email atau grup chat yang tidak terstruktur. InvestiHub menyelesaikan masalah ini dengan menyediakan <strong>Kanban Board</strong> terpadu, di mana semua pihak dapat memantau status kasus secara <em>real-time</em>.
      </p>

      <h3>Fitur Utama</h3>
      <ul>
        <li>
          <strong>Kanban Board Terpusat:</strong> Pantau kasus berdasarkan status (Terkirim, Menunggu Investigator, Investigasi Berjalan, Selesai).
        </li>
        <li>
          <strong>Manajemen Laporan Lapangan:</strong> Investigator dapat langsung mengunggah progres harian dari lapangan secara kronologis beserta foto/lampiran.
        </li>
        <li>
          <strong>Interaksi Multi-Pihak:</strong> Klien (Asuransi) dapat menyetujui, menunda, atau meminta revisi laporan langsung di dalam satu halaman yang sama tanpa harus membuka email.
        </li>
        <li>
          <strong>Pembuatan Dokumen Otomatis (Auto-DOCX):</strong> Susunan laporan harian yang telah diverifikasi dan disetujui akan di-<em>compile</em> secara otomatis menjadi laporan resmi format Microsoft Word dalam satu klik.
        </li>
      </ul>

      <hr />

      <h2>Mulai Menggunakan</h2>
      <p>
        Untuk mulai menjelajahi panduan ini, silakan pilih topik di menu navigasi sebelah kiri (atau klik menu di bawah ini jika Anda menggunakan tampilan desktop). 
      </p>
      
      <ul>
        <li><a href="/docs/roles">Pelajari Peran & Akses Pengguna &rarr;</a></li>
        <li><a href="/docs/cases">Pelajari Manajemen Kasus &rarr;</a></li>
      </ul>
    </article>
  );
}
