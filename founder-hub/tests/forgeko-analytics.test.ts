import { describe, expect, it } from "vitest";

import {
  buildForgekoAnalyticsSummaryRequest,
  fetchForgekoAnalyticsSnapshot
} from "@/services/forgeko-analytics";

describe("Forgeko analytics read-only service", () => {
  it("builds only a protected summary GET request for the dashboard snapshot", () => {
    const request = buildForgekoAnalyticsSummaryRequest({
      siteUrl: "https://forgeko.com",
      token: "local-token",
      period: "7d"
    });

    expect(request.kind).toBe("summary");
    expect(request.method).toBe("GET");
    expect(request.url).toBe("https://forgeko.com/api/analytics/summary?days=7");
    expect(request.headers.Authorization).toBe("Bearer local-token");
  });

  it("maps Forgeko summary metrics into a Founder Hub analytics snapshot", async () => {
    const fetcher = async () =>
      new Response(
        JSON.stringify({
          totalVisits: 4,
          uniqueVisitors: 3,
          topPages: [{ path: "/", visits: 4 }],
          topReferrers: [{ referrer: "Google", visits: 2 }],
          topClicks: [{ label: "Join waitlist", href: "#waitlist", clicks: 5 }],
          trend: [{ date: "2026-06-27", visits: 4 }]
        }),
        { status: 200 }
      );

    const snapshot = await fetchForgekoAnalyticsSnapshot({
      siteUrl: "https://forgeko.com",
      token: "local-token",
      fetcher
    });

    expect(snapshot.visitors).toBe(4);
    expect(snapshot.uniqueVisitors).toBe(3);
    expect(snapshot.conversions).toBe(5);
    expect(snapshot.topPages).toEqual([{ path: "/", visitors: 4 }]);
    expect(snapshot.topReferrers).toEqual([{ source: "Google", visitors: 2 }]);
    expect(snapshot.topClicks).toEqual([{ label: "Join waitlist", href: "#waitlist", clicks: 5 }]);
  });
});
