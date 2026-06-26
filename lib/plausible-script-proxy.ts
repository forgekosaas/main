const defaultPlausibleScriptUrl = "https://plausible.io/js/pa-ujaKFMibRz2V4FE8Cum9M.js";

type CloudflareRequestInit = RequestInit & {
  cf?: {
    cacheTtl?: number;
    cacheTtlByStatus?: Record<string, number>;
    cacheEverything?: boolean;
  };
};

const plausibleScriptHeaders = {
  Accept: "application/javascript,text/javascript,*/*"
};

const cacheableScriptRequestInit = {
  headers: plausibleScriptHeaders,
  cf: {
    cacheTtlByStatus: {
      "200-299": 3600,
      "300-399": 60,
      "400-599": 0
    },
    cacheEverything: true
  }
} satisfies CloudflareRequestInit;

const retryScriptRequestInit = {
  headers: plausibleScriptHeaders,
  cf: {
    cacheTtl: 0
  }
} satisfies CloudflareRequestInit;

function buildRetryUrl(scriptUrl: string) {
  const retryUrl = new URL(scriptUrl);
  retryUrl.searchParams.set("forgeko_retry", Date.now().toString());
  return retryUrl.toString();
}

async function fetchPlausibleScript(scriptUrl: string) {
  const upstream = await fetch(scriptUrl, cacheableScriptRequestInit);

  if (upstream.ok) {
    return upstream;
  }

  return fetch(buildRetryUrl(defaultPlausibleScriptUrl), retryScriptRequestInit);
}

export async function proxyPlausibleScript() {
  const scriptUrl = process.env.PLAUSIBLE_SCRIPT_URL || defaultPlausibleScriptUrl;
  const upstream = await fetchPlausibleScript(scriptUrl);
  const isCacheable = upstream.status >= 200 && upstream.status < 300;

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("content-type") || "application/javascript; charset=utf-8",
      "Cache-Control": isCacheable ? "public, max-age=3600, stale-while-revalidate=86400" : "no-store",
      "X-Content-Type-Options": "nosniff"
    }
  });
}
