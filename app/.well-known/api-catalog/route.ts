import { NextResponse } from "next/server";

import { getApiCatalog, getSiteUrlFromRequest } from "@/lib/agent-discovery";

export function GET(request: Request) {
  return NextResponse.json(getApiCatalog(getSiteUrlFromRequest(request)), {
    headers: {
      "Content-Type": "application/linkset+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
}
