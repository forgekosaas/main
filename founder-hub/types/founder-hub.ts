export type CommunitySource = "reddit" | "x" | "indie-hackers" | "hacker-news";

export type FeedbackCategory = "Waitlist" | "Feedback" | "Bug" | "Feature Request" | "Altro";

export type NewsSource = "techcrunch" | "hacker-news" | "indie-hackers" | "rss";

export type NewsTopic = "saas" | "ai" | "solopreneur" | "startup";

export interface CommunityItem {
  id: string;
  source: CommunitySource;
  kind?: "post" | "comment" | "story";
  subreddit?: string;
  score?: number;
  title: string;
  author: string;
  url: string;
  summary: string;
  painPoint: string;
  userLanguage: string[];
  postAngle: string;
  relevanceScore: number;
  suggestedReply: string;
  replyRationale: string;
  createdAt: string;
}

export interface ManualCommunityInput {
  source: Exclude<CommunitySource, "hacker-news">;
  title: string;
  author?: string;
  url: string;
  content: string;
}

export interface RawCommunityItem {
  id: string;
  source: CommunitySource;
  kind?: "post" | "comment" | "story";
  subreddit?: string;
  score?: number;
  title: string;
  author: string;
  url: string;
  content: string;
  createdAt: string;
}

export interface AnalyticsSnapshot {
  activeUsers: number;
  visitors: number;
  uniqueVisitors: number;
  conversions: number;
  conversionRate: number;
  waitlistClicks: number;
  waitlistSubmits: number;
  waitlistSignups: number;
  waitlistConfirmed: number;
  waitlistConversionRate: number | null;
  clickToSignupRate: number | null;
  waitlistSources: Array<{ source: string; signups: number }>;
  pageEvents: Array<{ eventType: string; count: number }>;
  topReferrers: Array<{ source: string; visitors: number }>;
  topPages: Array<{ path: string; visitors: number }>;
  topClicks: Array<{ label: string; href: string; clicks: number }>;
  trend: Array<{ date: string; visitors: number }>;
  aiExplanation: string;
}

export interface NewsItem {
  id: string;
  source: NewsSource;
  title: string;
  url: string;
  summary: string;
  topic: NewsTopic;
  score: number;
  publishedAt: string;
}

export interface PostDraft {
  id: string;
  title: string;
  body: string;
  channel: "x-linkedin";
  sourceIds: string[];
  rationale: string;
  createdAt: string;
}

export interface VideoIdea {
  id: string;
  channel: "tiktok-instagram" | "youtube";
  title: string;
  hook: string;
  outline: string[];
  targetAudience: string;
  sourceIds: string[];
  rationale: string;
  createdAt: string;
}

export interface FeedbackEmail {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  category: FeedbackCategory;
  summary: string;
  painPoint: string;
  createdAt: string;
}

export interface Insight {
  id: string;
  title: string;
  summary: string;
  evidenceIds: string[];
  createdAt: string;
}

export interface MemoryEntry {
  id: string;
  date: string;
  title: string;
  motivation: string;
  sources: string[];
  consequences: string;
}

export interface DailyBrief {
  generatedAt: string;
  priorities: string[];
  recommendedPost: string;
  discussionsToRead: string[];
  discussionsToReplyTo: string[];
  landingAnalysis: string;
  feedbackAnalysis: string;
  weeklyTrend: string;
}

export interface FounderHubSnapshot {
  newsItems: NewsItem[];
  postDrafts: PostDraft[];
  videoIdeas?: VideoIdea[];
  communityItems: CommunityItem[];
  analytics: AnalyticsSnapshot;
  sourceHealth?: SourceHealthItem[];
  feedback: FeedbackEmail[];
  insights: Insight[];
  memory: MemoryEntry[];
}

export interface SourceHealthItem {
  id: string;
  label: string;
  status: "ok" | "skipped" | "error";
  detail: string;
  count?: number;
  updatedAt: string;
}

export interface ServiceStatus {
  configured: boolean;
  label: string;
  missing: string[];
}

export interface PublicSettingsStatus {
  gemini: ServiceStatus;
  supabase: ServiceStatus;
  analytics: ServiceStatus;
  reddit: ServiceStatus;
  hackerNews: ServiceStatus;
  rssNews: ServiceStatus;
}
