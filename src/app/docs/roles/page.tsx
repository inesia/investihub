import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Peran & Akses - InvestiHub Docs",
};

export default function DocsRoles() {
  return (
    <article className="prose prose-neutral prose-lg max-w-none prose-headings:font-bold prose-a:text-primary">
      <h1>Peran &amp; Hak Akses</h1>
      
      <p className="lead">
        Aplikasi InvestiHub memisahkan akses pengguna ke dalam tiga peran utama untuk memastikan keamanan dan kerahasiaan data: <strong>Admin</strong>, <strong>Investigator</strong>, dan <strong>Client</strong>.
      </p>

      <h2>1. Admin (Administrator)</h2>
      <p>
        Admin adalah pengelola utama sistem. Role ini dipegang oleh staf internal PT Global Investigasi.
      </p>
      <ul>
        <li>Dapat mendaftarkan pengguna baru (Client atau Investigator).</li>
        <li>Dapat mendaftarkan kasus baru (Assign Client & Assign Investigator).</li>
        <li>Dapat mengubah detail informasi kasus.</li>
        <li>Dapat mengesampingkan (override) status kasus secara sepihak jika diperlukan.</li>
        <li>Memiliki akses penuh untuk membaca dan merespons seluruh laporan dari semua kasus.</li>
        <li>Dapat mengunduh (download) Laporan Akhir.</li>
      </ul>

      <h2>2. Investigator</h2>
      <p>
        Investigator adalah tim lapangan yang bertugas mengecek fakta medis atau non-medis.
      </p>
      <ul>
        <li>Hanya bisa melihat kasus yang ditugaskan kepada dirinya.</li>
        <li>Dapat mengunggah <strong>Laporan / Catatan Lapangan</strong> (teks & gambar/lampiran).</li>
        <li>Dapat merespons tanggapan dari Klien atau Admin.</li>
        <li>Tidak dapat memanipulasi informasi dasar kasus, namun dapat mengubah status investigasi berjalan.</li>
        <li>Dapat mengunduh Laporan Akhir setelah semua laporannya disetujui.</li>
      </ul>

      <h2>3. Client (Klien Asuransi)</h2>
      <p>
        Client mewakili pihak perusahaan asuransi (contoh: PT Allianz, PT Prudential) yang mempercayakan kasus kepada agensi.
      </p>
      <ul>
        <li>Hanya dapat melihat kasus yang di-assign kepada perusahaan mereka.</li>
        <li>Dapat melihat perkembangan kasus secara <em>real-time</em> melalui halaman Detail Kasus.</li>
        <li><strong>Tidak dapat membuat Laporan Lapangan baru</strong>, namun dapat memberikan <strong>Tanggapan/Balasan</strong> pada setiap laporan dari Investigator.</li>
        <li>Mempunyai hak untuk mengubah status laporan dari Investigator (<em>Confirm</em>, <em>On Hold</em>, atau <em>Request Revision</em>).</li>
        <li>Tidak dapat mengunduh format DOCX (Laporan resmi DOCX biasanya diberikan secara manual setelah finalisasi).</li>
      </ul>

    </article>
  );
}
