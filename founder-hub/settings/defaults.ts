import type { CommunitySource } from "@/types/founder-hub";

export const founderHubSources: CommunitySource[] = ["reddit", "x", "indie-hackers", "hacker-news"];

export const defaultCommunityQuery = "solo founder SaaS pain validation launch feedback";

export const defaultFounderHubSettings = {
  hackerNewsLimit: 10,
  hackerNewsQuery: "solo founder SaaS validation launch feedback",
  subredditLimit: 10,
  subreddits: ["SoloDevelopment", "microsaas", "Entrepreneur", "SideProject", "startups"],
  gmailQuery: "from:hello@info.forgeko.com newer_than:30d",
  analyticsPeriod: "7d"
} as const;
