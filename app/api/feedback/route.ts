import { NextResponse } from "next/server";

import { sendFeedbackEmail } from "@/lib/email";
import { submitFeedback } from "@/lib/feedback";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    email?: string;
    message?: string;
    source?: string;
  };

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
    case "FEEDBACK_SENT":
      return "Thanks. Your message has been sent.";
    default:
      return "Something went wrong. Please try again.";
  }
}
