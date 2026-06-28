import { describe, expect, it } from "vitest";

import { buildFounderHubMarkdown } from "@/lib/export-markdown";
import type { FounderHubSnapshot } from "@/types/founder-hub";

const snapshot: FounderHubSnapshot = {
  newsItems: [
    {
      id: "news_1",
      source: "techcrunch",
      title: "AI launch systems move beyond prototypes",
      url: "https://example.com/news",
      summary: "New tools focus on what happens after generation.",
      topic: "ai",
      score: 91,
      publishedAt: "2026-06-26T08:00:00.000Z"
    }
  ],
  postDrafts: [
    {
      id: "post_1",
      title: "Generation is not continuity",
      body: "Most AI tools help founders generate. Forgeko helps them continue.",
      channel: "x-linkedin",
      sourceIds: ["news_1", "community_1"],
      rationale: "Grounded in news and Reddit pain points.",
      createdAt: "2026-06-27T09:00:00.000Z"
    }
  ],
  analytics: {
    activeUsers: 82,
    visitors: 123,
    uniqueVisitors: 82,
    conversions: 9,
    conversionRate: 7.32,
    waitlistClicks: 12,
    waitlistSubmits: 9,
    waitlistSignups: 14,
    waitlistConfirmed: 11,
    waitlistConversionRate: 78.57,
    clickToSignupRate: 116.7,
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
      kind: "post",
      subreddit: "microsaas",
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
  feedback: [],
  insights: [],
  memory: []
};

describe("Founder Hub Markdown export", () => {
  it("builds one markdown document with all available hub data sections", () => {
    const markdown = buildFounderHubMarkdown(snapshot, "2026-06-27T09:30:00.000Z");

    expect(markdown).toContain("# Forgeko Founder Hub Export");
    expect(markdown).toContain("Generated: 2026-06-27T09:30:00.000Z");
    expect(markdown).toContain("## Daily Post Drafts");
    expect(markdown).toContain("### Generation is not continuity");
    expect(markdown).toContain("Most AI tools help founders generate");
    expect(markdown).toContain("## News Sources");
    expect(markdown).toContain("### AI launch systems move beyond prototypes");
    expect(markdown).toContain("## Analytics");
    expect(markdown).toContain("| Active users | 82 |");
    expect(markdown).toContain("| Waitlist clicks | 12 |");
    expect(markdown).toContain("| Visitors | 123 |");
    expect(markdown).toContain("### Top Referrers");
    expect(markdown).toContain("| newsletter | 44 |");
    expect(markdown).toContain("## Reddit Pain Points");
    expect(markdown).toContain("### Solo founders lose launch context");
    expect(markdown).toContain("| Subreddit | microsaas |");
    expect(markdown).toContain("I keep restarting the launch plan");
    expect(markdown).not.toContain("## Feedback");
    expect(markdown).not.toContain("## Memory");
  });
});
