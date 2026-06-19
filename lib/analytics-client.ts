"use client";

import type { AllowedEventType } from "@/lib/events";

declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props?: Record<string, unknown> }) => void;
  }
}

const sessionStorageKey = "forgeko_session_id";

function getSessionId() {
  if (typeof window === "undefined") {
    return "server";
  }

  const existing = window.sessionStorage.getItem(sessionStorageKey);
  if (existing) {
    return existing;
  }

  const next = globalThis.crypto.randomUUID();
  window.sessionStorage.setItem(sessionStorageKey, next);
  return next;
}

export function trackEvent(eventType: AllowedEventType, metadata: Record<string, unknown> = {}) {
  if (typeof window === "undefined") {
    return;
  }

  window.plausible?.(eventType, { props: metadata });

  void fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventType,
      sessionId: getSessionId(),
      metadata
    }),
    keepalive: true
  }).catch(() => undefined);
}
