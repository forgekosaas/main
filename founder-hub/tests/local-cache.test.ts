import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { readLocalFounderHubSnapshot, writeLocalFounderHubSnapshot } from "@/services/local-cache";
import { emptyFounderHubSnapshot } from "@/lib/snapshot";

describe("local Founder Hub cache", () => {
  it("writes and reads private snapshots from an untracked local path", async () => {
    const dir = await mkdtemp(join(tmpdir(), "founder-hub-cache-"));
    const filePath = join(dir, "founder-hub-snapshot.json");

    try {
      const snapshot = {
        ...emptyFounderHubSnapshot,
        newsItems: [
          {
            id: "news_1",
            source: "techcrunch" as const,
            title: "AI launch tools get more practical",
            url: "https://example.com/news",
            summary: "Launch workflows are moving beyond code generation.",
            topic: "ai" as const,
            score: 91,
            publishedAt: "2026-06-27T09:00:00.000Z"
          }
        ]
      };

      await writeLocalFounderHubSnapshot(snapshot, filePath);

      await expect(readLocalFounderHubSnapshot(filePath)).resolves.toMatchObject({
        newsItems: [{ id: "news_1", title: "AI launch tools get more practical" }]
      });
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
