import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { getCurrentFounderHubSnapshot } from "@/lib/snapshot";

export const dynamic = "force-dynamic";

export default async function FeedbackPage() {
  const { feedback } = await getCurrentFounderHubSnapshot();

  return (
    <>
      <PageHeader title="Feedback" description="Gmail read-only waitlist and feedback summaries." />
      <div className="grid gap-4">
        {feedback.length > 0 ? (
          feedback.map((email) => (
            <article key={email.id} className="hub-panel p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-hub-muted">{email.category}</p>
                  <h2 className="mt-2 text-lg font-semibold text-hub-ink">{email.subject}</h2>
                  <p className="mt-1 text-sm text-hub-muted">{email.from}</p>
                </div>
                <span className="rounded-md border border-hub-line bg-[#FBFAF7] px-3 py-1 text-sm font-semibold text-hub-accent">
                  {email.painPoint}
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-hub-muted">{email.summary}</p>
            </article>
          ))
        ) : (
          <EmptyState title="No Gmail feedback loaded" body="Run Gmail sync after OAuth is authorized; real messages matching the configured query will appear here." />
        )}
      </div>
    </>
  );
}
