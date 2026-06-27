import { NextResponse } from "next/server";

import { syncRedditCommunity } from "@/jobs/sync-community";
import { publicErrorMessage } from "@/lib/api-errors";
import { getFounderHubEnv } from "@/lib/env";
import { flowLog, publicFlowError } from "@/lib/flow-log";

export const dynamic = "force-dynamic";

export async function POST() {
  flowLog({ route: "/api/community/fetch", step: "start", source: "reddit", status: "start" });
  try {
    const result = await syncRedditCommunity(getFounderHubEnv());
    flowLog({
      route: "/api/community/fetch",
      step: "complete",
      source: "reddit",
      status: result.configured ? "ok" : "skipped",
      counts: { items: result.items.length }
    });
    return NextResponse.json(result, { status: result.configured ? 200 : 409 });
  } catch (error) {
    flowLog({ route: "/api/community/fetch", step: "error", source: "reddit", status: "error", detail: publicFlowError(error) });
    return NextResponse.json({ error: publicErrorMessage(error) }, { status: 500 });
  }
}
