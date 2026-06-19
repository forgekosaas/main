import { describe, expect, it, vi } from "vitest";

import { confirmWaitlistSignup } from "@/lib/confirm";
import { hashToken } from "@/lib/crypto";

describe("waitlist confirmation", () => {
  it("rejects missing token", async () => {
    const result = await confirmWaitlistSignup({ token: "", deps: fakeDeps() });

    expect(result.ok).toBe(false);
    expect(result.status).toBe(400);
    expect(result.code).toBe("INVALID_TOKEN");
  });

  it("confirms a matching token hash", async () => {
    const deps = fakeDeps();

    const result = await confirmWaitlistSignup({ token: "token_123", deps });

    expect(result.ok).toBe(true);
    expect(result.status).toBe(200);
    expect(deps.confirmByTokenHash).toHaveBeenCalledWith(await hashToken("token_123"));
  });

  it("returns not found for an unknown token", async () => {
    const result = await confirmWaitlistSignup({
      token: "token_123",
      deps: fakeDeps({ found: false })
    });

    expect(result.ok).toBe(false);
    expect(result.status).toBe(404);
    expect(result.code).toBe("TOKEN_NOT_FOUND");
  });
});

function fakeDeps(options: { found?: boolean } = {}) {
  return {
    confirmByTokenHash: vi.fn(async () => ({ found: options.found ?? true }))
  };
}
