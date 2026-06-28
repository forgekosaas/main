import { describe, expect, it } from "vitest";

import { buildAnalyticsSummaryFromRows } from "@/lib/analytics-summary";

describe("first-party analytics summary", () => {
  it("calculates the private Founder Hub funnel from page events and waitlist rows", () => {
    const summary = buildAnalyticsSummaryFromRows({
      days: 7,
      now: new Date("2026-06-27T12:00:00.000Z"),
      pageEvents: [
        { event_type: "Page_View", session_id: "s1", metadata: { path: "/", referrer: "https://reddit.com/r/microsaas" }, created_at: "2026-06-27T10:00:00.000Z" },
        { event_type: "Page_View", session_id: "s2", metadata: { path: "/", referrer: "" }, created_at: "2026-06-27T10:05:00.000Z" },
        { event_type: "CTA_Hero_Click", session_id: "s1", metadata: { href: "#waitlist", label: "Join waitlist" }, created_at: "2026-06-27T10:06:00.000Z" },
        { event_type: "Waitlist_Submit", session_id: "s1", metadata: { source: "cta_final" }, created_at: "2026-06-27T10:07:00.000Z" },
        { event_type: "CTA_Solution_Click", session_id: "s2", metadata: { href: "#waitlist", label: "Join waitlist" }, created_at: "2026-06-27T10:08:00.000Z" }
      ],
      waitlistRows: [
        { source: "cta_final", confirmed: true, created_at: "2026-06-27T10:09:00.000Z" }
      ]
    });

    expect(summary.activeUsers).toBe(2);
    expect(summary.totalVisits).toBe(2);
    expect(summary.waitlistClicks).toBe(2);
    expect(summary.waitlistSubmits).toBe(1);
    expect(summary.waitlistSignups).toBe(1);
    expect(summary.waitlistConversionRate).toBe(50);
    expect(summary.clickToSignupRate).toBe(50);
    expect(summary.topReferrers).toEqual([
      { referrer: "reddit.com", visits: 1 },
      { referrer: "Direct / None", visits: 1 }
    ]);
    expect(summary.topPages).toEqual([{ path: "/", visits: 2 }]);
    expect(summary.topClicks).toEqual([
      { label: "Join waitlist", href: "#waitlist", clicks: 2 },
      { label: "Waitlist submit", href: "#waitlist", clicks: 1 }
    ]);
  });

  it("does not report misleading conversion when tracked visits are incomplete", () => {
    const summary = buildAnalyticsSummaryFromRows({
      days: 7,
      now: new Date("2026-06-27T12:00:00.000Z"),
      pageEvents: [
        { event_type: "Waitlist_Submit", session_id: "s1", metadata: { source: "cta_final" }, created_at: "2026-06-27T10:00:00.000Z" },
        { event_type: "Page_View", session_id: "probe", metadata: { path: "/__plausible-worker-check", referrer: "" }, created_at: "2026-06-27T10:01:00.000Z" }
      ],
      waitlistRows: [
        { source: "cta_final", confirmed: true, created_at: "2026-06-27T10:02:00.000Z" },
        { source: "cta_final", confirmed: true, created_at: "2026-06-27T10:03:00.000Z" }
      ]
    });

    expect(summary.activeUsers).toBe(1);
    expect(summary.totalVisits).toBe(0);
    expect(summary.waitlistSignups).toBe(2);
    expect(summary.waitlistConversionRate).toBeNull();
    expect(summary.topPages).toEqual([]);
    expect(summary.topClicks).toEqual([{ label: "Waitlist submit", href: "#waitlist", clicks: 1 }]);
  });
});
