import { createSupabaseServiceClient } from "@/lib/supabase";
import type { WaitlistInsert } from "@/lib/waitlist";

export async function upsertWaitlist(row: WaitlistInsert) {
  const supabase = createSupabaseServiceClient();

  const { data: existing, error: selectError } = await supabase
    .from("waitlist")
    .select("id, confirmed")
    .eq("email", row.email)
    .maybeSingle();

  if (selectError) {
    throw selectError;
  }

  if (existing) {
    return { duplicate: true };
  }

  const { error } = await supabase.from("waitlist").insert(row);

  if (error) {
    if (error.code === "23505") {
      return { duplicate: true };
    }

    throw error;
  }

  return { duplicate: false };
}

export async function confirmByTokenHash(tokenHash: string) {
  const supabase = createSupabaseServiceClient();

  const { data, error } = await supabase
    .from("waitlist")
    .update({
      confirmed: true,
      confirmed_at: new Date().toISOString(),
      confirmation_token_hash: null
    })
    .eq("confirmation_token_hash", tokenHash)
    .select("id")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return { found: Boolean(data) };
}

export async function insertPageEvent({
  eventType,
  sessionId,
  metadata
}: {
  eventType: string;
  sessionId?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase.from("page_events").insert({
    event_type: eventType,
    session_id: sessionId ?? null,
    metadata: metadata ?? {}
  });

  if (error) {
    throw error;
  }
}
