const umamiScriptUrl = "https://cloud.umami.is/script.js";

export const dynamic = "force-dynamic";

export async function GET() {
  const response = await fetch(umamiScriptUrl, {
    headers: {
      accept: "application/javascript"
    }
  });

  if (!response.ok) {
    return new Response("", { status: response.status });
  }

  return new Response(await response.text(), {
    status: 200,
    headers: {
      "content-type": "application/javascript; charset=utf-8",
      "cache-control": "public, max-age=3600, stale-while-revalidate=86400"
    }
  });
}
