import { SectionShell } from "@/components/SectionShell";

const guidance = [
  {
    title: "Validate the SaaS idea before you build",
    body: "Forgeko starts with the strategic work solo founders usually skip: customer pain, market alternatives, competitor positioning, pricing assumptions, and the first offer. The result is a clearer SaaS direction before time goes into product screens or code."
  },
  {
    title: "Turn positioning into a launch-ready foundation",
    body: "A SaaS launch needs more than a landing page. Forgeko connects the offer, page structure, brand direction, product scope, payment setup, domain, SSL, and analytics plan so every decision supports the same business narrative."
  },
  {
    title: "Keep decisions, approvals, and project history in memory",
    body: "Most AI tools lose the thread between sessions. Forgeko keeps Project Memory: the reasoning behind your positioning, the features you approved, the launch assumptions you changed, and the growth signals that should shape the next iteration."
  },
  {
    title: "Use real launch data to improve the SaaS funnel",
    body: "After launch, Forgeko focuses on conversion and retention signals: waitlist intent, page events, acquisition quality, activation blockers, and weekly growth reports. The goal is not just to ship a SaaS product, but to keep improving the business system around it."
  }
];

export function SaaSOperatingSystem() {
  return (
    <SectionShell id="saas-operating-system" className="border-t border-forgeko-border">
      <div className="max-w-copy">
        <p className="font-mono text-sm uppercase tracking-[0.18em] text-neutral-500">SaaS launch system</p>
        <h2 className="mt-5 text-3xl font-semibold leading-tight text-forgeko-text sm:text-4xl">
          What a SaaS operating system does for a solo builder.
        </h2>
        <div className="mt-8 space-y-5 text-lg leading-8 text-neutral-300">
          <p>
            Solo SaaS builders rarely fail because they cannot generate another component or write another prompt. They get stuck because validation, positioning, product scope, payments, analytics, and launch decisions live in separate tools with no shared memory.
          </p>
          <p>
            Forgeko brings those steps into one workflow so each decision compounds. The same context that shapes the landing page also informs the product roadmap, onboarding plan, payment setup, and growth reporting.
          </p>
        </div>
      </div>
      <div className="mt-12 grid gap-7">
        {guidance.map((item) => (
          <article key={item.title} className="border-t border-forgeko-border pt-7">
            <h3 className="text-xl font-semibold text-forgeko-text">{item.title}</h3>
            <p className="mt-3 text-base leading-7 text-neutral-400">{item.body}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
