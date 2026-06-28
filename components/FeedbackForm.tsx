"use client";

import { Check, Loader2, Send } from "lucide-react";
import { FormEvent, useState } from "react";

import { trackEvent } from "@/lib/analytics-client";
import { messageForTurnstileCode } from "@/lib/turnstile-messages";
import { TurnstileField } from "@/components/TurnstileField";

type FormState = "idle" | "submitting" | "success" | "error";
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "0x4AAAAAADr5wNAH221DWy6b";

export function FeedbackForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0);
  const [state, setState] = useState<FormState>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  function resetTurnstileToken() {
    setTurnstileToken("");
    setTurnstileResetSignal((value) => value + 1);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setStatusMessage("");
    trackEvent("Feedback_Submit", { source: "contact" });

    if (turnstileSiteKey && !turnstileToken) {
      resetTurnstileToken();
      setState("error");
      setStatusMessage(messageForTurnstileCode("TURNSTILE_REQUIRED"));
      return;
    }

    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        message,
        source: "contact",
        turnstileToken
      })
    });

    const body = (await response.json().catch(() => null)) as { message?: string } | null;

    if (response.ok) {
      resetTurnstileToken();
      setState("success");
      setEmail("");
      setMessage("");
      setStatusMessage("Message sent. We'll read it directly.");
      return;
    }

    resetTurnstileToken();
    setState("error");
    setStatusMessage(body?.message ?? "Something went wrong. Please try again.");
  }

  return (
    <form className="mt-10" onSubmit={handleSubmit}>
      <div className="grid gap-3">
        <label className="sr-only" htmlFor="feedback-email">
          Your email
        </label>
        <input
          id="feedback-email"
          type="email"
          value={email}
          required
          autoComplete="email"
          placeholder="Your email"
          className="focus-ring min-h-12 border border-forgeko-border bg-black/70 px-4 text-base text-forgeko-text transition placeholder:text-neutral-600 hover:border-neutral-700 focus:border-forgeko-accent/70"
          onChange={(event) => setEmail(event.target.value)}
          onFocus={() => trackEvent("Feedback_FormFocus", { source: "contact" })}
        />
        <label className="sr-only" htmlFor="feedback-message">
          Your message
        </label>
        <textarea
          id="feedback-message"
          value={message}
          required
          minLength={20}
          maxLength={4000}
          rows={5}
          placeholder="Tell us what you think, what you need, or what you want to ask."
          className="focus-ring min-h-36 resize-y border border-forgeko-border bg-black/70 px-4 py-3 text-base leading-7 text-forgeko-text transition placeholder:text-neutral-600 hover:border-neutral-700 focus:border-forgeko-accent/70"
          onChange={(event) => setMessage(event.target.value)}
          onFocus={() => trackEvent("Feedback_FormFocus", { source: "contact" })}
        />
      </div>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-neutral-500">Replies go through the email you provide.</p>
        <button
          type="submit"
          disabled={state === "submitting"}
          className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 border border-forgeko-border bg-white/[0.03] px-5 text-sm font-semibold text-forgeko-text transition hover:border-forgeko-accent/70 hover:bg-forgeko-accent/10 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {state === "submitting" ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Send aria-hidden="true" className="h-4 w-4" />}
          Send feedback
        </button>
      </div>
      <TurnstileField siteKey={turnstileSiteKey} onToken={setTurnstileToken} resetSignal={turnstileResetSignal} className="mt-5" />
      {statusMessage ? (
        <p
          className={`mt-5 flex items-start gap-2 text-sm leading-6 ${state === "error" ? "text-red-300" : "text-neutral-300"}`}
          role={state === "error" ? "alert" : "status"}
        >
          {state === "success" ? <Check aria-hidden="true" className="mt-0.5 h-4 w-4 text-forgeko-accent" /> : null}
          {statusMessage}
        </p>
      ) : null}
    </form>
  );
}
