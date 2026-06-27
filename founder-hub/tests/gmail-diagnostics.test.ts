import { describe, expect, it } from "vitest";

import { diagnoseGmailReadOnly } from "@/services/gmail";

describe("Gmail diagnostics", () => {
  it("returns token refresh details without throwing", async () => {
    const fetcher = async () =>
      new Response(JSON.stringify({ error: "unauthorized_client", error_description: "Unauthorized" }), { status: 401 });

    const result = await diagnoseGmailReadOnly({
      credentials: {
        clientId: "client",
        clientSecret: "secret",
        refreshToken: "rtok_abc123"
      },
      query: "newer_than:30d",
      fetcher
    });

    expect(result.ok).toBe(false);
    expect(result.stage).toBe("token");
    expect(result.message).toContain("unauthorized_client");
    expect(JSON.stringify(result)).not.toContain("secret");
    expect(JSON.stringify(result)).not.toContain("rtok_abc123");
  });
});
