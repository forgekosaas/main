"use client";

import { useEffect, useRef } from "react";

import { trackEvent } from "@/lib/analytics-client";

const bullets = [
  "Private beta — limited seats, real feedback, direct access to the team",
  "No lock-in — your code is always exportable, your data always yours",
  "Built in public — progress updates to everyone on the waitlist"
];

export function SocialProof() {
  const tracked = useRef(false);

  useEffect(() => {
    const element = document.getElementById("honest-proof");
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !tracked.current) {
          tracked.current = true;
          trackEvent("Scroll_SocialProof");
        }
      },
      { threshold: 0.45 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="honest-proof" className="bg-forgeko-section px-5 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-copy">
        <h2 className="text-3xl font-semibold leading-tight text-forgeko-text sm:text-4xl">
          Forgeko is in private development.
          <br />
          No fake testimonials. No vanity metrics.
        </h2>
        <p className="mt-8 text-lg leading-8 text-neutral-300">
          Just a small group of founders who got tired of the same coordination problems and decided to build the system they wished existed.
        </p>
        <div className="mt-12">
          <h3 className="font-mono text-sm uppercase tracking-[0.18em] text-neutral-500">What we&apos;re building toward</h3>
          <ul className="mt-6 space-y-4 text-base leading-7 text-neutral-300">
            {bullets.map((bullet) => (
              <li key={bullet} className="border-l border-forgeko-accent/70 pl-5">
                {bullet}
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-12 text-lg leading-8 text-neutral-300">
          We&apos;d rather ship something honest than market something perfect.
          <br />
          If that sounds like your kind of tool — you&apos;re in the right place.
        </p>
      </div>
    </section>
  );
}
