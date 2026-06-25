import { describe, expect, it, vi } from "vitest";

import { isAllowedEventType } from "@/lib/events";
import { submitWaitlistSignup } from "@/lib/waitlist";

describe("waitlist signup", () => {
  it("rejects invalid email", async () => {
    const result = await submitWaitlistSignup({
      input: { email: "not-an-email", consentMarketing: true, source: "cta_final" },
      requestMeta: { userAgent: "vitest", country: "IT" },
      deps: fakeDeps()
    });

    expect(result.ok).toBe(false);
    expect(result.status).toBe(400);
    expect(result.code).toBe("INVALID_EMAIL");
  });

  it("rejects missing marketing consent", async () => {
    const result = await submitWaitlistSignup({
      input: { email: "founder@forgeko.com", consentMarketing: false, source: "cta_final" },
      requestMeta: { userAgent: "vitest", country: "IT" },
      deps: fakeDeps()
    });

    expect(result.ok).toBe(false);
    expect(result.status).toBe(400);
    expect(result.code).toBe("CONSENT_REQUIRED");
  });

  it("creates a confirmed signup and sends a short welcome email", async () => {
    const deps = fakeDeps();

    const result = await submitWaitlistSignup({
      input: { email: " Founder@Forgeko.com ", consentMarketing: true, source: "hero" },
      requestMeta: { userAgent: "vitest", country: "IT" },
      deps
    });

    expect(result.ok).toBe(true);
    expect(result.status).toBe(201);
    expect(deps.upsertWaitlist).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "founder@forgeko.com",
        source: "hero",
        consent_marketing: true,
        country: "IT",
        user_agent: "vitest",
        confirmed: true,
        confirmed_at: expect.any(String)
      })
    );
    expect(deps.sendWaitlistWelcomeEmail).toHaveBeenCalledWith({ email: "founder@forgeko.com" });
    expect(deps.recordWaitlistEmailSent).toHaveBeenCalledWith("founder@forgeko.com", "email_123");
  });

  it("notifies the team when a new waitlist user is created", async () => {
    const deps = fakeDeps();

    const result = await submitWaitlistSignup({
      input: { email: "builder@example.com", consentMarketing: true, source: "solution" },
      requestMeta: { userAgent: "Mozilla/5.0", country: "US", metadata: { referer: "https://forgeko.com/" } },
      deps
    });

    expect(result.ok).toBe(true);
    expect(deps.sendNewWaitlistUserEmail).toHaveBeenCalledWith({
      email: "builder@example.com",
      source: "solution",
      country: "US",
      userAgent: "Mozilla/5.0"
    });
  });

  it("returns an already joined response for confirmed duplicate email", async () => {
    const deps = fakeDeps({ upsertStatus: "confirmed_duplicate" });

    const result = await submitWaitlistSignup({
      input: { email: "founder@forgeko.com", consentMarketing: true, source: "cta_final" },
      requestMeta: { userAgent: "vitest", country: "IT" },
      deps
    });

    expect(result.ok).toBe(true);
    expect(result.status).toBe(200);
    expect(result.code).toBe("ALREADY_JOINED");
    expect(deps.sendWaitlistWelcomeEmail).not.toHaveBeenCalled();
    expect(deps.sendNewWaitlistUserEmail).not.toHaveBeenCalled();
  });

  it("activates an unconfirmed duplicate and sends the welcome email", async () => {
    const deps = fakeDeps({ upsertStatus: "pending_duplicate" });

    const result = await submitWaitlistSignup({
      input: { email: "founder@forgeko.com", consentMarketing: true, source: "cta_final" },
      requestMeta: { userAgent: "vitest", country: "IT" },
      deps
    });

    expect(result.ok).toBe(true);
    expect(result.status).toBe(201);
    expect(result.code).toBe("CREATED");
    expect(deps.sendWaitlistWelcomeEmail).toHaveBeenCalledWith({ email: "founder@forgeko.com" });
    expect(deps.recordWaitlistEmailSent).toHaveBeenCalledWith("founder@forgeko.com", "email_123");
    expect(deps.sendNewWaitlistUserEmail).not.toHaveBeenCalled();
  });
});

describe("event allowlist", () => {
  it("accepts documented event names and rejects unknown names", () => {
    expect(isAllowedEventType("CTA_Hero_Click")).toBe(true);
    expect(isAllowedEventType("Feedback_Submit")).toBe(true);
    expect(isAllowedEventType("Injected_Event")).toBe(false);
  });
});

function fakeDeps(options: { upsertStatus?: "created" | "pending_duplicate" | "confirmed_duplicate" } = {}) {
  return {
    siteUrl: "https://forgeko.com",
    upsertWaitlist: vi.fn(async () => ({ status: options.upsertStatus ?? "created" })),
    sendWaitlistWelcomeEmail: vi.fn(async () => ({ id: "email_123" })),
    sendNewWaitlistUserEmail: vi.fn(async () => ({ id: "admin_email_123" })),
    recordWaitlistEmailSent: vi.fn(async () => undefined)
  };
}
