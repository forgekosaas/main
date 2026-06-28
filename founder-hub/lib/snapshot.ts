import { getFounderHubEnv } from "@/lib/env";
import { flowLog, publicFlowError } from "@/lib/flow-log";
import { readLocalFounderHubSnapshot } from "@/services/local-cache";
import type { AnalyticsSnapshot, FounderHubSnapshot } from "@/types/founder-hub";

export const emptyAnalyticsSnapshot: AnalyticsSnapshot = {
  activeUsers: 0,
  visitors: 0,
  uniqueVisitors: 0,
  conversions: 0,
  conversionRate: 0,
  waitlistClicks: 0,
  waitlistSubmits: 0,
  waitlistSignups: 0,
  waitlistConfirmed: 0,
  waitlistConversionRate: null,
  clickToSignupRate: null,
  waitlistSources: [],
  pageEvents: [],
  topReferrers: [],
  topPages: [],
  topClicks: [],
  trend: [],
  aiExplanation: "No Forgeko analytics data has been synced yet."
};

export const emptyFounderHubSnapshot: FounderHubSnapshot = {
  newsItems: [],
  postDrafts: [],
  videoIdeas: [],
  communityItems: [],
  analytics: emptyAnalyticsSnapshot,
  sourceHealth: [],
  feedback: [],
  insights: [],
  memory: []
};

export async function getFounderHubSnapshot(_client?: unknown, cachePath?: string): Promise<FounderHubSnapshot> {
  try {
    const snapshot = await readLocalFounderHubSnapshot(cachePath);
    if (snapshot) {
      flowLog({ route: "snapshot", step: "read", source: "local-cache", status: "ok" });
      return normalizeSnapshot(snapshot);
    }
  } catch (error) {
    flowLog({ route: "snapshot", step: "read", source: "local-cache", status: "error", detail: publicFlowError(error) });
  }

  return cloneEmptySnapshot();
}

export async function getCurrentFounderHubSnapshot(): Promise<FounderHubSnapshot> {
  void getFounderHubEnv();
  return getFounderHubSnapshot();
}

function normalizeSnapshot(snapshot: FounderHubSnapshot): FounderHubSnapshot {
  return {
    ...cloneEmptySnapshot(),
    ...snapshot,
    analytics: { ...emptyAnalyticsSnapshot, ...snapshot.analytics },
    videoIdeas: snapshot.videoIdeas ?? [],
    sourceHealth: snapshot.sourceHealth ?? []
  };
}

function cloneEmptySnapshot(): FounderHubSnapshot {
  return {
    communityItems: [],
    newsItems: [],
    postDrafts: [],
    videoIdeas: [],
    analytics: { ...emptyAnalyticsSnapshot, topReferrers: [], topPages: [], topClicks: [], trend: [], pageEvents: [], waitlistSources: [] },
    sourceHealth: [],
    feedback: [],
    insights: [],
    memory: []
  };
}
