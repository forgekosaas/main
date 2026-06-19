import { SectionShell } from "@/components/SectionShell";

const differentiators = [
  {
    title: "Code generators give you a starting point.",
    body: "Forgeko gives you a system. The difference shows up 3 months in, not 3 hours in."
  },
  {
    title: "Most AI tools have no memory.",
    body: "Every session starts from a blank slate. Forgeko accumulates context — your decisions, your approvals, your project history — and carries it forward indefinitely."
  },
  {
    title: "Shipping code is one step.",
    body: "Validation, payments, compliance, growth — those come after. Forgeko is built for after."
  }
];

export function Differentiators() {
  return (
    <SectionShell>
      <h2 className="text-3xl font-semibold leading-tight text-forgeko-text sm:text-4xl">
        There are great tools for generating code fast.
        <br />
        Forgeko is not one of them.
      </h2>
      <div className="mt-12 grid gap-8">
        {differentiators.map((item) => (
          <article key={item.title} className="border-t border-forgeko-border pt-7">
            <h3 className="text-xl font-semibold text-forgeko-text">{item.title}</h3>
            <p className="mt-3 text-base leading-7 text-neutral-400">{item.body}</p>
          </article>
        ))}
      </div>
      <p className="mt-12 text-lg leading-8 text-neutral-300">
        If you need a quick prototype, use whatever works.
        <br />
        If you&apos;re building something you intend to grow — Forgeko is where that project lives.
      </p>
    </SectionShell>
  );
}
