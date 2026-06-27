export type CommunitySource = "reddit" | "x" | "indie-hackers" | "hacker-news";

export type FeedbackCategory = "Waitlist" | "Feedback" | "Bug" | "Feature Request" | "Altro";

export interface CommunityItem {
  id: string;
  source: CommunitySource;
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
  title: string;
  author: string;
  url: string;
  content: string;
  createdAt: string;
}

export interface AnalyticsSnapshot {
  visitors: number;
  uniqueVisitors: number;
  conversions: number;
  conversionRate: number;
  waitlistSignups: number;
  waitlistConfirmed: number;
  waitlistConversionRate: number;
  waitlistSources: Array<{ source: string; signups: number }>;
  pageEvents: Array<{ eventType: string; count: number }>;
  topReferrers: Array<{ source: string; visitors: number }>;
  topPages: Array<{ path: string; visitors: number }>;
  topClicks: Array<{ label: string; href: string; clicks: number }>;
  trend: Array<{ date: string; visitors: number }>;
  aiExplanation: string;
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
  communityItems: CommunityItem[];
  analytics: AnalyticsSnapshot;
  feedback: FeedbackEmail[];
  insights: Insight[];
  memory: MemoryEntry[];
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
  gmail: ServiceStatus;
  reddit: ServiceStatus;
  hackerNews: ServiceStatus;
}
