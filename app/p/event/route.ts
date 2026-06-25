import { buildPlausibleEventRequest, buildPlausibleEventResponseHeaders } from "@/lib/plausible-proxy";

const defaultPlausibleOrigin = "https://plausible.io";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const plausibleOrigin = (process.env.PLAUSIBLE_ORIGIN || defaultPlausibleOrigin).replace(/\/+$/, "");
  const upstreamRequest = buildPlausibleEventRequest(request, plausibleOrigin);

  const upstream = await fetch(upstreamRequest);

  return new Response(upstream.body, {
    status: upstream.status,
    headers: buildPlausibleEventResponseHeaders(upstream.headers)
  });
}
