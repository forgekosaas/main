import { CommunityItemCard } from "@/components/CommunityItemCard";
import { DataFlowPanel } from "@/components/DataFlowPanel";
import { DataSyncPanel } from "@/components/DataSyncPanel";
import { EmptyState } from "@/components/EmptyState";
import { MetricTile } from "@/components/MetricTile";
import { PageHeader } from "@/components/PageHeader";
import { PriorityList } from "@/components/PriorityList";
import { buildDailyBrief } from "@/jobs/daily-brief";
import { actionableFeedbackCount, reliableWaitlistCount } from "@/lib/signal-cleaning";
import { getCurrentFounderHubSnapshot } from "@/lib/snapshot";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const snapshot = await getCurrentFounderHubSnapshot();
  const brief = buildDailyBrief(snapshot);
  const topCommunity = snapshot.communityItems.find((item) => item.source !== "hacker-news") ?? snapshot.communityItems[0];
  const gmailWaitlist = reliableWaitlistCount(snapshot);
  const feedbackCount = actionableFeedbackCount(snapshot);
  const replyLeads = snapshot.communityItems.filter((item) => item.source !== "hacker-news" && item.relevanceScore >= 65).length;

  return (
    <>
      <PageHeader title="Dashboard" description="Decision list for the current local Founder Hub snapshot." />
      <div className="grid gap-4 md:grid-cols-4">
        <MetricTile label="Visitors" note="Forgeko, 7 days" tone="blue" value={String(snapshot.analytics.visitors)} />
        <MetricTile label="Waitlist" note="Gmail signals" tone="green" value={String(gmailWaitlist)} />
        <MetricTile
          label="Feedback"
          note="Gmail messages"
          tone="amber"
          value={String(feedbackCount)}
        />
        <MetricTile label="Reply Leads" note="Reddit/X/IH" value={String(replyLeads)} />
      </div>
      <div className="mt-4">
        <DataSyncPanel />
      </div>
      <div className="mt-4">
        <DataFlowPanel />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.15fr]">
        <PriorityList priorities={brief.priorities} />
        <section className="hub-panel p-4">
          <h2 className="text-base font-semibold text-hub-ink">Daily Brief</h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-hub-muted">
            <p>{brief.recommendedPost}</p>
            <p>{brief.landingAnalysis}</p>
            <p>{brief.feedbackAnalysis}</p>
            <p>{brief.weeklyTrend}</p>
          </div>
        </section>
      </div>
      <div className="mt-4">
        {topCommunity ? (
          <CommunityItemCard item={topCommunity} />
        ) : (
          <EmptyState
            title="No community signals yet"
            body="Add a manual Reddit, X, or Indie Hackers item before using suggested replies."
          />
        )}
      </div>
    </>
  );
}
