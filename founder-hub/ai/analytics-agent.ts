import type { AnalysisClient } from "@/ai/client";
import { analyticsPrompt } from "@/prompts/analytics";
import type { AnalyticsSnapshot } from "@/types/founder-hub";

export async function explainAnalyticsSnapshot(
  snapshot: AnalyticsSnapshot,
  client?: AnalysisClient
): Promise<AnalyticsSnapshot> {
  if (!client) {
    return {
      ...snapshot,
      aiExplanation:
        snapshot.topReferrers.length > 0
          ? `${snapshot.topReferrers[0].source} is the strongest visible acquisition source this week.`
          : "No Forgeko analytics data is configured yet. Connect the read-only summary API to explain traffic movement."
    };
  }

  try {
    const result = await client.analyzeJson<{ aiExplanation: string }>({
      instructions: analyticsPrompt,
      input: snapshot
    });

    return { ...snapshot, aiExplanation: result.aiExplanation };
  } catch {
    return explainAnalyticsSnapshot(snapshot);
  }
}
