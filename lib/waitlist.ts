import { z } from "zod";

import { createConfirmationToken, hashToken } from "@/lib/crypto";

export const waitlistSources = ["hero", "solution", "cta_final"] as const;
export type WaitlistSource = (typeof waitlistSources)[number];

const signupSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  consentMarketing: z.boolean().refine((value) => value === true),
  source: z.enum(waitlistSources).default("cta_final")
});

export type WaitlistSignupInput = z.input<typeof signupSchema>;

export interface RequestMeta {
  country?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown>;
}

export interface WaitlistInsert {
  email: string;
  source: WaitlistSource;
  country: string | null;
  user_agent: string | null;
  consent_marketing: boolean;
  confirmation_token_hash: string;
  confirmation_sent_at: string;
  metadata: Record<string, unknown>;
}

export interface WaitlistDeps {
  siteUrl: string;
  upsertWaitlist: (row: WaitlistInsert) => Promise<{ status: "created" | "pending_duplicate" | "confirmed_duplicate" }>;
  sendConfirmationEmail: (message: { email: string; confirmUrl: string }) => Promise<{ id?: string }>;
  sendNewWaitlistUserEmail?: (message: {
    email: string;
    source: WaitlistSource;
    country: string | null;
    userAgent: string | null;
  }) => Promise<{ id?: string }>;
  recordConfirmationEmailSent?: (email: string, messageId: string) => Promise<void>;
}

export type WaitlistResult =
  | { ok: true; status: 201; code: "CREATED" }
  | { ok: true; status: 200; code: "ALREADY_JOINED" }
  | { ok: false; status: 400; code: "INVALID_EMAIL" | "CONSENT_REQUIRED" }
  | { ok: false; status: 500; code: "WAITLIST_ERROR" };

export async function submitWaitlistSignup({
  input,
  requestMeta,
  deps
}: {
  input: WaitlistSignupInput;
  requestMeta: RequestMeta;
  deps: WaitlistDeps;
}): Promise<WaitlistResult> {
  const parsed = signupSchema.safeParse(input);

  if (!parsed.success) {
    const consentIssue = parsed.error.issues.some((issue) => issue.path.includes("consentMarketing"));
    return {
      ok: false,
      status: 400,
      code: consentIssue ? "CONSENT_REQUIRED" : "INVALID_EMAIL"
    };
  }

  try {
    const token = createConfirmationToken();
    const confirmationTokenHash = await hashToken(token);
    const now = new Date().toISOString();

    const upsertResult = await deps.upsertWaitlist({
      email: parsed.data.email,
      source: parsed.data.source,
      country: requestMeta.country ?? null,
      user_agent: requestMeta.userAgent ?? null,
      consent_marketing: true,
      confirmation_token_hash: confirmationTokenHash,
      confirmation_sent_at: now,
      metadata: requestMeta.metadata ?? {}
    });

    if (upsertResult.status === "confirmed_duplicate") {
      return { ok: true, status: 200, code: "ALREADY_JOINED" };
    }

    const confirmUrl = new URL("/api/waitlist/confirm", deps.siteUrl);
    confirmUrl.searchParams.set("token", token);

    const emailResult = await deps.sendConfirmationEmail({
      email: parsed.data.email,
      confirmUrl: confirmUrl.toString()
    });

    if (emailResult.id && deps.recordConfirmationEmailSent) {
      await deps.recordConfirmationEmailSent(parsed.data.email, emailResult.id).catch((error) => {
        console.error("Failed to record waitlist email provider id", error);
      });
    }

    if (upsertResult.status === "created" && deps.sendNewWaitlistUserEmail) {
      await deps
        .sendNewWaitlistUserEmail({
          email: parsed.data.email,
          source: parsed.data.source,
          country: requestMeta.country ?? null,
          userAgent: requestMeta.userAgent ?? null
        })
        .catch((error) => {
          console.error("Failed to send waitlist admin notification", error);
        });
    }

    return { ok: true, status: 201, code: "CREATED" };
  } catch (error) {
    console.error("Waitlist signup failed", error);
    return { ok: false, status: 500, code: "WAITLIST_ERROR" };
  }
}
