import type { DailyBrief, FounderHubSnapshot } from "@/types/founder-hub";

export function buildDailyBrief(snapshot: Omit<FounderHubSnapshot, "memory">): DailyBrief {
  const topCommunity = [...snapshot.communityItems].sort((a, b) => b.relevanceScore - a.relevanceScore);
  const topInsight = snapshot.insights[0];
  const topFeedback = snapshot.feedback[0];
  const topReferrer = snapshot.analytics.topReferrers[0];

  const priorities = [
    topInsight
      ? `Turn "${topInsight.title}" into one concrete product or messaging decision.`
      : "Load a real signal source before making a product decision.",
    topCommunity[0]
      ? `Read and decide whether to reply to: ${topCommunity[0].title}`
      : "Add one manual Reddit, X, or Indie Hackers item before drafting replies.",
    topFeedback
      ? `Review feedback from ${topFeedback.from}: ${topFeedback.painPoint}`
      : "Run Update data after Gmail OAuth is configured."
  ];

  return {
    generatedAt: new Date().toISOString(),
    priorities,
    recommendedPost: topCommunity[0]
      ? topCommunity[0].postAngle || `Write a short post about ${topCommunity[0].painPoint} using "${topCommunity[0].title}" as source material.`
      : "No community signal is loaded yet. Add a manual Reddit/X/IH item before drafting posts.",
    discussionsToRead: topCommunity.slice(0, 3).map((item) => item.id),
    discussionsToReplyTo: topCommunity.filter((item) => item.relevanceScore >= 70).slice(0, 2).map((item) => item.id),
    landingAnalysis:
      snapshot.analytics.visitors > 0
        ? snapshot.analytics.aiExplanation || `${topReferrer?.source ?? "Direct"} is the main visible source right now.`
        : "No Forgeko analytics data is loaded yet.",
    feedbackAnalysis: topFeedback
      ? `${topFeedback.category}: ${topFeedback.summary}`
      : "No Gmail feedback is loaded yet.",
    weeklyTrend: topInsight?.summary ?? "No cross-source weekly pattern is available yet."
  };
}
