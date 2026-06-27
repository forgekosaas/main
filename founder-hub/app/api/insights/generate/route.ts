import { NextResponse } from "next/server";

import { createGeminiAnalysisClient } from "@/ai/client";
import { generateInsights } from "@/ai/insight-agent";
import { publicErrorMessage } from "@/lib/api-errors";
import { snapshotCounts } from "@/lib/data-flow";
import { getFounderHubEnv } from "@/lib/env";
import { flowLog, publicFlowError } from "@/lib/flow-log";
import { getFounderHubSnapshot } from "@/lib/snapshot";
import { createFounderHubSupabase, saveInsights } from "@/services/supabase";

export const dynamic = "force-dynamic";

export async function POST() {
  flowLog({ route: "/api/insights/generate", step: "start", source: "gemini", status: "start" });
  try {
    const env = getFounderHubEnv();
    const client = env.geminiApiKey ? createGeminiAnalysisClient({ apiKey: env.geminiApiKey }) : undefined;
    const db = createFounderHubSupabase(env);
    const snapshot = await getFounderHubSnapshot(db);
    flowLog({
      route: "/api/insights/generate",
      step: "snapshot",
      source: "supabase",
      status: "ok",
      counts: snapshotCounts(snapshot)
    });
    const insights = await generateInsights(snapshot, client);
    const persisted = await saveInsights(db, insights);
    flowLog({
      route: "/api/insights/generate",
      step: "complete",
      source: client ? "gemini" : "local",
      status: "ok",
      counts: { insights: insights.length, persisted: Boolean(persisted) }
    });

    return NextResponse.json({ insights, persisted });
  } catch (error) {
    flowLog({ route: "/api/insights/generate", step: "error", source: "gemini", status: "error", detail: publicFlowError(error) });
    return NextResponse.json({ error: publicErrorMessage(error) }, { status: 500 });
  }
}
