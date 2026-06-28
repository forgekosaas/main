"use client";

import { useEffect } from "react";

import { trackEvent } from "@/lib/analytics-client";

export function PageViewTracker() {
  useEffect(() => {
    trackEvent("Page_View", {
      path: window.location.pathname,
      referrer: document.referrer
    });
  }, []);

  return null;
}
