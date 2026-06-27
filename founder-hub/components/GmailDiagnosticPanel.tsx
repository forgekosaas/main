"use client";

import { MailCheck } from "lucide-react";
import { useState } from "react";

interface GmailDiagnosticResponse {
  ok: boolean;
  stage: string;
  message: string;
  count?: number;
}

export function GmailDiagnosticPanel() {
  const [result, setResult] = useState<GmailDiagnosticResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function checkGmail() {
    setLoading(true);
    try {
      const response = await fetch("/api/debug/gmail");
      setResult((await response.json()) as GmailDiagnosticResponse);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="hub-panel p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-hub-ink">Gmail Diagnostics</h2>
          <p className="mt-1 text-sm text-hub-muted">Checks read-only OAuth token refresh and the configured Gmail query.</p>
        </div>
        <button
          className="hub-focus inline-flex items-center gap-2 rounded-md border border-hub-line bg-white px-3 py-2 text-sm font-semibold text-hub-ink hover:bg-[#EDF4F0]"
          disabled={loading}
          onClick={() => void checkGmail()}
          type="button"
        >
          <MailCheck size={15} aria-hidden="true" />
          {loading ? "Checking" : "Check Gmail"}
        </button>
      </div>
      {result ? (
        <div className="mt-4 rounded-md border border-hub-line bg-[#FBFAF7] p-3">
          <p className={`text-sm font-semibold ${result.ok ? "text-hub-accent" : "text-hub-amber"}`}>
            {result.ok ? "Gmail ready" : "Gmail blocked"} · {result.stage}
          </p>
          <p className="mt-2 text-sm leading-6 text-hub-muted">{result.message}</p>
          {typeof result.count === "number" ? <p className="mt-2 text-sm text-hub-ink">Matched messages checked: {result.count}</p> : null}
        </div>
      ) : null}
    </section>
  );
}
