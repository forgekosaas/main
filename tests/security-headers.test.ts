import { describe, expect, it } from "vitest";

type HeaderConfig = {
  source: string;
  headers: Array<{ key: string; value: string }>;
};

type NextConfigWithHeaders = {
  headers?: () => Promise<HeaderConfig[]>;
};

describe("security headers", () => {
  it("allows Cloudflare Turnstile assets in the Content Security Policy", async () => {
    // next.config.mjs is JavaScript, so the test defines only the shape it needs.
    // @ts-expect-error No declaration file is generated for the root Next config.
    const nextConfig = (await import("@/next.config.mjs")).default as NextConfigWithHeaders;
    const headers = await nextConfig.headers?.();
    const globalHeaders = headers?.find((entry) => entry.source === "/(.*)")?.headers ?? [];
    const csp = globalHeaders.find((header) => header.key === "Content-Security-Policy")?.value;

    expect(csp).toContain("script-src");
    expect(csp).toContain("connect-src");
    expect(csp).toContain("frame-src");
    expect(csp).toContain("https://challenges.cloudflare.com");
  });
});
