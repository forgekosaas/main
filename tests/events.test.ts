import { describe, expect, it } from "vitest";

import { isAllowedEventType } from "@/lib/events";

describe("first-party event allowlist", () => {
  it("allows anonymous page views for private funnel analytics", () => {
    expect(isAllowedEventType("Page_View")).toBe(true);
  });
});
