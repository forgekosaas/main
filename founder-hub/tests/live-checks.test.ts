import { describe, expect, it } from "vitest";

import { buildLiveCheckPlan, summarizeLiveEnv } from "@/lib/live-checks";

describe("live integration check planner", () => {
  it("reports missing env vars without leaking configured secret values", () => {
    const summary = summarizeLiveEnv({
      SUPABASE_URL: "https://db.example",
      SUPABASE_SERVICE_ROLE_KEY: "service-role-secret"
    });

    expect(summary.ready).toBe(true);
    expect(summary.services.gemini.configured).toBe(true);
    expect(summary.services.supabase.configured).toBe(true);
    expect(summary.services.analytics.missing).toEqual(["FOUNDER_HUB_ANALYTICS_TOKEN"]);
    expect(JSON.stringify(summary)).not.toContain("service-role-secret");
  });

  it("builds a read-only live check plan for configured services", () => {
    const plan = buildLiveCheckPlan({
      SUPABASE_URL: "https://db.example",
      SUPABASE_SERVICE_ROLE_KEY: "service-role-secret",
      FOUNDER_HUB_ANALYTICS_TOKEN: "analytics-secret"
    });

    expect(plan.map((check) => check.id)).toEqual(["gemini", "supabase", "analytics", "reddit", "hackerNews", "rssNews"]);
    expect(plan.every((check) => check.mode === "read-only")).toBe(true);
    expect(JSON.stringify(plan)).not.toContain("secret");
  });
});
