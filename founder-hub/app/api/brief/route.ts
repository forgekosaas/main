import { NextResponse } from "next/server";

import { buildDailyBrief } from "@/jobs/daily-brief";
import { snapshotCounts } from "@/lib/data-flow";
import { getFounderHubEnv, getPublicSettingsStatus } from "@/lib/env";
import { flowLog } from "@/lib/flow-log";
import { getCurrentFounderHubSnapshot } from "@/lib/snapshot";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await getCurrentFounderHubSnapshot();
  flowLog({
    route: "/api/brief",
    step: "snapshot",
    source: "supabase",
    status: "ok",
    counts: snapshotCounts(snapshot)
  });
  return NextResponse.json({
    snapshot,
    brief: buildDailyBrief(snapshot),
    status: getPublicSettingsStatus(getFounderHubEnv())
  });
}
