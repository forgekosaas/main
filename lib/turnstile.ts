const turnstileSiteverifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type TurnstileResult =
  | { ok: true; skipped: boolean }
  | { ok: false; code: "TURNSTILE_REQUIRED" | "TURNSTILE_FAILED" };

export type TurnstileDiagnostic = {
  status: number;
  success: boolean;
  errorCodes: string[];
  hasToken: boolean;
};

export async function verifyTurnstileToken({
  token,
  secretKey,
  remoteIp,
  fetchImpl = fetch,
  logDiagnostic = defaultTurnstileDiagnosticLogger
}: {
  token?: string;
  secretKey?: string;
  remoteIp?: string | null;
  fetchImpl?: typeof fetch;
  logDiagnostic?: (diagnostic: TurnstileDiagnostic) => void;
}): Promise<TurnstileResult> {
  if (!secretKey) {
    return { ok: true, skipped: true };
  }

  if (!token?.trim()) {
    return { ok: false, code: "TURNSTILE_REQUIRED" };
  }

  const body = new FormData();
  body.set("secret", secretKey);
  body.set("response", token);

  if (remoteIp) {
    body.set("remoteip", remoteIp);
  }

  const response = await fetchImpl(turnstileSiteverifyUrl, {
    method: "POST",
    body
  });
  const result = (await response.json().catch(() => null)) as { success?: boolean; "error-codes"?: string[] } | null;

  if (!response.ok || result?.success !== true) {
    logDiagnostic({
      status: response.status,
      success: result?.success === true,
      errorCodes: Array.isArray(result?.["error-codes"]) ? result["error-codes"] : [],
      hasToken: Boolean(token?.trim())
    });
    return { ok: false, code: "TURNSTILE_FAILED" };
  }

  return { ok: true, skipped: false };
}

function defaultTurnstileDiagnosticLogger(diagnostic: TurnstileDiagnostic) {
  console.warn("Turnstile verification failed", diagnostic);
}
