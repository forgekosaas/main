import type { SupabaseClient } from "@supabase/supabase-js";

import { snapshotCounts } from "@/lib/data-flow";
import { getFounderHubEnv } from "@/lib/env";
import { flowLog, publicFlowError } from "@/lib/flow-log";
import {
  createFounderHubSupabase,
  listCommunityCache,
  listCommunityItems,
  listFeedbackEmails,
  listInsights,
  listLatestAnalyticsSnapshot,
  listMemoryEntries
} from "@/services/supabase";
import { emptyProductSignalSnapshot, fetchProductSignalSnapshot, mergeProductSignals } from "@/services/product-signals";
import type { AnalyticsSnapshot, FounderHubSnapshot } from "@/types/founder-hub";

export const emptyAnalyticsSnapshot: AnalyticsSnapshot = {
  visitors: 0,
  uniqueVisitors: 0,
  conversions: 0,
  conversionRate: 0,
  ...emptyProductSignalSnapshot,
  topReferrers: [],
  topPages: [],
  topClicks: [],
  trend: [],
  aiExplanation: "No Forgeko analytics data has been synced yet."
};

export const emptyFounderHubSnapshot: FounderHubSnapshot = {
  communityItems: [],
  analytics: emptyAnalyticsSnapshot,
  feedback: [],
  insights: [],
  memory: []
};

export async function getFounderHubSnapshot(client: SupabaseClient | null): Promise<FounderHubSnapshot> {
  if (!client) {
    flowLog({
      route: "snapshot",
      step: "supabase-client",
      source: "supabase",
      status: "skipped",
      detail: "Supabase client is not configured."
    });
    return cloneEmptySnapshot();
  }

  const [communityItems, cachedHackerNewsItems, analytics, feedback, insights, memory] = await Promise.all([
    safeRead(() => listCommunityItems(client), []),
    safeRead(() => listCommunityCache(client, "hacker_news_latest"), []),
    safeRead(() => listLatestAnalyticsSnapshot(client), null),
    safeRead(() => listFeedbackEmails(client), []),
    safeRead(() => listInsights(client), []),
    safeRead(() => listMemoryEntries(client), [])
  ]);

  const mergedCommunityItems = mergeCommunityItems(communityItems, cachedHackerNewsItems);
  const baseAnalytics = analytics ?? { ...emptyAnalyticsSnapshot };
  const productSignals = await safeRead(() => fetchProductSignalSnapshot(client, baseAnalytics), { ...emptyProductSignalSnapshot });

  const snapshot = {
    communityItems: mergedCommunityItems,
    analytics: mergeProductSignals(baseAnalytics, productSignals),
    feedback,
    insights,
    memory
  };

  flowLog({
    route: "snapshot",
    step: "read",
    source: "supabase",
    status: "ok",
    counts: snapshotCounts(snapshot)
  });

  return snapshot;
}

function mergeCommunityItems(primary: FounderHubSnapshot["communityItems"], cached: FounderHubSnapshot["communityItems"]) {
  const byId = new Map(primary.map((item) => [item.id, item]));
  for (const item of cached) {
    if (!byId.has(item.id)) {
      byId.set(item.id, item);
    }
  }
  return [...byId.values()].sort((a, b) => b.relevanceScore - a.relevanceScore);
}

export async function getCurrentFounderHubSnapshot(): Promise<FounderHubSnapshot> {
  return getFounderHubSnapshot(createFounderHubSupabase(getFounderHubEnv()));
}

function cloneEmptySnapshot(): FounderHubSnapshot {
  return {
    communityItems: [],
    analytics: { ...emptyAnalyticsSnapshot, topReferrers: [], topPages: [], topClicks: [], trend: [] },
    feedback: [],
    insights: [],
    memory: []
  };
}

async function safeRead<T>(read: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await read();
  } catch (error) {
    flowLog({
      route: "snapshot",
      step: "read",
      source: "supabase",
      status: "error",
      detail: publicFlowError(error)
    });
    return fallback;
  }
}
