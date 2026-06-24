import { describe, expect, it, vi } from "vitest";

import { submitFeedback } from "@/lib/feedback";

describe("feedback submission", () => {
  it("rejects invalid feedback input", async () => {
    const deps = fakeDeps();

    const result = await submitFeedback({
      input: { email: "nope", message: "too short", source: "contact" },
      requestMeta: { userAgent: "vitest", country: "IT" },
      deps
    });

    expect(result.ok).toBe(false);
    expect(result.status).toBe(400);
    expect(result.code).toBe("INVALID_FEEDBACK");
    expect(deps.sendFeedbackEmail).not.toHaveBeenCalled();
  });

  it("sends valid feedback to the Forgeko inbox", async () => {
    const deps = fakeDeps();

    const result = await submitFeedback({
      input: {
        email: " Founder@Example.com ",
        message: "I would like to talk about the beta and send product feedback.",
        source: "contact"
      },
      requestMeta: { userAgent: "Mozilla/5.0", country: "US" },
      deps
    });

    expect(result.ok).toBe(true);
    expect(result.status).toBe(202);
    expect(deps.sendFeedbackEmail).toHaveBeenCalledWith({
      email: "founder@example.com",
      message: "I would like to talk about the beta and send product feedback.",
      source: "contact",
      country: "US",
      userAgent: "Mozilla/5.0"
    });
  });
});

function fakeDeps() {
  return {
    sendFeedbackEmail: vi.fn(async () => ({ id: "feedback_email_123" }))
  };
}
