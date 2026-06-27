import { ExternalLink } from "lucide-react";

import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { buildMarketingToolkit } from "@/lib/perception";
import { getCurrentFounderHubSnapshot } from "@/lib/snapshot";

export const dynamic = "force-dynamic";

export default async function MarketingPage() {
  const snapshot = await getCurrentFounderHubSnapshot();
  const toolkit = buildMarketingToolkit(snapshot);
  const focusItems = toolkit.experiments.slice(0, 3);

  return (
    <>
      <PageHeader title="Marketing" description="A short action list for social posts, replies, and feedback-driven positioning." />
      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="space-y-4">
          <section className="hub-panel p-4">
            <h2 className="text-base font-semibold text-hub-ink">What Matters Now</h2>
            <div className="mt-4 grid gap-3">
              {focusItems.length > 0 ? (
                focusItems.map((item, index) => (
                  <div key={item} className="flex gap-3 rounded-md border border-hub-line bg-[#FBFAF7] p-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-hub-accent text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-6 text-hub-ink">{item}</p>
                  </div>
                ))
              ) : (
                <EmptyState title="No marketing focus yet" body="Add one Reddit/X/IH item or run Update data." />
              )}
            </div>
          </section>

          <section className="hub-panel p-4">
            <h2 className="text-base font-semibold text-hub-ink">Post Ideas</h2>
            <div className="mt-4 grid gap-3">
              {toolkit.postIdeas.length > 0 ? (
                toolkit.postIdeas.map((idea) => (
                  <article key={`${idea.title}_${idea.sourceIds.join("_")}`} className="rounded-md border border-hub-line bg-[#FBFAF7] p-3">
                    <h3 className="font-semibold text-hub-ink">{idea.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-hub-ink">{idea.angle}</p>
                  </article>
                ))
              ) : (
                <p className="text-sm text-hub-muted">No post ideas yet.</p>
              )}
            </div>
          </section>
        </section>

        <aside className="space-y-4">
          <section className="hub-panel p-4">
            <h2 className="text-base font-semibold text-hub-ink">Reply Queue</h2>
            <div className="mt-4 grid gap-3">
              {toolkit.replyQueue.length > 0 ? (
                toolkit.replyQueue.map((reply) => (
                  <article key={reply.id} className="rounded-md border border-hub-line bg-[#FBFAF7] p-3">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-hub-ink">{reply.title}</h3>
                      <a className="hub-focus inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-hub-accent" href={reply.url} rel="noreferrer" target="_blank">
                        <ExternalLink size={15} aria-hidden="true" />
                        Reply
                      </a>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-hub-muted">{reply.rationale}</p>
                    <p className="mt-3 rounded-md bg-white p-3 text-sm leading-6 text-hub-ink">{reply.suggestedReply}</p>
                  </article>
                ))
              ) : (
                <p className="text-sm text-hub-muted">No reply opportunities yet. Add manual Reddit/X/IH items or enable Reddit fetch.</p>
              )}
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}
