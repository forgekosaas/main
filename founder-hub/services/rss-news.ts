import type { NewsItem, NewsSource, NewsTopic } from "@/types/founder-hub";

type Fetcher = (url: string, init?: RequestInit) => Promise<Response>;

export interface NewsFeedConfig {
  source: NewsSource;
  feedUrl: string;
}

export const defaultNewsFeeds: NewsFeedConfig[] = [
  { source: "techcrunch", feedUrl: "https://techcrunch.com/category/artificial-intelligence/feed/" },
  { source: "techcrunch", feedUrl: "https://techcrunch.com/category/startups/feed/" },
  { source: "hacker-news", feedUrl: "https://news.ycombinator.com/rss" },
  { source: "indie-hackers", feedUrl: "https://www.indiehackers.com/feed.xml" }
];

export async function fetchRssNewsItems({
  feeds = defaultNewsFeeds,
  fetcher = fetch
}: {
  feeds?: readonly NewsFeedConfig[];
  fetcher?: Fetcher;
} = {}): Promise<NewsItem[]> {
  const batches = await Promise.all(
    feeds.map(async (feed) => {
      try {
        const response = await fetcher(feed.feedUrl, { headers: { Accept: "application/rss+xml, application/xml, text/xml" } });
        if (!response.ok) return [];
        return parseRssNewsItems({ source: feed.source, feedUrl: feed.feedUrl, xml: await response.text() });
      } catch {
        return [];
      }
    })
  );

  return dedupeNewsItems(batches.flat()).sort((a, b) => b.score - a.score || b.publishedAt.localeCompare(a.publishedAt)).slice(0, 24);
}

export function parseRssNewsItems({
  source,
  feedUrl,
  xml
}: {
  source: NewsSource;
  feedUrl: string;
  xml: string;
}): NewsItem[] {
  const items = [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)];
  const atomEntries = items.length > 0 ? [] : [...xml.matchAll(/<entry\b[^>]*>([\s\S]*?)<\/entry>/gi)];
  const blocks = items.length > 0 ? items : atomEntries;

  return dedupeNewsItems(
    blocks.flatMap((match) => {
      const block = match[1] ?? "";
      const title = normalizeText(textFromTag(block, "title"));
      const url = linkFromBlock(block) || feedUrl;
      const summary = textFromTag(block, "description") || textFromTag(block, "summary") || textFromTag(block, "content");
      const topic = topicMatchesFounderHub(`${title} ${summary}`);
      if (!title || !topic) return [];

      return [
        {
          id: `news_${source}_${slugFromUrlOrTitle(url, title)}`,
          source,
          title,
          url,
          summary: normalizeText(stripHtml(summary)).slice(0, 320),
          topic,
          score: scoreTopic(topic, title, summary),
          publishedAt: dateFromTag(block) ?? new Date().toISOString()
        }
      ];
    })
  );
}

export function topicMatchesFounderHub(text: string): NewsTopic | null {
  const normalized = text.toLowerCase();
  if (/\b(ai|artificial intelligence|llm|agentic|agents|generative)\b/.test(normalized)) return "ai";
  if (/\b(micro[-\s]?saas|saas|software as a service)\b/.test(normalized)) return "saas";
  if (/\b(solopreneur|solo founder|indie hacker|indie builder|side project)\b/.test(normalized)) return "solopreneur";
  if (/\b(startup|venture|bootstrapped|product hunt)\b/.test(normalized)) return "startup";
  return null;
}

function dedupeNewsItems(items: NewsItem[]) {
  const byUrl = new Map<string, NewsItem>();
  for (const item of items) {
    const key = item.url.replace(/\/+$/, "");
    const existing = byUrl.get(key);
    if (!existing || item.score > existing.score) {
      byUrl.set(key, item);
    }
  }
  return [...byUrl.values()];
}

function textFromTag(block: string, tag: string) {
  const match = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i").exec(block);
  return decodeXml(stripCdata(match?.[1] ?? "")).trim();
}

function linkFromBlock(block: string) {
  const plainLink = textFromTag(block, "link");
  if (plainLink) return plainLink;
  const atomLink = /<link\b[^>]*href=["']([^"']+)["'][^>]*\/?>/i.exec(block);
  return decodeXml(atomLink?.[1] ?? "").trim();
}

function dateFromTag(block: string) {
  const value = textFromTag(block, "pubDate") || textFromTag(block, "published") || textFromTag(block, "updated");
  const time = Date.parse(value);
  return Number.isFinite(time) ? new Date(time).toISOString() : undefined;
}

function stripCdata(value: string) {
  return value.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "");
}

function stripHtml(value: string) {
  return decodeXml(value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ")).trim();
}

function decodeXml(value: string) {
  let decoded = value;
  for (let index = 0; index < 3; index += 1) {
    decoded = decoded
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&nbsp;/g, " ")
      .replace(/&#39;/g, "'")
      .replace(/&#8217;/g, "'")
      .replace(/&#x27;/gi, "'")
      .replace(/&#(\d+);/g, (_match, code: string) => String.fromCodePoint(Number(code)))
      .replace(/&#x([a-f0-9]+);/gi, (_match, code: string) => String.fromCodePoint(Number.parseInt(code, 16)));
  }
  return decoded;
}

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function slugFromUrlOrTitle(url: string, title: string) {
  try {
    const pathname = new URL(url).pathname;
    const last = pathname.split("/").filter(Boolean).at(-1);
    if (last) return slugify(last);
  } catch {
    // Fall back to title below.
  }
  return slugify(title);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);
}

function scoreTopic(topic: NewsTopic, title: string, summary: string) {
  const text = `${title} ${summary}`.toLowerCase();
  const base = topic === "saas" ? 92 : topic === "ai" ? 86 : topic === "solopreneur" ? 82 : 74;
  return Math.min(100, base + (text.includes("launch") ? 6 : 0) + (text.includes("founder") ? 4 : 0));
}
