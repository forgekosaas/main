import type { AnalyticsSnapshot } from "@/types/founder-hub";
import { emptyProductSignalSnapshot } from "@/services/product-signals";

type Fetcher = (url: string, init?: RequestInit) => Promise<Response>;

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

function snapshotFromSummary(summary: Record<string, unknown>): AnalyticsSnapshot {
  const topClicks = clickRows(summary.topClicks);

  return {
    visitors: numberValue(summary.totalVisits),
    uniqueVisitors: numberValue(summary.uniqueVisitors),
    conversions: topClicks.reduce((total, row) => total + row.clicks, 0),
    conversionRate: 0,
    ...emptyProductSignalSnapshot,
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

function referrerRows(value: unknown): AnalyticsSnapshot["topReferrers"] {
  return rows(value).map((row) => ({
    source: stringValue(row.referrer, "Direct / None"),
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

function numberValue(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function stringValue(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}
