"use client";

import { ArrowRight, Check, Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";

import { trackEvent } from "@/lib/analytics-client";

type FormState = "idle" | "submitting" | "success" | "duplicate" | "error";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");
    trackEvent("Waitlist_Submit", { source: "cta_final" });

    const response = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        consentMarketing,
        source: "cta_final"
      })
    });

    const body = (await response.json().catch(() => null)) as { code?: string; message?: string } | null;

    if (response.ok && body?.code === "ALREADY_JOINED") {
      setState("duplicate");
      setMessage("You're already on the list. If you have not confirmed yet, check your inbox.");
      return;
    }

    if (response.ok) {
      setState("success");
      setMessage("Check your inbox to confirm your email.");
      return;
    }

    setState("error");
    setMessage(body?.message ?? "Something went wrong. Please try again.");
  }

  return (
    <form className="mt-10" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="waitlist-email">
          Your email
        </label>
        <input
          id="waitlist-email"
          type="email"
          value={email}
          required
          autoComplete="email"
          placeholder="Your email"
          className="focus-ring min-h-12 flex-1 border border-forgeko-border bg-black px-4 text-base text-forgeko-text placeholder:text-neutral-600"
          onChange={(event) => setEmail(event.target.value)}
          onFocus={() => trackEvent("Waitlist_FormFocus", { source: "cta_final" })}
        />
        <button
          type="submit"
          disabled={state === "submitting"}
          className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 bg-forgeko-accent px-5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {state === "submitting" ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
          Join waitlist
          {state !== "submitting" ? <ArrowRight aria-hidden="true" className="h-4 w-4" /> : null}
        </button>
      </div>
      <label className="mt-5 flex gap-3 text-sm leading-6 text-neutral-400">
        <input
          type="checkbox"
          required
          checked={consentMarketing}
          onChange={(event) => setConsentMarketing(event.target.checked)}
          className="mt-1 h-4 w-4 border-forgeko-border bg-black accent-forgeko-accent"
        />
        <span>
          I agree to receive Forgeko waitlist and product update emails. I can unsubscribe at any time. See the{" "}
          <a className="text-forgeko-text underline underline-offset-4" href="/privacy">
            Privacy Policy
          </a>
          .
        </span>
      </label>
      {message ? (
        <p
          className={`mt-5 flex items-start gap-2 text-sm leading-6 ${state === "error" ? "text-red-300" : "text-neutral-300"}`}
          role={state === "error" ? "alert" : "status"}
        >
          {state === "success" || state === "duplicate" ? <Check aria-hidden="true" className="mt-0.5 h-4 w-4 text-forgeko-accent" /> : null}
          {message}
        </p>
      ) : null}
    </form>
  );
}
