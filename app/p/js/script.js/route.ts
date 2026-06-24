const defaultPlausibleScriptUrl = "https://plausible.io/js/pa-ujaKFMibRz2V4FE8Cum9M.js";
type CloudflareRequestInit = RequestInit & {
  cf?: {
    cacheTtl?: number;
    cacheEverything?: boolean;
  };
};

export const dynamic = "force-dynamic";

export async function GET() {
  const scriptUrl = process.env.PLAUSIBLE_SCRIPT_URL || defaultPlausibleScriptUrl;
  const requestInit = {
    headers: {
      Accept: "application/javascript,text/javascript,*/*"
    },
    cf: {
      cacheTtl: 3600,
      cacheEverything: true
    }
  } satisfies CloudflareRequestInit;
  const upstream = await fetch(scriptUrl, requestInit);

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("content-type") || "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff"
    }
  });
}
