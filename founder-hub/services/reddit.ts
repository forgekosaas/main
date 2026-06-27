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
}

export interface RedditCredentials {
  clientId: string;
  clientSecret: string;
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
  };
}

interface RedditListing {
  data?: {
    children?: RedditListingChild[];
  };
}

export function buildRedditFetchPlan(options: RedditFetchPlanOptions = {}): PlannedRedditRequest[] {
  const subreddits = normalizeSubreddits(options.subreddits ?? defaultSubreddits).slice(
    0,
    defaultFounderHubSettings.subredditLimit
  );
  const query = options.query?.trim() || defaultCommunityQuery;

  return subreddits.map((subreddit) => {
    const url = new URL(`https://oauth.reddit.com/r/${encodeURIComponent(subreddit)}/search`);
    url.searchParams.set("q", query);
    url.searchParams.set("restrict_sr", "1");
    url.searchParams.set("sort", "new");
    url.searchParams.set("t", "week");
    url.searchParams.set("limit", "3");

    return {
      method: "GET",
      url: url.toString(),
      subreddit
    };
  });
}

export async function fetchRelevantRedditThreads({
  credentials,
  subreddits,
  query,
  fetcher = fetch
}: {
  credentials: RedditCredentials;
  subreddits?: readonly string[];
  query?: string;
  fetcher?: Fetcher;
}): Promise<RawCommunityItem[]> {
  const token = await getRedditReadOnlyToken(credentials, fetcher);
  const plan = buildRedditFetchPlan({ subreddits, query });
  const items: RawCommunityItem[] = [];

  for (const request of plan) {
    const response = await fetcher(request.url, {
      method: request.method,
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": "ForgekoFounderHub/0.1 read-only"
      }
    });

    if (!response.ok) {
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
        title: data.title,
        author: data.author ?? "unknown",
        url: data.permalink ? `https://www.reddit.com${data.permalink}` : data.url ?? request.url,
        content: data.selftext ?? "",
        createdAt: data.created_utc ? new Date(data.created_utc * 1000).toISOString() : new Date().toISOString()
      });
    }
  }

  return items;
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

async function getRedditReadOnlyToken(credentials: RedditCredentials, fetcher: Fetcher) {
  const body = new URLSearchParams({ grant_type: "client_credentials" });
  const response = await fetcher("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${credentials.clientId}:${credentials.clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "ForgekoFounderHub/0.1 read-only"
    },
    body
  });

  if (!response.ok) {
    throw new Error("Unable to create Reddit read-only token");
  }

  const json = (await response.json()) as { access_token?: string };
  if (!json.access_token) {
    throw new Error("Reddit token response did not include an access token");
  }

  return json.access_token;
}
