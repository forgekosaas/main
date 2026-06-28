import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { FounderHubEnv } from "@/lib/env";
import { normalizeCommunityCopy } from "@/lib/community-copy";
import { isActionableFeedbackEmail, presentFeedbackEmail } from "@/lib/signal-cleaning";
import type { AnalyticsSnapshot, CommunityItem, FeedbackEmail, Insight, MemoryEntry, NewsItem, PostDraft } from "@/types/founder-hub";

export function createFounderHubSupabase(env: FounderHubEnv): SupabaseClient | null {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    return null;
  }

  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: { persistSession: false }
  });
}

export async function saveCommunityItem(client: SupabaseClient | null, item: CommunityItem) {
  if (!client) return false;

  const { error } = await client.from("founder_hub_community_items").upsert(toCommunityRow(item), { onConflict: "id" });
  if (error) {
    if (isMissingCommunityColumnError(error)) {
      const { error: legacyError } = await client
        .from("founder_hub_community_items")
        .upsert(toLegacyCommunityRow(item), { onConflict: "id" });
      if (legacyError) throw legacyError;
      return true;
    }

    throw error;
  }
  return true;
}

export async function listCommunityItems(client: SupabaseClient | null): Promise<CommunityItem[]> {
  if (!client) return [];
  const { data, error } = await client
    .from("founder_hub_community_items")
    .select("*")
    .order("relevance_score", { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data ?? []).map((row) => fromCommunityRow(row as Record<string, unknown>));
}

export async function saveCommunityCache(client: SupabaseClient | null, key: string, items: CommunityItem[]) {
  if (!client) return false;
  const { error } = await client.from("founder_hub_settings").upsert({
    key,
    value: items,
    updated_at: new Date().toISOString()
  });
  if (error) throw error;
  return true;
}

export async function listCommunityCache(client: SupabaseClient | null, key: string): Promise<CommunityItem[]> {
  if (!client) return [];
  const { data, error } = await client.from("founder_hub_settings").select("value").eq("key", key).limit(1);
  if (error) throw error;
  const value = ((data ?? [])[0] as { value?: unknown } | undefined)?.value;
  if (!Array.isArray(value)) return [];
  return value.map(fromCachedCommunityItem).filter(Boolean) as CommunityItem[];
}

export async function saveNewsItems(client: SupabaseClient | null, items: NewsItem[]) {
  if (!client || items.length === 0) return false;
  const { error } = await client.from("founder_hub_news_items").upsert(items.map(toNewsRow), { onConflict: "id" });
  if (error) throw error;
  return true;
}

export async function listNewsItems(client: SupabaseClient | null): Promise<NewsItem[]> {
  if (!client) return [];
  const { data, error } = await client
    .from("founder_hub_news_items")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data ?? []).map((row) => fromNewsRow(row as Record<string, unknown>));
}

export async function savePostDrafts(client: SupabaseClient | null, drafts: PostDraft[]) {
  if (!client || drafts.length === 0) return false;
  const { error } = await client.from("founder_hub_post_drafts").upsert(drafts.map(toPostDraftRow), { onConflict: "id" });
  if (error) throw error;
  return true;
}

export async function listPostDrafts(client: SupabaseClient | null): Promise<PostDraft[]> {
  if (!client) return [];
  const { data, error } = await client
    .from("founder_hub_post_drafts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(12);
  if (error) throw error;
  return (data ?? []).map((row) => fromPostDraftRow(row as Record<string, unknown>));
}

export async function saveFeedbackEmails(client: SupabaseClient | null, emails: FeedbackEmail[]) {
  if (!client || emails.length === 0) return false;
  const { error } = await client.from("founder_hub_emails").upsert(emails.map(toEmailRow), { onConflict: "id" });
  if (error) throw error;
  return true;
}

export async function listFeedbackEmails(client: SupabaseClient | null): Promise<FeedbackEmail[]> {
  if (!client) return [];
  const { data, error } = await client.from("founder_hub_emails").select("*").order("created_at", { ascending: false }).limit(50);
  if (error) throw error;
  return (data ?? [])
    .map((row) => presentFeedbackEmail(fromEmailRow(row as Record<string, unknown>)))
    .filter(isActionableFeedbackEmail);
}

export async function saveAnalyticsSnapshot(client: SupabaseClient | null, snapshot: AnalyticsSnapshot) {
  if (!client) return false;
  const { error } = await client.from("founder_hub_analytics_snapshots").insert(toAnalyticsRow(snapshot));
  if (error) {
    if (isMissingTopClicksColumnError(error)) {
      const { error: compatibleError } = await client.from("founder_hub_analytics_snapshots").insert(toAnalyticsRowWithoutTopClicks(snapshot));
      if (compatibleError) throw compatibleError;
      return true;
    }

    if (isMissingAnalyticsColumnError(error)) {
      const { error: legacyError } = await client.from("founder_hub_analytics_snapshots").insert(toLegacyAnalyticsRow(snapshot));
      if (legacyError) throw legacyError;
      return true;
    }

    throw error;
  }
  return true;
}

function toAnalyticsRow(snapshot: AnalyticsSnapshot) {
  return {
    active_users: snapshot.activeUsers,
    visitors: snapshot.visitors,
    unique_visitors: snapshot.uniqueVisitors,
    conversions: snapshot.conversions,
    conversion_rate: snapshot.conversionRate,
    waitlist_clicks: snapshot.waitlistClicks,
    waitlist_submits: snapshot.waitlistSubmits,
    waitlist_signups: snapshot.waitlistSignups,
    waitlist_confirmed: snapshot.waitlistConfirmed,
    waitlist_conversion_rate: snapshot.waitlistConversionRate,
    click_to_signup_rate: snapshot.clickToSignupRate,
    waitlist_sources: snapshot.waitlistSources,
    page_events: snapshot.pageEvents,
    top_referrers: snapshot.topReferrers,
    top_pages: snapshot.topPages,
    top_clicks: snapshot.topClicks,
    trend: snapshot.trend,
    ai_explanation: snapshot.aiExplanation
  };
}

function toAnalyticsRowWithoutTopClicks(snapshot: AnalyticsSnapshot) {
  const { top_clicks: _topClicks, ...row } = toAnalyticsRow(snapshot);
  return row;
}

function toLegacyAnalyticsRow(snapshot: AnalyticsSnapshot) {
  return {
    visitors: snapshot.visitors,
    unique_visitors: snapshot.uniqueVisitors,
    conversions: snapshot.conversions,
    conversion_rate: snapshot.conversionRate,
    top_referrers: snapshot.topReferrers,
    top_pages: snapshot.topPages,
    trend: snapshot.trend,
    ai_explanation: snapshot.aiExplanation
  };
}

export async function listLatestAnalyticsSnapshot(client: SupabaseClient | null): Promise<AnalyticsSnapshot | null> {
  if (!client) return null;
  const { data, error } = await client
    .from("founder_hub_analytics_snapshots")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1);
  if (error) throw error;
  const row = (data ?? [])[0] as Record<string, unknown> | undefined;
  return row ? fromAnalyticsRow(row) : null;
}

export async function saveInsights(client: SupabaseClient | null, insights: Insight[]) {
  if (!client || insights.length === 0) return false;
  const { error } = await client.from("founder_hub_insights").upsert(insights.map(toInsightRow), { onConflict: "id" });
  if (error) throw error;
  return true;
}

export async function listInsights(client: SupabaseClient | null): Promise<Insight[]> {
  if (!client) return [];
  const { data, error } = await client.from("founder_hub_insights").select("*").order("created_at", { ascending: false }).limit(50);
  if (error) throw error;
  return (data ?? [])
    .map((row) => fromInsightRow(row as Record<string, unknown>))
    .filter((insight) => !isEmptyFallbackInsight(insight));
}

export async function listMemoryEntries(client: SupabaseClient | null): Promise<MemoryEntry[]> {
  if (!client) return [];
  const { data, error } = await client.from("founder_hub_memory").select("*").order("date", { ascending: false }).limit(50);
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: String(row.id),
    date: String(row.date),
    title: String(row.title),
    motivation: String(row.motivation),
    sources: Array.isArray(row.sources) ? row.sources.map(String) : [],
    consequences: String(row.consequences)
  }));
}

export async function saveMemoryEntry(client: SupabaseClient | null, entry: MemoryEntry) {
  if (!client) return false;
  const { error } = await client.from("founder_hub_memory").upsert({
    id: entry.id,
    date: entry.date,
    title: entry.title,
    motivation: entry.motivation,
    sources: entry.sources,
    consequences: entry.consequences
  });
  if (error) throw error;
  return true;
}

function toCommunityRow(item: CommunityItem) {
  return {
    id: item.id,
    source: item.source,
    kind: item.kind ?? null,
    subreddit: item.subreddit ?? null,
    score: item.score ?? null,
    title: item.title,
    author: item.author,
    url: item.url,
    summary: item.summary,
    pain_point: item.painPoint,
    user_language: item.userLanguage,
    post_angle: item.postAngle,
    relevance_score: item.relevanceScore,
    suggested_reply: item.suggestedReply,
    reply_rationale: item.replyRationale,
    created_at: item.createdAt
  };
}

function toLegacyCommunityRow(item: CommunityItem) {
  return {
    id: item.id,
    source: item.source,
    title: item.title,
    author: item.author,
    url: item.url,
    summary: item.summary,
    pain_point: item.painPoint,
    relevance_score: item.relevanceScore,
    suggested_reply: item.suggestedReply,
    reply_rationale: item.replyRationale,
    created_at: item.createdAt
  };
}

function fromCommunityRow(row: Record<string, unknown>): CommunityItem {
  const title = stringValue(row.title);
  const summary = stringValue(row.summary);
  const painPoint = stringValue(row.pain_point);

  return normalizeCommunityCopy({
    id: stringValue(row.id),
    source:
      row.source === "reddit" || row.source === "x" || row.source === "indie-hackers" || row.source === "hacker-news"
        ? row.source
        : "reddit",
    kind: row.kind === "comment" || row.kind === "story" || row.kind === "post" ? row.kind : undefined,
    subreddit: stringValue(row.subreddit) || undefined,
    score: row.score === null || typeof row.score === "undefined" ? undefined : numberValue(row.score),
    title,
    author: stringValue(row.author),
    url: stringValue(row.url),
    summary,
    painPoint,
    userLanguage: userLanguageArray(row.user_language, title, summary),
    postAngle: stringValue(row.post_angle) || fallbackPostAngle(painPoint, title),
    relevanceScore: numberValue(row.relevance_score),
    suggestedReply: stringValue(row.suggested_reply),
    replyRationale: stringValue(row.reply_rationale),
    createdAt: stringValue(row.created_at)
  });
}

function fromCachedCommunityItem(value: unknown): CommunityItem | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const source = row.source;
  if (source !== "reddit" && source !== "x" && source !== "indie-hackers" && source !== "hacker-news") return null;

  return normalizeCommunityCopy({
    id: stringValue(row.id),
    source,
    kind: row.kind === "comment" || row.kind === "story" || row.kind === "post" ? row.kind : undefined,
    subreddit: stringValue(row.subreddit) || undefined,
    score: row.score === null || typeof row.score === "undefined" ? undefined : numberValue(row.score),
    title: stringValue(row.title),
    author: stringValue(row.author),
    url: stringValue(row.url),
    summary: stringValue(row.summary),
    painPoint: stringValue(row.painPoint),
    userLanguage: userLanguageArray(row.userLanguage, stringValue(row.title), stringValue(row.summary)),
    postAngle: stringValue(row.postAngle) || fallbackPostAngle(stringValue(row.painPoint), stringValue(row.title)),
    relevanceScore: numberValue(row.relevanceScore),
    suggestedReply: stringValue(row.suggestedReply),
    replyRationale: stringValue(row.replyRationale),
    createdAt: stringValue(row.createdAt)
  });
}

function toEmailRow(email: FeedbackEmail) {
  return {
    id: email.id,
    sender: email.from,
    subject: email.subject,
    snippet: email.snippet,
    category: email.category,
    summary: email.summary,
    pain_point: email.painPoint,
    created_at: email.createdAt
  };
}

function fromEmailRow(row: Record<string, unknown>): FeedbackEmail {
  const category = stringValue(row.category);
  return {
    id: stringValue(row.id),
    from: stringValue(row.sender),
    subject: stringValue(row.subject),
    snippet: stringValue(row.snippet),
    category:
      category === "Waitlist" || category === "Feedback" || category === "Bug" || category === "Feature Request" || category === "Altro"
        ? category
        : "Altro",
    summary: stringValue(row.summary),
    painPoint: stringValue(row.pain_point),
    createdAt: stringValue(row.created_at)
  };
}

function fromAnalyticsRow(row: Record<string, unknown>): AnalyticsSnapshot {
  return {
    activeUsers: numberValue(row.active_users),
    visitors: numberValue(row.visitors),
    uniqueVisitors: numberValue(row.unique_visitors),
    conversions: numberValue(row.conversions),
    conversionRate: numberValue(row.conversion_rate),
    waitlistClicks: numberValue(row.waitlist_clicks),
    waitlistSubmits: numberValue(row.waitlist_submits),
    waitlistSignups: numberValue(row.waitlist_signups),
    waitlistConfirmed: numberValue(row.waitlist_confirmed),
    waitlistConversionRate: numberValue(row.waitlist_conversion_rate),
    clickToSignupRate: numberValue(row.click_to_signup_rate),
    waitlistSources: waitlistSourceArray(row.waitlist_sources),
    pageEvents: pageEventArray(row.page_events),
    topReferrers: referrerArray(row.top_referrers),
    topPages: pageArray(row.top_pages),
    topClicks: clickArray(row.top_clicks),
    trend: trendArray(row.trend),
    aiExplanation: stringValue(row.ai_explanation)
  };
}

function toNewsRow(item: NewsItem) {
  return {
    id: item.id,
    source: item.source,
    title: item.title,
    url: item.url,
    summary: item.summary,
    topic: item.topic,
    score: item.score,
    published_at: item.publishedAt
  };
}

function fromNewsRow(row: Record<string, unknown>): NewsItem {
  const topic = stringValue(row.topic);
  const source = stringValue(row.source);
  return {
    id: stringValue(row.id),
    source: source === "techcrunch" || source === "hacker-news" || source === "indie-hackers" || source === "rss" ? source : "rss",
    title: stringValue(row.title),
    url: stringValue(row.url),
    summary: stringValue(row.summary),
    topic: topic === "saas" || topic === "ai" || topic === "solopreneur" || topic === "startup" ? topic : "startup",
    score: numberValue(row.score),
    publishedAt: stringValue(row.published_at)
  };
}

function toPostDraftRow(draft: PostDraft) {
  return {
    id: draft.id,
    title: draft.title,
    body: draft.body,
    channel: draft.channel,
    source_ids: draft.sourceIds,
    rationale: draft.rationale,
    created_at: draft.createdAt
  };
}

function fromPostDraftRow(row: Record<string, unknown>): PostDraft {
  return {
    id: stringValue(row.id),
    title: stringValue(row.title),
    body: stringValue(row.body),
    channel: "x-linkedin",
    sourceIds: Array.isArray(row.source_ids) ? row.source_ids.map(String).filter(Boolean) : [],
    rationale: stringValue(row.rationale),
    createdAt: stringValue(row.created_at)
  };
}

function toInsightRow(insight: Insight) {
  return {
    id: insight.id,
    title: insight.title,
    summary: insight.summary,
    evidence_ids: insight.evidenceIds,
    created_at: insight.createdAt
  };
}

function fromInsightRow(row: Record<string, unknown>): Insight {
  return {
    id: stringValue(row.id),
    title: stringValue(row.title),
    summary: stringValue(row.summary),
    evidenceIds: Array.isArray(row.evidence_ids) ? row.evidence_ids.map(String) : [],
    createdAt: stringValue(row.created_at)
  };
}

function isEmptyFallbackInsight(insight: Insight) {
  return (
    insight.id === "insight_local_pattern" &&
    insight.evidenceIds.length === 0 &&
    insight.summary.toLowerCase().includes("validation uncertainty")
  );
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function numberValue(value: unknown) {
  return typeof value === "number" ? value : Number(value) || 0;
}

function userLanguageArray(value: unknown, title: string, summary: string) {
  if (Array.isArray(value)) {
    const values = value.map(String).map((item) => item.trim()).filter(Boolean);
    if (values.length > 0) return values.slice(0, 4);
  }

  return [title, summary]
    .flatMap((text) => text.split(/[.!?;]/))
    .map((item) => item.trim())
    .filter((item) => item.length >= 12 && item.length <= 90)
    .slice(0, 4);
}

function fallbackPostAngle(painPoint: string, title: string) {
  return `X post: ${painPoint || "Founder pain"} is easier to understand when you start from the user's own words: "${title}".`;
}

function isMissingCommunityColumnError(error: { message?: string; code?: string }) {
  const message = error.message?.toLowerCase() ?? "";
  return (
    error.code === "PGRST204" ||
    message.includes("user_language") ||
    message.includes("post_angle") ||
    message.includes("kind") ||
    message.includes("subreddit") ||
    message.includes("score")
  );
}

function isMissingAnalyticsColumnError(error: { message?: string; code?: string }) {
  const message = error.message?.toLowerCase() ?? "";
  return (
    error.code === "PGRST204" ||
    message.includes("active_users") ||
    message.includes("waitlist_clicks") ||
    message.includes("waitlist_submits") ||
    message.includes("click_to_signup_rate") ||
    message.includes("waitlist_signups") ||
    message.includes("waitlist_confirmed") ||
    message.includes("waitlist_conversion_rate") ||
    message.includes("waitlist_sources") ||
    message.includes("page_events")
  );
}

function isMissingTopClicksColumnError(error: { message?: string; code?: string }) {
  const message = error.message?.toLowerCase() ?? "";
  return error.code === "PGRST204" && message.includes("top_clicks");
}

function referrerArray(value: unknown): AnalyticsSnapshot["topReferrers"] {
  if (!Array.isArray(value)) return [];
  return value.map((row) => ({
    source: stringValue((row as Record<string, unknown>).source),
    visitors: numberValue((row as Record<string, unknown>).visitors)
  }));
}

function pageArray(value: unknown): AnalyticsSnapshot["topPages"] {
  if (!Array.isArray(value)) return [];
  return value.map((row) => ({
    path: stringValue((row as Record<string, unknown>).path),
    visitors: numberValue((row as Record<string, unknown>).visitors)
  }));
}

function clickArray(value: unknown): AnalyticsSnapshot["topClicks"] {
  if (!Array.isArray(value)) return [];
  return value.map((row) => ({
    label: stringValue((row as Record<string, unknown>).label),
    href: stringValue((row as Record<string, unknown>).href),
    clicks: numberValue((row as Record<string, unknown>).clicks)
  }));
}

function waitlistSourceArray(value: unknown): AnalyticsSnapshot["waitlistSources"] {
  if (!Array.isArray(value)) return [];
  return value.map((row) => ({
    source: stringValue((row as Record<string, unknown>).source),
    signups: numberValue((row as Record<string, unknown>).signups)
  }));
}

function pageEventArray(value: unknown): AnalyticsSnapshot["pageEvents"] {
  if (!Array.isArray(value)) return [];
  return value.map((row) => ({
    eventType: stringValue((row as Record<string, unknown>).eventType),
    count: numberValue((row as Record<string, unknown>).count)
  }));
}

function trendArray(value: unknown): AnalyticsSnapshot["trend"] {
  if (!Array.isArray(value)) return [];
  return value.map((row) => ({
    date: stringValue((row as Record<string, unknown>).date),
    visitors: numberValue((row as Record<string, unknown>).visitors)
  }));
}
