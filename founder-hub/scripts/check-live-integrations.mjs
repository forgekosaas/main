import { existsSync, readFileSync } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const envPath = join(root, ".env.local");
const env = { ...process.env, ...readEnvFile(envPath) };

const checks = [
  {
    id: "gemini",
    label: "Local draft engine",
    required: [],
    run: checkLocalDraftEngine
  },
  {
    id: "supabase",
    label: "Local Founder Hub cache",
    required: [],
    run: checkLocalCache
  },
  {
    id: "analytics",
    label: "Forgeko analytics summary",
    required: ["FOUNDER_HUB_ANALYTICS_TOKEN"],
    optional: true,
    run: checkForgekoAnalytics
  },
  {
    id: "hackerNews",
    label: "Hacker News public search",
    required: [],
    run: checkHackerNews
  },
  {
    id: "rssNews",
    label: "RSS news feeds",
    required: [],
    run: checkRssNews
  }
];

main().catch((error) => {
  console.error(`\nLive integration check crashed: ${safeError(error)}`);
  process.exitCode = 1;
});

async function main() {
  console.log("Founder Hub live integration check");
  console.log(`Env file: ${existsSync(envPath) ? ".env.local found" : ".env.local missing"}`);
  console.log("No secret values are printed. Public services are read-only and Founder Hub cache is local.\n");

  const results = [];
  for (const check of checks) {
    const missing = check.required.filter((name) => !hasValue(env[name]));
    if (missing.length > 0) {
      results.push({ id: check.id, ok: check.optional === true, skipped: true, label: check.label, detail: `Missing ${missing.join(", ")}` });
      continue;
    }

    try {
      const detail = await check.run();
      results.push({ id: check.id, ok: true, skipped: false, label: check.label, detail });
    } catch (error) {
      results.push({ id: check.id, ok: false, skipped: false, label: check.label, detail: safeError(error) });
    }
  }

  for (const result of results) {
    const icon = result.ok ? "PASS" : result.skipped ? "SKIP" : "FAIL";
    console.log(`${icon} ${result.label}: ${result.detail}`);
  }

  const failed = results.filter((result) => !result.ok && !result.skipped);
  const skipped = results.filter((result) => result.skipped && !result.ok);

  if (failed.length > 0) {
    process.exitCode = 1;
    return;
  }

  if (skipped.length > 0) {
    process.exitCode = 2;
    return;
  }
}

async function checkLocalDraftEngine() {
  return "Deterministic local draft engine does not require a network credential.";
}

async function checkLocalCache() {
  const localDir = join(root, ".local");
  const filePath = join(localDir, "live-check.json");
  await mkdir(localDir, { recursive: true });
  await writeFile(filePath, JSON.stringify({ ok: true }), "utf8");
  const payload = JSON.parse(await readFile(filePath, "utf8"));
  await rm(filePath, { force: true });
  if (payload.ok !== true) throw new Error("Local cache read/write did not round-trip");
  return "Local .local cache is writable and readable.";
}

async function checkForgekoAnalytics() {
  const siteUrl = env.FORGEKO_SITE_URL || "https://forgeko.com";
  const url = new URL("/api/analytics/summary", siteUrl);
  url.searchParams.set("days", "7");

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${env.FOUNDER_HUB_ANALYTICS_TOKEN}`,
      Accept: "application/json"
    }
  });

  await assertOk(response, "Forgeko analytics summary");
  return "Protected analytics summary is readable.";
}

async function checkHackerNews() {
  const url = new URL("https://hn.algolia.com/api/v1/search");
  url.searchParams.set("query", "solo founder SaaS");
  url.searchParams.set("tags", "story");
  url.searchParams.set("hitsPerPage", "1");

  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" }
  });
  await assertOk(response, "Hacker News Algolia search");
  return "Public HN search is readable.";
}

async function checkRssNews() {
  const response = await fetch("https://techcrunch.com/category/artificial-intelligence/feed/", {
    method: "GET",
    headers: { Accept: "application/rss+xml, application/xml, text/xml" }
  });
  await assertOk(response, "TechCrunch AI RSS feed");
  return "TechCrunch AI RSS feed is readable.";
}

async function assertOk(response, label) {
  if (response.ok) {
    return;
  }

  let detail = "";
  try {
    const text = await response.text();
    detail = text ? ` ${redact(text).slice(0, 500)}` : "";
  } catch {
    detail = "";
  }

  throw new Error(`${label} failed with HTTP ${response.status}.${detail}`);
}

function readEnvFile(path) {
  if (!existsSync(path)) {
    return {};
  }

  const parsed = {};
  const raw = readFileSync(path, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const equals = trimmed.indexOf("=");
    if (equals === -1) {
      continue;
    }

    const key = trimmed.slice(0, equals).trim();
    const value = stripQuotes(trimmed.slice(equals + 1).trim());
    parsed[key] = value;
  }

  return parsed;
}

function stripQuotes(value) {
  if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }

  return value;
}

function hasValue(value) {
  return Boolean(value?.trim());
}

function safeError(error) {
  const message = error instanceof Error ? error.message : String(error);
  return redact(message);
}

function redact(value) {
  let output = value;
  for (const [key, secret] of Object.entries(env)) {
    if (!key || !secret || key.startsWith("NEXT_PUBLIC_") || secret.length < 6) {
      continue;
    }
    output = output.split(secret).join("[redacted]");
  }
  return output;
}
