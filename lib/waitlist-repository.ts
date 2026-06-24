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

  if (existing?.confirmed) {
    return { status: "confirmed_duplicate" as const };
  }

  if (existing) {
    await refreshPendingWaitlistSignup(existing.id, row);
    return { status: "pending_duplicate" as const };
  }

  const { error } = await supabase.from("waitlist").insert(row);

  if (error) {
    if (error.code === "23505") {
      return upsertWaitlist(row);
    }

    throw error;
  }

  return { status: "created" as const };
}

async function refreshPendingWaitlistSignup(id: string, row: WaitlistInsert) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase
    .from("waitlist")
    .update({
      source: row.source,
      country: row.country,
      user_agent: row.user_agent,
      consent_marketing: row.consent_marketing,
      confirmation_token_hash: row.confirmation_token_hash,
      confirmation_sent_at: row.confirmation_sent_at,
      resend_message_id: null,
      metadata: row.metadata,
      updated_at: row.confirmation_sent_at
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function recordConfirmationEmailSent(email: string, messageId: string) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase
    .from("waitlist")
    .update({
      resend_message_id: messageId,
      updated_at: new Date().toISOString()
    })
    .eq("email", email);

  if (error) {
    throw error;
  }
}

export async function confirmByTokenHash(tokenHash: string) {
  const supabase = createSupabaseServiceClient();

  const { data, error } = await supabase
    .from("waitlist")
    .update({
      confirmed: true,
      confirmed_at: new Date().toISOString(),
      confirmation_token_hash: null,
      updated_at: new Date().toISOString()
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
