import { NextResponse } from "next/server";

import { getOpenApiDocument, getSiteUrlFromRequest } from "@/lib/agent-discovery";

export function GET(request: Request) {
  return NextResponse.json(getOpenApiDocument(getSiteUrlFromRequest(request)), {
    headers: {
      "Content-Type": "application/openapi+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
}
