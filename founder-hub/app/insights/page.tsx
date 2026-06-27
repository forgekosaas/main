import { EmptyState } from "@/components/EmptyState";
import { MemoryLog } from "@/components/MemoryLog";
import { PageHeader } from "@/components/PageHeader";
import { getCurrentFounderHubSnapshot } from "@/lib/snapshot";
import type { FounderHubSnapshot } from "@/types/founder-hub";

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const snapshot = await getCurrentFounderHubSnapshot();
  const painPointRows = buildPainPointRows(snapshot);
  const languageRows = buildLanguageRows(snapshot);
  const replyRows = snapshot.communityItems.filter((item) => item.source !== "hacker-news" && item.relevanceScore >= 65).slice(0, 5);
  const nextAction = replyRows[0]
    ? `Reply to "${replyRows[0].title}", then reuse "${replyRows[0].painPoint}" as the next post angle.`
    : painPointRows[0]
      ? `Use "${painPointRows[0].painPoint}" as the next listening theme.`
      : "Add one real Reddit/X/IH item or sync Gmail feedback.";

  return (
    <>
      <PageHeader title="Insights" description="Pain points, reusable language, reply opportunities, and decision memory." />
      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <section className="space-y-4">
          <section className="hub-panel p-4">
            <h2 className="text-base font-semibold text-hub-ink">Recommended Next Action</h2>
            <p className="mt-3 text-sm leading-6 text-hub-ink">{nextAction}</p>
          </section>
          <section className="hub-panel p-4">
            <h2 className="text-base font-semibold text-hub-ink">Pain Points</h2>
            <div className="mt-4 grid gap-2">
              {painPointRows.length > 0 ? (
                painPointRows.map((row) => (
                  <div key={row.painPoint} className="rounded-md border border-hub-line bg-[#FBFAF7] px-3 py-2 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-hub-ink">{row.painPoint}</span>
                      <span className="text-hub-muted">{row.count}</span>
                    </div>
                    <p className="mt-1 text-hub-muted">{row.example}</p>
                  </div>
                ))
              ) : (
                <p className="rounded-md border border-hub-line bg-[#FBFAF7] px-3 py-2 text-sm text-hub-muted">No pain points loaded yet.</p>
              )}
            </div>
          </section>
          <section className="hub-panel p-4">
            <h2 className="text-base font-semibold text-hub-ink">Reusable Language</h2>
            <div className="mt-4 grid gap-2">
              {languageRows.length > 0 ? (
                languageRows.map((row) => (
                  <div key={row.phrase} className="rounded-md border border-hub-line bg-[#FBFAF7] px-3 py-2 text-sm">
                    <p className="font-medium text-hub-ink">&quot;{row.phrase}&quot;</p>
                    <p className="mt-1 text-hub-muted">{row.source}</p>
                  </div>
                ))
              ) : (
                <p className="rounded-md border border-hub-line bg-[#FBFAF7] px-3 py-2 text-sm text-hub-muted">No reusable phrases extracted yet.</p>
              )}
            </div>
          </section>
          <section className="hub-panel p-4">
            <h2 className="text-base font-semibold text-hub-ink">Reply Opportunities</h2>
            <div className="mt-4 grid gap-2">
              {replyRows.length > 0 ? (
                replyRows.map((item) => (
                  <article key={item.id} className="rounded-md border border-hub-line bg-[#FBFAF7] px-3 py-2 text-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-medium text-hub-ink">{item.title}</h3>
                        <p className="mt-1 text-hub-muted">{item.suggestedReply}</p>
                      </div>
                      <a className="hub-focus shrink-0 text-hub-accent" href={item.url} rel="noreferrer" target="_blank">
                        Reply
                      </a>
                    </div>
                  </article>
                ))
              ) : (
                <p className="rounded-md border border-hub-line bg-[#FBFAF7] px-3 py-2 text-sm text-hub-muted">No high-fit replies yet.</p>
              )}
            </div>
          </section>
          {snapshot.insights.length > 0 ? (
            snapshot.insights.map((insight) => (
              <article key={insight.id} className="hub-panel p-4">
                <h2 className="text-lg font-semibold text-hub-ink">{insight.title}</h2>
                <p className="mt-3 text-sm leading-6 text-hub-muted">{insight.summary}</p>
              </article>
            ))
          ) : (
            <EmptyState title="No generated insights" body="Run Update data after loading community, analytics, or Gmail data." />
          )}
        </section>
        <MemoryLog entries={snapshot.memory} />
      </div>
    </>
  );
}

function buildPainPointRows(snapshot: FounderHubSnapshot) {
  const rows = new Map<string, { painPoint: string; count: number; example: string }>();
  for (const item of snapshot.communityItems.filter((row) => row.source !== "hacker-news")) {
    const existing = rows.get(item.painPoint);
    rows.set(item.painPoint, {
      painPoint: item.painPoint,
      count: (existing?.count ?? 0) + 1,
      example: existing?.example ?? item.title
    });
  }
  for (const email of snapshot.feedback.filter((row) => row.category !== "Waitlist")) {
    const existing = rows.get(email.painPoint);
    rows.set(email.painPoint, {
      painPoint: email.painPoint,
      count: (existing?.count ?? 0) + 1,
      example: existing?.example ?? email.subject
    });
  }

  return [...rows.values()].sort((a, b) => b.count - a.count).slice(0, 8);
}

function buildLanguageRows(snapshot: FounderHubSnapshot) {
  return snapshot.communityItems
    .filter((item) => item.source !== "hacker-news")
    .flatMap((item) => item.userLanguage.map((phrase) => ({ phrase, source: `${item.source}: ${item.title}` })))
    .filter((row) => row.phrase.length > 0)
    .slice(0, 10);
}
