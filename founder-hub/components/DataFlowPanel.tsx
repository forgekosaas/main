"use client";

import { Route } from "lucide-react";
import { useState } from "react";

interface FlowResponse {
  counts: Record<string, number>;
  events: Array<{
    id: string;
    timestamp: string;
    route: string;
    step: string;
    source: string;
    status: "start" | "ok" | "skipped" | "error";
    detail?: string;
  }>;
}

export function DataFlowPanel() {
  const [flow, setFlow] = useState<FlowResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function inspectFlow() {
    setLoading(true);
    try {
      const response = await fetch("/api/debug/flow", { method: "GET" });
      setFlow((await response.json()) as FlowResponse);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="hub-panel p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-hub-ink">Data Flow</h2>
          <p className="mt-1 text-sm text-hub-muted">API routes, source reads, database reads, and rendered counts.</p>
        </div>
        <button
          className="hub-focus inline-flex items-center gap-2 rounded-md border border-hub-line bg-white px-3 py-2 text-sm font-semibold text-hub-ink hover:bg-[#EDF4F0]"
          disabled={loading}
          onClick={() => void inspectFlow()}
          type="button"
        >
          <Route size={15} aria-hidden="true" />
          {loading ? "Checking" : "Check Data Flow"}
        </button>
      </div>
      {flow ? (
        <div className="mt-4 grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="rounded-md border border-hub-line bg-[#FBFAF7] p-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-hub-muted">Current Counts</h3>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              {Object.entries(flow.counts).map(([key, value]) => (
                <div className="flex justify-between gap-2 rounded-md bg-white px-2 py-1" key={key}>
                  <span className="truncate text-hub-muted">{key}</span>
                  <span className="font-semibold text-hub-ink">{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-md border border-hub-line bg-[#FBFAF7] p-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-hub-muted">Recent Route Events</h3>
            <div className="mt-3 max-h-72 space-y-2 overflow-auto pr-1">
              {flow.events.length > 0 ? (
                flow.events.slice(0, 12).map((event) => (
                  <article className="rounded-md bg-white px-3 py-2 text-sm" key={event.id}>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-hub-ink">{event.route}</span>
                      <span className="rounded-md border border-hub-line px-2 py-0.5 text-xs font-semibold text-hub-muted">{event.status}</span>
                      <span className="text-xs text-hub-muted">{event.source}.{event.step}</span>
                    </div>
                    {event.detail ? <p className="mt-1 text-xs leading-5 text-hub-muted">{event.detail}</p> : null}
                  </article>
                ))
              ) : (
                <p className="text-sm text-hub-muted">No route events yet.</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
