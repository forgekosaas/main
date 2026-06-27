import { describe, expect, it } from "vitest";

import { buildHackerNewsSearchUrl, fetchHackerNewsThreads } from "@/services/hacker-news";

describe("Hacker News read-only source", () => {
  it("uses public Algolia search without credentials", () => {
    const url = buildHackerNewsSearchUrl({ query: "solo founder SaaS", limit: 5 });

    expect(url).toContain("hn.algolia.com/api/v1/search");
    expect(url).toContain("query=solo+founder+SaaS");
    expect(url).toContain("hitsPerPage=5");
  });

  it("maps HN hits into community items", async () => {
    const fetcher = async () =>
      new Response(
        JSON.stringify({
          hits: [
            {
              objectID: "123",
              title: "How solo founders validate SaaS ideas",
              author: "pg",
              url: "https://example.com",
              story_text: "Validation without an audience",
              created_at: "2026-06-25T10:00:00.000Z"
            }
          ]
        }),
        { status: 200 }
      );

    const [item] = await fetchHackerNewsThreads({ query: "solo founder", fetcher });

    expect(item.source).toBe("hacker-news");
    expect(item.id).toBe("hn_123");
    expect(item.content).toContain("Validation");
  });
});
