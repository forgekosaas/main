import { describe, expect, it, vi } from "vitest";

import { verifyTurnstileToken } from "@/lib/turnstile";

describe("Turnstile verification", () => {
  it("skips verification when no secret key is configured", async () => {
    const fetchImpl = vi.fn();

    const result = await verifyTurnstileToken({
      token: undefined,
      secretKey: undefined,
      fetchImpl
    });

    expect(result).toEqual({ ok: true, skipped: true });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("rejects missing tokens when a secret key is configured", async () => {
    const result = await verifyTurnstileToken({
      token: "",
      secretKey: "turnstile-secret",
      fetchImpl: vi.fn()
    });

    expect(result).toEqual({
      ok: false,
      code: "TURNSTILE_REQUIRED"
    });
  });

  it("validates tokens with Cloudflare Siteverify", async () => {
    const fetchImpl = vi.fn(async () =>
      Response.json({
        success: true
      })
    );

    const result = await verifyTurnstileToken({
      token: "client-token",
      secretKey: "turnstile-secret",
      remoteIp: "203.0.113.10",
      fetchImpl
    });

    expect(result).toEqual({ ok: true, skipped: false });
    expect(fetchImpl).toHaveBeenCalledWith(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      expect.objectContaining({
        method: "POST",
        body: expect.any(FormData)
      })
    );

    const calls = fetchImpl.mock.calls as unknown as [string, RequestInit][];
    const body = calls[0]?.[1]?.body as FormData;
    expect(body.get("secret")).toBe("turnstile-secret");
    expect(body.get("response")).toBe("client-token");
    expect(body.get("remoteip")).toBe("203.0.113.10");
  });

  it("rejects unsuccessful Siteverify responses", async () => {
    const fetchImpl = vi.fn(async () =>
      Response.json({
        success: false,
        "error-codes": ["invalid-input-response"]
      })
    );

    const result = await verifyTurnstileToken({
      token: "bad-token",
      secretKey: "turnstile-secret",
      fetchImpl
    });

    expect(result).toEqual({
      ok: false,
      code: "TURNSTILE_FAILED"
    });
  });
});
