import type { FounderHubSnapshot } from "@/types/founder-hub";
import { normalizeCommunityCopy } from "@/lib/community-copy";
import { actionableFeedbackCount, reliableWaitlistCount } from "@/lib/signal-cleaning";

export interface PerceptionSignal {
  id: string;
  channel: "analytics" | "community" | "feedback" | "insight" | "memory";
  source: string;
  title: string;
  summary: string;
  strength: number;
  action: string;
}

export interface MarketingToolkit {
  signals: PerceptionSignal[];
  postIdeas: Array<{ title: string; angle: string; sourceIds: string[] }>;
  replyQueue: Array<{ id: string; title: string; url: string; suggestedReply: string; rationale: string }>;
  experiments: string[];
}

export function buildPerceptionSignals(snapshot: FounderHubSnapshot): PerceptionSignal[] {
  const signals: PerceptionSignal[] = [];

  if (snapshot.analytics.visitors > 0) {
    signals.push({
      id: "analytics_latest",
      channel: "analytics",
      source: "Forgeko analytics",
      title: `${snapshot.analytics.visitors} visitors and ${snapshot.analytics.conversions} events in the current window`,
      summary: snapshot.analytics.aiExplanation,
      strength: Math.min(100, snapshot.analytics.visitors * 10 + snapshot.analytics.conversions),
      action: "Turn the strongest referrer or page into one distribution experiment."
    });
  }

  for (const item of snapshot.communityItems) {
    const isSecondarySource = item.source === "hacker-news";
    if (isSecondarySource) continue;

    signals.push({
      id: item.id,
      channel: "community",
      source: item.source,
      title: item.title,
      summary: `${item.painPoint}: ${item.summary}`,
      strength: isSecondarySource ? Math.min(45, Math.round(item.relevanceScore * 0.55)) : item.relevanceScore,
      action: isSecondarySource
        ? "Use this as a secondary trend check, not the main social action."
        : "Reply where useful and reuse the pain point as social post material."
    });
  }

  for (const email of snapshot.feedback.filter((item) => item.category !== "Waitlist")) {
    signals.push({
      id: email.id,
      channel: "feedback",
      source: "Gmail",
      title: email.subject,
      summary: `${email.category}: ${email.summary}`,
      strength: email.category === "Waitlist" ? 95 : 75,
      action: "Use this wording as customer language for social proof or objections."
    });
  }

  for (const insight of snapshot.insights) {
    signals.push({
      id: insight.id,
      channel: "insight",
      source: "Founder Hub",
      title: insight.title,
      summary: insight.summary,
      strength: 80,
      action: "Convert this into a positioning or content decision."
    });
  }

  return signals.sort((a, b) => b.strength - a.strength);
}

export function buildMarketingToolkit(snapshot: FounderHubSnapshot): MarketingToolkit {
  const signals = buildPerceptionSignals(snapshot);
  const primaryCommunity = snapshot.communityItems
    .filter((item) => item.source !== "hacker-news")
    .map(normalizeCommunityCopy)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
  const replyQueue = snapshot.communityItems
    .filter((item) => item.source !== "hacker-news" && item.relevanceScore >= 65)
    .map(normalizeCommunityCopy)
    .sort((a, b) => {
      if (a.source === "hacker-news" && b.source !== "hacker-news") return 1;
      if (a.source !== "hacker-news" && b.source === "hacker-news") return -1;
      return b.relevanceScore - a.relevanceScore;
    })
    .slice(0, 6)
    .map((item) => ({
      id: item.id,
      title: item.title,
      url: item.url,
      suggestedReply: item.suggestedReply,
      rationale: item.replyRationale
    }));

  const postIdeas = [
    ...primaryCommunity.slice(0, 3).map((item) => ({
      title: `Post from pain point: ${item.painPoint}`,
      angle: item.postAngle,
      sourceIds: [item.id]
    })),
    ...snapshot.insights.slice(0, 2).map((insight) => ({
      title: insight.title,
      angle: insight.summary,
      sourceIds: insight.evidenceIds.slice(0, 2)
    }))
  ].slice(0, 5);

  const waitlistCount = reliableWaitlistCount(snapshot);
  const realFeedback = actionableFeedbackCount(snapshot);

  const experiments = [
    primaryCommunity[0]
      ? `Reply to the highest-fit ${primaryCommunity[0].source} post, then reuse the same pain point as one X post.`
      : "Add one manual Reddit/X/IH signal before choosing a social experiment.",
    waitlistCount > 0
      ? `${waitlistCount} Gmail waitlist signal${waitlistCount === 1 ? "" : "s"} are visible. Compare the next social reply against this number after updating data.`
      : "Use Gmail waitlist notifications as the reliable waitlist counter before judging conversion.",
    realFeedback > 0
      ? `Turn the latest real feedback into one objection-handling post.`
      : "Ask one specific feedback question in the next reply instead of pitching Forgeko."
  ];

  return { signals, postIdeas, replyQueue, experiments };
}
