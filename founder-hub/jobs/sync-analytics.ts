import { createGeminiAnalysisClient } from "@/ai/client";
import { explainAnalyticsSnapshot } from "@/ai/analytics-agent";
import type { FounderHubEnv } from "@/lib/env";
import { defaultFounderHubSettings } from "@/settings/defaults";
import { fetchForgekoAnalyticsSnapshot } from "@/services/forgeko-analytics";
import { fetchProductSignalSnapshot, mergeProductSignals } from "@/services/product-signals";
import { createFounderHubSupabase, saveAnalyticsSnapshot } from "@/services/supabase";

export async function syncAnalyticsSnapshot(env: FounderHubEnv) {
  if (!env.forgekoSiteUrl || !env.forgekoAnalyticsToken) {
    return { configured: false, snapshot: null };
  }

  const snapshot = await fetchForgekoAnalyticsSnapshot({
    siteUrl: env.forgekoSiteUrl,
    token: env.forgekoAnalyticsToken,
    period: defaultFounderHubSettings.analyticsPeriod
  });
  const db = createFounderHubSupabase(env);
  const productSignals = await fetchProductSignalSnapshot(db, snapshot);
  const enriched = mergeProductSignals(snapshot, productSignals);
  const client = env.geminiApiKey ? createGeminiAnalysisClient({ apiKey: env.geminiApiKey }) : undefined;

  const explained = await explainAnalyticsSnapshot(enriched, client);
  const persisted = await saveAnalyticsSnapshot(db, explained);

  return {
    configured: true,
    persisted,
    snapshot: explained
  };
}
