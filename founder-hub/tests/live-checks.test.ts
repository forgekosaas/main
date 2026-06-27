import { describe, expect, it } from "vitest";

import { buildLiveCheckPlan, summarizeLiveEnv } from "@/lib/live-checks";

describe("live integration check planner", () => {
  it("reports missing env vars without leaking configured secret values", () => {
    const summary = summarizeLiveEnv({
      GEMINI_API: "gemini-secret",
      SUPABASE_URL: "https://db.example",
      SUPABASE_SERVICE_ROLE_KEY: "service-role-secret"
    });

    expect(summary.ready).toBe(false);
    expect(summary.services.gemini.configured).toBe(true);
    expect(summary.services.supabase.configured).toBe(true);
    expect(summary.services.analytics.missing).toEqual(["FOUNDER_HUB_ANALYTICS_TOKEN"]);
    expect(JSON.stringify(summary)).not.toContain("gemini-secret");
    expect(JSON.stringify(summary)).not.toContain("service-role-secret");
  });

  it("builds a read-only live check plan for configured services", () => {
    const plan = buildLiveCheckPlan({
      GEMINI_API: "gemini-secret",
      SUPABASE_URL: "https://db.example",
      SUPABASE_SERVICE_ROLE_KEY: "service-role-secret",
      FOUNDER_HUB_ANALYTICS_TOKEN: "analytics-secret",
      REDDIT_CLIENT_ID: "reddit-client",
      REDDIT_CLIENT_SECRET: "reddit-secret",
      GOOGLE_CLIENT_ID: "google-client",
      GOOGLE_CLIENT_SECRET: "google-secret",
      GOOGLE_REFRESH_TOKEN: "google-refresh"
    });

    expect(plan.map((check) => check.id)).toEqual(["gemini", "supabase", "analytics", "reddit", "gmail", "hackerNews"]);
    expect(plan.every((check) => check.mode === "read-only" || check.id === "gemini")).toBe(true);
    expect(JSON.stringify(plan)).not.toContain("secret");
  });
});
