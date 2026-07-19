import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manajemen Kasus - InvestiHub Docs",
};

export default function DocsCases() {
  return (
    <article className="prose prose-neutral prose-lg max-w-none prose-headings:font-bold prose-a:text-primary">
      <h1>Manajemen Kasus (Kanban)</h1>
      
      <p className="lead">
        Untuk memberikan <em>bird&apos;s eye view</em> yang jelas terhadap semua operasional investigasi, InvestiHub mengadopsi sistem manajemen <strong>Kanban Board</strong>.
      </p>

      <h2>Alur Status Kasus (Kanban)</h2>
      <p>
        Setiap kasus baru yang diinput oleh Admin akan masuk ke dalam kolom yang paling kiri, dan secara bertahap dipindahkan ke kanan seiring dengan progres investigasi.
      </p>

      <div className="my-8 flex flex-col space-y-4">
        <div className="rounded-lg border p-4 bg-white shadow-sm border-l-4 border-l-slate-400">
          <h3 className="mt-0 text-slate-700">1. Terkirim Klien (SUBMITTED)</h3>
          <p className="mb-0 text-sm">Kasus baru saja didaftarkan oleh Admin dari data klaim Klien, namun belum ditugaskan kepada Investigator manapun.</p>
        </div>
        <div className="rounded-lg border p-4 bg-white shadow-sm border-l-4 border-l-orange-400">
          <h3 className="mt-0 text-orange-700">2. Menunggu Investigator (ASSIGNED)</h3>
          <p className="mb-0 text-sm">Admin telah memilih Investigator untuk kasus ini. Investigator sedang mempelajari berkas dan menyusun rencana keberangkatan.</p>
        </div>
        <div className="rounded-lg border p-4 bg-white shadow-sm border-l-4 border-l-blue-500">
          <h3 className="mt-0 text-blue-700">3. Investigasi Berjalan (ON_PROGRESS)</h3>
          <p className="mb-0 text-sm">Investigator mulai turun ke lapangan, mendatangi faskes, atau mewawancarai saksi. Laporan dikirimkan secara parsial ke dalam sistem.</p>
        </div>
        <div className="rounded-lg border p-4 bg-white shadow-sm border-l-4 border-l-emerald-500">
          <h3 className="mt-0 text-emerald-700">4. Selesai / Ditutup (COMPLETED)</h3>
          <p className="mb-0 text-sm">Semua investigasi telah tuntas. Laporan telah disetujui, dan dokumen laporan akhir diserahkan ke Klien.</p>
        </div>
      </div>

      <h2>Halaman Detail Kasus</h2>
      <p>
        Ketika pengguna mengklik salah satu kartu kasus di papan Kanban, pengguna akan diarahkan ke halaman <strong>Detail Kasus</strong>.
      </p>
      <ul>
        <li><strong>Area Atas:</strong> Berisi rangkuman metadata kasus (Nama Tertanggung, Nomor Polis, Faskes, Kota, dll).</li>
        <li><strong>Area Bawah (Timeline):</strong> Berisi riwayat laporan lapangan yang berjalan secara kronologis layaknya <em>feed</em> sosial media.</li>
      </ul>

    </article>
  );
}
