import type { FounderHubEnv } from "@/lib/env";
import { defaultFounderHubSettings } from "@/settings/defaults";
import { fetchForgekoAnalyticsSnapshot, fetchSupabaseAnalyticsSnapshot } from "@/services/forgeko-analytics";
import { createFounderHubSupabase } from "@/services/supabase";
import type { AnalyticsSnapshot } from "@/types/founder-hub";

export async function syncAnalyticsSnapshot(env: FounderHubEnv) {
  const directSnapshot = await fetchSupabaseAnalyticsSnapshot({
    client: createFounderHubSupabase(env),
    period: defaultFounderHubSettings.analyticsPeriod
  });

  if (directSnapshot) {
    return {
      configured: true,
      persisted: false,
      snapshot: {
        ...directSnapshot,
        aiExplanation: explainAnalytics(directSnapshot)
      }
    };
  }

  if (!env.forgekoSiteUrl || !env.forgekoAnalyticsToken) {
    return { configured: false, snapshot: null, reason: "Supabase is not configured and analytics token/site URL is missing." };
  }

  const snapshot = await fetchForgekoAnalyticsSnapshot({
    siteUrl: env.forgekoSiteUrl,
    token: env.forgekoAnalyticsToken,
    period: defaultFounderHubSettings.analyticsPeriod
  });

  return {
    configured: true,
    persisted: false,
    snapshot: {
      ...snapshot,
      aiExplanation: explainAnalytics(snapshot)
    }
  };
}

function explainAnalytics(snapshot: AnalyticsSnapshot) {
  const topReferrer = snapshot.topReferrers[0]?.source ?? "No referrer";
  const conversion = snapshot.waitlistConversionRate === null ? "Visit-to-signup is hidden because tracked visits are incomplete." : `Visit-to-signup is ${snapshot.waitlistConversionRate}%.`;
  return `${topReferrer} is the strongest visible acquisition source in the selected window. ${conversion}`;
}
