import { SectionHeading, SectionShell } from "@/components/SectionShell";
import { TrackedLink } from "@/components/TrackedLink";

const pillars = [
  {
    title: "From idea to launch, guided.",
    body: "Validation, landing page, payments, domain — each step builds on the previous one. No context switching, no setup from scratch."
  },
  {
    title: "AI that knows your project.",
    body: "Every decision you approve becomes part of your Project Memory. The AI doesn't start over every session — it picks up exactly where you left off."
  },
  {
    title: "Growth built in, not bolted on.",
    body: "Weekly reports, conversion analytics, and optimization suggestions — generated from your actual data, not generic advice."
  }
];

export function Solution() {
  return (
    <SectionShell id="solution">
      <SectionHeading>Forgeko is a single environment where your SaaS project lives from day one to traction.</SectionHeading>
      <div className="mt-8 space-y-4 text-lg leading-8 text-neutral-300">
        <p>Not a code generator. Not another no-code builder.</p>
        <p>A system that holds the full context of your project — and uses it at every step.</p>
      </div>
      <div className="mt-12 border-l border-forgeko-accent/70 pl-6">
        <h3 className="text-2xl font-semibold text-forgeko-text">One project. One place. Full context.</h3>
        <div className="mt-8 grid gap-6">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="border-t border-forgeko-border pt-6">
              <h4 className="text-lg font-semibold text-forgeko-text">→ {pillar.title}</h4>
              <p className="mt-3 text-base leading-7 text-neutral-400">{pillar.body}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="mt-10">
        <TrackedLink href="#waitlist" eventType="CTA_Solution_Click" source="solution">
          Sounds like what you&apos;ve been looking for?
        </TrackedLink>
      </div>
    </SectionShell>
  );
}
