"use client";

import { RefreshCw } from "lucide-react";
import { useState } from "react";

interface SyncStep {
  id: string;
  label: string;
  status: "ok" | "skipped" | "error";
  detail: string;
}

type SyncActionId = "all" | "post-drafts" | "video-ideas";

const syncActions: Array<{
  id: SyncActionId;
  endpoint: string;
  label: string;
  loadingLabel: string;
  primary?: boolean;
}> = [
  {
    id: "all",
    endpoint: "/api/sync/all",
    label: "Extract latest data",
    loadingLabel: "Extracting data",
    primary: true
  },
  {
    id: "post-drafts",
    endpoint: "/api/sync/post-drafts",
    label: "Regenerate post ideas",
    loadingLabel: "Regenerating posts"
  },
  {
    id: "video-ideas",
    endpoint: "/api/sync/video-ideas",
    label: "Regenerate video ideas",
    loadingLabel: "Regenerating videos"
  }
];

export function DataSyncPanel() {
  const [runningAction, setRunningAction] = useState<SyncActionId | null>(null);
  const [message, setMessage] = useState("");
  const [steps, setSteps] = useState<SyncStep[]>([]);

  async function updateData(action: (typeof syncActions)[number]) {
    setRunningAction(action.id);
    setMessage("");
    setSteps([]);

    try {
      const response = await fetch(action.endpoint, { method: "POST" });
      const json = (await response.json().catch(() => ({}))) as { error?: string; ok?: boolean; steps?: SyncStep[] };

      if (!response.ok && !json.steps) {
        setMessage(json.error ?? "Update failed.");
        return;
      }

      setSteps(json.steps ?? []);
      setMessage(json.ok ? "Data updated." : "Data update finished with issues.");
      setTimeout(() => window.location.reload(), 900);
    } finally {
      setRunningAction(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {syncActions.map((action) => {
          const isRunning = runningAction === action.id;
          const disabled = runningAction !== null;
          const className = action.primary
            ? "hub-focus inline-flex items-center gap-2 rounded-md bg-hub-accent px-4 py-2 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-60"
            : "hub-focus inline-flex items-center gap-2 rounded-md border border-hub-line bg-[#FBFAF7] px-3 py-2 text-sm font-semibold text-hub-accent transition hover:bg-white disabled:cursor-wait disabled:opacity-60";

          return (
            <button className={className} disabled={disabled} key={action.id} onClick={() => void updateData(action)} type="button">
              <RefreshCw className={isRunning ? "animate-spin" : ""} size={15} aria-hidden="true" />
              {isRunning ? action.loadingLabel : action.label}
            </button>
          );
        })}
      </div>
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
    </div>
  );
}
