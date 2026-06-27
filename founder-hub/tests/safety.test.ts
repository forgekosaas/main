import { describe, expect, it } from "vitest";

import { assertReadOnlyHttpMethod, isLocalFounderHubHost } from "@/lib/safety";

describe("Founder Hub safety helpers", () => {
  it("allows local hosts and rejects ordinary remote hosts by default", () => {
    expect(isLocalFounderHubHost("127.0.0.1:3030")).toBe(true);
    expect(isLocalFounderHubHost("localhost:3030")).toBe(true);
    expect(isLocalFounderHubHost("[::1]:3030")).toBe(true);
    expect(isLocalFounderHubHost("forgeko.com")).toBe(false);
  });

  it("blocks external mutation methods for read-only services", () => {
    expect(() => assertReadOnlyHttpMethod("GET")).not.toThrow();
    expect(() => assertReadOnlyHttpMethod("HEAD")).not.toThrow();
    expect(() => assertReadOnlyHttpMethod("POST")).toThrow("Founder Hub external services are read-only");
    expect(() => assertReadOnlyHttpMethod("DELETE")).toThrow("Founder Hub external services are read-only");
  });
});
