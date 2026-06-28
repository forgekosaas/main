import { describe, expect, it } from "vitest";

import { buildDailyBrief } from "@/jobs/daily-brief";

describe("daily brief", () => {
  it("turns signals into a short decision-oriented brief", () => {
    const brief = buildDailyBrief({
      newsItems: [],
      postDrafts: [],
      communityItems: [
        {
          id: "c1",
          source: "reddit",
          title: "Solo founders struggle to validate ideas",
          author: "builder",
          url: "https://reddit.example/thread",
          summary: "Founders are unsure what to build first.",
          painPoint: "validation uncertainty",
          userLanguage: ["unsure what to build first"],
          postAngle: "X post: validation is clearer when it measures behavior.",
          relevanceScore: 91,
          suggestedReply: "Share a validation checklist.",
          replyRationale: "Directly matches Forgeko positioning.",
          createdAt: "2026-06-25T10:00:00.000Z"
        }
      ],
      analytics: {
        activeUsers: 92,
        visitors: 120,
        uniqueVisitors: 92,
        conversions: 8,
        conversionRate: 6.7,
        waitlistClicks: 8,
        waitlistSubmits: 8,
        waitlistSignups: 8,
        waitlistConfirmed: 8,
        waitlistConversionRate: 6.7,
        clickToSignupRate: 100,
        waitlistSources: [{ source: "hero", signups: 5 }],
        pageEvents: [{ eventType: "Waitlist_Submit", count: 8 }],
        topReferrers: [{ source: "reddit.com", visitors: 44 }],
        topPages: [{ path: "/", visitors: 120 }],
        topClicks: [{ label: "Join waitlist", href: "#waitlist", clicks: 8 }],
        trend: [{ date: "2026-06-25", visitors: 120 }],
        aiExplanation: "Traffic from Reddit is converting above baseline."
      },
      feedback: [
        {
          id: "e1",
          from: "hello@info.forgeko.com",
          subject: "Need roadmap help",
          snippet: "I need help choosing what to build next.",
          category: "Feature Request",
          summary: "User wants roadmap prioritization.",
          painPoint: "roadmap uncertainty",
          createdAt: "2026-06-25T09:00:00.000Z"
        }
      ],
      insights: [
        {
          id: "i1",
          title: "Validation is the current wedge",
          summary: "Multiple sources mention validation and roadmap uncertainty.",
          evidenceIds: ["c1", "e1"],
          createdAt: "2026-06-25T11:00:00.000Z"
        }
      ]
    });

    expect(brief.priorities).toHaveLength(3);
    expect(brief.recommendedPost).toContain("validation");
    expect(brief.discussionsToRead).toEqual(["c1"]);
    expect(brief.discussionsToReplyTo).toEqual(["c1"]);
    expect(brief.landingAnalysis).toContain("Reddit");
  });
});
