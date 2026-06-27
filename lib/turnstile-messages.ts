import type { TurnstileResult } from "@/lib/turnstile";

export function messageForTurnstileCode(code: Extract<TurnstileResult, { ok: false }>["code"]) {
  if (code === "TURNSTILE_REQUIRED") {
    return "Security check did not complete. Refresh and try again.";
  }

  return "Security check failed. Try again or contact us.";
}
