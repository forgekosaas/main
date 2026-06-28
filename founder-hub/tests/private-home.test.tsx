import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { FounderHubHome } from "@/components/FounderHubHome";
import { emptyFounderHubSnapshot } from "@/lib/snapshot";

describe("private Founder Hub home", () => {
  it("renders the single private hub surface without Gmail or old dashboard labels", () => {
    const html = renderToStaticMarkup(<FounderHubHome snapshot={emptyFounderHubSnapshot} />);

    expect(html).toContain("Daily Post Drafts");
    expect(html).toContain("Manual Community Pain Points");
    expect(html).toContain("Analytics");
    expect(html).toContain("Extract latest data");
    expect(html).toContain("Regenerate post ideas");
    expect(html).toContain("Regenerate video ideas");
    expect(html).toContain("Export data");
    expect(html).not.toContain("Dashboard");
    expect(html).not.toContain("Gmail");
  });

  it("shows only raw funnel counts in the top metric tiles", () => {
    const html = renderToStaticMarkup(<FounderHubHome snapshot={emptyFounderHubSnapshot} />);

    expect(html).toContain("Active users");
    expect(html).toContain("Visits");
    expect(html).toContain("Waitlist clicks");
    expect(html).toContain("Waitlist submits");
    expect(html).toContain("Signups");
    expect(html).not.toContain("Visit to signup");
    expect(html).not.toContain("Click to submit");
    expect(html).not.toContain("Submit to signup");
  });

  it("renders video ideas when source-backed ideas are available", () => {
    const html = renderToStaticMarkup(
      <FounderHubHome
        snapshot={{
          ...emptyFounderHubSnapshot,
          videoIdeas: [
            {
              id: "video_1",
              channel: "tiktok-instagram",
              title: "Build your SaaS without losing the plot",
              hook: "POV: your SaaS idea is not blocked by code.",
              outline: ["Show scattered tools", "Show one launch memory", "CTA to waitlist"],
              targetAudience: "18-21 aspiring SaaS founders",
              sourceIds: ["news_1"],
              rationale: "Short-form awareness angle.",
              createdAt: "2026-06-27T10:00:00.000Z"
            }
          ]
        }}
      />
    );

    expect(html).toContain("Video Ideas");
    expect(html).toContain("Build your SaaS without losing the plot");
  });
});
