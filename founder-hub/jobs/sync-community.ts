import { createGeminiAnalysisClient } from "@/ai/client";
import { analyzeCommunityItem } from "@/ai/community-agent";
import type { FounderHubEnv } from "@/lib/env";
import { defaultCommunityQuery, defaultFounderHubSettings } from "@/settings/defaults";
import { fetchRelevantRedditThreads } from "@/services/reddit";
import { createFounderHubSupabase, saveCommunityItem } from "@/services/supabase";

export async function syncRedditCommunity(env: FounderHubEnv) {
  if (!env.redditClientId || !env.redditClientSecret) {
    return { configured: false, items: [] };
  }

  const rawItems = await fetchRelevantRedditThreads({
    credentials: { clientId: env.redditClientId, clientSecret: env.redditClientSecret },
    subreddits: defaultFounderHubSettings.subreddits,
    query: defaultCommunityQuery
  });
  const client = env.geminiApiKey ? createGeminiAnalysisClient({ apiKey: env.geminiApiKey }) : undefined;
  const db = createFounderHubSupabase(env);
  const items = [];

  for (const rawItem of rawItems.slice(0, 12)) {
    const item = await analyzeCommunityItem(rawItem, client);
    if (item.relevanceScore >= 65) {
      await saveCommunityItem(db, item);
      items.push(item);
    }
  }

  return { configured: true, items };
}
