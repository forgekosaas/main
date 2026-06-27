import { EmptyState } from "@/components/EmptyState";
import { MetricTile } from "@/components/MetricTile";
import { PageHeader } from "@/components/PageHeader";
import { actionableFeedbackCount, reliableWaitlistCount } from "@/lib/signal-cleaning";
import { getCurrentFounderHubSnapshot } from "@/lib/snapshot";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const snapshot = await getCurrentFounderHubSnapshot();
  const { analytics } = snapshot;
  const gmailWaitlist = reliableWaitlistCount(snapshot);
  const feedbackCount = actionableFeedbackCount(snapshot);
  const maxVisitors = Math.max(...analytics.trend.map((day) => day.visitors), 1);

  return (
    <>
      <PageHeader title="Analytics" description="Forgeko first-party traffic, reliable Gmail waitlist signals, and raw Supabase events." />
      <div className="grid gap-4 md:grid-cols-4">
        <MetricTile label="Visitors" note="Last 7 days" tone="blue" value={String(analytics.visitors)} />
        <MetricTile label="Waitlist" note="Gmail reliable" tone="green" value={String(gmailWaitlist)} />
        <MetricTile label="Feedback" note="Gmail actionable" value={String(feedbackCount)} />
        <MetricTile label="Raw Rows" note="Supabase waitlist" tone="amber" value={String(analytics.waitlistSignups)} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="hub-panel p-4">
          <h2 className="text-base font-semibold text-hub-ink">7 Day Trend</h2>
          {analytics.trend.length > 0 ? (
            <div className="mt-5 flex h-56 items-end gap-3">
              {analytics.trend.map((day) => (
                <div key={day.date} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-md bg-hub-accent"
                    style={{ height: `${Math.max(12, (day.visitors / maxVisitors) * 190)}px` }}
                    title={`${day.visitors} visitors`}
                  />
                  <span className="w-full truncate text-center text-xs text-hub-muted">{day.date.slice(5)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5">
              <EmptyState title="No analytics snapshot" body="Run Update data from the dashboard after Forgeko analytics and Supabase are configured." />
            </div>
          )}
        </section>
        <section className="hub-panel p-4">
          <h2 className="text-base font-semibold text-hub-ink">Explanation</h2>
          <p className="mt-4 text-sm leading-6 text-hub-muted">{analytics.aiExplanation}</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <SignalList label="Referrers" rows={analytics.topReferrers.map((row) => [row.source, row.visitors])} />
            <SignalList label="Top Pages" rows={analytics.topPages.map((row) => [row.path, row.visitors])} />
            <SignalList label="Top Clicks" rows={analytics.topClicks.map((row) => [row.href ? `${row.label} (${row.href})` : row.label, row.clicks])} />
            <SignalList label="Waitlist Sources" rows={analytics.waitlistSources.map((row) => [row.source, row.signups])} />
            <SignalList label="First-party Events" rows={analytics.pageEvents.map((row) => [row.eventType, row.count])} />
          </div>
        </section>
      </div>
    </>
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
