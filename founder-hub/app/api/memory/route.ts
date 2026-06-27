import { NextResponse } from "next/server";
import { z } from "zod";

import { publicErrorMessage } from "@/lib/api-errors";
import { getFounderHubEnv } from "@/lib/env";
import { flowLog, publicFlowError } from "@/lib/flow-log";
import { createFounderHubSupabase, listMemoryEntries, saveMemoryEntry } from "@/services/supabase";

const schema = z.object({
  id: z.string().trim().min(1),
  date: z.string().trim().min(8),
  title: z.string().trim().min(3).max(200),
  motivation: z.string().trim().min(5).max(3000),
  sources: z.array(z.string().trim()).default([]),
  consequences: z.string().trim().min(3).max(3000)
});

export const dynamic = "force-dynamic";

export async function GET() {
  const env = getFounderHubEnv();
  const client = createFounderHubSupabase(env);
  const entries = client ? await listMemoryEntries(client) : [];
  flowLog({
    route: "/api/memory",
    step: "read",
    source: "supabase",
    status: client ? "ok" : "skipped",
    counts: { entries: entries.length }
  });
  return NextResponse.json({ entries, persisted: Boolean(client) });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid memory entry." }, { status: 400 });
  }

  try {
    flowLog({ route: "/api/memory", step: "start", source: "local", status: "start" });
    const env = getFounderHubEnv();
    const persisted = await saveMemoryEntry(createFounderHubSupabase(env), parsed.data);
    flowLog({
      route: "/api/memory",
      step: "complete",
      source: "supabase",
      status: "ok",
      counts: { persisted: Boolean(persisted) }
    });
    return NextResponse.json({ entry: parsed.data, persisted });
  } catch (error) {
    flowLog({ route: "/api/memory", step: "error", source: "supabase", status: "error", detail: publicFlowError(error) });
    return NextResponse.json({ error: publicErrorMessage(error) }, { status: 500 });
  }
}
