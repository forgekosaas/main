const turnstileSiteverifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type TurnstileResult =
  | { ok: true; skipped: boolean }
  | { ok: false; code: "TURNSTILE_REQUIRED" | "TURNSTILE_FAILED" };

export async function verifyTurnstileToken({
  token,
  secretKey,
  remoteIp,
  fetchImpl = fetch
}: {
  token?: string;
  secretKey?: string;
  remoteIp?: string | null;
  fetchImpl?: typeof fetch;
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
  const result = (await response.json().catch(() => null)) as { success?: boolean } | null;

  if (!response.ok || result?.success !== true) {
    return { ok: false, code: "TURNSTILE_FAILED" };
  }

  return { ok: true, skipped: false };
}
