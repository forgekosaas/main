import { describe, expect, it } from "vitest";

import { buildRedditFetchPlan, defaultSubreddits } from "@/services/reddit";

describe("Reddit read-only service", () => {
  it("caps configured subreddits at 10 and only builds read-only listing requests", () => {
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
    expect(plan[0].url).toContain("https://oauth.reddit.com/r/SoloDevelopment/search");
    expect(plan[0].url).toContain("limit=3");
    expect(plan.every((request) => request.method === "GET")).toBe(true);
    expect(plan.every((request) => request.url.includes("restrict_sr=1"))).toBe(true);
  });
});
