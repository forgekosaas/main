import type { SupabaseClient } from "@supabase/supabase-js";

import type { AnalyticsSnapshot } from "@/types/founder-hub";

interface WaitlistRow {
  source?: string | null;
  confirmed?: boolean | null;
  created_at?: string | null;
}

interface PageEventRow {
  event_type?: string | null;
  created_at?: string | null;
  session_id?: string | null;
}

export interface ProductSignalSnapshot {
  waitlistClicks: number;
  waitlistSubmits: number;
  waitlistSignups: number;
  waitlistConfirmed: number;
  waitlistConversionRate: number | null;
  clickToSignupRate: number | null;
  waitlistSources: Array<{ source: string; signups: number }>;
  pageEvents: Array<{ eventType: string; count: number }>;
}

export const emptyProductSignalSnapshot: ProductSignalSnapshot = {
  waitlistClicks: 0,
  waitlistSubmits: 0,
  waitlistSignups: 0,
  waitlistConfirmed: 0,
  waitlistConversionRate: 0,
  clickToSignupRate: 0,
  waitlistSources: [],
  pageEvents: []
};

export async function fetchProductSignalSnapshot(
  client: SupabaseClient | null,
  analytics?: Pick<AnalyticsSnapshot, "visitors">
): Promise<ProductSignalSnapshot> {
  if (!client) return { ...emptyProductSignalSnapshot };

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const [waitlist, pageEvents] = await Promise.all([
    client.from("waitlist").select("source, confirmed, created_at").gte("created_at", since).limit(2000),
    client.from("page_events").select("event_type, session_id, created_at").gte("created_at", since).limit(5000)
  ]);

  if (waitlist.error) throw waitlist.error;
  if (pageEvents.error) throw pageEvents.error;

  const waitlistRows = ((waitlist.data ?? []) as WaitlistRow[]).filter(Boolean);
  const eventRows = ((pageEvents.data ?? []) as PageEventRow[]).filter(Boolean);
  const waitlistSignups = waitlistRows.length;
  const waitlistConfirmed = waitlistRows.filter((row) => row.confirmed).length;
  const denominator = analytics?.visitors || uniqueSessionsFromEvents(eventRows);
  const waitlistClicks = eventRows.filter((row) => row.event_type === "CTA_Hero_Click" || row.event_type === "CTA_Solution_Click").length;
  const waitlistSubmits = eventRows.filter((row) => row.event_type === "Waitlist_Submit").length;
  const hasReliableVisitDenominator = denominator > 0 && waitlistSignups <= denominator;
  const hasReliableClickDenominator = waitlistClicks > 0 && waitlistSignups <= waitlistClicks;

  return {
    waitlistClicks,
    waitlistSubmits,
    waitlistSignups,
    waitlistConfirmed,
    waitlistConversionRate: hasReliableVisitDenominator ? roundPercent(waitlistSignups / denominator) : null,
    clickToSignupRate: hasReliableClickDenominator ? roundPercent(waitlistSignups / waitlistClicks) : null,
    waitlistSources: countRows(waitlistRows.map((row) => row.source || "unknown"), "source", "signups"),
    pageEvents: countRows(eventRows.map((row) => row.event_type || "unknown"), "eventType", "count")
  };
}

export function mergeProductSignals(
  analytics: AnalyticsSnapshot,
  productSignals: ProductSignalSnapshot
): AnalyticsSnapshot {
  const hasProductSignals =
    productSignals.waitlistClicks > 0 ||
    productSignals.waitlistSubmits > 0 ||
    productSignals.waitlistSignups > 0 ||
    productSignals.waitlistConfirmed > 0 ||
    productSignals.waitlistSources.length > 0 ||
    productSignals.pageEvents.length > 0;

  if (!hasProductSignals) {
    return analytics;
  }

  return {
    ...analytics,
    waitlistClicks: productSignals.waitlistClicks || analytics.waitlistClicks,
    waitlistSubmits: productSignals.waitlistSubmits || analytics.waitlistSubmits,
    waitlistSignups: productSignals.waitlistSignups,
    waitlistConfirmed: productSignals.waitlistConfirmed,
    waitlistConversionRate: productSignals.waitlistConversionRate,
    clickToSignupRate: productSignals.clickToSignupRate || analytics.clickToSignupRate,
    waitlistSources: productSignals.waitlistSources,
    pageEvents: productSignals.pageEvents,
    conversionRate: productSignals.waitlistConversionRate ?? analytics.conversionRate
  };
}

function uniqueSessionsFromEvents(rows: PageEventRow[]) {
  const sessions = new Set(rows.map((row) => row.session_id).filter(Boolean));
  return sessions.size || rows.reduce((count, row) => count + (row.event_type ? 1 : 0), 0);
}

function roundPercent(value: number) {
  return Math.round(value * 1000) / 10;
}

function countRows<TKey extends string, TValue extends string>(
  values: string[],
  keyName: TKey,
  valueName: TValue
): Array<Record<TKey, string> & Record<TValue, number>> {
  const counts = new Map<string, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([key, count]) => ({ [keyName]: key, [valueName]: count }) as Record<TKey, string> & Record<TValue, number>);
}
