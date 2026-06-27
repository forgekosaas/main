import { describe, expect, it } from "vitest";

import { isActionableFeedbackEmail, presentFeedbackEmail, reliableWaitlistCount } from "@/lib/signal-cleaning";
import type { FeedbackEmail, FounderHubSnapshot } from "@/types/founder-hub";

const baseEmail: FeedbackEmail = {
  id: "gmail_1",
  from: "Forgeko <hello@info.forgeko.com>",
  subject: "A NEW USER joined the Forgeko waitlist",
  snippet: "A NEW USER joined the Forgeko waitlist. Email: user@example.com Source: cta_final Country: IT User agent: Mozilla/5.0 Submitted",
  category: "Waitlist",
  summary: "A NEW USER joined the Forgeko waitlist. Email: user@example.com Source: cta_final Country: IT User agent: Mozilla/5.0 Submitted",
  painPoint: "unclear founder workflow",
  createdAt: "2026-06-26T10:00:00.000Z"
};

describe("signal cleaning", () => {
  it("turns technical waitlist notification emails into short operational summaries", () => {
    const cleaned = presentFeedbackEmail(baseEmail);

    expect(cleaned.summary).toBe("New waitlist signup from cta_final in IT.");
    expect(cleaned.painPoint).toBe("waitlist intent");
    expect(cleaned.summary).not.toContain("User agent");
    expect(cleaned.summary).not.toContain("user@example.com");
  });

  it("filters outbound welcome emails from actionable feedback", () => {
    expect(
      isActionableFeedbackEmail({
        ...baseEmail,
        id: "gmail_2",
        subject: "You're on the Forgeko waitlist.",
        summary: "You're in. Confirm my email: https://forgeko.com/api/waitlist"
      })
    ).toBe(false);
  });

  it("uses actionable Gmail waitlist notifications as the reliable waitlist count", () => {
    const snapshot = {
      feedback: [
        baseEmail,
        { ...baseEmail, id: "gmail_2", subject: "You're on the Forgeko waitlist.", summary: "Confirm my email" },
        { ...baseEmail, id: "gmail_3", category: "Feedback", subject: "New Forgeko feedback", summary: "I need help launching." }
      ]
    } as FounderHubSnapshot;

    expect(reliableWaitlistCount(snapshot)).toBe(1);
  });
});
