"use client";

import { useEffect, useRef } from "react";

import { loadTurnstileScript } from "@/lib/turnstile-widget";

export function TurnstileField({
  siteKey,
  onToken,
  resetSignal = 0,
  className = ""
}: {
  siteKey?: string;
  onToken: (token: string) => void;
  resetSignal?: number;
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

  useEffect(() => {
    if (!resetSignal || !widgetIdRef.current || !window.turnstile) {
      return;
    }

    window.turnstile.reset(widgetIdRef.current);
    onToken("");
  }, [onToken, resetSignal]);

  if (!siteKey) {
    return null;
  }

  return <div ref={containerRef} className={className} />;
}
