import { afterEach, describe, expect, it, vi } from "vitest";

import { proxyPlausibleScript } from "@/lib/plausible-script-proxy";

const originalPlausibleScriptUrl = process.env.PLAUSIBLE_SCRIPT_URL;

afterEach(() => {
  if (originalPlausibleScriptUrl === undefined) {
    delete process.env.PLAUSIBLE_SCRIPT_URL;
  } else {
    process.env.PLAUSIBLE_SCRIPT_URL = originalPlausibleScriptUrl;
  }

  vi.unstubAllGlobals();
});

describe("Plausible script proxy", () => {
  it("falls back to the default script URL when the configured URL fails", async () => {
    process.env.PLAUSIBLE_SCRIPT_URL = "https://plausible.example/js/missing.js";
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response("Not found", {
          status: 404,
          headers: { "content-type": "text/plain" }
        })
      )
      .mockResolvedValueOnce(
        new Response("console.log('plausible');", {
          status: 200,
          headers: { "content-type": "application/javascript" }
        })
      );
    vi.stubGlobal("fetch", fetchMock);

    const response = await proxyPlausibleScript();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/javascript");
    expect(response.headers.get("cache-control")).toBe(
      "public, max-age=3600, stale-while-revalidate=86400"
    );
    expect(await response.text()).toBe("console.log('plausible');");

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][0]).toBe("https://plausible.example/js/missing.js");
    expect(fetchMock.mock.calls[0][1].cf.cacheTtlByStatus["400-599"]).toBe(0);
    expect(String(fetchMock.mock.calls[1][0])).toMatch(
      /^https:\/\/plausible\.io\/js\/pa-ujaKFMibRz2V4FE8Cum9M\.js\?forgeko_retry=/
    );
    expect(fetchMock.mock.calls[1][1].cf.cacheTtl).toBe(0);
  });

  it("does not mark failed script responses as cacheable", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("Not found", { status: 404 }))
      .mockResolvedValueOnce(new Response("Bad gateway", { status: 502 }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await proxyPlausibleScript();

    expect(response.status).toBe(502);
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
});
