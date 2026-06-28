import { ExternalLink } from "lucide-react";

import { DataSyncPanel } from "@/components/DataSyncPanel";
import { EmptyState } from "@/components/EmptyState";
import { MetricTile } from "@/components/MetricTile";
import { summarizePainPoints } from "@/services/reddit";
import type { CommunityItem, FounderHubSnapshot } from "@/types/founder-hub";

export function FounderHubHome({ snapshot }: { snapshot: FounderHubSnapshot }) {
  const redditItems = snapshot.communityItems
    .filter((item) => item.source === "reddit")
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 8);
  const painPointRows = summarizePainPoints(redditItems);
  const sourceHealth = snapshot.sourceHealth ?? [];

  return (
    <div className="space-y-4">
      <section className="hub-panel p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-hub-muted">Private local hub</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal text-hub-ink">Founder Hub</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-hub-muted">
              Source-backed marketing drafts, manual community pain points, and the only Forgeko funnel metrics worth checking right now.
            </p>
          </div>
          <a
            className="hub-focus inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-hub-line bg-[#FBFAF7] px-3 py-2 text-sm font-semibold text-hub-accent transition hover:bg-white"
            download
            href="/api/export-data"
          >
            Export data
          </a>
        </div>
        <div className="mt-4">
          <DataSyncPanel />
        </div>
        {sourceHealth.length > 0 ? (
          <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
            {sourceHealth.map((source) => (
              <div key={source.id} className="rounded-md border border-hub-line bg-[#FBFAF7] px-3 py-2 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-hub-ink">{source.label}</span>
                  <span className={source.status === "error" ? "text-red-700" : source.status === "skipped" ? "text-hub-muted" : "text-green-700"}>
                    {source.status}
                  </span>
                </div>
                <p className="mt-1 text-hub-muted">{source.detail}</p>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <section className="grid gap-3 md:grid-cols-3 xl:grid-cols-5">
        <MetricTile label="Active users" note="selected window" tone="blue" value={String(snapshot.analytics.activeUsers)} />
        <MetricTile label="Visits" note="page views" value={String(snapshot.analytics.visitors)} />
        <MetricTile label="Waitlist clicks" note="CTA clicks" tone="amber" value={String(snapshot.analytics.waitlistClicks)} />
        <MetricTile label="Waitlist submits" note="form submit attempts" value={String(snapshot.analytics.waitlistSubmits)} />
        <MetricTile label="Signups" note="saved waitlist" tone="green" value={String(snapshot.analytics.waitlistSignups)} />
      </section>

      <section className="hub-panel p-4">
        <h2 className="text-base font-semibold text-hub-ink">Video Ideas</h2>
        <p className="mt-1 text-sm text-hub-muted">TikTok/Instagram and YouTube ideas from the same source-backed signals.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {(snapshot.videoIdeas ?? []).length > 0 ? (
            (snapshot.videoIdeas ?? []).slice(0, 4).map((idea) => (
              <article key={idea.id} className="rounded-md border border-hub-line bg-[#FBFAF7] p-3">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-hub-muted">{idea.channel}</div>
                <h3 className="text-sm font-semibold leading-6 text-hub-ink">{idea.title}</h3>
                <p className="mt-2 text-sm leading-6 text-hub-ink">{idea.hook}</p>
                <ol className="mt-3 list-decimal space-y-1 pl-4 text-sm leading-6 text-hub-muted">
                  {idea.outline.map((step) => <li key={step}>{step}</li>)}
                </ol>
                <p className="mt-3 text-xs leading-5 text-hub-muted">{idea.targetAudience}</p>
              </article>
            ))
          ) : (
            <EmptyState title="No video ideas yet" body="Run Extract latest data to generate short-form and YouTube ideas from today's sources." />
          )}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="hub-panel p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-hub-ink">Daily Post Drafts</h2>
              <p className="mt-1 text-sm text-hub-muted">English X/LinkedIn drafts grounded in today&apos;s news and founder signals.</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3">
            {snapshot.postDrafts.length > 0 ? (
              snapshot.postDrafts.slice(0, 3).map((draft) => (
                <article key={draft.id} className="rounded-md border border-hub-line bg-[#FBFAF7] p-3">
                  <h3 className="font-semibold text-hub-ink">{draft.title}</h3>
                  <p className="mt-3 whitespace-pre-line text-sm leading-6 text-hub-ink">{draft.body}</p>
                  <p className="mt-3 text-xs leading-5 text-hub-muted">{draft.rationale}</p>
                  <SourceLinks snapshot={snapshot} sourceIds={draft.sourceIds} />
                </article>
              ))
            ) : (
              <EmptyState title="No post drafts yet" body="Run Extract latest data to fetch news and generate private drafts. Add community signals manually when useful." />
            )}
          </div>
        </section>

        <section className="hub-panel p-4">
          <h2 className="text-base font-semibold text-hub-ink">Manual Community Pain Points</h2>
          <p className="mt-1 text-sm text-hub-muted">Reddit, X, and Indie Hackers signals added manually while automatic Reddit fetching is disabled.</p>
          <div className="mt-4 grid gap-2">
            {painPointRows.length > 0 ? (
              painPointRows.map((row) => (
                <div key={row.painPoint} className="rounded-md border border-hub-line bg-[#FBFAF7] px-3 py-2 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-hub-ink">{row.painPoint}</span>
                    <span className="text-hub-muted">{row.count}</span>
                  </div>
                  <div className="mt-2 space-y-1">
                    {row.sources.slice(0, 3).map((source) => (
                      <a
                        className="block text-hub-muted hover:text-hub-accent"
                        href={source.url}
                        key={`${source.url}_${source.author}`}
                        rel="noreferrer"
                        target="_blank"
                      >
                        r/{source.subreddit} · {source.author} · {source.comment}
                      </a>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-md border border-hub-line bg-[#FBFAF7] px-3 py-2 text-sm text-hub-muted">No manual Reddit pain points loaded yet.</p>
            )}
          </div>
          <div className="mt-4 grid gap-3">
            {redditItems.length > 0 ? (
              redditItems.map((item) => <RedditOpportunity key={item.id} item={item} />)
            ) : (
              <EmptyState title="No manual Reddit opportunities" body="Automatic Reddit fetching is disabled for MVP. Add relevant Reddit, X, or Indie Hackers items manually." />
            )}
          </div>
        </section>
      </section>

      <section className="hub-panel p-4">
        <h2 className="text-base font-semibold text-hub-ink">Analytics</h2>
        <p className="mt-2 text-sm leading-6 text-hub-muted">{snapshot.analytics.aiExplanation}</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SignalList label="Top referrers" rows={snapshot.analytics.topReferrers.map((row) => [row.source, row.visitors])} />
          <SignalList label="Top pages" rows={snapshot.analytics.topPages.map((row) => [row.path, row.visitors])} />
          <SignalList label="Top clicks" rows={snapshot.analytics.topClicks.map((row) => [row.label, row.clicks])} />
          <SignalList label="Waitlist sources" rows={snapshot.analytics.waitlistSources.map((row) => [row.source, row.signups])} />
        </div>
      </section>
    </div>
  );
}

function RedditOpportunity({ item }: { item: CommunityItem }) {
  return (
    <article className="rounded-md border border-hub-line bg-[#FBFAF7] p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-hub-muted">
            <span>{item.subreddit ? `r/${item.subreddit}` : "reddit"}</span>
            <span>{item.kind ?? "post"}</span>
            <span>score {item.relevanceScore}</span>
          </div>
          <h3 className="text-sm font-semibold leading-6 text-hub-ink">{item.title}</h3>
          <p className="mt-1 text-sm leading-6 text-hub-muted">{item.painPoint}</p>
        </div>
        <a className="hub-focus shrink-0 text-hub-accent" href={item.url} rel="noreferrer" target="_blank" title="Open Reddit source">
          <ExternalLink size={16} aria-hidden="true" />
        </a>
      </div>
      <p className="mt-3 text-sm leading-6 text-hub-ink">{item.suggestedReply}</p>
    </article>
  );
}

function SignalList({ label, rows }: { label: string; rows: Array<[string, number]> }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-hub-muted">{label}</h3>
      <div className="mt-2 divide-y divide-hub-line rounded-md border border-hub-line bg-[#FBFAF7]">
        {rows.length > 0 ? (
          rows.map(([name, count]) => (
            <div key={name} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
              <span className="truncate text-hub-ink">{name}</span>
              <span className="font-semibold text-hub-muted">{count}</span>
            </div>
          ))
        ) : (
          <div className="px-3 py-2 text-sm text-hub-muted">No rows yet.</div>
        )}
      </div>
    </div>
  );
}

function SourceLinks({ snapshot, sourceIds }: { snapshot: FounderHubSnapshot; sourceIds: string[] }) {
  const allSources = [...snapshot.newsItems, ...snapshot.communityItems];
  const sources = sourceIds
    .map((id) => allSources.find((source) => source.id === id))
    .filter(isPresent)
    .slice(0, 4);

  if (sources.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {sources.map((source) => (
        <a
          className="hub-focus inline-flex items-center gap-1 rounded-md border border-hub-line bg-white px-2 py-1 text-xs font-semibold text-hub-accent"
          href={source.url}
          key={source.id}
          rel="noreferrer"
          target="_blank"
        >
          Source
          <ExternalLink size={12} aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}

function isPresent<T>(value: T | undefined): value is T {
  return typeof value !== "undefined";
}
