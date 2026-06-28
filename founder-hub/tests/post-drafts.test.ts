import { describe, expect, it } from "vitest";

import { generateDailyPostDrafts, generateVideoIdeas } from "@/ai/post-draft-agent";
import type { CommunityItem, NewsItem } from "@/types/founder-hub";

const newsItems: NewsItem[] = [
  {
    id: "news_1",
    source: "techcrunch",
    title: "AI launch tools move beyond prototypes",
    url: "https://example.com/ai-launch-tools",
    summary: "New tools focus on launch workflows after code generation.",
    topic: "ai",
    score: 90,
    publishedAt: "2026-06-27T09:00:00.000Z"
  }
];

const communityItems: CommunityItem[] = [
  {
    id: "reddit_1",
    source: "reddit",
    title: "I keep losing context between launch tasks",
    author: "solo_builder",
    url: "https://reddit.com/r/microsaas/comments/1",
    summary: "A founder has a landing page but no connected launch workflow.",
    painPoint: "tool fragmentation",
    userLanguage: ["losing context between launch tasks"],
    postAngle: "X post: fast generation is not the same as startup progress.",
    relevanceScore: 91,
    suggestedReply: "Ask which launch decision keeps getting recreated.",
    replyRationale: "Direct fit for Forgeko positioning.",
    createdAt: "2026-06-27T08:00:00.000Z"
  }
];

describe("daily post draft generation", () => {
  it("generates local private drafts with source ids without a cloud model", async () => {
    const drafts = await generateDailyPostDrafts({ newsItems, communityItems });

    expect(drafts).toHaveLength(3);
    expect(drafts[0].body).toContain("solo SaaS");
    expect(drafts[0].body).toContain("Project Memory");
    expect(drafts[0].sourceIds).toContain("news_1");
    expect(drafts[0].sourceIds).toContain("reddit_1");
    expect(drafts.every((draft) => draft.channel === "x-linkedin")).toBe(true);
  });

  it("returns no drafts when every public source is empty", async () => {
    const drafts = await generateDailyPostDrafts({ newsItems: [], communityItems: [] });

    expect(drafts).toEqual([]);
  });

  it("does not invent Reddit pain points when only news is available", async () => {
    const drafts = await generateDailyPostDrafts({ newsItems, communityItems: [] });
    const body = drafts.map((draft) => draft.body).join("\n");

    expect(drafts).toHaveLength(3);
    expect(body).not.toContain("Today's recurring founder pain point");
    expect(body).not.toContain("Reddit/community pain point");
    expect(drafts.map((draft) => draft.sourceIds)).toEqual([["news_1"], ["news_1"], ["news_1"]]);
  });

  it("generates TikTok Instagram and YouTube ideas from the same source-backed signals", async () => {
    const ideas = await generateVideoIdeas({ newsItems, communityItems });

    expect(ideas).toHaveLength(4);
    expect(ideas.some((idea) => idea.channel === "tiktok-instagram")).toBe(true);
    expect(ideas.some((idea) => idea.channel === "youtube")).toBe(true);
    expect(ideas[0].targetAudience).toContain("18-21");
    expect(ideas.every((idea) => idea.sourceIds.length > 0)).toBe(true);
  });
});
