import { describe, expect, it } from "vitest";

import { parseRssNewsItems, topicMatchesFounderHub } from "@/services/rss-news";

const sampleFeed = `<?xml version="1.0"?>
<rss>
  <channel>
    <item>
      <title>AI agents are changing SaaS onboarding</title>
      <link>https://techcrunch.com/ai-saas-onboarding</link>
      <description><![CDATA[New agent workflows for software teams.]]></description>
      <pubDate>Sat, 27 Jun 2026 09:00:00 GMT</pubDate>
    </item>
    <item>
      <title>Consumer hardware funding slows down</title>
      <link>https://techcrunch.com/hardware</link>
      <description>Not relevant for the founder hub.</description>
      <pubDate>Sat, 27 Jun 2026 08:00:00 GMT</pubDate>
    </item>
    <item>
      <title>AI agents are changing SaaS onboarding</title>
      <link>https://techcrunch.com/ai-saas-onboarding</link>
      <description>Duplicate item.</description>
      <pubDate>Sat, 27 Jun 2026 09:10:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;

describe("RSS-first news source", () => {
  it("keeps only SaaS, AI, solo founder, and startup news with source links", () => {
    const items = parseRssNewsItems({
      source: "techcrunch",
      feedUrl: "https://techcrunch.com/feed/",
      xml: sampleFeed
    });

    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      source: "techcrunch",
      title: "AI agents are changing SaaS onboarding",
      url: "https://techcrunch.com/ai-saas-onboarding",
      summary: "New agent workflows for software teams.",
      topic: "ai"
    });
    expect(items[0].id).toBe("news_techcrunch_ai_saas_onboarding");
    expect(items[0].publishedAt).toBe("2026-06-27T09:00:00.000Z");
  });

  it("matches the founder hub topics without broad consumer noise", () => {
    expect(topicMatchesFounderHub("solo founder validates a micro SaaS idea")).toBe("saas");
    expect(topicMatchesFounderHub("new generative AI model for product teams")).toBe("ai");
    expect(topicMatchesFounderHub("consumer phone launch")).toBeNull();
  });

  it("decodes nested HTML entities in titles and summaries", () => {
    const items = parseRssNewsItems({
      source: "techcrunch",
      feedUrl: "https://techcrunch.com/feed/",
      xml: `<rss><channel><item><title>Anthropic&amp;#8217;s AI&nbsp; startup launch</title><link>https://techcrunch.com/ai</link><description>SaaS founders &amp;amp; AI teams</description></item></channel></rss>`
    });

    expect(items[0].title).toBe("Anthropic's AI startup launch");
    expect(items[0].summary).toBe("SaaS founders & AI teams");
  });
});
