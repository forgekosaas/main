import { NextResponse } from "next/server";

import { getFounderHubEnv } from "@/lib/env";
import { flowLog } from "@/lib/flow-log";
import { defaultFounderHubSettings } from "@/settings/defaults";
import { diagnoseGmailReadOnly } from "@/services/gmail";

export const dynamic = "force-dynamic";

export async function GET() {
  const env = getFounderHubEnv();
  if (!env.googleClientId || !env.googleClientSecret || !env.googleRefreshToken) {
    return NextResponse.json({
      ok: false,
      stage: "configured",
      message: "Missing GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or GOOGLE_REFRESH_TOKEN."
    });
  }

  const result = await diagnoseGmailReadOnly({
    credentials: {
      clientId: env.googleClientId,
      clientSecret: env.googleClientSecret,
      refreshToken: env.googleRefreshToken
    },
    query: defaultFounderHubSettings.gmailQuery
  });

  flowLog({
    route: "/api/debug/gmail",
    step: result.stage,
    source: "gmail",
    status: result.ok ? "ok" : "error",
    detail: result.message,
    counts: { count: result.count ?? 0 }
  });

  return NextResponse.json(result, { status: result.ok ? 200 : 409 });
}
