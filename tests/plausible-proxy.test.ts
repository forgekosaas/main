import { describe, expect, it } from "vitest";

import {
  buildPlausibleEventRequest,
  buildPlausibleEventResponseHeaders
} from "@/lib/plausible-proxy";

describe("Plausible Worker proxy", () => {
  it("forwards events without cookies and with the visitor IP", () => {
    const request = new Request("https://forgeko.com/p/event", {
      method: "POST",
      headers: {
        "cf-connecting-ip": "203.0.113.10",
        "content-type": "text/plain",
        cookie: "session=private",
        "user-agent": "vitest"
      },
      body: JSON.stringify({ n: "pageview", u: "https://forgeko.com/" })
    });

    const proxied = buildPlausibleEventRequest(request, "https://plausible.example");

    expect(proxied.url).toBe("https://plausible.example/api/event");
    expect(proxied.method).toBe("POST");
    expect(proxied.headers.get("cookie")).toBeNull();
    expect(proxied.headers.get("host")).toBeNull();
    expect(proxied.headers.get("cf-connecting-ip")).toBeNull();
    expect(proxied.headers.get("x-forwarded-for")).toBe("203.0.113.10");
    expect(proxied.headers.get("user-agent")).toBe("vitest");
    expect(proxied.headers.get("content-type")).toBe("text/plain");
    expect(proxied.body).toBe(request.body);
  });

  it("preserves Plausible drop diagnostics in proxied responses", () => {
    const headers = buildPlausibleEventResponseHeaders(
      new Headers({
        "content-type": "application/json",
        "x-plausible-dropped": "1"
      })
    );

    expect(headers.get("content-type")).toBe("application/json");
    expect(headers.get("cache-control")).toBe("no-store");
    expect(headers.get("x-content-type-options")).toBe("nosniff");
    expect(headers.get("x-plausible-dropped")).toBe("1");
  });
});
