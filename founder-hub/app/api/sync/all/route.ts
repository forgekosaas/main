import { NextResponse } from "next/server";

import { syncAnalyticsSnapshot } from "@/jobs/sync-analytics";
import { syncRedditCommunity } from "@/jobs/sync-community";
import { syncNewsItems } from "@/jobs/sync-news";
import { syncPostDrafts } from "@/jobs/sync-post-drafts";
import { publicErrorMessage } from "@/lib/api-errors";
import { snapshotCounts } from "@/lib/data-flow";
import { getFounderHubEnv } from "@/lib/env";
import { flowLog, publicFlowError } from "@/lib/flow-log";
import { emptyAnalyticsSnapshot } from "@/lib/snapshot";
import { writeLocalFounderHubSnapshot } from "@/services/local-cache";
import type { AnalyticsSnapshot, CommunityItem, FounderHubSnapshot, NewsItem, SourceHealthItem } from "@/types/founder-hub";

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
    const steps: SyncStep[] = [];
    let syncedNewsItems: NewsItem[] = [];
    let syncedCommunityItems: CommunityItem[] = [];
    let syncedAnalytics: AnalyticsSnapshot = emptyAnalyticsSnapshot;
    let syncedPostDrafts: FounderHubSnapshot["postDrafts"] = [];
    let syncedVideoIdeas: FounderHubSnapshot["videoIdeas"] = [];

    const [analytics, news, reddit] = await Promise.all([
      captureStep(
        "analytics",
        "Forgeko analytics",
        async () => {
          const result = await syncAnalyticsSnapshot(env);
          if (result.snapshot) syncedAnalytics = result.snapshot;
          return result.configured
            ? {
                detail: `${result.snapshot?.activeUsers ?? 0} active users, ${result.snapshot?.waitlistSignups ?? 0} waitlist signups`,
                count: result.snapshot?.visitors ?? 0
              }
            : { status: "skipped" as const, detail: "Forgeko analytics token or site URL is not configured." };
        },
        15000
      ),
      captureStep(
        "news",
        "RSS news",
        async () => {
          const result = await syncNewsItems(env);
          syncedNewsItems = result.items;
          return { detail: `${result.items.length} SaaS/AI/founder news items loaded`, count: result.items.length };
        },
        15000
      ),
      captureStep(
        "reddit",
        "Reddit opportunities",
        async () => {
          const result = await syncRedditCommunity(env);
          syncedCommunityItems = result.items;
          return result.configured
            ? { detail: `${result.items.length} relevant public Reddit posts/comments loaded`, count: result.items.length }
            : { status: "skipped" as const, detail: "Reddit public source is not available right now." };
        },
        20000
      )
    ]);
    steps.push(analytics, news, reddit);

    const drafts = await captureStep(
      "postDrafts",
      "Post drafts",
      async () => {
        const result = await syncPostDrafts({
          env,
          newsItems: syncedNewsItems,
          communityItems: syncedCommunityItems
        });
        syncedPostDrafts = result.drafts;
        syncedVideoIdeas = result.videoIdeas;
        return {
          status: result.drafts.length > 0 ? "ok" : "skipped",
          detail: result.drafts.length > 0 ? `${result.drafts.length} private local post drafts and ${result.videoIdeas.length} video ideas generated` : "No public source signal was available for local draft generation.",
          count: result.drafts.length + result.videoIdeas.length
        };
      },
      12000
    );
    steps.push(drafts);

    const snapshot: FounderHubSnapshot = {
      newsItems: syncedNewsItems,
      postDrafts: syncedPostDrafts,
      videoIdeas: syncedVideoIdeas,
      communityItems: syncedCommunityItems,
      analytics: syncedAnalytics,
      sourceHealth: sourceHealthFromSteps(steps),
      feedback: [],
      insights: [],
      memory: []
    };
    await writeLocalFounderHubSnapshot(snapshot);
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

function sourceHealthFromSteps(steps: SyncStep[]): SourceHealthItem[] {
  const updatedAt = new Date().toISOString();
  return steps.map((step) => ({
    id: step.id,
    label: step.label,
    status: step.status,
    detail: step.detail,
    count: step.count,
    updatedAt
  }));
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
