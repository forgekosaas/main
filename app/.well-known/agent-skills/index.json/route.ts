import { NextResponse } from "next/server";

import { getAgentSkillsIndex, getSiteUrlFromRequest } from "@/lib/agent-discovery";

export function GET(request: Request) {
  return NextResponse.json(getAgentSkillsIndex(getSiteUrlFromRequest(request)), {
    headers: {
      "Cache-Control": "public, max-age=3600"
    }
  });
}
