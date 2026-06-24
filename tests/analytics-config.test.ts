import { describe, expect, it } from "vitest";

import { getAnalyticsConfig } from "@/lib/analytics-config";

describe("analytics config", () => {
  it("uses first-party Cloudflare Worker routes for Plausible by default", () => {
    const config = getAnalyticsConfig({});

    expect(config.plausible.scriptUrl).toBe("/p/js/script.js");
    expect(config.plausible.endpoint).toBe("/p/event");
    expect(config.plausible.domain).toBe("forgeko.com");
  });

  it("keeps Clarity configurable without disabling the default project", () => {
    const config = getAnalyticsConfig({});

    expect(config.clarityProjectId).toBe("x98rtg96a8");
  });
});
