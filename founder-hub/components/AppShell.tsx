"use client";

import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-hub-line bg-white/82 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1260px] items-center justify-between gap-3">
          <Link className="flex items-center gap-3" href="/">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-hub-accent text-white">
              <ShieldCheck size={19} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-[15px] font-semibold leading-5 text-hub-ink">Founder Hub</span>
              <span className="block text-xs leading-4 text-hub-muted">Private local workspace</span>
            </span>
          </Link>
          <span className="hidden rounded-md border border-hub-line bg-[#FBFAF7] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-hub-muted sm:inline-flex">
            local-only
          </span>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1260px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">{children}</main>
    </div>
  );
}
