import { ExternalLink } from "lucide-react";

import { EmptyState } from "@/components/EmptyState";
import { ManualItemForm } from "@/components/ManualItemForm";
import { PageHeader } from "@/components/PageHeader";
import { getCurrentFounderHubSnapshot } from "@/lib/snapshot";
import type { CommunityItem } from "@/types/founder-hub";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const snapshot = await getCurrentFounderHubSnapshot();
  const primaryItems = snapshot.communityItems.filter((item) => item.source !== "hacker-news").slice(0, 12);
  const secondaryItems = snapshot.communityItems.filter((item) => item.source === "hacker-news").slice(0, 5);

  return (
    <>
      <PageHeader title="Community" description="Manual Reddit, X, and Indie Hackers items plus read-only community fetches." />
      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <ManualItemForm />
        <section className="space-y-4">
          {primaryItems.length > 0 ? (
            primaryItems.map((item) => <CommunityOpportunity key={item.id} item={item} />)
          ) : (
            <EmptyState title="No primary community opportunities" body="Add a manual Reddit/X/IH item or configure Reddit credentials." />
          )}
          {secondaryItems.length > 0 ? (
            <section className="hub-panel p-4">
              <h2 className="text-base font-semibold text-hub-ink">Secondary HN Trends</h2>
              <div className="mt-3 grid gap-2">
                {secondaryItems.map((item) => (
                  <a
                    className="hub-focus rounded-md border border-hub-line bg-[#FBFAF7] px-3 py-2 text-sm text-hub-muted hover:bg-white"
                    href={item.url}
                    key={item.id}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {item.title}
                  </a>
                ))}
              </div>
            </section>
          ) : null}
        </section>
      </div>
    </>
  );
}

function CommunityOpportunity({ item }: { item: CommunityItem }) {
  return (
    <article className="hub-panel p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-hub-muted">
            <span>{item.source}</span>
            <span>score {item.relevanceScore}</span>
          </div>
          <h2 className="text-base font-semibold leading-6 text-hub-ink">{item.title}</h2>
          <p className="mt-1 text-sm text-hub-muted">{item.painPoint}</p>
        </div>
        <a
          className="hub-focus inline-flex shrink-0 items-center gap-2 rounded-md border border-hub-line px-3 py-2 text-sm font-semibold text-hub-accent hover:bg-[#EDF4F0]"
          href={item.url}
          rel="noreferrer"
          target="_blank"
        >
          <ExternalLink size={15} aria-hidden="true" />
          Reply
        </a>
      </div>
      <p className="mt-4 rounded-md border border-hub-line bg-white p-3 text-sm leading-6 text-hub-ink">{item.suggestedReply}</p>
      <details className="mt-3 text-sm text-hub-muted">
        <summary className="cursor-pointer font-medium text-hub-accent">Details</summary>
        <div className="mt-2 space-y-2 leading-6">
          <p>{item.summary}</p>
          <p>
            <span className="font-medium text-hub-ink">Post angle:</span> {item.postAngle}
          </p>
        </div>
      </details>
    </article>
  );
}
