import { NextResponse } from "next/server";

import { snapshotCounts } from "@/lib/data-flow";
import { getFounderHubEnv, getPublicSettingsStatus } from "@/lib/env";
import { flowLog, getRecentFlowEvents } from "@/lib/flow-log";
import { getCurrentFounderHubSnapshot } from "@/lib/snapshot";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await getCurrentFounderHubSnapshot();
  const counts = snapshotCounts(snapshot);

  flowLog({
    route: "/api/debug/flow",
    step: "inspect",
    source: "local",
    status: "ok",
    counts
  });

  return NextResponse.json({
    status: getPublicSettingsStatus(getFounderHubEnv()),
    counts,
    events: getRecentFlowEvents()
  });
}
