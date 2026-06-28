import type { CommunityItem, NewsItem, PostDraft, VideoIdea } from "@/types/founder-hub";

interface GenerateDailyPostDraftsRequest {
  newsItems: NewsItem[];
  communityItems: CommunityItem[];
  now?: Date;
}

export async function generateDailyPostDrafts({
  newsItems,
  communityItems,
  now = new Date()
}: GenerateDailyPostDraftsRequest): Promise<PostDraft[]> {
  return fallbackPostDrafts(newsItems, communityItems, now);
}

export async function generateVideoIdeas({
  newsItems,
  communityItems,
  now = new Date()
}: GenerateDailyPostDraftsRequest): Promise<VideoIdea[]> {
  if (newsItems.length === 0 && communityItems.length === 0) return [];

  const topNews = newsItems[0];
  const topCommunity = communityItems.find((item) => item.source === "reddit") ?? communityItems[0];
  const sourceIds = [topNews?.id, topCommunity?.id].filter(Boolean) as string[];
  const painPoint = topCommunity?.painPoint ?? "turning a SaaS idea into a real launch without getting lost in tools";
  const newsTitle = topNews?.title ?? "today's AI and SaaS shift";

  return [
    {
      id: `video_${now.getTime()}_0`,
      channel: "tiktok-instagram",
      title: "POV: your SaaS idea is not blocked by code",
      hook: "POV: you can build the feature, but you keep losing the launch plan.",
      outline: [
        "Open with a messy stack of notes, landing copy, analytics, and payment tasks.",
        `Name the pain: ${painPoint}.`,
        "Show Forgeko as the launch memory that keeps the next decision clear."
      ],
      targetAudience: "18-21 aspiring SaaS founders who want an easier first launch",
      sourceIds,
      rationale: "Short-form awareness angle for young builders who feel tool overload before launch.",
      createdAt: now.toISOString()
    },
    {
      id: `video_${now.getTime()}_1`,
      channel: "tiktok-instagram",
      title: "Stop asking AI for another feature",
      hook: "Before you ask AI to build more, ask what proof you have.",
      outline: [
        `Use the current news hook: ${newsTitle}.`,
        "Contrast fast generation with slow validation.",
        "End with a simple Forgeko frame: idea, landing, waitlist, analytics, memory."
      ],
      targetAudience: "18-21 aspiring SaaS founders who use AI builders and want direction",
      sourceIds,
      rationale: "Short educational clip tied to news without hype.",
      createdAt: now.toISOString()
    },
    {
      id: `video_${now.getTime()}_2`,
      channel: "youtube",
      title: "How to launch a SaaS idea without losing context",
      hook: "Most first SaaS launches fail before product-market fit because the founder loses the thread.",
      outline: [
        "Intro: why code generation did not remove launch complexity.",
        `Discuss the source-backed signal: ${newsTitle}.`,
        `Explain the founder pain: ${painPoint}.`,
        "Show the Forgeko workflow: positioning, waitlist, payments, analytics, Project Memory.",
        "Close with a practical checklist for a first launch."
      ],
      targetAudience: "Young SaaS founders plus credibility-focused viewers comparing launch systems",
      sourceIds,
      rationale: "Long-form credibility piece that explains the category and product point of view.",
      createdAt: now.toISOString()
    },
    {
      id: `video_${now.getTime()}_3`,
      channel: "youtube",
      title: "The real problem with AI SaaS builders",
      hook: "The problem is not that AI cannot build. The problem is that the business context disappears.",
      outline: [
        "Set up the AI builder trend.",
        "Break down why scattered launch decisions hurt solo founders.",
        "Use Reddit/news sources as proof points.",
        "Explain how Project Memory changes the workflow.",
        "End with what to measure before building the next feature."
      ],
      targetAudience: "Young builders, indie hackers, and early SaaS operators who want a more serious launch process",
      sourceIds,
      rationale: "Brand credibility video for a broader but still founder-relevant audience.",
      createdAt: now.toISOString()
    }
  ];
}

function fallbackPostDrafts(newsItems: NewsItem[], communityItems: CommunityItem[], now: Date): PostDraft[] {
  if (newsItems.length === 0 && communityItems.length === 0) {
    return [];
  }

  const topNews = newsItems[0];
  const topCommunity = communityItems.find((item) => item.source === "reddit") ?? communityItems[0];
  const sourceIds = [topNews?.id, topCommunity?.id].filter(Boolean) as string[];
  const newsTitle = topNews?.title ?? "today's AI and SaaS news";
  const newsSummary = topNews?.summary ?? "The useful signal is that founders need connected launch decisions, not more disconnected tools.";

  if (!topCommunity) {
    return [
      {
        id: `post_${now.getTime()}_0`,
        title: "Generation is not continuity",
        body: `A pattern I keep seeing in solo SaaS: the tools are getting faster, but the launch context is still scattered.\n\n${newsTitle} is another reminder that AI is moving beyond prototypes.\n\nThe hard part is remembering the target user, the positioning, the launch assumptions, and what changed last week.\n\nThat is why Forgeko is built around Project Memory: not just generating, but helping a solo SaaS project continue.`,
        channel: "x-linkedin",
        sourceIds,
        rationale: "Connects a current AI/SaaS news signal to Forgeko's Project Memory positioning.",
        createdAt: now.toISOString()
      },
      {
        id: `post_${now.getTime()}_1`,
        title: "The useful signal in today's news",
        body: `${newsTitle}\n\nThe interesting part is not just the announcement. It is what this says about the next phase of SaaS building.\n\n${newsSummary}\n\nFor solo founders, the advantage will not be using the most tools. It will be keeping the launch system coherent: positioning, validation, landing, waitlist, analytics, and the decisions behind them.`,
        channel: "x-linkedin",
        sourceIds,
        rationale: "Uses today's public news without inventing a community pain point.",
        createdAt: now.toISOString()
      },
      {
        id: `post_${now.getTime()}_2`,
        title: "A useful launch question",
        body: `A useful question before building another SaaS feature:\n\nWhat decision will this make easier next week?\n\nIf the answer is unclear, the problem may not be code. It may be missing context: who it is for, what pain it solves, what proof you have, and how you will measure the next step.\n\nThat is the gap Forgeko is trying to close for solo SaaS founders.`,
        channel: "x-linkedin",
        sourceIds,
        rationale: "Evergreen Forgeko positioning grounded in the available public news source.",
        createdAt: now.toISOString()
      }
    ];
  }

  const painPoint = topCommunity?.painPoint ?? "tool fragmentation";
  const userLanguage = topCommunity?.userLanguage[0] ?? "losing context between launch tasks";

  return [
    {
      id: `post_${now.getTime()}_0`,
      title: "Generation is not continuity",
      body: `A pattern I keep seeing in solo SaaS: the tools are getting faster, but the launch context is still scattered.\n\n${newsTitle} is another reminder that AI is moving beyond prototypes.\n\nThe hard part is remembering the target user, the positioning, the launch assumptions, and what changed last week.\n\nThat is why Forgeko is built around Project Memory: not just generating, but helping a solo SaaS project continue.`,
      channel: "x-linkedin",
      sourceIds,
      rationale: "Connects a current AI/SaaS news signal to Forgeko's Project Memory positioning.",
      createdAt: now.toISOString()
    },
    {
      id: `post_${now.getTime()}_1`,
      title: "The recurring founder pain",
      body: `Today's recurring founder pain point: ${painPoint}.\n\nThe user language is simple: "${userLanguage}".\n\nThat is usually where solo SaaS builders lose momentum. Not because they cannot build, but because every step lives in a different place: idea, landing, payments, analytics, feedback.\n\nA launch system should keep those decisions connected.`,
      channel: "x-linkedin",
      sourceIds,
      rationale: "Turns the highest-fit Reddit/community pain point into a calm founder observation.",
      createdAt: now.toISOString()
    },
    {
      id: `post_${now.getTime()}_2`,
      title: "A useful launch question",
      body: `A useful question before building another SaaS feature:\n\nWhat decision will this make easier next week?\n\nIf the answer is unclear, the problem may not be code. It may be missing context: who it is for, what pain it solves, what proof you have, and how you will measure the next step.\n\nThat is the gap Forgeko is trying to close for solo SaaS founders.`,
      channel: "x-linkedin",
      sourceIds,
      rationale: "Reusable evergreen post grounded in the day's source-backed pain points.",
      createdAt: now.toISOString()
    }
  ];
}
