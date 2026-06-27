const umamiSendUrl = "https://cloud.umami.is/api/send";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.text();

  const response = await fetch(umamiSendUrl, {
    method: "POST",
    headers: forwardedHeaders(request),
    body
  });

  return new Response(await response.text(), {
    status: response.status,
    headers: {
      "content-type": response.headers.get("content-type") ?? "application/json"
    }
  });
}

function forwardedHeaders(request: Request) {
  const headers = new Headers();
  headers.set("content-type", request.headers.get("content-type") ?? "application/json");

  const userAgent = request.headers.get("user-agent");
  if (userAgent) {
    headers.set("user-agent", userAgent);
  }

  const forwardedFor = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    headers.set("x-forwarded-for", forwardedFor);
  }

  return headers;
}
