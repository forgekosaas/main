const faqs = [
  {
    question: "What is Forgeko?",
    answer:
      "Forgeko is an AI-guided operating system for solo SaaS builders. It helps move a project from idea validation to landing, payments, growth analytics, and Project Memory in one environment."
  },
  {
    question: "How is Forgeko different from code generators?",
    answer:
      "Code generators give you a starting point. Forgeko gives you a system that keeps the business context, approved decisions, project history, and growth data available after the first deploy."
  },
  {
    question: "What is Project Memory?",
    answer:
      "Project Memory is Forgeko's persistent context layer. It stores decisions, approvals, documents, snapshots, and project history so the AI and the builder do not restart from a blank slate every session."
  },
  {
    question: "How much does Forgeko cost?",
    answer:
      "Forgeko is in private development. The waitlist is free. Planned paid tiers will be shared before private beta access opens."
  },
  {
    question: "Who is Forgeko for?",
    answer:
      "Forgeko is built first for solo developers, PMs, designers, and tech-adjacent builders who want to launch a SaaS without coordinating validation, landing pages, payments, compliance preparation, and analytics across separate tools."
  }
];

export function FAQ() {
  return (
    <section className="mx-auto w-full max-w-copy px-5 pb-20 sm:px-6 sm:pb-28" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-2xl font-semibold text-forgeko-text">
        FAQ
      </h2>
      <div className="mt-6 divide-y divide-forgeko-border border-y border-forgeko-border">
        {faqs.map((faq, index) => (
          <details key={faq.question} className="group py-5" open={index === 0}>
            <summary className="focus-ring cursor-pointer list-none text-base font-medium text-forgeko-text">
              <span className="inline-flex w-full items-center justify-between gap-4">
                {faq.question}
                <span className="font-mono text-neutral-500 group-open:hidden">+</span>
                <span className="hidden font-mono text-neutral-500 group-open:inline">−</span>
              </span>
            </summary>
            <p className="mt-4 text-sm leading-7 text-neutral-400">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
