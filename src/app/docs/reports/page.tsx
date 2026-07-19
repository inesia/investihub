import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Laporan & Export - InvestiHub Docs",
};

export default function DocsReports() {
  return (
    <article className="prose prose-neutral prose-lg max-w-none prose-headings:font-bold prose-a:text-primary">
      <h1>Laporan &amp; Export DOCX</h1>
      
      <p className="lead">
        Keunggulan utama InvestiHub terletak pada transparansi pelaporan lapangan yang bersifat <em>real-time</em> dan alur persetujuan Klien yang cepat.
      </p>

      <h2>Alur Pelaporan Lapangan</h2>
      <p>
        Alih-alih mengirimkan laporan PDF besar setelah kasus selesai, Investigator dituntut untuk memberikan pembaruan (<em>update</em>) berkala langsung dari lapangan melalui halaman Detail Kasus.
      </p>

      <ol>
        <li><strong>Unggah Progres:</strong> Investigator memposting catatan pencarian faskes/wawancara. Teks dapat diformat secara <em>rich-text</em> (bold, list, dll).</li>
        <li><strong>Notifikasi:</strong> Admin dan Klien akan dapat melihat progres tersebut secara langsung.</li>
        <li><strong>Validasi Admin:</strong> Admin dari PT Global Investigasi wajib menekan tombol <strong>Setujui Laporan</strong> untuk memastikan bahasa laporan sudah pantas dan sesuai standar mutu sebelum dibaca secara final oleh klien.</li>
      </ol>

      <h2>Interaksi Klien (Client Approval)</h2>
      <p>
        Klien asuransi tidak perlu membalas email untuk meminta keterangan lebih lanjut. Mereka dapat berinteraksi langsung pada laporan spesifik:
      </p>
      <ul>
        <li><strong>Konfirmasi (Confirm):</strong> Jika laporan dianggap memuaskan.</li>
        <li><strong>Tunda / Minta Revisi (On Hold):</strong> Jika ada bukti yang kurang atau informasi yang dirasa tidak sinkron.</li>
        <li><strong>Balas (Reply):</strong> Klien dapat menyematkan instruksi spesifik di bawah laporan investigator (contoh: "Tolong tanyakan ke pihak rekam medis perihal tanggal masuk IGD").</li>
      </ul>

      <hr />

      <h2>Auto-Generate Laporan Resmi (DOCX)</h2>
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

      <p>
        <em>Catatan: Fitur Unduh Laporan ini diproses 100% pada sistem Server sehingga sangat cepat dan tidak membebani perangkat browser klien.</em>
      </p>

    </article>
  );
}
