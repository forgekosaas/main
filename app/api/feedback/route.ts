import { NextResponse } from "next/server";

import { sendFeedbackEmail } from "@/lib/email";
import { submitFeedback } from "@/lib/feedback";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { messageForTurnstileCode } from "@/lib/turnstile-messages";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    email?: string;
    message?: string;
    source?: string;
    turnstileToken?: string;
  };

  const turnstile = await verifyTurnstileToken({
    token: body.turnstileToken,
    secretKey: process.env.TURNSTILE_SECRET_KEY,
    remoteIp: request.headers.get("cf-connecting-ip")
  });

  if (!turnstile.ok) {
    return NextResponse.json({ code: turnstile.code, message: messageForCode(turnstile.code) }, { status: 400 });
  }

  const result = await submitFeedback({
    input: {
      email: body.email ?? "",
      message: body.message ?? "",
      source: body.source ?? "contact"
    },
    requestMeta: {
      userAgent: request.headers.get("user-agent"),
      country: request.headers.get("cf-ipcountry"),
      metadata: {
        referer: request.headers.get("referer")
      }
    },
    deps: { sendFeedbackEmail }
  });

  return NextResponse.json({ code: result.code, message: messageForCode(result.code) }, { status: result.status });
}

function messageForCode(code: string) {
  switch (code) {
    case "INVALID_FEEDBACK":
      return "Enter a valid email and a message of at least 20 characters.";
    case "TURNSTILE_REQUIRED":
    case "TURNSTILE_FAILED":
      return messageForTurnstileCode(code);
    case "FEEDBACK_SENT":
      return "Thanks. Your message has been sent.";
    default:
      return "Something went wrong. Please try again.";
  }
}
