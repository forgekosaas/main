import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const workerPath = join(".open-next", "worker.js");
const marker = "Forgeko Plausible script proxy patch";
const routeMarker =
  'url.pathname === "/p/js/script" || url.pathname === "/p/js/script.js"';

if (!existsSync(workerPath)) {
  throw new Error(`${workerPath} does not exist. Run opennextjs-cloudflare build first.`);
}

let worker = readFileSync(workerPath, "utf8");

if (!worker.includes(marker)) {
  worker = worker.replace(
    "export default {",
    `// ${marker}
const forgekoDefaultPlausibleScriptUrl = "https://plausible.io/js/pa-ujaKFMibRz2V4FE8Cum9M.js";
const forgekoPlausibleScriptHeaders = {
    Accept: "application/javascript,text/javascript,*/*",
};

function buildForgekoPlausibleRetryUrl(scriptUrl) {
    const retryUrl = new URL(scriptUrl);
    retryUrl.searchParams.set("forgeko_retry", Date.now().toString());
    return retryUrl.toString();
}

async function fetchForgekoPlausibleScript(scriptUrl) {
    const upstream = await fetch(scriptUrl, {
        headers: forgekoPlausibleScriptHeaders,
        cf: {
            cacheTtlByStatus: {
                "200-299": 3600,
                "300-399": 60,
                "400-599": 0,
            },
            cacheEverything: true,
        },
    });

    if (upstream.ok) {
        return upstream;
    }

    return fetch(buildForgekoPlausibleRetryUrl(forgekoDefaultPlausibleScriptUrl), {
        headers: forgekoPlausibleScriptHeaders,
        cf: {
            cacheTtl: 0,
        },
    });
}

async function handleForgekoPlausibleScriptRequest(env) {
    const scriptUrl = env.PLAUSIBLE_SCRIPT_URL || forgekoDefaultPlausibleScriptUrl;
    const upstream = await fetchForgekoPlausibleScript(scriptUrl);
    const isCacheable = upstream.status >= 200 && upstream.status < 300;

    return new Response(upstream.body, {
        status: upstream.status,
        headers: {
            "Content-Type": upstream.headers.get("content-type") || "application/javascript; charset=utf-8",
            "Cache-Control": isCacheable ? "public, max-age=3600, stale-while-revalidate=86400" : "no-store",
            "X-Content-Type-Options": "nosniff",
        },
    });
}

export default {`
  );
}

if (!worker.includes(routeMarker)) {
  const patchedWorker = worker.replace(
    "const url = new URL(request.url);",
    `const url = new URL(request.url);
            if (url.pathname === "/p/js/script" || url.pathname === "/p/js/script.js") {
                return handleForgekoPlausibleScriptRequest(env);
            }`
  );

  if (patchedWorker === worker) {
    throw new Error("Could not find OpenNext request URL initialization to patch.");
  }

  worker = patchedWorker;
}

writeFileSync(workerPath, worker);
console.log(`Patched ${workerPath} with Forgeko Plausible script proxy route.`);
