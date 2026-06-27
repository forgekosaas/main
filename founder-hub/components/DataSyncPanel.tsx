"use client";

import { RefreshCw } from "lucide-react";
import { useState } from "react";

interface SyncStep {
  id: string;
  label: string;
  status: "ok" | "skipped" | "error";
  detail: string;
}

export function DataSyncPanel() {
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState("");
  const [steps, setSteps] = useState<SyncStep[]>([]);

  async function updateData() {
    setRunning(true);
    setMessage("");
    setSteps([]);

    try {
      const response = await fetch("/api/sync/all", { method: "POST" });
      const json = (await response.json().catch(() => ({}))) as { error?: string; ok?: boolean; steps?: SyncStep[] };

      if (!response.ok && !json.steps) {
        setMessage(json.error ?? "Update failed.");
        return;
      }

      setSteps(json.steps ?? []);
      setMessage(json.ok ? "Data updated." : "Data update finished with issues.");
      setTimeout(() => window.location.reload(), 900);
    } finally {
      setRunning(false);
    }
  }

  return (
    <section className="hub-panel p-4">
      <button
        className="hub-focus inline-flex items-center gap-2 rounded-md bg-hub-accent px-4 py-2 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-60"
        disabled={running}
        onClick={() => void updateData()}
        type="button"
      >
        <RefreshCw className={running ? "animate-spin" : ""} size={15} aria-hidden="true" />
        {running ? "Updating data" : "Update data"}
      </button>
      {message ? <p className="mt-3 text-sm text-hub-muted">{message}</p> : null}
      {steps.length > 0 ? (
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {steps.map((step) => (
            <div key={step.id} className="rounded-md border border-hub-line bg-[#FBFAF7] px-3 py-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-hub-ink">{step.label}</span>
                <span className={step.status === "error" ? "text-red-700" : step.status === "skipped" ? "text-hub-muted" : "text-green-700"}>
                  {step.status}
                </span>
              </div>
              <p className="mt-1 text-hub-muted">{step.detail}</p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
