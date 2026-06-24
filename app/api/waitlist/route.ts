import { NextResponse } from "next/server";

import { getSiteUrl } from "@/lib/env";
import { sendConfirmationEmail } from "@/lib/email";
import { recordConfirmationEmailSent, upsertWaitlist } from "@/lib/waitlist-repository";
import { submitWaitlistSignup } from "@/lib/waitlist";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    email?: string;
    consentMarketing?: boolean;
    source?: "hero" | "solution" | "cta_final";
  };

  const result = await submitWaitlistSignup({
    input: {
      email: body.email ?? "",
      consentMarketing: body.consentMarketing === true,
      source: body.source ?? "cta_final"
    },
    requestMeta: {
      userAgent: request.headers.get("user-agent"),
      country: request.headers.get("cf-ipcountry"),
      metadata: {
        referer: request.headers.get("referer")
      }
    },
    deps: {
      siteUrl: getSiteUrl(),
      upsertWaitlist,
      sendConfirmationEmail,
      recordConfirmationEmailSent
    }
  });

  const message = messageForCode(result.code);
  return NextResponse.json({ code: result.code, message }, { status: result.status });
}

function messageForCode(code: string) {
  switch (code) {
    case "INVALID_EMAIL":
      return "Enter a valid email address.";
    case "CONSENT_REQUIRED":
      return "Confirm that you agree to receive Forgeko waitlist updates.";
    case "ALREADY_JOINED":
      return "You're already on the Forgeko waitlist.";
    case "CREATED":
      return "Check your inbox to confirm your email.";
    default:
      return "Something went wrong. Please try again.";
  }
}
