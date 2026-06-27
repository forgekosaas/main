export const founderHubGeminiModel = "gemini-3.5-flash";

type Fetcher = (url: string, init?: RequestInit) => Promise<Response>;

export interface AnalysisClient {
  analyzeJson<T = Record<string, unknown>>(request: {
    instructions: string;
    input: unknown;
  }): Promise<T>;
}

interface AnalyzeJsonRequest {
  instructions: string;
  input: unknown;
}

export function createGeminiAnalysisClient({
  apiKey,
  fetcher = fetch
}: {
  apiKey: string;
  fetcher?: Fetcher;
}): AnalysisClient {
  return {
    async analyzeJson<T = Record<string, unknown>>({ instructions, input }: AnalyzeJsonRequest) {
      const response = await fetcher("https://generativelanguage.googleapis.com/v1beta/interactions", {
        method: "POST",
        headers: {
          "x-goog-api-key": apiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: founderHubGeminiModel,
          system_instruction: instructions,
          input: JSON.stringify(input),
          generation_config: {
            thinking_level: "low",
            temperature: 0.2
          },
          response_format: {
            type: "text",
            mime_type: "application/json",
            schema: { type: "object" }
          }
        })
      });

      if (!response.ok) {
        throw new Error(`AI analysis failed with status ${response.status}`);
      }

      const payload = (await response.json()) as { output_text?: string; output?: unknown; steps?: unknown };
      const text = payload.output_text ?? extractOutputText(payload.output) ?? extractOutputText(payload.steps);
      if (!text) {
        throw new Error("Gemini response did not include JSON text");
      }

      return JSON.parse(text) as T;
    }
  };
}

function extractOutputText(output: unknown) {
  if (!Array.isArray(output)) {
    return undefined;
  }

  for (const item of output) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const content = (item as { content?: unknown }).content;
    if (!Array.isArray(content)) {
      continue;
    }

    for (const block of content) {
      if (block && typeof block === "object" && "text" in block && typeof block.text === "string") {
        return block.text;
      }
    }
  }

  return undefined;
}
