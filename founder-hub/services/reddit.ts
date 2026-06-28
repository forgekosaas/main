import { defaultCommunityQuery, defaultFounderHubSettings } from "@/settings/defaults";
import type { RawCommunityItem } from "@/types/founder-hub";

export const defaultSubreddits = defaultFounderHubSettings.subreddits;

export interface RedditFetchPlanOptions {
  subreddits?: readonly string[];
  query?: string;
}

export interface PlannedRedditRequest {
  method: "GET";
  url: string;
  subreddit: string;
  kind: "search-json" | "rss";
}

type Fetcher = (url: string, init?: RequestInit) => Promise<Response>;

interface RedditListingChild {
  data?: {
    id?: string;
    title?: string;
    author?: string;
    permalink?: string;
    url?: string;
    selftext?: string;
    created_utc?: number;
    score?: number;
    body?: string;
  };
}

interface RedditListing {
  data?: {
    children?: RedditListingChild[];
  };
}

type RedditCommentsResponse = [unknown, RedditListing];

export function buildRedditFetchPlan(options: RedditFetchPlanOptions = {}): PlannedRedditRequest[] {
  const subreddits = normalizeSubreddits(options.subreddits ?? defaultSubreddits).slice(
    0,
    defaultFounderHubSettings.subredditLimit
  );
  const query = options.query?.trim() || defaultCommunityQuery;

  return subreddits.map((subreddit) => {
    const url = new URL(`https://www.reddit.com/r/${encodeURIComponent(subreddit)}/search.json`);
    url.searchParams.set("q", query);
    url.searchParams.set("restrict_sr", "1");
    url.searchParams.set("sort", "new");
    url.searchParams.set("t", "week");
    url.searchParams.set("limit", "3");

    return {
      method: "GET",
      url: url.toString(),
      subreddit,
      kind: "search-json"
    };
  });
}

export async function fetchRelevantRedditThreads({
  subreddits,
  query,
  fetcher = fetch
}: {
  subreddits?: readonly string[];
  query?: string;
  fetcher?: Fetcher;
}): Promise<RawCommunityItem[]> {
  const plan = buildRedditFetchPlan({ subreddits, query });
  const items: RawCommunityItem[] = [];

  for (const request of plan) {
    const response = await fetcher(request.url, {
      method: request.method,
      headers: {
        Accept: "application/json",
        "User-Agent": "ForgekoFounderHub/0.1 public-local"
      }
    });

    if (!response.ok) {
      items.push(...await fetchRedditRssItems(request.subreddit, fetcher));
      continue;
    }

    const listing = (await response.json()) as RedditListing;
    for (const child of listing.data?.children ?? []) {
      const data = child.data;
      if (!data?.id || !data.title) {
        continue;
      }

      items.push({
        id: `reddit_${data.id}`,
        source: "reddit",
        kind: "post",
        subreddit: request.subreddit,
        score: data.score,
        title: data.title,
        author: data.author ?? "unknown",
        url: data.permalink ? `https://www.reddit.com${data.permalink}` : data.url ?? request.url,
        content: data.selftext ?? "",
        createdAt: data.created_utc ? new Date(data.created_utc * 1000).toISOString() : new Date().toISOString()
      });

      const commentItems = await fetchTopCommentsForThread({
        subreddit: request.subreddit,
        postId: data.id,
        title: data.title,
        fetcher
      });
      items.push(...commentItems);
    }
  }

  return items;
}

async function fetchRedditRssItems(subreddit: string, fetcher: Fetcher) {
  const url = `https://www.reddit.com/r/${encodeURIComponent(subreddit)}/.rss?limit=10`;
  const response = await fetcher(url, {
    method: "GET",
    headers: {
      Accept: "application/rss+xml, application/xml, text/xml",
      "User-Agent": "ForgekoFounderHub/0.1 public-local"
    }
  });

  if (!response.ok) {
    return [];
  }

  return parseRedditRss({ subreddit, xml: await response.text() });
}

export function parseRedditRss({ subreddit, xml }: { subreddit: string; xml: string }): RawCommunityItem[] {
  return [...xml.matchAll(/<entry\b[^>]*>([\s\S]*?)<\/entry>/gi)].flatMap((match): RawCommunityItem[] => {
    const block = match[1] ?? "";
    const title = rssText(block, "title");
    const url = rssLink(block);
    const id = redditIdFromUrl(url) || slugify(title);
    if (!title || !url || !id) return [];

    return [
      {
        id: `reddit_${id}`,
        source: "reddit",
        kind: "post",
        subreddit,
        title,
        author: rssAuthor(block),
        url,
        content: rssText(block, "content") || rssText(block, "summary"),
        createdAt: rssDate(block) ?? new Date().toISOString()
      }
    ];
  });
}

export function summarizePainPoints(items: Array<{
  id?: string;
  source?: string;
  score?: number;
  summary?: string;
  postAngle?: string;
  relevanceScore?: number;
  suggestedReply?: string;
  replyRationale?: string;
  painPoint: string;
  title: string;
  author: string;
  url: string;
  subreddit?: string;
  kind?: string;
  createdAt: string;
  userLanguage?: string[];
}>) {
  const byPain = new Map<string, {
    painPoint: string;
    count: number;
    subreddits: string[];
    sources: Array<{ subreddit: string; author: string; date: string; kind: string; title: string; comment: string; url: string }>;
  }>();

  for (const item of items) {
    const painPoint = item.painPoint.trim() || "uncategorized founder pain";
    const subreddit = item.subreddit || "reddit";
    const current = byPain.get(painPoint) ?? { painPoint, count: 0, subreddits: [], sources: [] };
    current.count += 1;
    if (!current.subreddits.includes(subreddit)) current.subreddits.push(subreddit);
    current.sources.push({
      subreddit,
      author: item.author,
      date: item.createdAt,
      kind: item.kind ?? "post",
      title: item.title,
      comment: item.userLanguage?.[0] ?? item.title,
      url: item.url
    });
    byPain.set(painPoint, current);
  }

  return [...byPain.values()]
    .map((cluster) => ({ ...cluster, sources: cluster.sources.slice(0, 5) }))
    .sort((a, b) => b.count - a.count || a.painPoint.localeCompare(b.painPoint))
    .slice(0, 8);
}

async function fetchTopCommentsForThread({
  subreddit,
  postId,
  title,
  fetcher
}: {
  subreddit: string;
  postId: string;
  title: string;
  fetcher: Fetcher;
}) {
  const url = new URL(`https://www.reddit.com/r/${encodeURIComponent(subreddit)}/comments/${encodeURIComponent(postId)}.json`);
  url.searchParams.set("limit", "3");
  url.searchParams.set("sort", "top");
  url.searchParams.set("depth", "1");

  const response = await fetcher(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
      "User-Agent": "ForgekoFounderHub/0.1 public-local"
    }
  });

  if (!response.ok) {
    return [];
  }

  const payload = (await response.json()) as RedditCommentsResponse;
  const comments = payload[1]?.data?.children ?? [];

  return comments.flatMap((child): RawCommunityItem[] => {
    const data = child.data;
    const body = data?.body?.trim();
    if (!data?.id || !body || body === "[deleted]" || body === "[removed]") {
      return [];
    }

    return [
      {
        id: `reddit_comment_${data.id}`,
        source: "reddit",
        kind: "comment",
        subreddit,
        score: data.score,
        title: `Comment on: ${title}`,
        author: data.author ?? "unknown",
        url: data.permalink ? `https://www.reddit.com${data.permalink}` : url.toString(),
        content: body,
        createdAt: data.created_utc ? new Date(data.created_utc * 1000).toISOString() : new Date().toISOString()
      }
    ];
  });
}

function normalizeSubreddits(subreddits: readonly string[]) {
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const subreddit of subreddits) {
    const value = subreddit.trim().replace(/^r\//i, "");
    if (!value || seen.has(value.toLowerCase())) {
      continue;
    }

    seen.add(value.toLowerCase());
    normalized.push(value);
  }

  return normalized;
}

function rssText(block: string, tag: string) {
  const match = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i").exec(block);
  return decodeXml(stripHtml(stripCdata(match?.[1] ?? ""))).replace(/\s+/g, " ").trim();
}

function rssLink(block: string) {
  const match = /<link\b[^>]*href=["']([^"']+)["'][^>]*\/?>/i.exec(block);
  return decodeXml(match?.[1] ?? "").trim();
}

function rssAuthor(block: string) {
  const authorBlock = /<author\b[^>]*>([\s\S]*?)<\/author>/i.exec(block)?.[1] ?? "";
  return rssText(authorBlock, "name") || "unknown";
}

function rssDate(block: string) {
  const raw = rssText(block, "updated") || rssText(block, "published");
  const time = Date.parse(raw);
  return Number.isFinite(time) ? new Date(time).toISOString() : undefined;
}

function redditIdFromUrl(url: string) {
  const match = /\/comments\/([^/?#]+)/i.exec(url);
  return match?.[1];
}

function stripCdata(value: string) {
  return value.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "");
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ");
}

function decodeXml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 60);
}
