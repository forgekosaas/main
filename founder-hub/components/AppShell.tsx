"use client";

import {
  BarChart3,
  Download,
  Home,
  Inbox,
  Lightbulb,
  Megaphone,
  MessageCircle,
  Settings,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/marketing", label: "Marketing", icon: Megaphone },
  { href: "/community", label: "Community", icon: MessageCircle },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/feedback", label: "Feedback", icon: Inbox },
  { href: "/insights", label: "Insights", icon: Lightbulb },
  { href: "/settings", label: "Settings", icon: Settings }
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="border-b border-hub-line bg-white/78 px-4 py-4 backdrop-blur lg:min-h-screen lg:border-b-0 lg:border-r lg:px-5">
        <div className="flex items-center justify-between gap-3 lg:block">
          <Link className="flex items-center gap-3" href="/">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-hub-accent text-white">
              <ShieldCheck size={19} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-[15px] font-semibold leading-5 text-hub-ink">Founder Hub</span>
              <span className="block text-xs leading-4 text-hub-muted">Local</span>
            </span>
          </Link>
        </div>

        <nav className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                className={`hub-focus flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-hub-accent text-white"
                    : "text-hub-muted hover:bg-[#EEE8DD] hover:text-hub-ink"
                }`}
                href={item.href}
              >
                <Icon size={16} aria-hidden="true" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 lg:mt-8">
          <a
            className="hub-focus flex w-full items-center justify-center gap-2 rounded-md border border-hub-line bg-[#FBFAF7] px-3 py-2 text-sm font-semibold text-hub-accent transition hover:bg-white"
            download
            href="/api/export-data"
          >
            <Download size={16} aria-hidden="true" />
            <span>Export data</span>
          </a>
        </div>
      </aside>

      <main className="mx-auto w-full max-w-[1260px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">{children}</main>
    </div>
  );
}
