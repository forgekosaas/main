import { FeedbackForm } from "@/components/FeedbackForm";

export function ContactFeedback() {
  return (
    <section id="contact" className="px-5 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-copy border-t border-forgeko-border pt-12">
        <p className="font-mono text-sm uppercase tracking-[0.18em] text-neutral-500">Contact</p>
        <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-normal text-forgeko-text sm:text-4xl">
          Send feedback or ask a question.
        </h2>
        <p className="mt-6 text-lg leading-8 text-neutral-300">
          Your message goes straight to the Forgeko inbox. Useful feedback, beta questions, and sharp concerns are all welcome.
        </p>
        <FeedbackForm />
      </div>
    </section>
  );
}
