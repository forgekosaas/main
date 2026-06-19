import { TrackedLink } from "@/components/TrackedLink";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-5 pb-16 pt-24 sm:px-6 sm:pb-24 sm:pt-32">
      <div className="pointer-events-none absolute inset-x-0 top-16 mx-auto h-64 max-w-4xl border border-forgeko-border/50 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="pointer-events-none absolute left-1/2 top-28 hidden w-[40rem] -translate-x-1/2 grid-cols-8 gap-3 opacity-30 sm:grid">
        {Array.from({ length: 32 }).map((_, index) => (
          <span
            key={index}
            className={`h-2 border border-forgeko-border ${index % 7 === 0 ? "bg-forgeko-accent/60 shadow-glow" : "bg-white/[0.03]"}`}
          />
        ))}
      </div>
      <div className="relative mx-auto max-w-copy">
        <h1 className="max-w-3xl text-5xl font-semibold leading-[0.98] tracking-normal text-forgeko-text sm:text-7xl">
          Stop building. Start launching.
        </h1>
        <p className="mt-8 text-xl leading-9 text-neutral-300 sm:text-2xl sm:leading-10">
          Forgeko turns your SaaS idea into a running business — validation, landing, payments, growth analytics. AI-guided, fully yours, and it never forgets where you left off.
        </p>
        <div className="mt-10">
          <TrackedLink href="#waitlist" eventType="CTA_Hero_Click" source="hero">
            Sounds like what you&apos;ve been looking for? Join the waitlist — takes 10 seconds.
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}
