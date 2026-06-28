import { generateDailyPostDrafts, generateVideoIdeas } from "@/ai/post-draft-agent";
import { emptyAnalyticsSnapshot } from "@/lib/snapshot";
import type { FounderHubSnapshot, SourceHealthItem } from "@/types/founder-hub";

type IdeaStepStatus = SourceHealthItem["status"];

interface RegenerationResult {
  snapshot: FounderHubSnapshot;
  step: SourceHealthItem;
}

export async function regeneratePostDraftsFromSnapshot(snapshot: FounderHubSnapshot | null, now = new Date()): Promise<RegenerationResult> {
  const base = normalizeSnapshot(snapshot);
  const stepBase = { id: "postDrafts", label: "Post drafts", updatedAt: now.toISOString() };

  if (!hasSourceSignals(base)) {
    const step = sourceHealthStep({
      ...stepBase,
      status: "skipped",
      detail: "Run Extract latest data first to load RSS signals, or add community signals manually.",
      count: 0
    });
    return { snapshot: { ...base, sourceHealth: upsertSourceHealth(base.sourceHealth, step) }, step };
  }

  const postDrafts = await generateDailyPostDrafts({
    newsItems: base.newsItems,
    communityItems: base.communityItems,
    now
  });
  const step = sourceHealthStep({
    ...stepBase,
    status: postDrafts.length > 0 ? "ok" : "skipped",
    detail: postDrafts.length > 0 ? `${postDrafts.length} private local post drafts regenerated` : "No usable source signal was available for post drafts.",
    count: postDrafts.length
  });

  return {
    snapshot: { ...base, postDrafts, sourceHealth: upsertSourceHealth(base.sourceHealth, step) },
    step
  };
}

export async function regenerateVideoIdeasFromSnapshot(snapshot: FounderHubSnapshot | null, now = new Date()): Promise<RegenerationResult> {
  const base = normalizeSnapshot(snapshot);
  const stepBase = { id: "videoIdeas", label: "Video ideas", updatedAt: now.toISOString() };

  if (!hasSourceSignals(base)) {
    const step = sourceHealthStep({
      ...stepBase,
      status: "skipped",
      detail: "Run Extract latest data first to load RSS signals, or add community signals manually.",
      count: 0
    });
    return { snapshot: { ...base, sourceHealth: upsertSourceHealth(base.sourceHealth, step) }, step };
  }

  const videoIdeas = await generateVideoIdeas({
    newsItems: base.newsItems,
    communityItems: base.communityItems,
    now
  });
  const step = sourceHealthStep({
    ...stepBase,
    status: videoIdeas.length > 0 ? "ok" : "skipped",
    detail: videoIdeas.length > 0 ? `${videoIdeas.length} video ideas regenerated from cached sources` : "No usable source signal was available for video ideas.",
    count: videoIdeas.length
  });

  return {
    snapshot: { ...base, videoIdeas, sourceHealth: upsertSourceHealth(base.sourceHealth, step) },
    step
  };
}

function hasSourceSignals(snapshot: FounderHubSnapshot) {
  return snapshot.newsItems.length > 0 || snapshot.communityItems.length > 0;
}

function normalizeSnapshot(snapshot: FounderHubSnapshot | null): FounderHubSnapshot {
  return {
    newsItems: snapshot?.newsItems ?? [],
    postDrafts: snapshot?.postDrafts ?? [],
    videoIdeas: snapshot?.videoIdeas ?? [],
    communityItems: snapshot?.communityItems ?? [],
    analytics: { ...emptyAnalyticsSnapshot, ...snapshot?.analytics },
    sourceHealth: snapshot?.sourceHealth ?? [],
    feedback: snapshot?.feedback ?? [],
    insights: snapshot?.insights ?? [],
    memory: snapshot?.memory ?? []
  };
}

function sourceHealthStep(step: Omit<SourceHealthItem, "status"> & { status: IdeaStepStatus }): SourceHealthItem {
  return step;
}

function upsertSourceHealth(current: SourceHealthItem[] | undefined, step: SourceHealthItem) {
  return [...(current ?? []).filter((item) => item.id !== step.id), step];
}
