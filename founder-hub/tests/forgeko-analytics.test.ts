import { describe, expect, it } from "vitest";

import {
  buildForgekoAnalyticsSummaryRequest,
  buildSupabaseAnalyticsSnapshot,
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

  it("builds analytics directly from Supabase rows when page views are missing", () => {
    const snapshot = buildSupabaseAnalyticsSnapshot({
      days: 30,
      pageEvents: [
        { event_type: "Waitlist_FormFocus", session_id: "s1", metadata: { source: "cta_final" }, created_at: "2026-06-27T10:00:00.000Z" },
        { event_type: "Waitlist_Submit", session_id: "s1", metadata: { source: "cta_final" }, created_at: "2026-06-27T10:01:00.000Z" },
        { event_type: "Scroll_HowItWorks", session_id: "s2", metadata: {}, created_at: "2026-06-27T10:02:00.000Z" }
      ],
      waitlistRows: [
        { source: "cta_final", confirmed: true, created_at: "2026-06-27T10:03:00.000Z" }
      ],
      now: new Date("2026-06-27T12:00:00.000Z")
    });

    expect(snapshot.activeUsers).toBe(2);
    expect(snapshot.visitors).toBe(0);
    expect(snapshot.waitlistSubmits).toBe(1);
    expect(snapshot.waitlistSignups).toBe(1);
    expect(snapshot.waitlistConversionRate).toBe(50);
    expect(snapshot.topClicks).toContainEqual({ label: "Waitlist submit", href: "#waitlist", clicks: 1 });
  });
});
