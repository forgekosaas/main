import { createGeminiAnalysisClient } from "@/ai/client";
import { analyzeCommunityItem } from "@/ai/community-agent";
import type { FounderHubEnv } from "@/lib/env";
import { defaultFounderHubSettings } from "@/settings/defaults";
import { fetchHackerNewsThreads } from "@/services/hacker-news";
import { createFounderHubSupabase, saveCommunityCache, saveCommunityItem } from "@/services/supabase";

export async function syncHackerNewsCommunity(env: FounderHubEnv) {
  const rawItems = await fetchHackerNewsThreads({
    query: defaultFounderHubSettings.hackerNewsQuery,
    limit: defaultFounderHubSettings.hackerNewsLimit
  });
  const client = env.geminiApiKey ? createGeminiAnalysisClient({ apiKey: env.geminiApiKey }) : undefined;
  const db = createFounderHubSupabase(env);
  const items = [];
  let persisted = 0;

  for (const rawItem of rawItems) {
    const item = await analyzeCommunityItem(rawItem, client);
    if (item.relevanceScore < 55) {
      continue;
    }

    items.push(item);
    try {
      if (await saveCommunityItem(db, item)) {
        persisted += 1;
      }
    } catch {
      // Keep the fetched signal visible even if the local schema needs the hacker-news source migration.
    }
  }

  const cached = await saveCommunityCache(db, "hacker_news_latest", items).catch(() => false);
  return { configured: true, items, persisted, cached };
}
