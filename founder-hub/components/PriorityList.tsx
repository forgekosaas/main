export function PriorityList({ priorities }: { priorities: string[] }) {
  return (
    <section className="hub-panel p-4">
      <h2 className="text-base font-semibold text-hub-ink">Today</h2>
      <div className="mt-4 space-y-3">
        {priorities.map((priority, index) => (
          <div key={priority} className="flex gap-3 rounded-md border border-hub-line bg-[#FBFAF7] p-3">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-hub-accent text-sm font-semibold text-white">
              {index + 1}
            </span>
            <p className="text-sm leading-6 text-hub-ink">{priority}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
