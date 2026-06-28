import { describe, expect, it } from "vitest";

import { buildRedditFetchPlan, defaultSubreddits, fetchRelevantRedditThreads, summarizePainPoints } from "@/services/reddit";

describe("Reddit read-only service", () => {
  it("caps configured subreddits and only builds public JSON requests", () => {
    const plan = buildRedditFetchPlan({
      subreddits: [
        ...defaultSubreddits,
        "smallbusiness",
        "EntrepreneurRideAlong",
        "marketing",
        "webdev",
        "nocode",
        "extra"
      ],
      query: "solo founder SaaS pain"
    });

    expect(plan).toHaveLength(10);
    expect(plan[0].method).toBe("GET");
    expect(plan[0].url).toContain("https://www.reddit.com/r/microsaas/search.json");
    expect(plan[0].url).toContain("limit=3");
    expect(plan.every((request) => request.method === "GET")).toBe(true);
    expect(plan.every((request) => request.url.includes("restrict_sr=1"))).toBe(true);
    expect(plan.every((request) => !request.url.includes("oauth"))).toBe(true);
  });

  it("keeps useful Reddit comments linked to the source thread", async () => {
    const requestedUrls: string[] = [];
    const fetcher = async (url: string) => {
      requestedUrls.push(url);

      if (url.includes("/search.json")) {
        return new Response(
          JSON.stringify({
            data: {
              children: [
                {
                  data: {
                    id: "abc",
                    title: "How do I validate a micro SaaS idea?",
                    author: "founder",
                    permalink: "/r/microsaas/comments/abc/how_do_i_validate/",
                    selftext: "I do not know what signal matters.",
                    created_utc: 1782540000,
                    score: 18
                  }
                }
              ]
            }
          }),
          { status: 200 }
        );
      }

      return new Response(
        JSON.stringify([
          {},
          {
            data: {
              children: [
                {
                  data: {
                    id: "c1",
                    author: "reply_founder",
                    body: "Track whether people click the waitlist before you build more.",
                    permalink: "/r/microsaas/comments/abc/comment/c1/",
                    created_utc: 1782540300,
                    score: 12
                  }
                }
              ]
            }
          }
        ]),
        { status: 200 }
      );
    };

    const items = await fetchRelevantRedditThreads({
      subreddits: ["microsaas"],
      query: "validate SaaS",
      fetcher
    });

    expect(requestedUrls.every((url) => !url.includes("access_token"))).toBe(true);
    expect(requestedUrls.every((url) => !url.includes("oauth.reddit.com"))).toBe(true);
    expect(requestedUrls.some((url) => url.includes("/comments/abc"))).toBe(true);
    expect(items.map((item) => item.kind)).toContain("comment");
    expect(items.find((item) => item.kind === "comment")).toMatchObject({
      id: "reddit_comment_c1",
      subreddit: "microsaas",
      url: "https://www.reddit.com/r/microsaas/comments/abc/comment/c1/"
    });
  });

  it("falls back to Reddit RSS when public JSON is blocked", async () => {
    const fetcher = async (url: string) => {
      if (url.includes(".json")) {
        return new Response("blocked", { status: 403 });
      }

      return new Response(
        `<?xml version="1.0"?><feed>
          <entry>
            <id>t3_rss1</id>
            <title>I am stuck validating my SaaS idea</title>
            <author><name>rss_founder</name></author>
            <link href="https://www.reddit.com/r/microsaas/comments/rss1/stuck/"/>
            <updated>2026-06-27T10:00:00Z</updated>
            <content>I keep building features but cannot tell if anyone wants this.</content>
          </entry>
        </feed>`,
        { status: 200, headers: { "content-type": "application/atom+xml" } }
      );
    };

    const items = await fetchRelevantRedditThreads({ subreddits: ["microsaas"], query: "validate SaaS", fetcher });

    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      id: "reddit_rss1",
      source: "reddit",
      kind: "post",
      subreddit: "microsaas",
      title: "I am stuck validating my SaaS idea"
    });
  });

  it("clusters pain points with cited Reddit sources", () => {
    const clusters = summarizePainPoints([
      {
        id: "reddit_1",
        source: "reddit",
        kind: "post",
        subreddit: "microsaas",
        score: 10,
        title: "I cannot validate this SaaS",
        author: "founder1",
        url: "https://reddit.com/1",
        summary: "Validation is unclear.",
        painPoint: "validation uncertainty",
        userLanguage: ["cannot validate this SaaS"],
        postAngle: "validation",
        relevanceScore: 88,
        suggestedReply: "Ask about signals.",
        replyRationale: "Validation fit.",
        createdAt: "2026-06-27T10:00:00.000Z"
      },
      {
        id: "reddit_2",
        source: "reddit",
        kind: "comment",
        subreddit: "SideProject",
        score: 7,
        title: "Comment on validation",
        author: "founder2",
        url: "https://reddit.com/2",
        summary: "Nobody signs up.",
        painPoint: "validation uncertainty",
        userLanguage: ["nobody signs up"],
        postAngle: "validation",
        relevanceScore: 82,
        suggestedReply: "Ask about landing traffic.",
        replyRationale: "Validation fit.",
        createdAt: "2026-06-27T11:00:00.000Z"
      }
    ]);

    expect(clusters[0]).toMatchObject({
      painPoint: "validation uncertainty",
      count: 2,
      subreddits: ["microsaas", "SideProject"]
    });
    expect(clusters[0].sources).toEqual([
      expect.objectContaining({ subreddit: "microsaas", author: "founder1", url: "https://reddit.com/1" }),
      expect.objectContaining({ subreddit: "SideProject", author: "founder2", url: "https://reddit.com/2" })
    ]);
  });
});
