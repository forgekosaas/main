import Image from "next/image";

import { SectionShell } from "@/components/SectionShell";

const checkpoints = [
  {
    title: "Positioning before production",
    body: "A launch should begin with the customer problem, the alternative the buyer uses today, the reason the offer is different, and the proof a visitor needs before leaving an email. Forgeko turns those inputs into a working launch brief instead of treating copy, product scope, and analytics as separate jobs."
  },
  {
    title: "A landing page that carries the product logic",
    body: "The page should explain the promise, expose the painful workflow, show how the product removes friction, and guide the visitor toward one action. That structure matters because early SaaS traffic is usually limited; every section has to reduce doubt and make the next step obvious."
  },
  {
    title: "Operational setup without losing the strategy",
    body: "Domain, SSL, payments, consent, event tracking, waitlist emails, and launch metrics all need the same context. When those steps are handled after the page is written, the founder often re-decides positioning in five dashboards. Forgeko keeps the launch system connected."
  },
  {
    title: "A feedback loop after the first visitors arrive",
    body: "The first version is not the final business. Forgeko is designed to compare the promise against actual behavior: what visitors click, where they hesitate, which signup sources convert, and which assumptions should change before more product work is added."
  }
];

export function LaunchDepth() {
  return (
    <SectionShell id="launch-depth" className="border-t border-forgeko-border">
      <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-neutral-500">Launch depth</p>
          <h2 className="mt-5 text-3xl font-semibold leading-tight text-forgeko-text sm:text-4xl">
            AI agents for SaaS launch decisions.
          </h2>
          <div className="mt-8 space-y-5 text-lg leading-8 text-neutral-300">
            <p>
              A serious SaaS launch is a sequence of decisions, not a single page generator. The founder has to decide who the product is for, which pain is urgent enough to act on, what promise belongs above the fold, which features should wait, and what evidence would make a visitor trust the offer.
            </p>
            <p>
              Forgeko treats those decisions as durable project context. The system is AI powered, but the goal is not to replace judgment with generic output. The goal is to keep the reasoning behind each approved decision available when the landing page, product roadmap, payment flow, and analytics setup are created.
            </p>
            <p>
              That matters because most solo founders do not lose momentum at one obvious point. They lose it in small restarts: rewriting the offer after a design pass, changing the target user after setup, or promoting the project on social media before the message is clear enough to convert.
            </p>
          </div>
        </div>
        <figure className="overflow-hidden border border-forgeko-border bg-black">
          <Image
            src="/icon-512.png"
            alt="Forgeko launch system mark"
            width={512}
            height={512}
            className="h-auto w-full"
            sizes="(min-width: 1024px) 38vw, 100vw"
          />
        </figure>
      </div>
      <div className="mt-14 space-y-7">
        {checkpoints.map((checkpoint) => (
          <article key={checkpoint.title} className="border-t border-forgeko-border pt-7">
            <h3 className="text-xl font-semibold text-forgeko-text">{checkpoint.title}</h3>
            <p className="mt-3 text-base leading-7 text-neutral-400">{checkpoint.body}</p>
          </article>
        ))}
      </div>
      <div className="mt-12 space-y-5 border-t border-forgeko-border pt-8 text-lg leading-8 text-neutral-300">
        <p>
          The practical value is continuity. A validation note can become a landing-page section. A rejected audience can stay out of future prompts. A pricing assumption can be revisited when conversion data arrives. Instead of asking the founder to remember every tradeoff, Forgeko records the approved path and uses it to make the next step sharper.
        </p>
        <p>
          This is why the product is framed as an operating system rather than a collection of templates. Templates help with one artifact. Forgeko is built around the full launch loop: decide, build, publish, measure, learn, and adjust without losing the context that made the project coherent in the first place.
        </p>
      </div>
    </SectionShell>
  );
}
