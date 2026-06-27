"use client";

import { useEffect, useRef } from "react";

import { loadTurnstileScript } from "@/lib/turnstile-widget";

export function TurnstileField({
  siteKey,
  onToken,
  className = ""
}: {
  siteKey?: string;
  onToken: (token: string) => void;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!siteKey) {
      return undefined;
    }

    let cancelled = false;

    loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile || widgetIdRef.current) {
          return;
        }

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: onToken,
          "expired-callback": () => onToken(""),
          "error-callback": () => onToken("")
        });
      })
      .catch(() => onToken(""));

    return () => {
      cancelled = true;

      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [onToken, siteKey]);

  if (!siteKey) {
    return null;
  }

  return <div ref={containerRef} className={className} />;
}
