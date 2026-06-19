import { hashToken } from "@/lib/crypto";

export interface ConfirmWaitlistDeps {
  confirmByTokenHash: (tokenHash: string) => Promise<{ found: boolean }>;
}

export type ConfirmWaitlistResult =
  | { ok: true; status: 200; code: "CONFIRMED" }
  | { ok: false; status: 400; code: "INVALID_TOKEN" }
  | { ok: false; status: 404; code: "TOKEN_NOT_FOUND" }
  | { ok: false; status: 500; code: "CONFIRMATION_ERROR" };

export async function confirmWaitlistSignup({
  token,
  deps
}: {
  token: string | null | undefined;
  deps: ConfirmWaitlistDeps;
}): Promise<ConfirmWaitlistResult> {
  if (!token || token.trim().length < 8) {
    return { ok: false, status: 400, code: "INVALID_TOKEN" };
  }

  try {
    const tokenHash = await hashToken(token.trim());
    const result = await deps.confirmByTokenHash(tokenHash);

    if (!result.found) {
      return { ok: false, status: 404, code: "TOKEN_NOT_FOUND" };
    }

    return { ok: true, status: 200, code: "CONFIRMED" };
  } catch {
    return { ok: false, status: 500, code: "CONFIRMATION_ERROR" };
  }
}
