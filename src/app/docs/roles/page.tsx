import { Metadata } from "next";
import { Users, ShieldAlert, UserCheck, Briefcase } from "lucide-react";

export const metadata: Metadata = {
  title: "Peran & Akses - InvestiHub Docs",
};

export default function DocsRoles() {
  return (
    <article className="prose prose-neutral prose-lg max-w-none prose-headings:font-bold prose-a:text-primary">
      <h1 id="peran" className="flex items-center gap-3">
        <Users className="h-8 w-8 text-primary" />
        Peran &amp; Hak Akses
      </h1>
      
      <p className="lead">
        Aplikasi InvestiHub memisahkan akses pengguna ke dalam tiga peran utama untuk memastikan keamanan dan kerahasiaan data: <strong>Admin</strong>, <strong>Investigator</strong>, dan <strong>Client</strong>.
      </p>

      <div className="bg-slate-50 border p-4 rounded-lg not-prose mb-8">
        <h4 className="font-semibold mb-2">Di Halaman Ini:</h4>
        <ul className="text-sm space-y-1 flex flex-col">
          <li><a href="#admin" className="text-primary hover:underline">1. Admin (Administrator)</a></li>
          <li><a href="#investigator" className="text-primary hover:underline">2. Investigator</a></li>
          <li><a href="#client" className="text-primary hover:underline">3. Client (Klien Asuransi)</a></li>
        </ul>
      </div>

      <h2 id="admin" className="flex items-center gap-2 text-slate-800">
        <ShieldAlert className="h-6 w-6 text-red-500" />
        1. Admin (Administrator)
      </h2>
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

      <h2 id="investigator" className="flex items-center gap-2 text-slate-800">
        <Briefcase className="h-6 w-6 text-emerald-600" />
        2. Investigator
      </h2>
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

      <h2 id="client" className="flex items-center gap-2 text-slate-800">
        <UserCheck className="h-6 w-6 text-blue-600" />
        3. Client (Klien Asuransi)
      </h2>
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
