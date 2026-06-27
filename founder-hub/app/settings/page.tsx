import { GmailDiagnosticPanel } from "@/components/GmailDiagnosticPanel";
import { PageHeader } from "@/components/PageHeader";
import { getFounderHubEnv, getPublicSettingsStatus } from "@/lib/env";
import { defaultFounderHubSettings } from "@/settings/defaults";

export default function SettingsPage() {
  const status = getPublicSettingsStatus(getFounderHubEnv());
  const rows = Object.entries(status);

  return (
    <>
      <PageHeader title="Settings" description="Local configuration status without secret values." />
      <div className="grid gap-4 lg:grid-cols-[1fr_0.85fr]">
        <section className="hub-panel p-4">
          <h2 className="text-base font-semibold text-hub-ink">Services</h2>
          <div className="mt-4 divide-y divide-hub-line rounded-md border border-hub-line bg-[#FBFAF7]">
            {rows.map(([key, value]) => (
              <div key={key} className="grid gap-2 px-3 py-3 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="font-medium text-hub-ink">{value.label}</p>
                  <p className="mt-1 text-sm text-hub-muted">
                    {value.configured ? "Configured" : `Missing: ${value.missing.join(", ")}`}
                  </p>
                </div>
                <span
                  className={`rounded-md px-3 py-1 text-sm font-semibold ${
                    value.configured ? "bg-[#E6F0EB] text-hub-accent" : "bg-[#F8E8D4] text-hub-amber"
                  }`}
                >
                  {value.configured ? "Ready" : "Local"}
                </span>
              </div>
            ))}
          </div>
        </section>
        <section className="hub-panel p-4">
          <h2 className="text-base font-semibold text-hub-ink">Defaults</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <SettingRow label="Subreddits" value={defaultFounderHubSettings.subreddits.map((item) => `r/${item}`).join(", ")} />
            <SettingRow label="Subreddit limit" value={String(defaultFounderHubSettings.subredditLimit)} />
            <SettingRow label="Hacker News query" value={defaultFounderHubSettings.hackerNewsQuery} />
            <SettingRow label="Gmail query" value={defaultFounderHubSettings.gmailQuery} />
            <SettingRow label="Analytics period" value={defaultFounderHubSettings.analyticsPeriod} />
          </dl>
        </section>
      </div>
      <div className="mt-4">
        <GmailDiagnosticPanel />
      </div>
    </>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-hub-line bg-[#FBFAF7] p-3">
      <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-hub-muted">{label}</dt>
      <dd className="mt-2 break-words text-hub-ink">{value}</dd>
    </div>
  );
}
