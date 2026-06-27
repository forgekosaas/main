import type { FounderHubSnapshot } from "@/types/founder-hub";

export function snapshotCounts(snapshot: FounderHubSnapshot) {
  return {
    communityItems: snapshot.communityItems.length,
    feedback: snapshot.feedback.length,
    insights: snapshot.insights.length,
    memory: snapshot.memory.length,
    visitors: snapshot.analytics.visitors,
    conversions: snapshot.analytics.conversions,
    waitlistSignups: snapshot.analytics.waitlistSignups,
    waitlistConfirmed: snapshot.analytics.waitlistConfirmed,
    trendDays: snapshot.analytics.trend.length
  };
}
