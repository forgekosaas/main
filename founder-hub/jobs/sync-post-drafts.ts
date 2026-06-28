import { generateDailyPostDrafts, generateVideoIdeas } from "@/ai/post-draft-agent";
import type { FounderHubEnv } from "@/lib/env";
import type { CommunityItem, NewsItem } from "@/types/founder-hub";

export async function syncPostDrafts({
  env,
  newsItems,
  communityItems
}: {
  env: FounderHubEnv;
  newsItems: NewsItem[];
  communityItems: CommunityItem[];
}) {
  void env;
  const drafts = await generateDailyPostDrafts({ newsItems, communityItems });
  const videoIdeas = await generateVideoIdeas({ newsItems, communityItems });

  return {
    configured: true,
    drafts,
    videoIdeas,
    persisted: false
  };
}
