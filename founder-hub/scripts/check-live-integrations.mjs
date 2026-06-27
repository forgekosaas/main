import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const envPath = join(root, ".env.local");
const env = { ...process.env, ...readEnvFile(envPath) };

const founderHubTables = [
  "founder_hub_sources",
  "founder_hub_community_items",
  "founder_hub_emails",
  "founder_hub_analytics_snapshots",
  "founder_hub_insights",
  "founder_hub_memory",
  "founder_hub_settings"
];

const checks = [
  {
    id: "gemini",
    label: "Gemini gemini-3.5-flash",
    required: ["GEMINI_API"],
    run: checkGemini
  },
  {
    id: "supabase",
    label: "Supabase Founder Hub schema",
    required: ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"],
    run: checkSupabase
  },
  {
    id: "analytics",
    label: "Forgeko analytics summary",
    required: ["FOUNDER_HUB_ANALYTICS_TOKEN"],
    run: checkForgekoAnalytics
  },
  {
    id: "reddit",
    label: "Reddit read-only listing",
    required: ["REDDIT_CLIENT_ID", "REDDIT_CLIENT_SECRET"],
    run: checkReddit
  },
  {
    id: "gmail",
    label: "Gmail read-only messages",
    required: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN"],
    run: checkGmail
  },
  {
    id: "hackerNews",
    label: "Hacker News public search",
    required: [],
    run: checkHackerNews
  }
];

main().catch((error) => {
  console.error(`\nLive integration check crashed: ${safeError(error)}`);
  process.exitCode = 1;
});

async function main() {
  console.log("Founder Hub live integration check");
  console.log(`Env file: ${existsSync(envPath) ? ".env.local found" : ".env.local missing"}`);
  console.log("No secret values are printed. External services are read-only except the AI analysis call.\n");

  const results = [];
  for (const check of checks) {
    const missing = check.required.filter((name) => !hasValue(env[name]));
    if (missing.length > 0) {
      results.push({ id: check.id, ok: false, skipped: true, label: check.label, detail: `Missing ${missing.join(", ")}` });
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
  const skipped = results.filter((result) => result.skipped);

  if (failed.length > 0) {
    process.exitCode = 1;
    return;
  }

  if (skipped.length > 0) {
    process.exitCode = 2;
    return;
  }
}

async function checkGemini() {
  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
    method: "POST",
    headers: {
      "x-goog-api-key": env.GEMINI_API,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gemini-3.5-flash",
      system_instruction: "Return JSON only.",
      input: "{\"ok\":true,\"service\":\"gemini\"}",
      generation_config: {
        thinking_level: "low",
        temperature: 0.2
      },
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: { type: "object" }
      }
    })
  });

  await assertOk(response, "Gemini Interactions API");
  return "Interactions API accepted a minimal JSON analysis request.";
}

async function checkSupabase() {
  for (const table of founderHubTables) {
    const url = new URL(`/rest/v1/${table}`, env.SUPABASE_URL);
    url.searchParams.set("select", "id");
    url.searchParams.set("limit", "1");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        Accept: "application/json"
      }
    });

    await assertOk(response, `Supabase table ${table}`);
  }

  return `${founderHubTables.length} Founder Hub tables are readable.`;
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

async function checkReddit() {
  const tokenResponse = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${env.REDDIT_CLIENT_ID}:${env.REDDIT_CLIENT_SECRET}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "ForgekoFounderHub/0.1 read-only smoke test"
    },
    body: new URLSearchParams({ grant_type: "client_credentials" })
  });
  await assertOk(tokenResponse, "Reddit client credentials token");

  const tokenJson = await tokenResponse.json();
  if (!tokenJson.access_token) {
    throw new Error("Reddit token response did not include access_token");
  }

  const listingResponse = await fetch("https://oauth.reddit.com/r/SaaS/new?limit=1", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokenJson.access_token}`,
      "User-Agent": "ForgekoFounderHub/0.1 read-only smoke test",
      Accept: "application/json"
    }
  });
  await assertOk(listingResponse, "Reddit r/SaaS listing");
  return "OAuth works and r/SaaS listing is readable.";
}

async function checkGmail() {
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      refresh_token: env.GOOGLE_REFRESH_TOKEN,
      grant_type: "refresh_token"
    })
  });
  await assertOk(tokenResponse, "Google OAuth refresh");

  const tokenJson = await tokenResponse.json();
  if (!tokenJson.access_token) {
    throw new Error("Google token response did not include access_token");
  }

  const url = new URL("https://gmail.googleapis.com/gmail/v1/users/me/messages");
  url.searchParams.set("q", "from:hello@info.forgeko.com newer_than:30d");
  url.searchParams.set("maxResults", "1");

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokenJson.access_token}`,
      Accept: "application/json"
    }
  });
  await assertOk(response, "Gmail messages list");
  return "Gmail messages list is readable with the configured query.";
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
