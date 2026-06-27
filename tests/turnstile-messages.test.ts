import { describe, expect, it } from "vitest";

import { messageForTurnstileCode } from "@/lib/turnstile-messages";

describe("Turnstile user messages", () => {
  it("separates missing challenge tokens from failed challenge tokens", () => {
    expect(messageForTurnstileCode("TURNSTILE_REQUIRED")).toBe(
      "Security check did not complete. Refresh and try again."
    );
    expect(messageForTurnstileCode("TURNSTILE_FAILED")).toBe(
      "Security check failed. Try again or contact us."
    );
  });
});
