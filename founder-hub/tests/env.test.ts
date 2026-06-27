import { describe, expect, it } from "vitest";

import { getFounderHubEnv, getPublicSettingsStatus } from "@/lib/env";

describe("Founder Hub env safety", () => {
  it("loads server-only settings without exposing secret values in public status", () => {
    const env = getFounderHubEnv({
      GEMINI_API: "gemini-secret",
      SUPABASE_URL: "https://db.example",
      SUPABASE_ANON_KEY: "anon",
      SUPABASE_SERVICE_ROLE_KEY: "service-role",
      FORGEKO_SITE_URL: "https://forgeko.com",
      FOUNDER_HUB_ANALYTICS_TOKEN: "analytics-secret",
      GOOGLE_CLIENT_ID: "google-client",
      GOOGLE_CLIENT_SECRET: "google-secret",
      GOOGLE_REFRESH_TOKEN: "google-refresh",
      REDDIT_CLIENT_ID: "reddit-client",
      REDDIT_CLIENT_SECRET: "reddit-secret",
      FOUNDER_HUB_SECRET: "local-secret",
      NEXT_PUBLIC_BASE_URL: "http://127.0.0.1:3030"
    });

    const status = getPublicSettingsStatus(env);

    expect(status.gemini.configured).toBe(true);
    expect(status.analytics.configured).toBe(true);
    expect(status.gmail.configured).toBe(true);
    expect(status.reddit.configured).toBe(true);
    expect(JSON.stringify(status)).not.toContain("gemini-secret");
    expect(JSON.stringify(status)).not.toContain("service-role");
    expect(JSON.stringify(status)).not.toContain("analytics-secret");
    expect(JSON.stringify(status)).not.toContain("google-secret");
    expect(JSON.stringify(status)).not.toContain("reddit-secret");
  });
});
