import { Metadata } from "next";
import Image from "next/image";
import { 
  Sparkles, HelpCircle, Layers, 
  Users, ShieldAlert, UserCheck, Briefcase, 
  Trello, ArrowRight, Eye, MousePointerClick, 
  FileText, Map, MessageSquare, Download, CheckCircle, Clock 
} from "lucide-react";

export const metadata: Metadata = {
  title: "Panduan Penggunaan - InvestiHub",
};

export default function DocsPage() {
  return (
    <div className="prose prose-neutral prose-lg max-w-none prose-headings:font-bold prose-a:text-primary pb-32">
      {/* ===================== PENGANTAR ===================== */}
      <section id="pengantar" className="scroll-mt-24 pt-8">
        <h1 className="flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-primary" />
          Selamat Datang di InvestiHub
        </h1>
        
        <p className="lead">
          <strong>InvestiHub</strong> adalah platform manajemen kasus investigasi asuransi komprehensif yang dirancang untuk mempercepat, melacak, dan merapikan proses pelaporan lapangan antara pihak perusahaan asuransi, agensi investigasi, dan investigator lapangan.
        </p>

        <figure className="my-8 rounded-xl border bg-slate-50 p-2 shadow-sm">
          <Image 
            src="/images/docs/cover.JPG" 
            alt="Cover Buku Panduan" 
            width={800} 
            height={400} 
            className="rounded-lg border w-full h-auto"
          />
          <figcaption className="text-center text-sm text-slate-500 mt-2">
            Dokumentasi Resmi Aplikasi InvestiHub.
          </figcaption>
        </figure>

        <h2 className="flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-primary" />
          Mengapa InvestiHub?
        </h2>
        <p>
          Sebelumnya, proses investigasi klaim asuransi seringkali terhambat oleh lambatnya komunikasi melalui email atau grup chat yang tidak terstruktur. InvestiHub menyelesaikan masalah ini dengan menyediakan <strong>Kanban Board</strong> terpadu, di mana semua pihak dapat memantau status kasus secara <em>real-time</em>.
        </p>

        <h3 className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          Fitur Utama
        </h3>
        <ul>
          <li><strong>Kanban Board Terpusat:</strong> Pantau kasus berdasarkan status.</li>
          <li><strong>Manajemen Laporan Lapangan:</strong> Investigator dapat langsung mengunggah progres harian.</li>
          <li><strong>Interaksi Multi-Pihak:</strong> Klien (Asuransi) dapat menyetujui, menunda, atau meminta revisi.</li>
          <li><strong>Pembuatan Dokumen Otomatis (Auto-DOCX):</strong> Susunan laporan harian di-<em>compile</em> menjadi laporan resmi Microsoft Word.</li>
        </ul>

        <figure className="my-8 rounded-xl border bg-slate-50 p-2 shadow-sm">
          <Image 
            src="/images/docs/loginpage.JPG" 
            alt="Halaman Login InvestiHub" 
            width={800} 
            height={400} 
            className="rounded-lg border w-full h-auto"
          />
          <figcaption className="text-center text-sm text-slate-500 mt-2">
            Halaman masuk aplikasi InvestiHub.
          </figcaption>
        </figure>
      </section>

      <hr className="my-16 border-dashed border-neutral-300" />

      {/* ===================== PERAN & AKSES ===================== */}
      <section id="peran" className="scroll-mt-24">
        <h1 className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          Peran &amp; Hak Akses
        </h1>
        
        <p className="lead">
          Aplikasi InvestiHub memisahkan akses pengguna ke dalam tiga peran utama untuk memastikan keamanan dan kerahasiaan data: <strong>Admin</strong>, <strong>Investigator</strong>, dan <strong>Client</strong>.
        </p>

        <h2 id="admin" className="flex items-center gap-2 text-slate-800">
          <ShieldAlert className="h-6 w-6 text-red-500" />
          1. Admin (Administrator)
        </h2>
        <p>Admin adalah pengelola utama sistem. Role ini dipegang oleh staf internal PT Global Investigasi.</p>
        <ul>
          <li>Dapat mendaftarkan pengguna baru (Client atau Investigator).</li>
          <li>Dapat mendaftarkan kasus baru (Assign Client & Assign Investigator).</li>
          <li>Dapat mengubah detail informasi kasus.</li>
          <li>Dapat mengesampingkan (override) status kasus secara sepihak jika diperlukan.</li>
          <li>Memiliki akses penuh untuk membaca dan merespons seluruh laporan dari semua kasus.</li>
          <li>Dapat mengunduh (download) Laporan Akhir.</li>
        </ul>

        <figure className="my-8 rounded-xl border bg-slate-50 p-2 shadow-sm">
          <Image 
            src="/images/docs/role.JPG" 
            alt="Pengaturan Peran dan Pengguna" 
            width={800} 
            height={400} 
            className="rounded-lg border w-full h-auto"
          />
          <figcaption className="text-center text-sm text-slate-500 mt-2">
            Pengaturan peran pengguna dan hak akses.
          </figcaption>
        </figure>

        <h2 id="investigator" className="flex items-center gap-2 text-slate-800 mt-12">
          <Briefcase className="h-6 w-6 text-emerald-600" />
          2. Investigator
        </h2>
        <p>Investigator adalah tim lapangan yang bertugas mengecek fakta medis atau non-medis.</p>
        <ul>
          <li>Hanya bisa melihat kasus yang ditugaskan kepada dirinya.</li>
          <li>Dapat mengunggah <strong>Laporan / Catatan Lapangan</strong> (teks & gambar/lampiran).</li>
          <li>Dapat merespons tanggapan dari Klien atau Admin.</li>
          <li>Tidak dapat memanipulasi informasi dasar kasus, namun dapat mengubah status investigasi berjalan.</li>
          <li>Dapat mengunduh Laporan Akhir setelah semua laporannya disetujui.</li>
        </ul>

        <h2 id="client" className="flex items-center gap-2 text-slate-800 mt-12">
          <UserCheck className="h-6 w-6 text-blue-600" />
          3. Client (Klien Asuransi)
        </h2>
        <p>Client mewakili pihak perusahaan asuransi (contoh: PT Allianz, PT Prudential) yang mempercayakan kasus kepada agensi.</p>
        <ul>
          <li>Hanya dapat melihat kasus yang di-assign kepada perusahaan mereka.</li>
          <li>Dapat melihat perkembangan kasus secara <em>real-time</em> melalui halaman Detail Kasus.</li>
          <li><strong>Tidak dapat membuat Laporan Lapangan baru</strong>, namun dapat memberikan <strong>Tanggapan/Balasan</strong> pada setiap laporan dari Investigator.</li>
          <li>Mempunyai hak untuk mengubah status laporan dari Investigator (<em>Confirm</em>, <em>On Hold</em>, atau <em>Request Revision</em>).</li>
          <li>Tidak dapat mengunduh format DOCX.</li>
        </ul>

        <figure className="my-8 rounded-xl border bg-slate-50 p-2 shadow-sm">
          <Image 
            src="/images/docs/dashboardklien.JPG" 
            alt="Dashboard Klien" 
            width={800} 
            height={400} 
            className="rounded-lg border w-full h-auto"
          />
          <figcaption className="text-center text-sm text-slate-500 mt-2">
            Tampilan dashboard khusus untuk Klien (Perusahaan Asuransi).
          </figcaption>
        </figure>
      </section>

      <hr className="my-16 border-dashed border-neutral-300" />

      {/* ===================== MANAJEMEN KASUS ===================== */}
      <section id="kasus" className="scroll-mt-24">
        <h1 className="flex items-center gap-3">
          <Trello className="h-8 w-8 text-primary" />
          Manajemen Kasus (Kanban)
        </h1>
        
        <p className="lead">
          Untuk memberikan <em>bird&apos;s eye view</em> yang jelas terhadap semua operasional investigasi, InvestiHub mengadopsi sistem manajemen <strong>Kanban Board</strong>.
        </p>

        <figure className="my-8 rounded-xl border bg-slate-50 p-2 shadow-sm">
          <Image 
            src="/images/docs/kanban.JPG" 
            alt="Ilustrasi Kanban Board" 
            width={800} 
            height={400} 
            className="rounded-lg border w-full h-auto"
          />
          <figcaption className="text-center text-sm text-slate-500 mt-2">
            Tampilan Kanban Board yang modern dan mudah dipahami.
          </figcaption>
        </figure>

        <h2 className="flex items-center gap-2">
          <ArrowRight className="h-6 w-6 text-primary" />
          Alur Status Kasus
        </h2>
        <p>
          Setiap kasus baru yang diinput oleh Admin akan masuk ke dalam kolom yang paling kiri, dan secara bertahap dipindahkan ke kanan seiring dengan progres investigasi.
        </p>

        <div className="my-8 flex flex-col space-y-4">
          <div className="rounded-lg border p-4 bg-white shadow-sm border-l-4 border-l-slate-400 flex gap-4 items-start">
            <div className="flex-1">
              <h3 className="mt-0 text-slate-700">1. Terkirim Klien (SUBMITTED)</h3>
              <p className="mb-0 text-sm">Kasus baru saja didaftarkan oleh Admin dari data klaim Klien, namun belum ditugaskan kepada Investigator manapun.</p>
            </div>
          </div>
          <div className="rounded-lg border p-4 bg-white shadow-sm border-l-4 border-l-orange-400 flex gap-4 items-start">
            <div className="flex-1">
              <h3 className="mt-0 text-orange-700">2. Menunggu Investigator (ASSIGNED)</h3>
              <p className="mb-0 text-sm">Admin telah memilih Investigator untuk kasus ini. Investigator sedang mempelajari berkas dan menyusun rencana keberangkatan.</p>
            </div>
          </div>
          <div className="rounded-lg border p-4 bg-white shadow-sm border-l-4 border-l-blue-500 flex gap-4 items-start">
            <div className="flex-1">
              <h3 className="mt-0 text-blue-700">3. Investigasi Berjalan (ON_PROGRESS)</h3>
              <p className="mb-0 text-sm">Investigator mulai turun ke lapangan, mendatangi faskes, atau mewawancarai saksi. Laporan dikirimkan secara parsial ke dalam sistem.</p>
            </div>
          </div>
          <div className="rounded-lg border p-4 bg-white shadow-sm border-l-4 border-l-emerald-500 flex gap-4 items-start">
            <div className="flex-1">
              <h3 className="mt-0 text-emerald-700">4. Selesai / Ditutup (COMPLETED)</h3>
              <p className="mb-0 text-sm">Semua investigasi telah tuntas. Laporan telah disetujui, dan dokumen laporan akhir diserahkan ke Klien.</p>
            </div>
          </div>
        </div>

        <h2 className="flex items-center gap-2 mt-12">
          <Eye className="h-6 w-6 text-primary" />
          Halaman Detail Kasus
        </h2>
        <p>
          Ketika Anda mengklik salah satu kartu kasus di papan Kanban <MousePointerClick className="inline h-4 w-4 text-slate-400" />, Anda akan diarahkan ke halaman <strong>Detail Kasus</strong>.
        </p>
        <ul>
          <li><strong>Area Atas:</strong> Berisi rangkuman metadata kasus (Nama Tertanggung, Nomor Polis, Faskes, Kota, dll).</li>
          <li><strong>Area Bawah (Timeline):</strong> Berisi riwayat laporan lapangan yang berjalan secara kronologis layaknya <em>feed</em> sosial media.</li>
        </ul>

        <figure className="my-8 rounded-xl border bg-slate-50 p-2 shadow-sm">
          <Image 
            src="/images/docs/details.JPG" 
            alt="Halaman Detail Kasus" 
            width={800} 
            height={400} 
            className="rounded-lg border w-full h-auto"
          />
          <figcaption className="text-center text-sm text-slate-500 mt-2">
            Timeline interaktif pada Detail Kasus.
          </figcaption>
        </figure>
      </section>

      <hr className="my-16 border-dashed border-neutral-300" />

      {/* ===================== LAPORAN & EXPORT ===================== */}
      <section id="laporan" className="scroll-mt-24">
        <h1 className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          Laporan &amp; Export DOCX
        </h1>
        
        <p className="lead">
          Keunggulan utama InvestiHub terletak pada transparansi pelaporan lapangan yang bersifat <em>real-time</em> dan alur persetujuan Klien yang cepat.
        </p>

        <h2 className="flex items-center gap-2">
          <Map className="h-6 w-6 text-primary" />
          Alur Pelaporan Lapangan
        </h2>
        <p>
          Alih-alih mengirimkan laporan PDF besar setelah kasus selesai, Investigator dituntut untuk memberikan pembaruan (<em>update</em>) berkala langsung dari lapangan melalui halaman Detail Kasus.
        </p>

        <ol>
          <li><strong>Unggah Progres:</strong> Investigator memposting catatan pencarian faskes/wawancara. Teks dapat diformat secara <em>rich-text</em> (bold, list, dll).</li>
          <li><strong>Notifikasi:</strong> Admin dan Klien akan dapat melihat progres tersebut secara langsung.</li>
          <li><strong>Validasi Admin:</strong> Admin dari PT Global Investigasi wajib menekan tombol <strong>Setujui Laporan</strong> untuk memastikan bahasa laporan sudah pantas dan sesuai standar mutu sebelum dibaca secara final oleh klien.</li>
        </ol>

        <h2 className="flex items-center gap-2 mt-12">
          <MessageSquare className="h-6 w-6 text-primary" />
          Interaksi Klien (Client Approval)
        </h2>
        <p>
          Klien asuransi tidak perlu membalas email untuk meminta keterangan lebih lanjut. Mereka dapat berinteraksi langsung pada laporan spesifik:
        </p>
        <ul className="list-none pl-0">
          <li className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span><strong>Konfirmasi (Confirm):</strong> Jika laporan dianggap memuaskan.</span>
          </li>
          <li className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-orange-500" />
            <span><strong>Tunda / Minta Revisi (On Hold):</strong> Jika ada bukti yang kurang atau informasi yang dirasa tidak sinkron.</span>
          </li>
          <li className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            <span><strong>Balas (Reply):</strong> Klien dapat menyematkan instruksi spesifik di bawah laporan investigator.</span>
          </li>
        </ul>

        <h2 className="flex items-center gap-2 mt-12">
          <Download className="h-6 w-6 text-primary" />
          Auto-Generate Laporan Resmi (DOCX)
        </h2>
        <p>
          Membuat laporan akhir adalah salah satu hal yang paling memakan waktu bagi agensi investigasi. InvestiHub telah mengotomatisasi proses ini secara cerdas.
        </p>

        <p>
          Cukup tekan tombol <strong>&quot;Unduh Laporan (DOCX)&quot;</strong> pada halaman kasus. Sistem akan secara cerdas:
        </p>
        <ol>
          <li>Menyusun halaman <em>Cover</em> resmi dengan logo perusahaan dan detail kasus.</li>
          <li>Menggabungkan (<em>compile</em>) seluruh laporan lapangan yang <strong>telah disetujui / dikonfirmasi</strong>.</li>
          <li>Mengabaikan laporan yang masih berstatus <em>On Hold</em> atau ditolak (draft).</li>
          <li>Meng-<em>export</em> dokumen dalam format <code>.docx</code> yang dapat langsung diedit di Microsoft Word untuk penyesuaian akhir (<em>finishing touch</em>).</li>
        </ol>

        <div className="rounded-lg bg-blue-50 p-4 border border-blue-100 text-blue-900 text-sm mt-8">
          <strong>Catatan:</strong> Fitur Unduh Laporan ini diproses 100% pada sistem Server sehingga sangat cepat dan tidak membebani perangkat browser klien.
        </div>
      </section>

      <hr className="my-16 border-dashed border-neutral-300" />

      {/* ===================== TECH STACK ===================== */}
      <section id="stack" className="scroll-mt-24">
        <h1 className="flex items-center gap-3">
          <Layers className="h-8 w-8 text-primary" />
          Tech Stack
        </h1>
        
        <p className="lead">
          InvestiHub dibangun menggunakan teknologi web modern untuk memastikan performa yang sangat cepat, pengalaman pengguna yang <em>real-time</em>, dan keamanan tinggi.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="border border-neutral-200 rounded-lg p-6 bg-white shadow-sm">
            <h3 className="mt-0 text-lg"><strong>Frontend</strong></h3>
            <ul className="text-sm">
              <li><strong>Next.js 15 (App Router):</strong> Framework React super cepat dengan Server Components.</li>
              <li><strong>React 19:</strong> Library UI terbaru untuk antarmuka interaktif.</li>
              <li><strong>Tailwind CSS 4:</strong> Framework styling berbasis utilitas yang sangat ringan dan mudah di-<em>custom</em>.</li>
              <li><strong>Lucide React:</strong> Ikon SVG minimalis nan elegan.</li>
            </ul>
          </div>
          <div className="border border-neutral-200 rounded-lg p-6 bg-white shadow-sm">
            <h3 className="mt-0 text-lg"><strong>Backend & Data</strong></h3>
            <ul className="text-sm">
              <li><strong>Next.js API Routes:</strong> Serverless backend yang menyatu langsung dengan frontend.</li>
              <li><strong>DOCX Library:</strong> *Generator* dokumen Word di sisi server (Node.js) untuk menghasilkan laporan akhir yang rapi tanpa perlu Microsoft Office.</li>
            </ul>
          </div>
        </div>
      </section>

    </div>
  );
}
