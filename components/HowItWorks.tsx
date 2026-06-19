"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

import { trackEvent } from "@/lib/analytics-client";

const steps = [
  {
    title: "Validate",
    body: "You describe your idea. Forgeko stress-tests it — market, competitors, positioning. You end up with a strategic canvas, not just a hype doc."
  },
  {
    title: "Build",
    body: "Landing page, brand identity, core features — generated from your canvas, not from a blank prompt. Every component is yours to edit, approve, or reject."
  },
  {
    title: "Ship",
    body: "Payments, domain, SSL — connected and configured inside Forgeko. No jumping between dashboards. No manual DNS nightmares."
  },
  {
    title: "Grow",
    body: "Weekly growth reports, conversion data, optimization suggestions — all generated from your project's actual history. Forgeko remembers what you built and why."
  }
];

export function HowItWorks() {
  const reduceMotion = useReducedMotion();
  const tracked = useRef(false);

  useEffect(() => {
    const element = document.getElementById("how-it-works");
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !tracked.current) {
          tracked.current = true;
          trackEvent("Scroll_HowItWorks");
        }
      },
      { threshold: 0.45 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="overflow-hidden border-y border-forgeko-border bg-black/20 px-5 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-copy">
          <h2 className="text-3xl font-semibold leading-tight text-forgeko-text sm:text-4xl">
            You start with an idea. Forgeko walks you through the rest.
          </h2>
        </div>
        <div className="relative mt-16">
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-forgeko-border md:block" />
          <motion.div
            className="absolute left-0 top-8 hidden h-px bg-forgeko-accent md:block"
            initial={{ width: "0%" }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true, amount: 0.55 }}
            transition={{ duration: reduceMotion ? 0 : 1.4, ease: "easeOut" }}
          />
          <div className="grid gap-8 md:grid-cols-4">
            {steps.map((step, index) => (
              <motion.article
                key={step.title}
                className="relative border border-forgeko-border bg-forgeko-bg p-6"
                initial={{ opacity: 1, y: reduceMotion ? 0 : 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: reduceMotion ? 0 : index * 0.16, duration: 0.45 }}
              >
                <div className="flex h-16 w-16 items-center justify-center border border-forgeko-accent bg-forgeko-bg font-mono text-sm text-forgeko-text shadow-glow">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-8 text-xl font-semibold text-forgeko-text">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-neutral-400">{step.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
        <p className="mx-auto mt-12 max-w-copy text-lg leading-8 text-neutral-300">
          At every step, your decisions are saved.
          <br />
          That&apos;s your Project Memory — the context no other tool carries forward.
        </p>
      </div>
    </section>
  );
}
