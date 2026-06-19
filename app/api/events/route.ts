import { NextResponse } from "next/server";

import { isAllowedEventType } from "@/lib/events";
import { insertPageEvent } from "@/lib/waitlist-repository";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    eventType?: string;
    sessionId?: string;
    metadata?: Record<string, unknown>;
  };

  if (!body.eventType || !isAllowedEventType(body.eventType)) {
    return NextResponse.json({ code: "INVALID_EVENT" }, { status: 400 });
  }

  await insertPageEvent({
    eventType: body.eventType,
    sessionId: body.sessionId,
    metadata: body.metadata
  }).catch(() => undefined);

  return NextResponse.json({ ok: true });
}
