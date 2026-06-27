import type { FeedbackEmail } from "@/types/founder-hub";

type Fetcher = (url: string, init?: RequestInit) => Promise<Response>;

export interface GmailCredentials {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

export interface GmailDiagnosticResult {
  ok: boolean;
  stage: "configured" | "token" | "list";
  message: string;
  count?: number;
}

interface GmailMessageList {
  messages?: Array<{ id: string }>;
}

interface GmailMessage {
  id: string;
  snippet?: string;
  internalDate?: string;
  payload?: {
    headers?: Array<{ name: string; value: string }>;
    body?: { data?: string };
    parts?: Array<{ mimeType?: string; body?: { data?: string } }>;
  };
}

export async function fetchFounderHubEmails({
  credentials,
  query,
  fetcher = fetch
}: {
  credentials: GmailCredentials;
  query: string;
  fetcher?: Fetcher;
}): Promise<FeedbackEmail[]> {
  const accessToken = await getGmailReadOnlyAccessToken(credentials, fetcher);
  const listUrl = new URL("https://gmail.googleapis.com/gmail/v1/users/me/messages");
  listUrl.searchParams.set("q", query);
  listUrl.searchParams.set("maxResults", "20");

  const listResponse = await fetcher(listUrl.toString(), {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" }
  });

  if (!listResponse.ok) {
    throw new Error("Gmail list request failed");
  }

  const list = (await listResponse.json()) as GmailMessageList;
  const emails: FeedbackEmail[] = [];

  for (const messageRef of list.messages ?? []) {
    const messageUrl = new URL(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageRef.id}`);
    messageUrl.searchParams.set("format", "full");
    const messageResponse = await fetcher(messageUrl.toString(), {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" }
    });

    if (!messageResponse.ok) {
      continue;
    }

    emails.push(toFeedbackEmail((await messageResponse.json()) as GmailMessage));
  }

  return emails;
}

export async function diagnoseGmailReadOnly({
  credentials,
  query,
  fetcher = fetch
}: {
  credentials: GmailCredentials;
  query: string;
  fetcher?: Fetcher;
}): Promise<GmailDiagnosticResult> {
  try {
    const accessToken = await getGmailReadOnlyAccessToken(credentials, fetcher);
    const listUrl = new URL("https://gmail.googleapis.com/gmail/v1/users/me/messages");
    listUrl.searchParams.set("q", query);
    listUrl.searchParams.set("maxResults", "1");

    const listResponse = await fetcher(listUrl.toString(), {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" }
    });

    if (!listResponse.ok) {
      return {
        ok: false,
        stage: "list",
        message: await gmailFailureMessage(listResponse, "Gmail message list failed")
      };
    }

    const list = (await listResponse.json()) as GmailMessageList;
    return {
      ok: true,
      stage: "list",
      message: "Gmail read-only token works and the configured query is readable.",
      count: list.messages?.length ?? 0
    };
  } catch (error) {
    return {
      ok: false,
      stage: "token",
      message: error instanceof Error ? error.message : String(error)
    };
  }
}

export function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(normalized, "base64").toString("utf8");
}

function toFeedbackEmail(message: GmailMessage): FeedbackEmail {
  const headers = message.payload?.headers ?? [];
  const subject = headerValue(headers, "subject") || "(No subject)";
  const from = headerValue(headers, "from") || "unknown";
  const body = extractMessageBody(message);

  return {
    id: `gmail_${message.id}`,
    from,
    subject,
    snippet: message.snippet || body.slice(0, 180),
    category: inferCategory(`${subject} ${body}`),
    summary: body ? body.slice(0, 240) : message.snippet ?? "No body available.",
    painPoint: inferPainPoint(`${subject} ${body}`),
    createdAt: message.internalDate ? new Date(Number(message.internalDate)).toISOString() : new Date().toISOString()
  };
}

async function getGmailReadOnlyAccessToken(credentials: GmailCredentials, fetcher: Fetcher) {
  const body = new URLSearchParams({
    client_id: credentials.clientId,
    client_secret: credentials.clientSecret,
    refresh_token: credentials.refreshToken,
    grant_type: "refresh_token"
  });

  const response = await fetcher("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });

  if (!response.ok) {
    throw new Error(await gmailFailureMessage(response, "Gmail token refresh failed"));
  }

  const json = (await response.json()) as { access_token?: string };
  if (!json.access_token) {
    throw new Error("Gmail token response did not include an access token");
  }

  return json.access_token;
}

async function gmailFailureMessage(response: Response, fallback: string) {
  try {
    const payload = (await response.json()) as { error?: string; error_description?: string };
    const parts = [payload.error, payload.error_description].filter(Boolean);
    return parts.length > 0 ? `${fallback}: ${parts.join(" - ")}` : `${fallback}: HTTP ${response.status}`;
  } catch {
    return `${fallback}: HTTP ${response.status}`;
  }
}

function headerValue(headers: Array<{ name: string; value: string }>, name: string) {
  return headers.find((header) => header.name.toLowerCase() === name)?.value;
}

function extractMessageBody(message: GmailMessage) {
  const directBody = message.payload?.body?.data;
  if (directBody) {
    return decodeBase64Url(directBody);
  }

  const textPart = message.payload?.parts?.find((part) => part.mimeType === "text/plain" && part.body?.data);
  return textPart?.body?.data ? decodeBase64Url(textPart.body.data) : message.snippet ?? "";
}

function inferCategory(text: string): FeedbackEmail["category"] {
  const lower = text.toLowerCase();
  if (lower.includes("bug") || lower.includes("broken")) return "Bug";
  if (lower.includes("feature") || lower.includes("roadmap")) return "Feature Request";
  if (lower.includes("waitlist") || lower.includes("beta")) return "Waitlist";
  if (lower.includes("feedback")) return "Feedback";
  return "Altro";
}

function inferPainPoint(text: string) {
  const lower = text.toLowerCase();
  if (lower.includes("roadmap")) return "roadmap uncertainty";
  if (lower.includes("validate") || lower.includes("validation")) return "validation uncertainty";
  if (lower.includes("launch")) return "launch planning";
  if (lower.includes("analytics")) return "growth measurement";
  return "unclear founder workflow";
}
