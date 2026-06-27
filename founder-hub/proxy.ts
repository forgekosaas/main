import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getFounderHubEnv } from "@/lib/env";
import { isLocalFounderHubHost } from "@/lib/safety";

export function proxy(request: NextRequest) {
  const env = getFounderHubEnv();
  const host = request.headers.get("host");

  if (!env.allowRemote && !isLocalFounderHubHost(host)) {
    return new Response("Founder Hub is local-only.", { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
