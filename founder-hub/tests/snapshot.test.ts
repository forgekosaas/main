import { describe, expect, it } from "vitest";

import { buildDailyBrief } from "@/jobs/daily-brief";
import { emptyFounderHubSnapshot, getFounderHubSnapshot } from "@/lib/snapshot";

describe("Founder Hub source-backed snapshot", () => {
  it("does not show demo data when no real data source is available", async () => {
    const snapshot = await getFounderHubSnapshot(null);
    const brief = buildDailyBrief(snapshot);
    const serialized = JSON.stringify({ snapshot, brief });

    expect(snapshot.analytics.visitors).toBe(0);
    expect(snapshot.analytics.conversions).toBe(0);
    expect(snapshot.feedback).toEqual([]);
    expect(snapshot.communityItems).toEqual([]);
    expect(snapshot.insights).toEqual([]);
    expect(snapshot.memory).toEqual([]);
    expect(serialized).not.toContain("demo_");
    expect(brief.recommendedPost).toBe("No community signal is loaded yet. Add a manual Reddit/X/IH item before drafting posts.");
  });

  it("keeps an explicit empty analytics state for unconfigured Forgeko analytics", () => {
    expect(emptyFounderHubSnapshot.analytics).toEqual({
      visitors: 0,
      uniqueVisitors: 0,
      conversions: 0,
      conversionRate: 0,
      waitlistSignups: 0,
      waitlistConfirmed: 0,
      waitlistConversionRate: 0,
      waitlistSources: [],
      pageEvents: [],
      topReferrers: [],
      topPages: [],
      topClicks: [],
      trend: [],
      aiExplanation: "No Forgeko analytics data has been synced yet."
    });
  });
});
