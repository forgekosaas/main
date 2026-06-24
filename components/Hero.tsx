import { HeroSignalField } from "@/components/HeroSignalField";
import { TrackedLink } from "@/components/TrackedLink";

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden px-5 pb-16 pt-24 sm:px-6 sm:pb-24 sm:pt-32">
      <HeroSignalField />
      <div className="relative mx-auto max-w-copy">
        <h1 className="max-w-3xl text-balance text-5xl font-semibold leading-[0.98] tracking-normal text-forgeko-text sm:text-7xl">
          Launch your SaaS with full context.
        </h1>
        <p className="mt-8 text-xl leading-9 text-neutral-300 sm:text-2xl sm:leading-10">
          Forgeko turns your SaaS idea into a running business — validation, landing, payments, growth analytics. AI-guided, fully yours, and it never forgets where you left off.
        </p>
        <div className="mt-10">
          <TrackedLink
            href="#waitlist"
            eventType="CTA_Hero_Click"
            source="hero"
            className="group min-h-12 border border-forgeko-border/80 bg-white/[0.03] px-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_48px_rgba(0,0,0,0.24)] hover:border-forgeko-accent/70 hover:bg-forgeko-accent/10"
          >
            Sounds like what you&apos;ve been looking for? Join the waitlist — takes 10 seconds.
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}
