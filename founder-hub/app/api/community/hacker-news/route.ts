import { NextResponse } from "next/server";

import { syncHackerNewsCommunity } from "@/jobs/sync-hacker-news";
import { publicErrorMessage } from "@/lib/api-errors";
import { getFounderHubEnv } from "@/lib/env";
import { flowLog, publicFlowError } from "@/lib/flow-log";

export const dynamic = "force-dynamic";

export async function POST() {
  flowLog({ route: "/api/community/hacker-news", step: "start", source: "hacker-news", status: "start" });
  try {
    const result = await syncHackerNewsCommunity(getFounderHubEnv());
    flowLog({
      route: "/api/community/hacker-news",
      step: "complete",
      source: "hacker-news",
      status: "ok",
      counts: { items: result.items.length, persisted: result.persisted, cached: result.cached }
    });
    return NextResponse.json(result);
  } catch (error) {
    flowLog({
      route: "/api/community/hacker-news",
      step: "error",
      source: "hacker-news",
      status: "error",
      detail: publicFlowError(error)
    });
    return NextResponse.json({ error: publicErrorMessage(error) }, { status: 500 });
  }
}
