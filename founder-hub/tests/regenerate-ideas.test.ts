import { describe, expect, it } from "vitest";

import { emptyFounderHubSnapshot } from "@/lib/snapshot";
import { regeneratePostDraftsFromSnapshot, regenerateVideoIdeasFromSnapshot } from "@/services/regenerate-ideas";
import type { FounderHubSnapshot } from "@/types/founder-hub";

const now = new Date("2026-06-27T10:00:00.000Z");

function sourceSnapshot(): FounderHubSnapshot {
  return {
    ...emptyFounderHubSnapshot,
    newsItems: [
      {
        id: "news_1",
        source: "techcrunch",
        title: "AI launch tools are moving into founder workflows",
        url: "https://example.com/news",
        summary: "AI products are becoming more useful when connected to workflow context.",
        topic: "ai",
        score: 91,
        publishedAt: "2026-06-27T08:00:00.000Z"
      }
    ],
    communityItems: [
      {
        id: "reddit_1",
        source: "reddit",
        kind: "post",
        subreddit: "microsaas",
        title: "I keep losing track of launch tasks",
        author: "founder",
        url: "https://reddit.com/r/microsaas/example",
        summary: "A founder is struggling to connect launch tasks.",
        painPoint: "losing context between landing, waitlist, and analytics",
        userLanguage: ["I keep losing track of what matters next"],
        postAngle: "Project Memory keeps launch decisions connected.",
        relevanceScore: 92,
        suggestedReply: "Track the decision you need next, not another feature.",
        replyRationale: "The thread maps to Forgeko's positioning.",
        createdAt: "2026-06-27T09:00:00.000Z"
      }
    ],
    postDrafts: [
      {
        id: "old_post",
        title: "Old post",
        body: "old",
        channel: "x-linkedin",
        sourceIds: [],
        rationale: "old",
        createdAt: "2026-06-26T10:00:00.000Z"
      }
    ],
    videoIdeas: [
      {
        id: "old_video",
        channel: "youtube",
        title: "Old video",
        hook: "old",
        outline: ["old"],
        targetAudience: "old",
        sourceIds: [],
        rationale: "old",
        createdAt: "2026-06-26T10:00:00.000Z"
      }
    ]
  };
}

describe("idea regeneration from local source cache", () => {
  it("regenerates post drafts without changing video ideas", async () => {
    const current = sourceSnapshot();

    const result = await regeneratePostDraftsFromSnapshot(current, now);

    expect(result.step).toMatchObject({ id: "postDrafts", status: "ok", count: 3 });
    expect(result.snapshot.postDrafts).toHaveLength(3);
    expect(result.snapshot.postDrafts[0]?.id).toBe("post_1782554400000_0");
    expect(result.snapshot.videoIdeas).toEqual(current.videoIdeas);
  });

  it("regenerates video ideas without changing post drafts", async () => {
    const current = sourceSnapshot();

    const result = await regenerateVideoIdeasFromSnapshot(current, now);

    expect(result.step).toMatchObject({ id: "videoIdeas", status: "ok", count: 4 });
    expect(result.snapshot.videoIdeas).toHaveLength(4);
    expect(result.snapshot.videoIdeas?.[0]?.id).toBe("video_1782554400000_0");
    expect(result.snapshot.postDrafts).toEqual(current.postDrafts);
  });

  it("skips regeneration when no source signals are cached", async () => {
    const result = await regeneratePostDraftsFromSnapshot(emptyFounderHubSnapshot, now);

    expect(result.step).toMatchObject({ id: "postDrafts", status: "skipped", count: 0 });
    expect(result.snapshot.postDrafts).toEqual([]);
  });
});
