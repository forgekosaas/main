import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { buildAnalyticsSummaryFromRows, type AnalyticsEventRow, type AnalyticsWaitlistRow } from "@/lib/analytics-summary";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const token = process.env.FOUNDER_HUB_ANALYTICS_TOKEN?.trim();
  const authHeader = request.headers.get("authorization") ?? "";

  if (!token || authHeader !== `Bearer ${token}`) {
    return NextResponse.json({ code: "UNAUTHORIZED" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ code: "ANALYTICS_NOT_CONFIGURED" }, { status: 503 });
  }

  const url = new URL(request.url);
  const days = Number(url.searchParams.get("days") ?? "7");
  const since = new Date(Date.now() - clampDays(days) * 24 * 60 * 60 * 1000).toISOString();
  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

  const [pageEvents, waitlist] = await Promise.all([
    supabase.from("page_events").select("event_type, session_id, metadata, created_at").gte("created_at", since).limit(10000),
    supabase.from("waitlist").select("source, confirmed, created_at").gte("created_at", since).limit(5000)
  ]);

  if (pageEvents.error) throw pageEvents.error;
  if (waitlist.error) throw waitlist.error;

  const summary = buildAnalyticsSummaryFromRows({
    days,
    pageEvents: (pageEvents.data ?? []) as AnalyticsEventRow[],
    waitlistRows: (waitlist.data ?? []) as AnalyticsWaitlistRow[]
  });

  return NextResponse.json(summary, {
    headers: {
      "Cache-Control": "no-store"
    }
  });
}

function clampDays(days: number) {
  return Math.min(90, Math.max(1, Number.isFinite(days) ? Math.round(days) : 7));
}
