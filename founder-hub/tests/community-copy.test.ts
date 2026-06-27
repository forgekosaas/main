import { describe, expect, it } from "vitest";

import { normalizeCommunityCopy } from "@/lib/community-copy";
import type { CommunityItem } from "@/types/founder-hub";

describe("community copy normalization", () => {
  it("replaces generic reply instructions with a ready-to-edit draft", () => {
    const item: CommunityItem = {
      id: "c1",
      source: "reddit",
      title: "How do I validate a SaaS idea?",
      author: "founder",
      url: "https://www.reddit.com/r/startups/comments/1/test",
      summary: "I am not sure if this is worth building.",
      painPoint: "validation uncertainty",
      userLanguage: [],
      postAngle: "",
      relevanceScore: 80,
      suggestedReply: "Share a short, useful observation and ask one clarifying question. Keep Forgeko implicit unless the thread asks for tools.",
      replyRationale: "Relevant founder workflow.",
      createdAt: "2026-06-26T10:00:00.000Z"
    };

    const normalized = normalizeCommunityCopy(item);

    expect(normalized.suggestedReply).not.toContain("Share a short");
    expect(normalized.suggestedReply).toContain("What have you already tested");
    expect(normalized.postAngle).toContain("X post:");
    expect(normalized.userLanguage.length).toBeGreaterThan(0);
  });
});
