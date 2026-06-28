import { NextResponse } from "next/server";

import { publicErrorMessage } from "@/lib/api-errors";
import { snapshotCounts } from "@/lib/data-flow";
import { readLocalFounderHubSnapshot, writeLocalFounderHubSnapshot } from "@/services/local-cache";
import { regenerateVideoIdeasFromSnapshot } from "@/services/regenerate-ideas";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const current = await readLocalFounderHubSnapshot();
    const result = await regenerateVideoIdeasFromSnapshot(current);
    await writeLocalFounderHubSnapshot(result.snapshot);

    return NextResponse.json(
      {
        ok: result.step.status === "ok",
        steps: [result.step],
        counts: snapshotCounts(result.snapshot)
      },
      { status: result.step.status === "error" ? 500 : 200 }
    );
  } catch (error) {
    return NextResponse.json({ ok: false, error: publicErrorMessage(error) }, { status: 500 });
  }
}
