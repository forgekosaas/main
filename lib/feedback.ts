import { z } from "zod";

import type { RequestMeta } from "@/lib/waitlist";

const feedbackSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  message: z.string().trim().min(20).max(4000),
  source: z.string().trim().min(1).max(64).default("contact")
});

export type FeedbackInput = z.input<typeof feedbackSchema>;

export interface FeedbackDeps {
  sendFeedbackEmail: (message: {
    email: string;
    message: string;
    source: string;
    country: string | null;
    userAgent: string | null;
  }) => Promise<{ id?: string }>;
}

export type FeedbackResult =
  | { ok: true; status: 202; code: "FEEDBACK_SENT" }
  | { ok: false; status: 400; code: "INVALID_FEEDBACK" }
  | { ok: false; status: 500; code: "FEEDBACK_ERROR" };

export async function submitFeedback({
  input,
  requestMeta,
  deps
}: {
  input: FeedbackInput;
  requestMeta: RequestMeta;
  deps: FeedbackDeps;
}): Promise<FeedbackResult> {
  const parsed = feedbackSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, status: 400, code: "INVALID_FEEDBACK" };
  }

  try {
    await deps.sendFeedbackEmail({
      email: parsed.data.email,
      message: parsed.data.message,
      source: parsed.data.source,
      country: requestMeta.country ?? null,
      userAgent: requestMeta.userAgent ?? null
    });

    return { ok: true, status: 202, code: "FEEDBACK_SENT" };
  } catch (error) {
    console.error("Feedback submission failed", error);
    return { ok: false, status: 500, code: "FEEDBACK_ERROR" };
  }
}
