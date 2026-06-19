import { WaitlistForm } from "@/components/WaitlistForm";

const earlyAccess = ["Direct line to the founding team", "Influence over the roadmap", "First seat when beta opens"];

export function CTAFinal() {
  return (
    <section id="waitlist" className="px-5 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-copy border border-forgeko-border bg-forgeko-section p-6 sm:p-10">
        <p className="text-lg leading-8 text-neutral-300">
          You&apos;ve read this far.
          <br />
          You probably recognize the problem.
        </p>
        <h2 className="mt-8 text-4xl font-semibold tracking-normal text-forgeko-text sm:text-5xl">Join the waitlist.</h2>
        <div className="mt-6 space-y-2 text-base leading-7 text-neutral-400">
          <p>Be among the first to access Forgeko when private beta opens.</p>
          <p>No spam. No pitch decks. Just updates when something real is ready.</p>
        </div>
        <WaitlistForm />
        <div className="mt-10 border-t border-forgeko-border pt-8">
          <h3 className="font-mono text-sm uppercase tracking-[0.18em] text-neutral-500">Early access members get</h3>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-neutral-300">
            {earlyAccess.map((item) => (
              <li key={item}>→ {item}</li>
            ))}
          </ul>
        </div>
        <p className="mt-10 text-base italic leading-7 text-neutral-300">
          We&apos;re building Forgeko because we needed it ourselves.
          <br />
          If you&apos;re building solo and tired of the coordination overhead — we&apos;ll see you inside.
        </p>
      </div>
    </section>
  );
}
