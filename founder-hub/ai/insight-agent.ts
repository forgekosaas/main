import type { AnalysisClient } from "@/ai/client";
import { insightsPrompt } from "@/prompts/insights";
import type { FounderHubSnapshot, Insight } from "@/types/founder-hub";

export async function generateInsights(snapshot: FounderHubSnapshot, client?: AnalysisClient): Promise<Insight[]> {
  if (!client) {
    return fallbackInsights(snapshot);
  }

  try {
    const result = await client.analyzeJson<{ insights: Array<Omit<Insight, "id" | "createdAt">> }>({
      instructions: insightsPrompt,
      input: snapshot
    });

    return result.insights.map((insight, index) => ({
      ...insight,
      id: `insight_${Date.now()}_${index}`,
      createdAt: new Date().toISOString()
    }));
  } catch {
    return fallbackInsights(snapshot);
  }
}

function fallbackInsights(snapshot: FounderHubSnapshot): Insight[] {
  const painPoints = new Map<string, number>();
  for (const item of snapshot.communityItems) {
    painPoints.set(item.painPoint, (painPoints.get(item.painPoint) ?? 0) + 1);
  }
  for (const email of snapshot.feedback) {
    painPoints.set(email.painPoint, (painPoints.get(email.painPoint) ?? 0) + 1);
  }

  const [topPainPoint, topPainPointCount] = [...painPoints.entries()].sort((a, b) => b[1] - a[1])[0] ?? [];
  const insights: Insight[] = [];

  if (topPainPoint) {
    insights.push({
      id: "insight_local_pattern",
      title: "Top recurring pain point",
      summary: `${topPainPoint} appears in ${topPainPointCount} loaded signal${topPainPointCount === 1 ? "" : "s"}. Use it as the next social listening theme and compare replies against waitlist movement.`,
      evidenceIds: [...snapshot.communityItems.slice(0, 2).map((item) => item.id), ...snapshot.feedback.slice(0, 1).map((email) => email.id)],
      createdAt: new Date().toISOString()
    });
  }

  if (snapshot.analytics.waitlistSignups > 0) {
    insights.push({
      id: "insight_waitlist_funnel",
      title: "Waitlist funnel signal",
      summary: `${snapshot.analytics.waitlistSignups} waitlist signup${snapshot.analytics.waitlistSignups === 1 ? "" : "s"} are visible in Supabase. The current signup-to-visitor rate is ${snapshot.analytics.waitlistConversionRate || 0}%, so prioritize posts that match the highest-fit pain point and watch whether this rate moves.`,
      evidenceIds: ["waitlist", ...snapshot.analytics.waitlistSources.slice(0, 2).map((row) => row.source)],
      createdAt: new Date().toISOString()
    });
  }

  const replyCandidates = snapshot.communityItems.filter((item) => item.relevanceScore >= 70 && item.source !== "hacker-news").slice(0, 3);
  if (replyCandidates.length > 0) {
    insights.push({
      id: "insight_reply_queue",
      title: "Best reply opportunities",
      summary: `${replyCandidates.length} high-fit Reddit/X/IH discussion${replyCandidates.length === 1 ? "" : "s"} are ready for manual replies. Use the suggested replies as drafts, then log whether any reply turns into feedback or waitlist traffic.`,
      evidenceIds: replyCandidates.map((item) => item.id),
      createdAt: new Date().toISOString()
    });
  }

  return insights.slice(0, 4);
}
