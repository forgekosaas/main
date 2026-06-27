import { NextResponse } from "next/server";
import { z } from "zod";

import { createGeminiAnalysisClient } from "@/ai/client";
import { analyzeManualCommunityInput } from "@/ai/community-agent";
import { publicErrorMessage } from "@/lib/api-errors";
import { getFounderHubEnv } from "@/lib/env";
import { flowLog, publicFlowError } from "@/lib/flow-log";
import { createFounderHubSupabase, saveCommunityItem } from "@/services/supabase";

const schema = z.object({
  source: z.enum(["reddit", "x", "indie-hackers"]),
  title: z.string().trim().min(3).max(200),
  author: z.string().trim().max(100).optional(),
  url: z.string().trim().url(),
  content: z.string().trim().min(10).max(6000)
});

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid manual community item." }, { status: 400 });
  }

  try {
    flowLog({ route: "/api/community/manual", step: "start", source: parsed.data.source, status: "start" });
    const env = getFounderHubEnv();
    const client = env.geminiApiKey ? createGeminiAnalysisClient({ apiKey: env.geminiApiKey }) : undefined;
    const item = await analyzeManualCommunityInput(parsed.data, client);
    const persisted = await saveCommunityItem(createFounderHubSupabase(env), item);
    flowLog({
      route: "/api/community/manual",
      step: "complete",
      source: parsed.data.source,
      status: "ok",
      counts: { persisted: Boolean(persisted), relevanceScore: item.relevanceScore }
    });

    return NextResponse.json({ item, persisted });
  } catch (error) {
    flowLog({ route: "/api/community/manual", step: "error", source: parsed.data.source, status: "error", detail: publicFlowError(error) });
    return NextResponse.json({ error: publicErrorMessage(error) }, { status: 500 });
  }
}
