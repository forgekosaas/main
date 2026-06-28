import type { PublicSettingsStatus, ServiceStatus } from "@/types/founder-hub";

export interface FounderHubEnv {
  geminiApiKey?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  supabaseServiceRoleKey?: string;
  forgekoSiteUrl?: string;
  forgekoAnalyticsToken?: string;
  googleClientId?: string;
  googleClientSecret?: string;
  googleRefreshToken?: string;
  redditClientId?: string;
  redditClientSecret?: string;
  redditUsername?: string;
  redditPassword?: string;
  founderHubSecret?: string;
  baseUrl: string;
  allowRemote: boolean;
}

type EnvSource = Record<string, string | undefined>;

export function getFounderHubEnv(source: EnvSource = process.env): FounderHubEnv {
  return {
    geminiApiKey: clean(source.GEMINI_API) ?? clean(source.GEMINI_API_KEY),
    supabaseUrl: clean(source.SUPABASE_URL),
    supabaseAnonKey: clean(source.SUPABASE_ANON_KEY),
    supabaseServiceRoleKey: clean(source.SUPABASE_SERVICE_ROLE_KEY),
    forgekoSiteUrl: clean(source.FORGEKO_SITE_URL) ?? "https://forgeko.com",
    forgekoAnalyticsToken: clean(source.FOUNDER_HUB_ANALYTICS_TOKEN),
    googleClientId: clean(source.GOOGLE_CLIENT_ID),
    googleClientSecret: clean(source.GOOGLE_CLIENT_SECRET),
    googleRefreshToken: clean(source.GOOGLE_REFRESH_TOKEN),
    redditClientId: clean(source.REDDIT_CLIENT_ID),
    redditClientSecret: clean(source.REDDIT_CLIENT_SECRET),
    redditUsername: clean(source.REDDIT_USERNAME),
    redditPassword: clean(source.REDDIT_PASSWORD),
    founderHubSecret: clean(source.FOUNDER_HUB_SECRET),
    baseUrl: clean(source.NEXT_PUBLIC_BASE_URL) ?? "http://127.0.0.1:3030",
    allowRemote: source.FOUNDER_HUB_ALLOW_REMOTE === "true"
  };
}

export function getPublicSettingsStatus(env: FounderHubEnv): PublicSettingsStatus {
  return {
    gemini: serviceStatus("Local draft engine", [], []),
    supabase: serviceStatus(
      "Optional landing waitlist source",
      [],
      []
    ),
    analytics: serviceStatus(
      "Forgeko analytics",
      ["FORGEKO_SITE_URL", "FOUNDER_HUB_ANALYTICS_TOKEN"],
      [env.forgekoSiteUrl, env.forgekoAnalyticsToken]
    ),
    reddit: serviceStatus(
      "Manual Reddit input",
      [],
      []
    ),
    hackerNews: serviceStatus("Hacker News public search", [], []),
    rssNews: serviceStatus("RSS news", [], [])
  };
}

export function hasGemini(env: FounderHubEnv) {
  void env;
  return false;
}

function clean(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function serviceStatus(label: string, names: string[], values: Array<string | undefined>): ServiceStatus {
  const missing = names.filter((name, index) => !values[index]);
  return {
    label,
    configured: missing.length === 0,
    missing
  };
}
