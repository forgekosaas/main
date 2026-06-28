import { describe, expect, it } from "vitest";

import { buildMarketingToolkit, buildPerceptionSignals } from "@/lib/perception";
import type { FounderHubSnapshot } from "@/types/founder-hub";

const snapshot: FounderHubSnapshot = {
  newsItems: [],
  postDrafts: [],
  communityItems: [
    {
      id: "c1",
      source: "x",
      title: "I do not know what to build next",
      author: "founder",
      url: "https://x.example/post",
      summary: "Founder needs prioritization help.",
      painPoint: "roadmap uncertainty",
      userLanguage: ["do not know what to build next"],
      postAngle: "X post: Roadmaps get easier when every feature has evidence.",
      relevanceScore: 88,
      suggestedReply: "Ask what signal they already have.",
      replyRationale: "Good fit for Forgeko positioning.",
      createdAt: "2026-06-25T10:00:00.000Z"
    },
    {
      id: "hn1",
      source: "hacker-news",
      title: "Launch thread",
      author: "hn_user",
      url: "https://news.ycombinator.com/item?id=1",
      summary: "HN discussion about launch tactics.",
      painPoint: "launch planning",
      userLanguage: ["launch tactics"],
      postAngle: "X post: A launch is a week of reading signals.",
      relevanceScore: 99,
      suggestedReply: "What did you measure after launch?",
      replyRationale: "Useful as secondary trend context.",
      createdAt: "2026-06-25T10:00:00.000Z"
    }
  ],
  analytics: {
    activeUsers: 4,
    visitors: 4,
    uniqueVisitors: 4,
    conversions: 36,
    conversionRate: 0,
    waitlistClicks: 2,
    waitlistSubmits: 2,
    waitlistSignups: 2,
    waitlistConfirmed: 2,
    waitlistConversionRate: 50,
    clickToSignupRate: 100,
    waitlistSources: [{ source: "cta_final", signups: 2 }],
    pageEvents: [{ eventType: "Waitlist_Submit", count: 2 }],
    topReferrers: [{ source: "Google", visitors: 2 }],
    topPages: [{ path: "/waitlist/confirmed", visitors: 2 }],
    topClicks: [{ label: "Join waitlist", href: "#waitlist", clicks: 2 }],
    trend: [{ date: "2026-06-24", visitors: 4 }],
    aiExplanation: "Google is visible this week."
  },
  feedback: [],
  insights: [],
  memory: []
};

describe("Perception layer", () => {
  it("normalizes analytics and community into ranked perception signals", () => {
    const signals = buildPerceptionSignals(snapshot);

    expect(signals.map((signal) => signal.channel)).toContain("analytics");
    expect(signals.map((signal) => signal.channel)).toContain("community");
    expect(signals[0].strength).toBeGreaterThanOrEqual(signals[1].strength);
    expect(signals.find((signal) => signal.id === "hn1")).toBeUndefined();
  });

  it("turns signals into marketing actions", () => {
    const toolkit = buildMarketingToolkit(snapshot);

    expect(toolkit.postIdeas.length).toBeGreaterThan(0);
    expect(toolkit.replyQueue[0].suggestedReply).toContain("signal");
    expect(toolkit.replyQueue[0].id).toBe("c1");
    expect(toolkit.replyQueue.some((reply) => reply.id === "hn1")).toBe(false);
    expect(toolkit.signals.some((signal) => signal.source === "hacker-news")).toBe(false);
    expect(toolkit.experiments.join(" ")).toContain("waitlist");
  });
});
