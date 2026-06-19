import { SectionShell } from "@/components/SectionShell";

export function Problem() {
  return (
    <SectionShell id="problem" className="copy-prose border-t border-forgeko-border">
      <h2 className="text-3xl font-semibold leading-tight text-forgeko-text sm:text-4xl">
        Building a SaaS solo is not a creativity problem.
        <br />
        It&apos;s a coordination problem.
      </h2>
      <div className="mt-10 space-y-5 text-lg leading-8 text-neutral-300">
        <p>You validate an idea in Notion. Build a landing in Bolt. Set up payments manually in Stripe. Figure out compliance yourself. Track growth in a spreadsheet.</p>
        <p>Five tools. No shared context. No memory of what you decided last week.</p>
        <p>Every time you start a new session — with an AI or with yourself — you&apos;re rebuilding context from scratch.</p>
        <p className="font-medium italic text-forgeko-text">That&apos;s the overhead that kills solo projects. Not the code.</p>
      </div>
    </SectionShell>
  );
}
