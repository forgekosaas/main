import { describe, expect, it } from "vitest";

import type { AnalysisClient } from "@/ai/client";
import { explainAnalyticsSnapshot } from "@/ai/analytics-agent";
import { analyzeManualCommunityInput } from "@/ai/community-agent";
import { classifyFeedbackEmail } from "@/ai/feedback-agent";
import { generateInsights } from "@/ai/insight-agent";
import type { AnalyticsSnapshot, FeedbackEmail, FounderHubSnapshot } from "@/types/founder-hub";

const failingClient: AnalysisClient = {
  async analyzeJson() {
    throw new Error("Gemini analysis failed with status 429");
  }
};

describe("AI fallback behavior", () => {
  it("keeps Forgeko analytics when Gemini analysis fails", async () => {
    const snapshot: AnalyticsSnapshot = {
      visitors: 42,
      uniqueVisitors: 30,
      conversions: 5,
      conversionRate: 11.9,
      waitlistSignups: 5,
      waitlistConfirmed: 5,
      waitlistConversionRate: 11.9,
      waitlistSources: [{ source: "hero", signups: 3 }],
      pageEvents: [{ eventType: "Waitlist_Submit", count: 5 }],
      topReferrers: [{ source: "forgeko.example", visitors: 12 }],
      topPages: [{ path: "/", visitors: 42 }],
      topClicks: [{ label: "Join waitlist", href: "#waitlist", clicks: 5 }],
      trend: [{ date: "2026-06-25", visitors: 42 }],
      aiExplanation: "Run the Analytics Agent to explain the latest movement."
    };

    const result = await explainAnalyticsSnapshot(snapshot, failingClient);

    expect(result.visitors).toBe(42);
    expect(result.aiExplanation).toContain("forgeko.example");
  });

  it("generates local insights when Gemini analysis fails", async () => {
    const snapshot: FounderHubSnapshot = {
      communityItems: [
        {
          id: "c1",
          source: "x",
          title: "Roadmap uncertainty",
          author: "founder",
          url: "https://x.example/post",
          summary: "Founder does not know what to build next.",
          painPoint: "roadmap uncertainty",
          userLanguage: ["does not know what to build next"],
          postAngle: "X post: A roadmap gets easier when it is tied to evidence.",
          relevanceScore: 77,
          suggestedReply: "Ask what they tried.",
          replyRationale: "Relevant founder workflow.",
          createdAt: "2026-06-25T10:00:00.000Z"
        }
      ],
      analytics: {
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
        aiExplanation: ""
      },
      feedback: [],
      insights: [],
      memory: []
    };

    const insights = await generateInsights(snapshot, failingClient);

    expect(insights[0].summary).toContain("roadmap uncertainty");
  });

  it("does not invent pain point insights when no community or feedback exists", async () => {
    const snapshot: FounderHubSnapshot = {
      communityItems: [],
      analytics: {
        visitors: 4,
        uniqueVisitors: 4,
        conversions: 36,
        conversionRate: 0,
        waitlistSignups: 0,
        waitlistConfirmed: 0,
        waitlistConversionRate: 0,
        waitlistSources: [],
        pageEvents: [],
        topReferrers: [{ source: "Direct / None", visitors: 3 }],
        topPages: [{ path: "/", visitors: 4 }],
        topClicks: [],
        trend: [{ date: "2026-06-24", visitors: 4 }],
        aiExplanation: "Direct / None is the strongest visible acquisition source this week."
      },
      feedback: [],
      insights: [],
      memory: []
    };

    await expect(generateInsights(snapshot, failingClient)).resolves.toEqual([]);
  });

  it("keeps manual community analysis usable when Gemini fails", async () => {
    const item = await analyzeManualCommunityInput(
      {
        source: "x",
        title: "Need launch analytics",
        author: "solo",
        url: "https://x.example/launch",
        content: "I launched but cannot tell what growth channel worked."
      },
      failingClient
    );

    expect(item.relevanceScore).toBeGreaterThan(0);
    expect(item.summary).toContain("Need launch analytics");
    expect(item.suggestedReply).not.toContain("Share a short");
    expect(item.userLanguage.length).toBeGreaterThan(0);
    expect(item.postAngle).toContain("X post:");
  });

  it("keeps Gmail emails when Gemini classification fails", async () => {
    const email: FeedbackEmail = {
      id: "e1",
      from: "hello@example.com",
      subject: "Waitlist question",
      snippet: "I want to join.",
      category: "Waitlist",
      summary: "I want to join.",
      painPoint: "unclear founder workflow",
      createdAt: "2026-06-25T10:00:00.000Z"
    };

    await expect(classifyFeedbackEmail(email, failingClient)).resolves.toEqual(email);
  });
});
