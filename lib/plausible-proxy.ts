type StreamingRequestInit = RequestInit & {
  duplex?: "half";
};

export function buildPlausibleEventRequest(request: Request, plausibleOrigin: string) {
  const upstreamUrl = new URL("/api/event", plausibleOrigin.replace(/\/+$/, ""));
  const headers = new Headers(request.headers);
  const visitorIp = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for");

  headers.delete("cookie");
  headers.delete("host");

  if (visitorIp) {
    headers.set("x-forwarded-for", visitorIp);
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
