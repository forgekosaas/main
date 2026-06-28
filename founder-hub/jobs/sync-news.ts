import type { FounderHubEnv } from "@/lib/env";
import { fetchRssNewsItems } from "@/services/rss-news";

export async function syncNewsItems(env: FounderHubEnv) {
  void env;
  const items = await fetchRssNewsItems();

  return {
    configured: true,
    items,
    persisted: false
  };
}
