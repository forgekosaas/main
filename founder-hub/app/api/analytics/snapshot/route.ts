import { NextResponse } from "next/server";

import { syncAnalyticsSnapshot } from "@/jobs/sync-analytics";
import { publicErrorMessage } from "@/lib/api-errors";
import { getFounderHubEnv } from "@/lib/env";
import { flowLog, publicFlowError } from "@/lib/flow-log";

export const dynamic = "force-dynamic";

export async function POST() {
  flowLog({ route: "/api/analytics/snapshot", step: "start", source: "forgeko_analytics", status: "start" });
  try {
    const result = await syncAnalyticsSnapshot(getFounderHubEnv());
    const persisted = "persisted" in result ? Boolean(result.persisted) : false;
    flowLog({
      route: "/api/analytics/snapshot",
      step: "complete",
      source: "forgeko_analytics",
      status: result.configured ? "ok" : "skipped",
      counts: { persisted, visitors: result.snapshot?.visitors ?? 0 }
    });
    return NextResponse.json(result, { status: result.configured ? 200 : 409 });
  } catch (error) {
    flowLog({ route: "/api/analytics/snapshot", step: "error", source: "forgeko_analytics", status: "error", detail: publicFlowError(error) });
    return NextResponse.json({ error: publicErrorMessage(error) }, { status: 500 });
  }
}
