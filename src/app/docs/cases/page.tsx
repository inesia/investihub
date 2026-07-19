import { Metadata } from "next";
import Image from "next/image";
import { Trello, ArrowRight, Eye, MousePointerClick } from "lucide-react";

export const metadata: Metadata = {
  title: "Manajemen Kasus - InvestiHub Docs",
};

export default function DocsCases() {
  return (
    <article className="prose prose-neutral prose-lg max-w-none prose-headings:font-bold prose-a:text-primary">
      <h1 id="kanban" className="flex items-center gap-3">
        <Trello className="h-8 w-8 text-primary" />
        Manajemen Kasus (Kanban)
      </h1>
      
      <p className="lead">
        Untuk memberikan <em>bird&apos;s eye view</em> yang jelas terhadap semua operasional investigasi, InvestiHub mengadopsi sistem manajemen <strong>Kanban Board</strong>.
      </p>

      <div className="bg-slate-50 border p-4 rounded-lg not-prose mb-8">
        <h4 className="font-semibold mb-2">Di Halaman Ini:</h4>
        <ul className="text-sm space-y-1 flex flex-col">
          <li><a href="#kanban" className="text-primary hover:underline">Manajemen Kasus (Kanban)</a></li>
          <li><a href="#alur" className="text-primary hover:underline">Alur Status Kasus</a></li>
          <li><a href="#detail" className="text-primary hover:underline">Halaman Detail Kasus</a></li>
        </ul>
      </div>

      <figure className="my-8 rounded-xl border bg-slate-50 p-2 shadow-sm">
        <Image 
          src="/images/docs/kanban.png" 
          alt="Ilustrasi Kanban Board" 
          width={800} 
          height={400} 
          className="rounded-lg border w-full h-auto"
        />
        <figcaption className="text-center text-sm text-slate-500 mt-2">
          Tampilan Kanban Board yang modern dan mudah dipahami.
        </figcaption>
      </figure>

      <h2 id="alur" className="flex items-center gap-2">
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

      <h2 id="detail" className="flex items-center gap-2">
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

    </article>
  );
}
