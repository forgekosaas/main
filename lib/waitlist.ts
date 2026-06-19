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
  upsertWaitlist: (row: WaitlistInsert) => Promise<{ duplicate: boolean }>;
  sendConfirmationEmail: (message: { email: string; confirmUrl: string }) => Promise<{ id?: string }>;
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

    if (upsertResult.duplicate) {
      return { ok: true, status: 200, code: "ALREADY_JOINED" };
    }

    const confirmUrl = new URL("/api/waitlist/confirm", deps.siteUrl);
    confirmUrl.searchParams.set("token", token);

    await deps.sendConfirmationEmail({
      email: parsed.data.email,
      confirmUrl: confirmUrl.toString()
    });

    return { ok: true, status: 201, code: "CREATED" };
  } catch {
    return { ok: false, status: 500, code: "WAITLIST_ERROR" };
  }
}
