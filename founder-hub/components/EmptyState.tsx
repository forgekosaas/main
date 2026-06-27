export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <section className="hub-panel p-4">
      <h2 className="text-base font-semibold text-hub-ink">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-hub-muted">{body}</p>
    </section>
  );
}
