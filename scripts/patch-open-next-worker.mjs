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

async function handleForgekoPlausibleScriptRequest(env) {
    const scriptUrl = env.PLAUSIBLE_SCRIPT_URL || forgekoDefaultPlausibleScriptUrl;
    const upstream = await fetch(scriptUrl, {
        headers: {
            Accept: "application/javascript,text/javascript,*/*",
        },
        cf: {
            cacheTtl: 3600,
            cacheEverything: true,
        },
    });

    return new Response(upstream.body, {
        status: upstream.status,
        headers: {
            "Content-Type": upstream.headers.get("content-type") || "application/javascript; charset=utf-8",
            "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
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
