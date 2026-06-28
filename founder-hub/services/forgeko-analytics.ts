import type { AnalyticsSnapshot } from "@/types/founder-hub";
import { emptyProductSignalSnapshot } from "@/services/product-signals";
import type { SupabaseClient } from "@supabase/supabase-js";

type Fetcher = (url: string, init?: RequestInit) => Promise<Response>;

interface SupabaseEventRow {
  event_type?: string | null;
  session_id?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at?: string | null;
}

interface SupabaseWaitlistRow {
  source?: string | null;
  confirmed?: boolean | null;
  created_at?: string | null;
}

export interface ForgekoAnalyticsRequestOptions {
  siteUrl: string;
  token: string;
  period?: string;
}

export interface PlannedForgekoAnalyticsRequest {
  kind: "summary";
  method: "GET";
  url: string;
  headers: {
    Authorization: string;
    Accept: string;
  };
}

export function buildForgekoAnalyticsSummaryRequest({
  siteUrl,
  token,
  period = "7d"
}: ForgekoAnalyticsRequestOptions): PlannedForgekoAnalyticsRequest {
  const url = new URL("/api/analytics/summary", siteUrl);
  url.searchParams.set("days", String(daysFromPeriod(period)));

  return {
    kind: "summary",
    method: "GET",
    url: url.toString(),
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  };
}

export async function fetchForgekoAnalyticsSnapshot({
  siteUrl,
  token,
  period = "7d",
  fetcher = fetch
}: ForgekoAnalyticsRequestOptions & { fetcher?: Fetcher }): Promise<AnalyticsSnapshot> {
  const request = buildForgekoAnalyticsSummaryRequest({ siteUrl, token, period });
  const response = await fetcher(request.url, { method: request.method, headers: request.headers });

  if (!response.ok) {
    throw new Error(`Forgeko analytics summary request failed with HTTP ${response.status}`);
  }

  return snapshotFromSummary((await response.json()) as Record<string, unknown>);
}

export async function fetchSupabaseAnalyticsSnapshot({
  client,
  period = "7d",
  now = new Date()
}: {
  client: SupabaseClient | null;
  period?: string;
  now?: Date;
}): Promise<AnalyticsSnapshot | null> {
  if (!client) return null;

  const days = daysFromPeriod(period);
  const since = new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
  const [pageEvents, waitlist] = await Promise.all([
    client.from("page_events").select("event_type, session_id, metadata, created_at").gte("created_at", since).limit(10000),
    client.from("waitlist").select("source, confirmed, created_at").gte("created_at", since).limit(5000)
  ]);

  if (pageEvents.error) throw pageEvents.error;
  if (waitlist.error) throw waitlist.error;

  return buildSupabaseAnalyticsSnapshot({
    days,
    now,
    pageEvents: (pageEvents.data ?? []) as SupabaseEventRow[],
    waitlistRows: (waitlist.data ?? []) as SupabaseWaitlistRow[]
  });
}

export function buildSupabaseAnalyticsSnapshot({
  days,
  now = new Date(),
  pageEvents,
  waitlistRows
}: {
  days: number;
  now?: Date;
  pageEvents: SupabaseEventRow[];
  waitlistRows: SupabaseWaitlistRow[];
}): AnalyticsSnapshot {
  const safeDays = daysFromPeriod(`${days}d`);
  const since = now.getTime() - safeDays * 24 * 60 * 60 * 1000;
  const events = pageEvents.filter((row) => isInsideWindow(row.created_at, since, now));
  const waitlist = waitlistRows.filter((row) => isInsideWindow(row.created_at, since, now));
  const pageViews = events.filter((row) => row.event_type === "Page_View" && !isTechnicalPath(row.metadata));
  const activityRows = pageViews.length > 0 ? pageViews : events.filter((row) => !isTechnicalPath(row.metadata));
  const activeUsers = uniqueValues(activityRows.map((row) => row.session_id)).size;
  const waitlistClicks = events.filter((row) => row.event_type === "CTA_Hero_Click" || row.event_type === "CTA_Solution_Click").length;
  const waitlistSubmits = events.filter((row) => row.event_type === "Waitlist_Submit").length;
  const waitlistSignups = waitlist.length;
  const waitlistConversionRate = activeUsers > 0 && waitlistSignups <= activeUsers ? roundPercent(waitlistSignups / activeUsers) : null;
  const clickToSignupRate = waitlistClicks > 0 && waitlistSignups <= waitlistClicks ? roundPercent(waitlistSignups / waitlistClicks) : null;

  return {
    activeUsers,
    visitors: pageViews.length,
    uniqueVisitors: activeUsers,
    conversions: waitlistSignups,
    conversionRate: waitlistConversionRate ?? 0,
    ...emptyProductSignalSnapshot,
    waitlistClicks,
    waitlistSubmits,
    waitlistSignups,
    waitlistConfirmed: waitlist.filter((row) => row.confirmed).length,
    waitlistConversionRate,
    clickToSignupRate,
    waitlistSources: countRows(waitlist.map((row) => row.source || "unknown"), "source", "signups"),
    pageEvents: countRows(events.map((row) => row.event_type || "unknown"), "eventType", "count"),
    topReferrers: countRows(pageViews.map((row) => referrerFromMetadata(row.metadata)), "source", "visitors"),
    topPages: countRows(pageViews.map((row) => pathFromMetadata(row.metadata)), "path", "visitors"),
    topClicks: topClickRows(events),
    trend: supabaseTrendRows(pageViews),
    aiExplanation:
      activeUsers > 0
        ? `${activeUsers} active session${activeUsers === 1 ? "" : "s"} and ${waitlistSignups} waitlist signup${waitlistSignups === 1 ? "" : "s"} are visible in Supabase for the selected window.`
        : "No tracked Supabase activity is visible in the selected window."
  };
}

function snapshotFromSummary(summary: Record<string, unknown>): AnalyticsSnapshot {
  const topClicks = clickRows(summary.topClicks);
  const waitlistSignups = numberValue(summary.waitlistSignups);
  const waitlistConversionRate = numberOrNullValue(summary.waitlistConversionRate);
  const clickToSignupRate = numberOrNullValue(summary.clickToSignupRate);

  return {
    activeUsers: numberValue(summary.activeUsers) || numberValue(summary.uniqueVisitors),
    visitors: numberValue(summary.totalVisits),
    uniqueVisitors: numberValue(summary.uniqueVisitors) || numberValue(summary.activeUsers),
    conversions: waitlistSignups || topClicks.reduce((total, row) => total + row.clicks, 0),
    conversionRate: waitlistConversionRate ?? 0,
    ...emptyProductSignalSnapshot,
    waitlistClicks: numberValue(summary.waitlistClicks),
    waitlistSubmits: numberValue(summary.waitlistSubmits),
    waitlistSignups,
    waitlistConfirmed: numberValue(summary.waitlistConfirmed),
    waitlistConversionRate,
    clickToSignupRate,
    waitlistSources: waitlistSourceRows(summary.waitlistSources),
    pageEvents: pageEventRows(summary.pageEvents),
    topReferrers: referrerRows(summary.topReferrers),
    topPages: pageRows(summary.topPages),
    topClicks,
    trend: trendRows(summary.trend),
    aiExplanation: "Run the Analytics Agent to explain the latest movement."
  };
}

function daysFromPeriod(period: string) {
  const match = /^(\d+)d$/.exec(period);
  const days = match ? Number(match[1]) : 7;
  return Math.min(90, Math.max(1, Number.isFinite(days) ? days : 7));
}

function rows(value: unknown) {
  return Array.isArray(value) ? value.filter((row) => row && typeof row === "object") as Array<Record<string, unknown>> : [];
}

function isInsideWindow(value: string | null | undefined, since: number, now: Date) {
  const time = value ? Date.parse(value) : Number.NaN;
  return Number.isFinite(time) && time >= since && time <= now.getTime();
}

function uniqueValues(values: Array<string | null | undefined>) {
  return new Set(values.map((value) => value?.trim()).filter(Boolean));
}

function isTechnicalPath(metadata: Record<string, unknown> | null | undefined) {
  const path = pathFromMetadata(metadata);
  return path.startsWith("/__") || path.includes("plausible-worker-check");
}

function referrerFromMetadata(metadata: Record<string, unknown> | null | undefined) {
  const referrer = metadataString(metadata, "referrer", "");
  if (!referrer) return "Direct / None";
  try {
    return new URL(referrer).hostname.replace(/^www\./, "") || "Direct / None";
  } catch {
    return referrer.replace(/^www\./, "") || "Direct / None";
  }
}

function pathFromMetadata(metadata: Record<string, unknown> | null | undefined) {
  return metadataString(metadata, "path", "") || metadataString(metadata, "pathname", "") || "/";
}

function topClickRows(events: SupabaseEventRow[]) {
  const rows = events.filter((row) => row.event_type === "CTA_Hero_Click" || row.event_type === "CTA_Solution_Click" || row.event_type === "Waitlist_Submit");
  const counts = new Map<string, { label: string; href: string; clicks: number }>();
  for (const row of rows) {
    const label = metadataString(row.metadata, "label", "") || (row.event_type === "Waitlist_Submit" ? "Waitlist submit" : "Join waitlist");
    const href = metadataString(row.metadata, "href", "") || "#waitlist";
    const key = `${label}\u0000${href}`;
    const existing = counts.get(key);
    counts.set(key, { label, href, clicks: (existing?.clicks ?? 0) + 1 });
  }
  return [...counts.values()].sort((a, b) => b.clicks - a.clicks || a.label.localeCompare(b.label)).slice(0, 8);
}

function supabaseTrendRows(pageViews: SupabaseEventRow[]) {
  const counts = new Map<string, number>();
  for (const row of pageViews) {
    const date = row.created_at ? new Date(row.created_at).toISOString().slice(0, 10) : "";
    if (date) counts.set(date, (counts.get(date) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([date, visitors]) => ({ date, visitors }));
}

function countRows<TKey extends string, TValue extends string>(
  values: string[],
  keyName: TKey,
  valueName: TValue
): Array<Record<TKey, string> & Record<TValue, number>> {
  const counts = new Map<string, number>();
  for (const value of values) {
    const clean = value.trim() || "unknown";
    counts.set(clean, (counts.get(clean) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8)
    .map(([key, count]) => ({ [keyName]: key, [valueName]: count }) as Record<TKey, string> & Record<TValue, number>);
}

function roundPercent(value: number) {
  return Math.round(value * 1000) / 10;
}

function metadataString(metadata: Record<string, unknown> | null | undefined, key: string, fallback: string) {
  return stringValue(metadata?.[key], fallback);
}

function referrerRows(value: unknown): AnalyticsSnapshot["topReferrers"] {
  return rows(value).map((row) => ({
    source: stringValue(row.referrer, stringValue(row.source, "Direct / None")),
    visitors: numberValue(row.visits)
  }));
}

function pageRows(value: unknown): AnalyticsSnapshot["topPages"] {
  return rows(value).map((row) => ({
    path: stringValue(row.path, "unknown"),
    visitors: numberValue(row.visits)
  }));
}

function clickRows(value: unknown): AnalyticsSnapshot["topClicks"] {
  return rows(value).map((row) => ({
    label: stringValue(row.label, "unknown"),
    href: stringValue(row.href, ""),
    clicks: numberValue(row.clicks)
  }));
}

function trendRows(value: unknown): AnalyticsSnapshot["trend"] {
  return rows(value).map((row) => ({
    date: stringValue(row.date, ""),
    visitors: numberValue(row.visits)
  }));
}

function waitlistSourceRows(value: unknown): AnalyticsSnapshot["waitlistSources"] {
  return rows(value).map((row) => ({
    source: stringValue(row.source, "unknown"),
    signups: numberValue(row.signups)
  }));
}

function pageEventRows(value: unknown): AnalyticsSnapshot["pageEvents"] {
  return rows(value).map((row) => ({
    eventType: stringValue(row.eventType, "unknown"),
    count: numberValue(row.count)
  }));
}

function numberValue(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function numberOrNullValue(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function stringValue(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}
