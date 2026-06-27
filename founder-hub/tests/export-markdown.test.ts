import { describe, expect, it } from "vitest";

import { buildFounderHubMarkdown } from "@/lib/export-markdown";
import type { FounderHubSnapshot } from "@/types/founder-hub";

const snapshot: FounderHubSnapshot = {
  analytics: {
    visitors: 123,
    uniqueVisitors: 82,
    conversions: 9,
    conversionRate: 7.32,
    waitlistSignups: 14,
    waitlistConfirmed: 11,
    waitlistConversionRate: 78.57,
    waitlistSources: [{ source: "hero", signups: 8 }],
    pageEvents: [{ eventType: "Page_View", count: 123 }],
    topReferrers: [{ source: "newsletter", visitors: 44 }],
    topPages: [{ path: "/", visitors: 91 }],
    topClicks: [{ label: "Join waitlist", href: "/#waitlist", clicks: 12 }],
    trend: [{ date: "2026-06-26", visitors: 19 }],
    aiExplanation: "Traffic is concentrated on the home page."
  },
  communityItems: [
    {
      id: "community_1",
      source: "reddit",
      title: "Solo founders lose launch context",
      author: "u/founder",
      url: "https://example.com/community",
      summary: "Founders keep launch notes in too many places.",
      painPoint: "Scattered launch context",
      userLanguage: ["I keep restarting the launch plan"],
      postAngle: "Ask how founders keep validation notes connected.",
      relevanceScore: 87,
      suggestedReply: "What part of the launch plan gets lost first?",
      replyRationale: "Invites a specific answer without pitching.",
      createdAt: "2026-06-26T10:00:00.000Z"
    }
  ],
  feedback: [
    {
      id: "feedback_1",
      from: "founder@example.com",
      subject: "Need launch continuity",
      snippet: "I want one place for decisions.",
      category: "Feedback",
      summary: "The sender wants decisions and proof in one workflow.",
      painPoint: "Decision memory",
      createdAt: "2026-06-26T11:00:00.000Z"
    }
  ],
  insights: [
    {
      id: "insight_1",
      title: "Continuity is the core promise",
      summary: "Signals point toward preserving launch context.",
      evidenceIds: ["community_1", "feedback_1"],
      createdAt: "2026-06-26T12:00:00.000Z"
    }
  ],
  memory: [
    {
      id: "memory_1",
      date: "2026-06-26",
      title: "Position around continuity",
      motivation: "Community and feedback mention scattered launch work.",
      sources: ["community_1", "feedback_1"],
      consequences: "Homepage copy should emphasize connected decisions."
    }
  ]
};

describe("Founder Hub Markdown export", () => {
  it("builds one markdown document with all available hub data sections", () => {
    const markdown = buildFounderHubMarkdown(snapshot, "2026-06-27T09:30:00.000Z");

    expect(markdown).toContain("# Forgeko Founder Hub Export");
    expect(markdown).toContain("Generated: 2026-06-27T09:30:00.000Z");
    expect(markdown).toContain("## Analytics");
    expect(markdown).toContain("| Visitors | 123 |");
    expect(markdown).toContain("### Top Referrers");
    expect(markdown).toContain("| newsletter | 44 |");
    expect(markdown).toContain("## Community Items");
    expect(markdown).toContain("### Solo founders lose launch context");
    expect(markdown).toContain("I keep restarting the launch plan");
    expect(markdown).toContain("## Feedback");
    expect(markdown).toContain("### Need launch continuity");
    expect(markdown).toContain("## Insights");
    expect(markdown).toContain("### Continuity is the core promise");
    expect(markdown).toContain("## Memory");
    expect(markdown).toContain("### Position around continuity");
  });
});
