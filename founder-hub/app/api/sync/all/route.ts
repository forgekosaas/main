import { NextResponse } from "next/server";

import { createGeminiAnalysisClient } from "@/ai/client";
import { generateInsights } from "@/ai/insight-agent";
import { syncAnalyticsSnapshot } from "@/jobs/sync-analytics";
import { syncRedditCommunity } from "@/jobs/sync-community";
import { syncGmailFeedback } from "@/jobs/sync-feedback";
import { publicErrorMessage } from "@/lib/api-errors";
import { snapshotCounts } from "@/lib/data-flow";
import { getFounderHubEnv } from "@/lib/env";
import { flowLog, publicFlowError } from "@/lib/flow-log";
import { getFounderHubSnapshot } from "@/lib/snapshot";
import { createFounderHubSupabase, saveInsights } from "@/services/supabase";

type SyncStatus = "ok" | "skipped" | "error";

interface SyncStep {
  id: string;
  label: string;
  status: SyncStatus;
  detail: string;
  count?: number;
}

export const dynamic = "force-dynamic";

export async function POST() {
  flowLog({ route: "/api/sync/all", step: "start", source: "all", status: "start" });

  try {
    const env = getFounderHubEnv();
    const db = createFounderHubSupabase(env);
    const steps: SyncStep[] = [];

    const [analytics, gmail, reddit] = await Promise.all([
      captureStep(
        "analytics",
        "Analytics + raw waitlist",
        async () => {
          const result = await syncAnalyticsSnapshot(env);
          return result.configured
            ? {
                detail: `${result.snapshot?.visitors ?? 0} visitors, ${result.snapshot?.waitlistSignups ?? 0} raw Supabase rows`,
                count: result.snapshot?.visitors ?? 0
              }
            : { status: "skipped" as const, detail: "Forgeko analytics is not configured; Gmail waitlist still works on refresh." };
        },
        15000
      ),
      captureStep(
        "gmail",
        "Gmail waitlist + feedback",
        async () => {
          const result = await syncGmailFeedback(env);
          return result.configured
            ? { detail: `${result.emails.length} actionable emails saved`, count: result.emails.length }
            : { status: "skipped" as const, detail: "Gmail OAuth is not configured." };
        },
        15000
      ),
      captureStep(
        "reddit",
        "Reddit opportunities",
        async () => {
          const result = await syncRedditCommunity(env);
          return result.configured
            ? { detail: `${result.items.length} relevant posts saved`, count: result.items.length }
            : { status: "skipped" as const, detail: "Reddit API credentials are not configured; use manual Reddit input." };
        },
        20000
      )
    ]);
    steps.push(analytics, gmail, reddit);
    steps.push({
      id: "hackerNews",
      label: "Hacker News secondary",
      status: "skipped",
      detail: "Skipped in normal update to keep the hub focused and fast."
    });

    const insights = await captureStep(
      "insights",
      "Pain point insights",
      async () => {
        const client = env.geminiApiKey ? createGeminiAnalysisClient({ apiKey: env.geminiApiKey }) : undefined;
        const snapshot = await getFounderHubSnapshot(db);
        const generated = await generateInsights(snapshot, client);
        const persisted = await saveInsights(db, generated);
        return {
          detail: `${generated.length} insights generated${persisted ? "" : " locally"}`,
          count: generated.length
        };
      },
      12000
    );
    steps.push(insights);

    const snapshot = await getFounderHubSnapshot(db);
    const ok = steps.every((step) => step.status !== "error");

    flowLog({
      route: "/api/sync/all",
      step: "complete",
      source: "all",
      status: ok ? "ok" : "error",
      counts: snapshotCounts(snapshot)
    });

    return NextResponse.json({ ok, steps, counts: snapshotCounts(snapshot) }, { status: ok ? 200 : 207 });
  } catch (error) {
    flowLog({ route: "/api/sync/all", step: "error", source: "all", status: "error", detail: publicFlowError(error) });
    return NextResponse.json({ ok: false, error: publicErrorMessage(error) }, { status: 500 });
  }
}

async function captureStep(
  id: string,
  label: string,
  run: () => Promise<{ status?: SyncStatus; detail: string; count?: number }>,
  timeoutMs = 15000
): Promise<SyncStep> {
  try {
    const result = await withTimeout(run(), timeoutMs, label);
    return {
      id,
      label,
      status: result.status ?? "ok",
      detail: result.detail,
      count: result.count
    };
  } catch (error) {
    return {
      id,
      label,
      status: "error",
      detail: publicErrorMessage(error)
    };
  }
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string) {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(`${label} timed out after ${Math.round(timeoutMs / 1000)}s.`)), timeoutMs);
    })
  ]);
}
