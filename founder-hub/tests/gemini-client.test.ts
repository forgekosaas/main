import { describe, expect, it, vi } from "vitest";

import { createGeminiAnalysisClient } from "@/ai/client";

describe("Gemini analysis client", () => {
  it("uses Gemini Interactions API with GEMINI_API kept server-side", async () => {
    const fetchMock = vi.fn(async () => {
      return new Response(
        JSON.stringify({
          output_text: "{\"summary\":\"ok\"}"
        }),
        { status: 200, headers: { "content-type": "application/json" } }
      );
    });

    const client = createGeminiAnalysisClient({ apiKey: "gemini-secret", fetcher: fetchMock });
    const result = await client.analyzeJson({
      instructions: "Summarize",
      input: { text: "Founder pain" }
    });

    expect(result).toEqual({ summary: "ok" });
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://generativelanguage.googleapis.com/v1beta/interactions");
    expect(init.method).toBe("POST");
    expect(init.headers).toMatchObject({ "x-goog-api-key": "gemini-secret" });
    expect(JSON.parse(String(init.body))).toMatchObject({
      model: "gemini-3.5-flash",
      system_instruction: "Summarize",
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: { type: "object" }
      }
    });
    expect(JSON.stringify(result)).not.toContain("gemini-secret");
  });
});
