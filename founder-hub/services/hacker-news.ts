import type { RawCommunityItem } from "@/types/founder-hub";

type Fetcher = (url: string, init?: RequestInit) => Promise<Response>;

interface HackerNewsHit {
  objectID?: string;
  title?: string;
  story_title?: string;
  author?: string;
  url?: string;
  story_url?: string;
  story_text?: string;
  comment_text?: string;
  created_at?: string;
}

interface HackerNewsSearchResponse {
  hits?: HackerNewsHit[];
}

export function buildHackerNewsSearchUrl({ query, limit = 10 }: { query: string; limit?: number }) {
  const url = new URL("https://hn.algolia.com/api/v1/search");
  url.searchParams.set("query", query);
  url.searchParams.set("tags", "story");
  url.searchParams.set("hitsPerPage", String(limit));
  return url.toString();
}

export async function fetchHackerNewsThreads({
  query,
  limit = 10,
  fetcher = fetch
}: {
  query: string;
  limit?: number;
  fetcher?: Fetcher;
}): Promise<RawCommunityItem[]> {
  const response = await fetcher(buildHackerNewsSearchUrl({ query, limit }), {
    method: "GET",
    headers: { Accept: "application/json" }
  });

  if (!response.ok) {
    throw new Error(`Hacker News search failed with HTTP ${response.status}`);
  }

  const payload = (await response.json()) as HackerNewsSearchResponse;
  return (payload.hits ?? []).map(toRawCommunityItem).filter(Boolean) as RawCommunityItem[];
}

function toRawCommunityItem(hit: HackerNewsHit): RawCommunityItem | null {
  const id = hit.objectID;
  const title = hit.title ?? hit.story_title;
  if (!id || !title) {
    return null;
  }

  const url = hit.url ?? hit.story_url ?? `https://news.ycombinator.com/item?id=${id}`;
  const text = stripHtml(hit.story_text ?? hit.comment_text ?? "");

  return {
    id: `hn_${id}`,
    source: "hacker-news",
    title,
    author: hit.author ?? "hn",
    url,
    content: text ? `${title}\n\n${text}` : title,
    createdAt: hit.created_at ?? new Date().toISOString()
  };
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
