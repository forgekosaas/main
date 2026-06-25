type StreamingRequestInit = RequestInit & {
  duplex?: "half";
};

export function buildPlausibleEventRequest(request: Request, plausibleOrigin: string) {
  const upstreamUrl = new URL("/api/event", plausibleOrigin.replace(/\/+$/, ""));
  const headers = new Headers();
  const visitorIp = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for");
  const userAgent = request.headers.get("user-agent");
  const debugRequest = request.headers.get("x-debug-request");

  if (userAgent) {
    headers.set("user-agent", userAgent);
  }

  if (visitorIp) {
    headers.set("x-forwarded-for", visitorIp);
  }

  if (debugRequest) {
    headers.set("x-debug-request", debugRequest);
  }

  headers.set("content-type", request.headers.get("content-type") || "application/json");

  const init: StreamingRequestInit = {
    method: "POST",
    headers,
    body: request.body,
    duplex: "half"
  };

  return new Request(upstreamUrl, init);
}

export function buildPlausibleEventResponseHeaders(upstreamHeaders: Headers) {
  const headers = new Headers({
    "Content-Type": upstreamHeaders.get("content-type") || "application/json",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  const dropped = upstreamHeaders.get("x-plausible-dropped");

  if (dropped) {
    headers.set("x-plausible-dropped", dropped);
  }

  return headers;
}
