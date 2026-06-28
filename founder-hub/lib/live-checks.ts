export type LiveCheckId = "gemini" | "supabase" | "analytics" | "reddit" | "hackerNews" | "rssNews";

export interface LiveServiceStatus {
  id: LiveCheckId;
  label: string;
  configured: boolean;
  missing: string[];
}

export interface LiveCheckPlanItem extends LiveServiceStatus {
  mode: "read-only" | "analysis";
  description: string;
}

type EnvSource = Record<string, string | undefined>;

const serviceDefinitions: Array<{
  id: LiveCheckId;
  label: string;
  required: string[];
  optional?: boolean;
  mode: "read-only" | "analysis";
  description: string;
}> = [
  {
    id: "gemini",
    label: "Local draft engine",
    required: [],
    mode: "read-only",
    description: "Deterministic local draft generation without a cloud model."
  },
  {
    id: "supabase",
    label: "Local Founder Hub cache",
    required: [],
    mode: "read-only",
    description: "Reads and writes the private local Founder Hub snapshot file."
  },
  {
    id: "analytics",
    label: "Forgeko analytics",
    required: ["FOUNDER_HUB_ANALYTICS_TOKEN"],
    optional: true,
    mode: "read-only",
    description: "GET protected Forgeko analytics summary."
  },
  {
    id: "reddit",
    label: "Reddit public JSON",
    required: [],
    mode: "read-only",
    description: "GET public subreddit JSON without OAuth credentials."
  },
  {
    id: "hackerNews",
    label: "Hacker News public search",
    required: [],
    mode: "read-only",
    description: "GET public Algolia HN search results."
  },
  {
    id: "rssNews",
    label: "RSS news",
    required: [],
    mode: "read-only",
    description: "GET public RSS feeds for SaaS, AI, and solo founder news."
  }
];

export function summarizeLiveEnv(env: EnvSource) {
  const services = Object.fromEntries(
    serviceDefinitions.map((service) => {
      const missing = service.required.filter((name) => !hasValue(env[name]));
      return [
        service.id,
        {
          id: service.id,
          label: service.label,
          configured: missing.length === 0,
          missing
        } satisfies LiveServiceStatus
      ];
    })
  ) as Record<LiveCheckId, LiveServiceStatus>;

  return {
    ready: serviceDefinitions.every((service) => service.optional || services[service.id].configured),
    services
  };
}

export function buildLiveCheckPlan(env: EnvSource): LiveCheckPlanItem[] {
  const summary = summarizeLiveEnv(env);

  return serviceDefinitions
    .filter((service) => summary.services[service.id].configured)
    .map((service) => ({
      ...summary.services[service.id],
      mode: service.mode,
      description: service.description
    }));
}

function hasValue(value: string | undefined) {
  return Boolean(value?.trim());
}
