import type { CommunitySource } from "@/types/founder-hub";

export const founderHubSources: CommunitySource[] = ["reddit", "x", "indie-hackers", "hacker-news"];

export const defaultCommunityQuery = "solo founder SaaS pain validation launch feedback";

export const defaultFounderHubSettings = {
  hackerNewsLimit: 10,
  hackerNewsQuery: "solo founder SaaS validation launch feedback",
  newsLimit: 24,
  subredditLimit: 10,
  subreddits: ["microsaas", "SideProject", "startups", "Entrepreneur", "SoloDevelopment"],
  gmailQuery: "from:hello@info.forgeko.com newer_than:30d",
  analyticsPeriod: "7d"
} as const;
