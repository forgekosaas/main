import { createServer } from "node:http";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { execFile } from "node:child_process";

const root = process.cwd();
const envPath = join(root, ".env.local");
const scope = "https://www.googleapis.com/auth/gmail.readonly";
const env = readEnvFile(envPath);
const redirectUri = env.GOOGLE_REDIRECT_URI || "http://127.0.0.1:3031/oauth2callback";
const redirectUrl = new URL(redirectUri);
const callbackHost = redirectUrl.hostname || "127.0.0.1";
const callbackPath = redirectUrl.pathname || "/oauth2callback";
const callbackPort = Number(redirectUrl.port || (redirectUrl.protocol === "https:" ? "443" : "80"));

if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
  console.error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in .env.local.");
  process.exit(1);
}

if (!Number.isInteger(callbackPort) || callbackPort <= 0) {
  console.error(`Invalid GOOGLE_REDIRECT_URI port: ${redirectUri}`);
  process.exit(1);
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", redirectUri);
  if (url.pathname !== callbackPath) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  const code = url.searchParams.get("code");
  if (!code) {
    response.writeHead(400, { "Content-Type": "text/plain" });
    response.end("Missing OAuth code.");
    return;
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri
      })
    });

    const tokenJson = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenJson.refresh_token) {
      throw new Error(tokenJson.error_description ?? tokenJson.error ?? `HTTP ${tokenResponse.status}`);
    }

    upsertEnvFile(envPath, "GOOGLE_REFRESH_TOKEN", tokenJson.refresh_token);
    response.writeHead(200, { "Content-Type": "text/html" });
    response.end("<h1>Gmail connected</h1><p>You can close this tab and return to Founder Hub.</p>");
    console.log("Gmail refresh token saved to .env.local.");
    server.close();
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain" });
    response.end("Gmail OAuth failed. Check the terminal.");
    console.error(`Gmail OAuth failed: ${error instanceof Error ? error.message : String(error)}`);
    console.error("");
    console.error("If this is redirect_uri_mismatch, add this exact Authorized redirect URI in Google Cloud:");
    console.error(`  ${redirectUri}`);
  }
});

server.on("error", (error) => {
  if (error && typeof error === "object" && "code" in error && error.code === "EADDRINUSE") {
    console.error(`Gmail OAuth callback port is already in use: ${callbackHost}:${callbackPort}`);
    console.error("");
    console.error("A previous gmail:auth command is probably still running.");
    console.error("Close that terminal or press Ctrl+C in it, then run npm run gmail:auth again.");
    console.error("");
    console.error("To find the process on Windows:");
    console.error(`  Get-NetTCPConnection -LocalAddress ${callbackHost} -LocalPort ${callbackPort} | Select-Object OwningProcess`);
    console.error("Then stop that PID only if you recognize it:");
    console.error("  Stop-Process -Id <PID>");
    process.exit(1);
  }

  console.error(`Gmail OAuth local server failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});

server.listen(callbackPort, callbackHost, () => {
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", env.GOOGLE_CLIENT_ID);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", scope);
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");

  console.log("Opening Google consent in your browser...");
  console.log("Do not close this terminal until the success message appears.");
  console.log("");
  console.log("If Google shows redirect_uri_mismatch, add this exact Authorized redirect URI in Google Cloud:");
  console.log(`  ${redirectUri}`);
  console.log("");
  console.log("Manual consent URL, if the browser does not open correctly:");
  console.log(authUrl.toString());
  console.log("");
  openUrl(authUrl.toString());
});

function readEnvFile(path) {
  try {
    const raw = readFileSync(path, "utf8");
    const parsed = {};
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const equals = trimmed.indexOf("=");
      if (equals === -1) continue;
      parsed[trimmed.slice(0, equals).trim()] = stripQuotes(trimmed.slice(equals + 1).trim());
    }
    return parsed;
  } catch {
    return {};
  }
}

function upsertEnvFile(path, key, value) {
  let raw = "";
  try {
    raw = readFileSync(path, "utf8");
  } catch {
    raw = "";
  }

  const line = `${key}=${value}`;
  const pattern = new RegExp(`^${key}=.*$`, "m");
  const next = pattern.test(raw)
    ? raw.replace(pattern, line)
    : `${raw}${raw.endsWith("\n") || raw.length === 0 ? "" : "\n"}${line}\n`;
  writeFileSync(path, next, "utf8");
}

function stripQuotes(value) {
  if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function openUrl(url) {
  if (process.platform === "win32") {
    execFile("rundll32.exe", ["url.dll,FileProtocolHandler", url], { windowsHide: true });
    return;
  }

  if (process.platform === "darwin") {
    execFile("open", [url]);
    return;
  }

  execFile("xdg-open", [url]);
}
