import { describe, expect, it } from "vitest";

import { GET as getUmamiScript } from "@/app/p/umami/script.js/route";
import { POST as postUmamiSend } from "@/app/p/umami/send/route";

describe("Umami first-party proxy", () => {
  it("serves the Umami script through a first-party route", async () => {
    const response = await getUmamiScript();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/javascript");
  });

  it("forwards analytics payloads to Umami Cloud", async () => {
    const fetchImpl = globalThis.fetch;
    const calls: Array<[string, RequestInit | undefined]> = [];
    globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
      calls.push([String(url), init]);
      return Response.json({ ok: true }, { status: 202 });
    }) as typeof fetch;

    try {
      const request = new Request("https://forgeko.com/p/umami/send", {
        method: "POST",
        headers: { "content-type": "application/json", "user-agent": "vitest" },
        body: JSON.stringify({ type: "event", payload: { website: "site-id", url: "/" } })
      });

      const response = await postUmamiSend(request);

      expect(response.status).toBe(202);
      expect(calls[0]?.[0]).toBe("https://cloud.umami.is/api/send");
      expect(calls[0]?.[1]).toMatchObject({
        method: "POST"
      });
    } finally {
      globalThis.fetch = fetchImpl;
    }
  });
});
