import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

import { confirmWaitlistSignup } from "@/lib/confirm";
import { insertPageEvent, confirmByTokenHash } from "@/lib/waitlist-repository";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const result = await confirmWaitlistSignup({
    token,
    deps: { confirmByTokenHash }
  });

  if (result.ok) {
    await insertPageEvent({
      eventType: "Waitlist_Confirmed",
      metadata: { source: "email" }
    }).catch(() => undefined);
    redirect("/waitlist/confirmed");
  }

  return NextResponse.redirect(new URL(`/waitlist/confirmed?status=${result.code}`, request.url));
}
