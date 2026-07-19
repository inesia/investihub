import { Metadata } from "next";
import Image from "next/image";
import { FileText, Map, MessageSquare, Download, CheckCircle, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Laporan & Export - InvestiHub Docs",
};

export default function DocsReports() {
  return (
    <article className="prose prose-neutral prose-lg max-w-none prose-headings:font-bold prose-a:text-primary">
      <h1 id="laporan" className="flex items-center gap-3">
        <FileText className="h-8 w-8 text-primary" />
        Laporan &amp; Export DOCX
      </h1>
      
      <p className="lead">
        Keunggulan utama InvestiHub terletak pada transparansi pelaporan lapangan yang bersifat <em>real-time</em> dan alur persetujuan Klien yang cepat.
      </p>

      <div className="bg-slate-50 border p-4 rounded-lg not-prose mb-8">
        <h4 className="font-semibold mb-2">Di Halaman Ini:</h4>
        <ul className="text-sm space-y-1 flex flex-col">
          <li><a href="#laporan" className="text-primary hover:underline">Laporan &amp; Export DOCX</a></li>
          <li><a href="#alur-pelaporan" className="text-primary hover:underline">Alur Pelaporan Lapangan</a></li>
          <li><a href="#interaksi-klien" className="text-primary hover:underline">Interaksi Klien (Client Approval)</a></li>
          <li><a href="#export-docx" className="text-primary hover:underline">Auto-Generate Laporan Resmi</a></li>
        </ul>
      </div>

      <figure className="my-8 rounded-xl border bg-slate-50 p-2 shadow-sm">
        <Image 
          src="/images/docs/reports.png" 
          alt="Ilustrasi Antarmuka Laporan" 
          width={800} 
          height={400} 
          className="rounded-lg border w-full h-auto"
        />
        <figcaption className="text-center text-sm text-slate-500 mt-2">
          Antarmuka chat interaktif untuk laporan kronologis.
        </figcaption>
      </figure>

      <h2 id="alur-pelaporan" className="flex items-center gap-2">
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

      <h2 id="interaksi-klien" className="flex items-center gap-2">
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

      <hr />

      <h2 id="export-docx" className="flex items-center gap-2">
        <Download className="h-6 w-6 text-primary" />
        Auto-Generate Laporan Resmi (DOCX)
      </h2>
      <p>
        Membuat laporan akhir adalah salah satu hal yang paling memakan waktu bagi agensi investigasi. InvestiHub telah mengotomatisasi proses ini secara cerdas.
      </p>

      <p>
        Cukup tekan tombol <strong>"Unduh Laporan (DOCX)"</strong> pada halaman kasus. Sistem akan secara cerdas:
      </p>
      <ol>
        <li>Menyusun halaman <em>Cover</em> resmi dengan logo perusahaan dan detail kasus.</li>
        <li>Menggabungkan (<em>compile</em>) seluruh laporan lapangan yang <strong>telah disetujui / dikonfirmasi</strong>.</li>
        <li>Mengabaikan laporan yang masih berstatus <em>On Hold</em> atau ditolak (draft).</li>
        <li>Meng-<em>export</em> dokumen dalam format <code>.docx</code> yang dapat langsung diedit di Microsoft Word untuk penyesuaian akhir (<em>finishing touch</em>).</li>
      </ol>

      <div className="rounded-lg bg-blue-50 p-4 border border-blue-100 text-blue-900 text-sm">
        <strong>Catatan:</strong> Fitur Unduh Laporan ini diproses 100% pada sistem Server sehingga sangat cepat dan tidak membebani perangkat browser klien.
      </div>

    </article>
  );
}
