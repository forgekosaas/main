import type { FounderHubSnapshot } from "@/types/founder-hub";

export function snapshotCounts(snapshot: FounderHubSnapshot) {
  return {
    newsItems: snapshot.newsItems.length,
    postDrafts: snapshot.postDrafts.length,
    videoIdeas: snapshot.videoIdeas?.length ?? 0,
    communityItems: snapshot.communityItems.length,
    redditItems: snapshot.communityItems.filter((item) => item.source === "reddit").length,
    feedback: 0,
    insights: 0,
    memory: 0,
    activeUsers: snapshot.analytics.activeUsers,
    visitors: snapshot.analytics.visitors,
    waitlistClicks: snapshot.analytics.waitlistClicks,
    waitlistSubmits: snapshot.analytics.waitlistSubmits,
    conversions: snapshot.analytics.waitlistSignups,
    waitlistSignups: snapshot.analytics.waitlistSignups,
    waitlistConfirmed: snapshot.analytics.waitlistConfirmed,
    trendDays: snapshot.analytics.trend.length
  };
}
