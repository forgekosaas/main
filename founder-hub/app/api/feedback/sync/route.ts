import { NextResponse } from "next/server";

import { syncGmailFeedback } from "@/jobs/sync-feedback";
import { publicErrorMessage } from "@/lib/api-errors";
import { getFounderHubEnv } from "@/lib/env";
import { flowLog, publicFlowError } from "@/lib/flow-log";

export const dynamic = "force-dynamic";

export async function POST() {
  flowLog({ route: "/api/feedback/sync", step: "start", source: "gmail", status: "start" });
  try {
    const result = await syncGmailFeedback(getFounderHubEnv());
    flowLog({
      route: "/api/feedback/sync",
      step: "complete",
      source: "gmail",
      status: result.configured ? "ok" : "skipped",
      counts: { emails: result.emails.length }
    });
    return NextResponse.json(result, { status: result.configured ? 200 : 409 });
  } catch (error) {
    flowLog({ route: "/api/feedback/sync", step: "error", source: "gmail", status: "error", detail: publicFlowError(error) });
    return NextResponse.json({ error: publicErrorMessage(error) }, { status: 500 });
  }
}
