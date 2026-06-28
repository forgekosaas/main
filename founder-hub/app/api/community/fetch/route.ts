import { NextResponse } from "next/server";

import { flowLog } from "@/lib/flow-log";

export const dynamic = "force-dynamic";

export async function POST() {
  flowLog({ route: "/api/community/fetch", step: "disabled", source: "reddit", status: "skipped" });
  return NextResponse.json(
    {
      configured: false,
      items: [],
      message: "Automatic Reddit fetching is disabled. Add Reddit, X, or Indie Hackers signals manually."
    },
    { status: 410 }
  );
}
