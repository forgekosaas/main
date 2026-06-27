export function MetricTile({
  label,
  value,
  note,
  tone = "neutral"
}: {
  label: string;
  value: string;
  note: string;
  tone?: "neutral" | "green" | "amber" | "blue";
}) {
  const toneClass = {
    neutral: "text-hub-ink",
    green: "text-hub-accent",
    amber: "text-hub-amber",
    blue: "text-hub-blue"
  }[tone];

  return (
    <section className="hub-panel p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-hub-muted">{label}</p>
      <p className={`mt-3 text-3xl font-semibold tracking-normal ${toneClass}`}>{value}</p>
      <p className="mt-2 text-sm leading-5 text-hub-muted">{note}</p>
    </section>
  );
}
