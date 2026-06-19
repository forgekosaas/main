"use client";

import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

import { trackEvent } from "@/lib/analytics-client";
import type { AllowedEventType } from "@/lib/events";

export function TrackedLink({
  href,
  eventType,
  source,
  children,
  className = ""
}: {
  href: string;
  eventType: AllowedEventType;
  source: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`focus-ring inline-flex items-center gap-2 text-sm font-medium text-forgeko-text transition hover:text-white ${className}`}
      onClick={() => trackEvent(eventType, { source })}
    >
      {children}
      <ArrowRight aria-hidden="true" className="h-4 w-4" />
    </a>
  );
}
