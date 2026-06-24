import { describe, expect, it } from "vitest";

import {
  getAgentSkillsIndex,
  getApiCatalog,
  getDiscoveryLinkHeader,
  getHomepageMarkdown,
  getMarkdownTokenCount
} from "@/lib/agent-discovery";

describe("agent discovery metadata", () => {
  const siteUrl = "https://forgeko.com";

  it("advertises machine-readable discovery resources in Link headers", () => {
    const header = getDiscoveryLinkHeader();

    expect(header).toContain("</.well-known/api-catalog>; rel=\"api-catalog\"");
    expect(header).toContain("</openapi.json>; rel=\"service-desc\"");
    expect(header).toContain("</llms.txt>; rel=\"describedby\"; type=\"text/markdown\"");
    expect(header).toContain("</docs/api>; rel=\"service-doc\"");
  });

  it("builds an RFC 9727 API catalog with service description and docs", () => {
    const catalog = getApiCatalog(siteUrl);

    expect(catalog.linkset).toEqual([
      {
        anchor: `${siteUrl}/api/waitlist`,
        "service-desc": [{ href: `${siteUrl}/openapi.json`, type: "application/openapi+json" }],
        "service-doc": [{ href: `${siteUrl}/docs/api`, type: "text/html" }],
        status: [{ href: `${siteUrl}/api/events`, type: "application/json" }]
      }
    ]);
  });

  it("provides a markdown homepage representation for agents", () => {
    const markdown = getHomepageMarkdown(siteUrl);

    expect(markdown).toContain("# Forgeko");
    expect(markdown).toContain("https://forgeko.com/#waitlist");
    expect(getMarkdownTokenCount(markdown)).toBeGreaterThan(50);
  });

  it("publishes a valid agent skills discovery index", () => {
    const index = getAgentSkillsIndex(siteUrl);

    expect(index.$schema).toBe("https://schemas.agentskills.io/discovery/0.2.0/schema.json");
    expect(index.skills).toEqual([
      expect.objectContaining({
        name: "forgeko-site-discovery",
        type: "skill-md",
        description: expect.any(String),
        url: `${siteUrl}/.well-known/agent-skills/forgeko-site-discovery/SKILL.md`
      })
    ]);
    expect(index.skills[0]?.digest).toMatch(/^sha256:[a-f0-9]{64}$/);
  });
});
