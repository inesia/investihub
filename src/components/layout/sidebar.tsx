"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  LogOut,
  X,
  ChevronLeft,
  UserCircle,
  PlusCircle,
  Archive,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand/brand-logo";
import { PoweredByOperator } from "@/components/brand/powered-by-operator";
import { useTenantBrand } from "@/components/brand/use-tenant-brand";
import { isBrandedTenant } from "@/lib/branding";
import { useAuth } from "@/contexts/auth-context";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    label: "Kasus Baru",
    href: "/dashboard/cases/new",
    icon: PlusCircle,
    roles: ["ADMIN", "INVESTIGATOR"],
  },
  { label: "Klien", href: "/dashboard/clients", icon: Users, roles: ["ADMIN"] },
  { label: "Arsip", href: "/dashboard/archive", icon: Archive, roles: ["ADMIN", "INVESTIGATOR"] },
  { label: "Profil", href: "/dashboard/profile", icon: UserCircle },
];

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

export function Sidebar({
  isOpen,
  isCollapsed,
  onClose,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const brand = useTenantBrand();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  const filteredNav = navItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role ?? "")
  );

  const sidebarContent = (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-4">
        <Link href="/dashboard" className="flex items-center gap-2" onClick={onClose}>
          <BrandLogo
            tenant={brand.slug}
            variant="sidebar"
            inverted
            collapsed={isCollapsed}
            textClassName="text-white"
          />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10 lg:hidden"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto p-3">
        {filteredNav.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white",
                isCollapsed && "justify-center px-2"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0">
        {!isCollapsed && isBrandedTenant(brand.slug) && (
          <div className="px-4 pb-2">
            <p className="rounded-md bg-white/10 px-3 py-2 text-[11px] leading-snug text-white/70">
              {brand.tagline}
            </p>
          </div>
        )}

        <div className={cn("px-3 pb-2", isCollapsed && "px-2")}>
          <PoweredByOperator inverted collapsed={isCollapsed} />
        </div>

        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white",
              isCollapsed && "justify-center px-2",
              isLoggingOut && "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-white/70"
            )}
          >
            {isLoggingOut ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4 shrink-0" />
            )}
            {!isCollapsed && <span>{isLoggingOut ? "Keluar..." : "Keluar"}</span>}
          </button>
        </div>

        <div className="hidden border-t border-white/10 p-2 lg:block">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="w-full justify-center text-white/70 hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform",
                isCollapsed && "rotate-180"
              )}
            />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 w-[280px] lg:hidden"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "hidden h-dvh shrink-0 overflow-hidden transition-all duration-300 lg:block",
          isCollapsed ? "w-[68px]" : "w-[260px]"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
