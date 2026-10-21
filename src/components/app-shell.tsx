"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, ListChecks, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const NAV_ITEMS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/subjects", label: "Subjects", icon: BookOpen },
  { href: "/mistakes", label: "Mistakes", icon: ListChecks },
  { href: "/me", label: "Me", icon: User },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Bottom tab bar on phone, sidebar from the md breakpoint up (iPad landscape
 * and MacBook) — same four destinations either way (section 3).
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <nav
        aria-label="Primary"
        className="hidden shrink-0 border-r border-black/5 bg-surface md:flex md:w-60 md:flex-col md:gap-1 md:p-4"
      >
        <span className="mb-4 px-3 text-lg font-bold text-text">Revision Guide</span>
        {NAV_ITEMS.map((item) => (
          <SidebarLink key={item.href} {...item} active={isActive(pathname, item.href)} />
        ))}
      </nav>

      <main className="flex-1 pb-20 md:pb-0">{children}</main>

      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 flex border-t border-black/5 bg-surface/95 backdrop-blur md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {NAV_ITEMS.map((item) => (
          <TabLink key={item.href} {...item} active={isActive(pathname, item.href)} />
        ))}
      </nav>
    </div>
  );
}

function SidebarLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
        active ? "bg-pink text-pink-strong" : "text-muted hover:bg-bg hover:text-text"
      }`}
    >
      <Icon size={20} aria-hidden />
      {label}
    </Link>
  );
}

function TabLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 py-2"
      aria-current={active ? "page" : undefined}
    >
      <Icon
        size={22}
        aria-hidden
        className={active ? "text-pink-strong" : "text-muted"}
      />
      <span className={`text-xs font-medium ${active ? "text-pink-strong" : "text-muted"}`}>
        {label}
      </span>
    </Link>
  );
}
