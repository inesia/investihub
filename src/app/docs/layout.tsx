import Link from "next/link";
import { BookOpen, Users, Briefcase, FileText, ChevronRight } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";

const DOCS_NAV = [
  { title: "Pengantar", href: "#pengantar", icon: BookOpen },
  { title: "Peran & Akses", href: "#peran", icon: Users },
  { title: "Manajemen Kasus", href: "#kasus", icon: Briefcase },
  { title: "Laporan & Export", href: "#laporan", icon: FileText },
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-neutral-200 bg-neutral-50/50 hidden md:flex md:flex-col overflow-y-auto">
        <div className="flex h-16 items-center border-b border-neutral-200 px-6">
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <BrandLogo tenant="default" variant="sidebar" />
          </Link>
        </div>
        <div className="p-4">
          <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 px-2">
            Dokumentasi
          </div>
          <nav className="space-y-1">
            {DOCS_NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-md px-2 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4 text-neutral-500" />
                  {item.title}
                </div>
                <ChevronRight className="h-3 w-3 text-neutral-400" />
              </a>
            ))}
          </nav>
          <div className="mt-8 px-2 border-t border-neutral-200 pt-4">
            <Link 
              href="/dashboard"
              className="flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 transition-colors"
            >
              &larr; Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto scroll-smooth">
        {/* Mobile Header */}
        <div className="md:hidden flex h-16 items-center border-b border-neutral-200 px-4 bg-white">
          <Link href="/dashboard" className="font-semibold text-neutral-900">
            &larr; Kembali ke Dashboard
          </Link>
        </div>
        <div className="mx-auto max-w-4xl px-8 py-12 lg:px-12">
          {children}
        </div>
      </main>
    </div>
  );
}
