"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Bell, Search } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import {
  AdvancedSearch,
  SearchTrigger,
  useSearchShortcut,
} from "@/components/search/advanced-search";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";
import { ROLE_LABELS } from "@/types";
import { getInitials } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
}

export function AppShell({ children, title = "Dashboard" }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user } = useAuth();

  useSearchShortcut(() => setSearchOpen(true));

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <AdvancedSearch open={searchOpen} onOpenChange={setSearchOpen} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-neutral-200 bg-white px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <h1 className="shrink-0 text-lg font-bold text-foreground md:text-xl">
            {title}
          </h1>

          <div className="hidden flex-1 justify-center px-4 md:flex">
            <SearchTrigger onClick={() => setSearchOpen(true)} />
          </div>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Bell className="h-4 w-4" />
            </Button>
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2 border-l border-neutral-200 pl-2 sm:pl-3"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-xs text-white">
                  {getInitials(user?.name ?? "U")}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {user?.role ? ROLE_LABELS[user.role] : ""}
                </p>
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-white p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
