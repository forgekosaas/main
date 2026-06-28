export interface AnalyticsEventRow {
  event_type?: string | null;
  session_id?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at?: string | null;
}

export interface AnalyticsWaitlistRow {
  source?: string | null;
  confirmed?: boolean | null;
  created_at?: string | null;
}

export interface AnalyticsSummaryInput {
  days: number;
  now?: Date;
  pageEvents: AnalyticsEventRow[];
  waitlistRows: AnalyticsWaitlistRow[];
}

export interface AnalyticsSummary {
  days: number;
  activeUsers: number;
  totalVisits: number;
  uniqueVisitors: number;
  waitlistClicks: number;
  waitlistSubmits: number;
  waitlistSignups: number;
  waitlistConfirmed: number;
  waitlistConversionRate: number | null;
  clickToSignupRate: number | null;
  topReferrers: Array<{ referrer: string; visits: number }>;
  topPages: Array<{ path: string; visits: number }>;
  topClicks: Array<{ label: string; href: string; clicks: number }>;
  trend: Array<{ date: string; visits: number }>;
  pageEvents: Array<{ eventType: string; count: number }>;
  waitlistSources: Array<{ source: string; signups: number }>;
}

const waitlistClickEvents = new Set(["CTA_Hero_Click", "CTA_Solution_Click"]);
const clickLikeEvents = new Set([...waitlistClickEvents, "Waitlist_Submit"]);

export function buildAnalyticsSummaryFromRows({
  days,
  now = new Date(),
  pageEvents,
  waitlistRows
}: AnalyticsSummaryInput): AnalyticsSummary {
  const safeDays = clampDays(days);
  const since = now.getTime() - safeDays * 24 * 60 * 60 * 1000;
  const events = pageEvents.filter((row) => isInsideWindow(row.created_at, since, now));
  const waitlist = waitlistRows.filter((row) => isInsideWindow(row.created_at, since, now));
  const pageViews = events.filter((row) => row.event_type === "Page_View" && !isTechnicalPath(row.metadata));
  const activityRows = pageViews.length > 0 ? pageViews : events.filter((row) => !isTechnicalPath(row.metadata));
  const activeUsers = uniqueValues(activityRows.map((row) => row.session_id)).size;
  const waitlistClicks = events.filter((row) => row.event_type && waitlistClickEvents.has(row.event_type)).length;
  const waitlistSubmits = events.filter((row) => row.event_type === "Waitlist_Submit").length;
  const waitlistSignups = waitlist.length;
  const hasReliableVisitDenominator = activeUsers > 0 && waitlistSignups <= activeUsers;
  const hasReliableClickDenominator = waitlistClicks > 0 && waitlistSignups <= waitlistClicks;

  return {
    days: safeDays,
    activeUsers,
    totalVisits: pageViews.length,
    uniqueVisitors: activeUsers,
    waitlistClicks,
    waitlistSubmits,
    waitlistSignups,
    waitlistConfirmed: waitlist.filter((row) => row.confirmed).length,
    waitlistConversionRate: hasReliableVisitDenominator ? roundPercent(waitlistSignups / activeUsers) : null,
    clickToSignupRate: hasReliableClickDenominator ? roundPercent(waitlistSignups / waitlistClicks) : null,
    topReferrers: countRows(pageViews.map((row) => referrerFromMetadata(row.metadata)), "referrer", "visits"),
    topPages: countRows(pageViews.map((row) => pathFromMetadata(row.metadata)), "path", "visits"),
    topClicks: topClickRows(events),
    trend: trendRows(pageViews),
    pageEvents: countRows(events.map((row) => row.event_type || "unknown"), "eventType", "count"),
    waitlistSources: countRows(waitlist.map((row) => row.source || "unknown"), "source", "signups")
  };
}

function clampDays(days: number) {
  return Math.min(90, Math.max(1, Number.isFinite(days) ? Math.round(days) : 7));
}

function isInsideWindow(value: string | null | undefined, since: number, now: Date) {
  const time = value ? Date.parse(value) : Number.NaN;
  if (!Number.isFinite(time)) return false;
  return time >= since && time <= now.getTime();
}

function uniqueValues(values: Array<string | null | undefined>) {
  return new Set(values.map((value) => value?.trim()).filter(Boolean));
}

function roundPercent(value: number) {
  return Math.round(value * 1000) / 10;
}

function topClickRows(events: AnalyticsEventRow[]) {
  const rows = events.filter((row) => row.event_type && clickLikeEvents.has(row.event_type));
  const counts = new Map<string, { label: string; href: string; clicks: number }>();

  for (const row of rows) {
    const label = stringFromMetadata(row.metadata, "label") || (row.event_type === "Waitlist_Submit" ? "Waitlist submit" : "Join waitlist");
    const href = stringFromMetadata(row.metadata, "href") || "#waitlist";
    const key = `${label}\u0000${href}`;
    const existing = counts.get(key);
    counts.set(key, { label, href, clicks: (existing?.clicks ?? 0) + 1 });
  }

  return [...counts.values()].sort((a, b) => b.clicks - a.clicks || a.label.localeCompare(b.label)).slice(0, 8);
}

function isTechnicalPath(metadata: Record<string, unknown> | null | undefined) {
  const path = pathFromMetadata(metadata);
  return path.startsWith("/__") || path.includes("plausible-worker-check");
}

function trendRows(pageViews: AnalyticsEventRow[]) {
  const counts = new Map<string, number>();
  for (const row of pageViews) {
    const date = row.created_at ? new Date(row.created_at).toISOString().slice(0, 10) : "";
    if (!date) continue;
    counts.set(date, (counts.get(date) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, visits]) => ({ date, visits }));
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
    .sort((a, b) => b[1] - a[1] || directLast(a[0], b[0]) || a[0].localeCompare(b[0]))
    .slice(0, 8)
    .map(([key, count]) => ({ [keyName]: key, [valueName]: count }) as Record<TKey, string> & Record<TValue, number>);
}

function directLast(left: string, right: string) {
  if (left === "Direct / None" && right !== "Direct / None") return 1;
  if (right === "Direct / None" && left !== "Direct / None") return -1;
  return 0;
}

function referrerFromMetadata(metadata: Record<string, unknown> | null | undefined) {
  const referrer = stringFromMetadata(metadata, "referrer");
  if (!referrer) return "Direct / None";

  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    return host || "Direct / None";
  } catch {
    return referrer.replace(/^www\./, "") || "Direct / None";
  }
}

function pathFromMetadata(metadata: Record<string, unknown> | null | undefined) {
  return stringFromMetadata(metadata, "path") || stringFromMetadata(metadata, "pathname") || "/";
}

function stringFromMetadata(metadata: Record<string, unknown> | null | undefined, key: string) {
  const value = metadata?.[key];
  return typeof value === "string" ? value.trim() : "";
}
