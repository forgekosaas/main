import { ExternalLink } from "lucide-react";

import type { CommunityItem } from "@/types/founder-hub";

export function CommunityItemCard({ item }: { item: CommunityItem }) {
  const subredditUrl = item.source === "reddit" ? redditSubredditUrl(item.url) : null;

  return (
    <article className="hub-panel p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-hub-muted">
            <span>{item.source}</span>
            <span>Score {item.relevanceScore}</span>
          </div>
          <h3 className="text-lg font-semibold leading-6 text-hub-ink">{item.title}</h3>
          <p className="mt-1 text-sm text-hub-muted">by {item.author}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {subredditUrl ? (
            <a
              className="hub-focus inline-flex items-center gap-2 rounded-md border border-hub-line px-3 py-2 text-sm font-medium text-hub-muted hover:bg-[#EDF4F0]"
              href={subredditUrl}
              rel="noreferrer"
              target="_blank"
            >
              <ExternalLink size={15} aria-hidden="true" />
              Subreddit
            </a>
          ) : null}
          <a
            className="hub-focus inline-flex items-center gap-2 rounded-md border border-hub-line px-3 py-2 text-sm font-medium text-hub-accent hover:bg-[#EDF4F0]"
            href={item.url}
            rel="noreferrer"
            target="_blank"
          >
            <ExternalLink size={15} aria-hidden="true" />
            {item.source === "reddit" ? "Reply on Reddit" : "Open"}
          </a>
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-md border border-hub-line bg-[#FBFAF7] p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-hub-muted">Pain point</p>
          <p className="mt-2 text-sm leading-6 text-hub-ink">{item.painPoint}</p>
        </div>
        <div className="rounded-md border border-hub-line bg-[#FBFAF7] p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-hub-muted">Why reply</p>
          <p className="mt-2 text-sm leading-6 text-hub-ink">{item.replyRationale}</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-hub-muted">{item.summary}</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-md border border-hub-line bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-hub-muted">User language</p>
          {item.userLanguage.length > 0 ? (
            <ul className="mt-2 space-y-2 text-sm leading-6 text-hub-ink">
              {item.userLanguage.map((phrase) => (
                <li key={phrase}>&quot;{phrase}&quot;</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm leading-6 text-hub-muted">No reusable phrase extracted.</p>
          )}
        </div>
        <div className="rounded-md border border-hub-line bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-hub-muted">Post angle</p>
          <p className="mt-2 text-sm leading-6 text-hub-ink">{item.postAngle}</p>
        </div>
      </div>
      <div className="mt-4 rounded-md border border-hub-line bg-white p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-hub-muted">Draft reply</p>
        <p className="mt-2 text-sm leading-6 text-hub-ink">{item.suggestedReply}</p>
      </div>
    </article>
  );
}

function redditSubredditUrl(url: string) {
  const match = url.match(/reddit\.com\/r\/([^/]+)/i);
  return match ? `https://www.reddit.com/r/${match[1]}` : null;
}
