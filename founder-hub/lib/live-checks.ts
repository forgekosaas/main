export type LiveCheckId = "gemini" | "supabase" | "analytics" | "reddit" | "gmail" | "hackerNews";

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
  mode: "read-only" | "analysis";
  description: string;
}> = [
  {
    id: "gemini",
    label: "AI analysis",
    required: ["GEMINI_API"],
    mode: "analysis",
    description: "Minimal Interactions API JSON check with gemini-3.5-flash."
  },
  {
    id: "supabase",
    label: "Founder Hub Supabase",
    required: ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"],
    mode: "read-only",
    description: "Read-only table existence checks for Founder Hub tables."
  },
  {
    id: "analytics",
    label: "Forgeko analytics",
    required: ["FOUNDER_HUB_ANALYTICS_TOKEN"],
    mode: "read-only",
    description: "GET protected Forgeko analytics summary."
  },
  {
    id: "reddit",
    label: "Reddit community",
    required: ["REDDIT_CLIENT_ID", "REDDIT_CLIENT_SECRET"],
    mode: "read-only",
    description: "OAuth client credentials plus GET subreddit listing."
  },
  {
    id: "gmail",
    label: "Gmail feedback",
    required: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN"],
    mode: "read-only",
    description: "OAuth refresh plus GET messages list with maxResults=1."
  },
  {
    id: "hackerNews",
    label: "Hacker News public search",
    required: [],
    mode: "read-only",
    description: "GET public Algolia HN search results."
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
    ready: Object.values(services).every((service) => service.configured),
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
