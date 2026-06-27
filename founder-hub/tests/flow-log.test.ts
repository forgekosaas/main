import { describe, expect, it } from "vitest";

import { clearFlowEvents, flowLog, getRecentFlowEvents, publicFlowError } from "@/lib/flow-log";

describe("Founder Hub flow logging", () => {
  it("keeps recent route flow events without exposing bearer values", () => {
    clearFlowEvents();

    flowLog({
      route: "/api/analytics/snapshot",
      step: "fetch",
      source: "forgeko_analytics",
      status: "ok",
      detail: "Authorization: Bearer secret-token-value",
      counts: { visitors: 4 }
    });

    const [event] = getRecentFlowEvents();
    expect(event.route).toBe("/api/analytics/snapshot");
    expect(event.detail).toContain("Bearer [redacted]");
    expect(JSON.stringify(event)).not.toContain("secret-token-value");
  });

  it("truncates provider errors before sending them to the UI", () => {
    expect(publicFlowError(new Error("x".repeat(400))).length).toBe(260);
  });
});
