import { analyzeCommunityItem } from "@/ai/community-agent";
import type { FounderHubEnv } from "@/lib/env";
import { defaultCommunityQuery, defaultFounderHubSettings } from "@/settings/defaults";
import { fetchRelevantRedditThreads } from "@/services/reddit";

export async function syncRedditCommunity(env: FounderHubEnv) {
  void env;

  const rawItems = await fetchRelevantRedditThreads({
    subreddits: defaultFounderHubSettings.subreddits,
    query: defaultCommunityQuery
  });
  const items = [];

  for (const rawItem of rawItems.filter(isUsefulRawRedditSignal).slice(0, 20)) {
    const item = await analyzeCommunityItem(rawItem);
    if (item.relevanceScore >= 35) {
      items.push(item);
    }
  }

  return { configured: true, items };
}

function isUsefulRawRedditSignal(item: { title: string; content: string }) {
  const text = `${item.title} ${item.content}`.toLowerCase();
  if (/\b(self[-\s]?promotion|big updates? for the community|comment your saas|drop your saas|startup ideas?\s*\?*)\b/.test(text)) {
    return false;
  }
  if (/\b(my app|i built|i made|launching|working on an app)\b/.test(text) && !/\b(users?|customers?|waitlist|marketing|validate|feedback|mrr|paying|clicks?)\b/.test(text)) {
    return false;
  }
  return true;
}
